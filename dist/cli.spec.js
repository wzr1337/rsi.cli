"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli = __importStar(require("./cli"));
describe("this cli", () => {
    it("should return an array of valid keys", () => {
        expect(cli.filterDependencies({ 'rsi.service.remoteaccess': 'http://somewhere.com' })).toStrictEqual(["rsi.service.remoteaccess"]);
    });
    it("should throw an error", () => {
        expect(() => {
            cli.filterDependencies({ 'fooBar': 'http://somewhere.com' });
        }).toThrowError('no RSI services found in dependencies!');
        expect(() => {
            cli.filterDependencies(undefined);
        }).toThrowError('undefined argument!');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2xpLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkNBQTRCO0FBRTVCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLHNCQUFzQixFQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQTtJQUNuSSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQTtJQUN4QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFDIn0=