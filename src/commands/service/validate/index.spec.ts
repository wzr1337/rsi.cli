import { loadSchema, validate } from "./index";

describe("service.init",  () => {
  it("should load a schema", () => {
    const schema = loadSchema("./src/__mocks__/dummyschema.json");
    expect(typeof schema).toBe("object");
  });

  it("validate a correct schema", async () => {
    const valid = await validate("./src/__mocks__/dummyschema.json");
    expect(valid).toBeTruthy();
  });

})