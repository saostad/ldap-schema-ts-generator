import type { Client } from "ldap-ts-client";
import type {
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
  Logger,
} from "../typings/general/types";
import { QueryGenerator } from "ldap-query-generator";
import { getSchemaNamingContext } from "./naming-context";

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

type GetSchemaClassesFnInput = {
  client: Client;
  options?: { logger?: Logger };
};
/** get defined classSchema Objects in schema */
export async function getSchemaClasses({
  client,
  options,
}: GetSchemaClassesFnInput): Promise<Partial<SchemaClass>[]> {
  options?.logger?.trace("getSchemaClasses()");

  const schemaDn = await getSchemaNamingContext({
    client,
    options: { logger: options?.logger },
  });

  const objectClasses = await client.queryAttributes<SchemaClass>({
    base: schemaDn,
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
  return objectClasses;
}

type GetStructuralSchemaClassesFnInput = {
  client: Client;
  options?: { logger?: Logger };
};
/** get defined classSchema Objects in schema where objectClassCategory=1 */
export async function getStructuralSchemaClasses({
  client,
  options,
}: GetStructuralSchemaClassesFnInput): Promise<Partial<SchemaClass>[]> {
  options?.logger?.trace("getSchemaClasses()");

  const schemaDn = await getSchemaNamingContext({
    client,
    options: { logger: options?.logger },
  });

  const objectClasses = await client.queryAttributes<SchemaClass>({
    base: schemaDn,
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
  return objectClasses;
}

type GetSchemaClassByLdapNameFnInput = {
  client: Client;
  ldapName: string;
  options?: { logger?: Logger };
};
export async function getSchemaClassByLdapName({
  options,
  client,
  ldapName,
}: GetSchemaClassByLdapNameFnInput): Promise<Partial<SchemaClass>[]> {
  options?.logger?.trace("getSchemaClassByLdapName()");

  const schemaDn = await getSchemaNamingContext({
    client,
    options: { logger: options?.logger },
  });

  const qGen = new QueryGenerator<SchemaClass>({
    logger: options?.logger,
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
    base: schemaDn,
    attributes: query.attributes,
    options: {
      sizeLimit: 200,
      paged: true,
      filter: query.toString(),
      scope: "one",
    },
  });
  return objectClass;
}
