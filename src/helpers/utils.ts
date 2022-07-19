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

/** make sure directory exist */
export async function dirPathExist(targetPath: string): Promise<boolean> {
  writeLog(`dirPathExist()`, { level: "trace" });
  const targetDir = path.dirname(targetPath);
  const pathExist = await promisify(fs.exists)(targetDir);
  if (pathExist) {
    return true;
  } else {
    await promisify(fs.mkdir)(targetDir, { recursive: true });
    return true;
  }
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

/** follow subClassOf field of schema class object to gets to the top class
 * @returns array of ldapDisplayName
 */
export function getListOfParents({
  allClasses,
  targetClassSubClassOf,
}: GetListOfParentsFnInput): LDAPDisplayName[] {
  writeLog(`getListOfParents()`, { level: "trace" });
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

type MergeAttributesFnInput = {
  /** keep these attributes in case same as extra attributes */
  importantAttributes: AnalysedAttributeFields[];
  /** these attributes will be overridden (less important to keep) in case same as extra attributes */
  extraAttributes: AnalysedAttributeFields[];
};
/** Merge And Override Attributes */
export function mergeAttributes({
  importantAttributes,
  extraAttributes,
}: MergeAttributesFnInput): AnalysedAttributeFields[] {
  writeLog(`mergeAttributes()`, { level: "trace" });
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

type FindClassFnInput = {
  classesWithAttributes: SchemaClassWithAttributes[];
  ldapDisplayName: LDAPDisplayName;
};
export function findClass({
  classesWithAttributes,
  ldapDisplayName,
}: FindClassFnInput): SchemaClassWithAttributes {
  writeLog(`findClass()`, { level: "trace" });
  const classObj = classesWithAttributes.find(
    (el) => el.lDAPDisplayName === ldapDisplayName,
  );
  if (!classObj) {
    throw new Error(`class ${ldapDisplayName} not found!`);
  }
  return classObj;
}

type MergeAttributesOfAuxiliaryClassesFnInput = {
  classesWithAttributes: SchemaClassWithAttributes[];
  targetClass: SchemaClassWithAttributes;
};

/** merge direct attributes of targetClass with attributes of auxiliaryClass & systemAuxiliaryClass classes
 * @note:
 * - // TODO at this point it does not follow auxiliaryClass & systemAuxiliaryClass attributes of other auxiliary classes. (auxiliary classes can have auxiliaryClass and systemAuxiliaryClass fields that reference to other auxiliary classes)
 * - // TODO at this point it does not follow subClassOf field. (auxiliary classes can be subClassOf other auxiliary classes)
 */
function mergeAttributesOfAuxiliaryClasses({
  targetClass,
  classesWithAttributes,
}: MergeAttributesOfAuxiliaryClassesFnInput): AnalysedAttributeFields[] {
  writeLog(`mergeAttributesOfAuxiliaryClasses()`, { level: "trace" });

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
/** merge direct attributes with in auxiliaryClass and systemAuxiliaryClass fields to target class respecting inheritance.
 * @note :
 * - it includes inherited attributes of parent classes
 * - auxiliary classes can be subClassOf other auxiliary classes
 * - auxiliary classes can have auxiliaryClass and systemAuxiliaryClass fields that reference to other auxiliary classes.
 */
export function getAllAttributes({
  targetClass,
  classesWithAttributes,
}: GetAllAttributesFnInput): AnalysedAttributeFields[] {
  writeLog(`getAllAttributes()`, { level: "trace" });

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

/**
 * - Escape all characters not included in SingleStringCharacters and
DoubleStringCharacters on  http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
 - maybe it need to improve to cover [source](https://www.freeformatter.com/javascript-escape.html):
    -  Horizontal Tab is replaced with \t
    -  Vertical Tab is replaced with \v
    -  Nul char is replaced with \0
    -  Backspace is replaced with \b
    -  Form feed is replaced with \f
    -  Newline is replaced with \n
    -  Carriage return is replaced with \r
    -  Single quote is replaced with \'
    -  Double quote is replaced with \"
    -  Backslash is replaced with \\
 */
export function escapeString(string: string): string {
  return ("" + string).replace(/["'\\\n\r\u2028\u2029]/g, (character) => {
    switch (character) {
      case '"':
      case "'":
      case "\\":
        return "\\" + character;
      // Four possible LineTerminator characters need to be escaped:
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\u2028":
        return "\\u2028";
      case "\u2029":
        return "\\u2029";
      default:
        return "";
    }
  });
}
