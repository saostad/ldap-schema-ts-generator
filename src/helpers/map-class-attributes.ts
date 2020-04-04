import type { SchemaClass, SchemaAttributes } from "../services/schema";
import { writeLog } from "fast-node-logger";

interface MapClassAttributesFnInput {
  classObj: Partial<SchemaClass>;
  attributes: Partial<SchemaAttributes>[];
}

interface SchemaClassWithAttributes {
  className: string;
  ldapName: string;
  parentClass: string;
  originalClassFields: Partial<SchemaClass>;
  originalAttributes?: Partial<SchemaAttributes>[];
  attributes?: Array<{
    dn: string;
    attributeID: string;
    cn: string;
    adminDisplayName: string;
    adminDescription: string;
    isRequired: boolean;
    isSingleValued: boolean;
  }>;
}

function stringifyProp(input?: string | string[]): string {
  writeLog(`stringifyProp()`);
  if (!input) {
    throw new Error(`Field not exist`);
  }
  if (Array.isArray(input)) {
    return input.join();
  }
  return input;
}

function arrayifyProp(input?: string | string[]): string[] {
  writeLog(`arraifyProp()`);
  if (!input) {
    throw new Error(`Field not exist to arrayify`);
  }
  if (typeof input === "string") {
    return [input];
  }
  return input;
}

export function mapClassAttributes({
  classObj,
  attributes,
}: MapClassAttributesFnInput): SchemaClassWithAttributes {
  writeLog(`mapClassAttributes()`);
  const result: SchemaClassWithAttributes = {
    className: stringifyProp(classObj.name),
    ldapName: stringifyProp(classObj.lDAPDisplayName),
    parentClass: stringifyProp(classObj.subClassOf),
    originalClassFields: { ...classObj },
  };

  /** look at mustContain, systemMustContain, mayContain, and systemMayContain */
  if (classObj.mustContain) {
    arrayifyProp(classObj.mustContain).forEach((attributeToFind) => {
      /** search in attributes */
      const foundAttribute = attributes.find(
        (attributeItem) => attributeItem.lDAPDisplayName === attributeToFind,
      );
      if (!foundAttribute) {
        throw new Error(`Attribute ${attributeToFind} not found!`);
      }
      /**add found attribute to  */
    });
  }

  return result;
}
