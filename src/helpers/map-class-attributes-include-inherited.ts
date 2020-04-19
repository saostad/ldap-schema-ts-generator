import type { SchemaClass, SchemaAttribute } from "../services";
import { writeLog } from "fast-node-logger";
import {
  mapClassAttributes,
  SchemaClassWithAttributes,
} from "./map-class-attributes";

interface MapClassAttributesIncludeInheritedFnInput {
  attributes: Partial<SchemaAttribute>[];
  classes: Partial<SchemaClass>[];
}
/** @returns class attributes including inherited ones.
 * @summary:
 * 1. list auxiliary classes
 * 2. list system auxiliary classes
 * 3. create inheritance graph with following auxiliary classes (class 'top' is parent of all classes)
 * 4. get direct attributes of each class in graph
 * 5. merge all attributes
 * 6. get direct attributes for class
 * 7. merge direct attributes of class and override existing ones since direct attributes has more priority over attributes of auxiliary classes.
 */
export function mapClassAttributesIncludeInherited({
  attributes,
  classes,
}: MapClassAttributesIncludeInheritedFnInput): SchemaClassWithAttributes[] {
  writeLog(`mapClassAttributesIncludeInherited()`, { level: "trace" });
  /** place holder for all attributes including inherited ones */
  const allAttributes: SchemaClassWithAttributes[] = [];

  const classesWithDirectAttributes = classes.map((classObj) => {
    /** get direct attributes for class */
    return mapClassAttributes({ attributes, classObj });
  });

  classesWithDirectAttributes.forEach((classObj) => {
    // classObj.
  });

  return allAttributes;
}
