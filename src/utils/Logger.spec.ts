import { Logger } from "./Logger";

// Sets spies on console object to make it possible to convert them into test failures. 
const spyLog = jest.spyOn( console, 'log' ); 

beforeEach( () => { 
  spyLog.mockReset();
}); 

describe("Logger", () => {
  it("should print errors", () => {
    Logger.error("foo")
    expect( spyLog ).toHaveBeenCalled();
  });

  it("should print info", () => {
    Logger.info("foo")
    expect( spyLog ).toHaveBeenCalled();
  })

  it("should print debug messages", () => {
    Logger.debug("foo")
    expect( spyLog ).toHaveBeenCalled();
  })

  it("should print success messages", () => {
    Logger.success("foo")
    expect( spyLog ).toHaveBeenCalled();
  })
})