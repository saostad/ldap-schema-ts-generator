import { pascalCase, camelCase } from "change-case";
import { writeLog } from "fast-node-logger";
import { graphqlTypeMapper } from "../helpers/type-map";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

type GenerateGraphqlResolverFnInput = {
  data: SchemaClassWithAttributes;
};

export function generateGraphqlResolvers({
  data,
}: GenerateGraphqlResolverFnInput): string {
  writeLog(`generateGraphqlResolvers()`, { level: "trace" });

  const result = `
  type Query {
    ${camelCase(data.lDAPDisplayName)}GetAll(criteria: String): [${pascalCase(
    data.lDAPDisplayName,
  )}]
    ${camelCase(data.lDAPDisplayName)}GetByDn(dn: ID!): ${pascalCase(
    data.lDAPDisplayName,
  )}
  }
  
  type Mutation {
    ${camelCase(data.lDAPDisplayName)}Update(input: ${pascalCase(
    data.lDAPDisplayName,
  )}UpdateInput!): ${pascalCase(data.lDAPDisplayName)}
    ${camelCase(data.lDAPDisplayName)}Delete(dn: ID!): Boolean
  }

  input ${pascalCase(data.lDAPDisplayName)}UpdateInput {
    dn: ID!
    ${data.attributes
      ?.filter((el) => el.systemOnly !== true)
      .map(
        (el) =>
          `"""
          Admin DisplayName: ${el.adminDisplayName}
          Description: ${el.adminDescription}
          ldapDisplayName: ${el.lDAPDisplayName}
          attributeSyntax: ${el.attributeSyntax}
          attributeID: ${el.attributeID}          
          """
          ${pascalCase(el.lDAPDisplayName!)}: ${
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
