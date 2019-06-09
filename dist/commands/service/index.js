"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_usage_1 = __importDefault(require("command-line-usage"));
var init_1 = require("./init");
exports.init = init_1.init;
var validate_1 = require("./validate");
exports.validate = validate_1.validate;
var render_1 = require("./render");
exports.render = render_1.render;
exports.loadTemplates = render_1.loadTemplates;
exports.parseSchemas = render_1.parseSchemas;
var document_1 = require("./document");
exports.renderMarkdown = document_1.renderMarkdown;
const sections = [
    {
        header: "rsi service",
        content: 'Usage: `rsi service [options...]`'
    },
    {
        header: 'commands',
        content: [
            { name: 'init', summary: 'initialize a new repository' },
            { name: 'release', summary: 'prepare service for release' },
            { name: 'render', summary: 'render UML from schema' },
            { name: 'markdown', summary: 'render markdown documentation based on the schema' },
            { name: 'validate', summary: 'validate a schema' }
        ]
    }
];
const usage = command_line_usage_1.default(sections);
function printHelp() {
    console.log(usage);
}
exports.printHelp = printHelp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRFQUFrRDtBQUNsRCwrQkFBMkM7QUFBbEMsc0JBQUEsSUFBSSxDQUFBO0FBQ2IsdUNBQXNDO0FBQTdCLDhCQUFBLFFBQVEsQ0FBQTtBQUNqQixtQ0FBK0Q7QUFBdEQsMEJBQUEsTUFBTSxDQUFBO0FBQUUsaUNBQUEsYUFBYSxDQUFBO0FBQUUsZ0NBQUEsWUFBWSxDQUFBO0FBQzVDLHVDQUE0QztBQUFuQyxvQ0FBQSxjQUFjLENBQUE7QUFFdkIsTUFBTSxRQUFRLEdBQUc7SUFDZjtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxtQ0FBbUM7S0FDN0M7SUFDRDtRQUNFLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE9BQU8sRUFBRTtZQUNQLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRTtZQUMzRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFO1lBQ3JELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsbURBQW1ELEVBQUU7WUFDbEYsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtTQUNuRDtLQUNGO0NBQ0YsQ0FBQTtBQUNELE1BQU0sS0FBSyxHQUFHLDRCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRXhDLFNBQWdCLFNBQVM7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwQixDQUFDO0FBRkQsOEJBRUMifQ==