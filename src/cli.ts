#!/usr/bin/env node

import { Logger } from "./utils/Logger";
import commandLineArgs from 'command-line-args';
import { printHelp, getVersion, service} from "./";
import * as vfs from "vinyl-fs";
import * as path from "path";
import { existsSync } from "fs";
import * as watch from "watch";
import { Writable } from "stream";
import * as inquirer  from "inquirer";


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

          const questions = [
            { type: 'input', name: 'name', message: 'What is the service name?', default: serviceInitOpts.name, validate: (inp:string) => {
              if (!inp) return false;
              const isEmail = inp.match(/^\w+$/);
              return (isEmail !== null) || "not a valid name, only characters and numbers allowed";
            }},
            { type: 'input', name: 'version', message: 'What is the service version?', default: serviceInitOpts.version || "0.0.1"},
            { type: 'input', name: 'description', message: 'Give a short desciption of your service?', default: serviceInitOpts.description || "some service"},
            { type: 'input', name: 'author', message: 'Who authored the service?', default: serviceInitOpts.author || process.env.LOGNAME},
            { type: 'input', name: 'email', message: 'What is teh authors email?', default: serviceInitOpts.email, validate: (inp:string) => {
              if (!inp) return false;
              const isEmail = inp.match(/^\w+@\w+\.\w+$/);
              return (isEmail !== null) || "not a valid email address";
            }},
            { type: 'input', name: 'output', message: 'output directory', default: serviceInitOpts.output || "./myNewService"}
          ];
          
          if(!(serviceInitOpts.author && serviceInitOpts.email && serviceInitOpts.name && serviceInitOpts.output)) {
            Logger.info("Shortcut usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>\n\r\n\r");
          }   

          inquirer.prompt(questions as inquirer.Questions).then((answers)=> {
            console.log(answers)
            service.init(answers as service.serviceMeta).pipe(vfs.dest(answers.output));
          });
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
        case 'release': 
          Logger.error("`release` command currently not supported");
        break;
        case 'render': 
          const serviceRenderOpts = commandLineArgs([
            { name: 'sourceFolder', alias: 's', type: String },
            { name: 'output', alias: 'o', type: String },
            { name: 'watch', alias: 'w', type: Boolean }
          ], { argv: serviceArgv });

          if(serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
            const paths = {
              schema : path.join(serviceRenderOpts.sourceFolder, "./src/schema.json"),
            }

            // render once 
            service.parseSchemas([paths.schema]).then(payload => {
              service.render(payload).then(data => {
                data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => {
                  Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`);
                })
              }).catch(err => Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
            });

            // check if we are watching
            if (serviceRenderOpts.watch) {
              watch.createMonitor(path.join(serviceRenderOpts.sourceFolder, "./src/"), (monitor) => {
                monitor.files[paths.schema]
                Logger.info(`Watching ${paths.schema}...`);
                monitor.on("changed", () => {
                  // Handle file changes
                  Logger.info(`Change detected in ${paths.schema}.`);
                  service.parseSchemas([paths.schema]).then(payload => {
                    service.render(payload).then(data => {
                      data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => {
                        Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`);
                      })
                    }).catch(err => Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
                  });      
                });
              })
            }
          } else {
            Logger.error("One or mor parameter missing");
            Logger.info("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
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
            Logger.info("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
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