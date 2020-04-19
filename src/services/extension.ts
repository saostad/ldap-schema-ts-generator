import { Client, IClientConfig } from "ldap-ts-client";

interface GetSchemaExtensionsFnInput {
  options: Omit<IClientConfig, "baseDN">;
}

/** get schema extensions from RootDSE.
 * - A supported extension is a mechanism for identifying the Extended Request supported by the Directory Server. The OIDs of these extended operations are listed in the supportedExtension attribute of the server's root DSE.
 */
export async function getSchemaExtensions({
  options,
}: GetSchemaExtensionsFnInput): Promise<string[]> {
  options.logger?.trace("getSchemaExtensions()");
  const client = new Client({
    ...options,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedExtension"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  client.unbind();
  return data[0].supportedExtension as string[];
}
