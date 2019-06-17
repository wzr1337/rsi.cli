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
exports.SERVICE_NAME_REGEX = /^(?:viwi|rsi)\.service\.([a-zA-Z0-9]+)$/;
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
    const name = (null !== opts.name.match(exports.SERVICE_NAME_REGEX)) ? opts.name.match(exports.SERVICE_NAME_REGEX)[1] : opts.name;
    if (!opts.author)
        throw new Error("missing author name in `author` property.");
    if (!opts.email)
        throw new Error("missing author email in `email` property.");
    const author = `${opts.author} <${opts.email}>`;
    // render package.json
    var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/package.json"), "utf-8"));
    // publish package.json
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/package.json',
        contents: Buffer.from(template({
            name: name,
            author: author,
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
    // render schema.json
    var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/src/schema.json"), "utf-8"));
    // publish schema.json
    outStream.push(new vinyl_1.default({
        cwd: '/',
        base: '/',
        path: '/src/schema.json',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3Qix1REFBeUM7QUFDekMsdUNBQXlCO0FBQ3pCLGtEQUF5QjtBQUN6QixtQ0FBa0M7QUFDckIsUUFBQSxrQkFBa0IsR0FBRyx5Q0FBeUMsQ0FBQztBQVU1RTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFnQixJQUFJLENBQUMsSUFBZ0I7SUFDbkMsb0dBQW9HO0lBQ3BHLE1BQU0sU0FBUyxHQUFHLElBQUksaUJBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO0lBRTVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO0lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksb0RBQW9ELENBQUE7SUFDNUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDL0UsSUFBSSxDQUFD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