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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const documentIndex = __importStar(require("./index"));
const path = __importStar(require("path"));
describe("service.document", () => {
    it("should error when compiling markdown if data is undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield documentIndex.compileMD(undefined, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should error when compiling markdown if pathToTemplates is undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield documentIndex.compileMD([{ some: "data" }], undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing pathToTemplates");
        }
    }));
    it("should convert string to upper case", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(documentIndex.toUpperCase('helloWorld1!')).toEqual("HELLOWORLD1!");
    }));
    it("should extract service name", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(documentIndex.extractServiceName('rsi.service.identity')).toEqual("identity");
        expect(documentIndex.extractServiceName('viwi.service.identity')).toEqual("identity");
    }));
    it("should return a loaded template", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).toBeDefined();
        expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).not.toEqual({});
    }));
    it("should error when compiling html if data is undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield documentIndex.compileHTML(undefined, "");
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should error when compiling html if pathToTemplates is undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield documentIndex.compileHTML({}, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing pathToTemplates");
        }
    }));
    xit("should reolve the promise in renderDoc", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(documentIndex.renderDoc({
            changelog: undefined,
            'rsi.service.identity': {
                serviceDefinition: 'node_modules\\rsi.service.identity\\src\\serviceDefinition.json',
                package: 'node_modules\\rsi.service.identity\\package.json',
                changelog: 'node_modules\\rsi.service.identity\\CHANGELOG.md'
            }
        }, { name: 'package name', version: "0.0.1", description: "I am a paackage description" }, false)).resolves;
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2RvY3VtZW50L2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXlDO0FBQ3pDLDJDQUE2QjtBQUU3QixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFTLEVBQUU7UUFDekUsSUFBSTtZQUNGLE1BQU0sYUFBYSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLENBQUE7U0FDbkQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxHQUFTLEVBQUU7UUFDcEYsSUFBSTtZQUNGLE1BQU0sYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsU0FBUyxDQUFDLENBQUE7U0FDekQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDdkQ7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLEdBQVMsRUFBRTtRQUNuRCxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQVMsRUFBRTtRQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckYsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hGLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBUyxFQUFFO1FBQy9DLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxtREFBbUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM1SSxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsbURBQW1ELENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoSixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQVMsRUFBRTtRQUNyRSxJQUFJO1lBQ0YsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQTtTQUMvQztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtFQUFrRSxFQUFFLEdBQVMsRUFBRTtRQUNoRixJQUFJO1lBQ0YsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtTQUMvQztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUN2RDtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsd0NBQXdDLEVBQUUsR0FBUyxFQUFFO1FBQ3ZELE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1lBQzdCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLHNCQUFzQixFQUFFO2dCQUN0QixpQkFBaUIsRUFBRSxpRUFBaUU7Z0JBQ3BGLE9BQU8sRUFBRSxrREFBa0Q7Z0JBQzNELFNBQVMsRUFBRSxrREFBa0Q7YUFBQztTQUMvRCxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSw2QkFBNkIsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO0lBQzdHLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQSJ9