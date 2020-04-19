import { Client } from "ldap-ts-client";
import type { Logger, SearchEntryObject } from "../typings/general/types";
import { isOdd } from "../helpers/utils";
import { writeLog } from "fast-node-logger";

interface GetSchemaAttributesFnInput {
  schemaDn: string;
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}
export interface SchemaLinkAttribute
  extends Pick<SearchEntryObject, "dn" | "controls"> {
  cn: string;
  attributeID: string;
  attributeSyntax: string;
  /** string value of TRUE / FALSE */
  isSingleValued: string;
  adminDisplayName: string;
  adminDescription: string;
  lDAPDisplayName: string;
  systemOnly: string;
  /** Defines Relation between attributes
   * - Even linkID Value are forward links
   * - Odd linkID Value are BackLinks equals to the linkID of the corresponding forward link linkID plus one.
   * - linkID Value of 0 or not present implies it is NOT a Linked Attribute
   */
  linkID: string;
}

/** get Attributes defined in schema which has linkID
 * - LinkID is a Number specified in AttributeSchema for Microsoft Active Directory which indicated a Linked Attribute
 */
export async function getLinkIds({
  schemaDn,
  options,
}: GetSchemaAttributesFnInput): Promise<SchemaLinkAttribute[]> {
  options.logger?.trace("getLinkIds()");
  const client = new Client({
    ...options,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const objectAttributes = await client.queryAttributes({
    attributes: [
      "cn",
      "attributeID",
      "attributeSyntax",
      "isSingleValued",
      "adminDisplayName",
      "adminDescription",
      "lDAPDisplayName",
      "systemOnly",
      "LinkID",
    ],
    options: {
      sizeLimit: 1000,
      paged: false,
      filter: "(&(objectClass=attributeSchema)(LinkID=*))",
      scope: "one",
    },
  });
  client.unbind();

  const linkIds = (objectAttributes as unknown) as SchemaLinkAttribute[];

  /** sort the result base on linkID field */
  linkIds.sort((a, b) => Number(a.linkID) - Number(b.linkID));

  return linkIds;
}

export interface Relation {
  [ldapName: string]: {
    isBackLink: boolean;
    /** Back Link Attribute LDAP Name (readonly) */
    backLink: string;
    /** Back Link Attribute Distinguished Name */
    backLinkDn: string;
    /** Back Link ID */
    backLinkId: number;
    /** Forward Link Attribute LDAP Name (writable) */
    forwardLink: string;
    /** Forward Link Attribute Distinguished Name */
    forwardLinkDn: string;
    /** Forward Link ID */
    forwardLinkId: number;
    /** boolean flag that shows attribute back link */
  };
}

/** process linkIds
 * @return array of relations
 */
export function getRelations(linkIds: SchemaLinkAttribute[]): Relation[] {
  const relations: Relation[] = [];

  linkIds.forEach((el) => {
    const isBackLink = isOdd(Number(el.linkID));

    /** find other side of relationship base on LinkID
     * - Even linkID Value are forward links
     * - Odd linkID Value are BackLinks equals to the linkID of the corresponding forward link linkID plus one.
     * - linkID Value of 0 or not present implies it is NOT a Linked Attribute
     */
    const otherSideOfRelation = linkIds.find((linkItem) => {
      let otherSideOfRelationId;
      if (isBackLink) {
        otherSideOfRelationId = Number(el.linkID) - 1;
      } else {
        otherSideOfRelationId = Number(el.linkID) + 1;
      }
      return linkItem.linkID === String(otherSideOfRelationId);
    });
    if (!otherSideOfRelation) {
      writeLog(
        `relation for ${el.lDAPDisplayName} linkID ${el.linkID} not found!`,
        {
          level: "warn",
          stdout: true,
        },
      );
      /** ignore this relation */
      return;
    }

    relations.push({
      [el.lDAPDisplayName]: {
        isBackLink,
        backLink: el.lDAPDisplayName,
        backLinkDn: el.dn,
        backLinkId: Number(el.linkID),
        forwardLink: otherSideOfRelation.lDAPDisplayName,
        forwardLinkDn: otherSideOfRelation.dn,
        forwardLinkId: Number(otherSideOfRelation.linkID),
      },
    });
  });

  return relations;
}
