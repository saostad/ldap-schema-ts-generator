import path from "path";
import { promises } from "fs";
import { writeLog } from "fast-node-logger";

interface GetCountryIsoCodesFnInput {
  useCache: boolean;
}

export type CountryIsoCode = {
  /** Text e.g. "Aland Islands" */
  co: string;
  /** two letters text e.g. "AX" */
  c: string;
  /** three letters e.g. "ALA" */
  alpha3: string;
  /** e.g. 248 */
  countryCode: number;
};

/**@returns ISO 3166 defined internationally recognized codes of letters and/or numbers that we can use when we refer to countries and their subdivisions. [source](https://www.iso.org/iso-3166-country-codes.html) */
export async function getCountryIsoCodes({
  useCache,
}: GetCountryIsoCodesFnInput): Promise<CountryIsoCode[]> {
  writeLog(`getCountryIsoCodes()`, { level: "trace" });
  const cacheLocation = path.join(
    __dirname,
    "..",
    "..",
    "lib",
    "json",
    "country-iso-codes.json",
  );
  if (useCache) {
    const countryCodes = await promises.readFile(cacheLocation, "utf8");
    return JSON.parse(countryCodes);
  } else {
    // TODO: getting countryCodes from internet
    throw new Error("getting countryCodes from internet not implemented");
  }
}
