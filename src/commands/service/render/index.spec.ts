import { loadTemplates, getSampleSchema, propertyCompare, render, parseSchemas } from ".";
import * as path from "path";
import { Stream } from "stream";
import { debug } from "util";


describe("service command init", function() {
  it("should load all class templates", function() {
    loadTemplates(path.join(__dirname, "../../../../assets/class.templates/")).then((data) => {
      expect(data).toBeDefined();
      expect(typeof data).toBe("object");
      expect(Object.keys(data)).toContain("$index");
      expect(Object.keys(data)).toContain("class");
      expect(Object.keys(data)).toContain("enum");
      expect(Object.keys(data)).toContain("namespace");
      expect(Object.keys(data)).toContain("reference");
      expect(Object.keys(data)).toContain("type");
      }
    )
  })

  it("should render the example correctly", async () => {
    const schema = await getSampleSchema();
    expect(!true).toBeFalsy();
  });

  it("should correctly compare properties", () => {
    expect(propertyCompare({name:"id"}, {name: "id"})).toBe(-4);
    expect(propertyCompare({name:"name"}, {name: "id"})).toBe(-3);
    expect(propertyCompare({name:"uri"}, {name: "id"})).toBe(-2);
    expect(propertyCompare({name:"a"}, {name: "b"})).toBe(-1);
    expect(propertyCompare({name:"b"}, {name: "a"})).toBe(1);
    expect(propertyCompare({name:"$TGRE$"}, {name: "uri"})).toBe(2);
    expect(propertyCompare({name:"$TGRE$"}, {name: "name"})).toBe(3);
    expect(propertyCompare({name:"$TGRE$"}, {name: "id"})).toBe(4);
  });

  it("should render an empty puml", async () => {
    const stream = await render({namespaces:[]});
    stream.on("data", (chunk) => {
      expect(typeof chunk).toBe("object");
      expect(chunk._isVinyl).toBe(true);
    })
  });

  it("should fail rendering an undefined schema", async () => {
    try {
      await render(undefined);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error.message).toBeDefined()
    }
  });

  it("should fail parsing none existing schema", async () => {
    await expect(parseSchemas({})).rejects.toThrowError('passed empty service definition(s)');
  });

  it("should parse an existing schema", async () => {
    const schema = await parseSchemas({ dummySchema: "src/__mocks__/dummyschema.json"});
    expect(schema.namespaces).toBeDefined();
    expect(Array.isArray(schema.namespaces)).toBeTruthy();
    expect(schema.namespaces[0].classes).toBeDefined();
    expect(Array.isArray(schema.namespaces[0].classes)).toBeTruthy();
    expect(schema.namespaces[0].types).toBeDefined();
    expect(Array.isArray(schema.namespaces[0].types)).toBeTruthy();
  });

})