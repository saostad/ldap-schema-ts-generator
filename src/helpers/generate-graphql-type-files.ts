import { SchemaClass, SchemaAttribute } from "../services";
import path from "path";
import { pascalCase } from "pascal-case";
import { writeLog } from "fast-node-logger";
import { defaultGraphqlDir } from "./variables";
import { mapClassAttributesIncludeInherited } from "./map-class-attributes-include-inherited";
import { writeToFile } from "./write-to-file";
import { generateGraphqlType } from "../templates/generate-graphql-type";
import { generateGraphqlResolvers } from "../templates/generate-graphql-resolvers";
import { generateGraphqlEnumTypeMap } from "../templates/generate-graphql-enum-type-map";
import { writeTsFile } from "./write-ts-file";

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
    /** type-map for lDAPDisplayName and graphql field names. default true
     * @note ldap attributes can have characters that are illegal in graphql schema so instead we use pascal case of lDAPDisplayName. and here is the type map to track attributes. */
    generateEnumTypeMaps?: boolean;
    /** use prettier to format generated files. default { parser: "graphql" } */
    usePrettier?: boolean;
  };
}

/** generate separate file for each class
 */
export async function generateGraphqlTypeFiles({
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

  let usePrettier = true;
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

  let generateEnumTypeMaps = true;
  if (options && options.generateEnumTypeMaps) {
    generateEnumTypeMaps = options.generateEnumTypeMaps;
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
      `${pascalCase(classObj.lDAPDisplayName)}-Type.${fileExtension}`,
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
        `${pascalCase(classObj.lDAPDisplayName)}-Resolvers.${fileExtension}`,
      );

      promises.push(
        writeToFile(rawResolversOutput, {
          filePath: resolversFilePath,
          prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
        }),
      );
    }

    if (generateEnumTypeMaps) {
      const rawEnumOutput = generateGraphqlEnumTypeMap({ data: classObj });

      const resolversFilePath = path.join(
        outDir,
        `${pascalCase(classObj.lDAPDisplayName)}-TypeMap.ts`,
      );

      promises.push(
        writeTsFile(rawEnumOutput, {
          filePath: resolversFilePath,
          usePrettier,
        }),
      );
    }
  });

  await Promise.all(promises);
  writeLog(`graphql types has been created in dir ${outDir}`, { stdout: true });
}
