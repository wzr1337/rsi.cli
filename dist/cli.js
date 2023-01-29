#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDependencies = void 0;
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
                serviceDefinition: ((fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./src/serviceDefinition.json"))) ? path.join(serviceDocumentOpts.sourceFolder, "./src/serviceDefinition.json") : path.join(serviceDocumentOpts.sourceFolder, "./src/schema.json")),
                package: path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
                changelog: ((fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md"))) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined)
            };
        }
        _1.service.renderDoc(pathsObj, packageInfo, bundle, html).then(data => {
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
                        _1.service.renderDoc(pathsObj, packageInfo, bundle, html).then(data => {
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
            pathObjs[JSON.parse(fs_2.default.readFileSync(path.join(serviceRenderOpts.sourceFolder, "./package.json"), 'utf-8')).name] = ((fs_1.existsSync(path.join(serviceRenderOpts.sourceFolder, "./src/serviceDefinition.json"))) ? path.join(serviceRenderOpts.sourceFolder, "./src/serviceDefinition.json") : path.join(serviceRenderOpts.sourceFolder, "./src/schema.json"));
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
            pathObjs['CurrentService'] = ((fs_1.existsSync(path.join(serviceValidateOpts.sourceFolder, "./src/serviceDefinition.json"))) ? path.join(serviceValidateOpts.sourceFolder, "./src/serviceDefinition.json") : path.join(serviceValidateOpts.sourceFolder, "./src/schema.json"));
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
            definition: ((fs_1.existsSync(path.join(paths, `/node_modules/${def}/src/serviceDefinition.json`))) ? path.join(paths, `/node_modules/${def}/src/serviceDefinition.json`) : path.join(paths, `/node_modules/${def}/src/schema.json`)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDJDQUF3QztBQUN4QywwRUFBZ0Q7QUFDaEQseUJBQW9EO0FBQ3BELDhDQUFnQztBQUNoQywyQ0FBNkI7QUFDN0IsMkJBQWdDO0FBQ2hDLDZDQUErQjtBQUMvQixtREFBcUM7QUFDckMsNENBQW9CO0FBQ3BCLHlDQUFtRDtBQUVuRCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUUzQixvQ0FBb0M7QUFDcEMsTUFBTSxXQUFXLEdBQUcsMkJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNySixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUV4Qyx3Q0FBd0M7QUFDeEMsSUFBSSxXQUFXLENBQUMsT0FBTyxJQUFJLFFBQVEsSUFBSSxXQUFXLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRTtJQUN2RSxNQUFNLGVBQWUsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDeEgsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7SUFDbkQsUUFBUSxlQUFlLENBQUMsT0FBTyxFQUFFO1FBQy9CLEtBQUssTUFBTTtZQUNULGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlCLE1BQU07UUFDUixLQUFL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