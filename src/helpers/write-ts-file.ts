import { promises } from "fs";
import { format } from "prettier";
import { writeLog } from "fast-node-logger";
import { dirPathExist } from "./utils";
import path from "path";

interface Options {
  filePath: string;
  usePrettier?: boolean;
}

/** apply prettier write text to file */
export async function writeTsFile(
  rawText: string,
  { filePath, usePrettier }: Options,
): Promise<void> {
  writeLog(`writeTsFile()`, { level: "trace" });
  let textToWriteToFile: string = rawText;

  if (usePrettier !== false) {
    /** run prettier at output before write to file */
    textToWriteToFile = format(rawText, { parser: "typescript" });
  }

  /** make sure target directory exist */
  const isExist = await dirPathExist(filePath);
  if (!isExist) {
    throw new Error(
      `destination folder ${path.dirname(
        filePath,
      )} not exist. please create it first.`,
    );
  }

  /** write to file.
   * over-write if file exist
   */
  promises.writeFile(filePath, textToWriteToFile, {
    encoding: "utf8",
    flag: "w",
  });
}
