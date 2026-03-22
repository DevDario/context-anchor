import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { input } from "@inquirer/prompts"
import chalk from "chalk"
import { projectTemplate } from "../templates.js"
import { installGitHook } from "../git-hook.js"

interface InitOptions {
  interactive: boolean
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd()
  const contextDir = join(cwd, ".context")
  const featuresDir = join(contextDir, "features")
  const historyDir = join(contextDir, "history")
  const projectDoc = join(contextDir, "project.md")

  if (existsSync(contextDir)) {
    console.log(chalk.yellow("⚠  .context/ already exists. Nothing was changed."))
    console.log(chalk.dim(`   Edit ${chalk.white("project.md")} directly to update project context.`))
    return
  }

  let templateData: Parameters<typeof projectTemplate>[0] = undefined

  if (options.interactive) {
    console.log(chalk.cyan("\n  Context Anchor — Interactive Setup\n"))

    const name = await input({
      message: "Project name:",
      default: cwd.split("/").pop() ?? "my-project",
    })

    const stackInput = await input({
      message: "Stack (comma-separated):",
      default: "Next.js, Node.js, PostgreSQL",
    })

    const principlesInput = await input({
      message: "Core principles (comma-separated):",
      default: "mobile-first, offline-capable",
    })

    const conventionsInput = await input({
      message: "Code conventions (comma-separated):",
      default: "functional services, no classes",
    })

    const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean)

    templateData = {
      name,
      stack: split(stackInput),
      principles: split(principlesInput),
      conventions: split(conventionsInput),
    }
  }

  mkdirSync(featuresDir, { recursive: true })
  mkdirSync(historyDir, { recursive: true })

  writeFileSync(projectDoc, projectTemplate(templateData), "utf-8")

  const hookResult = installGitHook(cwd)

  console.log(chalk.green("\n  ✓ Context Anchor initialized\n"))
  console.log(`  ${chalk.dim("created")}  .context/project.md`)
  console.log(`  ${chalk.dim("created")}  .context/features/`)
  console.log(`  ${chalk.dim("created")}  .context/history/\n`)

  const hookMessages = {
    installed: chalk.dim("  hook     pre-commit → context-anchor snapshot"),
    appended:  chalk.dim("  hook     pre-commit → appended context-anchor snapshot"),
    skipped:   chalk.dim("  hook     pre-commit → already installed, skipped"),
    "no-git":  chalk.yellow("  ⚠ no .git found — snapshot on commit unavailable"),
  }
  console.log(hookMessages[hookResult])
  console.log()

  if (!options.interactive) {
    console.log(chalk.dim(`  Edit ${chalk.white(".context/project.md")} to add your project context.`))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor new-feature <name>")} to create a feature doc.\n`))
  } else {
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor serve")} to start the MCP server.\n`))
  }
}