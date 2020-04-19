import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import { stringifyProp, arrayifyProp, ldapBooleanToJsBoolean } from "./utils";
import type {
  SchemaClassWithAttributes,
  AttributeFields,
} from "../typings/general/types";

interface MapClassAttributesFnInput {
  classObj: Partial<SchemaClass>;
  attributes: Partial<SchemaAttribute>[];
}

export function mapClassAttributes({
  classObj,
  attributes,
}: MapClassAttributesFnInput): SchemaClassWithAttributes {
  writeLog(`mapClassAttributes()`, { level: "trace" });
  const result: SchemaClassWithAttributes = {
    className: stringifyProp(classObj.name as string),
    ldapName: stringifyProp(classObj.lDAPDisplayName as string),
    subClassOf: stringifyProp(classObj.subClassOf as string),
    originalClassFields: { ...classObj },
    originalAttributes: [],
    attributes: [],
  };

  /** add ldap name of auxiliary classes
   * this field will define class interface should extends(inherits) from which class
   */
  if (classObj.auxiliaryClass) {
    result.auxiliaryClass = arrayifyProp(classObj.auxiliaryClass);
  }

  /** add ldap name of systemAuxiliary classes
   * this field will define class interface should extends(inherits) from which class
   */
  if (classObj.systemAuxiliaryClass) {
    result.systemAuxiliaryClass = arrayifyProp(classObj.systemAuxiliaryClass);
  }

  /** place holder to keep combined
   * mustContain, systemMustContain,
   * mayContain, and systemMayContain
   * items to do search operation just one time */
  const combinedRawAttributes: Array<{
    isRequired: boolean;
    /** true when source of attribute is systemMustContain or systemMayContain (attribute should be readonly) */
    isSystemProp: boolean;
    attributeToFind: string;
  }> = [];

  /**combine mustContain as required field*/
  if (classObj.mustContain) {
    arrayifyProp(classObj.mustContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({
        isRequired: true,
        isSystemProp: false,
        attributeToFind,
      }),
    );
  }
  /**combine systemMustContain as required field*/
  if (classObj.systemMustContain) {
    arrayifyProp(classObj.systemMustContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({
        isRequired: true,
        isSystemProp: true,
        attributeToFind,
      }),
    );
  }
  /**combine mayContain as non required field*/
  if (classObj.mayContain) {
    arrayifyProp(classObj.mayContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({
        isRequired: false,
        isSystemProp: false,
        attributeToFind,
      }),
    );
  }
  /**combine systemMayContain as non required field*/
  if (classObj.systemMayContain) {
    arrayifyProp(classObj.systemMayContain).forEach((attributeToFind) =>
      combinedRawAttributes.push({
        isRequired: false,
        isSystemProp: true,
        attributeToFind,
      }),
    );
  }

  combinedRawAttributes.forEach(
    ({ attributeToFind, isRequired, isSystemProp }) => {
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
        lDAPDisplayName: stringifyProp(
          foundAttribute.lDAPDisplayName as string,
        ),
        attributeSyntax: stringifyProp(
          foundAttribute.attributeSyntax as string,
        ),
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
        const systemOnly = ldapBooleanToJsBoolean(
          stringifyProp(foundAttribute.systemOnly),
        );

        /** either systemOnly or isSystemProp this flag makes attribute in interface readonly */
        classAttributes.systemOnly = systemOnly || isSystemProp;
      }

      result.attributes?.push(classAttributes);
    },
  );

  return result;
}
