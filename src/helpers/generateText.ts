import { SchemaClassWithAttributes } from "./map-class-attributes";
import { typeMapper } from "./type-map";

function arrayToLines(data?: string[]): string {
  if (!data) {
    throw new Error("data input required");
  }
  return data.map((el) => `${el}\n`).join("");
}

interface GenerateFnInput {
  data: SchemaClassWithAttributes;
}

export function generate({ data }: GenerateFnInput): string {
  const result = `
  /** object class ${data.ldapName}
  * child of class ${data.parentClass}
  */
  interface ${data.className} {
    ${arrayToLines(
      data.attributes &&
        data.attributes.map((el) => {
          return `"${el.lDAPDisplayName}" ${
            el.isRequired ? "" : "?"
          }: ${typeMapper(el.attributeSyntax)} ${
            el.isSingleValued ? "" : "[]"
          };`;
        }),
    )}
  }
  `;

  return result;
}
