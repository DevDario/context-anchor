import { existsSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"
import chalk from "chalk"
import {
  resolveContextPaths,
  parseProjectDoc,
  parseFeatureDoc,
  formatContext,
  type LLMTarget,
} from "@context-anchor/core"

interface ExportOptions {
  feature?: string
  copy: boolean
}

export async function exportCommand(target: LLMTarget, options: ExportOptions): Promise<void> {
  const paths = resolveContextPaths(process.cwd())

  if (!paths) {
    console.log(chalk.red("\n  ✗ No .context/ directory found.\n"))
    process.exit(1)
  }

  const project = parseProjectDoc(paths.projectDoc)
  let featureCtx = null

  if (options.feature) {
    const featurePath = join(paths.featuresDir, `${options.feature}.md`)
    if (!existsSync(featurePath)) {
      console.log(chalk.red(`\n  ✗ Feature "${options.feature}" not found.\n`))
      process.exit(1)
    }
    featureCtx = parseFeatureDoc(featurePath)
  }

  const anchored = {
    project,
    feature: featureCtx,
    mergedAt: new Date().toISOString(),
  }

  const output = formatContext(anchored, target)

  console.log(chalk.dim(`\n  # Context for ${target}\n`))
  console.log(output.content)
  console.log(chalk.dim(`\n  ──\n  ${output.instructions}\n`))

  if (options.copy) {
    try {
      const clipboardCmd =
        process.platform === "darwin" ? "pbcopy" :
        process.platform === "win32" ? "clip" :
        "xclip -selection clipboard"

      execSync(`echo ${JSON.stringify(output.content)} | ${clipboardCmd}`)
      console.log(chalk.green("  ✓ Copied to clipboard\n"))
    } catch {
      console.log(chalk.yellow("  ⚠ Could not copy to clipboard. Install xclip on Linux.\n"))
    }
  }
}