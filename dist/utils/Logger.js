"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static error(scope, ...args) {
        console.log("\x1b[31m[Error]\x1b[0m", scope, ...args);
    }
    static success(scope, ...args) {
        console.log("\x1b[32m[Success]\x1b[0m", scope, ...args);
    }
    static info(scope, ...args) {
        console.log("\x1b[33m[Info]\x1b[0m", scope, ...args);
    }
    static debug(scope, ...args) {
        console.log("\x1b[34m[Debug]\x1b[0m", scope, ...args);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFFakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFjLEVBQUUsR0FBRyxJQUFVO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBYyxFQUFFLEdBQUcsSUFBVTtRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWMsRUFBRSxHQUFHLElBQVU7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFjLEVBQUUsR0FBRyxJQUFVO1FBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNGO0FBakJELHdCQWlCQyJ9