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
describe("service.init", () => {
    it("should load a schema", () => {
        const schema = index_1.loadSchema("./src/__mocks__/dummyschema.json");
        expect(typeof schema).toBe("object");
    });
    it("should validate a correct schema", () => __awaiter(this, void 0, void 0, function* () {
        const valid = yield index_1.validate("./src/__mocks__/dummyschema.json");
        expect(valid).toBeTruthy();
    }));
    it("should fail on invalid schemas", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const valid = yield index_1.validate("./package.json");
        }
        catch (error) {
            expect(typeof error).toBe("object");
            expect(error.validationErrors).toBeDefined();
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL3ZhbGlkYXRlL2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1DQUErQztBQUUvQyxRQUFRLENBQUMsY0FBYyxFQUFHLEdBQUcsRUFBRTtJQUM3QixFQUFFLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLE1BQU0sTUFBTSxHQUFHLGtCQUFVLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsT0FBTyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBUyxFQUFFO1FBQ2hELE1BQU0sS0FBSyxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQVMsRUFBRTtRQUM5QyxJQUFJO1lBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7U0FDN0M7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUEifQ==