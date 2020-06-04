import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

interface GetSupportedSaslMechanismsFnInput {
  options?: { logger?: Logger };
  client: Client;
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
  client,
}: GetSupportedSaslMechanismsFnInput): Promise<string[]> {
  options?.logger?.trace("getSupportedSaslMechanisms()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedSASLMechanisms"],
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].supportedSASLMechanisms as string[];
}
