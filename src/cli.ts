#!/usr/bin/env node

import { Logger } from "./utils/Logger";
import commandLineArgs from 'command-line-args';
import { printHelp, getVersion, service} from "./";
import * as vfs from "vinyl-fs";
import * as path from "path";
import { existsSync } from "fs";


/* first - parse the main command */
const mainOptions = commandLineArgs([{ name: 'command', defaultOption: true }], { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || [];

/* second - parse the command options */
switch (mainOptions.command) {
  case 'service':

      const serviceCommands = commandLineArgs([{ name: 'command', defaultOption: true }], { argv, stopAtFirstUnknown: true  });
      const serviceArgv = serviceCommands._unknown || []
      switch (serviceCommands.command) {
        case 'init':
          const serviceInitOpts = commandLineArgs([
            { name: 'author', alias: 'a', type: String },
            { name: 'description', alias: 'd', type: String },
            { name: 'email', alias: 'e', type: String },
            { name: 'name', alias: 'n', type: String },
            { name: 'output', alias: 'o', type: String , defaultValue:"./"},
            { name: 'version', alias: 'v', type: String },
          ], { argv: serviceArgv });

          if(serviceInitOpts.author, serviceInitOpts.email, serviceInitOpts.name, serviceInitOpts.output) {
            service.init(serviceInitOpts as service.serviceMeta).pipe(vfs.dest(serviceInitOpts.output));
          } else {
            Logger.error("One or mor parameter missing");
            console.log("Usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>");
          }
        break;
        case 'validate': 
          const serviceValidateOpts = commandLineArgs([
            { name: 'schema', alias: 's', type: String }
          ], { argv: serviceArgv });

          if(serviceValidateOpts.schema) {
            service.validate(serviceValidateOpts.schema)
              .then(data => Logger.success("Schema valid"))
              .catch(err => Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
          } else {
            Logger.error("One or mor parameter missing");
            console.log("Usage: $ rsi service validate --schema <pathToSchema>");
          }
        break;
        case 'render': 
          const serviceRenderOpts = commandLineArgs([
            { name: 'sourceFolder', alias: 's', type: String },
            { name: 'output', alias: 'o', type: String }
          ], { argv: serviceArgv });

          if(serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
            const paths = {
              schema : path.join(serviceRenderOpts.sourceFolder, "./src/schema.json"),
            }

            service.parseSchemas([paths.schema]).then(payload => {
              service.render(payload).then(data => {
                data.pipe(vfs.dest(serviceRenderOpts.output));
                Logger.success("Rendered sucessfully")
              }).catch(err => Logger.error("Rednering failed:", JSON.stringify(err, undefined, 2)));
            })
          } else {
            Logger.error("One or mor parameter missing");
            console.log("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
          }
        break;
        case 'markdown': 
          const serviceDocumentOpts = commandLineArgs([
            { name: 'sourceFolder', alias: 's', type: String },
            { name: 'output', alias: 'o', type: String }

          ], { argv: serviceArgv });

          if(serviceDocumentOpts.sourceFolder && serviceDocumentOpts.output) {
            const paths = {
              schema : path.join(serviceDocumentOpts.sourceFolder, "./src/schema.json"),
              package : path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
              changelog : existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md")) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined
            }

            service.renderMarkdown(paths.schema, paths.package, paths.changelog)
              .then(data => {
                data.pipe(vfs.dest(serviceDocumentOpts.output));
                Logger.success("Documented scuccessfully")
              })
              .catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
          } else {
            Logger.error("One or more parameter missing");
            console.log("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
          }
        break;
        default: 
          service.printHelp();
      }
    break;
  default:
    interface IOptions { version: Boolean }
    const Definitions = [
      { name: 'version', alias: 'v', type: Boolean }
    ];
    try {
      const options:IOptions = commandLineArgs(Definitions, { argv }) as IOptions;
      if (options.version) {
        console.log(getVersion());
      } else {
        printHelp();
      }
    } catch (error) {
      printHelp();
    }
    break;
}