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
describe("service.document", () => {
    it("should compile markdown only if data is given", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield documentIndex.compileMD(undefined, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should compile markdown only if pathToTemplates is given", () => __awaiter(this, void 0, void 0, function* () {
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2RvY3VtZW50L2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1REFBeUM7QUFFekMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBUyxFQUFFO1FBQzdELElBQUk7WUFDRixNQUFNLGFBQWEsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ25EO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBUyxFQUFFO1FBQ3hFLElBQUk7WUFDRixNQUFNLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsQ0FBQyxFQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3pEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFTLEVBQUU7UUFDbkQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFTLEVBQUU7UUFDM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEifQ==