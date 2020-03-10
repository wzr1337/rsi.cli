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
let ASSESTS_PATH;
// Handelbars helpers
function toUpperCase(value) {
    return value.toUpperCase();
}
handlebars_1.default.registerHelper('toUpperCase', toUpperCase);
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
                    path: "/js/jquery.1.8.0.min.js",
                    contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "js", "jquery.1.8.0.min.js"))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBaUU7QUFDakUsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFDekIsa0RBQStDO0FBQy9DLDRCQUE0QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakMsSUFBSSxZQUFZLENBQUM7QUFFakIscUJBQXFCO0FBQ3JCLFNBQVMsV0FBVyxDQUFDLEtBQWE7SUFDaEMsT0FBTyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQUNELG9CQUFVLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUV0RCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFdBQW1CLENBQUMsaUNBQWlDLEVBQUUsRUFBRTtJQUN4RyxJQUFJLENBQUMsV0FBVztRQUFFLE9BQU8sYUFBYSxDQUFBO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN2RCxJQUFJLElBQUksS0FBSyxLQUFLO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsV0FBVyw4Q0FBOEMsQ0FBQyxDQUFBO0lBQzlHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUgsb0JBQVUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUMvQyxJQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO1FBQ2xDLE9BQU8s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