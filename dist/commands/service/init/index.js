"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const Handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const vinyl_1 = __importDefault(require("vinyl"));
const stream_1 = require("stream");
const regex_1 = require("../../../utils/regex");
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
function init(opts) {
    // create an returnable ReadStream that is in object mode, because we want to put File objects on it
    const outStream = new stream_1.Readable({ objectMode: true });
    outStream._read = () => { }; // implemenmts a read() function
    const version = opts.version || "0.0.1";
    const description = opts.description || "This service lacks description, please fill it in.";
    if (!opts.name)
        throw new Error("missing service name in `name` property.");
    const name = (null !== opts.name.match(regex_1.SERVICE_NAME_REGEX)) ? opts.name.match(regex_1.SERVICE_NAME_REGEX)[1] : opts.name;
    if (!opts.author)
        throw new Error("missing author name in `author` property.");
    if (!opts.email)
        throw new Error("missing author email in `email` property.");
    // const author = { name: opts.author, email: opts.email };
    const author = opts.author;
    // render package.json
    var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/package.json"), "utf-8"));
    // publish package.json
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/package.json',
        contents: Buffer.from(template({
            name: name,
            author: opts.author,
            email: opts.email,
            description: description,
            version: version
        }), "utf-8")
    }));
    // add .gitignore
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/.gitignore',
        contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/.gitignore"))
    }));
    // render serviceDefinition.json
    var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/src/serviceDefinition.json"), "utf-8"));
    // publish schema.json
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/src/serviceDefinition.json',
        contents: Buffer.from(template({
            name: name,
            description: description
        }), "utf-8")
    }));
    // copy readme
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/README.md',
        contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/README.md"))
    }));
    // copy doc
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/doc/main.md',
        contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/doc/main.md"))
    }));
    // end the stream
    outStream.push(null);
    return outStream;
}
exports.init = init;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3Qix1REFBeUM7QUFDekMsdUNBQXlCO0FBQ3pCLGtEQUF5QjtBQUN6QixtQ0FBa0M7QUFDbEMsZ0RBQTBEO0FBVTFEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILFNBQWdCLElBQUksQ0FBQyxJQUFnQjtJQUNuQyxvR0FBb0c7SUFDcEcsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDckQsU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7SUFFNUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7SUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxvREFBb0QsQ0FBQTtJQUM1RixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDNUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2pILElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxN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