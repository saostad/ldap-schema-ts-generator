import { writeLog } from "fast-node-logger";

/** make sure output is string */
export function stringifyProp(input: string | string[]): string {
  writeLog(`stringifyProp()`);
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
  writeLog(`arrayifyProp()`);
  if (!input) {
    throw new Error(`Field required to arrayify`);
  }
  if (typeof input === "string") {
    return [input];
  }
  return input;
}

export function ldapBooleanToJsBoolean(input: string): boolean {
  if (input === "TRUE") {
    return true;
  }
  return false;
}
