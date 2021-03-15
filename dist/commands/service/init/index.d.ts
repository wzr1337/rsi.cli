import { Readable } from "stream";
export interface serviceMeta {
    description?: String;
    version?: String;
    name: String;
    author: String;
    email: String;
}
/**
 * Initializes a service repository
 *
 * Usage:
 *
 * import * as vfs from "vinyl-fs";
 * import { init as initService } from "./commands/service";
 *
 * initService(
 *   {
 *    name: "<someService>",
 *    author: "<authorname>",
 *    email: "<email>"
 *   }
 * ).pipe(vfs.dest("./out"));
 *
 * @param opts [serviceMeta] the initialization configuration
 */
export declare function init(opts: serviceMeta): Readable;
