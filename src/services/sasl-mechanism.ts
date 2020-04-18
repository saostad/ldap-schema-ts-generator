import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetSupportedSaslMechanismsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get schema supported SASL Mechanisms from RootDSE.
 * - Contains the security mechanisms supported for SASL negotiation (see LDAP RFCs). By default, GSSAPI is supported.
 *
 * Ref:
 *   - https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/a98c1f56-8246-4212-8c4e-d92da1a9563b
 *   - https://ldapwiki.com/wiki/SASL
 */
export async function getSupportedSaslMechanisms({
  options,
}: GetSupportedSaslMechanismsFnInput): Promise<string[]> {
  options.logger?.trace("getSupportedSaslMechanisms()");
  const client = new Client({
    ...options,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedSASLMechanisms"],
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  client.unbind();
  return data[0].supportedSASLMechanisms as string[];
}