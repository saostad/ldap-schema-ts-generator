import { Client } from "ldap-ts-client";
import { Logger } from "../typings/general/types";
import { SearchEntryObject } from "ldapjs";

interface GetSchemaClassesFnInput {
  schemaDn: string;
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}
export interface SchemaClass
  extends Pick<SearchEntryObject, "dn" | "controls"> {
  objectClass: string | string[];
  cn: string;
  instanceType: string | string[];
  subClassOf: string;
  auxiliaryClass?: string | string[];
  systemAuxiliaryClass?: string | string[];
  governsID: string | string[];
  rDNAttID: string | string[];
  /** string value of TRUE / FALSE */
  showInAdvancedViewOnly: string;
  adminDisplayName: string;
  adminDescription: string;
  objectClassCategory: string | string[];
  lDAPDisplayName: string;
  name: string;
  /** string value of TRUE / FALSE */
  systemOnly: string;
  systemPossSuperiors: string | string[];
  /** list of direct optional and readonly properties */
  systemMayContain: string | string[];
  /** list of direct required and readonly properties */
  systemMustContain: string | string[];
  systemFlags: string | string[];
  defaultHidingValue: string | string[];
  objectCategory: string | string[];
  defaultObjectCategory: string | string[];
  /** list of direct required and editable properties */
  mustContain: string | string[];
  /** list of direct optional and editable properties */
  mayContain: string | string[];
  possSuperiors: string | string[];
}

// TODO: remove Partial after we make sure we know which fields are always available
type GetSchemaClassesFnOutput = Promise<Partial<SchemaClass>[]>;
/** get defined classSchema Objects in schema */
export async function getSchemaClasses({
  schemaDn,
  options,
}: GetSchemaClassesFnInput): GetSchemaClassesFnOutput {
  options.logger?.trace("getSchemaClasses()");
  const client = new Client({
    user: options.user,
    pass: options.pass,
    ldapServerUrl: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const objectClasses = await client.queryAttributes({
    attributes: [
      "objectClass",
      "cn",
      "instanceType",
      "subClassOf",
      "auxiliaryClass",
      "systemAuxiliaryClass",
      "governsID",
      "rDNAttID",
      "showInAdvancedViewOnly",
      "adminDisplayName",
      "adminDescription",
      "objectClassCategory",
      "lDAPDisplayName",
      "name",
      "systemOnly",
      "systemPossSuperiors",
      "systemMayContain",
      "systemMustContain",
      "systemFlags",
      "defaultHidingValue",
      "objectCategory",
      "defaultObjectCategory",
      "mustContain",
      "mayContain",
      "possSuperiors",
    ],
    options: {
      sizeLimit: 200,
      paged: true,
      filter: "&(objectClass=classSchema)",
      scope: "one",
    },
  });
  client.unbind();
  return objectClasses;
}
