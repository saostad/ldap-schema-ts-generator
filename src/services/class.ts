import { Client, IClientConfig } from "ldap-ts-client";
import {
  SearchEntryObject,
  ObjectClass,
  CN,
  InstanceType,
  SubClassOf,
  AuxiliaryClass,
  SystemAuxiliaryClass,
  GovernsID,
  RDnAttId,
  ShowInAdvancedViewOnly,
  AdminDisplayName,
  AdminDescription,
  ObjectClassCategory,
  LDAPDisplayName,
  Name,
  SystemOnly,
  SystemPossSuperiors,
  SystemMayContain,
  SystemMustContain,
  SystemFlags,
  DefaultHidingValue,
  ObjectCategory,
  DefaultObjectCategory,
  MustContain,
  MayContain,
  PossSuperiors,
} from "../typings/general/types";
import { QueryGenerator } from "ldap-query-generator";

export interface SchemaClass
  extends Pick<SearchEntryObject, "dn" | "controls"> {
  objectClass: ObjectClass;
  cn: CN;
  instanceType: InstanceType;
  subClassOf: SubClassOf;
  auxiliaryClass?: AuxiliaryClass;
  systemAuxiliaryClass?: SystemAuxiliaryClass;
  governsID: GovernsID;
  rDNAttID: RDnAttId;
  showInAdvancedViewOnly: ShowInAdvancedViewOnly;
  adminDisplayName: AdminDisplayName;
  adminDescription: AdminDescription;
  objectClassCategory: ObjectClassCategory;
  lDAPDisplayName: LDAPDisplayName;
  name: Name;
  systemOnly: SystemOnly;
  systemMayContain: SystemMayContain;
  systemMustContain: SystemMustContain;
  systemFlags: SystemFlags;
  defaultHidingValue: DefaultHidingValue;
  objectCategory: ObjectCategory;
  defaultObjectCategory: DefaultObjectCategory;
  mustContain: MustContain;
  mayContain: MayContain;
  possSuperiors: PossSuperiors;
  systemPossSuperiors: SystemPossSuperiors;
}

interface GetSchemaClassesFnInput {
  schemaDn: string;
  options: Omit<IClientConfig, "baseDN">;
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

interface GetSchemaClassesFnInput {
  schemaDn: string;
  options: Omit<IClientConfig, "baseDN">;
}
/** get defined classSchema Objects in schema where objectClassCategory=1 */
export async function getStructuralSchemaClasses({
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
      filter: "(&(objectClass=classSchema)(objectClassCategory=1))",
      scope: "one",
    },
  });
  client.unbind();
  return objectClasses;
}

interface GetSchemaClassByLdapNameFnInput {
  schemaDn: string;
  ldapName: string;
  options: Omit<IClientConfig, "baseDN">;
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
