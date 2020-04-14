import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetRootDseFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get RootDSE entries
 * - In LDAP 3.0, rootDSE is defined as the root of the directory data tree on a directory server. The rootDSE is not part of any namespace. The purpose of the rootDSE is to provide data about the directory server.
 */
export async function getRootDSE({ options }: GetRootDseFnInput) {
  options.logger?.trace("getRootDSE()");
  const adClient = new Client({
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
      attributes: ["*"],
    },
  });
  adClient.unbind();
  return data;
}

interface GetSubSchemaSubEntryFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get schema SubSchemaSubEntry from RootDSE
 * - Contains the distinguished name for the subSchema object. The subSchema object contains properties that expose the supported attributes (in the attributeTypes property) and classes (in the objectClasses property).
The subschemaSubentry property and subschema are defined in LDAP 3.0 (see RFC 2251).
 */
export async function getSubSchemaSubEntry({
  options,
}: GetSubSchemaSubEntryFnInput): Promise<string> {
  options.logger?.trace("getSubSchemaSubEntry()");
  const adClient = new Client({
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
      attributes: ["subschemaSubentry"],
    },
  });
  adClient.unbind();
  return data[0].subschemaSubentry as string;
}
