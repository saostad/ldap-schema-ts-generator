import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

interface GetNamingContextsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get base DNs from RootDSE
 * - A multiple-valued attribute that contains the distinguished names for all naming contexts stored on this directory server. By default, a Windows 2000 domain controller contains at least three naming contexts: Schema, Configuration, and one for the domain of which the server is a member.
 */
export async function getNamingContexts({
  options,
}: GetNamingContextsFnInput): Promise<string[]> {
  options.logger?.trace("getNamingContexts()");
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
      attributes: ["namingContexts"],
    },
  });
  adClient.unbind();
  return data[0].namingContexts as string[];
}

/** get DefaultNamingContext from RootDSE
 * - Contains the distinguished name for the domain of which this directory server is a member.
 */
export async function getDefaultNamingContext({
  options,
}: GetNamingContextsFnInput): Promise<string> {
  options.logger?.trace("getDefaultNamingContext()");
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
      attributes: ["defaultNamingContext"],
    },
  });
  adClient.unbind();
  return data[0].defaultNamingContext as string;
}

/** get SchemaNamingContext from RootDSE
 * - Contains the distinguished name for the schema container.
 */
export async function getSchemaNamingContext({
  options,
}: GetNamingContextsFnInput): Promise<string> {
  options.logger?.trace("getSchemaNamingContext()");
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
      attributes: ["schemaNamingContext"],
    },
  });
  adClient.unbind();
  return data[0].schemaNamingContext as string;
}

/** get rootDomainNamingContext from RootDSE
 * - Contains the distinguished name for the first domain in the forest that contains the domain of which this directory server is a member.
 */
export async function getRootNamingContext({
  options,
}: GetNamingContextsFnInput): Promise<string> {
  options.logger?.trace("getSchemaNamingContext()");
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
      attributes: ["rootDomainNamingContext"],
    },
  });
  adClient.unbind();
  return data[0].rootDomainNamingContext as string;
}

/** get configurationNamingContext from RootDSE
 * - DN of the Configuration NamingContext
 */
export async function getConfigurationNamingContext({
  options,
}: GetNamingContextsFnInput): Promise<string> {
  options.logger?.trace("getSchemaNamingContext()");
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
      attributes: ["configurationNamingContext"],
    },
  });
  adClient.unbind();
  return data[0].configurationNamingContext as string;
}
