import { pascalCase } from "change-case";
import { writeLog } from "fast-node-logger";
import { arrayToLines } from "../helpers/utils";
import { jsTypeMapper } from "../helpers/type-map";
import type { SchemaClassWithAttributes } from "../helpers/map-class-attributes";

type GenerateClassInterfaceFnInput = {
  data: SchemaClassWithAttributes;
};

/** Generate Class Interface to be written in file 
 -  respect auxiliaryClass and systemAuxiliaryClass inheritance by extends interface 
* ref: 
*  - https://docs.microsoft.com/en-us/windows/win32/ad/structural-abstract-and-auxiliary-classes
*  - https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/06f3acb8-8cff-49e9-94ad-6737fa0a9503
*  - top class is an exception, it's subClassOf field is itself and should be ignored
*/
export function generateClassInterface({
  data,
}: GenerateClassInterfaceFnInput): string {
  writeLog(`generateClassInterface()`, { level: "trace" });
  const parentClasses: string[] = [data.subClassOf];

  if (data.auxiliaryClass) {
    data.auxiliaryClass.forEach((el) => {
      /** push all auxiliary classes as parent class to make inheritance via interface extends possible */
      parentClasses.push(el);
    });
  }

  if (data.systemAuxiliaryClass) {
    data.systemAuxiliaryClass.forEach((el) => {
      /** push all auxiliary classes as parent class to make inheritance via interface extends possible */
      parentClasses.push(el);
    });
  }

  const result = `
  ${
    data.lDAPDisplayName !== "top"
      ? `${parentClasses
          .map((el) => `import {${pascalCase(el)}} from './${pascalCase(el)}';`)
          .join("")}`
      : ""
  }
  
  
  
  /**  - object class: ${data.lDAPDisplayName}
   *  - child of class: ${data.subClassOf}
   *  - dn: ${data.originalClassFields.dn}
  */
  // @ts-expect-error
  export interface ${pascalCase(data.lDAPDisplayName)} ${
    data.lDAPDisplayName !== "top"
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
          "${el.lDAPDisplayName}" ${el.isRequired ? "" : "?"}: ${jsTypeMapper(
            el.attributeSyntax,
          )} ${el.isSingleValued ? "" : "[]"};`;
        }),
    )}
  }
  `;

  return result;
}
