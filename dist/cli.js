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
            case 'release':
                Logger_1.Logger.error("`release` command currently not supported");
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