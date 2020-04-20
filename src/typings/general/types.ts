export type { Logger } from "fast-node-logger";
export type { SearchEntryObject } from "ldap-ts-client";

/** name of class */
export type Name = string;

/** The unique X.500 OID for identifying an attribute.
 * - The OID of this attribute. This value must be unique among the attributeID values of all [attributeSchema](https://docs.microsoft.com/windows/desktop/ADSchema/c-attributeschema) objects and [governsIDs](https://docs.microsoft.com/windows/desktop/ADSchema/a-governsid) of all classSchema objects. For more information, see [Object Identifiers](https://docs.microsoft.com/en-us/windows/win32/ad/object-identifiers).
 */
export type AttributeID = string;

/** Every object in Active Directory Domain Services has a naming attribute from which its Relative Distinguished Name (RDN) is formed. The naming attribute for classSchema objects is cn (Common-Name). The value assigned to cn is the value that the object class will have as its RDN. For example, the cn of the organizationalUnit object class is Organizational-Unit, which would appear in a distinguished name as CN=Organizational-Unit. The cn must be unique in the schema container. */
export type CN = string;

/** The name used by LDAP clients, such as the ADSI LDAP provider, to refer to the class, for example to specify the class in a search filter. A class's lDAPDisplayName must be unique in the schema container, which means it must be unique across all classSchema and attributeSchema objects. For more information about composing a cn and an lDAPDisplayName for a new class, see Naming Attributes and Classes.
 * - Classes have several identifiers including ldapDisplayName, which are used by LDAP clients to identify the class in search filters, and schemaIDGUID, which are used in security descriptors to control access to the class.
 */
export type LDAPDisplayName = string;

/** The X.500 Directory uses distinguished names (DNs) as primary keys to entries in the directory.
 * - [RFC 4514 - String Representation of Distinguished Names](https://tools.ietf.org/html/rfc4514)
 * - 2.5.4.49
 * - The OID for DN Syntax is 1.3.6.1.4.1.1466.115.121.1.12
 */
export type DN = string;

/** A GUID stored as an octet string. This GUID uniquely identifies the class. This GUID can be used in access control entries to control access to objects of this class. For more information, see Setting Permissions on Child Object Operations. On creation of the classSchema object, the Active Directory server generates this value if it is not specified. If you create a new class, generate your own GUID for each class so that all installations of your extension use the same schemaIDGUID to refer to the class. */
export type SchemaIDGUID = string;

/** A display name of the class for use in administrative tools. If adminDisplayName is not specified when a class is created, the system uses the Common-Name value as the display name. This display name is used only if a mapping does not exist in the classDisplayName property of the display specifier for the class. For more information, see [Display Specifiers and Class and Attribute Display Names](https://docs.microsoft.com/en-us/windows/win32/ad/class-and-attribute-display-names). */
export type AdminDisplayName = string;

/** The OID of the class. This value must be unique among the governsIDs of all classSchema objects and the attributeIDs of all attributeSchema objects. For more information, see [Object Identifiers](https://docs.microsoft.com/en-us/windows/win32/ad/object-identifiers). */
export type GovernsID = string;

/** Identifies the naming attribute, which is the attribute that provides the RDN for this class if different than the default (cn). Use of a naming attribute other than cn is discouraged. Naming attributes should be drawn from the well-known set (OU, CN, O, L, and DC) that is understood by all LDAP version 3 clients. For more information, see Object Names and Identities and Syntaxes for Attributes in Active Directory Domain Services. A naming attribute must have the Directory String syntax. For more information, see Syntaxes for Attributes in Active Directory Domain Services. */
export type RDnAttId = string;

/** multi-valued properties that specify the attributes that must be present on instances of this class. These are mandatory attributes that must be present during creation and cannot be cleared after creation. After creation of the class, these properties cannot be changed. The full set of mandatory attributes for a class is the union of the systemMustContain and mustContain values on this class and all inherited classes. */
export type MustContain = string[] | string;

/** multi-valued properties that specify the attributes that must be present on instances of this class. These are mandatory attributes that must be present during creation and cannot be cleared after creation. After creation of the class, these properties cannot be changed. The full set of mandatory attributes for a class is the union of the systemMustContain and mustContain values on this class and all inherited classes. */
export type SystemMustContain = string[] | string;

/** multi-valued properties that specify the attributes that MAY be present on instances of this class. These are optional attributes that are not mandatory and, therefore, may or may not be present on an instance of this class. You can add or remove mayContain values from an existing category 1 or category 2 classSchema object. Before removing a mayContain value from a classSchema object, you should search for instances of the object class and clear any values for the attribute that you are removing. After creation of the class, the systemMayContain property cannot be changed The full set of optional attributes for a class is the union of the systemMayContain and mayContain values on this class and all inherited classes. */
export type MayContain = string[] | string;

/** multi-valued properties that specify the attributes that MAY be present on instances of this class. These are optional attributes that are not mandatory and, therefore, may or may not be present on an instance of this class. You can add or remove mayContain values from an existing category 1 or category 2 classSchema object. Before removing a mayContain value from a classSchema object, you should search for instances of the object class and clear any values for the attribute that you are removing. After creation of the class, the systemMayContain property cannot be changed The full set of optional attributes for a class is the union of the systemMayContain and mayContain values on this class and all inherited classes. */
export type SystemMayContain = string[] | string;

/** multi-valued properties that specify the structural classes that can be legal parents of instances of this class.
 * The full set of possible superiors is the union of the systemPossSuperiors and possSuperiors values on this class and any inherited structural or abstract classes.
 * - systemPossSuperiors and possSuperiors values are not inherited from auxiliary classes.
 * - You can add or remove possSuperiors values from an existing category 1 or category 2 classSchema object.
 * - After creation of the class, the systemPossSuperiors property cannot be changed.
 * - See [MS-ADTS](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/d2435927-0999-4c62-8c6d-13ba31a52e1a) section [3.1.1.2.4.4](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/8c6a7be3-ae6e-4dae-9148-c6ac649e3816) for more information on Active Directory usage.
 */
export type PossSuperiors = string[] | string;

/** multi-valued properties that specify the structural classes that can be legal parents of instances of this class.
 * The full set of possible superiors is the union of the systemPossSuperiors and possSuperiors values on this class and any inherited structural or abstract classes.
 * - systemPossSuperiors and possSuperiors values are not inherited from auxiliary classes.
 * - You can add or remove possSuperiors values from an existing category 1 or category 2 classSchema object.
 * - After creation of the class, the systemPossSuperiors property cannot be changed.
 * - See [MS-ADTS](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/d2435927-0999-4c62-8c6d-13ba31a52e1a) section [3.1.1.2.4.4](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/8c6a7be3-ae6e-4dae-9148-c6ac649e3816) for more information on Active Directory usage. */
export type SystemPossSuperiors = string[] | string;

/** An integer value that specifies the category of the class, which can be one of the following:
 * - 1 for Structural, you can directly create objects of its type in Active Directory. The user and group classes are examples of structural classes.
 * - 2 for Abstract, meaning that the class provides a basic definition of a class that can be used to form structural classes. It is possible that you would want to create a class that inherits from other classes and has certain attributes but that is not one you will ever need to create instances of directly. This type of class is known as abstract. For example, let’s say that the Marketing-User and Finance-User were to be the first of a number of structural classes that had a common structure. In that case, you could create an abstract class to be used as the basis of other structural classes. Abstract classes can inherit from other classes, can have attributes defined on them directly, and in all other ways act like structural classes, except that instances of them cannot directly be created as objects in Active Directory.
 * - 3 for Auxiliary, meaning that a class that can be used to extend the definition of a class that inherits from it but cannot be used to form a class by itself. Auxiliary classes are a way for structural and abstract classes to inherit collections of attributes that do not have to be defined directly within the classes themselves. It is primarily a grouping mechanism. An auxiliary class can be a subclass of an abstract or auxiliary class. An auxiliary class can include any number of auxiliary classes in its definition.
 *
 * - Size 4 bytes. 0 should not be used.
 * - For more information, see [Structural, Abstract, and Auxiliary Classes](https://docs.microsoft.com/en-us/windows/win32/ad/structural-abstract-and-auxiliary-classes).
 */
export type ObjectClassCategory = string;

/** Object identifiers (OID) are used throughout LDAP, but they’re particularly common in schema elements, controls, and extended operations.
 * - [LDAP OID Reference Guide](https://ldap.com/ldap-oid-reference-guide/)
 */
export type OID = string;

/** The parent class of a class.
 * The subClassOf attribute of a classSchema object is a single-valued property that indicates the immediate superclass of the class.
 * - For structural classes, subClassOf can be a structural or abstract class.
 * - For abstract classes, subClassOf can be an abstract class only.
 * - For auxiliary classes, subClassOf can be an abstract or auxiliary class.
 * - If you define a new class, ensure that the subClassOf class exists or will exist when the new class is written to the directory.
 * - If class does not exist, the classSchema object is not added to the directory.
 * @Note
 * A class inherits the following data from its superclasses:
 * - Possible attributes: The values of the mustContain, mayContain, systemMustContain, and systemMayContain attributes of a classSchema object define a complete list of the attributes that can be set on an instance of the object class. For each object class, the values of these attributes include all of the values that are inherited from its superclasses, as well as any values that are set explicitly for the object class itself. Thus, the mustContain attribute of the organizationalPerson class includes all the mustContain values that are inherited from the person and top classes as well as any mustContain values that are set explicitly on the organizationalPerson class.
 * - Possible parents in the directory hierarchy: The values of the possSuperiors and systemPossSuperiors attributes of a classSchema object define a complete list of the object classes that can contain an instance of the object class. For each object class, the values include those inherited from its superclasses, as well as those set explicitly for the object class itself.
 * @Note
 * Be aware that object class can also have many auxiliary classes, which are specified in the auxiliaryClass and systemAuxiliaryClass attributes of a classSchema object. An object class inherits mustContain, mayContain, systemMustContain, and systemMayContain values from its auxiliary classes.
 */
export type SubClassOf = string;

/** multi-valued properties that specify the auxiliary classes that this class inherits from. The full set of auxiliary classes is the union of the systemAuxiliaryClass and auxiliaryClass values on this class and all inherited classes. For an existing classSchema object, values can be added to the auxiliaryClass property but not removed. After creation of the class, the systemAuxiliaryClass property cannot be changed. */
export type AuxiliaryClass = string | string[];

/** multi-valued properties that specify the auxiliary classes that this class inherits from. The full set of auxiliary classes is the union of the systemAuxiliaryClass and auxiliaryClass values on this class and all inherited classes. For an existing classSchema object, values can be added to the auxiliaryClass property but not removed. After creation of the class, the systemAuxiliaryClass property cannot be changed. */
export type SystemAuxiliaryClass = string | string[];

/** The distinguished name of this object class or one of its superclasses. 
 * - When an instance of this object class is created, the system sets the objectCategory property of the new instance to the value specified in the defaultObjectCategory property of its object class. 
 * - The objectCategory property is an indexed property used to increase the efficiency of object class searches. 
 * - If defaultObjectCategory is not specified when a class is created, the system sets it to the distinguished name (DN) of the classSchema object for this class. 
 * - If this object will be frequently queried by the value of a superclass rather than the object's own class, you can set defaultObjectCategory to the DN of the superclass. For example, if you are subclassing a predefined (category 1) class, the best practice is to set defaultObjectCategory to the same value as the superclass. This enables the standard UI to "find" your subclass.
For more information, see [Object Class and Object Category](https://docs.microsoft.com/en-us/windows/win32/ad/object-class-and-object-category). */
export type DefaultObjectCategory = string;

/** A Boolean value that specifies the default setting of the showInAdvancedViewOnly property of new instances of this class.
 * - Many directory objects are not interesting to end users. To keep these objects from cluttering the UI, every object has a Boolean attribute called showInAdvancedViewOnly.
 * - If defaultHidingValue is set to TRUE, new object instances are hidden in the Administrative snap-ins and the Windows shell. A menu item for the object class will not appear in the New context menu of the Administrative snap-ins even if the appropriate creation wizard properties are set on the object class's displaySpecifier object.
 * - If defaultHidingValue is set to FALSE, new instances of the object are displayed in the Administrative snap-ins and the Windows shell.
 * - Set this property to FALSE to see instances of the class in the administrative snap-ins and the shell and enable a creation wizard and its menu item in the New menu of the administrative snap-ins.
 * - If the defaultHidingValue value is not set, the default is TRUE. */
export type DefaultHidingValue = string;

/** An integer value that contains flags that define additional properties of the class.
 * - The 0x10 bit identifies a category 1 class (a class that is part of the base schema that is included with the system). You cannot set this bit, which means that the bit is not set in category 2 classes (which are extensions to the schema). */
export type SystemFlags = string;

/** A Boolean value that specifies whether only the Active Directory server can modify the class.
 * - System-only classes can be created or deleted only by the Directory System Agent (DSA).
 * - System-only classes are those that the system depends on for normal operations. */
export type SystemOnly = string;

/** Specifies the default security descriptor for new objects of this class. For more information, see [Default Security Descriptor](https://docs.microsoft.com/en-us/windows/win32/ad/default-security-descriptor) and [How Security Descriptors are Set on New Directory Objects](https://docs.microsoft.com/en-us/windows/win32/ad/how-security-descriptors-are-set-on-new-directory-objects). */
export type DefaultSecurityDescriptor = string;

/** A Boolean value that indicates whether the class is defunct (no longer existing or functioning). For more information, see [Disabling Existing Classes and Attributes](https://docs.microsoft.com/en-us/windows/win32/ad/disabling-existing-classes-and-attributes). */
export type IsDefunct = string;

/** A text description of the class for use by administrative applications. */
export type Description = string;

/** The list of classes from which this class is derived. */
export type ObjectClass = string | string[];

/** The classDisplayName attribute is a single-value Unicode string that specifies the class display name. */
export type ClassDisplayName = string;

/** A bit field that dictates how the object is instantiated on a particular server. The value of this attribute can differ on different replicas even if the replicas are in sync.
 * @note this attribute can be zero or a combination of one or more of the following values.
 * - 0x00000001 	The head of naming context.
 * - 0x00000002 	This replica is not instantiated.
 * - 0x00000004 	The object is writable on this directory.
 * - 0x00000008 	The naming context above this one on this directory is held.
 * - 0x00000010 	The naming context is in the process of being constructed for the first time by using replication.
 * - 0x00000020 	The naming context is in the process of being removed from the local DSA.
 * */
export type InstanceType = string;

/** The attributeDisplayNames attribute is a multi-value property that specifies the names to use in the UI for attributes of the object class. */
export type AttributeDisplayNames = string | string[];

/** A GUID stored as an octet string. This is an optional GUID that identifies the attribute as a member of an attribute grouping; this is also called a property set. You can use this GUID in access control entries to control access to all attributes in the property set, that is, to all attributes that have the specified GUID set in their [attributeSecurityGUID](https://docs.microsoft.com/windows/desktop/ADSchema/a-attributesecurityguid) property. For more information, see [Setting Permissions on a Group of Properties](https://docs.microsoft.com/en-us/windows/win32/ad/setting-permissions-on-a-group-of-properties). */
export type AttributeSecurityGUID = string;

/** The object identifier of the syntax for this attribute. The combination of the attributeSyntax and [oMSyntax](https://docs.microsoft.com/windows/desktop/ADSchema/a-omsyntax) properties determines the syntax of the attribute, that is, the type of data stored by instances of the attribute.
 * - For more information about the attributeSyntax, oMSyntax, and oMObjectClass syntax attributes, see [Syntaxes for Attributes in Active Directory Domain Services](https://docs.microsoft.com/en-us/windows/win32/ad/syntaxes-for-attributes-in-active-directory-domain-services). */
export type AttributeSyntax = string;

/** An integer that is the XDS representation of the syntax. */
export type OMSyntax = string;

/** An octet string that must be specified for attributes of oMSyntax 127. For attributes with any other oMSyntax value, this property is not used. If no oMObjectClass is specified for an attribute with an oMSyntax of 127, the default oMObjectClass is set. Usually, there is a one-to-one mapping between the attributeSyntax and the oMObjectClass. */
export type OMObjectClass = string;

/** integer that specify the lower and upper bounds of the range of values for this attribute.
 * - All values set for the attribute must be within or equal to the specified bounds.
 * - For attributes with numeric syntax the range specifies the minimum and maximum value.
 * - For attributes with string syntax the range specifies the minimum and maximum size, in characters.
 * - For attributes with binary syntax, the range specifies the number of bytes.
 * - If both rangeLower and rangeUpper are set, rangeLower must be less than rangeUpper.
 * - If one constraint is present without the other, the missing constraint is unbounded.
 *
 * For example, if the rangeLower for an integer is 3, and rangeUpper is absent, it means there is no upper constraint on the attribute. If rangeUpper for a string is 2000, and rangeLower is absent, this indicates that there is no lower constraint on the length. */
export type RangeLower = string;

/** integer that specify the lower and upper bounds of the range of values for this attribute.
 * - All values set for the attribute must be within or equal to the specified bounds.
 * - For attributes with numeric syntax the range specifies the minimum and maximum value.
 * - For attributes with string syntax the range specifies the minimum and maximum size, in characters.
 * - For attributes with binary syntax, the range specifies the number of bytes.
 * - If both rangeLower and rangeUpper are set, rangeLower must be less than rangeUpper.
 * - If one constraint is present without the other, the missing constraint is unbounded.
 *
 * For example, if the rangeLower for an integer is 3, and rangeUpper is absent, it means there is no upper constraint on the attribute. If rangeUpper for a string is 2000, and rangeLower is absent, this indicates that there is no lower constraint on the length. */
export type RangeUpper = string;

/** A Boolean value that is TRUE if the attribute can have only one value or FALSE if the attribute can have multiple values. If this property is not set, the attribute has a single value.
Multi-valued attributes are unordered; there is no guarantee they will be stored or returned in any specific order. In the event of a replication collision, conflict resolution is for each attribute, not for each value within an attribute. The entire multi-value succeeds or fails. For more information about replication collision, see [Consistency GUIDs](https://docs.microsoft.com/en-us/windows/win32/ad/consistency-guids). */
export type IsSingleValued = string;

/** This attribute specifies whether the attribute is to be visible in the Advanced mode of user interfaces (UIs). Active Directory snap-ins read this attribute.
 * - A Boolean value that is TRUE or FALSE
 */
export type ShowInAdvancedViewOnly = string;

/** This attribute specifies an object class name that is used to group objects of this or derived classes. Every object in Active Directory has this attribute. See [MS-ADTS](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/d2435927-0999-4c62-8c6d-13ba31a52e1a) section [3.1.1.3.1.3.5](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/e1c068a5-eb1d-4f62-ab3b-81218472cb57) for more information about how Active Directory uses this attribute in searches. */
export type ObjectCategory = string;

/** Contains a set of flags that specify search and indexing information for an attribute. For more information, see [Indexed Attributes](https://docs.microsoft.com/en-us/windows/win32/ad/indexed-attributes). */
export type SearchFlags = string | string[];

/** A Boolean value that is TRUE if the attribute is replicated to the global catalog or FALSE if the attribute is not included in the global catalog. For more information, see [Attributes Included in the Global Catalog](https://docs.microsoft.com/en-us/windows/win32/ad/attributes-included-in-the-global-catalog). */
export type IsMemberOfPartialAttributeSet = string;

/** An integer that indicates that the attribute is a linked attribute (Relation between attributes).
 * - Even linkID Value are forward links
 * - Odd linkID Value are BackLinks equals to the linkID of the corresponding forward link linkID plus one.
 * - linkID Value of 0 or not present implies it is NOT a Linked Attribute
 */
export type LinkID = string;

/** An integer by which MAPI clients identify this attribute.*/
export type MAPIID = string;

/** The description displayed on admin screens. */
export type AdminDescription = string;
