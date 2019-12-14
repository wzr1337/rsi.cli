import { compileMD } from "./index";

describe("service.document", () => {
  it("should compile markdown only if data is given", async () => {
    try {
      await compileMD(undefined,undefined)
    } catch (error) {
      expect(error.message).toBe("missing data");
    }
  });

  it("should compile markdown only if pathToTemplates is given", async () => {
    try {
      await compileMD({some:"data"},undefined)
    } catch (error) {
      expect(error.message).toBe("missing pathToTemplates");
    }
  });

})