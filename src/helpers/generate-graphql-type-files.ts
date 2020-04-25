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

type GenerateGraphqlTypeFilesFnInput<T = any> = {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** default folder named 'generated' in root directory of you project */
    outputFolder?: string;
    /** output extension. default .gql */
    graphqlExtension?: "gql" | "graphql";
    /** generate basic CRUD graphql resolvers. default true */
    generateResolvers?: boolean;
    /** typescript enum type-map for lDAPDisplayName and graphql field names. default true
     * @note ldap attributes can have characters that are illegal in graphql schema so instead we use pascal case of lDAPDisplayName. and here is the type map to track attributes. */
    generateEnumTypeMaps?: boolean;
    /** use prettier to format generated files.
     * - for graphql files, default { parser: "graphql" }
     * - for typescript files, default { parser: "typescript" }
     */
    usePrettier?: boolean;
    /** list of classes to generate classes
     * - if not provided it generate all structural classes
     */
    // justThisClasses?: string[];
    justThisClasses?: T[];
  };
};

/** generate graphql schema files for each structural class
 * @template StructuralClasses A generic parameter that controls possible values of options.justThisClasses array
 */
export async function generateGraphqlTypeFiles<StructuralClasses = any>({
  objectClasses,
  objectAttributes,
  options,
}: GenerateGraphqlTypeFilesFnInput<StructuralClasses>): Promise<void> {
  writeLog(`generateGraphqlTypeFiles()`, { level: "trace" });

  let outDir = defaultGraphqlDir;
  if (options?.outputFolder) {
    outDir = options.outputFolder;
  }

  let usePrettier = true;
  if (options?.usePrettier) {
    usePrettier = options.usePrettier;
  }

  let generateResolvers = true;
  if (options?.generateResolvers) {
    generateResolvers = options.generateResolvers;
  }

  let graphqlExtension = "gql";
  if (options?.graphqlExtension) {
    graphqlExtension = options.graphqlExtension;
  }

  let generateEnumTypeMaps = true;
  if (options?.generateEnumTypeMaps) {
    generateEnumTypeMaps = options.generateEnumTypeMaps;
  }

  const promises: Promise<void>[] = [];

  let StructuralClassesWithMeta = mapClassAttributesIncludeInherited({
    attributes: objectAttributes,
    classes: objectClasses,
    options: {
      justStructuralClasses: true,
    },
  });

  if (options?.justThisClasses) {
    StructuralClassesWithMeta = StructuralClassesWithMeta.filter((el) =>
      // @ts-ignore
      options.justThisClasses?.includes(el.lDAPDisplayName),
    );
  }

  StructuralClassesWithMeta.forEach((classObj) => {
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
