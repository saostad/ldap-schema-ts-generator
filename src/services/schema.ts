import { AdClient } from "node-ad-ldap";
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

export type GetSchemaClassesFnOutput = Promise<Partial<SchemaClass>[]>;
export async function getSchemaClasses({
  schemaDn,
  options,
}: GetSchemaClassesFnInput): GetSchemaClassesFnOutput {
  options.logger?.trace("getSchemaClasses()");
  const adClient = new AdClient({
    bindDN: options.user,
    secret: options.pass,
    url: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
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
    },
  });
  adClient.unbind();
  return objectClasses;
}

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

export type GetSchemaAttributesFnOutput = Promise<Partial<SchemaAttribute>[]>;
export async function getSchemaAttributes({
  schemaDn,
  options,
}: GetSchemaAttributesFnInput): GetSchemaAttributesFnOutput {
  options.logger?.trace("getSchemaAttributes()");
  const adClient = new AdClient({
    bindDN: options.user,
    secret: options.pass,
    url: options.ldapServerUrl,
    baseDN: schemaDn,
    logger: options.logger,
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
