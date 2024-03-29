# Typescript typedef and meta-data generator for LDAP Schema

It can be useful to interact from schema-aware/type-safe LDAP Client with LDAP servers like active directory.

### How to use

```
npm i ldap-schema-ts-generator
```

```ts
import { Client, IClientConfig } from "ldap-ts-client";
import {
  getSchemaAttributes,
  getSchemaClasses,
  generateInterfaceFiles,
} from "ldap-schema-ts-generator";

const options = {
  user: "**********",
  pass: "************",
  ldapServerUrl: "ldap://domain.com",
  baseDn: "DC=domain,DC=com",
};
const client = new Client(options);

const objectAttributes = await getSchemaAttributes({ client });

const objectClasses = await getSchemaClasses({ client });

await generateInterfaceFiles({ objectAttributes, objectClasses });
}

```

### API

use [api website](https://saostad.github.io/ldap-schema-ts-generator/) for more details

### Functionalities

- generate typescript interfaces for each object class
- generate relations between attributes (json)
- generate graphql schema:
  - type for each object class
  - basic CRUD operations for each object class
- generate typescript enum for supported:
  - controls
  - capabilities
  - extensions
  - policies
  - structural classes

### Sample Generated File:

```ts Account.ts
import { Top } from "./Top";
import { MsExchBaseClass } from "./MsExchBaseClass";

/**  - object class: container
 *  - child of class: top
 *  - dn: CN=Container,CN=Schema,CN=Configuration,DC=ki,DC=local
 */
export interface Container extends Top, MsExchBaseClass {
  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 2.5.4.3
   *   - adminDisplayName: Common-Name
   *   - adminDescription: Common-Name
   *   - dn: CN=Common-Name,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  readonly cn: string;

  /**  - attributeSyntax: 2.5.5.12
   *   - attributeID: 1.2.840.113556.1.2.508
   *   - adminDisplayName: ms-Exch-X500-RDN
   *   - adminDescription: ms-Exch-X500-RDN
   *   - dn: CN=ms-Exch-X500-RDN,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  x500RDN?: string;

  /**  - attributeSyntax: 2.5.5.4
   *   - attributeID: 1.2.840.113556.1.4.7000.102.65
   *   - adminDisplayName: ms-Exch-Template-RDNs
   *   - adminDescription: ms-Exch-Template-RDNs
   *   - dn: CN=ms-Exch-Template-RDNs,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  msExchTemplateRDNs?: string[];

  /**  - attributeSyntax: 2.5.5.1
   *   - attributeID: 1.2.840.113556.1.4.7000.102.50004
   *   - adminDisplayName: ms-Exch-Policy-List
   *   - adminDescription: ms-Exch-Policy-List
   *   - dn: CN=ms-Exch-Policy-List,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  msExchPolicyList?: object[];

  /**  - attributeSyntax: 2.5.5.9
   *   - attributeID: 1.2.840.113556.1.2.296
   *   - adminDisplayName: ms-Exch-Container-Info
   *   - adminDescription: ms-Exch-Container-Info
   *   - dn: CN=ms-Exch-Container-Info,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  containerInfo?: number;

  /**  - attributeSyntax: 2.5.5.1
   *   - attributeID: 1.2.840.113556.1.4.1840
   *   - adminDisplayName: ms-DS-Object-Reference
   *   - adminDescription: A link to the object that uses the data stored in the object that contains this attribute.
   *   - dn: CN=ms-DS-Object-Reference,CN=Schema,CN=Configuration,DC=ki,DC=local
   */
  "msDS-ObjectReference"?: object[];
}
```

### TODO:

- [ ] handle relations (forwardLink/BackLink) via linkID field
- [x] change relation DN fields type from object to string
- [x] generate Enum for ldap controls supported by server from RootDSE
- [x] generate Enum for ldap capabilities supported by server from RootDSE
- [x] generate Enum for ldap extensions supported by server from RootDSE
- [x] generate Enum for ldap policies supported by server from RootDSE
- [ ] generate Base DNs from RootDSE (List of DNs of all the naming contexts and application partitions maintained by the DC)
- [ ] generate naming contexts fields from RootDSE (e.g. defaultNamingContext, configurationNamingContext, schemaNamingContext, rootNamingContext)
- [ ] Active Directory create a functionality to fetch all meta data about server [ref](https://docs.microsoft.com/en-us/windows/win32/adschema/rootdse)
- [ ] Active Directory [Group Type Flags](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/11972272-09ec-4a42-bf5e-3e99b321cf55) and [UserAccountControl flags](https://support.microsoft.com/en-us/help/305144/how-to-use-useraccountcontrol-to-manipulate-user-account-properties)
- [ ] add option to customize generated file names with prefix/postfix (now it 's using Pascal case of ldap display name as interface and file name)
- [ ] create out folders if not exist instead of throwing error
- [x] generate graphql types and CRUD operations
  - [x] generate Type for each objectClass in schema
    - [x] generate custom scalar types (e.g. Date)
    - [x] respect inheritance
    - [ ] respect relations by linkID attribute
  - [x] use dn as identification field
  - [x] generate general operations for each Type:
    - [x] Query get all
    - [x] Query get by dn
    - [x] Mutation delete by dn
    - [x] Mutation update by dn (input only not readonly attributes)

### Know Issues

- when extends to another interface sometimes a field is optional but in other interface is not so typescript gives compatibility warning which prevent generated code to be executed with typescript complier. to fix the problem an extra comment `// @ts-ignore` added in top of all generated interfaces

### Credit

- OID info source: https://ldap.com/ldap-oid-reference-guide/
- Policies info source: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/3f0137a1-63df-400c-bf97-e1040f055a99
- Capabilities info source: https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/3ed61e6c-cfdc-487d-9f02-5a3397be3772
- Websites that helped me to better understand the ldap protocol:
  - https://ldapwiki.com/wiki/LDAP
  - https://www.oreilly.com/library/view/active-directory-4th/
  - https://blog.stealthbits.com/a-guide-to-active-directory-linked-attributes/
  - https://www.neroblanco.co.uk/2015/07/links-and-backlinks-in-active-directory-for-exchange/
  - https://docs.oracle.com/cd/E19957-01/817-6707/controls.html
  - https://blog.kloud.com.au/2016/09/26/active-directory-what-are-linked-attributes/
  - [Active Directory Technical Specification](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/d2435927-0999-4c62-8c6d-13ba31a52e1a)
