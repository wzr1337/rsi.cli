import { getVersion } from "./version"

describe("", () => {
  it("should return a version string", () => {
    expect(typeof getVersion()).toBe("string")
  })
})