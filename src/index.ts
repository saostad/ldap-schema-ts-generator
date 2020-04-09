export * from "./services";

import { generateInterfaceFiles } from "./helpers/generate-interface-files";
import { generateControlsFile } from "./templates/generate-controls-file";
import { generateExtensionsFile } from "./templates/generate-extensions-file";
import { generateCapabilitiesFile } from "./templates/generate-capabilities-file";
import { generatePoliciesFile } from "./templates/generate-policies-file";

export {
  generateInterfaceFiles,
  generateControlsFile,
  generateCapabilitiesFile,
  generateExtensionsFile,
  generatePoliciesFile,
};
