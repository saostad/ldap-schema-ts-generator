import type { SchemaClass, SchemaAttributes } from "../services/schema";
import { writeLog } from "fast-node-logger";
import { stringifyProp, arrayifyProp, ldapBooleanToJsBoolean } from "./utils";

interface MapClassAttributesFnInput {
  classObj: Partial<SchemaClass>;
  attributes: Partial<SchemaAttributes>[];
}

export interface SchemaClassWithAttributes {
  className: string;
  ldapName: string;
  parentClass: string;
  originalClassFields: Partial<SchemaClass>;
  originalAttributes?: Partial<SchemaAttributes>[];
  attributes?: Array<{
    dn: string;
    attributeID: string;
    attributeSyntax: string;
    cn: string;
    adminDisplayName: string;
    adminDescription: string;
    isRequired: boolean;
    isSingleValued: boolean;
    lDAPDisplayName: string;
  }>;
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
    originalAttributes: [],
    attributes: [],
  };

  /** combine mustContain, systemMustContain, mayContain, and systemMayContain items to do search operation just one time */
  const combinedRawAttributes: Array<{
    isRequired: boolean;
    attributeToFind: string;
  }> = [];

  /**combine mustContain as required field*/
  if (classObj.mustContain) {
    arrayifyProp(classObj.mustContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({ isRequired: true, attributeToFind }),
    );
  }
  /**combine systemMustContain as required field*/
  if (classObj.systemMustContain) {
    arrayifyProp(classObj.systemMustContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({ isRequired: true, attributeToFind }),
    );
  }
  /**combine mayContain as non required field*/
  if (classObj.mayContain) {
    arrayifyProp(classObj.mayContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({ isRequired: false, attributeToFind }),
    );
  }
  /**combine systemMayContain as non required field*/
  if (classObj.systemMayContain) {
    arrayifyProp(classObj.systemMayContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({ isRequired: false, attributeToFind }),
    );
  }

  combinedRawAttributes.forEach(({ attributeToFind, isRequired }) => {
    /** search in attributes */
    //TODO: this is an expensive operation there should be better way to improve it
    const foundAttribute = attributes.find(
      (attributeItem) => attributeItem.lDAPDisplayName === attributeToFind,
    );
    if (!foundAttribute) {
      throw new Error(`Attribute ${attributeToFind} not found!`);
    }

    /**push found attribute */
    result.originalAttributes?.push(foundAttribute);
    result.attributes?.push({
      dn: stringifyProp(foundAttribute.dn),
      cn: stringifyProp(foundAttribute.cn),
      lDAPDisplayName: stringifyProp(foundAttribute.lDAPDisplayName),
      attributeSyntax: stringifyProp(foundAttribute.attributeSyntax),
      attributeID: stringifyProp(foundAttribute.attributeID),
      adminDisplayName: stringifyProp(foundAttribute.adminDisplayName),
      adminDescription: stringifyProp(foundAttribute.adminDescription),
      isRequired,
      isSingleValued: ldapBooleanToJsBoolean(
        stringifyProp(foundAttribute.isSingleValued),
      ),
    });
  });

  return result;
}
