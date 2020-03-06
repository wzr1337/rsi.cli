"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            { name: 'bundle', summary: 'operate on multiple services' }
        ]
    }
];
const usage = command_line_usage_1.default(sections);
function printHelp() {
    console.log(usage);
}
exports.printHelp = printHelp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkJBQWtDO0FBQ2xDLDJDQUE2QjtBQUM3Qiw0RUFBa0Q7QUFDbEQsdUNBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFMUYsTUFBTSxRQUFRLEdBQUc7SUFDZjtRQUNFLE1BQU0sRUFBRSxHQUFHLENBQUMsUUFBUTtRQUNwQixPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsV0FBVyxpQkFBaUIsb0JBQVUsRUFBRSwyQ0FBMkM7S0FDcEc7SUFDRDtRQUNFLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLEtBQUssRUFBRSxHQUFHO2dCQUNWLFdBQVcsRUFBRSxvQkFBb0I7YUFDbEM7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsR0FBRztnQkFDVixXQUFXLEVBQUUseUJBQXlCO2FBQ3ZDO1NBQ0Y7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsT0FBTyxFQUFFO1lBQ1AsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRTtZQUN4RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLDhCQUE4QixFQUFFO1NBQzVEO0tBQ0Y7Q0FDRixDQUFBO0FBQ0QsTUFBTSxLQUFLLEdBQUcsNEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFFeEMsU0FBZ0IsU0FBUztJQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BCLENBQUM7QUFGRCw4QkFFQyJ9