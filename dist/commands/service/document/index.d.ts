/// <reference types="node" />
import { Readable } from 'stream';
export declare function renderMarkdown(schemaPath: string, packagePath: string, changelogPath?: string): Promise<Readable>;
