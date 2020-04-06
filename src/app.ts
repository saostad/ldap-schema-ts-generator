import { config } from "dotenv";
import { createLogger } from "fast-node-logger";
import { getSchemaAttributes, getSchemaClasses } from "./services/schema";
import { mapClassAttributes } from "./helpers/map-class-attributes";
import fs from "fs";
import path from "path";
import { generate } from "./helpers/generateText";
import prettier from "prettier";
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

  // const objectAttributes = await getSchemaAttributes({ schemaDn, logger });

  // const objectClasses = await getSchemaClasses({ schemaDn, logger });

  // const classWithAtts = mapClassAttributes({
  //   attributes: objectAttributes,
  //   classObj: objectClasses[0],
  // });

  /** now we have everything we need
   * it's time to generate typescript types:
   * 1- create handlebar template
   * 2- generate type for each attribute
   * 3- generate type for each class
   * 4- maybe create a class for class object and pre-define CRUD operation like ORM
   */

  const interfaceName = "AttributeName";
  const rawOutput = generate({ interfaceName });

  /** run prettier at output before write to file */
  const output = prettier.format(rawOutput, { parser: "typescript" });

  /** write to file.
   * over write if exist
   */
  fs.writeFileSync(path.join(process.cwd(), "generated", "out.ts"), output, {
    encoding: "utf8",
    flag: "w",
  });
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
