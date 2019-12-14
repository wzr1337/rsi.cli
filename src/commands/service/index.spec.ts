import { printHelp } from "./index";

// Sets spies on console object to make it possible to convert them into test failures. 
const spyLog = jest.spyOn( console, 'log' ); 

beforeEach( () => { 
  spyLog.mockReset();
}); 

describe("service index", () => {
  it("should print help", () => {
    printHelp();
    expect( spyLog ).toHaveBeenCalled();
  })
})