import { Logger } from "../typings/general/types";
import { AdClient } from "node-ad-ldap";

interface GetSchemaPoliciesFnInput {
  options: {
    user: string;
    pass: string;
    ldapServerUrl: string;
    logger?: Logger;
  };
}

type GetSchemaPoliciesFnOutput = Promise<string[]>;

/** get schema supported policies from RootDSE */
export async function getSchemaPolicies({
  options,
}: GetSchemaPoliciesFnInput): GetSchemaPoliciesFnOutput {
  options.logger?.trace("getSchemaPolicies()");
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
      attributes: ["supportedLDAPPolicies"],
    },
  });
  adClient.unbind();
  return data[0].supportedLDAPPolicies as string[];
}
