import path from "path";
import { promises } from "fs";

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
  const cacheLocation = path.join(
    __dirname,
    "..",
    "..",
    "cache",
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
