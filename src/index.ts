export * from "./services";

export * as Types from "./typings/general/types";

import { generateInterfaceFiles } from "./helpers/generate-interface-files";
import { generateControlsFile } from "./templates/generate-controls-file";
import { generateExtensionsFile } from "./templates/generate-extensions-file";
import { generateCapabilitiesFile } from "./templates/generate-capabilities-file";
import { generatePoliciesFile } from "./templates/generate-policies-file";
import { generateRelationsFile } from "./templates/generate-relations-file";
import { mapClassAttributesIncludeInherited } from "./helpers/map-class-attributes-include-inherited";
import { generateGraphqlTypeFiles } from "./helpers/generate-graphql-type-files";
import { generateStructuralClassesFile } from "./templates/generate-structural-classes-file";
import { generateAttributesMeta } from "./templates/generate-attributes-meta-file";

export {
  generateInterfaceFiles,
  generateControlsFile,
  generateCapabilitiesFile,
  generateExtensionsFile,
  generatePoliciesFile,
  generateRelationsFile,
  mapClassAttributesIncludeInherited,
  generateGraphqlTypeFiles,
  generateStructuralClassesFile,
  generateAttributesMeta,
};
