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

  const options = {
    user: process.env.AD_USER ?? "",
    pass: process.env.AD_Pass ?? "",
    ldapServerUrl: process.env.AD_URI ?? "",
    logger,
  };

  const schemaDn = await getSchemaNamingContext({ options });

  // const linkIds = await getLinkIds({ options, schemaDn });
  // const relations = getRelations(linkIds);
  // await generateRelationsFile({ relations });

  // const controls = await getSchemaControls({ options });
  // await generateControlsFile({ controls });

  // const extensions = await getSchemaExtensions({ options });
  // await generateExtensionsFile({ extensions });

  // const capabilities = await getSchemaCapabilities({ options });
  // await generateCapabilitiesFile({ capabilities });

  // const policies = await getSchemaPolicies({ options });
  // await generatePoliciesFile({ policies });

  // const classes = await getStructuralSchemaClasses({ schemaDn, options });
  // await generateStructuralClassesFile({ classes });

  const objectAttributes = await getSchemaAttributes({ schemaDn, options });
  const objectClasses = await getSchemaClasses({ schemaDn, options });

  // await generateAttributesMeta({
  //   attributes: objectAttributes,
  //   options: {
  //     generateJsonFile: true,
  //     generateTsFile: true,
  //   },
  // });

  // await generateInterfaceFiles({ objectAttributes, objectClasses });

  // // test without generic type
  // await generateGraphqlTypeFiles({
  //   objectClasses,
  //   objectAttributes,
  //   options: {
  //     generateClientSideDocuments: true,
  //     generateEnumTypeMaps: false,
  //     justThisClasses: ["user"],
  //   },
  // });

  // // test without generic type but limited classes
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

  // test with enum type
  await generateGraphqlTypeFiles<keyof typeof StructuralClassesEnum>({
    objectClasses,
    objectAttributes,
    options: {
      generateClientSideDocuments: true,
      // justThisClasses: ["user", "group", "computer", "contact", "container"],
    },
  });
}
main();
