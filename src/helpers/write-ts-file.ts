import { promises } from "fs";
import { format } from "prettier";

// TODO: add option to enable prettier and eslint fto apply on raw output
interface Options {
  outFile: string;
}

export async function writeTsFile(
  rawOutput: string,
  { outFile }: Options,
): Promise<void> {
  /** run prettier at output before write to file */
  const prettifiedOutput = format(rawOutput, { parser: "typescript" });

  /** // TODO: run eslint on output */

  /** write to file.
   * over write if exist
   */
  promises.writeFile(outFile, prettifiedOutput, {
    encoding: "utf8",
    flag: "w",
  });
}
