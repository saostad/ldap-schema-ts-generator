import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetSchemaExtensionsFnInput = {
  options?: { logger?: Logger };
  client: Client;
};

/** get schema extensions from RootDSE.
 * - A supported extension is a mechanism for identifying the Extended Request supported by the Directory Server. The OIDs of these extended operations are listed in the supportedExtension attribute of the server's root DSE.
 */
export async function getSchemaExtensions({
  options,
  client,
}: GetSchemaExtensionsFnInput): Promise<string[]> {
  options?.logger?.trace("getSchemaExtensions()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedExtension"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  return data[0].supportedExtension as string[];
}
