import path from "path";
import { writeLog } from "fast-node-logger";
import { defaultJsonDir } from "../helpers/variables";
import { Relation } from "../services/link-id";
import { writeToFile } from "../helpers/write-to-file";

type GenerateRelationsFileFnInput = {
  relations: Relation[];
  options?: {
    /** output directory of file. default directory named "json"
     *  - Note: at this point file name hard coded to "SchemaRelations.json" to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate json file for defined relations between attributes by process linkIds fields */
export async function generateRelationsFile({
  relations,
  options,
}: GenerateRelationsFileFnInput): Promise<void> {
  writeLog(`generateRelationsFile()`, { level: "trace" });

  const textToWriteToFile = JSON.stringify(relations);

  const outDir = options?.outDir ?? defaultJsonDir;

  let usePrettier = true;
  if (options && options.usePrettier) {
    usePrettier = options.usePrettier;
  }
  const filePath = path.join(outDir, "SchemaRelations.json");

  await writeToFile(textToWriteToFile, {
    filePath,
    prettierOptions: usePrettier ? { parser: "json-stringify" } : undefined,
  });
  writeLog(`SchemaRelations has been created in ${filePath}`, {
    stdout: true,
  });
}
