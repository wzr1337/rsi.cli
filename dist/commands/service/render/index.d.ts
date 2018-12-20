/// <reference types="node" />
import { Readable } from "stream";
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
/**
 * parses a schema from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
export declare function getSampleSchema(): Promise<ISchema>;
/**
 * renderes plantuml syntax from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
export declare function render(schemaData: ISchema): Promise<Readable>;
/**
 * load mustache templates asynchronously
 * @param  {String} mustachesPath The path to all mustaches
 * @private
 */
export declare function loadTemplates(mustachesPath: string): Promise<{
    [templateName: string]: string;
}>;
/**
 * parses schema(s) into ISchema compliant objects
 * @param  {string|Array<string>} schemapaths path(s) to viwi scheme file
 * @return {object} schema representation
 */
export declare function parseSchemas(schemapaths: string | string[]): Promise<ISchema>;
