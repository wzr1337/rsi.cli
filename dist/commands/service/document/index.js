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
    if (str === undefined) {
        return "No change log found. Does not exist.";
    }
    else {
        return new handlebars_1.default.SafeString(str);
    }
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
function renderDoc(obj, packageInfo, _compileHTML) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // ASSESTS_PATH = ((bundle) ? path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates") : path.join(path.dirname(__filename), "../../../../assets/documentation.templates"))
            ASSESTS_PATH = path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBaUU7QUFDakUsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFDekIsa0RBQStDO0FBQy9DLDRCQUE0QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsZ0RBQTBEO0FBRTFELElBQUksWUFBWSxDQUFDO0FBRWpCLHFCQUFxQjtBQUNyQixTQUFnQixXQUFXLENBQUMsS0FBYTtJQUN2QyxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRkQsa0NBRUM7QUFDRCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFdEQsU0FBZ0Isa0JBQWtCLENBQUMsV0FBbUI7SUFDbEQsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLGFBQWEsQ0FBQTtJQUN0QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLDBCQUFrQixDQUFDLENBQUM7SUFDcEQsSUFBSSxJQUFJLEtBQUssS0FBSztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLFdBQVcsdUJBQXVCLDBCQUFrQixVQUFVLENBQUMsQ0FBQTtJQUNuSCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBTEQsZ0RBS0M7QUFDRCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBRXBFLG9CQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDL0MsSUFBRyxDQUFD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