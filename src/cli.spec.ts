import * as cli from "./cli"

describe("this cli", () => {
  it("should return an array of valid keys", () => {
    expect(cli.filterDependencies({ 'rsi.service.remoteaccess': 'http://somewhere.com'})).toStrictEqual(["rsi.service.remoteaccess"])
  })

  it("should throw an error", () => {
    expect(() => {
      cli.filterDependencies({ 'fooBar': 'http://somewhere.com'});
    }).toThrowError('no RSI or VIWI services found in dependencies!');
    expect(() => {
      cli.filterDependencies(undefined);
    }).toThrowError('undefined argument!')
  })
});