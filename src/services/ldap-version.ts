import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

interface GetSupportedLdapVersionsFnInput {
  options?: { logger?: Logger };
  client: Client;
}

/** get supported LDAP versions from RootDSE
 * - A multiple-valued attribute that contains the LDAP versions (specified by major version number) supported by this directory server.
 */
export async function getSupportedLdapVersions({
  options,
  client,
}: GetSupportedLdapVersionsFnInput): Promise<string[]> {
  options?.logger?.trace("getSupportedLdapVersions()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["supportedLDAPVersion"],
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].supportedLDAPVersion as string[];
}
