import { SchemaClass, SchemaAttribute } from "../services";
import path from "path";
import { pascalCase } from "pascal-case";
import { writeLog } from "fast-node-logger";
import { defaultGraphqlDir } from "./variables";
import { mapClassAttributesIncludeInherited } from "./map-class-attributes-include-inherited";
import { writeToFile } from "./write-to-file";
import { Options } from "prettier";
import { generateGraphqlType } from "../templates/generate-graphql-type";
import { generateGraphqlResolvers } from "../templates/generate-graphql-resolvers";

interface GenerateInterfaceFilesFnInput {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** default generated folder of root directory of you project */
    outputFolder?: string;
    /** output extension. default .gql */
    fileExtension: "gql" | "graphql";
    /** generate basic CRUD graphql resolvers. default true */
    generateResolvers?: boolean;
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

  let generateResolvers = true;
  if (options && options.generateResolvers) {
    generateResolvers = options.generateResolvers;
  }

  let fileExtension = "gql";
  if (options && options.fileExtension) {
    fileExtension = options.fileExtension;
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
      `${pascalCase(classObj.lDAPDisplayName as string)}.${fileExtension}`,
    );

    promises.push(
      writeToFile(rawOutput, {
        filePath,
        prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
      }),
    );

    if (generateResolvers) {
      const rawResolversOutput = generateGraphqlResolvers({ data: classObj });

      const resolversFilePath = path.join(
        outDir,
        `${pascalCase(classObj.lDAPDisplayName as string)}-Resolvers.gql`,
      );

      promises.push(
        writeToFile(rawResolversOutput, {
          filePath: resolversFilePath,
          prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
        }),
      );
    }
  });

  await Promise.all(promises);
  writeLog(`graphql types has been created in dir ${outDir}`, { stdout: true });
}
