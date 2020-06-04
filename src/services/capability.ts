import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetSchemaCapabilitiesFnInput = {
  options?: { logger?: Logger };
  client: Client;
};

type GetSchemaCapabilitiesFnOutput = Promise<string[]>;

/** get schema capabilities from RootDSE
 * - A multiple-valued attribute that contains the capabilities supported by this directory server.
 */
export async function getSchemaCapabilities({
  client,
  options,
}: GetSchemaCapabilitiesFnInput): GetSchemaCapabilitiesFnOutput {
  options?.logger?.trace("getSchemaCapabilities()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedCapabilities"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });

  return data[0].supportedCapabilities as string[];
}
