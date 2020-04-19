import { Client } from "ldap-ts-client";
import type { Logger, SearchEntryObject } from "../typings/general/types";

interface GetSchemaAttributesFnInput {
  schemaDn: string;
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}
export interface SchemaAttribute
  extends Pick<SearchEntryObject, "dn" | "controls"> {
  cn: string;
  attributeID: string;
  attributeSyntax: string;
  /** string value of TRUE / FALSE */
  isSingleValued: string;
  /** string value of TRUE / FALSE */
  showInAdvancedViewOnly: string;
  adminDisplayName: string;
  adminDescription: string;
  oMSyntax: string | string[];
  lDAPDisplayName: string;
  systemOnly: string;
  systemFlags: string | string[];
  objectCategory: string | string[];
}

type GetSchemaAttributesFnOutput = Promise<Partial<SchemaAttribute>[]>;
/** get defined an attribute objects in the schema. */
export async function getSchemaAttributes({
  schemaDn,
  options,
}: GetSchemaAttributesFnInput): GetSchemaAttributesFnOutput {
  options.logger?.trace("getSchemaAttributes()");
  const client = new Client({
    user: options.user,
    pass: options.pass,
    ldapServerUrl: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const objectAttributes = await client.queryAttributes<SchemaAttribute>({
    attributes: [
      "cn",
      "attributeID",
      "attributeSyntax",
      "isSingleValued",
      "showInAdvancedViewOnly",
      "adminDisplayName",
      "adminDescription",
      "oMSyntax",
      "lDAPDisplayName",
      "systemOnly",
      "systemFlags",
      "objectCategory",
    ],
    options: {
      sizeLimit: 200,
      paged: true,
      filter: "&(objectClass=attributeSchema)",
      scope: "one",
    },
  });

  client.unbind();

  return objectAttributes;
}
