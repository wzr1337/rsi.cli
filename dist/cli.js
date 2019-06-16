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
/* first - parse the main command */
const mainOptions = command_line_args_1.default([{ name: 'command', defaultOption: true }], { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];
/* second - parse the command options */
switch (mainOptions.command) {
    case 'service':
        const serviceCommands = command_line_args_1.default([{ name: 'command', defaultOption: true }], { argv, stopAtFirstUnknown: true });
        const serviceArgv = serviceCommands._unknown || [];
        switch (serviceCommands.command) {
            case 'init':
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
                        } },
                    { type: 'input', name: 'version', message: 'What is the service version?', default: serviceInitOpts.version || "0.0.1" },
                    { type: 'input', name: 'description', message: 'Give a short desciption of your service?', default: serviceInitOpts.description || "some service" },
                    { type: 'input', name: 'author', message: 'Who authored the service?', default: serviceInitOpts.author || process.env.LOGNAME },
                    { type: 'input', name: 'email', message: 'What is the authors email?', default: serviceInitOpts.email, validate: (inp) => {
                            if (!inp)
                                return false;
                            const isEmail = inp.match(/^\w+@\w+\.\w+$/);
                            return (isEmail !== null) || "not a valid email address";
                        } },
                    { type: 'input', name: 'output', message: 'output directory', default: serviceInitOpts.output || "./myNewService" }
                ];
                if (!(serviceInitOpts.author && serviceInitOpts.email && serviceInitOpts.name && serviceInitOpts.output)) {
                    Logger_1.Logger.info("Shortcut usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>\n\r\n\r");
                }
                inquirer.prompt(questions).then((answers) => {
                    console.log(answers);
                    _1.service.init(answers).pipe(vfs.dest(answers.output));
                });
                break;
            case 'validate':
                const serviceValidateOpts = command_line_args_1.default([
                    { name: 'sourceFolder', alias: 's', type: String }
                ], { argv: serviceArgv });
                if (serviceValidateOpts.sourceFolder) {
                    _1.service.validate(serviceValidateOpts.sourceFolder)
                        .then(data => Logger_1.Logger.success("Schema valid"))
                        .catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
                }
                else {
                    Logger_1.Logger.error("One or mor parameter missing");
                    console.log("Usage: $ rsi service validate --sourceFolder <pathToServiceFolder>");
                }
                break;
            case 'release':
                Logger_1.Logger.error("`release` command currently not supported");
                break;
            case 'render':
                const serviceRenderOpts = command_line_args_1.default([
                    { name: 'sourceFolder', alias: 's', type: String },
                    { name: 'output', alias: 'o', type: String },
                    { name: 'watch', alias: 'w', type: Boolean }
                ], { argv: serviceArgv });
                if (serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
                    const paths = {
                        schema: path.join(serviceRenderOpts.sourceFolder, "./src/schema.json"),
                    };
                    // render once 
                    _1.service.parseSchemas([paths.schema]).then(payload => {
                        _1.service.render(payload).then(data => {
                            data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => {
                                Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`);
                            });
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
                                        data.pipe(vfs.dest(serviceRenderOpts.output)).on("data", (data) => {
                                            Logger_1.Logger.success(`Rendered plantuml to ${path.join(serviceRenderOpts.output, data.basename)}.`);
                                        });
                                    }).catch(err => Logger_1.Logger.error("Rendering failed:", JSON.stringify(err, undefined, 2)));
                                });
                            });
                        });
                    }
                }
                else {
                    Logger_1.Logger.error("One or mor parameter missing");
                    Logger_1.Logger.info("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
                }
                break;
            case 'markdown':
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
                    _1.service.renderMarkdown(paths.schema, paths.package, paths.changelog)
                        .then(data => {
                        data.pipe(vfs.dest(serviceDocumentOpts.output));
                        Logger_1.Logger.success("Documented scuccessfully");
                    })
                        .catch(err => Logger_1.Logger.error("Documentation failed:", JSON.stringify(err, undefined, 2)));
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
                    Logger_1.Logger.info("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
                }
                break;
            default:
                _1.service.printHelp();
        }
        break;
    default:
        const Definitions = [
            { name: 'version', alias: 'v', type: Boolean }
        ];
        try {
            const options = command_line_args_1.default(Definitions, { argv });
            if (options.version) {
                console.log(_1.getVersion());
            }
            else {
                _1.printHelp();
            }
        }
        catch (error) {
            _1.printHelp();
        }
        break;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBbUQ7QUFDbkQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBRS9CLG1EQUFzQztBQUd0QyxvQ0FBb0M7QUFDcEMsTUFBTSxXQUFXLEdBQUcsMkJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDN0csTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFFeEMsd0NBQXdDO0FBQ3hDLFFBQVEsV0FBVyxDQUFDLE9BQU8sRUFBRTtJQUMzQixLQUFLLFNBQVM7UUFFVixNQUFNLGVBQWUsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRyxDQUFDLENBQUM7UUFDekgsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUE7UUFDbEQsUUFBUSxlQUFlLENBQUMsT0FBTyxFQUFFO1lBQy9CLEtBQUssTUFBTTtnQkFDVCxNQUFNLGVBQWUsR0FBRywyQkFBZSxDQUFDO29CQUN0QyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29CQUM1QyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO29CQUNqRCxFQUFFLElBQUksRUFBRSxP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