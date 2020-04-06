import { SchemaClassWithAttributes } from "./map-class-attributes";
import { typeMapper } from "./type-map";
import { pascalCase } from "pascal-case";
import { arrayToLines } from "./utils";

interface GenerateClassInterfaceFnInput {
  data: SchemaClassWithAttributes;
}

export function generateClassInterface({
  data,
}: GenerateClassInterfaceFnInput): string {
  const result = `
  /**  - object class: ${data.ldapName}
   *  - child of class: ${data.parentClass}
   *  - dn: ${data.originalClassFields.dn}
  */  
  interface ${pascalCase(data.className)} {
    ${arrayToLines(
      data.attributes &&
        data.attributes.map((el) => {
          return `
          /**  - attributeSyntax: ${el.attributeSyntax} 
           *   - attributeID: ${el.attributeID} 
           *   - adminDisplayName: ${el.adminDisplayName} 
           *   - adminDescription: ${el.adminDescription}
           *   - dn: ${el.dn} 
          */
          ${el.systemOnly ? "readonly" : ""} "${el.lDAPDisplayName}" ${
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
