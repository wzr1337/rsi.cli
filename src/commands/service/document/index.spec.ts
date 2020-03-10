import * as documentIndex from "./index";

describe("service.document", () => {
  it("should compile markdown only if data is given", async () => {
    try {
      await documentIndex.compileMD(undefined,undefined)
    } catch (error) {
      expect(error.message).toBe("missing data");
    }
  });

  it("should compile markdown only if pathToTemplates is given", async () => {
    try {
      await documentIndex.compileMD([{some:"data"}],undefined)
    } catch (error) {
      expect(error.message).toBe("missing pathToTemplates");
    }
  });

  it("should convert string to upper case", async () => {
    expect(documentIndex.toUpperCase('helloWorld1!')).toEqual("HELLOWORLD1!");
  });

  it("should extract service name", async () => {
    expect(documentIndex.extractServiceName('rsi.service.identity')).toEqual("identity");
    expect(documentIndex.extractServiceName('viwi.service.identity')).toEqual("identity");
  });
})