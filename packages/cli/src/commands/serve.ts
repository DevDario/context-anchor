import { existsSync } from "fs"
import { join, dirname } from "path"
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import chalk from "chalk"
import { resolveContextPaths } from "@context-anchor/core"

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function serveCommand(): Promise<void> {
  const paths = resolveContextPaths(process.cwd())

  if (!paths) {
    console.log(chalk.red("\n  ✗ No .context/ directory found.\n"))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor init")} first.\n`))
    process.exit(1)
  }

  const serverEntry = join(__dirname, "../../..", "server", "dist", "index.js")

  if (!existsSync(serverEntry)) {
    console.log(chalk.red("\n  ✗ Server not built.\n"))
    console.log(chalk.dim(`  Run ${chalk.white("pnpm --filter @context-anchor/server build")} first.\n`))
    process.exit(1)
  }

  console.log(chalk.cyan("\n  Context Anchor MCP Server\n"))
  console.log(`  ${chalk.dim("project")}  ${paths.projectDoc}`)
  console.log(`  ${chalk.dim("status")}   ${chalk.green("running")}\n`)

  const child = spawn("node", [serverEntry], {
    stdio: "inherit",
    env: { ...process.env, CONTEXT_ANCHOR_ROOT: paths.root },
  })

  child.on("error", (err) => {
    console.error(chalk.red(`\n  Server error: ${err.message}\n`))
    process.exit(1)
  })

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(chalk.red(`\n  Server exited with code ${code}\n`))
      process.exit(code ?? 1)
    }
  })
}