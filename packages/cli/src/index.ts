#!/usr/bin/env node

import { Command } from "commander"
import { initCommand } from "./commands/init.js"
import { serveCommand } from "./commands/serve.js"
import { statusCommand } from "./commands/status.js"
import { newFeatureCommand } from "./commands/new-feature.js"
import { snapshotCommand } from "./commands/snapshot.js"
import { installHookCommand } from "./commands/install-hook.js"
import { exportCommand } from "./commands/export.js"
import type { LLMTarget } from "@context-anchor/core"

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
  .command("new-feature <n>")
  .description("Create a new feature context document")
  .action((name) => newFeatureCommand(name))

program
  .command("snapshot")
  .description("Save a snapshot of the current .context/ state")
  .action(() => snapshotCommand())

program
  .command("install-hook")
  .description("Install git pre-commit hook for automatic snapshots")
  .action(() => installHookCommand())

program
 .command("export <target>")
 .description("Export content formatted for a target LLM (claude | openai | gemini | cursor)")
  .option("-f, --feature <name>", "Include a specific feature context")
  .option("-c, --copy", "Copy output to Clipboard",false)
  .action((target,options) => exportCommand(target as LLMTarget, options))
 

program.parse()