import * as documentIndex from "./index";
import * as path from 'path';

describe("service.document", () => {
  it("should error when compiling markdown if data is undefined", async () => {
    try {
      await documentIndex.compileMD(undefined,undefined)
    } catch (error) {
      expect(error.message).toBe("missing data");
    }
  });

  it("should error when compiling markdown if pathToTemplates is undefined", async () => {
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

  it("should return a loaded template", async () => {
    expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).toBeDefined();
    expect(documentIndex.loadTemplates(path.join(path.dirname(__filename), "../../../../assets/documentation.bundle.templates"))).not.toEqual({});
  });

  it("should error when compiling html if data is undefined", async () => {
    try {
      await documentIndex.compileHTML(undefined, "")
    } catch (error) {
      expect(error.message).toBe("missing data");
    }
  });
  
  it("should error when compiling html if pathToTemplates is undefined", async () => {
    try {
      await documentIndex.compileHTML({}, undefined)
    } catch (error) {
      expect(error.message).toBe("missing pathToTemplates");
    }
  });

  it("should reolve the promise in renderDoc", async () => {
    expect(documentIndex.renderDoc({
      changelog: undefined, 
      'rsi.service.identity': { 
        schema: 'node_modules\\rsi.service.identity\\src\\schema.json',
        package: 'node_modules\\rsi.service.identity\\package.json',
        changelog: 'node_modules\\rsi.service.identity\\CHANGELOG.md'}
      }, false, {name: 'package name', version: "0.0.1", description: "I am a paackage description"}, false)).resolves
  });
})