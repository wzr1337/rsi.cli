"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe("service.document", () => {
    it("should compile markdown only if data is given", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.compileMD(undefined, undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing data");
        }
    }));
    it("should compile markdown only if pathToTemplates is given", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.compileMD([{ some: "data" }], undefined);
        }
        catch (error) {
            expect(error.message).toBe("missing pathToTemplates");
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2RvY3VtZW50L2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1DQUFvQztBQUVwQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFTLEVBQUU7UUFDN0QsSUFBSTtZQUNGLE1BQU0saUJBQVMsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLENBQUE7U0FDckM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFTLEVBQUU7UUFDeEUsSUFBSTtZQUNGLE1BQU0saUJBQVMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsU0FBUyxDQUFDLENBQUE7U0FDM0M7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDdkQ7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUEifQ==