import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

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
  const adClient = new AdClient({
    bindDN: options.user,
    secret: options.pass,
    url: options.ldapServerUrl,
    baseDN: "",
    logger: options.logger,
  });

  const data = await adClient.queryAttributes({
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
      attributes: ["supportedLDAPVersion"],
    },
  });
  adClient.unbind();
  return data[0].supportedLDAPVersion as string[];
}
