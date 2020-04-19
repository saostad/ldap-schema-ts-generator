import { writeLog } from "fast-node-logger";
import { promisify } from "util";
import path from "path";
import fs from "fs";

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
