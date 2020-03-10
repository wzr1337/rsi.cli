#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./utils/Logger");
const command_line_args_1 = __importDefault(require("command-line-args"));
const _1 = require("./");
const vfs = __importStar(require("vinyl-fs"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const watch = __importStar(require("watch"));
const inquirer = __importStar(require("inquirer"));
const fs_2 = __importDefault(require("fs"));
const regex_1 = require("./utils/regex");
let bundleDepenencies = {};
/* first - parse the main command */
const mainOptions = command_line_args_1.default([{ name: 'command', defaultOption: true }, { name: 'sourceFolder', type: String }], { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];
/* second - parse the command options */
if (mainOptions.command == 'bundle' || mainOptions.command == 'service') {
    const serviceCommands = command_line_args_1.default([{ name: 'command', defaultOption: true }], { argv, stopAtFirstUnknown: true });
    const serviceArgv = serviceCommands._unknown || [];
    switch (serviceCommands.command) {
        case 'init':
            initialise(serviceArgv, mainOptions.command === 'bundle');
            break;
        case 'validate':
            optionValidate(serviceArgv, mainOptions.command === 'bundle');
            break;
        case 'release':
            optionRelease();
            break;
        case 'render':
            optionRender(serviceArgv, mainOptions.command === 'bundle');
            break;
        case 'markdown':
            document(serviceArgv, mainOptions.command === 'bundle', false);
            break;
        case 'document':
            document(serviceArgv, mainOptions.command === 'bundle', true);
            break;
        default:
            _1.service.printHelp();
    }
}
else {
    const Definitions = [{ name: 'version', alias: 'v', type: Boolean }];
    try {
        const options = command_line_args_1.default(Definitions, { argv });
        (options.version) ? console.log(_1.getVersion()) : _1.printHelp();
    }
    catch (error) {
        _1.printHelp();
    }
}
// initialises a new repository
function initialise(serviceArgv, bundle) {
    const serviceInitOpts = command_line_args_1.default([
        { name: 'author', alias: 'a', type: String },
        { name: 'description', alias: 'd', type: String },
        { name: 'email', alias: 'e', type: String },
        { name: 'name', alias: 'n', type: String },
        { name: 'output', alias: 'o', type: String, defaultValue: "./" },
        { name: 'version', alias: 'v', type: String },
    ], { argv: serviceArgv });
    const questions = [
        { type: 'input', name: 'name', message: 'What is the service name?', default: serviceInitOpts.name, validate: (inp) => {
                if (!inp)
                    return false;
                const isEmail = inp.match(/^\w+$/);
                return (isEmail !== null) || "not a valid name, only characters and numbers allowed";
            }
        },
        { type: 'input', name: 'version', message: 'What is the service version?', default: serviceInitOpts.version || "0.0.1" },
        { type: 'input', name: 'description', message: 'Give a short desciption of your service?', default: serviceInitOpts.description || "some service" },
        { type: 'input', name: 'author', message: 'Who authored the service?', default: serviceInitOpts.author || process.env.LOGNAME },
        { type: 'input', name: 'email', message: 'What is the authors email?', default: serviceInitOpts.email, validate: (inp) => {
                if (!inp)
                    return false;
                const isEmail = inp.match(/^\w+@\w+\.\w+$/);
                return (isEmail !== null) || "not a valid email address";
            }
        },
        { type: 'input', name: 'output', message: 'output directory', default: serviceInitOpts.output || "./myNewService" }
    ];
    if (!(serviceInitOpts.author && serviceInitOpts.email && serviceInitOpts.name && serviceInitOpts.output))
        Logger_1.Logger.info("Shortcut usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>\n\r\n\r");
    inquirer.prompt(questions).then((answers) => {
        console.log(answers);
        _1.service.init(answers).pipe(vfs.dest(answers.output));
    });
}
// Renders HTML documentation based on the schema
function document(serviceArgv, bundle, html) {
    const serviceDocumentOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    let pathsObj = {};
    let packageInfo = { name: JSON.parse(fs_2.default.readFileSync(path.join(serviceDocumentOpts.sourceFolder, "./package.json"), 'utf-8')).name, version: JSON.parse(fs_2.default.readFileSync(path.join(serviceDocumentOpts.sourceFolder, "./package.json"), 'utf-8')).version };
    if (serviceDocumentOpts.sourceFolder && serviceDocumentOpts.output) {
        if (bundle) {
            let temp = createBundleObj(serviceDocumentOpts.sourceFolder);
            for (let def in temp)
                pathsObj[def] = { schema: temp[def].definition, package: temp[def].package, changelog: temp[def].changelog };
        }
        else {
            pathsObj[packageInfo.name] = {
                schema: path.join(serviceDocumentOpts.sourceFolder, "./src/schema.json"),
                package: path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
                changelog: fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md")) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined
            };
        }
        _1.service.renderDoc(pathsObj, bundle, packageInfo, html).then(data => {
            data.pipe(vfs.dest(serviceDocumentOpts.output));
            Logger_1.Logger.success("Documented scuccessfully");
        }); //.catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
        for (let x in pathsObj) {
            // check if we are watching
            if (serviceDocumentOpts.watch) {
                watch.createMonitor(path.join(serviceDocumentOpts.sourceFolder, "./"), (monitor) => {
                    monitor.files[pathsObj[x].schema, pathsObj[x].changelog, pathsObj[x].package];
                    Logger_1.Logger.info(`Watching ${serviceDocumentOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.renderDoc(pathsObj, bundle, packageInfo, html).then(data => {
                            data.pipe(vfs.dest(serviceDocumentOpts.output));
                            Logger_1.Logger.success("Documented scuccessfully");
                        }).catch(err => Logger_1.Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
                    });
                });
            }
        }
    }
    else {
        Logger_1.Logger.error("One or more parameter missing");
        Logger_1.Logger.info("Usage: $ rsi service document --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
    }
}
// Prepare service for release
function optionRelease() {
    Logger_1.Logger.error("`release` command currently not supported");
}
// Render UML from schema
function optionRender(serviceArgv, bundle) {
    const serviceRenderOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    if (serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
        const paths = { schema: path.join(serviceRenderOpts.sourceFolder, "./src/schema.json") };
        // render once 
        _1.service.parseSchemas([paths.schema]).then(payload => {
            _1.service.render(payload).then(data => {
                data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
            }).catch(err => Logger_1.Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
        });
        // check if we are watching
        if (serviceRenderOpts.watch) {
            watch.createMonitor(path.join(serviceRenderOpts.sourceFolder, "./"), (monitor) => {
                monitor.files[paths.schema];
                Logger_1.Logger.info(`Watching ${serviceRenderOpts.sourceFolder}`);
                monitor.on("changed", (where) => {
                    // Handle file changes
                    Logger_1.Logger.info(`Change detected in ${where}.`);
                    _1.service.parseSchemas([paths.schema]).then(payload => {
                        _1.service.render(payload).then(data => {
                            data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
                        }).catch(err => Logger_1.Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
                    });
                });
            });
        }
    }
    else {
        Logger_1.Logger.error("One or more parameter missing");
        Logger_1.Logger.info("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
    }
}
//Validates the uploaded Service Definitions
function optionValidate(serviceArgv, bundle) {
    const serviceValidateOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    let pathObjs = {};
    if (serviceValidateOpts.sourceFolder) {
        if (bundle) {
            let temp = createBundleObj(serviceValidateOpts.sourceFolder);
            for (let def in temp)
                pathObjs[def] = temp[def].definition;
        }
        else {
            pathObjs['CurrentService'] = path.join(serviceValidateOpts.sourceFolder, "./src/schema.json");
        }
        for (let url in pathObjs) {
            _1.service.validate(pathObjs[url]).then(data => Logger_1.Logger.success("Schema valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
            // check if we are watching
            if (serviceValidateOpts.watch) {
                watch.createMonitor(path.join(serviceValidateOpts.sourceFolder, "./"), (monitor) => {
                    monitor.files[pathObjs[url]];
                    Logger_1.Logger.info(`Watching ${serviceValidateOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.validate(pathObjs[url]).then(data => Logger_1.Logger.success("Schema valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
                    });
                });
            }
        }
    }
    else {
        Logger_1.Logger.error("One or more parameter missing");
        console.log("Usage: $ rsi service validate --sourceFolder <pathToServiceFolder>");
    }
}
//Gets the path ways to the schema and package files for the dependencies
function createBundleObj(paths) {
    const dependencies = JSON.parse(fs_2.default.readFileSync(path.join(paths, "./package.json"), 'utf-8')).dependencies;
    for (let def of filterDependencies(dependencies)) {
        bundleDepenencies[def] = {
            // definition: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/src/schema.json'), "utf-8")), 
            // package: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/package.json'), "utf-8"))
            definition: path.join(paths, `/node_modules/${def}/src/schema.json`),
            package: path.join(paths, `/node_modules/${def}/package.json`),
            changelog: path.join(paths, `/node_modules/${def}/CHANGELOG.md`),
        };
    }
    return bundleDepenencies;
}
function filterDependencies(obj) {
    const keys = Object.keys(obj).filter(dep => {
        return dep.match(regex_1.SERVICE_NAME_REGEX);
    });
    return keys;
}
exports.filterDependencies = filterDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBb0Q7QUFDcEQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBQy9CLG1EQUFxQztBQUNyQyw0Q0FBb0I7QUFDcEIseUNBQW1EO0FBRW5ELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTNCLG9DQUFvQztBQUNwQyxNQUFNLFdBQVcsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3JKLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBRXhDLHdDQUF3QztBQUN4QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFO0lBQ3ZFLE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4SCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUNuRCxRQUFRLGVBQWUsQ0FBQyxPQUFPLEVBQUU7UUFDL0IsS0FBSyxNQUFNO1lBQ1QsVUFBVSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQzFE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