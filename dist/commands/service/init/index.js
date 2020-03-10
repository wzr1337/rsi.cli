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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3Qix1REFBeUM7QUFDekMsdUNBQXlCO0FBQ3pCLGtEQUF5QjtBQUN6QixtQ0FBa0M7QUFDbEMsZ0RBQTBEO0FBVTFEOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNILFNBQWdCLElBQUksQ0FBQyxJQUFnQjtJQUNuQyxvR0FBb0c7SUFDcEcsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDckQsU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7SUFFNUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7SUFDeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxvREFBb0QsQ0FBQTtJQUM1RixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDNUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2pILElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDOUUsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUVoRCxzQkFBc0I7SUFDdEIsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FDL0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwrQ0FBK0MsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkcsdUJBQXVCO0lBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFJLENBQUM7UUFDdEIsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxlQUFlO1FBQ3JCLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLEVBQUUsSUFBSTtZQUNWLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLFdBQVc7WUFDeEIsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQyxFQUFDLE9BQU8sQ0FBQztLQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUosaUJBQWlCO0lBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFJLENBQUM7UUFDdEIsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxhQUFhO1FBQ25CLFFBQVEsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDZDQUE2QyxDQUFDLENBQUM7S0FDL0YsQ0FBQyxDQUFDLENBQUM7SUFFSixxQkFBcUI7SUFDckIsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FDL0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrREFBa0QsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUNqRyxDQUFDO0lBQ0osc0JBQXNCO0lBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFJLENBQUM7UUFDdEIsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxrQkFBa0I7UUFDeEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzdCLElBQUksRUFBRSxJQUFJO1lBQ1YsV0FBVyxFQUFFLFdBQVc7U0FDekIsQ0FBQyxFQUFDLE9BQU8sQ0FBQztLQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUosY0FBYztJQUNkLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFJLENBQUM7UUFDdEIsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxZQUFZO1FBQ2xCLFFBQVEsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7S0FDOUYsQ0FBQyxDQUFDLENBQUM7SUFFSixXQUFXO0lBQ1gsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUksQ0FBQztRQUN0QixHQUFHLEVBQUUsR0FBRztRQUNSLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLGNBQWM7UUFDcEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsOENBQThDLENBQUMsQ0FBQztLQUNoRyxDQUFDLENBQUMsQ0FBQztJQUVKLGlCQUFpQjtJQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sU0FBUyxDQUFDO0FBQ2xCLENBQUM7QUF2RUYsb0JBdUVFO0FBQUEsQ0FBQyJ9