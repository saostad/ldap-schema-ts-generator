import path from "path";
import { writeLog } from "fast-node-logger";
import { defaultJsonDir } from "../helpers/variables";
import { CountryIsoCode } from "../services/country-iso-codes";
import { writeToFile } from "../helpers/write-to-file";

type GenerateCountryIsoCodesFileFnInput = {
  countryCodes: CountryIsoCode[];
  options?: {
    /** output directory of file. default directory named "json"
     *  - Note: at this point file name is hard coded to "CountryIsoCodes.json" to prevent conflict with other generated files
     */
    outDir?: string;
    /** default true */
    usePrettier?: boolean;
  };
};

/** generate json file ("CountryIsoCodes.json") for ISO-3166 countryCodes used in active-directory "c", "co", "countryCode" attributes */
export async function generateCountryIsoCodesFile({
  countryCodes,
  options,
}: GenerateCountryIsoCodesFileFnInput): Promise<void> {
  writeLog(`generateCountryIsoCodesFile()`, { level: "trace" });

  const textToWriteToFile = JSON.stringify(countryCodes);

  const outDir = options?.outDir ?? defaultJsonDir;

  let usePrettier = true;
  if (options && options.usePrettier) {
    usePrettier = options.usePrettier;
  }
  const filePath = path.join(outDir, "CountryIsoCodes.json");

  await writeToFile(textToWriteToFile, {
    filePath,
    prettierOptions: usePrettier ? { parser: "json-stringify" } : undefined,
  });
  writeLog(`ISO-3166 countryCodes has been created in ${filePath}`, {
    stdout: true,
  });
}
