import { existsSync, mkdirSync, writeFileSync, chmodSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { execSync } from "child_process"

const HOOK_MARKER = "# context-anchor"

const hookScript = (cliPath: string) => `#!/bin/sh
${HOOK_MARKER}
${cliPath} snapshot
`

export function resolveGitRoot(startDir: string): string | null {
  let current = startDir
  while (true) {
    if (existsSync(join(current, ".git"))) return current
    const parent = dirname(current)
    if (parent === current) return null
    current = parent
  }
}

function resolveBinPath(bin: string): string {
  try {
    return execSync(`which ${bin}`, { encoding: "utf-8" }).trim()
  } catch {
    return bin
  }
}

export function installGitHook(
  startDir: string,
  cliBin = "context-anchor"
): "installed" | "appended" | "skipped" | "no-git" {
  const gitRoot = resolveGitRoot(startDir)
  if (!gitRoot) return "no-git"

  const resolvedBin = resolveBinPath(cliBin)
  const hooksDir = join(gitRoot, ".git", "hooks")
  const hookPath = join(hooksDir, "pre-commit")

  mkdirSync(hooksDir, { recursive: true })

  if (existsSync(hookPath)) {
    const existing = readFileSync(hookPath, "utf-8")
    if (existing.includes(HOOK_MARKER)) return "skipped"
    writeFileSync(hookPath, existing.trimEnd() + "\n\n" + hookScript(resolvedBin), "utf-8")
    chmodSync(hookPath, 0o755)
    return "appended"
  }

  writeFileSync(hookPath, hookScript(resolvedBin), "utf-8")
  chmodSync(hookPath, 0o755)
  return "installed"
}