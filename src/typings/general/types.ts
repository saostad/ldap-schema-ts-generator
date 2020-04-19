import type { SchemaClass, SchemaAttribute } from "../../services";

export type { Logger } from "fast-node-logger";
export type { SearchEntryObject } from "ldap-ts-client";
export type OID = string;

export interface AttributeFields {
  dn: string;
  attributeID: string;
  attributeSyntax: string;
  cn: string;
  lDAPDisplayName: string;
  isRequired: boolean;
  isSingleValued: boolean;
  systemOnly?: boolean;
  adminDisplayName?: string;
  adminDescription?: string;
}

export interface SchemaClassWithAttributes {
  className: string;
  ldapName: string;
  /** direct parent class */
  subClassOf: string;
  /** ldap name of classes that this class inherits from */
  auxiliaryClass?: string[];
  systemAuxiliaryClass?: string[];
  originalClassFields: Partial<SchemaClass>;
  originalAttributes?: Partial<SchemaAttribute>[];
  attributes?: AttributeFields[];
}
