"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = __importStar(require("path"));
const PKG = JSON.parse(fs_1.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
function getVersion() {
    return PKG.version || "UNKNOWN";
}
exports.getVersion = getVersion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy92ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDJCQUFrQztBQUNsQywyQ0FBNkI7QUFFN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUUxRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sR0FBRyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUM7QUFDbEMsQ0FBQztBQUZELGdDQUVDIn0=