import { OID } from "../typings/general/types";
import path from "path";
import { writeLog } from "fast-node-logger";
import { getLdapOids } from "../services/ldap-oid";
import { defaultEnumsDir } from "../helpers/variables";
import { writeTsFile } from "../helpers/write-ts-file";

type GenerateCapabilitiesFileFnInput = {
  capabilities: OID[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaCapabilities.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate typescript enum for defined capability OIDs */
export async function generateCapabilitiesFile({
  capabilities,
  options,
}: GenerateCapabilitiesFileFnInput): Promise<void> {
  writeLog(`generateCapabilitiesFile()`, { level: "trace" });
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
  /** all possible capabilities defined in schema */
    export type SchemaCapabilities = ${oids
      .map((el) => `"${el.oid}"`)
      .join(" | ")} ;

    /**
    * Enum for schema capabilities
    */
    export enum SchemaCapabilitiesEnum {
    ${oids
      .map(
        (el) => `
    /** 
     * - Purpose: ${el.purpose} 
     * - Source: ${el.source} 
     */
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
  writeLog(`Schema Capabilities has been generated in ${filePath}`, {
    stdout: true,
  });
}
