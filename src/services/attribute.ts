import { Client, IClientConfig } from "ldap-ts-client";
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
} from "../typings/general/types";

interface GetSchemaAttributesFnInput {
  schemaDn: string;
  options: Omit<IClientConfig, "baseDN">;
}
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
