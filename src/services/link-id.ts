import { AdClient } from "node-ad-ldap";
import { Logger } from "../typings/general/types";
import { SearchEntryObject } from "ldapjs";

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
   * - Even Attribute Value are forward links
   * - Odd Attribute Value are BackLinks equals to the LinkID of the corresponding forward link LinkID plus one.
   * - Attribute Value of 0 or not present implies it is NOT a Linked Attribute
   */
  linkID: number;
}

/** get Attributes defined in schema which has linkID
 * - LinkID is a Number specified in AttributeSchema for Microsoft Active Directory which indicated a Linked Attribute
 */
export async function getLinkIds({
  schemaDn,
  options,
}: GetSchemaAttributesFnInput): Promise<SchemaLinkAttribute[]> {
  options.logger?.trace("getLinkIds()");
  const adClient = new AdClient({
    bindDN: options.user,
    secret: options.pass,
    url: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const objectAttributes = await adClient.queryAttributes({
    options: {
      sizeLimit: 1000,
      paged: false,
      filter: "(&(objectClass=attributeSchema)(LinkID=*))",
      scope: "one",
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
    },
  });
  adClient.unbind();

  const linkIds = (objectAttributes as unknown) as SchemaLinkAttribute[];

  /** sort the result base on linkID field */
  linkIds.sort((a, b) => Number(a.linkID) - Number(b.linkID));

  return linkIds;
}
