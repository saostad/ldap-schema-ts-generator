import { Client, IClientConfig } from "ldap-ts-client";

interface GetSchemaPoliciesFnInput {
  options: Omit<IClientConfig, "baseDN">;
}

type GetSchemaPoliciesFnOutput = Promise<string[]>;

/** get schema supported policies from RootDSE
 * - A multiple-valued attribute that contains the names of the supported LDAP management policies.
 */
export async function getSchemaPolicies({
  options,
}: GetSchemaPoliciesFnInput): GetSchemaPoliciesFnOutput {
  options.logger?.trace("getSchemaPolicies()");
  const client = new Client({
    ...options,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedLDAPPolicies"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  client.unbind();
  return data[0].supportedLDAPPolicies as string[];
}
