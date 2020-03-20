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
            optioninitialise(serviceArgv);
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
        case 'document':
            optiondocument(serviceArgv, mainOptions.command === 'bundle', serviceCommands.command === "document");
            break;
        default:
            _1.service.printHelp();
            break;
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
function optioninitialise(serviceArgv) {
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
//Renders documentation(markdown and html) based on schema
function optiondocument(serviceArgv, bundle, html) {
    const serviceDocumentOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    let pathsObj = {};
    let packageFile = JSON.parse(fs_2.default.readFileSync(path.join(serviceDocumentOpts.sourceFolder, "./package.json"), 'utf-8'));
    let packageInfo = { name: packageFile.name, version: packageFile.version, description: packageFile.description };
    if (serviceDocumentOpts.sourceFolder && serviceDocumentOpts.output) {
        if (bundle) {
            let temp = createBundleObj(serviceDocumentOpts.sourceFolder);
            pathsObj['changelog'] = ((fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md"))) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined);
            for (let def in temp)
                pathsObj[def] = { serviceDefinition: temp[def].definition, package: temp[def].package, changelog: temp[def].changelog };
        }
        else {
            pathsObj[packageInfo.name] = {
                serviceDefinition: path.join(serviceDocumentOpts.sourceFolder, "./src/serviceDefinition.json"),
                package: path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
                changelog: ((fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md"))) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined)
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
                    monitor.files[pathsObj[x].serviceDefinition, pathsObj[x].changelog, pathsObj[x].package];
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
//Prepare service for release
function optionRelease() {
    Logger_1.Logger.error("`release` command currently not supported");
}
//Render UML from schema
function optionRender(serviceArgv, bundle) {
    const serviceRenderOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    let pathObjs = {};
    if (serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
        if (bundle) {
            let temp = createBundleObj(serviceRenderOpts.sourceFolder);
            for (let def in temp)
                pathObjs[def] = temp[def].definition;
        }
        else {
            pathObjs[JSON.parse(fs_2.default.readFileSync(path.join(serviceRenderOpts.sourceFolder, "./package.json"), 'utf-8')).name] = path.join(serviceRenderOpts.sourceFolder, "./src/serviceDefinition.json");
        }
        // const paths = { schema: path.join(serviceRenderOpts.sourceFolder, "./src/schema.json") }
        // render once 
        // service.parseSchemas([paths.schema]).then(payload => {
        _1.service.parseSchemas(pathObjs).then(payload => {
            _1.service.render(payload).then(data => {
                data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
            }).catch(err => Logger_1.Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
        });
        for (let x in pathObjs) {
            // check if we are watching
            if (serviceRenderOpts.watch) {
                watch.createMonitor(path.join(serviceRenderOpts.sourceFolder, "./"), (monitor) => {
                    monitor.files[pathObjs[x].serviceDefinition];
                    Logger_1.Logger.info(`Watching ${serviceRenderOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.parseSchemas([pathObjs[x].serviceDefinition]).then(payload => {
                            _1.service.render(payload).then(data => {
                                data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`));
                            }).catch(err => Logger_1.Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
                        });
                    });
                });
            }
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
            pathObjs['CurrentService'] = path.join(serviceValidateOpts.sourceFolder, "./src/serviceDefinition.json");
        }
        for (let url in pathObjs) {
            _1.service.validate(pathObjs[url]).then(data => Logger_1.Logger.success("Service Definition valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
            // check if we are watching
            if (serviceValidateOpts.watch) {
                watch.createMonitor(path.join(serviceValidateOpts.sourceFolder, "./"), (monitor) => {
                    monitor.files[pathObjs[url]];
                    Logger_1.Logger.info(`Watching ${serviceValidateOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.validate(pathObjs[url]).then(data => Logger_1.Logger.success("Service Definition valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
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
            definition: path.join(paths, `/node_modules/${def}/src/serviceDefinition.json`),
            package: path.join(paths, `/node_modules/${def}/package.json`),
            // changelog: path.join(paths, `/node_modules/${def}/CHANGELOG.md`)
            changelog: ((fs_1.existsSync(path.join(paths, `/node_modules/${def}/CHANGELOG.md`))) ? path.join(paths, `/node_modules/${def}/CHANGELOG.md`) : undefined)
        };
    }
    return bundleDepenencies;
}
//Checks dependencies are rsi
function filterDependencies(obj) {
    if (obj !== undefined) {
        const keys = Object.keys(obj).filter(dep => {
            return dep.match(regex_1.SERVICE_NAME_REGEX);
        });
        if (keys.length === 0) {
            throw new Error('no RSI or VIWI services found in dependencies!');
        }
        else {
            return keys;
        }
    }
    else {
        throw new Error('undefined argument!');
    }
}
exports.filterDependencies = filterDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBb0Q7QUFDcEQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBQy9CLG1EQUFxQztBQUNyQyw0Q0FBb0I7QUFDcEIseUNBQW1EO0FBRW5ELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTNCLG9DQUFvQztBQUNwQyxNQUFNLFdBQVcsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3JKLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBRXhDLHdDQUF3QztBQUN4QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFO0lBQ3ZFLE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4SCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUNuRCxRQUFRLGVBQWUsQ0FBQyxPQUFPLEVBQUU7UUFDL0IsS0FBSyxNQUFNO1lBQ1QsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsTUFBTTtRQUNSLEtBQUssVUFBVTtZQUNiLGNB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