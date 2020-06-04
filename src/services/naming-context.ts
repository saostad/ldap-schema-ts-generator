import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetNamingContextsFnInput = {
  client: Client;
  options?: { logger?: Logger };
};

/** get base DNs from RootDSE
 * - A multiple-valued attribute that contains the distinguished names for all naming contexts stored on this directory server. By default, a Windows 2000 domain controller contains at least three naming contexts: Schema, Configuration, and one for the domain of which the server is a member.
 */
export async function getNamingContexts({
  client,
  options,
}: GetNamingContextsFnInput): Promise<string[]> {
  options?.logger?.trace("getNamingContexts()");

  const data = await client.queryAttributes({
    attributes: ["namingContexts"],
    base: "",
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].namingContexts as string[];
}

/** get DefaultNamingContext from RootDSE
 * - Contains the distinguished name for the domain of which this directory server is a member.
 */
export async function getDefaultNamingContext({
  options,
  client,
}: GetNamingContextsFnInput): Promise<string> {
  options?.logger?.trace("getDefaultNamingContext()");

  const data = await client.queryAttributes({
    attributes: ["defaultNamingContext"],
    base: "",
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].defaultNamingContext as string;
}

/** get SchemaNamingContext from RootDSE
 * - Contains the distinguished name for the schema container.
 */
export async function getSchemaNamingContext({
  options,
  client,
}: GetNamingContextsFnInput): Promise<string> {
  options?.logger?.trace("getSchemaNamingContext()");
  const data = await client.queryAttributes({
    attributes: ["schemaNamingContext"],
    base: "",
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].schemaNamingContext as string;
}

/** get rootDomainNamingContext from RootDSE
 * - Contains the distinguished name for the first domain in the forest that contains the domain of which this directory server is a member.
 */
export async function getRootNamingContext({
  options,
  client,
}: GetNamingContextsFnInput): Promise<string> {
  options?.logger?.trace("getSchemaNamingContext()");

  const data = await client.queryAttributes({
    attributes: ["rootDomainNamingContext"],
    base: "",
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].rootDomainNamingContext as string;
}

/** get configurationNamingContext from RootDSE
 * - DN of the Configuration NamingContext
 */
export async function getConfigurationNamingContext({
  options,
  client,
}: GetNamingContextsFnInput): Promise<string> {
  options?.logger?.trace("getSchemaNamingContext()");

  const data = await client.queryAttributes({
    attributes: ["configurationNamingContext"],
    base: "",
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data[0].configurationNamingContext as string;
}
