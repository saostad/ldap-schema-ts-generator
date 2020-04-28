import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import {
  mapClassAttributes,
  SchemaClassWithAttributes,
} from "./map-class-attributes";
import { getAllAttributes, findClass } from "./utils";

type MapClassAttributesIncludeInheritedFnInput = {
  /** all schema attributes */
  attributes: Partial<SchemaAttribute>[];
  /** all schema classes */
  classes: Partial<SchemaClass>[];
  options?: {
    /** structural classes with objectClassCategory=1. default true */
    justStructuralClasses?: boolean;
    /** list of classes to generate classes
     * - if not provided it generate all structural classes (classes with objectClassCategory=1)
     */
    justThisClasses?: string[];
  };
};
/** @returns class attributes including inherited ones.
 * @note if a field exist in parent and child, child's attributes should override parent's one. (Source: https://docs.oracle.com/cd/E23507_01/Platform.20073/RepositoryGuide/html/s1804itemdescriptorhierarchiesandinhe01.html)
 */
export function mapClassAttributesIncludeInherited({
  attributes,
  classes,
  options,
}: MapClassAttributesIncludeInheritedFnInput): SchemaClassWithAttributes[] {
  writeLog(`mapClassAttributesIncludeInherited()`, { level: "trace" });

  /** all classes with direct attributes */
  const classesWithAttributes = classes.map((classObj) => {
    return mapClassAttributes({ attributes, classObj });
  });

  let justStructuralClasses = true;
  if (options && typeof options.justStructuralClasses === "boolean") {
    justStructuralClasses = options.justStructuralClasses;
  }

  if (options && options.justThisClasses?.length === 0) {
    throw new Error("justThisClasses can't be empty array!");
  }

  if (justStructuralClasses) {
    const structuralClasses = classes.filter(
      (el) => el.objectClassCategory === "1",
    );

    /** this is the result of operation */
    const structuralClassesWithParents = structuralClasses
      .filter((el) => {
        if (options && options.justThisClasses) {
          return options.justThisClasses.includes(el.lDAPDisplayName!);
        }

        /** default process all */
        return true;
      })
      .map(
        (
          /** original raw structural class (attributes not processed)*/
          rawClass,
        ) => {
          /** Original Structural Class with Direct Attributes */
          const origClassObj = findClass({
            classesWithAttributes,
            ldapDisplayName: rawClass.lDAPDisplayName!,
          });

          const resultAttributes = getAllAttributes({
            classesWithAttributes,
            targetClass: origClassObj,
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
