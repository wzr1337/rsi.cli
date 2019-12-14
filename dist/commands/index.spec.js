"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// Sets spies on console object to make it possible to convert them into test failures. 
const spyLog = jest.spyOn(console, 'log');
beforeEach(() => {
    spyLog.mockReset();
});
describe("commands index", () => {
    it("should print help", () => {
        index_1.printHelp();
        expect(spyLog).toHaveBeenCalled();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbmRleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW9DO0FBRXBDLHdGQUF3RjtBQUN4RixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLE9BQU8sRUFBRSxLQUFLLENBQUUsQ0FBQztBQUU1QyxVQUFVLENBQUUsR0FBRyxFQUFFO0lBQ2YsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtJQUM5QixFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzNCLGlCQUFTLEVBQUUsQ0FBQztRQUNaLE1BQU0sQ0FBRSxNQUFNLENBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==