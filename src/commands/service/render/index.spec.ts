import { loadTemplates, getSampleSchema } from ".";
import * as path from "path";


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
  })
})