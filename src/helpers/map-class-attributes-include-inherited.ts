import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import {
  mapClassAttributes,
  SchemaClassWithAttributes,
  AnalysedAttributeFields,
} from "./map-class-attributes";
import { LDAPDisplayName } from "../typings/general/types";

interface MapClassAttributesIncludeInheritedFnInput {
  attributes: Partial<SchemaAttribute>[];
  classes: Partial<SchemaClass>[];
  options?: {
    /** default true */
    justStructuralClasses?: boolean;
  };
}
/** @returns class attributes including inherited ones.
 * @summary:
 * 1. list auxiliary classes
 * 2. list systemAuxiliary classes
 * 3. create inheritance graph of structural classes with objectClassCategory=1 by following subClassOf field (class 'top' is parent of all classes)
 * 4. get direct attributes of each class in graph
 * 5. get direct attributes for class
 * 6. merge direct attributes of class and override existing ones since direct attributes has more priority over attributes of auxiliary classes.
 * - Note: child properties (override parent properties).
 * if a field exist in parent and child, child's attributes should override parent's one. (Source: https://docs.oracle.com/cd/E23507_01/Platform.20073/RepositoryGuide/html/s1804itemdescriptorhierarchiesandinhe01.html)
 */
export function mapClassAttributesIncludeInherited({
  attributes,
  classes,
  options,
}: MapClassAttributesIncludeInheritedFnInput): SchemaClassWithAttributes[] {
  writeLog(`mapClassAttributesIncludeInherited()`, { level: "trace" });

  const classesWithDirectAttributes = classes.map((classObj) => {
    /** get direct attributes for class */
    return mapClassAttributes({ attributes, classObj });
  });

  let justStructuralClasses = true;
  if (options && typeof options.justStructuralClasses === "boolean") {
    justStructuralClasses = options.justStructuralClasses;
  }

  if (justStructuralClasses) {
    const structuralClasses = classes.filter(
      (el) => el.objectClassCategory === "1",
    );

    const structuralClassesWithParents = structuralClasses.map(
      (
        /** original raw structural class (attributes not processed)*/
        originalStructuralClassObj,
      ) => {
        /** placeholder for all attributes including inherited ones */
        const mergedAttributes: {
          [attributeLdapName: string]: AnalysedAttributeFields;
        } = {};

        /** placeholder for list of parents. */
        const superClasses: LDAPDisplayName[] = [];

        /** set the first parent */
        let parentLdapName = originalStructuralClassObj.subClassOf!;

        while (parentLdapName.toLowerCase() !== "top") {
          superClasses.push(parentLdapName);
          /**
           * 1. find parent class by it's ldapDisplayName
           * 2. follow the subClassOf field to find next parent
           */
          const parentClass = classesWithDirectAttributes.find(
            (classItem) => classItem.ldapName === parentLdapName,
          );

          if (!parentClass) {
            throw new Error(`class ${parentLdapName} not found!`);
          }
          parentLdapName = parentClass.subClassOf;
        }

        /** add "top" as last parent */
        superClasses.push(parentLdapName);

        /** now we have all the parents!
         * it's time to merge attributes of parent classes
         */
        superClasses.forEach((ldapDisplayName) => {
          const parentClassItem = classesWithDirectAttributes.find(
            (el) => el.ldapName === ldapDisplayName,
          );

          if (!parentClassItem) {
            throw new Error(`class ${parentClassItem} not found!`);
          }

          parentClassItem.attributes?.forEach((attributeItem) => {
            mergedAttributes[attributeItem.lDAPDisplayName] = attributeItem;
          });
        });

        /** override parent attributes with direct attributes if there are same ones*/

        const originalStructuralClassWithDirectAttributes = classesWithDirectAttributes.find(
          (el) => el.ldapName === originalStructuralClassObj.lDAPDisplayName!,
        );

        if (!originalStructuralClassWithDirectAttributes) {
          throw new Error(
            `class ${originalStructuralClassWithDirectAttributes} not found!`,
          );
        }

        Object.entries(mergedAttributes).forEach((el) => {
          const [attributeLdapName, attributeData] = el;
          const attribIndex = originalStructuralClassWithDirectAttributes.attributes?.findIndex(
            (attribute) => attribute.lDAPDisplayName === attributeLdapName,
          );

          /** if (
           * - attributes field exist
           * - and attribIndex is not undefined
           * - and attribIndex !== -1
           * ){
           *    attribute exist and need to be override.
           * } else {
           *    attribute not exist and can be add to array of attributes
           * }
           */
          if (
            originalStructuralClassWithDirectAttributes.attributes &&
            attribIndex &&
            attribIndex !== -1
          ) {
            /** attribute exist and need to be override. */
            originalStructuralClassWithDirectAttributes.attributes[
              attribIndex
            ] = attributeData;
          } else {
            /** attribute not exist and can be add to array of attributes */
            originalStructuralClassWithDirectAttributes.attributes?.push(
              attributeData,
            );
          }
        });
        return originalStructuralClassWithDirectAttributes;
      },
    );
    return structuralClassesWithParents;
  } else {
    // TODO: take care of non structural part in-case needed in future.
    throw new Error(
      "this function created just for structural classes in purpose of generating graphql types.",
    );
  }
}

interface AddAttributesOfAuxiliaryClassesFnInput {
  classesWithAttributes: SchemaClassWithAttributes[];
  targetClass: SchemaClassWithAttributes;
}
/** mutate/add attributes exist in auxiliaryClass and systemAuxiliaryClass fields to target class */
function addAttributesOfAuxiliaryClasses({
  classesWithAttributes,
  targetClass,
}: AddAttributesOfAuxiliaryClassesFnInput): SchemaClassWithAttributes {
  targetClass.auxiliaryClass?.forEach();
}

interface AddAttributesOfAuxiliaryClassesFnInput {
  classesWithAttributes: SchemaClassWithAttributes[];
  targetClass: SchemaClassWithAttributes;
}
/** follow subClassOf field in class schema to gets to the top class */
function getListOfParents(params: type): LDAPDisplayName[] {}
