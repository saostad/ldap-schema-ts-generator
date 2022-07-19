import { SchemaClass, SchemaAttribute } from "../services";
import path from "path";
import { pascalCase } from "change-case";
import { writeLog } from "fast-node-logger";
import {
  defaultGraphqlDir,
  defaultGraphqlClientDir,
  defaultGraphqlScalarDir,
} from "./variables";
import { mapClassAttributesIncludeInherited } from "./map-class-attributes-include-inherited";
import { writeToFile } from "./write-to-file";
import { generateGraphqlType } from "../templates/generate-graphql-type";
import { generateGraphqlResolvers } from "../templates/generate-graphql-resolvers";
import { generateGraphqlEnumTypeMap } from "../templates/generate-graphql-enum-type-map";
import { writeTsFile } from "./write-ts-file";
import { generateGraphqlClientSideDocuments } from "../templates/generate-graphql-client-side-documents";

type GenerateGraphqlTypeFilesFnInput<T extends string> = {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** output dir for schema, default folder named 'generated' in root directory of you project */
    outputFolder?: string;
    /** output extension. default .gql */
    graphqlExtension?: "gql" | "graphql";
    /** generate basic CRUD graphql resolvers. default true */
    generateResolvers?: boolean;
    /** typescript enum type-map for lDAPDisplayName and graphql field names. default true
     * @note ldap attributes can have characters that are illegal in graphql schema so instead we use pascal case of lDAPDisplayName. and here is the type map to track attributes. */
    generateEnumTypeMaps?: boolean;
    /** generate [client side documents](https://graphql-code-generator.com/docs/getting-started/documents-field). default false
     * - queries with all possible fields
     * - queries with just required fields
     * - mutations
     * - fragments for:
     *    - all fields
     *    - just required fields
     */
    generateClientSideDocuments?: boolean;
    /** directory of generated Client-Side Documents */
    clientSideOutDir?: string;
    /** use prettier to format generated files.
     * - for graphql files, default { parser: "graphql" }
     * - for typescript files, default { parser: "typescript" }
     */
    usePrettier?: boolean;
    /** list of classes to generate classes
     * - if not provided it generate all structural classes
     */
    justThisClasses?: T[];
    /** enums are pre-defined list of values and are different in each server implementation. [source](https://stackoverflow.com/questions/61900587/ldap-get-defined-enums-and-their-values-from-schema/61903016#61903016).
     *
     *
     * this flag generates graphql types based on active directory enums.
     * - it generate graphql enums in separate file and reference those in generated type and resolver files
     */
    // TODO: generateAdEnums?: boolean;
  };
};

/** generate graphql schema files for each structural class
 * @template StructuralClasses A generic parameter that controls possible values of justThisClasses array in options
 */
export async function generateGraphqlTypeFiles<
  StructuralClasses extends string = any,
>({
  objectClasses,
  objectAttributes,
  options,
}: GenerateGraphqlTypeFilesFnInput<StructuralClasses>): Promise<void> {
  writeLog(`generateGraphqlTypeFiles()`, { level: "trace" });

  let outDir = defaultGraphqlDir;
  if (options?.outputFolder) {
    outDir = options.outputFolder;
  }

  let clientSideOutDir = defaultGraphqlClientDir;
  if (options?.clientSideOutDir) {
    clientSideOutDir = options.clientSideOutDir;
  }

  let usePrettier = true;
  if (typeof options?.usePrettier === "boolean") {
    usePrettier = options.usePrettier;
  }

  let generateResolvers = true;
  if (typeof options?.generateResolvers === "boolean") {
    generateResolvers = options.generateResolvers;
  }

  let graphqlExtension = "gql";
  if (options?.graphqlExtension) {
    graphqlExtension = options.graphqlExtension;
  }

  let generateEnumTypeMaps = true;
  if (typeof options?.generateEnumTypeMaps === "boolean") {
    generateEnumTypeMaps = options.generateEnumTypeMaps;
  }

  let generateClientSideDocuments = false;
  if (typeof options?.generateClientSideDocuments === "boolean") {
    generateClientSideDocuments = options.generateClientSideDocuments;
  }

  // if outDir path not exist create it

  const promises: Promise<void>[] = [];

  const StructuralClassesWithMeta = mapClassAttributesIncludeInherited({
    attributes: objectAttributes,
    classes: objectClasses,
    options: {
      justStructuralClasses: true,
      justThisClasses: options?.justThisClasses,
    },
  });

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

    if (generateClientSideDocuments) {
      const rawDocumentsOutput = generateGraphqlClientSideDocuments({
        data: classObj,
      });

      const DocFilePath = path.join(
        clientSideOutDir,
        `${pascalCase(classObj.lDAPDisplayName)}-Documents.${graphqlExtension}`,
      );

      promises.push(
        writeToFile(rawDocumentsOutput, {
          filePath: DocFilePath,
          prettierOptions: { parser: "graphql" },
        }),
      );
    }
  });

  /**@step generate custom scalars e.g. Date */
  /** */
  let customScalarOutDir = defaultGraphqlScalarDir;
  /** because this is part of schema, it will generate same directory but in separate sub-dir to prevent from name conflict */
  if (options?.outputFolder) {
    customScalarOutDir = path.join(options.outputFolder, "scalar");
  }

  const customScalarOutDirPath = path.join(
    customScalarOutDir,
    `custom-scalar.${graphqlExtension}`,
  );
  const customScalars = `scalar Date`;

  promises.push(
    writeToFile(customScalars, {
      filePath: customScalarOutDirPath,
      prettierOptions: usePrettier ? { parser: "graphql" } : undefined,
    }),
  );

  /** @step generate all files */
  await Promise.all(promises);
  writeLog(`graphql types has been generated in dir ${outDir}`, {
    stdout: true,
  });
}
