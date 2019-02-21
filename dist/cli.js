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
                if (serviceInitOpts.author, serviceInitOpts.email, serviceInitOpts.name, serviceInitOpts.output) {
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
            case 'render':
                const serviceRenderOpts = command_line_args_1.default([
                    { name: 'sourceFolder', alias: 's', type: String },
                    { name: 'output', alias: 'o', type: String }
                ], { argv: serviceArgv });
                if (serviceRenderOpts.sourceFolder && serviceRenderOpts.output) {
                    const paths = {
                        schema: path.join(serviceRenderOpts.sourceFolder, "./src/schema.json"),
                    };
                    _1.service.parseSchemas([paths.schema]).then(payload => {
                        _1.service.render(payload).then(data => {
                            data.pipe(vfs.dest(serviceRenderOpts.output));
                            Logger_1.Logger.success("Rendered sucessfully");
                        }).catch(err => Logger_1.Logger.error("Rednering failed:", JSON.stringify(err, undefined, 2)));
                    });
                }
                else {
                    Logger_1.Logger.error("One or mor parameter missing");
                    console.log("Usage:\n$ rsi service render --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
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
                    console.log("Usage: $ rsi service markdown --sourceFolder <pathToServiceFolder> --output <pathToOutputFolder>");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsMkNBQXdDO0FBQ3hDLDBFQUFnRDtBQUNoRCx5QkFBbUQ7QUFDbkQsOENBQWdDO0FBQ2hDLDJDQUE2QjtBQUM3QiwyQkFBZ0M7QUFHaEMsb0NBQW9DO0FBQ3BDLE1BQU0sV0FBVyxHQUFHLDJCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQzdHLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0FBRXhDLHdDQUF3QztBQUN4QyxRQUFRLFdBQVcsQ0FBQyxPQUFPLEVBQUU7SUFDM0IsS0FBSyxTQUFTO1FBRVYsTUFBTSxlQUFlLEdBQUcsMkJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUcsQ0FBQyxDQUFDO1FBQ3pILE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFBO1FBQ2xELFFBQVEsZUFBZSxDQUFDLE9BQU8sRUFBRTtZQUMvQixLQUFLLE1BQU07Z0JBQ1QsTUFBTSxlQUFlLEdBQUcsMkJBQWUsQ0FBQztvQkFDdEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtvQkFDNUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtvQkFDakQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVB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