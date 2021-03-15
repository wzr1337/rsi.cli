"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQWEsTUFBTTtJQUVqQixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWMsRUFBRSxHQUFHLElBQVU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFjLEVBQUUsR0FBRyxJQUFVO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBYyxFQUFFLEdBQUcsSUFBVTtRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWMsRUFBRSxHQUFHLElBQVU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Y7QUFqQkQsd0JBaUJDIn0=