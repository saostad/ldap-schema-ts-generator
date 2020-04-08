import { OID } from "../typings/general/types";
import { getLdapOids } from "./ldap-oid";
import { writeTsFile } from "./write-ts-file";
import { defaultEnumsDir } from "./variables";
import path from "path";
import { writeLog } from "fast-node-logger";

interface GenerateExtensionsFileFnInput {
  extensions: OID[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaExtensions.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
}

export async function generateExtensionsFile({
  extensions,
  options,
}: GenerateExtensionsFileFnInput): Promise<void> {
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
    /**
    * Enum for schema extensions
    */
    export enum SchemaExtensions {
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