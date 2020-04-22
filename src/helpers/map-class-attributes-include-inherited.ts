import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import {
  mapClassAttributes,
  SchemaClassWithAttributes,
  AnalysedAttributeFields,
} from "./map-class-attributes";
import { LDAPDisplayName } from "../typings/general/types";
import {
  getListOfParents,
  mergeAttributesOfAuxiliaryClasses,
  mergeAttributes,
} from "./utils";

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
        originalStructuralClass,
      ) => {
        /** placeholder for list of parents. */
        const superClasses: LDAPDisplayName[] = getListOfParents({
          targetClassSubClassOf: originalStructuralClass.subClassOf!,
          allClasses: classesWithDirectAttributes,
        });

        /** placeholder for all auxiliary attributes including inherited ones. */
        const mergedAuxiliaryAttributes: AnalysedAttributeFields[] = [];

        superClasses.forEach((parentLdapName) => {
          const parentClassItem = classesWithDirectAttributes.find(
            (el) => el.lDAPDisplayName === parentLdapName,
          );

          if (!parentClassItem) {
            throw new Error(`class ${parentClassItem} not found!`);
          }

          /** @step merge direct attributes of parent classes with it's auxiliary attributes */

          /** */
          const parentClassWithAllAttributes = mergeAttributesOfAuxiliaryClasses(
            {
              targetClassLdapName: parentClassItem.lDAPDisplayName,
              classesWithAttributes: classesWithDirectAttributes,
            },
          );

          if (parentClassWithAllAttributes.attributes) {
            mergedAuxiliaryAttributes.push(
              ...parentClassWithAllAttributes.attributes,
            );
          }
        });

        /** @step override parent attributes with direct attributes if there are same ones */

        /** Original Structural Class with Direct Attributes */
        const origClassObj = classesWithDirectAttributes.find(
          (el) =>
            el.lDAPDisplayName === originalStructuralClass.lDAPDisplayName!,
        );

        if (!origClassObj) {
          throw new Error(`class ${origClassObj} not found!`);
        }

        const resultAttributes = mergeAttributes({
          importantAttributes: origClassObj.attributes ?? [],
          extraAttributes: mergedAuxiliaryAttributes,
        });

        return {
          ...origClassObj,
          attributes: resultAttributes,
        };
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
