import { writeLog } from "fast-node-logger";
import { promisify } from "util";
import path from "path";
import fs from "fs";

/** make sure output is string */
export function stringifyProp(input: string | string[]): string {
  writeLog(`stringifyProp()`, { level: "trace" });
  if (!input) {
    throw new Error(`Field required to stringify! but provided: ${input} `);
  }
  if (Array.isArray(input)) {
    return input.join();
  }
  return input;
}

/** make sure output is array of strings */
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
