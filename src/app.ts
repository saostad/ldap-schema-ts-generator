import { config } from "dotenv";
import { createLogger } from "fast-node-logger";
import { getSchemaAttributes, getSchemaClasses } from "./services/schema";
import { mapClassAttributes } from "./helpers/map-class-attributes";
import path from "path";
import { generateClassInterface } from "./helpers/generate-class-interface";
import { writeTsFile } from "./helpers/write-ts-file";
config();

/**
 * 1- get list of objectClass=classSchema
 * 2 get list of objectClass=attributeSchema
 * 3-1 look at mustContain, systemMustContain, mayContain, and systemMayContain
 * 3-2 map attributes with class object
 */

const schemaDn = "CN=Schema,CN=Configuration,DC=ki,DC=local";

async function main() {
  const logger = await createLogger({ level: "trace" });

  const objectAttributes = await getSchemaAttributes({ schemaDn, logger });

  const objectClasses = await getSchemaClasses({ schemaDn, logger });

  /** now we have everything we need
   * it's time to generate typescript types:
   * 1- create string template
   * 2- generate type for each class
   * 3- type-map each attribute
   * 4-1 generate separate file for each class
   * 4-2 maybe create a class for class object and pre-define CRUD operation like ORM
   */

  const promises: Promise<any>[] = [];

  objectClasses.forEach((classObj) => {
    const classWithAttributes = mapClassAttributes({
      attributes: objectAttributes,
      classObj,
    });
    const rawOutput = generateClassInterface({ data: classWithAttributes });
    const outFile = path.join(process.cwd(), "generated", `${classObj.cn}.ts`);

    promises.push(writeTsFile(rawOutput, { outFile }));
  });

  Promise.all(promises);
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
