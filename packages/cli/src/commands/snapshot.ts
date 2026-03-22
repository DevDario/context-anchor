import chalk from "chalk"
import { resolveContextPaths, createSnapshot } from "@context-anchor/core"

export async function snapshotCommand(): Promise<void> {
  const paths = resolveContextPaths(process.cwd())

  if (!paths) {
    console.log(chalk.red("\n  ✗ No .context/ directory found.\n"))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor init")} first.\n`))
    process.exit(1)
  }

  const result = createSnapshot(paths)

  console.log(chalk.green("\n  ✓ Snapshot created\n"))
  console.log(`  ${chalk.dim("path")}   .context/history/${result.path.split("/").pop()}`)
  console.log(`  ${chalk.dim("files")}  ${result.files.join(", ")}\n`)
}