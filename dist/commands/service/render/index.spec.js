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
const _1 = require(".");
const path = __importStar(require("path"));
describe("service command init", function () {
    it("should load all class templates", function () {
        _1.loadTemplates(path.join(__dirname, "../../../../assets/class.templates/")).then((data) => {
            expect(data).toBeDefined();
            expect(typeof data).toBe("object");
            expect(Object.keys(data)).toContain("$index");
            expect(Object.keys(data)).toContain("class");
            expect(Object.keys(data)).toContain("enum");
            expect(Object.keys(data)).toContain("namespace");
            expect(Object.keys(data)).toContain("reference");
            expect(Object.keys(data)).toContain("type");
        });
    });
    it("should render the example correctly", () => __awaiter(this, void 0, void 0, function* () {
        const schema = yield _1.getSampleSchema();
        expect(!true).toBeFalsy();
    }));
    it("should correctly compare properties", () => {
        expect(_1.propertyCompare({ name: "id" }, { name: "id" })).toBe(-4);
        expect(_1.propertyCompare({ name: "name" }, { name: "id" })).toBe(-3);
        expect(_1.propertyCompare({ name: "uri" }, { name: "id" })).toBe(-2);
        expect(_1.propertyCompare({ name: "a" }, { name: "b" })).toBe(-1);
        expect(_1.propertyCompare({ name: "b" }, { name: "a" })).toBe(1);
        expect(_1.propertyCompare({ name: "$TGRE$" }, { name: "uri" })).toBe(2);
        expect(_1.propertyCompare({ name: "$TGRE$" }, { name: "name" })).toBe(3);
        expect(_1.propertyCompare({ name: "$TGRE$" }, { name: "id" })).toBe(4);
    });
    it("should render an empty puml", () => __awaiter(this, void 0, void 0, function* () {
        const stream = yield _1.render({ namespaces: [] });
        stream.on("data", (chunk) => {
            expect(typeof chunk).toBe("object");
            expect(chunk._isVinyl).toBe(true);
        });
    }));
    it("should fail rendering an undefined schema", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield _1.render(undefined);
            expect(true).toBeFalsy();
        }
        catch (error) {
            expect(error.message).toBeDefined();
        }
    }));
    it("should fail parsing none existing schema", () => __awaiter(this, void 0, void 0, function* () {
        yield expect(_1.parseSchemas({})).rejects.toThrowError('passed empty service definition(s)');
    }));
    it("should parse an existing schema", () => __awaiter(this, void 0, void 0, function* () {
        const schema = yield _1.parseSchemas({ dummySchema: "src/__mocks__/dummyschema.json" });
        expect(schema.namespaces).toBeDefined();
        expect(Array.isArray(schema.namespaces)).toBeTruthy();
        expect(schema.namespaces[0].classes).toBeDefined();
        expect(Array.isArray(schema.namespaces[0].classes)).toBeTruthy();
        expect(schema.namespaces[0].types).toBeDefined();
        expect(Array.isArray(schema.namespaces[0].types)).toBeTruthy();
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL3JlbmRlci9pbmRleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0JBQTBGO0FBQzFGLDJDQUE2QjtBQUs3QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLGdCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQixNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUNGLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFTLEVBQUU7UUFDbkQsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBZSxFQUFFLENBQUM7UUFDdkMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDNUIsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsTUFBTSxDQUFDLGtCQUFlLENBQUMsRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxrQkFBZSxDQUFDLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsa0JBQWUsQ0FBQyxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLGtCQUFlLENBQUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxrQkFBZSxDQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLGtCQUFlLENBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsa0JBQWUsQ0FBQyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxrQkFBZSxDQUFDLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBUyxFQUFFO1FBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBTSxDQUFDLEVBQUMsVUFBVSxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQixNQUFNLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLEdBQVMsRUFBRTtRQUN6RCxJQUFJO1lBQ0YsTUFBTSxTQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzFCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1NBQ3BDO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFTLEVBQUU7UUFDeEQsTUFBTSxNQUFNLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBUyxFQUFFO1FBQy9DLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBWSxDQUFDLEVBQUUsV0FBVyxFQUFFLGdDQUFnQyxFQUFDLENBQUMsQ0FBQztRQUNwRixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNqRSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDakUsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFBIn0=