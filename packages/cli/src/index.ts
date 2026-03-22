#!/usr/bin/env node

import { Command } from "commander"
import { initCommand } from "./commands/init.js"
import { serveCommand } from "./commands/serve.js"
import { statusCommand } from "./commands/status.js"
import { newFeatureCommand } from "./commands/new-feature.js"

const program = new Command()

program
  .name("context-anchor")
  .description("Git-native context layer for AI-assisted development")
  .version("0.0.1")

program
  .command("init")
  .description("Initialize .context/ in the current project")
  .option("-i, --interactive", "Prompt for project details", false)
  .action((options) => initCommand(options))

program
  .command("serve")
  .description("Start the MCP server for this project")
  .action(() => serveCommand())

program
  .command("status")
  .description("Show all features and their current state")
  .action(() => statusCommand())

program
  .command("new-feature <name>")
  .description("Create a new feature context document")
  .action((name) => newFeatureCommand(name))

program.parse()