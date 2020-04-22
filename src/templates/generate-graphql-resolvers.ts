import { pascalCase } from "pascal-case";
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
    ${pascalCase(data.lDAPDisplayName)}GetAll: [${pascalCase(
    data.lDAPDisplayName,
  )}]
    ${pascalCase(data.lDAPDisplayName)}GetByDn(dn: ID!): ${pascalCase(
    data.lDAPDisplayName,
  )}
  }
  input ${pascalCase(data.lDAPDisplayName)}UpdateInput {
    dn: ID!
    ${data.attributes
      ?.filter((el) => el.systemOnly !== true)
      .map(
        (el) =>
          `${pascalCase(el.lDAPDisplayName!)}: ${
            el.isSingleValued ? "" : "["
          }${graphqlTypeMapper(el.attributeSyntax)}${el.isRequired ? "!" : ""}${
            el.isSingleValued ? "" : "]"
          }`,
      )
      .join("\n")}
  }
  type Mutation {
    ${pascalCase(data.lDAPDisplayName)}Update(input: ${pascalCase(
    data.lDAPDisplayName,
  )}UpdateInput!): ${pascalCase(data.lDAPDisplayName)}
    ${pascalCase(data.lDAPDisplayName)}DeleteByDn(dn: ID!): Boolean
  }
  `;

  return result;
}
