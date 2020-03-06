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
let bundleDepenencies = {};
let bundleSelected = false;
/* first - parse the main command */
const mainOptions = command_line_args_1.default([{ name: 'command', defaultOption: true }, { name: 'sourceFolder', type: String }], { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];
/* second - parse the command options */
if (mainOptions.command == 'bundle' || mainOptions.command == 'service') {
    if (mainOptions.command == 'bundle') {
        bundleSelected = true;
    }
    const serviceCommands = command_line_args_1.default([{ name: 'command', defaultOption: true }], { argv, stopAtFirstUnknown: true });
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
function document(serviceArgv, bundle) {
    const serviceDocumentOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    if (serviceDocumentOpts.sourceFolder && serviceDocumentOpts.output) {
        const paths = {
            schema: path.join(serviceDocumentOpts.sourceFolder, "./src/schema.json"),
            package: path.join(serviceDocumentOpts.sourceFolder, "./package.json"),
            changelog: fs_1.existsSync(path.join(serviceDocumentOpts.sourceFolder, "./changelog.md")) ? path.join(serviceDocumentOpts.sourceFolder, "./changelog.md") : undefined
        };
        _1.service.renderHTML(paths.schema, paths.package, paths.changelog).then(data => {
            data.pipe(vfs.dest(serviceDocumentOpts.output));
            Logger_1.Logger.success("Documented scuccessfully");
        }); //.catch(err => Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
        // check if we are watching
        if (serviceDocumentOpts.watch) {
            watch.createMonitor(path.join(serviceDocumentOpts.sourceFolder, "./"), (monitor) => {
                monitor.files[paths.schema, paths.changelog, paths.package];
                Logger_1.Logger.info(`Watching ${serviceDocumentOpts.sourceFolder}`);
                monitor.on("changed", (where) => {
                    // Handle file changes
                    Logger_1.Logger.info(`Change detected in ${where}.`);
                    _1.service.renderMarkdown(paths.schema, paths.package, paths.changelog)
                        .then(data => {
                        data.pipe(vfs.dest(serviceDocumentOpts.output));
                        Logger_1.Logger.success("Documented scuccessfully");
                    })
                        .catch(err => Logger_1.Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
                });
            });
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
// Render markdown documentation based on the schema
function optionMarkdown(serviceArgv, bundle) {
    const serviceMarkdowntOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    if (serviceMarkdowntOpts.sourceFolder && serviceMarkdowntOpts.output) {
        const paths = {
            schema: path.join(serviceMarkdowntOpts.sourceFolder, "./src/schema.json"),
            package: path.join(serviceMarkdowntOpts.sourceFolder, "./package.json"),
            changelog: fs_1.existsSync(path.join(serviceMarkdowntOpts.sourceFolder, "./changelog.md")) ? path.join(serviceMarkdowntOpts.sourceFolder, "./changelog.md") : undefined
        };
        _1.service.renderMarkdown(paths.schema, paths.package, paths.changelog).then(data => {
            data.pipe(vfs.dest(serviceMarkdowntOpts.output));
            Logger_1.Logger.success("Documented scuccessfully");
        }).catch(err => Logger_1.Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
        // check if we are watching
        if (serviceMarkdowntOpts.watch) {
            watch.createMonitor(path.join(serviceMarkdowntOpts.sourceFolder, "./"), (monitor) => {
                monitor.files[paths.schema, paths.changelog, paths.package];
                Logger_1.Logger.info(`Watching ${serviceMarkdowntOpts.sourceFolder}`);
                monitor.on("changed", (where) => {
                    // Handle file changes
                    Logger_1.Logger.info(`Change detected in ${where}.`);
                    _1.service.renderMarkdown(paths.schema, paths.package, paths.changelog).then(data => {
                        data.pipe(vfs.dest(serviceMarkdowntOpts.output));
                        Logger_1.Logger.success("Documented scuccessfully");
                    }).catch(err => Logger_1.Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
                });
            });
        }
    }
    else {
        Logger_1.Logger.error("One or more parameter missing");
        Logger_1.Logger.info("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
    }
}
//Validates the uploaded Service Definitions
function optionValidate(serviceArgv, bundle) {
    const serviceValidateOpts = command_line_args_1.default([
        { name: 'sourceFolder', alias: 's', type: String },
        { name: 'watch', alias: 'w', type: Boolean }
    ], { argv: serviceArgv });
    let urlArray = {};
    if (serviceValidateOpts.sourceFolder) {
        if (bundle) {
            let temp = createBundle(serviceValidateOpts.sourceFolder);
            for (let def in temp)
                urlArray[def] = temp[def].definition;
        }
        else {
            urlArray['Current Service'] = path.join(serviceValidateOpts.sourceFolder, "./src/schema.json");
        }
        for (let url in urlArray) {
            _1.service.validate(urlArray[url]).then(data => Logger_1.Logger.success("Schema valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
            // check if we are watching
            if (serviceValidateOpts.watch) {
                watch.createMonitor(path.join(serviceValidateOpts.sourceFolder, "./"), (monitor) => {
                    monitor.files[urlArray[url]];
                    Logger_1.Logger.info(`Watching ${serviceValidateOpts.sourceFolder}`);
                    monitor.on("changed", (where) => {
                        // Handle file changes
                        Logger_1.Logger.info(`Change detected in ${where}.`);
                        _1.service.validate(urlArray[url]).then(data => Logger_1.Logger.success("Schema valid - " + url)).catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
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
//
function createBundle(paths) {
    for (let def in JSON.parse(fs_2.default.readFileSync(path.join(paths, "./package.json"), 'utf-8')).dependencies) {
        bundleDepenencies[def] = {
            // definition: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/src/schema.json'), "utf-8")), 
            // package: JSON.parse(fs.readFileSync(path.join(serviceValidateOpts.sourceFolder, '/node_modules/' + def + '/package.json'), "utf-8"))
            definition: path.join(paths, `/node_modules/${def}/src/schema.json`),
            package: path.join(paths, `/node_modules/${def}/package.json`)
        };
    }
    return bundleDepenencies;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBb0Q7QUFDcEQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBQy9CLG1EQUFxQztBQUNyQyw0Q0FBb0I7QUFFcEIsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBRTNCLG9DQUFvQztBQUNwQyxNQUFNLFdBQVcsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3JKLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBRXhDLHdDQUF3QztBQUN4QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksUUFBUSxJQUFJLFdBQVcsQ0FBQyxPQUFPLElBQUksU0FBUyxFQUFFO0lBQ3ZFLElBQUksV0FBVyxDQUFDLE9BQU8sSUFBSSxRQUFRLEVBQUU7UUFDbkMsY0FBYyxHQUFHLElBQUksQ0FBQztLQUN2QjtJQUNELE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4SCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUNuRCxRQUFRLGVBQWUsQ0FBQyxP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