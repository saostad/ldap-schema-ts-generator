import { Logger } from "../typings/general/types";
import { Client } from "ldap-ts-client";

interface GetSchemaControlsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

/** get schema controls from RootDSE
 * - A multiple-valued attribute that contains the OIDs for extension controls supported by this directory server. See the table below for a list of the possible control OIDs.
 */
type GetSchemaControlsFnOutput = Promise<string[]>;

export async function getSchemaControls({
  options,
}: GetSchemaControlsFnInput): GetSchemaControlsFnOutput {
  options.logger?.trace("getSchemaControls()");
  const client = new Client({
    ...options,
    baseDN: "",
    logger: options.logger,
  });

  const data = await client.queryAttributes({
    attributes: ["supportedControl"],
    options: {
      filter: "&(objectClass=*)",
      scope: "base",
    },
  });
  client.unbind();
  return data[0].supportedControl as string[];
}
