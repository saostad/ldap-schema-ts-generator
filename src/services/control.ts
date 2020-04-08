import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

interface GetSchemaControlsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

export type GetSchemaControlsFnOutput = Promise<string[]>;

export async function getSchemaControls({
  options,
}: GetSchemaControlsFnInput): GetSchemaControlsFnOutput {
  options.logger?.trace("getSchemaControls()");
  const adClient = new AdClient({
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
      attributes: ["supportedControl"],
    },
  });
  adClient.unbind();
  return data[0].supportedControl as string[];
}
