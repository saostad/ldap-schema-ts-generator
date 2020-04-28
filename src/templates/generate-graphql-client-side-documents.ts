import { pascalCase, camelCase } from "change-case";
import { writeLog } from "fast-node-logger";
import { graphqlTypeMapper } from "../helpers/type-map";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

type GenerateGraphqlClientSideFnInput = {
  data: SchemaClassWithAttributes;
};

export function generateGraphqlClientSideDocuments({
  data,
}: GenerateGraphqlClientSideFnInput): string {
  writeLog(`generateGraphqlClientSideDocuments()`, { level: "trace" });

  const result = `
  query ${camelCase(data.lDAPDisplayName)}GetAll($criteria: String){
    ${camelCase(data.lDAPDisplayName)}GetAll(criteria: $criteria){
      ...${camelCase(data.lDAPDisplayName)}AllFields
    }
  }
  ${
    data.attributes?.filter((el) => el.isRequired).length
      ? `query ${camelCase(
          data.lDAPDisplayName,
        )}GetAllRequiredFields($criteria: String){
    ${camelCase(data.lDAPDisplayName)}GetAll(criteria: $criteria){
      ...${camelCase(data.lDAPDisplayName)}RequiredFields
    }
  }`
      : ""
  }
  fragment ${camelCase(data.lDAPDisplayName)}AllFields on ${pascalCase(
    data.lDAPDisplayName,
  )} {
    ${data.attributes?.map((el) => camelCase(el.lDAPDisplayName)).join("\n")}
  }
  ${
    data.attributes?.filter((el) => el.isRequired).length
      ? `fragment ${camelCase(
          data.lDAPDisplayName,
        )}RequiredFields on ${pascalCase(data.lDAPDisplayName)} {
    ${data.attributes
      ?.filter((el) => el.isRequired)
      .map((el) => camelCase(el.lDAPDisplayName))
      .join("\n")}
  }`
      : ""
  }  
  `;

  return result;
}
