export interface ISchemaClass {
    name: string;
    properties?: {
        type: string;
        name: string;
    }[];
}
export interface ISchemaEnum {
    name: string;
    belongsTo: string;
    properties: string[];
}
export interface ISchemaType {
    name: string;
}
export interface ISchemaReference {
    from: string;
    to: string;
    property: string;
}
export interface ISchemaNameSpace {
    name: string;
    classes?: ISchemaClass[];
    enums?: ISchemaEnum[];
    types?: ISchemaType[];
    references?: ISchemaReference[];
}
export interface ISchema {
    namespaces: ISchemaNameSpace[];
}
