"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commands_1 = require("./commands");
exports.printHelp = commands_1.printHelp;
const service = __importStar(require("./commands/service"));
exports.service = service;
var version_1 = require("./commands/version");
exports.getVersion = version_1.getVersion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQXVDO0FBQTlCLCtCQUFBLFNBQVMsQ0FBQTtBQUNsQiw0REFBK0M7QUFDdEMsMEJBQU87QUFDaEIsOENBQWdEO0FBQXZDLCtCQUFBLFVBQVUsQ0FBQSJ9