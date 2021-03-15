import { Readable } from 'stream';
export declare function toUpperCase(value: string): string;
export declare function extractServiceName(serviceName: string): string;
/**
 * load templates
 * @param  {String}   pathToTemplates the template directory (relative)
 * @param  {Function} cb  callback function (error, template literal)
 * @private
 */
export declare function loadTemplates(pathToTemplates: any): Promise<{}>;
/**
 * renderes markdown from rsi schema
 *
 * @param  {Object}   data data object representation
 * @param  {string}  pathToTemplates path to all templates used to render
 */
export declare function compileMD(data: Object, pathToTemplates: string): Promise<any>;
export declare function renderDoc(obj: Object, packageInfo: Object, _compileHTML: boolean): Promise<Readable>;
export declare function compileHTML(data: any, pathToTemplates: any): Promise<string>;
