import chalk from "chalk"
import { existsSync } from "fs"
import { resolveContextPaths, parseProjectDoc, parseFeatureDoc, listFeatureDocs } from "@context-anchor/core"

export async function statusCommand(): Promise<void> {
  const paths = resolveContextPaths(process.cwd())

  if (!paths) {
    console.log(chalk.red("\n  ✗ No .context/ directory found.\n"))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor init")} first.\n`))
    process.exit(1)
  }

  const project = parseProjectDoc(paths.projectDoc)
  console.log(chalk.cyan(`\n  ${project.name}\n`))
  console.log(`  ${chalk.dim("stack")}   ${project.stack.join(", ") || chalk.dim("none")}`)

  const featurePaths = listFeatureDocs(paths.featuresDir)

  if (featurePaths.length === 0) {
    console.log(chalk.dim("\n  No features yet."))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor new-feature <name>")} to create one.\n`))
    return
  }

  console.log(`\n  ${chalk.dim("features")}\n`)

  for (const fp of featurePaths) {
    const f = parseFeatureDoc(fp)

    const doneCount = f.state.done.length
    const pendingCount = f.state.pending.length
    const total = doneCount + pendingCount

    const progress =
      total === 0
        ? chalk.dim("no tasks")
        : `${doneCount}/${total} ${progressBar(doneCount, total)}`

    const openQ =
      f.openQuestions.length > 0
        ? chalk.yellow(` ⚑ ${f.openQuestions.length} open`)
        : ""

    console.log(`  ${chalk.white(f.name.padEnd(24))} ${progress}${openQ}`)

    if (f.state.pending.length > 0) {
      f.state.pending.forEach((t) => {
        console.log(`    ${chalk.dim("·")} ${chalk.dim(t)}`)
      })
    }
  }

  console.log()
}

function progressBar(done: number, total: number): string {
  const filled = Math.round((done / total) * 8)
  const empty = 8 - filled
  return chalk.dim("[") + chalk.green("█".repeat(filled)) + chalk.dim("░".repeat(empty)) + chalk.dim("]")
}