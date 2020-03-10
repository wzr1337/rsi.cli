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
            optioninitialise(serviceArgv, mainOptions.command === 'bundle');
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
            optiondocument(serviceArgv, mainOptions.command === 'bundle', false);
            break;
        case 'document':
            optiondocument(serviceArgv, mainOptions.command === 'bundle', true);
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
function optioninitialise(serviceArgv, bundle) {
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
            pathObjs[JSON.parse(fs_2.default.readFileSync(path.join(serviceRenderOpts.sourceFolder, "./package.json"), 'utf-8')).name] = path.join(serviceRenderOpts.sourceFolder, "./src/schema.json");
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
                    monitor.files[pathObjs[x].schema];
                    Logger_1.Logger.info(`Watching ${serviceRenderOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.parseSchemas([pathObjs[x].schema]).then(payload => {
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
//Checks dependencies are rsi
function filterDependencies(obj) {
    if (obj !== undefined) {
        const keys = Object.keys(obj).filter(dep => {
            return dep.match(regex_1.SERVICE_NAME_REGEX);
        });
        if (keys.length === 0) {
            throw new Error('no RSI services found in dependencies!');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBb0Q7QUFDcEQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBQy9CLG1EQUFxQztBQUNyQyw0Q0FBb0I7QUFDcEIseUNBQW1EO0FBRW5ELElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRTNCLG9DQUFvQztBQUNwQyxNQUFNLFdBQVcsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3JKLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBRXhDLHdDQUF3QztBQUN4QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFO0lBQ3ZFLE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4SCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUNuRCxRQUFRLGVBQWUsQ0FBQyxPQUFPLEVBQUU7UUFDL0IsS0FBSyxNQUFNO1lBQ1QsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUM7WUFD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