import { config } from "dotenv";
config();
import { createLogger } from "fast-node-logger";
import {
  getSchemaAttributes,
  getSchemaClasses,
  generateInterfaceFiles,
} from "./index";

async function main() {
  const logger = await createLogger({ level: "trace" });

  const schemaDn = "CN=Schema,CN=Configuration,DC=ki,DC=local";
  const options = {
    user: process.env.AD_USER ?? "",
    pass: process.env.AD_Pass ?? "",
    ldapServerUrl: process.env.AD_URI ?? "",
    logger,
  };

  const objectAttributes = await getSchemaAttributes({ schemaDn, options });

  const objectClasses = await getSchemaClasses({ schemaDn, options });

  await generateInterfaceFiles({ objectAttributes, objectClasses });
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
