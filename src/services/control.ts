import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetSchemaControlsFnInput = {
  client: Client;
  options?: { logger?: Logger };
};

/** get schema controls from RootDSE
 * - A multiple-valued attribute that contains the OIDs for extension controls supported by this directory server. See the table below for a list of the possible control OIDs.
 */
type GetSchemaControlsFnOutput = Promise<string[]>;

export async function getSchemaControls({
  options,
  client,
}: GetSchemaControlsFnInput): GetSchemaControlsFnOutput {
  options?.logger?.trace("getSchemaControls()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedControl"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  return data[0].supportedControl as string[];
}
