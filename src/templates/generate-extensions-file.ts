import { OID } from "../typings/general/types";
import path from "path";
import { writeLog } from "fast-node-logger";
import { getLdapOids } from "../services/ldap-oid";
import { defaultEnumsDir } from "../helpers/variables";
import { writeTsFile } from "../helpers/write-ts-file";

type GenerateExtensionsFileFnInput = {
  extensions: OID[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaExtensions.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate typescript enum for defined extension OIDs */
export async function generateExtensionsFile({
  extensions,
  options,
}: GenerateExtensionsFileFnInput): Promise<void> {
  writeLog(`generateExtensionsFile()`, { level: "trace" });
  const allOids = await getLdapOids({ useCache: true });

  const oids = extensions.map((el) => {
    const oidItem = allOids.find((oid) => oid.OID === el);
    return {
      oid: el,
      purpose: oidItem?.Purpose,
      source: oidItem?.Source,
    };
  });

  const textToWriteToFile = `
  /** all possible extensions defined in schema */
    export type SchemaExtensions = ${oids
      .map((el) => `"${el.oid}"`)
      .join(" | ")} ;

    /**
    * Enum for schema extensions
    */
    export enum SchemaExtensionsEnum {
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
  const filePath = path.join(outDir, "SchemaExtensions.ts");

  await writeTsFile(textToWriteToFile, {
    filePath,
    usePrettier,
  });
  writeLog(`SchemaExtensions has been created in ${filePath}`, {
    stdout: true,
  });
}
