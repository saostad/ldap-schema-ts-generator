import path from "path";
import { writeLog } from "fast-node-logger";
import { defaultEnumsDir } from "../helpers/variables";
import { writeTsFile } from "../helpers/write-ts-file";
import { SchemaClass } from "../services";

type GenerateStructuralClassesFileFnInput = {
  classes: Partial<SchemaClass>[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'StructuralClasses.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate typescript enum with name of defined structural classes */
export async function generateStructuralClassesFile({
  classes,
  options,
}: GenerateStructuralClassesFileFnInput): Promise<void> {
  writeLog(`generateStructuralClassesFile()`, { level: "trace" });

  const textToWriteToFile = `
  /** all possible Structural Classes defined in schema */
    export type StructuralClasses = ${classes
      .map((el) => `"${el.lDAPDisplayName}"`)
      .join(" | ")} ;

    /**
    * Enum for schema classes
    * @note A structural class, which is the only type of class that can have instances in Active Directory Domain Services.
    */
    export enum StructuralClassesEnum {
    ${classes
      .map(
        (el) => `
    /** 
     * - CN: ${el.cn}
     * - Object Category: ${el.objectCategory}
     * - Description: ${el.adminDescription} 
     * - governsID: ${el.governsID}
     */
    "${el.lDAPDisplayName}"= "${el.lDAPDisplayName}",
    `,
      )
      .join("")}
    }
  `;

  const outDir = options?.outDir ?? defaultEnumsDir;

  let usePrettier = true;
  if (options && options.usePrettier) {
    usePrettier = options.usePrettier;
  }
  const filePath = path.join(outDir, "StructuralClasses.ts");

  await writeTsFile(textToWriteToFile, {
    filePath,
    usePrettier,
  });
  writeLog(`StructuralClasses has been generated in ${filePath}`, {
    stdout: true,
  });
}
