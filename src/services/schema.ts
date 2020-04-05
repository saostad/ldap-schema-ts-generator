import { AdClient } from "node-ad-ldap";
import { Logger } from "../typings/general/types";
import { SearchEntryObject } from "ldapjs";

interface GetSchemaClassesFnInput {
  schemaDn: string;
  logger?: Logger;
}
export interface SchemaClass extends SearchEntryObject {
  objectClass: string | string[];
  cn: string | string[];
  instanceType: string | string[];
  subClassOf: string | string[];
  governsID: string | string[];
  rDNAttID: string | string[];
  showInAdvancedViewOnly: string | string[];
  adminDisplayName: string | string[];
  adminDescription: string | string[];
  objectClassCategory: string | string[];
  lDAPDisplayName: string | string[];
  name: string | string[];
  systemOnly: string | string[];
  systemPossSuperiors: string | string[];
  systemMayContain: string | string[];
  systemMustContain: string | string[];
  systemFlags: string | string[];
  defaultHidingValue: string | string[];
  objectCategory: string | string[];
  defaultObjectCategory: string | string[];
  mustContain: string | string[];
  mayContain: string | string[];
  possSuperiors: string | string[];
}

export async function getSchemaClasses({
  schemaDn,
  logger,
}: GetSchemaClassesFnInput): Promise<Partial<SchemaClass>[]> {
  logger?.trace("getSchemaClasses()");
  const adClient = new AdClient({
    bindDN: process.env.AD_USER ?? "",
    secret: process.env.AD_Pass ?? "",
    url: process.env.AD_URI ?? "",
    baseDN: schemaDn,
    logger,
  });

  const objectClasses = await adClient.queryAttributes({
    options: {
      sizeLimit: 200,
      paged: true,
      filter: "&(objectClass=classSchema)",
      scope: "one",
      attributes: [
        "objectClass",
        "cn",
        "instanceType",
        "subClassOf",
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
    },
  });
  adClient.unbind();
  return objectClasses;
}

interface GetSchemaAttributesFnInput {
  schemaDn: string;
  logger?: Logger;
}
export interface SchemaAttributes extends SearchEntryObject {
  cn: string | string[];
  attributeID: string | string[];
  attributeSyntax: string | string[];
  isSingleValued: string | string[];
  showInAdvancedViewOnly: string | string[];
  adminDisplayName: string | string[];
  adminDescription: string | string[];
  oMSyntax: string | string[];
  lDAPDisplayName: string | string[];
  systemOnly: string | string[];
  systemFlags: string | string[];
  objectCategory: string | string[];
}

export async function getSchemaAttributes({
  logger,
  schemaDn,
}: GetSchemaAttributesFnInput): Promise<Partial<SchemaAttributes>[]> {
  logger?.trace("getSchemaAttributes()");
  const adClient = new AdClient({
    bindDN: process.env.AD_USER ?? "",
    secret: process.env.AD_Pass ?? "",
    url: process.env.AD_URI ?? "",
    baseDN: schemaDn,
    logger,
  });

  const objectAttributes = await adClient.queryAttributes({
    options: {
      sizeLimit: 200,
      paged: true,
      filter: "&(objectClass=attributeSchema)",
      scope: "one",
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
    },
  });
  adClient.unbind();
  return objectAttributes;
}
