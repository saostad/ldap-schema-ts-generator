import { SchemaClass, SchemaAttribute } from "../services/schema";
import { mapClassAttributes } from "./map-class-attributes";
import { generateClassInterface } from "./generate-class-interface";
import path from "path";
import { pascalCase } from "pascal-case";
import { writeTsFile } from "./write-ts-file";

export interface GenerateInterfaceFilesFnInput {
  objectClasses: Partial<SchemaClass>[];
  objectAttributes: Partial<SchemaAttribute>[];
  options?: {
    /** default generated folder of root directory of you project */
    outputFolder?: string;
    /** use prettier to format generated files. default true */
    usePrettier?: boolean;
    /** create index file for output folder. default true */
    indexFile: boolean;
  };
}

/** generate separate file for each class
 * // TODO: create index file for output folder
 */
export async function generateInterfaceFiles({
  objectClasses,
  objectAttributes,
  options,
}: GenerateInterfaceFilesFnInput): Promise<void> {
  /** place holder for output directory */
  let outDir = path.join(process.cwd(), "generated");
  if (options && options.outputFolder) {
    outDir = options.outputFolder;
  }

  let usePrettier = true;
  if (options && options.usePrettier) {
    usePrettier = options.usePrettier;
  }

  let indexFile = true;
  if (options && options.indexFile) {
    indexFile = options.indexFile;
  }

  const promises: Promise<void>[] = [];

  objectClasses.forEach((classObj) => {
    const classWithAttributes = mapClassAttributes({
      attributes: objectAttributes,
      classObj,
    });
    const rawOutput = generateClassInterface({ data: classWithAttributes });

    const outFile = path.join(
      outDir,
      `${pascalCase(classObj.lDAPDisplayName as string)}.ts`,
    );

    promises.push(writeTsFile(rawOutput, { outFile, usePrettier }));
  });

  await Promise.all(promises);

  /** create index file for output directory */
  if (indexFile) {
    const indexFileContent = `${objectClasses
      .map(
        (el) =>
          `export * from './${pascalCase(el.lDAPDisplayName as string)}';`,
      )
      .join("")}`;

    await writeTsFile(indexFileContent, {
      outFile: path.join(outDir, "index.ts"),
    });
  }
}
