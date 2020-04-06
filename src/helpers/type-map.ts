import { writeLog } from "fast-node-logger";

/** for more info look at links below:
 * - https://social.technet.microsoft.com/wiki/contents/articles/52570.active-directory-syntaxes-of-attributes.aspx
 * - https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/7cda533e-d7a4-4aec-a517-91d02ff4a1aa?redirectedfrom=MSDN
 */

const typeMap = {
  string: [
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
  object: ["2.5.5.1"],
};

/** get ldap attributeSyntax and return js equivalent type */
export function typeMapper(attributeSyntax: string): string {
  writeLog(`typeMapper()`, { level: "trace" });
  for (const [key, value] of Object.entries(typeMap)) {
    if (value.includes(attributeSyntax)) {
      return key;
    }
  }

  /**default type if type not found */
  console.log(
    `File: type-map.ts,`,
    `Line: 16 => `,
    `type ${attributeSyntax} not found`,
  );

  return "string";
}
