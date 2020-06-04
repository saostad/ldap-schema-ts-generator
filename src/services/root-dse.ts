import type { Client } from "ldap-ts-client";
import type { Logger } from "fast-node-logger";

type GetRootDseFnInput = {
  options?: { logger?: Logger };
  client: Client;
};

/** get RootDSE entries
 * - In LDAP 3.0, rootDSE is defined as the root of the directory data tree on a directory server. The rootDSE is not part of any namespace. The purpose of the rootDSE is to provide data about the directory server.
 */
export async function getRootDSE({ options, client }: GetRootDseFnInput) {
  options?.logger?.trace("getRootDSE()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["*"],
    options: {
      filter: "(&(objectClass=*))",
      scope: "base",
    },
  });
  return data;
}

type GetSubSchemaSubEntryFnInput = {
  options?: { logger?: Logger };
  client: Client;
};

/** get schema SubSchemaSubEntry from RootDSE
 * - Contains the distinguished name for the subSchema object. The subSchema object contains properties that expose the supported attributes (in the attributeTypes property) and classes (in the objectClasses property).
The subschemaSubentry property and subschema are defined in LDAP 3.0 (see RFC 2251).
 */
export async function getSubSchemaSubEntry({
  options,
  client,
}: GetSubSchemaSubEntryFnInput): Promise<string> {
  options?.logger?.trace("getSubSchemaSubEntry()");

  const data = await client.queryAttributes({
    base: "",
    attributes: ["subschemaSubentry"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  return data[0].subschemaSubentry as string;
}
