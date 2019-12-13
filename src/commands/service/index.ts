import commandLineUsage from "command-line-usage";
export { init, serviceMeta } from "./init";
export { validate } from "./validate";
export { render, loadTemplates, parseSchemas } from "./render";
export { renderMarkdown, renderHTML } from "./document";

const sections = [
  {
    header: "rsi service",
    content: 'Usage: `rsi service [options...]`'
  },
  {
    header: 'commands',
    content: [
      { name: 'init', summary: 'initialize a new repository' },
      { name: 'release', summary: 'prepare service for release' },
      { name: 'render', summary: 'render UML from schema' },
      { name: 'markdown', summary: 'render markdown documentation based on the schema' },
      { name: 'validate', summary: 'validate a schema' }
    ]
  }
]
const usage = commandLineUsage(sections)

export function printHelp() {
  console.log(usage)
}