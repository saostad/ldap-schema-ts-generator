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
  getSchemaPolicies,
  getSchemaNamingContext,
  getLinkIds,
} from "./index";

export async function main() {
  const logger = await createLogger({
    level: "trace",
    prettyPrint: { colorize: true },
  });

  const options = {
    user: process.env.AD_USER ?? "",
    pass: process.env.AD_Pass ?? "",
    ldapServerUrl: process.env.AD_URI ?? "",
    logger,
  };

  const schemaDn = await getSchemaNamingContext({ options });

  const linkIds = await getLinkIds({ options, schemaDn });
  linkIds.sort((a, b) => Number(a.linkID) - Number(b.linkID));
  console.log(`File: app.ts,`, `Line: 37 => `, linkIds[0], linkIds[1]);

  // const controls = await getSchemaControls({ options });
  // await generateControlsFile({ controls });

  // const extensions = await getSchemaExtensions({ options });
  // await generateExtensionsFile({ extensions });

  // const capabilities = await getSchemaCapabilities({ options });
  // await generateCapabilitiesFile({ capabilities });

  // const policies = await getSchemaPolicies({ options });
  // await generatePoliciesFile({ policies });

  // const objectAttributes = await getSchemaAttributes({ schemaDn, options });

  // const objectClasses = await getSchemaClasses({ schemaDn, options });

  // await generateInterfaceFiles({ objectAttributes, objectClasses });
}
main().catch((err) => {
  console.log(`File: app.ts,`, `Line: 48 => `, err);
});
