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
                if (serviceInitOpts.author && serviceInitOpts.email && serviceInitOpts.name && serviceInitOpts.output) {
                    _1.service.init(serviceInitOpts).pipe(vfs.dest(serviceInitOpts.output));
                }
                else {
                    Logger_1.Logger.error("One or mor parameter missing");
                    console.log("Usage: $ rsi service init --name <servicename> --author \"<username>\" --email <email> --output <outputfolder>");
                }
                break;
            case 'validate':
                const serviceValidateOpts = command_line_args_1.default([
                    { name: 'schema', alias: 's', type: String }
                ], { argv: serviceArgv });
                if (serviceValidateOpts.schema) {
                    _1.service.validate(serviceValidateOpts.schema)
                        .then(data => Logger_1.Logger.success("Schema valid"))
                        .catch(err => Logger_1.Logger.error("Validation failed:", JSON.stringify(err, undefined, 2)));
                }
                else {
                    Logger_1.Logger.error("One or mor parameter missing");
                    console.log("Usage: $ rsi service validate --schema <pathToSchema>");
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
                        watch.createMonitor(path.join(serviceRenderOpts.sourceFolder, "./src/"), (monitor) => {
                            monitor.files[paths.schema];
                            Logger_1.Logger.info(`Watching ${paths.schema}...`);
                            monitor.on("changed", () => {
                                // Handle file changes
                                Logger_1.Logger.info(`Change detected in ${paths.schema}.`);
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
                    { name: 'output', alias: 'o', type: String }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBbUQ7QUFDbkQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFDaEMsNkNBQStCO0FBSS9CLG9DQUFvQztBQUNwQyxNQUFNLFdBQVcsR0FBRywyQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUM3RyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUV4Qyx3Q0FBd0M7QUFDeEMsUUFBUSxXQUFXLENBQUMsT0FBTyxFQUFFO0lBQzNCLEtBQUssU0FBUztRQUVWLE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFHLENBQUMsQ0FBQztRQUN6SCxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtRQUNsRCxRQUFRLGVBQWUsQ0FBQyxPQUFPLEVBQUU7WUFDL0IsS0FBSyxNQUFNO2dCQUNULE1BQU0sZUFBZSxHQUFHLDJCQUFlLENBQUM7b0JBQ3RDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7b0JBQzVDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7b0JBQ2pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFL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