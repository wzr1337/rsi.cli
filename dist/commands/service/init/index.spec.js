"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const util_1 = require("util");
const path = __importStar(require("path"));
const DEFAULT_OPTIONS = { name: "rsi.service.test", author: "Patrick Bartsch", email: "no@where.com" };
describe("service command init", function () {
    it("should return a valid package structure", function () {
        const expectedPaths = ["/package.json", "/src/serviceDefinition.json", "/README.md", "/doc/main.md", "/.gitignore"];
        let generatedPaths = [];
        __1.init(DEFAULT_OPTIONS)
            .on("data", (data) => {
            generatedPaths.push(data.path);
        })
            .on("end", () => {
            for (const expectedPath of expectedPaths) {
                expect(generatedPaths).toContain(path.normalize(expectedPath.toString()));
            }
        });
    });
    it("should return a valid package.json for name containing rsi.service", () => {
        let pkg;
        __1.init(DEFAULT_OPTIONS)
            .on("data", (data) => {
            if (data.path === "/package.json") {
                pkg = JSON.parse(data.contents.toString());
            }
            ;
        })
            .on("end", () => {
            expect(pkg.name).toBeDefined();
            expect(typeof (pkg.name)).toBe("string");
            expect(pkg.name).toBe(DEFAULT_OPTIONS.name);
            expect(pkg.author).toBeDefined();
            expect(typeof (pkg.author)).toBe("object");
            expect(pkg.author.name).toBeDefined();
            expect(pkg.author.name).toBe(DEFAULT_OPTIONS.author);
            expect(pkg.author.email).toBeDefined();
            expect(pkg.author.email).toBe(DEFAULT_OPTIONS.email);
            expect(pkg.description).toBeDefined();
            expect(typeof (pkg.description)).toBe("string");
            expect(pkg.description).toBe("This service lacks description, please fill it in.");
            expect(pkg.files).toBeDefined();
            expect(util_1.isArray(pkg.files)).toBe(true);
            expect(pkg.files).toContain("src/serviceDefinition.json");
            expect(pkg.version).toBeDefined();
            expect(typeof (pkg.version)).toBe("string");
            expect(pkg.version).toBe("0.0.1");
            expect(pkg.private).toBeDefined();
            expect(typeof (pkg.private)).toBe("boolean");
            expect(pkg.private).toBe(true);
            expect(pkg.license).toBeDefined();
            expect(typeof (pkg.license)).toBe("string");
            expect(pkg.license).toBe("UNLICENSED");
            // expect(pkg.dependencies).toBeDefined();
            // expect(isObject(pkg.dependencies)).toBe(true);
            // expect(Object.keys(pkg.dependencies)).toContain("rsi.protocol");
            expect(pkg.contributors).toBeDefined();
            expect(util_1.isArray(pkg.contributors)).toBe(true);
            expect(pkg.contributors.length).toBe(0);
        });
    });
    xit("should return a valid package.json name for name NOT containing rsi.service", () => {
        let pkg;
        __1.init(Object.assign({}, DEFAULT_OPTIONS, { name: "foo" }))
            .on("data", (data) => {
            if (data.path === "/package.json") {
                pkg = JSON.parse(data.contents.toString());
            }
            ;
        })
            .on("end", () => {
            expect(pkg.name).toBeDefined();
            expect(typeof (pkg.name)).toBe("string");
            expect(pkg.name).toBe("rsi.service." + DEFAULT_OPTIONS.name);
        });
    });
    it("should return a valid src/serviceDefinition.json", function () {
        let schema;
        __1.init(DEFAULT_OPTIONS)
            .on("data", (data) => {
            if (data.path === "/src/serviceDefinition.json") {
                schema = JSON.parse(data.contents.toString());
            }
            ;
        })
            .on("end", () => {
            expect(schema.name).toBeDefined();
            expect(typeof (schema.name)).toBe("string");
            expect(schema.name).toBe(DEFAULT_OPTIONS.name);
            expect(schema["$schema"]).toBeDefined();
            expect(typeof (schema["$schema"])).toBe("string");
            expect(schema["$schema"]).toBe("https://github.com/wzr1337/rsi.schema/blob/2.0.0/dist/$rsi.schema.json");
            expect(schema.description).toBeDefined();
            expect(typeof (schema.description)).toBe("string");
            expect(schema.description).toBe("This service lacks description, please fill it in.");
            // @TODO use schema validator later on
        });
    });
    it("should fail when name misses in opts", () => {
        try {
            __1.init({ name: undefined, author: "Patrick Bartsch", email: "no@where.com" });
        }
        catch (error) {
            expect(error.message).toBe("missing service name in `name` property.");
        }
    });
    it("should fail when name misses in opts", () => {
        try {
            __1.init({ name: "some", author: undefined, email: "no@where.com" });
        }
        catch (error) {
            expect(error.message).toBe("missing author name in `author` property.");
        }
    });
    it("should fail when name misses in opts", () => {
        try {
            __1.init({ name: "some", author: "someone", email: undefined });
        }
        catch (error) {
            expect(error.message).toBe("missing author email in `email` property.");
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2luaXQvaW5kZXguc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwwQkFBc0Q7QUFDdEQsK0JBQXlDO0FBQ3pDLDJDQUE2QjtBQW9CN0IsTUFBTSxlQUFlLEdBQWUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsQ0FBQztBQUVsSCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1FBQzVDLE1BQU0sYUFBYSxHQUFZLENBQUMsZUFBZSxFQUFFLDZCQUE2QixFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0gsSUFBSSxjQUFjLEdBQVksRUFBRSxDQUFDO1FBQ2pDLFFBQVcsQ0FBQyxlQUFlLENBQUM7YUFDekIsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVEsRUFBRSxFQUFFO1lBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQzthQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2QsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzNFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7UUFDNUUsSUFBSSxHQUFlLENBQUM7UUFDcEIsUUFBVyxDQUFDLGVBQWUsQ0FBQzthQUN6QixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBUSxFQUFFLEVBQUU7WUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRTtnQkFDakMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQzVDO1lBQUEsQ0FBQztRQUNKLENBQUMsQ0FBQzthQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMvQixNQUFNLENBQUMsT0FBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsT0FBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFckQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QyxNQUFNLENBQUMsT0FBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1lBRW5GLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLGNBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUUxRCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxPQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsT0FBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUV4QywwQ0FBMEM7WUFDMUMsaURBQWlEO1lBQ2pELG1FQUFtRTtZQUVsRSxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtRQUN0RixJQUFJLEdBQWUsQ0FBQztRQUNwQixRQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7YUFDM0QsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVEsRUFBRSxFQUFFO1lBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7Z0JBQ2pDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUM1QztZQUFBLENBQUM7UUFDSixDQUFDLENBQUM7YUFDRCxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtZQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0IsTUFBTSxDQUFDLE9BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1FBQ3JELElBQUksTUFBVSxDQUFDO1FBQ2YsUUFBVyxDQUFDLGVBQWUsQ0FBQzthQUN6QixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBUSxFQUFFLEVBQUU7WUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLDZCQUE2QixFQUFFO2dCQUMvQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDL0M7WUFBQSxDQUFDO1FBQ0osQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxPQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUvQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdFQUF3RSxDQUFDLENBQUM7WUFFekcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsT0FBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1lBRXRGLHNDQUFzQztRQUV4QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxJQUFJO1lBQ0YsUUFBVyxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUE7U0FDakY7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDeEU7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsSUFBSTtZQUNGLFFBQVcsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQTtTQUN0RTtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxJQUFJO1lBQ0YsUUFBVyxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFBO1NBQ2pFO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9