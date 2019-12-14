"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// Sets spies on console object to make it possible to convert them into test failures. 
const spyLog = jest.spyOn(console, 'log');
beforeEach(() => {
    spyLog.mockReset();
});
describe("service index", () => {
    it("should print help", () => {
        index_1.printHelp();
        expect(spyLog).toHaveBeenCalled();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9zZXJ2aWNlL2luZGV4LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0M7QUFFcEMsd0ZBQXdGO0FBQ3hGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUUsT0FBTyxFQUFFLEtBQUssQ0FBRSxDQUFDO0FBRTVDLFVBQVUsQ0FBRSxHQUFHLEVBQUU7SUFDZixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzNCLGlCQUFTLEVBQUUsQ0FBQztRQUNaLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==