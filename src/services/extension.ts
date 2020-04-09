import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

interface GetSchemaExtensionsFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

type GetSchemaExtensionsFnOutput = Promise<string[]>;

/** get schema controls from RootDSE */
export async function getSchemaExtensions({
  options,
}: GetSchemaExtensionsFnInput): GetSchemaExtensionsFnOutput {
  options.logger?.trace("getSchemaExtensions()");
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
      attributes: ["supportedExtension"],
    },
  });
  adClient.unbind();
  return data[0].supportedExtension as string[];
}
