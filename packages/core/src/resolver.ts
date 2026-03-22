import { existsSync } from "fs"
import { join, dirname } from "path"
import type { ContextPaths } from "./types.js"

const CONTEXT_DIR = ".context"

export function resolveContextPaths(startDir: string): ContextPaths | null {
  let current = startDir

  while (true) {
    const candidate = join(current, CONTEXT_DIR)

    if (existsSync(candidate)) {
      return {
        root: candidate,
        projectDoc: join(candidate, "project.md"),
        featuresDir: join(candidate, "features"),
        historyDir: join(candidate, "history"),
      }
    }

    const parent = dirname(current)

    if (parent === current) return null

    current = parent
  }
}