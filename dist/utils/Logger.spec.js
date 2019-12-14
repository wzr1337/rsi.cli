"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
// Sets spies on console object to make it possible to convert them into test failures. 
const spyLog = jest.spyOn(console, 'log');
beforeEach(() => {
    spyLog.mockReset();
});
describe("Logger", () => {
    it("should print errors", () => {
        Logger_1.Logger.error("foo");
        expect(spyLog).toHaveBeenCalled();
    });
    it("should print info", () => {
        Logger_1.Logger.info("foo");
        expect(spyLog).toHaveBeenCalled();
    });
    it("should print debug messages", () => {
        Logger_1.Logger.debug("foo");
        expect(spyLog).toHaveBeenCalled();
    });
    it("should print success messages", () => {
        Logger_1.Logger.success("foo");
        expect(spyLog).toHaveBeenCalled();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvTG9nZ2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFFbEMsd0ZBQXdGO0FBQ3hGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUUsT0FBTyxFQUFFLEtBQUssQ0FBRSxDQUFDO0FBRTVDLFVBQVUsQ0FBRSxHQUFHLEVBQUU7SUFDZixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixFQUFFLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQzdCLGVBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkIsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQzNCLGVBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEIsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLGVBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkIsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLGVBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckIsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSJ9