import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetSupportedLdapVersionsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get supported LDAP versions from RootDSE
 * - A multiple-valued attribute that contains the LDAP versions (specified by major version number) supported by this directory server.
 */
export async function getSupportedLdapVersions({
  options,
}: GetSupportedLdapVersionsFnInput): Promise<string[]> {
  options.logger?.trace("getSupportedLdapVersions()");
  const client = new Client({
    ...options,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedLDAPVersion"],
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  client.unbind();
  return data[0].supportedLDAPVersion as string[];
}
