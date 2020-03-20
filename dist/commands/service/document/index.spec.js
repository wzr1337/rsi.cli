"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const documentIndex = __importStar(require("./index"));
const path = __importStar(require("path"));
describe("service.document", () => {
    it("should error when compiling markdown if data is undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield documentIndex.compileMD(undefined, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should error when compiling markdown if pathToTemplates is undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield documentIndex.compileMD([{ some: "data" }], undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing pathToTemplates");
        }
    }));
    it("should convert string to upper case", () => __awaiter(this, void 0, void 0, function* () {
        expect(documentIndex.toUpperCase('helloWorld1!')).toEqual("HELLOWORLD1!");
    }));
    it("should extract service name", () => __awaiter(this, void 0, void 0, function* () {
        expect(documentIndex.extractServiceName('rsi.service.identity')).toEqual("identity");
        expect(documentIndex.extractServiceName('viwi.service.identity')).toEqual("identity");
    }));
    it("should return a loaded template", () => __awaiter(this, void 0, void 0, function* () {
        expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).toBeDefined();
        expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).not.toEqual({});
    }));
    it("should error when compiling html if data is undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield documentIndex.compileHTML(undefined, "");
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should error when compiling html if pathToTemplates is undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield documentIndex.compileHTML({}, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing pathToTemplates");
        }
    }));
    it("should reolve the promise in renderDoc", () => __awaiter(this, void 0, void 0, function* () {
        expect(documentIndex.renderDoc({
            changelog: undefined,
            'rsi.service.identity': {
                serviceDefinition: 'node_modules\\rsi.service.identity\\src\\schema.json',
                package: 'node_modules\\rsi.service.identity\\package.json',
                changelog: 'node_modules\\rsi.service.identity\\CHANGELOG.md'
            }
        }, false, { name: 'package name', version: "0.0.1", description: "I am a paackage description" }, false)).resolves;
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2RvY3VtZW50L2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1REFBeUM7QUFDekMsMkNBQTZCO0FBRTdCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQVMsRUFBRTtRQUN6RSxJQUFJO1lBQ0YsTUFBTSxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQTtTQUNuRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNFQUFzRSxFQUFFLEdBQVMsRUFBRTtRQUNwRixJQUFJO1lBQ0YsTUFBTSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxTQUFTLENBQUMsQ0FBQTtTQUN6RDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUN2RDtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBUyxFQUFFO1FBQ25ELE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVFLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBUyxFQUFFO1FBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRixNQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDeEYsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFTLEVBQUU7UUFDL0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLG1EQUFtRCxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzVJLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxtREFBbUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hKLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBUyxFQUFFO1FBQ3JFLElBQUk7WUFDRixNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0VBQWtFLEVBQUUsR0FBUyxFQUFFO1FBQ2hGLElBQUk7WUFDRixNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFTLEVBQUU7UUFDdEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFDN0IsU0FBUyxFQUFFLFNBQVM7WUFDcEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLGlCQUFpQixFQUFFLHNEQUFzRDtnQkFDekUsT0FBTyxFQUFFLGtEQUFrRDtnQkFDM0QsU0FBUyxFQUFFLGtEQUFrRDthQUFDO1NBQy9ELEVBQUUsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSw2QkFBNkIsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO0lBQ3BILENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQSJ9