import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetSchemaExtensionsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

type GetSchemaExtensionsFnOutput = Promise<string[]>;

/** get schema extensions from RootDSE.
 * - A supported extension is a mechanism for identifying the Extended Request supported by the Directory Server. The OIDs of these extended operations are listed in the supportedExtension attribute of the server's root DSE.
 */
export async function getSchemaExtensions({
  options,
}: GetSchemaExtensionsFnInput): GetSchemaExtensionsFnOutput {
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
