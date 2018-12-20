export class Logger {

  static error(scope?: string, ...args:any[]) {
    console.log("\x1b[31m[Error]\x1b[0m", scope, ...args);
  }

  static success(scope?: string, ...args:any[]) {
    console.log("\x1b[32m[Success]\x1b[0m", scope, ...args);
  }

  static info(scope?: string, ...args:any[]) {
    console.log("\x1b[33m[Info]\x1b[0m", scope, ...args);
  }

  static debug(scope?: string, ...args:any[]) {
    console.log("\x1b[34m[Debug]\x1b[0m", scope, ...args);
  }
}