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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileHTML = exports.renderDoc = exports.compileMD = exports.loadTemplates = exports.extractServiceName = exports.toUpperCase = void 0;
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
    if (str === undefined) {
        return "No change log found. Does not exist.";
    }
    else {
        return new handlebars_1.default.SafeString(str);
    }
});
handlebars_1.default.registerHelper('getYear', function () {
    return new handlebars_1.default.SafeString((new Date()).getUTCFullYear().toString());
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
function loadTemplates(pathToTemplates) {
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
}
exports.loadTemplates = loadTemplates;
;
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
function renderDoc(obj, packageInfo, bundle = false, _compileHTML = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
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
            let bundlePackages = { packageInfo: packageInfo, serviceDefinitions: [], changelog: ((obj['changelog']) ? fs_1.readFileSync(obj['changelog'], "utf-8") : undefined) };
            for (let prop in obj) {
                if (prop !== 'changelog') {
                    bundlePackages.serviceDefinitions.push({
                        spec: JSON.parse(fs_1.readFileSync(obj[prop].serviceDefinition, 'utf-8')),
                        meta: JSON.parse(fs_1.readFileSync(obj[prop].package, 'utf-8')),
                        changelog: obj[prop].changelog ? fs_1.readFileSync(obj[prop].changelog, "utf-8") : undefined
                    });
                }
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
                    outStream.push(new vinyl_1.default({
                        cwd: '/',
                        base: '/',
                        path: "/styles/vueFont.css",
                        contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "vueFont.css"))
                    }));
                    outStream.push(new vinyl_1.default({
                        cwd: '/',
                        base: '/',
                        path: "/styles/vueMat.css",
                        contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "vueMat.css"))
                    }));
                    outStream.push(new vinyl_1.default({
                        cwd: '/',
                        base: '/',
                        path: "/styles/vueTheme.css",
                        contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "styles", "vueTheme.css"))
                    }));
                    // javascript files
                    outStream.push(new vinyl_1.default({
                        cwd: '/',
                        base: '/',
                        path: "/js/vue.js",
                        contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "js", "vue.js"))
                    }));
                    outStream.push(new vinyl_1.default({
                        cwd: '/',
                        base: '/',
                        path: "/js/vueMat.js",
                        contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "js", "vueMat.js"))
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
                resolve(outStream);
            }));
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTZCO0FBQzdCLDJCQUFpRTtBQUNqRSxtQ0FBa0M7QUFDbEMsNERBQW9DO0FBQ3BDLGtEQUF5QjtBQUN6QixrREFBK0M7QUFDL0MsNEJBQTRCO0FBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxnREFBMEQ7QUFFMUQsSUFBSSxZQUFZLENBQUM7QUFFakIscUJBQXFCO0FBQ3JCLFNBQWdCLFdBQVcsQ0FBQyxLQUFhO0lBQ3ZDLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFGRCxrQ0FFQztBQUNELG9CQUFVLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUV0RCxTQUFnQixrQkFBa0IsQ0FBQyxXQUFtQjtJQUNsRCxJQUFJLENBQUMsV0FBVztRQUFFLE9BQU8sYUFBYSxDQUFBO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsMEJBQWtCLENBQUMsQ0FBQztJQUNwRCxJQUFJLElBQUksS0FBSyxLQUFLO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsV0FBVyx1QkFBdUIsMEJBQWtCLFVBQVUsQ0FBQyxDQUFBO0lBQ25ILE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFMRCxnREFLQztBQUNELG9CQUFVLENBQUMsY0FBYyxDQUFDLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFFcEUsb0JBQVUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtJ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