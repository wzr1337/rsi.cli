"use strict";
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
const index_1 = require("./index");
describe("service.init", () => {
    it("should load a schema", () => {
        const schema = index_1.loadSchema("./src/__mocks__/dummyschema.json");
        expect(typeof schema).toBe("object");
    });
    it("should validate a correct schema", () => __awaiter(void 0, void 0, void 0, function* () {
        const valid = yield index_1.validate("./src/__mocks__/dummyschema.json");
        expect(valid).toBeTruthy();
    }));
    it("should fail on invalid schemas", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const valid = yield index_1.validate("./package.json");
        }
        catch (error) {
            expect(typeof error).toBe("object");
            expect(error.validationErrors).toBeDefined();
        }
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL3ZhbGlkYXRlL2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBK0M7QUFFL0MsUUFBUSxDQUFDLGNBQWMsRUFBRyxHQUFHLEVBQUU7SUFDN0IsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUM5QixNQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDOUQsTUFBTSxDQUFDLE9BQU8sTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQVMsRUFBRTtRQUNoRCxNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFRLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUNqRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFTLEVBQUU7UUFDOUMsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1NBQzdDO0lBRUgsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBIn0=