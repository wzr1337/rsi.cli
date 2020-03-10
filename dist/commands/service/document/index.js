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
const Logger_1 = require("../../../utils/Logger");
// Create reference instance
const marked = require('marked');
const regex_1 = require("../../../utils/regex");
let ASSESTS_PATH;
// Handelbars helpers
function toUpperCase(value) {
    return value.toUpperCase();
}
exports.toUpperCase = toUpperCase;
handlebars_1.default.registerHelper('toUpperCase', toUpperCase);
function extractServiceName(serviceName) {
    if (!serviceName)
        return "_undefined_";
    const match = serviceName.match(regex_1.SERVICE_NAME_REGEX);
    if (null === match)
        throw new Error(`service name ${serviceName} does not match the ${regex_1.SERVICE_NAME_REGEX} pattern`);
    return match[1];
}
exports.extractServiceName = extractServiceName;
handlebars_1.default.registerHelper('extractServiceName', extractServiceName);
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
            if (names[idx].indexOf("$") !== 0)
                return;
            tmpls[names[idx].split('.hbs')[0]] = fs_1.readFileSync(files[idx], "utf-8");
        });
        return tmpls;
    });
};
/**
 * renderes markdown from rsi schema
 *
 * @param  {Object}   data data object representation
 * @param  {string}  pathToTemplates path to all templates used to render
 */
// export async function compileMD (data:Object, pathToTemplates:string) {
function compileMD(data, pathToTemplates) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data || null === data)
            throw new Error("missing data");
        if (!pathToTemplates)
            throw new Error("missing pathToTemplates");
        const templates = yield loadTemplates(pathToTemplates);
        var serviceOverview = templates["$index.md"];
        return handlebars_1.default.compile(serviceOverview)(data);
    });
}
exports.compileMD = compileMD;
// export async function renderDoc(schemaPath:string, packagePath: string, changelogPath?: string):Promise<Readable> {
function renderDoc(obj, bundle, packageInfo, _compileHTML) {
    return __awaiter(this, void 0, void 0, function* () {
        ASSESTS_PATH = ((bundle) ? path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates") : path.join(path.dirname(__filename), "../../../../assets/documentation.templates"));
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function (code) {
                return require('highlight.js').highlightAuto(code).value;
            },
            // pedantic: false,
            gfm: true,
        });
        // create an returnable ReadStream that is in object mode, because we want to put File objects on it
        const outStream = new stream_1.Readable({ objectMode: true });
        outStream._read = () => { }; // implemenmts a read() function 
        let bundlePackages = { packageInfo: packageInfo, schema: [] };
        for (let prop in obj) {
            bundlePackages.schema.push({
                spec: JSON.parse(fs_1.readFileSync(obj[prop].schema, 'utf-8')),
                meta: JSON.parse(fs_1.readFileSync(obj[prop].package, 'utf-8')),
                changelog: obj[prop].changelog ? fs_1.readFileSync(obj[prop].changelog, "utf-8") : undefined
            });
        }
        compileMD(bundlePackages, ASSESTS_PATH).then((data) => __awaiter(this, void 0, void 0, function* () {
            if (_compileHTML) {
                const html = yield compileHTML(Object.assign({ html: marked(data) }, bundlePackages), ASSESTS_PATH);
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: `/${packageInfo['name'] || "index"}_${packageInfo['version'] || "XYZ"}.html`,
                    contents: Buffer.from(html.replace(new RegExp("<table>", "g"), "<table class=\"table\">"), "utf-8")
                }));
                //  css files
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: "/styles/bootstrap.3.3.5.min.css",
                    contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "bootstrap.3.3.5.min.css"))
                }));
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: "/styles/doc.css",
                    contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "doc.css"))
                }));
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: "/styles/hljs_monokai_sublime.min.css",
                    contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "hljs_monokai_sublime.min.css"))
                }));
                // javascript files
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: "/js/vue.js",
                    contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "js", "vue.js"))
                }));
            }
            else {
                // publish schema.json
                outStream.push(new vinyl_1.default({
                    cwd: '/',
                    base: '/',
                    path: `/${packageInfo['name'] || "index"}_${packageInfo['version'] || "XYZ"}.md`,
                    contents: Buffer.from(data, "utf-8")
                }));
            }
            //  image
            outStream.push(new vinyl_1.default({
                cwd: '/',
                base: '/',
                path: "/curlies.png",
                contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "curlies.png"))
            }));
        }));
        return outStream;
    });
}
exports.renderDoc = renderDoc;
function compileHTML(data, pathToTemplates) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data || null === data)
            throw new Error("missing data");
        if (!pathToTemplates)
            throw new Error("missing pathToTemplates");
        let html = "can not find $index.html template";
        try {
            const templates = yield loadTemplates(pathToTemplates);
            html = templates["$index.html"];
        }
        catch (error) {
            Logger_1.Logger.error("compileHTML(): Can not load templates");
        }
        return handlebars_1.default.compile(html)(data);
    });
}
exports.compileHTML = compileHTML;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBaUU7QUFDakUsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFDekIsa0RBQStDO0FBQy9DLDRCQUE0QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsZ0RBQTBEO0FBRTFELElBQUksWUFBWSxDQUFDO0FBRWpCLHFCQUFxQjtBQUNyQixTQUFnQixXQUFXLENBQUMsS0FBYTtJQUN2QyxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRkQsa0NBRUM7QUFDRCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFdEQsU0FBZ0Isa0JBQWtCLENBQUMsV0FBbUI7SUFDbEQsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLGFBQWEsQ0FBQTtJQUN0QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLDBCQUFrQixDQUFDLENBQUM7SUFDcEQsSUFBSSxJQUFJLEtBQUssS0FBSztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLFdBQVcsdUJBQXVCLDBCQUFrQixVQUFVLENBQUMsQ0FBQTtJQUNuSCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBTEQsZ0RBS0M7QUFDRCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXBFLG9CQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDL0MsSUFBRyxDQUFD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