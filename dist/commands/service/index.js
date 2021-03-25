"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printHelp = void 0;
const command_line_usage_1 = __importDefault(require("command-line-usage"));
var init_1 = require("./init");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return init_1.init; } });
var validate_1 = require("./validate");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validate_1.validate; } });
var render_1 = require("./render");
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return render_1.render; } });
Object.defineProperty(exports, "loadTemplates", { enumerable: true, get: function () { return render_1.loadTemplates; } });
Object.defineProperty(exports, "parseSchemas", { enumerable: true, get: function () { return render_1.parseSchemas; } });
var document_1 = require("./document");
Object.defineProperty(exports, "renderDoc", { enumerable: true, get: function () { return document_1.renderDoc; } });
const sections = [
    {
        header: "rsi service",
        content: 'Usage: `rsi service [options...]`'
    },
    {
        header: 'commands',
        content: [
            { name: 'document', summary: 'render HTML documentation based on the schema' },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0RUFBa0Q7QUFDbEQsK0JBQTJDO0FBQWxDLDRGQUFBLElBQUksT0FBQTtBQUNiLHVDQUFzQztBQUE3QixvR0FBQSxRQUFRLE9BQUE7QUFDakIsbUNBQStEO0FBQXRELGdHQUFBLE1BQU0sT0FBQTtBQUFFLHVHQUFBLGFBQWEsT0FBQTtBQUFFLHNHQUFBLFlBQVksT0FBQTtBQUM1Qyx1Q0FBdUM7QUFBOUIscUdBQUEsU0FBUyxPQUFBO0FBRWxCLE1BQU0sUUFBUSxHQUFHO0lBQ2Y7UUFDRSxNQUFNLEVBQUUsYUFBYTtRQUNyQixPQUFPLEVBQUUsbUNBQW1DO0tBQzdDO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsVUFBVTtRQUNsQixPQUFPLEVBQUU7WUFDUCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLCtDQUErQyxFQUFFO1lBQzlFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUU7WUFDeEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBRTtZQUMzRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFO1lBQ3JELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsbURBQW1ELEVBQUU7WUFDbEYsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtTQUNuRDtLQUNGO0NBQ0YsQ0FBQTtBQUNELE1BQU0sS0FBSyxHQUFHLDRCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRXhDLFNBQWdCLFNBQVM7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwQixDQUFDO0FBRkQsOEJBRUMifQ==