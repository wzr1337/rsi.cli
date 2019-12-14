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
const ASSESTS_PATH = path.join(path.dirname(__filename), "../../../../assets/documentation.templates");
// Handelbars helpers
function toUpperCase(value) {
    value.toUpperCase();
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
        compileMD(schema, ASSESTS_PATH).then(data => {
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
function renderHTML(schemaPath, packagePath, changelogPath) {
    return __awaiter(this, void 0, void 0, function* () {
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
        var schema = {
            spec: JSON.parse(fs_1.readFileSync(schemaPath, 'utf-8')),
            meta: JSON.parse(fs_1.readFileSync(packagePath, 'utf-8')),
            changelog: changelogPath ? fs_1.readFileSync(changelogPath) : undefined
        };
        compileMD(schema, ASSESTS_PATH).then((data) => __awaiter(this, void 0, void 0, function* () {
            const html = yield compileHTML(Object.assign({ html: marked(data) }, schema), ASSESTS_PATH);
            outStream.push(new vinyl_1.default({
                cwd: '/',
                base: '/',
                path: `/${schema.meta.name || "index"}_${schema.meta.version || "XYZ"}.html`,
                contents: Buffer.from(html.replace(new RegExp("<table>", "g"), "<table class=\"table\">"), "utf-8")
            }));
            //  image
            outStream.push(new vinyl_1.default({
                cwd: '/',
                base: '/',
                path: "/curlies.png",
                contents: fs_1.readFileSync(path.join(ASSESTS_PATH, "curlies.png"))
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
        }));
        return outStream;
    });
}
exports.renderHTML = renderHTML;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9kb2N1bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QiwyQkFBaUU7QUFDakUsbUNBQWtDO0FBQ2xDLDREQUFvQztBQUNwQyxrREFBeUI7QUFDekIsa0RBQStDO0FBQy9DLDRCQUE0QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7QUFFdkcscUJBQXFCO0FBQ3JCLFNBQVMsV0FBVyxDQUFDLEtBQWE7SUFDaEMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFDRCxvQkFBVSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFdEQsb0JBQVUsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxXQUFtQixDQUFDLGlDQUFpQyxFQUFFLEVBQUU7SUFDeEcsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLGFBQWEsQ0FBQTtJQUN0QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDdkQsSUFBSSxJQUFJLEtBQUssS0FBSztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLFdBQVcsOENBQThDLENBQUMsQ0FBQTtJQUM5RyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUVILG9CQUFVLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7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