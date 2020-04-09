import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

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
  const adClient = new AdClient({
    bindDN: options.user,
    secret: options.pass,
    url: options.ldapServerUrl,
    baseDN: "",
    logger: options.logger,
  });

  const data = await adClient.queryAttributes({
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
      attributes: ["supportedCapabilities"],
    },
  });
  adClient.unbind();
  return data[0].supportedCapabilities as string[];
}
