import { SchemaClass, SchemaAttribute } from "../services";
import { mapClassAttributes } from "./map-class-attributes";
import { generateClassInterface } from "../templates/generate-class-interface";
import path from "path";
import { pascalCase } from "pascal-case";
import { writeTsFile } from "./write-ts-file";
import { writeLog } from "fast-node-logger";
import { defaultInterfacesDir } from "./variables";

interface GenerateInterfaceFilesFnInput {
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
 */
export async function generateInterfaceFiles({
  objectClasses,
  objectAttributes,
  options,
}: GenerateInterfaceFilesFnInput): Promise<void> {
  writeLog(`generateInterfaceFiles()`, { level: "trace" });
  /** place holder for output directory */
  let outDir = defaultInterfacesDir;
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

    const filePath = path.join(
      outDir,
      `${pascalCase(classObj.lDAPDisplayName as string)}.ts`,
    );

    promises.push(writeTsFile(rawOutput, { filePath, usePrettier }));
  });

  await Promise.all(promises);
  writeLog(`interfaces has been created in dir ${outDir}`, { stdout: true });

  /** create index file for output directory */
  if (indexFile) {
    const indexFileContent = `${objectClasses
      .map(
        (el) =>
          `export * from './${pascalCase(el.lDAPDisplayName as string)}';`,
      )
      .join("")}`;

    await writeTsFile(indexFileContent, {
      filePath: path.join(outDir, "index.ts"),
    });
  }
}
