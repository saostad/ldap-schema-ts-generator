import { writeLog } from "fast-node-logger";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import {
  SchemaClassWithAttributes,
  AnalysedAttributeFields,
} from "./map-class-attributes";
import { LDAPDisplayName } from "../typings/general/types";
import { SchemaClass } from "../services";

/** make sure output is string
 * - throw error if array has multiple entry
 * - if array has just one entry, string provided in join all in one string with join() */
export function stringifyProp(input: string | string[]): string {
  writeLog(`stringifyProp()`, { level: "trace" });
  if (!input) {
    throw new Error(`Field required to stringify! but provided: ${input} `);
  }

  if (Array.isArray(input)) {
    /** this check is for prevent unexpected bugs */
    if (input.length > 1) {
      throw new Error(
        `array supposed to has just one entry but has more than one item: ${input}.`,
      );
    } else {
      /** array has just one entry */
      return input.join();
    }
  }

  /** input is string (no need to do anything) */
  return input;
}

/** make sure output is array of strings even if it's just single string */
export function arrayifyProp(input: string | string[]): string[] {
  writeLog(`arrayifyProp()`, { level: "trace" });
  if (!input) {
    throw new Error(`Field required to arrayify`);
  }
  if (typeof input === "string") {
    return [input];
  }
  return input;
}

/** convert LDAP boolean "TRUE"/"FALSE" to js boolean */
export function ldapBooleanToJsBoolean(input: string): boolean {
  writeLog(`ldapBooleanToJsBoolean()`, { level: "trace" });
  if (input === "TRUE") {
    return true;
  }
  return false;
}

/** convert array of strings to one string and add line break between each */
export function arrayToLines(data?: string[]): string {
  writeLog(`arrayToLines()`, { level: "trace" });
  if (!data) {
    throw new Error(`data input required. but provided: ${data}`);
  }
  return data.join("\n");
}

/** check if directory exist */
export async function dirPathExist(targetPath: string) {
  writeLog(`dirPathExist()`, { level: "trace" });
  return promisify(fs.exists)(path.dirname(targetPath));
}

/** check if number odd */
export function isOdd(input: number): boolean {
  writeLog(`isOdd()`, { level: "trace" });
  if (input % 2 === 0) {
    return false;
  }
  return true;
}

type GetListOfParentsFnInput = {
  allClasses: Partial<SchemaClass>[];
  /** ldapDisplayName of target class. this will use as first parent */
  targetClassSubClassOf: LDAPDisplayName;
};
/** follow subClassOf field in class schema to gets to the top class
 * @returns array of ldapDisplayName
 */
export function getListOfParents({
  allClasses,
  targetClassSubClassOf,
}: GetListOfParentsFnInput): LDAPDisplayName[] {
  /** placeholder for list of parents. */
  const superClasses: LDAPDisplayName[] = [];

  /** set the first parent */
  let parentLdapName = targetClassSubClassOf;

  /**
   * 1. find parent class by it's ldapDisplayName
   * 2. follow the subClassOf field to find next parent
   */
  while (parentLdapName.toLowerCase() !== "top") {
    superClasses.push(parentLdapName);

    const parentClass = allClasses.find(
      (classItem) => classItem.lDAPDisplayName === parentLdapName,
    );

    if (!parentClass) {
      throw new Error(`class ${parentLdapName} not found!`);
    }
    parentLdapName = parentClass.subClassOf!;
  }

  /** add "top" as last parent */
  superClasses.push(parentLdapName);

  /** @note reverse() required in order to make sure the order of items is the way that 'top' is always in the top. it's required for override attributes when following subClassOf field. */
  return superClasses.reverse();
}

type MergeAndOverrideAttributesFnInput = {
  /** keep these attributes in case same as extra attributes */
  importantAttributes: AnalysedAttributeFields[];
  extraAttributes: AnalysedAttributeFields[];
};
/** Merge And Override Attributes */
export function mergeAttributes({
  importantAttributes,
  extraAttributes,
}: MergeAndOverrideAttributesFnInput): AnalysedAttributeFields[] {
  /**
   * - this is an object that each field represent one attribute.
   * - this structure prevents us from having duplicate attribute and also makes override easier.
   */
  const mergedAttributes: {
    [attributeLdapName: string]: AnalysedAttributeFields;
  } = {};

  /** add all extra attributes */
  extraAttributes.forEach((el) => {
    mergedAttributes[el.lDAPDisplayName] = el;
  });

  /** if exist override
   * if not exist add it
   */
  importantAttributes.forEach((el) => {
    mergedAttributes[el.lDAPDisplayName] = el;
  });

  return Object.values(mergedAttributes);
}

type MergeAttributesOfAuxiliaryClassesFnInput = {
  classesWithAttributes: SchemaClassWithAttributes[];
  targetClass: SchemaClassWithAttributes;
};
/** merge direct attributes with in auxiliaryClass and systemAuxiliaryClass fields to target class.
 * @note :
 *  - it includes inherited attributes of parent classes
 *  - for auxiliary classes it ignores 'top' in parent classes to prevent processing it multiple times
 * @note :
 * - auxiliary classes can be subClassOf other auxiliary classes
 * - auxiliary classes can have auxiliaryClass and systemAuxiliaryClass fields that reference to other auxiliary classes
 * @plan for getting attributes of auxiliaryClass and systemAuxiliaryClass classes:
 * 1. get direct Attributes of target class
 * 2. get auxiliary classes of target class
 *    2.1 process each auxiliary class
 *    2.2 get direct attributes of that auxiliary class
 *
 *
 * 4. merge it with attributes place holder named auxiliaryAttributes
 * 5. get parent classes and filter-out 'top' and class name itself (some classes are subClassOf themselves!)
 * 6. do the same steps above for parents classes recursively
 * 7. merge auxiliaryAttributes with directAttributes (override directAttributes)
 */

type FindClassFnInput = {
  classesWithAttributes: SchemaClassWithAttributes[];
  ldapDisplayName: LDAPDisplayName;
};
export function findClass({
  classesWithAttributes,
  ldapDisplayName,
}: FindClassFnInput): SchemaClassWithAttributes {
  const classObj = classesWithAttributes.find(
    (el) => el.lDAPDisplayName === ldapDisplayName,
  );
  if (!classObj) {
    throw new Error(`class ${ldapDisplayName} not found!`);
  }
  return classObj;
}

function mergeAttributesOfAuxiliaryClasses({
  targetClass,
  classesWithAttributes,
}: MergeAttributesOfAuxiliaryClassesFnInput): AnalysedAttributeFields[] {
  /** placeholder for ldap name of all classes that this class gets its attributes from */
  const attributeClasses: string[] = [];

  /**@step merge auxiliaryClass & systemAuxiliaryClass classes */
  if (targetClass.auxiliaryClass) {
    attributeClasses.push(...targetClass.auxiliaryClass);
  }
  if (targetClass.systemAuxiliaryClass) {
    attributeClasses.push(...targetClass.systemAuxiliaryClass);
  }

  /** placeholder for all attributes */
  let classAttributes: AnalysedAttributeFields[] = [];

  /**@step get attributes of attributeClasses */
  attributeClasses.forEach((ldapDisplayName) => {
    const classObj = findClass({ classesWithAttributes, ldapDisplayName });

    classAttributes = mergeAttributes({
      importantAttributes: classAttributes,
      extraAttributes: classObj.attributes ?? [],
    });
  });

  const allAttributes: AnalysedAttributeFields[] = mergeAttributes({
    importantAttributes: targetClass.attributes ?? [],
    extraAttributes: classAttributes,
  });

  return allAttributes;
}

type GetAllAttributesFnInput = {
  classesWithAttributes: SchemaClassWithAttributes[];
  targetClass: SchemaClassWithAttributes;
};
export function getAllAttributes({
  targetClass,
  classesWithAttributes,
}: GetAllAttributesFnInput): AnalysedAttributeFields[] {
  const directAttributes = mergeAttributesOfAuxiliaryClasses({
    classesWithAttributes,
    targetClass,
  });

  let allAttributes: AnalysedAttributeFields[] = [];

  const parents = getListOfParents({
    allClasses: classesWithAttributes,
    targetClassSubClassOf: targetClass.subClassOf,
  });

  /**@step merge attributes of all parent classes */
  parents.forEach((ldapDisplayName) => {
    const newTarget = findClass({ ldapDisplayName, classesWithAttributes });
    const attributes = mergeAttributesOfAuxiliaryClasses({
      classesWithAttributes,
      targetClass: newTarget,
    });
    allAttributes = mergeAttributes({
      extraAttributes: allAttributes,
      importantAttributes: attributes,
    });
  });

  /**@step merge direct attributes of target class */
  const result = mergeAttributes({
    extraAttributes: allAttributes,
    importantAttributes: directAttributes,
  });

  return result;
}
