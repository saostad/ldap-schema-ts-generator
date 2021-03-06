import { promises } from "fs";
import { format, Options } from "prettier";
import { writeLog } from "fast-node-logger";
import { dirPathExist } from "./utils";
import path from "path";

type WriteFileOptions = {
  filePath: string;
  /** run prettier at output before write to file. default false */
  prettierOptions?: Options;
};

/** write text to file
 * - over-write if file exist
 * - apply prettier base on config
 */
export async function writeToFile(
  rawText: string,
  { filePath, prettierOptions }: WriteFileOptions,
): Promise<void> {
  writeLog(`writeFile()`, { level: "trace" });
  let textToWriteToFile: string = rawText;

  if (prettierOptions) {
    /** run prettier at output before write to file */
    textToWriteToFile = format(rawText, prettierOptions);
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
  return promises.writeFile(filePath, textToWriteToFile, {
    encoding: "utf8",
    flag: "w",
  });
}
