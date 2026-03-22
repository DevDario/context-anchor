import { readFileSync, existsSync, readdirSync } from "fs"
import { join, basename } from "path"
import type { ProjectContext, FeatureContext, Decision } from "./types.js"

export function parseProjectDoc(filePath: string): ProjectContext {
  const raw = readFileSync(filePath, "utf-8")

  return {
    name: extractFirstH1(raw) ?? "Unknown Project",
    stack: extractListSection(raw, "Stack"),
    principles: extractListSection(raw, "Principles"),
    conventions: extractListSection(raw, "Conventions"),
    raw,
  }
}

export function parseFeatureDoc(filePath: string): FeatureContext {
  const raw = readFileSync(filePath, "utf-8")
  const name = basename(filePath, ".md")

  return {
    name,
    decisions: extractDecisionsTable(raw),
    constraints: extractListSection(raw, "Constraints"),
    openQuestions: extractOpenQuestions(raw),
    state: extractState(raw),
    raw,
  }
}

export function listFeatureDocs(featuresDir: string): string[] {
  if (!existsSync(featuresDir)) return []

  return readdirSync(featuresDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(featuresDir, f))
}

function extractFirstH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? null
}

function extractListSection(content: string, heading: string): string[] {
  const regex = new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, "i")
  const match = content.match(regex)
  if (!match) return []

  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
}

function extractDecisionsTable(content: string): Decision[] {
  const tableRegex = /##\s+Decisions[\s\S]*?\n(\|.+\n\|[-| :]+\n)((?:\|.+\n?)*)/i
  const match = content.match(tableRegex)
  if (!match) return []

  const rows = match[2].trim().split("\n")

  const results: Decision[] = []

  for (const row of rows) {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)

    if (cols.length < 2) continue

    results.push({
      decision: cols[0] ?? "",
      reason: cols[1] ?? "",
      ...(cols[2] ? { rejected: cols[2] } : {}),
    })
  }

  return results
}

function extractOpenQuestions(content: string): string[] {
  const regex = /##\s+Open(?:\s+Questions)?\s*\n([\s\S]*?)(?=\n##|$)/i
  const match = content.match(regex)
  if (!match) return []

  return match[1]
    .split("\n")
    .filter((line) => line.includes("[ ]"))
    .map((line) => line.replace(/^[-*]\s*\[\s*\]\s*/, "").trim())
    .filter(Boolean)
}

function extractState(content: string): { done: string[]; pending: string[] } {
  const regex = /##\s+State\s*\n([\s\S]*?)(?=\n##|$)/i
  const match = content.match(regex)
  if (!match) return { done: [], pending: [] }

  const lines = match[1].split("\n").filter(Boolean)

  const done = lines
    .filter((l) => l.includes("[x]"))
    .map((l) => l.replace(/^[-*]\s*\[x\]\s*/i, "").trim())

  const pending = lines
    .filter((l) => l.includes("[ ]"))
    .map((l) => l.replace(/^[-*]\s*\[\s*\]\s*/, "").trim())

  return { done, pending }
}