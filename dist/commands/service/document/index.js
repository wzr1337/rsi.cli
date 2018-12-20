"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fs_1 = require("fs");
const stream_1 = require("stream");
const handlebars_1 = __importDefault(require("handlebars"));
const vinyl_1 = __importDefault(require("vinyl"));
const ASSESTS_PATH = path.join(path.dirname(__filename), "../../../../assets/documentation.templates");
/**
 * load templates
 * @param  {String}   pathToTemplates the template directory (relative)
 * @param  {Function} cb  callback function (error, template literal)
 * @private
 */
const loadTemplates = function (pathToTemplates) {
    return __awaiter(this, void 0, void 0, function* () {
        const names = fs_1.readdirSync(pathToTemplates);
        var files = names.map((it) => { return path.join(pathToTemplates, it); });
        let tmpls = {};
        files.map((tmpl, idx) => {
            tmpls[names[idx].split('.')[0]] = fs_1.readFileSync(files[idx], "utf-8");
        });
        return tmpls;
    });
};
/**
 * renderes markdown from rsi schema
 *
 * @param  {Object}   data data object representation
 * @param  {tmplpath}  template path to all templates used to render
 */
const render = (data, pathToTemplates) => __awaiter(this, arguments, void 0, function* () {
    //var args = [...arguments]; spread operator does not work
    var args = Array.from(arguments);
    if (!data || null === data || !pathToTemplates)
        throw new Error("missing data");
    if (!pathToTemplates)
        throw new Error("missing pathToTemplates");
    const templates = yield loadTemplates(pathToTemplates);
    var serviceOverview = templates["$index"];
    handlebars_1.default.registerHelper('toUpperCase', string => string.toUpperCase());
    handlebars_1.default.registerHelper('extractServiceName', (serviceName /** e.g. rsi.service.something */) => {
        if (!serviceName)
            return "_undefined_";
        const match = serviceName.match(/^rsi.service.(\w+)$/);
        if (null === match)
            throw new Error(`service name ${serviceName} does not match the rsi.service.XXXX pattern`);
        return match[1];
    });
    handlebars_1.default.registerHelper('ifEqCi', (a, b, opts) => {
        if (a.toUpperCase() === b.toUpperCase())
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
    handlebars_1.default.registerHelper('ifnEqCi', (a, b, opts) => {
        if (a.toUpperCase() !== b.toUpperCase())
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
    handlebars_1.default.registerHelper('isMandatory', (name, required, totalLength) => {
        totalLength = totalLength || 3;
        const mandatory = (required && required.indexOf(name) > -1) ? 'yes' : 'no';
        return new handlebars_1.default.SafeString(mandatory + new Array(totalLength - mandatory.length).join(" "));
    });
    handlebars_1.default.registerHelper('strech', (str, totalLength) => {
        str = str || "";
        var length = (totalLength - str.length + 1);
        return new handlebars_1.default.SafeString(str + new Array((length >= 0) ? length : 0).join(" "));
    });
    handlebars_1.default.registerHelper('getValue', function (property) {
        var resolveObject = (property) => {
            if (property.hasOwnProperty("oneOf")) {
                var refs = [];
                for (var key in property.oneOf) {
                    var objname = /\w*Object/.exec(property.oneOf[key]['#ref']);
                    refs.push("[/" + property.oneOf[key]['#ref'].replace(/\./g, '/') + '](#' + objname + ')');
                }
                return new handlebars_1.default.SafeString(refs.join("<br />"));
            }
            return "n/a";
        };
        const expandEnum = (property) => {
            if (property.hasOwnProperty("enum")) {
                return new handlebars_1.default.SafeString(property.enum.join("<br />"));
            }
            else {
                return "-";
            }
        };
        switch (property.type.toLowerCase()) {
            case "string":
                return expandEnum(property);
                break;
            case "object":
                return resolveObject(property);
                break;
            case "array":
                if (property.hasOwnProperty("items")) {
                    switch (property.items.type.toLowerCase()) {
                        case "string":
                            return expandEnum(property.items);
                            break;
                        case "object":
                            return resolveObject(property.items);
                            break;
                    }
                }
                return "-";
                break;
            case "number":
                return "[" + (property.minimum || "-inf") + ".." + (property.maximum || "inf") + "] " + (property.resolution ? "@" + property.resolution : "");
                break;
            default:
                return "-";
        }
    });
    handlebars_1.default.registerHelper('safeString', function (str) {
        return new handlebars_1.default.SafeString(str);
    });
    handlebars_1.default.registerHelper('resourceLevelAction', function (method) {
        //          Handlebars.log("ERROR", "hi");
        switch (method.toUpperCase()) {
            case "GET":
                return "retrieve a list of available elements of type";
                break;
            case "SUBSCRIBE":
                return "subscribe to updates on a list of available elements of type";
                break;
            case "POST":
                return "create a new element of type";
                break;
            default:
        }
    });
    handlebars_1.default.registerHelper('methodToText', function (method) {
        switch (method.toUpperCase()) {
            case "SUBSCRIBE":
                return "WebSocket Subscription";
                break;
            case "GET":
            case "PUT":
            case "POST":
            case "DELETE":
                return `HTTP ${method.toUpperCase()} request`;
        }
    });
    handlebars_1.default.registerHelper('elementLevelAction', function (method) {
        switch (method.toUpperCase()) {
            case "GET":
                return "retrieve a particular";
                break;
            case "SUBSCRIBE":
                return "subscribe to updates on a particular";
                break;
            case "PUT":
                return "create a custom";
                break;
            case "POST":
                return "update a particular";
                break;
            case "DELETE":
                return "update a particular";
                break;
            default:
        }
    });
    return handlebars_1.default.compile(serviceOverview)(data);
});
function renderMarkdown(schemaPath, packagePath, changelogPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // create an returnable ReadStream that is in object mode, because we want to put File objects on it
        const outStream = new stream_1.Readable({ objectMode: true });
        outStream._read = () => { }; // implemenmts a read() function 
        var schema = {
            spec: JSON.parse(fs_1.readFileSync(schemaPath, 'utf-8')),
            meta: JSON.parse(fs_1.readFileSync(packagePath, 'utf-8')),
            changelog: changelogPath ? fs_1.readFileSync(changelogPath) : undefined
        };
        render(schema, ASSESTS_PATH).then(data => {
            // publish schema.json
            outStream.push(new vinyl_1.default({
                cwd: '/',
                base: '/',
                path: `/${schema.meta.name || "index"}_${schema.meta.version || "XYZ"}.md`,
                contents: Buffer.from(data, "utf-8")
            }));
            const curlies = new vinyl_1.default({
                cwd: '/',
                base: '/',
                path: "/curlies.png",
                contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "curlies.png"))
            });
            outStream.push(curlies);
        });
        return outStream;
    });
}
exports.renderMarkdown = renderMarkdown;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBb0Y7QUFDcEYsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFFekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7QUFFdkc7Ozs7O0dBS0c7QUFDSCxNQUFNLGFBQWEsR0FBRyxVQUFlLGVBQWU7O1FBQ2xELE1BQU0sS0FBSyxHQUFHLGdCQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBRSxDQUFDO1FBQ3pFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUMsR0FBRyxFQUFFLEVBQUU7WUFDckIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUFBLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILE1BQU0sTUFBTSxHQUFHLENBQU8sSUFBSSxFQUFFLGVBQWUsRUFBRSxFQUFFO0lBRTdDLDBEQUEwRDtJQUMxRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWpDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWU7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2hGLElBQUksQ0FBQyxlQUFlO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBRWpFLE1BQU0sU0FBUyxHQUFHLE1BQU0sYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZELElBQUksZUFBZSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUxQyxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUV6RSxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFdBQW1CLENBQUMsaUNBQWlDLEVBQUUsRUFBRTtRQUN4RyxJQUFJLENBQUMsV0FBVztZQUFFLE9BQU8sYUFBYSxDQUFBO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN2RCxJQUFJLElBQUksS0FBSyxLQUFLO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsV0FBVyw4Q0FBOEMsQ0FBQyxDQUFBO1FBQzlHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0JBQVUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUMvQyxJQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFFckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0JBQVUsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNsRCxJQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFFckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUQsb0JBQVUsQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsRUFBRTtRQUN2RSxXQUFXLEdBQUcsV0FBVyxJQUFJLENBQUMsQ0FBQztRQUMvQixNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzFFLE9BQU8sSUFBSSxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxHQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUMsQ0FBQztJQUVILG9CQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRTtRQUNyRCxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sSUFBSSxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDLENBQUM7SUFFSCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsVUFBUyxRQUFRO1FBQ3JELElBQUksYUFBYSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDL0IsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLElBQUksR0FBQyxFQUFFLENBQUM7Z0JBQ1osS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFO29CQUM5QixJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7aUJBQzNGO2dCQUNELE9BQU8sSUFBSSxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDdkQ7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQTtRQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLElBQUksb0JBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUNoRTtpQkFDSTtnQkFDSCxPQUFPLEdBQUcsQ0FBQzthQUNaO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsUUFBUSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ25DLEtBQUssUUFBUTtnQkFDWCxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUIsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3BDLFFBQVEsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7d0JBQ3pDLEtBQUssUUFBUTs0QkFDWCxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ2xDLE1BQU07d0JBQ1IsS0FBSyxRQUFROzRCQUNYLE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDckMsTUFBTTtxQkFDVDtpQkFDRjtnQkFDRCxPQUFPLEdBQUcsQ0FBQztnQkFDWCxNQUFNO1lBQ1IsS0FBSyxRQUFRO2dCQUNYLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDOUksTUFBTTtZQUNSO2dCQUNFLE9BQU8sR0FBRyxDQUFDO1NBQ2Q7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILG9CQUFVLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxVQUFTLEdBQUc7UUFDbEQsT0FBTyxJQUFJLG9CQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0JBQVUsQ0FBQyxjQUFjLENBQUMscUJBQXFCLEVBQUUsVUFBUyxNQUFNO1FBQ2xFLDBDQUEwQztRQUN0QyxRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUM1QixLQUFLLEtBQUs7Z0JBQ1IsT0FBTywrQ0FBK0MsQ0FBQTtnQkFDdEQsTUFBTTtZQUNSLEtBQUssV0FBVztnQkFDZCxPQUFPLDhEQUE4RCxDQUFBO2dCQUNyRSxNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE9BQU8sOEJBQThCLENBQUE7Z0JBQ3JDLE1BQU07WUFDUixRQUFRO1NBQ1Q7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILG9CQUFVLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxVQUFTLE1BQU07UUFDdkQsUUFBUSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxXQUFXO2dCQUNkLE9BQU8sd0JBQXdCLENBQUE7Z0JBQy9CLE1BQU07WUFDUixLQUFLLEtBQUssQ0FBQztZQUNYLEtBQUssS0FBSyxDQUFDO1lBQ1gsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFBO1NBQ2hEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxVQUFTLE1BQU07UUFDN0QsUUFBUSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxLQUFLO2dCQUNSLE9BQU8sdUJBQXVCLENBQUE7Z0JBQzlCLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ2QsT0FBTyxzQ0FBc0MsQ0FBQTtnQkFDN0MsTUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixPQUFPLGlCQUFpQixDQUFBO2dCQUN4QixNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE9BQU8scUJBQXFCLENBQUE7Z0JBQzVCLE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsT0FBTyxxQkFBcUIsQ0FBQTtnQkFDNUIsTUFBTTtZQUNSLFFBQVE7U0FDVDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUEsQ0FBQTtBQUVELFNBQXNCLGNBQWMsQ0FBQyxVQUFpQixFQUFFLFdBQW1CLEVBQUUsYUFBc0I7O1FBRW5HLG9HQUFvRztRQUNwRyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlCQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRCxTQUFTLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztRQUUzRCxJQUFJLE1BQU0sR0FBRztZQUNYLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDbkUsQ0FBQztRQUVGLE1BQU0sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3hDLHNCQUFzQjtZQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksZUFBSSxDQUFDO2dCQUN0QixHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxLQUFLO2dCQUMxRSxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3JDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxPQUFPLEdBQUcsSUFBSSxlQUFJLENBQUM7Z0JBQ3ZCLEdBQUcsRUFBRSxHQUFHO2dCQUNSLElBQUksRUFBRSxHQUFHO2dCQUNULElBQUksRUFBRSxjQUFjO2dCQUNwQixRQUFRLEVBQUUsaUJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQzthQUMvRCxDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUFBO0FBL0JELHdDQStCQyJ9