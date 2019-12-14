/// <reference types="node" />
import { Readable } from 'stream';
/**
 * renderes markdown from rsi schema
 *
 * @param  {Object}   data data object representation
 * @param  {string}  pathToTemplates path to all templates used to render
 */
export declare function compileMD(data: Object, pathToTemplates: string): Promise<string>;
export declare function renderMarkdown(schemaPath: string, packagePath: string, changelogPath?: string): Promise<Readable>;
export declare function renderHTML(schemaPath: string, packagePath: string, changelogPath?: string): Promise<Readable>;
export declare function compileHTML(data: any, pathToTemplates: any): Promise<string>;
