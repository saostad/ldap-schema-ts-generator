import { config } from "dotenv";
import { createLogger } from "fast-node-logger";
import { typeMapper } from "./helpers/type-map";
import { getSchemaAttributes } from "./services/schema";
config();

/**
 * 1- get list of objectClass=classSchema
 * 2-1 look at mustContain, systemMustContain, mayContain, and systemMayContain
 * 2-2 get list of objectClass=attributeSchema
 * 3- foreach 2-1
 * 4- create type for each attribute using type mapper fn
 * 5-
 */

async function main() {
  const logger = await createLogger({ level: "trace" });

  const objectAttributes = await getSchemaAttributes({ logger });

  objectAttributes.forEach((el) => typeMapper(el?.attributeSyntax as string));
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
