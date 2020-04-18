import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetSchemaCapabilitiesFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
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
