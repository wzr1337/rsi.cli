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
exports.printHelp = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const version_1 = require("./version");
const PKG = JSON.parse(fs_1.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
const sections = [
    {
        header: PKG.longname,
        content: `${PKG.description} \n\nversion: ${version_1.getVersion()}\n\nUsage: rsi <commands...> [options...]`
    },
    {
        header: 'options',
        optionList: [
            {
                name: 'version',
                alias: 'v',
                description: 'Print the version.'
            },
            {
                name: 'help',
                alias: 'h',
                description: 'Print this usage guide.'
            }
        ]
    },
    {
        header: 'commands',
        content: [
            { name: 'service', summary: 'operate on service level' },
            { name: 'bundle', summary: 'operate on service bundle level' }
        ]
    }
];
const usage = command_line_usage_1.default(sections);
function printHelp() {
    console.log(usage);
}
exports.printHelp = printHelp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJCQUFrQztBQUNsQywyQ0FBNkI7QUFDN0IsNEVBQWtEO0FBQ2xELHVDQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBRTFGLE1BQU0sUUFBUSxHQUFHO0lBQ2Y7UUFDRSxNQUFNLEVBQUUsR0FBRyxDQUFDLFFBQVE7UUFDcEIsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLFdBQVcsaUJBQWlCLG9CQUFVLEVBQUUsMkNBQTJDO0tBQ3BHO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsU0FBUztRQUNqQixVQUFVLEVBQUU7WUFDVjtnQkFDRSxJQUFJLEVBQUUsU0FBUztnQkFDZixLQUFLLEVBQUUsR0FBRztnQkFDVixXQUFXLEVBQUUsb0JBQW9CO2FBQ2xDO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsV0FBVyxFQUFFLHlCQUF5QjthQUN2QztTQUNGO0tBQ0Y7SUFDRDtRQUNFLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE9BQU8sRUFBRTtZQUNQLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRTtTQUMvRDtLQUNGO0NBQ0YsQ0FBQTtBQUNELE1BQU0sS0FBSyxHQUFHLDRCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRXhDLFNBQWdCLFNBQVM7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwQixDQUFDO0FBRkQsOEJBRUMifQ==