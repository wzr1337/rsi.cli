/// <reference types="node" />
import { Readable } from 'stream';
/**
 * renderes markdown from rsi schema
 *
 * @param  {Object}   data data object representation
 * @param  {string}  pathToTemplates path to all templates used to render
 */
export declare function compileMD(data: Object, pathToTemplates: string): Promise<string>;
export declare function renderDoc(obj: Object, bundle: boolean, packageInfo: Object, _compileHTML: boolean): Promise<Readable>;
export declare function compileHTML(data: any, pathToTemplates: any): Promise<string>;
