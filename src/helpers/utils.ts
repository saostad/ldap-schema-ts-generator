import { writeLog } from "fast-node-logger";

export function stringifyProp(input?: string | string[]): string {
  writeLog(`stringifyProp()`);
  if (!input) {
    throw new Error(`Field not exist`);
  }
  if (Array.isArray(input)) {
    return input.join();
  }
  return input;
}

export function arrayifyProp(input?: string | string[]): string[] {
  writeLog(`arrayifyProp()`);
  if (!input) {
    throw new Error(`Field not exist to arrayify`);
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
