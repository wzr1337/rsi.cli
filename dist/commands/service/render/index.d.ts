import { Readable } from "stream";
import { ISchema } from "./interfaces";
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
export declare function propertyCompare(a: {
    name: string;
}, b: {
    name: string;
}): 1 | 4 | -4 | 3 | -3 | 2 | -2 | -1 | 0;
/**
 * parses schema(s) into ISchema compliant objects
 * @param  {string|Array<string>} serviceDefs path(s) to viwi scheme file
 * @return {object} schema representation
 */
export declare function parseSchemas(serviceDefs: Object): Promise<ISchema>;
