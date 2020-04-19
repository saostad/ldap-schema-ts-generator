import { Client, IClientConfig } from "ldap-ts-client";

interface GetSchemaCapabilitiesFnInput {
  options: Omit<IClientConfig, "baseDN">;
}

type GetSchemaCapabilitiesFnOutput = Promise<string[]>;

/** get schema capabilities from RootDSE
 * - A multiple-valued attribute that contains the capabilities supported by this directory server.
 */
export async function getSchemaCapabilities({
  options,
}: GetSchemaCapabilitiesFnInput): GetSchemaCapabilitiesFnOutput {
  options.logger?.trace("getSchemaCapabilities()");
  const client = new Client({
    user: options.user,
    pass: options.pass,
    ldapServerUrl: options.ldapServerUrl,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedCapabilities"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });

  client.unbind();

  return data[0].supportedCapabilities as string[];
}
