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
const render = (data, pathToTemplates) => __awaiter(this, void 0, void 0, function* () {
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
                    var objname = /((\w+)Object|(\w+)Type)/.exec(property.oneOf[key]['#ref']);
                    if (null !== objname) {
                        refs.push("[/" + property.oneOf[key]['#ref'].replace(/\./g, '/') + '](#' + objname[0] + ')');
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBK0M7QUFDL0MsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFFekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7QUFFdkc7Ozs7O0dBS0c7QUFDSCxNQUFNLGFBQWEsR0FBRyxVQUFlLGVBQWU7O1FBQ2xELE1BQU0sS0FBSyxHQUFHLGdCQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0MsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBRSxDQUFDO1FBQ3pFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUMsR0FBRyxFQUFFLEVBQUU7WUFDckIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztDQUFBLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNILE1BQU0sTUFBTSxHQUFHLENBQU8sSUFBSSxFQUFFLGVBQWUsRUFBRSxFQUFFO0lBRTdDLElBQUks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