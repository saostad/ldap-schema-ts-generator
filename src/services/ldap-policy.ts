import path from "path";
import { promises } from "fs";
import { writeLog } from "fast-node-logger";

interface GetLapOidsFnInput {
  useCache: boolean;
}

interface PolicyInfo {
  "Policy name": string;
  "Default value": string;
  Description: string;
}

export async function getLdapPolicies({
  useCache,
}: GetLapOidsFnInput): Promise<PolicyInfo[]> {
  writeLog(`getLdapPolicies()`, { level: "trace" });
  const cacheLocation = path.join(
    __dirname,
    "..",
    "..",
    "lib",
    "json",
    "ldap-policies.json",
  );
  if (useCache) {
    const policies = await promises.readFile(cacheLocation, "utf8");
    return JSON.parse(policies);
  } else {
    // TODO: getting oids from internet
    throw new Error("getting oids from internet not implemented");
  }
}
