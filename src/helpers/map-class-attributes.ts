import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import { arrayifyProp, ldapBooleanToJsBoolean } from "./utils";
import type {
  CN,
  LDAPDisplayName,
  DN,
  AttributeID,
  AttributeSyntax,
  AdminDisplayName,
  AdminDescription,
  SubClassOf,
  Name,
  AuxiliaryClass,
  SystemAuxiliaryClass,
} from "../typings/general/types";

export interface AnalysedAttributeFields {
  cn: CN;
  lDAPDisplayName: LDAPDisplayName;
  dn: DN;
  attributeID: AttributeID;
  attributeSyntax: AttributeSyntax;
  isRequired: boolean;
  isSingleValued: boolean;
  systemOnly?: boolean;
  adminDisplayName?: AdminDisplayName;
  adminDescription?: AdminDescription;
}

export interface SchemaClassWithAttributes {
  className: Name;
  lDAPDisplayName: LDAPDisplayName;
  subClassOf: SubClassOf;
  auxiliaryClass?: Extract<AuxiliaryClass, string[]>;
  systemAuxiliaryClass?: Extract<SystemAuxiliaryClass, string[]>;
  originalClassFields: Partial<SchemaClass>;
  originalAttributes?: Partial<SchemaAttribute>[];
  /** attributes with meta data */
  attributes?: AnalysedAttributeFields[];
}

interface MapClassAttributesFnInput {
  classObj: Partial<SchemaClass>;
  attributes: Partial<SchemaAttribute>[];
}

/** merge direct attributes addressed in fields mustContain, systemMustContain, mayContain, and systemMayContain with meta data.
 * @note does not add inherited attributes of classes named in auxiliaryClass and systemAuxiliaryClass fields or other type of inheritance. */
export function mapClassAttributes({
  classObj,
  attributes,
}: MapClassAttributesFnInput): SchemaClassWithAttributes {
  writeLog(`mapClassAttributes()`, { level: "trace" });
  const result: SchemaClassWithAttributes = {
    className: classObj.name!,
    lDAPDisplayName: classObj.lDAPDisplayName!,
    subClassOf: classObj.subClassOf!,
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
      const foundAttribute = attributes.find(
        (attributeItem) => attributeItem.lDAPDisplayName === attributeToFind,
      );

      if (!foundAttribute) {
        throw new Error(`Attribute ${attributeToFind} not found!`);
      }

      /**push found attribute */
      result.originalAttributes?.push(foundAttribute);

      const classAttributes: AnalysedAttributeFields = {
        dn: foundAttribute.dn!,
        cn: foundAttribute.cn!,
        lDAPDisplayName: foundAttribute.lDAPDisplayName!,
        attributeSyntax: foundAttribute.attributeSyntax!,
        attributeID: foundAttribute.attributeID!,
        isRequired,
        isSingleValued: ldapBooleanToJsBoolean(foundAttribute.isSingleValued!),
      };

      /** this field can be empty */
      if (foundAttribute.adminDisplayName) {
        classAttributes.adminDisplayName = foundAttribute.adminDisplayName;
      }

      /** this field can be empty */
      if (foundAttribute.adminDescription) {
        classAttributes.adminDescription = foundAttribute.adminDescription;
      }

      /** this field can be empty */
      if (foundAttribute.systemOnly) {
        const systemOnly = ldapBooleanToJsBoolean(foundAttribute.systemOnly);

        /** either systemOnly or isSystemProp this flag makes attribute in interface readonly */
        classAttributes.systemOnly = systemOnly || isSystemProp;
      }

      result.attributes?.push(classAttributes);
    },
  );

  return result;
}
