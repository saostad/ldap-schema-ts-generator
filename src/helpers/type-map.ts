import { writeLog } from "fast-node-logger";

/** for more info look at links below:
 * - https://social.technet.microsoft.com/wiki/contents/articles/52570.active-directory-syntaxes-of-attributes.aspx
 * - https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/7cda533e-d7a4-4aec-a517-91d02ff4a1aa?redirectedfrom=MSDN
 */
const jsTypeMap = {
  /** - note for 2.5.5.1 : https://docs.microsoft.com/en-us/windows/win32/adschema/s-object-ds-dn */
  string: [
    "2.5.5.1",
    "2.5.5.12",
    "2.5.5.17",
    "2.5.5.5",
    "2.5.5.10",
    "2.5.5.7",
    "2.5.5.14",
    "2.5.5.2",
    "2.5.5.4",
    "2.5.5.15",
    "2.5.5.6",
    "2.5.5.13",
  ],
  boolean: ["2.5.5.8"],
  number: ["2.5.5.16", "2.5.5.9"],
  Date: ["2.5.5.11"],
};

/** get ldap attributeSyntax and return js equivalent type */
export function jsTypeMapper(attributeSyntax: string): string {
  writeLog(`jsTypeMapper()`, { level: "trace" });
  for (const [key, value] of Object.entries(jsTypeMap)) {
    if (value.includes(attributeSyntax)) {
      return key;
    }
  }

  /** type not found */
  writeLog(`type ${attributeSyntax} not found`, {
    stdout: true,
    level: "error",
  });

  /** default type */
  return "string";
}

/** [source](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/7cda533e-d7a4-4aec-a517-91d02ff4a1aa) */
const graphqlTypeMap = {
  /**@Note:
   * - 2.5.5.16 is the OID for LargeInteger. in Microsoft Active Directory Syntax is restricted to 64-bit integers, but here I put it as string because graphql doesn't support 64bit int.
   * - 2.5.5.14 is Object(DN-String)
   */
  String: [
    "2.5.5.12",
    "2.5.5.17",
    "2.5.5.5",
    "2.5.5.10",
    "2.5.5.7",
    "2.5.5.14",
    "2.5.5.2",
    "2.5.5.4",
    "2.5.5.15",
    "2.5.5.6",
    "2.5.5.13",
    "2.5.5.16",
  ],
  Boolean: ["2.5.5.8"],
  Int: ["2.5.5.9"],
  /** @note:
   * - Object(DS-DN) for 2.5.5.1 : https://docs.microsoft.com/en-us/windows/win32/adschema/s-object-ds-dn */
  ID: ["2.5.5.1"],
  /** @note:
   * - 2.5.5.11 is String(UTC-Time) & String(Generalized-Time)
   */
  Date: ["2.5.5.11"],
};

/** get ldap attributeSyntax and return graphql equivalent type */
export function graphqlTypeMapper(attributeSyntax: string): string {
  writeLog(`graphqlTypeMapper()`, { level: "trace" });
  for (const [key, value] of Object.entries(graphqlTypeMap)) {
    if (value.includes(attributeSyntax)) {
      return key;
    }
  }

  /** type not found */
  writeLog(`type ${attributeSyntax} not found`, {
    stdout: true,
    level: "error",
  });

  /** default type */
  return "string";
}
