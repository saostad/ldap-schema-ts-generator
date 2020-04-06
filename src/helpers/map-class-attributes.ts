import type { SchemaClass, SchemaAttributes } from "../services/schema";
import { writeLog } from "fast-node-logger";
import { stringifyProp, arrayifyProp, ldapBooleanToJsBoolean } from "./utils";

interface MapClassAttributesFnInput {
  classObj: Partial<SchemaClass>;
  attributes: Partial<SchemaAttributes>[];
}

interface AttributeFields {
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
  parentClass: string;
  originalClassFields: Partial<SchemaClass>;
  originalAttributes?: Partial<SchemaAttributes>[];
  attributes?: AttributeFields[];
}

export function mapClassAttributes({
  classObj,
  attributes,
}: MapClassAttributesFnInput): SchemaClassWithAttributes {
  writeLog(`mapClassAttributes()`);
  const result: SchemaClassWithAttributes = {
    className: stringifyProp(classObj.name as string),
    ldapName: stringifyProp(classObj.lDAPDisplayName as string),
    parentClass: stringifyProp(classObj.subClassOf as string),
    originalClassFields: { ...classObj },
    originalAttributes: [],
    attributes: [],
  };

  /** combines
   * mustContain, systemMustContain,
   * mayContain, and systemMayContain
   * items to do search operation just one time */
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

    const classAttributes: AttributeFields = {
      dn: stringifyProp(foundAttribute.dn as string),
      cn: stringifyProp(foundAttribute.cn as string),
      lDAPDisplayName: stringifyProp(foundAttribute.lDAPDisplayName as string),
      attributeSyntax: stringifyProp(foundAttribute.attributeSyntax as string),
      attributeID: stringifyProp(foundAttribute.attributeID as string),
      isRequired,
      isSingleValued: ldapBooleanToJsBoolean(
        stringifyProp(foundAttribute.isSingleValued as string),
      ),
    };

    /** this field can be empty */
    if (foundAttribute.adminDisplayName) {
      classAttributes.adminDisplayName = stringifyProp(
        foundAttribute.adminDisplayName as string,
      );
    }

    /** this field can be empty */
    if (foundAttribute.adminDescription) {
      classAttributes.adminDescription = stringifyProp(
        foundAttribute.adminDescription as string,
      );
    }

    /** this field can be empty */
    if (foundAttribute.systemOnly) {
      classAttributes.systemOnly = ldapBooleanToJsBoolean(
        stringifyProp(foundAttribute.systemOnly as string),
      );
    }

    result.attributes?.push(classAttributes);
  });

  return result;
}
