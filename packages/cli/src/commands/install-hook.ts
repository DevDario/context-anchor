import chalk from "chalk"
import { installGitHook } from "../git-hook.js"

export async function installHookCommand(): Promise<void> {
  const result = installGitHook(process.cwd())

  const messages = {
    installed: chalk.green("\n  ✓ Git hook installed\n") +
      chalk.dim("  pre-commit → context-anchor snapshot\n"),
    appended: chalk.green("\n  ✓ Git hook appended to existing pre-commit\n") +
      chalk.dim("  pre-commit → context-anchor snapshot\n"),
    skipped: chalk.yellow("\n  ⚠ Git hook already installed. Nothing changed.\n"),
    "no-git": chalk.red("\n  ✗ No .git directory found.\n") +
      chalk.dim("  Run `git init` first.\n"),
  }

  console.log(messages[result])

  if (result === "no-git") process.exit(1)
}