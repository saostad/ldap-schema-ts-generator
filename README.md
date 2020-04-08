# Ldap Active Directory Schema Typescript Generator

### How to use

```
npm i ldap-schema-ts-generator
```

```ts
import {
  getSchemaAttributes,
  getSchemaClasses,
  generateInterfaceFiles,
} from "ldap-schema-ts-generator";

async function main() {
  const schemaDn = "CN=Schema,CN=Configuration,DC=domain,DC=com";
  const options = {
    user: "**********",
    pass: "************",
    ldapServerUrl: "ldap://domain.com",
  };

  const objectAttributes = await getSchemaAttributes({ schemaDn, options });

  const objectClasses = await getSchemaClasses({ schemaDn, options });

  await generateInterfaceFiles({ objectAttributes, objectClasses });
}

main().catch((err) => {
  console.log(err);
});
```

### Result

creates typescript interface for each LDAP class that exist in schema

### Sample:

```ts Account.ts
import { Top } from "./Top";

/**  - object class: account
 *  - child of class: top
 *  - dn: CN=account,CN=Schema,CN=Configuration,DC=ki,DC=local
 */

export interface Account extends Top {
  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 0.9.2342.19200300.100.1.1
   *   - adminDisplayName: uid
   *   - adminDescription: A user ID.
   *   - dn: CN=uid,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  uid?: string[];

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 0.9.2342.19200300.100.1.9
   *   - adminDisplayName: host
   *   - adminDescription: The host attribute type specifies a host computer.
   *   - dn: CN=host,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  host?: string[];

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 2.5.4.11
   *   - adminDisplayName: Organizational-Unit-Name
   *   - adminDescription: Organizational-Unit-Name
   *   - dn: CN=Organizational-Unit-Name,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  ou?: string[];

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 2.5.4.10
   *   - adminDisplayName: Organization-Name
   *   - adminDescription: Organization-Name
   *   - dn: CN=Organization-Name,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  o?: string[];

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 2.5.4.7
   *   - adminDisplayName: Locality-Name
   *   - adminDescription: Locality-Name
   *   - dn: CN=Locality-Name,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  l?: string;

  /**  - attributeSyntax: 2.5.5.1
   *   - attributeID: 2.5.4.34
   *   - adminDisplayName: See-Also
   *   - adminDescription: See-Also
   *   - dn: CN=See-Also,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  seeAlso?: object[];

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 2.5.4.13
   *   - adminDisplayName: Description
   *   - adminDescription: Description
   *   - dn: CN=Description,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  description?: string[];
}
```

### Options:

```ts
options?: {
    /** default generated folder of root directory of you project */
    outputFolder?: string;
    /** use prettier to format generated files. default true */
    usePrettier?: boolean;
    /** create index file for output folder. default true */
    indexFile: boolean;
  };

```
