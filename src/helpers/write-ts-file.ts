import { promises } from "fs";
import { format } from "prettier";
import { writeLog } from "fast-node-logger";

interface Options {
  outFile: string;
  usePrettier?: boolean;
}

export async function writeTsFile(
  rawText: string,
  { outFile, usePrettier }: Options,
): Promise<void> {
  writeLog(`writeTsFile()`, { level: "trace" });
  let textToWriteToFile: string = rawText;

  if (usePrettier !== false) {
    /** run prettier at output before write to file */
    textToWriteToFile = format(rawText, { parser: "typescript" });
  }

  /** write to file.
   * over-write if file exist
   */
  promises.writeFile(outFile, textToWriteToFile, {
    encoding: "utf8",
    flag: "w",
  });
}
