import path from "path";
import { promises } from "fs";

interface GetLapOidsFnInput {
  useCache: boolean;
}

interface OIDInfo {
  OID: string;
  Purpose: string;
  Source: string;
}

export async function getLapOids({
  useCache,
}: GetLapOidsFnInput): Promise<OIDInfo[]> {
  const cacheLocation = path.join(
    __dirname,
    "..",
    "..",
    "cache",
    "ldap-oids.json",
  );
  if (useCache) {
    const oids = await promises.readFile(cacheLocation, "utf8");
    return JSON.parse(oids);
  } else {
    // TODO: getting oids from internet
    throw new Error("getting oids from internet not implemented");
  }
}
