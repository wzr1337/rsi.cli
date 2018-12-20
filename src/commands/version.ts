import { readFileSync } from "fs";
import * as path from "path";

const PKG = JSON.parse(readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

export function getVersion():String {
  return PKG.version || "UNKNOWN";
}