export * from "./services";

import { generateInterfaceFiles } from "./helpers/generate-interface-files";
import { generateControlsFile } from "./helpers/generate-controls-file";
import { generateExtensionsFile } from "./helpers/generate-extensions-file";
import { generateCapabilitiesFile } from "./helpers/generate-capabilities-file";
import { generatePoliciesFile } from "./helpers/generate-policies-file";

export {
  generateInterfaceFiles,
  generateControlsFile,
  generateCapabilitiesFile,
  generateExtensionsFile,
  generatePoliciesFile,
};
