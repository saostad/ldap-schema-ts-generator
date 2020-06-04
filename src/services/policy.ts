import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetSchemaPoliciesFnInput = {
  options?: { logger?: Logger };
  client: Client;
};

type GetSchemaPoliciesFnOutput = Promise<string[]>;

/** get schema supported policies from RootDSE
 * - A multiple-valued attribute that contains the names of the supported LDAP management policies.
 */
export async function getSchemaPolicies({
  options,
  client,
}: GetSchemaPoliciesFnInput): GetSchemaPoliciesFnOutput {
  options?.logger?.trace("getSchemaPolicies()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedLDAPPolicies"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  return data[0].supportedLDAPPolicies as string[];
}
