import { SchemaClassWithAttributes } from "./map-class-attributes";
import { typeMapper } from "./type-map";
import { pascalCase } from "pascal-case";
import { arrayToLines } from "./utils";

interface GenerateClassInterfaceFnInput {
  data: SchemaClassWithAttributes;
}

/** Generate test of Class Interface to be written in file 
 -  // TODO: respect auxiliaryClass and systemAuxiliaryClass inheritance by extends interface 
* ref: 
*  - https://docs.microsoft.com/en-us/windows/win32/ad/structural-abstract-and-auxiliary-classes
*  - https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/06f3acb8-8cff-49e9-94ad-6737fa0a9503
*  - top class is an exception, it's subClassOf field is itself and should be ignored
*/

export function generateClassInterface({
  data,
}: GenerateClassInterfaceFnInput): string {
  const parentClasses: string[] = [data.subClassOf];

  if (data.auxiliaryClass) {
    data.auxiliaryClass.forEach((el) => {
      /** push all auxiliary classes as parent class to make inheritance via interface extends possible */
      parentClasses.push(el);
    });
  }

  const result = `
  ${
    data.ldapName !== "top"
      ? `${parentClasses
          .map((el) => `import {${pascalCase(el)}} from './${pascalCase(el)}';`)
          .join("")}`
      : ""
  }
  
  
  
  /**  - object class: ${data.ldapName}
   *  - child of class: ${data.subClassOf}
   *  - dn: ${data.originalClassFields.dn}
  */  
  export interface ${pascalCase(data.ldapName)} ${
    data.ldapName !== "top"
      ? `extends ${parentClasses.map((el) => pascalCase(el)).join()}`
      : ""
  }{
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
