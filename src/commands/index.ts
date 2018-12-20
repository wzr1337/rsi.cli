import { readFileSync } from "fs";
import * as path from "path";
import commandLineUsage from "command-line-usage";
import {getVersion} from "./version"

const PKG = JSON.parse(readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const sections = [
  {
    header: PKG.longname,
    content: `${PKG.description} \n\nversion: ${getVersion()}\n\nUsage: rsi <commands...> [options...]`
  },
  {
    header: 'options',
    optionList: [
      {
        name: 'version',
        alias: 'v',
        description: 'Print the version.'
      },
      {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.'
      }
    ]
  },
  {
    header: 'commands',
    content: [
      { name: 'service', summary: 'operate on service level' }
    ]
  }
]
const usage = commandLineUsage(sections)

export function printHelp() {
  console.log(usage)
}