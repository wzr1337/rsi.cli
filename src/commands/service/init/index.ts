import * as path from "path";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import File from "vinyl";
import { Readable } from "stream";
import { SERVICE_NAME_REGEX } from '../../../utils/regex';

export interface serviceMeta {
  description?: String,   // a service description
  version?: String,       // a service version
  name: String,           // the desired service name
  author: String,         // the authors full name
  email: String           // the authors full email adress
}

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
export function init(opts:serviceMeta):Readable {
  // create an returnable ReadStream that is in object mode, because we want to put File objects on it
  const outStream = new Readable({ objectMode: true });
  outStream._read = () => {}; // implemenmts a read() function

  const version = opts.version || "0.0.1";
  const description = opts.description || "This service lacks description, please fill it in."
  if (!opts.name) throw new Error("missing service name in `name` property.");
  const name = (null !== opts.name.match(SERVICE_NAME_REGEX)) ? opts.name.match(SERVICE_NAME_REGEX)[1] : opts.name;
  if (!opts.author) throw new Error("missing author name in `author` property.");
  if (!opts.email) throw new Error("missing author email in `email` property.");
  // const author = { name: opts.author, email: opts.email };
  const author = opts.author;

  // render package.json
  var template = Handlebars.compile(
    fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/package.json"), "utf-8"));
  // publish package.json
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/package.json',
    contents: Buffer.from(template({
      name: name,
      author: opts.author,
      email: opts.email,
      description: description,
      version: version
    }),"utf-8")
  }));

  // add .gitignore
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/.gitignore',
    contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/tpl.git_ign"))
  }));

  // render serviceDefinition.json
  var template = Handlebars.compile(
    fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/src/serviceDefinition.json"), "utf-8")
    );
  // publish schema.json
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/src/serviceDefinition.json',
    contents: Buffer.from(template({
      name: name,
      description: description
    }),"utf-8")
  }));

  // copy readme
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/README.md',
    contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/README.md"))
  }));

  // copy doc
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/doc/main.md',
    contents: fs.readFileSync(path.join(__dirname, "../../../../assets/repo.template/doc/main.md"))
  }));

  // end the stream
  outStream.push(null);
  return outStream;
 };