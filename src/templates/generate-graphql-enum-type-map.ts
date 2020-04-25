import { pascalCase } from "change-case";
import { writeLog } from "fast-node-logger";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

type GenerateGraphqlEnumTypeMapFnInput = {
  data: SchemaClassWithAttributes;
};

export function generateGraphqlEnumTypeMap({
  data,
}: GenerateGraphqlEnumTypeMapFnInput): string {
  writeLog(`generateGraphqlEnumTypeMap()`, { level: "trace" });

  const result = `
  /** type-map for ldap class name ${
    data.lDAPDisplayName
  } and graphql field names.
   * @note ldap attributes can have characters that are illegal in graphql schema so instead we use pascal case of lDAPDisplayName.
   */
  export enum ${pascalCase(data.lDAPDisplayName)} {
    ${data.attributes
      ?.map(
        (el) =>
          `/**
          * - Admin DisplayName: ${el.adminDisplayName}
          * - Description: ${el.adminDescription}
          * - ldapDisplayName: ${el.lDAPDisplayName}
          * - attributeSyntax: ${el.attributeSyntax}
          * - attributeID: ${el.attributeID}          
          */
          ${pascalCase(el.lDAPDisplayName)}= "${el.lDAPDisplayName}",`,
      )
      .join("\n")}
  }
  `;

  return result;
}
