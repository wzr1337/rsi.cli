import * as path from 'path';
import { readFileSync, readdirSync, fstat, lstatSync } from 'fs';
import { Readable } from 'stream';
import Handlebars from "handlebars";
import File from "vinyl";
import { Logger } from '../../../utils/Logger';
// Create reference instance
const marked = require('marked');

const ASSESTS_PATH = path.join(path.dirname(__filename), "../../../../assets/documentation.templates");

// Handelbars helpers
Handlebars.registerHelper('toUpperCase', string => string.toUpperCase());

Handlebars.registerHelper('extractServiceName', (serviceName: string /** e.g. rsi.service.something */) => {
  if (!serviceName) return "_undefined_"
  const match = serviceName.match(/^rsi.service.(\w+)$/);
  if (null === match) throw new Error(`service name ${serviceName} does not match the rsi.service.XXXX pattern`)
  return match[1];
});

Handlebars.registerHelper('ifEqCi', (a, b, opts) => {
    if(a.toUpperCase() === b.toUpperCase())
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('ifnEqCi', (a, b, opts) => {
  if(a.toUpperCase() !== b.toUpperCase())
      return opts.fn(this);
  else
      return opts.inverse(this);
});

Handlebars.registerHelper('isMandatory', (name, required, totalLength) => {
  totalLength = totalLength || 3;
  const mandatory = (required && required.indexOf(name) >-1) ? 'yes' : 'no';
  return new Handlebars.SafeString(mandatory + new Array(totalLength-mandatory.length).join(" "));
});

Handlebars.registerHelper('strech', (str, totalLength) => {
    str = str || "";
    var length = (totalLength - str.length + 1);
    return new Handlebars.SafeString(str + new Array((length >= 0) ? length : 0).join(" "));
});

Handlebars.registerHelper('getValue', function(property) {
  var resolveObject = (property) => {
    if (property.hasOwnProperty("oneOf")) {
      var refs=[];
      for (var key in property.oneOf) {
        var objname = /((\w+)Object|(\w+)Type)/.exec(property.oneOf[key]['#ref']);
        if (null !== objname) {
          refs.push("[/" + property.oneOf[key]['#ref'].replace(/\./g, '/') + '](#' + objname[0] + ')');
        }
      }
      return new Handlebars.SafeString(refs.join("<br />"));
    }
    return "n/a";
  }

  const expandEnum = (property) => {
    if (property.hasOwnProperty("enum")) {
      return new Handlebars.SafeString(property.enum.join("<br />"));
    }
    else {
      return "-";
    }
  }

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
      return "[" + (property.minimum || "-inf") + ".." + (property.maximum || "inf") + "] " + (property.resolution ? "@" + property.resolution : "")
      break;
    default:
      return "-";
  }
});

Handlebars.registerHelper('safeString', function(str) {
  return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('resourceLevelAction', function(method) {
//          Handlebars.log("ERROR", "hi");
  switch (method.toUpperCase()) {
    case "GET":
      return "retrieve a list of available elements of type"
      break;
    case "SUBSCRIBE":
      return "subscribe to updates on a list of available elements of type"
      break;
    case "POST":
      return "create a new element of type"
      break;
    default:
  }
});
Handlebars.registerHelper('methodToText', function(method) {
  switch (method.toUpperCase()) {
    case "SUBSCRIBE":
      return "WebSocket Subscription"
      break;
    case "GET":
    case "PUT":
    case "POST":
    case "DELETE":
      return `HTTP ${method.toUpperCase()} request`
  }
});
Handlebars.registerHelper('elementLevelAction', function(method) {
  switch (method.toUpperCase()) {
    case "GET":
      return "retrieve a particular"
      break;
    case "SUBSCRIBE":
      return "subscribe to updates on a particular"
      break;
    case "PUT":
      return "create a custom"
      break;
    case "POST":
      return "update a particular"
      break;
    case "DELETE":
      return "update a particular"
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
const loadTemplates = async function(pathToTemplates):Promise<{}> {
  const names = readdirSync(pathToTemplates);
  var files = names.map((it) => { return path.join(pathToTemplates, it)} );
  let tmpls = {};
  files.map((tmpl,idx) => {
    if(names[idx].indexOf("$") !== 0) return
    tmpls[names[idx].split('.hbs')[0]] = readFileSync(files[idx], "utf-8");
  });
  return tmpls;
};

/**
 * renderes markdown from rsi schema
 * 
 * @param  {Object}   data data object representation
 * @param  {string}  pathToTemplates path to all templates used to render
 */
export async function compileMD (data:Object, pathToTemplates:string) {

  if (!data || null === data) throw new Error("missing data");
  if (!pathToTemplates) throw new Error("missing pathToTemplates");

  const templates = await loadTemplates(pathToTemplates);
  var serviceOverview = templates["$index.md"];

  return Handlebars.compile(serviceOverview)(data);
}

export async function renderMarkdown(schemaPath:string, packagePath: string, changelogPath?: string):Promise<Readable> {
// create an returnable ReadStream that is in object mode, because we want to put File objects on it
const outStream = new Readable({ objectMode: true });
outStream._read = () => {}; // implemenmts a read() function 

  var schema = {
    spec: JSON.parse(readFileSync(schemaPath, 'utf-8')),
    meta: JSON.parse(readFileSync(packagePath, 'utf-8')),
    changelog: changelogPath ? readFileSync(changelogPath) : undefined
  };

  compileMD(schema, ASSESTS_PATH).then( data => {
    // publish schema.json
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: `/${schema.meta.name || "index"}_${schema.meta.version || "XYZ"}.md`,
      contents: Buffer.from(data ,"utf-8")
    }));

    const curlies = new File({
      cwd: '/',
      base: '/',
      path: "/curlies.png",
      contents: readFileSync(path.join(ASSESTS_PATH, "curlies.png"))
    });
    outStream.push(curlies);
  });
  
  return outStream;
}

export async function renderHTML(schemaPath:string, packagePath: string, changelogPath?: string):Promise<Readable> {

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
   // pedantic: false,
    gfm: true,
   // breaks: false,
   // sanitize: false,
   // smartLists: true,
   // smartypants: false,
   // xhtml: false
  });

  // create an returnable ReadStream that is in object mode, because we want to put File objects on it
  const outStream = new Readable({ objectMode: true });
  outStream._read = () => {}; // implemenmts a read() function 

  var schema = {
    spec: JSON.parse(readFileSync(schemaPath, 'utf-8')),
    meta: JSON.parse(readFileSync(packagePath, 'utf-8')),
    changelog: changelogPath ? readFileSync(changelogPath) : undefined
  };
  compileMD(schema, ASSESTS_PATH).then( async (data) => {
    const html = await compileHTML({html: marked(data), ...schema}, ASSESTS_PATH);
    
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: `/${schema.meta.name || "index"}_${schema.meta.version || "XYZ"}.html`,
      contents: Buffer.from(html.replace(new RegExp("<table>", "g"), "<table class=\"table\">") ,"utf-8")
    }));

    //  image
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: "/curlies.png",
      contents: readFileSync(path.join(ASSESTS_PATH, "curlies.png"))
    }));

    //  css files
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: "/styles/bootstrap.3.3.5.min.css",
      contents: readFileSync(path.join(ASSESTS_PATH, "styles", "bootstrap.3.3.5.min.css"))
    }));
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: "/styles/doc.css",
      contents: readFileSync(path.join(ASSESTS_PATH, "styles", "doc.css"))
    }));
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: "/styles/hljs_monokai_sublime.min.css",
      contents: readFileSync(path.join(ASSESTS_PATH, "styles", "hljs_monokai_sublime.min.css"))
    }));

    // javascript files
    outStream.push(new File({
      cwd: '/',
      base: '/',
      path: "/js/jquery.1.8.0.min.js",
      contents: readFileSync(path.join(ASSESTS_PATH, "js", "jquery.1.8.0.min.js"))
    }));
  });

  return outStream;
  
}

export async function compileHTML(data, pathToTemplates):Promise<string> {

  if (!data || null === data) throw new Error("missing data");
  if (!pathToTemplates) throw new Error("missing pathToTemplates");

  let html = "can not find $index.html template"
  try {
    const templates = await loadTemplates(pathToTemplates);
    html = templates["$index.html"];
  } catch (error) {
    Logger.error("compileHTML(): Can not load templates")
  }

  return Handlebars.compile(html)(data);
}