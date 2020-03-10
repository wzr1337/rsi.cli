import * as cli from "./cli"

describe("this cli", () => {
  it("should return an array of valid keys", () => {
    expect(cli.filterDependencies({ 'rsi.service.remoteaccess': 'http://somewhere.com'})).toStrictEqual(["rsi.service.remoteaccess"])
  })
});