import { existsSync, writeFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"
import { resolveContextPaths } from "@context-anchor/core"
import { featureTemplate } from "../templates.js"

export async function newFeatureCommand(name: string): Promise<void> {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  if (!slug) {
    console.log(chalk.red("\n  ✗ Invalid feature name.\n"))
    process.exit(1)
  }

  const paths = resolveContextPaths(process.cwd())

  if (!paths) {
    console.log(chalk.red("\n  ✗ No .context/ directory found.\n"))
    console.log(chalk.dim(`  Run ${chalk.white("context-anchor init")} first.\n`))
    process.exit(1)
  }

  const featurePath = join(paths.featuresDir, `${slug}.md`)

  if (existsSync(featurePath)) {
    console.log(chalk.yellow(`\n  ⚠  Feature "${slug}" already exists.\n`))
    console.log(chalk.dim(`  Edit ${chalk.white(`.context/features/${slug}.md`)} directly.\n`))
    return
  }

  writeFileSync(featurePath, featureTemplate(slug), "utf-8")

  console.log(chalk.green(`\n  ✓ Feature created\n`))
  console.log(`  ${chalk.dim("file")}    .context/features/${slug}.md`)
  console.log(`  ${chalk.dim("use")}     context-anchor status\n`)
}