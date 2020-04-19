import { Client } from "ldap-ts-client";
import { Logger, SearchEntryObject } from "../typings/general/types";
import { QueryGenerator } from "ldap-query-generator";

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

interface GetSchemaClassesFnInput {
  schemaDn: string;
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}
/** get defined classSchema Objects in schema */
export async function getSchemaClasses({
  schemaDn,
  options,
}: GetSchemaClassesFnInput): Promise<Partial<SchemaClass>[]> {
  options.logger?.trace("getSchemaClasses()");
  const client = new Client({
    user: options.user,
    pass: options.pass,
    ldapServerUrl: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const objectClasses = await client.queryAttributes<SchemaClass>({
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

interface GetSchemaClassByLdapNameFnInput {
  schemaDn: string;
  ldapName: string;
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}
export async function getSchemaClassByLdapName({
  options,
  schemaDn,
  ldapName,
}: GetSchemaClassByLdapNameFnInput): Promise<Partial<SchemaClass>[]> {
  options.logger?.trace("getSchemaClassByLdapName()");
  const client = new Client({
    user: options.user,
    pass: options.pass,
    ldapServerUrl: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
  });

  const qGen = new QueryGenerator<SchemaClass>({
    logger: options.logger,
  });

  const { query } = qGen
    .select([
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
    ])
    .where({ field: "objectClass", action: "equal", criteria: "classSchema" })
    .whereAnd({
      field: "lDAPDisplayName",
      action: "equal",
      criteria: ldapName,
    });

  const objectClass = await client.queryAttributes<SchemaClass>({
    attributes: query.attributes,
    options: {
      sizeLimit: 200,
      paged: true,
      filter: query.toString(),
      scope: "one",
    },
  });
  client.unbind();
  return objectClass;
}
