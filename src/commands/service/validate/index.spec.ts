import { loadSchema, validate } from "./index";

describe("service.init",  () => {
  it("should load a schema", () => {
    const schema = loadSchema("./src/__mocks__/dummyschema.json");
    expect(typeof schema).toBe("object");
  });

  it("should validate a correct schema", async () => {
    const valid = await validate("./src/__mocks__/dummyschema.json");
    expect(valid).toBeTruthy();
  });

  it("should fail on invalid schemas", async () => {
    try {
      const valid = await validate("./package.json");
    } catch (error) {
      expect(typeof error).toBe("object");
      expect(error.validationErrors).toBeDefined()
    }

  });

})