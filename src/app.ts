import { Client, IClientConfig } from "ldap-ts-client";
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
  getRelations,
  generateRelationsFile,
  Types,
  mapClassAttributesIncludeInherited,
  generateGraphqlTypeFiles,
  getStructuralSchemaClasses,
  generateStructuralClassesFile,
  generateAttributesMeta,
  generateCountryIsoCodesFile,
  getCountryIsoCodes,
  getRootNamingContext,
  getConfigurationNamingContext,
  getSupportedSaslMechanisms,
  getDefaultNamingContext,
  getNamingContexts,
  getRootDSE,
  getSchemaClassByLdapName,
  getSubSchemaSubEntry,
  getSupportedLdapVersions,
} from "./index";
import {
  StructuralClasses,
  StructuralClassesEnum,
} from "./generated/StructuralClasses";

export async function main() {
  const logger = await createLogger({
    level: "trace",
    prettyPrint: { colorize: true },
  });

  const options: IClientConfig = {
    user: process.env.AD_USER ?? "",
    pass: process.env.AD_Pass ?? "",
    ldapServerUrl: process.env.AD_URI ?? "",
    logger,
  };
  const client = new Client(options);
  try {
    const schemaDn = await getSchemaNamingContext({
      client,
      options: { logger },
    });
    console.log(`File: app.ts,`, `Line: 51 => `, schemaDn);

    const rootDn = await getRootNamingContext({
      client,
      options: { logger },
    });
    console.log(`File: app.ts,`, `Line: 61 => `, rootDn);

    const configurationsDn = await getConfigurationNamingContext({
      client,
      options: { logger },
    });
    console.log(`File: app.ts,`, `Line: 68 => `, configurationsDn);

    const linkIds = await getLinkIds({ options: { logger }, client });
    const relations = getRelations(linkIds);
    await generateRelationsFile({ relations });

    const controls = await getSchemaControls({ client, options: { logger } });
    await generateControlsFile({ controls });

    const extensions = await getSchemaExtensions({
      client,
      options: { logger },
    });
    await generateExtensionsFile({ extensions });

    const capabilities = await getSchemaCapabilities({
      client,
      options: { logger },
    });
    await generateCapabilitiesFile({ capabilities });

    const policies = await getSchemaPolicies({ client, options: { logger } });
    await generatePoliciesFile({ policies });

    const classes = await getStructuralSchemaClasses({
      client,
      options: { logger },
    });
    await generateStructuralClassesFile({ classes });

    const countryCodes = await getCountryIsoCodes({ useCache: true });
    await generateCountryIsoCodesFile({ countryCodes });

    const objectAttributes = await getSchemaAttributes({
      client,
      options: { logger },
    });
    const objectClasses = await getSchemaClasses({
      client,
      options: { logger },
    });

    await generateAttributesMeta({
      attributes: objectAttributes,
      options: {
        generateJsonFile: true,
        generateTsFile: true,
      },
    });

    await generateInterfaceFiles({ objectAttributes, objectClasses });

    // test without generic type
    await generateGraphqlTypeFiles({
      objectClasses,
      objectAttributes,
      options: {
        generateClientSideDocuments: true,
        generateEnumTypeMaps: false,
        justThisClasses: ["user"],
      },
    });

    // test without generic type but limited classes
    // await generateGraphqlTypeFiles({
    //   objectClasses,
    //   objectAttributes,
    //   options: {
    //     justThisClasses: ["user"],
    //     generateClientSideDocuments: true,
    //   },
    // });

    // // test with type
    // await generateGraphqlTypeFiles<StructuralClasses>({
    //   objectClasses,
    //   objectAttributes,
    //   options: {
    //     justThisClasses: ["user"],
    //     generateClientSideDocuments: true,
    //   },
    // });

    // // test with enum type
    // await generateGraphqlTypeFiles<keyof typeof StructuralClassesEnum>({
    //   objectClasses,
    //   objectAttributes,
    //   options: {
    //     generateClientSideDocuments: true,
    //     // justThisClasses: ["user", "group", "computer", "contact", "container"],
    //   },
    // });
  } finally {
    client.unbind();
  }
}
main();
