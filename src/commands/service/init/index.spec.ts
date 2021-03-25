import { init as initService, serviceMeta } from "..";
import { isArray, isObject } from "util";
import * as path from "path";

export interface PackageJSON {
  name: String,
  version:String,
  description:String,
  files: String[],
  author: {
    name: string,
    email: string
  },
  contributors: String,
  license: String,
  private: Boolean,
  dependencies: {
    ["rsi.protocol"]: String
  }
}


const DEFAULT_OPTIONS:serviceMeta = { name: "rsi.service.test", author: "Patrick Bartsch", email: "no@where.com"};

describe("service command init", function() {
  it("should return a valid package structure", function() {
    const expectedPaths:String[] = ["/package.json", "/src/serviceDefinition.json", "/README.md", "/doc/main.md", "/.gitignore"];
    let generatedPaths:String[] = [];
    initService(DEFAULT_OPTIONS)
      .on("data", (data:any) => {
        generatedPaths.push(data.path);
      })
      .on("end", () => {  // finished
        for (const expectedPath of expectedPaths) {
          expect(generatedPaths).toContain(path.normalize(expectedPath.toString()));
        }
      });
  });

  it("should return a valid package.json for name containing rsi.service", () => {
    let pkg:PackageJSON;
    initService(DEFAULT_OPTIONS)
      .on("data", (data:any) => {
        if (data.path === "/package.json") {
          pkg = JSON.parse(data.contents.toString());
        };
      })
      .on("end", () => {  // finished
        expect(pkg.name).toBeDefined();
        expect(typeof(pkg.name)).toBe("string");
        expect(pkg.name).toBe(DEFAULT_OPTIONS.name);

        expect(pkg.author).toBeDefined();
        expect(typeof(pkg.author)).toBe("object");
        expect(pkg.author.name).toBeDefined();
        expect(pkg.author.name).toBe(DEFAULT_OPTIONS.author);
        expect(pkg.author.email).toBeDefined();
        expect(pkg.author.email).toBe(DEFAULT_OPTIONS.email);

        expect(pkg.description).toBeDefined();
        expect(typeof(pkg.description)).toBe("string");
        expect(pkg.description).toBe("This service lacks description, please fill it in.");

        expect(pkg.files).not.toBeDefined();

        expect(pkg.version).toBeDefined();
        expect(typeof(pkg.version)).toBe("string");
        expect(pkg.version).toBe("0.0.1");

        expect(pkg.private).toBeDefined();
        expect(typeof(pkg.private)).toBe("boolean");
        expect(pkg.private).toBe(true);

        expect(pkg.license).toBeDefined();
        expect(typeof(pkg.license)).toBe("string");
        expect(pkg.license).toBe("UNLICENSED");

       // expect(pkg.dependencies).toBeDefined();
       // expect(isObject(pkg.dependencies)).toBe(true);
       // expect(Object.keys(pkg.dependencies)).toContain("rsi.protocol");

        expect(pkg.contributors).toBeDefined();
        expect(isArray(pkg.contributors)).toBe(true);
        expect(pkg.contributors.length).toBe(0);
      });
  });

  xit("should return a valid package.json name for name NOT containing rsi.service", () => {
    let pkg:PackageJSON;
    initService(Object.assign({}, DEFAULT_OPTIONS, {name: "foo"}))
      .on("data", (data:any) => {
        if (data.path === "/package.json") {
          pkg = JSON.parse(data.contents.toString());
        };
      })
      .on("end", () => {  // finished
        expect(pkg.name).toBeDefined();
        expect(typeof(pkg.name)).toBe("string");
        expect(pkg.name).toBe("rsi.service." + DEFAULT_OPTIONS.name);
      });
  });

  it("should return a valid src/serviceDefinition.json", function() {
    let schema:any;
    initService(DEFAULT_OPTIONS)
      .on("data", (data:any) => {
        if (data.path === "/src/serviceDefinition.json") {
          schema = JSON.parse(data.contents.toString());
        };
      })
      .on("end", () => {  // finished
        expect(schema.name).toBeDefined();
        expect(typeof(schema.name)).toBe("string");
        expect(schema.name).toBe(DEFAULT_OPTIONS.name);

        expect(schema["$schema"]).toBeDefined();
        expect(typeof(schema["$schema"])).toBe("string");
        expect(schema["$schema"]).toBe("https://github.com/wzr1337/rsi.schema/blob/2.0.0/dist/$rsi.schema.json");

        expect(schema.description).toBeDefined();
        expect(typeof(schema.description)).toBe("string");
        expect(schema.description).toBe("This service lacks description, please fill it in.");

        // @TODO use schema validator later on

      });
  });

  it("should fail when name misses in opts", () => {
    try {
      initService({name: undefined, author: "Patrick Bartsch", email: "no@where.com"})
    } catch (error) {
      expect(error.message).toBe("missing service name in `name` property.");
    }
  });

  it("should fail when name misses in opts", () => {
    try {
      initService({name: "some", author: undefined, email: "no@where.com"})
    } catch (error) {
      expect(error.message).toBe("missing author name in `author` property.");
    }
  });

  it("should fail when name misses in opts", () => {
    try {
      initService({name: "some", author: "someone", email: undefined})
    } catch (error) {
      expect(error.message).toBe("missing author email in `email` property.");
    }
  });
});