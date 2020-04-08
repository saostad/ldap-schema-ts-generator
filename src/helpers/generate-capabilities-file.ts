import { OID } from "../typings/general/types";
import { getLdapOids } from "./ldap-oid";
import { writeTsFile } from "./write-ts-file";
import { defaultEnumsDir } from "./variables";
import path from "path";
import { writeLog } from "fast-node-logger";

interface GenerateCapabilitiesFileFnInput {
  capabilities: OID[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaCapabilities.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
}

export async function generateCapabilitiesFile({
  capabilities,
  options,
}: GenerateCapabilitiesFileFnInput): Promise<void> {
  const allOids = await getLdapOids({ useCache: true });

  const oids = capabilities.map((el) => {
    const oidItem = allOids.find((oid) => oid.OID === el);
    return {
      oid: el,
      purpose: oidItem?.Purpose,
      source: oidItem?.Source,
    };
  });

  const textToWriteToFile = `
    /**
    * Enum for schema capabilities
    */
    export enum SchemaCapabilities {
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
  const filePath = path.join(outDir, "SchemaCapabilities.ts");

  await writeTsFile(textToWriteToFile, {
    filePath,
    usePrettier,
  });
  writeLog(`SchemaCapabilities has been created in ${filePath}`, {
    stdout: true,
  });
}
