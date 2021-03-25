"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
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
        contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/tpl.git_ign"))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsdURBQXlDO0FBQ3pDLHVDQUF5QjtBQUN6QixrREFBeUI7QUFDekIsbUNBQWtDO0FBQ2xDLGdEQUEwRDtBQVUxRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxTQUFnQixJQUFJLENBQUMsSUFBZ0I7SUFDbkMsb0dBQW9HO0lBQ3BHLE1BQU0sU0FBUyxHQUFHLElBQUksaUJBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO0lBRTVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO0lBQ3hDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksb0RBQW9ELENBQUE7SUFDNUYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDL0UsSUFBSSxDQUFDLElBQUksQ0FB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