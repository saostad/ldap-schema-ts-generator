import { OID } from "../typings/general/types";
import path from "path";
import { writeLog } from "fast-node-logger";
import { getLdapOids } from "../services/ldap-oid";
import { defaultEnumsDir } from "../helpers/variables";
import { writeTsFile } from "../helpers/write-ts-file";

type GenerateControlsFileFnInput = {
  controls: OID[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaControls.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

export async function generateControlsFile({
  controls,
  options,
}: GenerateControlsFileFnInput): Promise<void> {
  writeLog(`generateControlsFile()`, { level: "trace" });
  const allOids = await getLdapOids({ useCache: true });

  const oids = controls.map((el) => {
    const oidItem = allOids.find((oid) => oid.OID === el);
    return {
      oid: el,
      purpose: oidItem?.Purpose,
      source: oidItem?.Source,
    };
  });

  const textToWriteToFile = `
    /**
    * Enum for schema controls
    */
    export enum SchemaControls {
    ${oids
      .map(
        (el) => `
    /** 
     * - Purpose: ${el.purpose} 
     * - Source: ${el.source} */
    "${el.oid}"= "${el.oid}",
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
  const filePath = path.join(outDir, "SchemaControls.ts");

  await writeTsFile(textToWriteToFile, {
    filePath,
    usePrettier,
  });
  writeLog(`SchemaControls has been created in ${filePath}`, { stdout: true });
}
