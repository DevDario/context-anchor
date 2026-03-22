import { existsSync, mkdirSync, readdirSync, copyFileSync } from "fs"
import { join } from "path"
import type { ContextPaths } from "./types.js"

export interface SnapshotResult {
  path: string
  timestamp: string 
  files: string[]   
}

export function createSnapshot(paths: ContextPaths): SnapshotResult {
  const timestamp = new Date().toISOString()
  const folderName = timestamp.slice(0, 19).replace(/:/g, "-") // "2026-03-22T02-11-19"
  const snapshotDir = join(paths.historyDir, folderName)
  const snapshotFeaturesDir = join(snapshotDir, "features")

  mkdirSync(snapshotFeaturesDir, { recursive: true })

  const files: string[] = []

  if (existsSync(paths.projectDoc)) {
    const dest = join(snapshotDir, "project.md")
    copyFileSync(paths.projectDoc, dest)
    files.push("project.md")
  }

  if (existsSync(paths.featuresDir)) {
    const featureFiles = readdirSync(paths.featuresDir).filter((f) => f.endsWith(".md"))

    for (const file of featureFiles) {
      const src = join(paths.featuresDir, file)
      const dest = join(snapshotFeaturesDir, file)
      copyFileSync(src, dest)
      files.push(`features/${file}`)
    }
  }

  return { path: snapshotDir, timestamp, files }
}

export function listSnapshots(paths: ContextPaths): string[] {
  if (!existsSync(paths.historyDir)) return []

  return readdirSync(paths.historyDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/.test(f))
    .sort()
    .reverse()
}