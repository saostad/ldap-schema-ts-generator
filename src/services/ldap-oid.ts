import path from "path";
import { promises } from "fs";
import { writeLog } from "fast-node-logger";

interface GetLapOidsFnInput {
  useCache: boolean;
}

interface OIDInfo {
  OID: string;
  Purpose: string;
  Source: string;
}

export async function getLdapOids({
  useCache,
}: GetLapOidsFnInput): Promise<OIDInfo[]> {
  writeLog(`getLdapOids()`, { level: "trace" });
  const cacheLocation = path.join(
    __dirname,
    "..",
    "..",
    "lib",
    "json",
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
