#!/usr/bin/env node
import { Logger } from "./utils/Logger";
import commandLineArgs from 'command-line-args';
import { printHelp, getVersion, service } from "./";
import * as vfs from "vinyl-fs";
import * as path from "path";
import { existsSync } from "fs";
import * as watch from "watch";
import * as inquirer from "inquirer";
import fs from "fs";

let bundleDepenencies = {};
let bundleSelected = false;

/* first - parse the main command */
const mainOptions = commandLineArgs([{ name: 'command', defaultOption: true }, { name: 'sourceFolder', type: String }], { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || [];

/* second - parse the command options */
if (mainOptions.command == 'bundle' || mainOptions.command == 'service') {
  if (mainOptions.command == 'bundle') {
    bundleSelected = true;
  }
  const serviceCommands = commandLineArgs([{ name: 'command', defaultOption: true }], { argv, stopAtFirstUnknown: true });
  const serviceArgv = serviceCommands._unknown || [];
  switch (serviceCommands.command) {
    case 'init':
      initialise(serviceArgv, bundleSelected);
      break;
    case 'validate':
      optionValidate(serviceArgv, bundleSelected);
      break;
    case 'release':
      optionRelease();
      break;
    case 'render':
      optionRender(serviceArgv, bundleSelected);
      break;
    case 'markdown':
      optionMarkdown(serviceArgv, bundleSelected);
      break;
    case 'document':
      document(serviceArgv, bundleSelected);
      break;
    default:
      service.printHelp();
  }
} else {
  interface IOptions { version: Boolean }
  const Definitions = [{ name: 'version', alias: 'v', type: Boolean }];
  try {
    const options: IOptions = commandLineArgs(Definitions, { argv }) as IOptions;
    (options.version) ? console.log(getVersion()) : printHelp();
  } catch (error) {
    printHelp();
  }
}

// initialises a new repository
function initialise(serviceArgv, bundle) {
  const serviceInitOpts = commandLineArgs([
    { name: 'author', alias: 'a', type: String },
    { name: 'description', alias: 'd', type: String },
    { name: 'email', alias: 'e', type: String },
    { name: 'name', alias: 'n', type: String },
    { name: 'output', alias: 'o', type: String, defaultValue: "./" },
    { name: 'version', alias: 'v', type: String },
  ], { argv: serviceArgv });
  const questions = [
    { type: 'input', name: 'name', message: 'What is the service name?', default: serviceInitOpts.name, validate: (inp: string) => {
        if (!inp) return false;
        const isEmail = inp.match(/^\w+$/);
        return (isEmail !== null) || "not a valid name, only characters and numbers allowed";
      }
    },
    { type: 'input', name: 'version', message: 'What is the service version?', default: serviceInitOpts.version || "0.0.1" },
    { type: 'input', name: 'description', message: 'Give a short desciption of your service?', default: serviceInitOpts.description || "some service" },
    { type: 'input', name: 'author', message: 'Who authored the service?', default: serviceInitOpts.author || process.env.LOGNAME },
    { type: 'input', name: 'email', message: 'What is the authors email?', default: serviceInitOpts.email, validate: (inp: string) => {
        if (!inp) return false;
        const isEmail = inp.match(/^\w+@\w+\.\w+$/);
        return (isEmail !== null) || "not a valid email address";
      }
    },
    { type: 'input', name: 'output', message: 'output directory', default: serviceInitOpts.output || "./myNewService" }
  ];
  if (!(serviceInitOpts.author && serviceInitOpts.email && serviceInitOpts.name && serviceInitOpts.output)) Logger.info("Shortcut usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>\n\r\n\r");
  inquirer.prompt(questions as inquirer.Questions).then((answers) => {
    console.log(answers)
    service.init(answers as service.serviceMeta).pipe(vfs.dest(answers.output));
  });
}

// Renders HTML documentation based on the schema
function document(serviceArgv, bundle) {
  const serviceDocumentOpts = commandLineArgs([
    { name: 'sourceFolder', alias: 's', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'watch', alias: 'w', type: Boolean }
  ], { argv: serviceArgv });
  if (serviceDocumentOpts.sourceFolder && serviceDocumentOpts.output) {
    const paths = {
      schema: path.join(serviceDocumentOpts.sourceFolder, "./src/schema.json"),
      package: path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
      changelog: existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md")) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined
    }
    service.renderHTML(paths.schema, paths.package, paths.changelog).then(data => {
        data.pipe(vfs.dest(serviceDocumentOpts.output));
        Logger.success("Documented scuccessfully")
    });//.catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
    // check if we are watching
    if (serviceDocumentOpts.watch) {
      watch.createMonitor(path.join(serviceDocumentOpts.sourceFolder, "./"), (monitor) => {
        monitor.files[paths.schema, paths.changelog, paths.package]
        Logger.info(`Watching ${serviceDocumentOpts.sourceFolder}`);
        monitor.on("changed", (where) => {
          // Handle file changes
          Logger.info(`Change detected in ${where}.`);
          service.renderMarkdown(paths.schema, paths.package, paths.changelog)
            .then(data => {
              data.pipe(vfs.dest(serviceDocumentOpts.output));
              Logger.success("Documented scuccessfully")
            })
            .catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
        });
      })
    }
  } else {
    Logger.error("One or more parameter missing");
    Logger.info("Usage: $ rsi service document --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
  }
}

// Prepare service for release
function optionRelease() {
  Logger.error("`release` command currently not supported");
}

// Render UML from schema
function optionRender(serviceArgv, bundle) {
  const serviceRenderOpts = commandLineArgs([
    { name: 'sourceFolder', alias: 's', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'watch', alias: 'w', type: Boolean }
  ], { argv: serviceArgv });
  if (serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
    const paths = { schema: path.join(serviceRenderOpts.sourceFolder, "./src/schema.json") }
    // render once 
    service.parseSchemas([paths.schema]).then(payload => {
      service.render(payload).then(data => {
        data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
      }).catch(err => Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
    });
    // check if we are watching
    if (serviceRenderOpts.watch) {
      watch.createMonitor(path.join(serviceRenderOpts.sourceFolder, "./"), (monitor) => {
        monitor.files[paths.schema]
        Logger.info(`Watching ${serviceRenderOpts.sourceFolder}`);
        monitor.on("changed", (where) => {
          // Handle file changes
          Logger.info(`Change detected in ${where}.`);
          service.parseSchemas([paths.schema]).then(payload => {
            service.render(payload).then(data => {
              data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
            }).catch(err => Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
          });
        });
      })
    }
  } else {
    Logger.error("One or more parameter missing");
    Logger.info("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
  }
}

// Render markdown documentation based on the schema
function optionMarkdown(serviceArgv, bundle) {
  const serviceMarkdowntOpts = commandLineArgs([
    { name: 'sourceFolder', alias: 's', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'watch', alias: 'w', type: Boolean }
  ], { argv: serviceArgv });
  if (serviceMarkdowntOpts.sourceFolder && serviceMarkdowntOpts.output) {
    const paths = {
      schema: path.join(serviceMarkdowntOpts.sourceFolder, "./src/schema.json"),
      package: path.join(serviceMarkdowntOpts.sourceFolder, "./package.json"),
      changelog: existsSync(path.join(serviceMarkdowntOpts.sourceFolder, "./changelog.md")) ? path.join(serviceMarkdowntOpts.sourceFolder, "./changelog.md") : undefined
    }
    service.renderMarkdown(paths.schema, paths.package, paths.changelog).then(data => {
        data.pipe(vfs.dest(serviceMarkdowntOpts.output));
        Logger.success("Documented scuccessfully")
    }).catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
    // check if we are watching
    if (serviceMarkdowntOpts.watch) {
      watch.createMonitor(path.join(serviceMarkdowntOpts.sourceFolder, "./"), (monitor) => {
        monitor.files[paths.schema, paths.changelog, paths.package]
        Logger.info(`Watching ${serviceMarkdowntOpts.sourceFolder}`);
        monitor.on("changed", (where) => {
          // Handle file changes
          Logger.info(`Change detected in ${where}.`);
          service.renderMarkdown(paths.schema, paths.package, paths.changelog).then(data => {
              data.pipe(vfs.dest(serviceMarkdowntOpts.output));
              Logger.success("Documented scuccessfully")
          }).catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
        });
      })
    }
  } else {
    Logger.error("One or more parameter missing");
    Logger.info("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
  }
}

//Validates the uploaded Service Definitions
function optionValidate(serviceArgv, bundle) {
  const serviceValidateOpts = commandLineArgs([
    { name: 'sourceFolder', alias: 's', type: String },
    { name: 'watch', alias: 'w', type: Boolean }
  ], { argv: serviceArgv });
  let urlArray = {};
  if (serviceValidateOpts.sourceFolder) {
    if (bundle) {
      let temp = createBundle(serviceValidateOpts.sourceFolder)
      for (let def in temp) urlArray[def] = temp[def].definition;
    } else {
      urlArray['Current Service'] = path.join(serviceValidateOpts.sourceFolder, "./src/schema.json");
    }
    for (let url in urlArray) {
      service.validate(urlArray[url]).then(data => Logger.success("Schema valid - " + url)).catch(err => Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
      // check if we are watching
      if (serviceValidateOpts.watch) {
        watch.createMonitor(path.join(serviceValidateOpts.sourceFolder, "./"), (monitor) => {
          monitor.files[urlArray[url]]
          Logger.info(`Watching ${serviceValidateOpts.sourceFolder}`);
          monitor.on("changed", (where) => {
            // Handle file changes
            Logger.info(`Change detected in ${where}.`);
            service.validate(urlArray[url]).then(data => Logger.success("Schema valid - " + url)).catch(err => Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
          });
        })
      }
    }

  } else {
    Logger.error("One or more parameter missing");
    console.log("Usage: $ rsi service validate --sourceFolder <pathToServiceFolder>");
  }
}

//
function createBundle(paths) {
  for (let def in JSON.parse(fs.readFileSync(path.join(paths, "./package.json"), 'utf-8')).dependencies) {
    bundleDepenencies[def] = { 
      // definition: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/src/schema.json'), "utf-8")), 
      // package: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/package.json'), "utf-8"))
      definition: path.join(paths, `/node_modules/${def}/src/schema.json`), 
      package: path.join(paths, `/node_modules/${def}/package.json`) 
    };
  }
  return bundleDepenencies;
}