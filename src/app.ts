import { config } from "dotenv";
config();
import { createLogger } from "fast-node-logger";
import {
  getSchemaAttributes,
  getSchemaClasses,
  generateInterfaceFiles,
  generateControlsFile,
  getSchemaControls,
  getSchemaCapabilities,
  generateCapabilitiesFile,
  getSchemaExtensions,
  generateExtensionsFile,
  generatePoliciesFile,
} from "./index";
import { getSchemaPolicies } from "./services";

export async function main() {
  const logger = await createLogger({
    level: "trace",
    prettyPrint: { colorize: true },
  });

  const schemaDn = "CN=Schema,CN=Configuration,DC=ki,DC=local";
  const options = {
    user: process.env.AD_USER ?? "",
    pass: process.env.AD_Pass ?? "",
    ldapServerUrl: process.env.AD_URI ?? "",
    logger,
  };

  const controls = await getSchemaControls({ options });
  await generateControlsFile({ controls });

  const extensions = await getSchemaExtensions({ options });
  await generateExtensionsFile({ extensions });

  const capabilities = await getSchemaCapabilities({ options });
  await generateCapabilitiesFile({ capabilities });

  const policies = await getSchemaPolicies({ options });
  await generatePoliciesFile({ policies });

  const objectAttributes = await getSchemaAttributes({ schemaDn, options });

  const objectClasses = await getSchemaClasses({ schemaDn, options });

  await generateInterfaceFiles({ objectAttributes, objectClasses });
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
