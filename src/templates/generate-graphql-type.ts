import { pascalCase } from "change-case";
import { writeLog } from "fast-node-logger";
import { graphqlTypeMapper } from "../helpers/type-map";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

type GenerateGraphqlTypeFnInput = {
  data: SchemaClassWithAttributes;
};

export function generateGraphqlType({
  data,
}: GenerateGraphqlTypeFnInput): string {
  writeLog(`generateGraphqlType()`, { level: "trace" });

  const result = `
  type ${pascalCase(data.lDAPDisplayName)} {
    ${data.attributes
      ?.map(
        (el) =>
          `"""
          Admin DisplayName: ${el.adminDisplayName}
          Description: ${el.adminDescription}
          ldapDisplayName: ${el.lDAPDisplayName}
          attributeSyntax: ${el.attributeSyntax}
          attributeID: ${el.attributeID}          
          """
          ${pascalCase(el.lDAPDisplayName)}: ${
            el.isSingleValued ? "" : "["
          }${graphqlTypeMapper(el.attributeSyntax)}${el.isRequired ? "!" : ""}${
            el.isSingleValued ? "" : "]"
          }`,
      )
      .join("\n")}
  }
  `;

  return result;
}
