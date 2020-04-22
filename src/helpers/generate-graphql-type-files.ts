import { SchemaClass, SchemaAttribute } from "../services";
import path from "path";
import { pascalCase } from "pascal-case";
import { writeLog } from "fast-node-logger";
import { defaultGraphqlDir } from "./variables";
import { mapClassAttributesIncludeInherited } from "./map-class-attributes-include-inherited";
import { writeToFile } from "./write-to-file";
import { Options } from "prettier";
import { generateGraphqlType } from "../templates/generate-graphql-type";

interface GenerateInterfaceFilesFnInput {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** default generated folder of root directory of you project */
    outputFolder?: string;
    /** use prettier to format generated files. default { parser: "graphql" } */
    usePrettier?: Options;
  };
}

/** generate separate file for each class
 */
export async function generateGraphQlTypeFiles({
  objectClasses,
  objectAttributes,
  options,
}: GenerateInterfaceFilesFnInput): Promise<void> {
  writeLog(`generateInterfaceFiles()`, { level: "trace" });
  /** place holder for output directory */
  let outDir = defaultGraphqlDir;
  if (options && options.outputFolder) {
    outDir = options.outputFolder;
  }

  let usePrettier: Options = { parser: "graphql" };
  if (options && options.usePrettier) {
    usePrettier = options.usePrettier;
  }

  const promises: Promise<void>[] = [];

  const classesWithInheritedAttributes = mapClassAttributesIncludeInherited({
    attributes: objectAttributes,
    classes: objectClasses,
  });

  classesWithInheritedAttributes.forEach((classObj) => {
    const rawOutput = generateGraphqlType({ data: classObj });

    const filePath = path.join(
      outDir,
      `${pascalCase(classObj.lDAPDisplayName as string)}.gql`,
    );

    promises.push(
      writeToFile(rawOutput, {
        filePath,
        prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
      }),
    );
  });

  await Promise.all(promises);
  writeLog(`graphql types has been created in dir ${outDir}`, { stdout: true });
}
