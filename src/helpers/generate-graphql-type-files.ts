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

type GenerateGraphqlTypeFilesFnInput = {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** default generated folder of root directory of you project */
    outputFolder?: string;
    /** output extension. default .gql */
    graphqlExtension: "gql" | "graphql";
    /** generate basic CRUD graphql resolvers. default true */
    generateResolvers?: boolean;
    /** type-map for lDAPDisplayName and graphql field names. default true
     * @note ldap attributes can have characters that are illegal in graphql schema so instead we use pascal case of lDAPDisplayName. and here is the type map to track attributes. */
    generateEnumTypeMaps?: boolean;
    /** use prettier to format generated files. default { parser: "graphql" } */
    usePrettier?: boolean;
    /** list of classes included classes
     * - if not provided it generate all structural classes
     */
    includedClasses?: string[];
  };
};

/** generate graphql schema files for each object class */
export async function generateGraphqlTypeFiles({
  objectClasses,
  objectAttributes,
  options,
}: GenerateGraphqlTypeFilesFnInput): Promise<void> {
  writeLog(`generateGraphqlTypeFiles()`, { level: "trace" });
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

  let graphqlExtension = "gql";
  if (options && options.graphqlExtension) {
    graphqlExtension = options.graphqlExtension;
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

    const typeFilePath = path.join(
      outDir,
      `${pascalCase(classObj.lDAPDisplayName)}-Type.${graphqlExtension}`,
    );

    promises.push(
      writeToFile(rawOutput, {
        filePath: typeFilePath,
        prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
      }),
    );

    if (generateResolvers) {
      const rawResolversOutput = generateGraphqlResolvers({ data: classObj });

      const resolversFilePath = path.join(
        outDir,
        `${pascalCase(classObj.lDAPDisplayName)}-Resolvers.${graphqlExtension}`,
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

      const typeMapFilePath = path.join(
        outDir,
        `${pascalCase(classObj.lDAPDisplayName)}-TypeMap.ts`,
      );

      promises.push(
        writeTsFile(rawEnumOutput, {
          filePath: typeMapFilePath,
          usePrettier,
        }),
      );
    }
  });

  await Promise.all(promises);
  writeLog(`graphql types has been generated in dir ${outDir}`, {
    stdout: true,
  });
}
