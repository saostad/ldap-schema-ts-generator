import path from "path";
import { writeLog } from "fast-node-logger";
import { getLdapPolicies } from "../services/ldap-policy";
import { defaultEnumsDir } from "../helpers/variables";
import { writeTsFile } from "../helpers/write-ts-file";

type GeneratePoliciesFileFnInput = {
  policies: string[];
  options?: {
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaExtensions.ts' to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate typescript enum for defined policies */
export async function generatePoliciesFile({
  policies,
  options,
}: GeneratePoliciesFileFnInput): Promise<void> {
  writeLog(`generatePoliciesFile()`, { level: "trace" });
  const allPolicies = await getLdapPolicies({ useCache: true });

  const policiesWithMeta = policies.map((el) => {
    const policyItem = allPolicies.find(
      (policy) => policy["Policy name"] === el,
    );
    return {
      policy: el,
      description: policyItem?.Description,
      defaultValue: policyItem?.["Default value"],
    };
  });

  const textToWriteToFile = `
    /**
    * Enum for schema policy
    */
    export enum SchemaPolicies {
    ${policiesWithMeta
      .map(
        (el) => `
    /** 
     * - Default: ${el.defaultValue} 
     * - Description: ${el.description} */
    "${el.policy}"= "${el.policy}",
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
  const filePath = path.join(outDir, "SchemaPolicies.ts");

  await writeTsFile(textToWriteToFile, {
    filePath,
    usePrettier,
  });
  writeLog(`SchemaPolicies has been created in ${filePath}`, {
    stdout: true,
  });
}
