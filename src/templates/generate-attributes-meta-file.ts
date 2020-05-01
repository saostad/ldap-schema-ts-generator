import { writeTsFile } from "../helpers/write-ts-file";
import { defaultMetaDir, defaultJsonDir } from "../helpers/variables";
import path from "path";
import { writeToFile } from "../helpers/write-to-file";
import type { SchemaAttribute } from "../services/attribute";
import { ldapBooleanToJsBoolean, escapeString } from "../helpers/utils";
import { writeLog } from "fast-node-logger";
import { jsTypeMapper, graphqlTypeMapper } from "../helpers/type-map";

type GenerateAttributesMetaFnInput = {
  attributes: Partial<SchemaAttribute>[];
  options?: {
    /** default true */
    generateTsFile?: boolean;
    /** default false */
    generateJsonFile?: boolean;
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaAttributes.ts' to prevent conflict with other generated files
     */
    tsFileOutDir?: string;
    /** output directory of file.
     *  - Note: at this point file name hard coded to 'SchemaAttributes.json' to prevent conflict with other generated files
     */
    jsonFileOutDir?: string;
  };
};
/** generate schema defined attributes with meta data
 * - set options for output format
 */
export async function generateAttributesMeta({
  attributes,
  options,
}: GenerateAttributesMetaFnInput) {
  let generateTsFile = true;
  if (typeof options?.generateTsFile === "boolean") {
    generateTsFile = options.generateTsFile;
  }

  let generateJsonFile = true;
  if (typeof options?.generateJsonFile === "boolean") {
    generateJsonFile = options.generateJsonFile;
  }

  const tsFileOutDir = options?.tsFileOutDir ?? defaultMetaDir;

  const jsonFileOutDir = options?.jsonFileOutDir ?? defaultJsonDir;

  const attributesArray = `{
    ${attributes
      .map(
        (el) => `
      "${el.lDAPDisplayName}": {
        "cn": "${el.cn}", 
        "dn": "${el.dn}",
        "adminDisplayName": "${el.adminDisplayName}",
        "adminDescription": "${escapeString(el.adminDescription ?? "")}",
        "attributeID": "${el.attributeID}", 
        "attributeSyntax": "${el.attributeSyntax}",
        "systemOnly": ${ldapBooleanToJsBoolean(el.systemOnly!)},
        "showInAdvancedViewOnly": ${
          el.showInAdvancedViewOnly
            ? ldapBooleanToJsBoolean(el.showInAdvancedViewOnly)
            : false
        },
        "jsType": "${jsTypeMapper(el.attributeSyntax!)}",
        "gqlType": "${graphqlTypeMapper(el.attributeSyntax!)}",
      }`,
      )
      .join(",")}}`;

  if (generateTsFile) {
    const tsRawText = `
      export const schemaAttributes = ${attributesArray}
    `;
    const tsFilePath = path.join(tsFileOutDir, "SchemaAttributes.ts");
    await writeTsFile(tsRawText, { filePath: tsFilePath });
    writeLog(`Schema Attributes has been generated in ${tsFilePath}`, {
      stdout: true,
    });
  }

  if (generateJsonFile) {
    const jsonRawText = `${attributesArray}`;

    const jsonFilePath = path.join(jsonFileOutDir, "SchemaAttributes.json");
    await writeToFile(jsonRawText, {
      filePath: jsonFilePath,
      prettierOptions: { parser: "json" },
    });
    writeLog(`Schema Attributes has been generated in ${jsonFilePath}`, {
      stdout: true,
    });
  }
}
