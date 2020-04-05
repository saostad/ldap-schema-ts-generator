import { config } from "dotenv";
import { createLogger } from "fast-node-logger";
import { getSchemaAttributes, getSchemaClasses } from "./services/schema";
import { mapClassAttributes } from "./helpers/map-class-attributes";
config();

/**
 * 1- get list of objectClass=classSchema
 * 2-1 look at mustContain, systemMustContain, mayContain, and systemMayContain
 * 2-2 get list of objectClass=attributeSchema
 * 3- map attributes with class object
 */

const schemaDn = "CN=Schema,CN=Configuration,DC=ki,DC=local";

async function main() {
  const logger = await createLogger({ level: "trace" });

  const objectAttributes = await getSchemaAttributes({ schemaDn, logger });

  const objectClasses = await getSchemaClasses({ schemaDn, logger });

  const classWithAtts = mapClassAttributes({
    attributes: objectAttributes,
    classObj: objectClasses[0],
  });

  /** now we have everything we need
   * it's time to generate typescript types:
   * 1- create handlebar template
   * 2- generate type for each attribute
   * 3- generate type for each class
   * 4- maybe create a class for class object and pre-define CRUD operation like ORM
   */
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
