import type { Client } from "ldap-ts-client";
import type {
  SearchEntryObject,
  CN,
  AttributeID,
  AttributeSyntax,
  IsSingleValued,
  ShowInAdvancedViewOnly,
  AdminDisplayName,
  AdminDescription,
  OMSyntax,
  LDAPDisplayName,
  SystemOnly,
  SystemFlags,
  ObjectCategory,
  Logger,
} from "../typings/general/types";
import { getSchemaNamingContext } from "./naming-context";

type GetSchemaAttributesFnInput = {
  client: Client;
  options?: { logger?: Logger };
};
export interface SchemaAttribute
  extends Pick<SearchEntryObject, "dn" | "controls"> {
  cn: CN;
  attributeID: AttributeID;
  attributeSyntax: AttributeSyntax;
  isSingleValued: IsSingleValued;
  showInAdvancedViewOnly: ShowInAdvancedViewOnly;
  adminDisplayName: AdminDisplayName;
  adminDescription: AdminDescription;
  oMSyntax: OMSyntax;
  lDAPDisplayName: LDAPDisplayName;
  systemOnly: SystemOnly;
  systemFlags: SystemFlags;
  objectCategory: ObjectCategory;
}

/** get defined an attribute objects in the schema. */
export async function getSchemaAttributes({
  client,
  options,
}: GetSchemaAttributesFnInput): Promise<Partial<SchemaAttribute>[]> {
  options?.logger?.trace("getSchemaAttributes()");

  const schemaDn = await getSchemaNamingContext({
    client,
    options: { logger: options?.logger },
  });

  const objectAttributes = await client.queryAttributes<SchemaAttribute>({
    base: schemaDn,
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

  return objectAttributes;
}
