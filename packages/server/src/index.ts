import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { z } from "zod"

import {
  resolveContextPaths,
  parseProjectDoc,
  parseFeatureDoc,
  listFeatureDocs,
  type AnchoredContext,
} from "@context-anchor/core"

import { GetContextInput, ListFeaturesInput, UpdateFeatureInput } from "./tools.js"
import { formatContextForLLM } from "./formatter.js"

const server = new McpServer({
  name: "context-anchor",
  version: "0.0.1",
})

server.tool(
  "get_context",
  "Get the anchored context for this project. Always call this at the start of a task.",
  GetContextInput.shape,
  async ({ feature, cwd }) => {
    const workDir = cwd ?? process.cwd()
    const paths = resolveContextPaths(workDir)

    if (!paths) {
      return {
        content: [
          {
            type: "text",
            text: "No .context/ directory found. Run `context-anchor init` to set up context anchoring.",
          },
        ],
        isError: true,
      }
    }

    if (!existsSync(paths.projectDoc)) {
      return {
        content: [{ type: "text", text: "project.md not found in .context/. Run `context-anchor init`." }],
        isError: true,
      }
    }

    const project = parseProjectDoc(paths.projectDoc)

    let featureCtx = null
    if (feature) {
      const featurePath = join(paths.featuresDir, `${feature}.md`)
      if (!existsSync(featurePath)) {
        return {
          content: [{ type: "text", text: `Feature "${feature}" not found. Check .context/features/ for available features.` }],
          isError: true,
        }
      }
      featureCtx = parseFeatureDoc(featurePath)
    }

    const anchored: AnchoredContext = {
      project,
      feature: featureCtx,
      mergedAt: new Date().toISOString(),
    }

    return {
      content: [{ type: "text", text: formatContextForLLM(anchored) }],
    }
  }
)

server.tool(
  "list_features",
  "List all feature context documents available in this project.",
  ListFeaturesInput.shape,
  async ({ cwd }) => {
    const workDir = cwd ?? process.cwd()
    const paths = resolveContextPaths(workDir)

    if (!paths) {
      return {
        content: [{ type: "text", text: "No .context/ directory found." }],
        isError: true,
      }
    }

    const featurePaths = listFeatureDocs(paths.featuresDir)

    if (featurePaths.length === 0) {
      return {
        content: [{ type: "text", text: "No feature documents found in .context/features/." }],
      }
    }

    const features = featurePaths.map((fp) => {
      const ctx = parseFeatureDoc(fp)
      const pending = ctx.state.pending.length
      const open = ctx.openQuestions.length
      return `- **${ctx.name}** — ${ctx.decisions.length} decisions, ${pending} pending tasks, ${open} open questions`
    })

    return {
      content: [{ type: "text", text: `## Available Features\n\n${features.join("\n")}` }],
    }
  }
)

server.tool(
  "update_feature",
  "Append a new decision to a feature context document after a decision is made.",
  UpdateFeatureInput.shape,
  async ({ feature, decision, reason, rejected, cwd }) => {
    const workDir = cwd ?? process.cwd()
    const paths = resolveContextPaths(workDir)

    if (!paths) {
      return {
        content: [{ type: "text", text: "No .context/ directory found." }],
        isError: true,
      }
    }

    const featurePath = join(paths.featuresDir, `${feature}.md`)

    if (!existsSync(featurePath)) {
      return {
        content: [{ type: "text", text: `Feature "${feature}" not found.` }],
        isError: true,
      }
    }

    const content = readFileSync(featurePath, "utf-8")
    const newRow = `| ${decision} | ${reason} | ${rejected ?? "—"} |`

    let updated: string

    if (content.includes("## Decisions")) {
      updated = content.replace(
        /(##\s+Decisions[\s\S]*?\|[-| :]+\n)((?:\|.+\n?)*)/i,
        (_, header, rows) => `${header}${rows}${newRow}\n`
      )
    } else {
      updated =
        content.trimEnd() +
        `\n\n## Decisions\n| Decision | Reason | Rejected |\n|---|---|---|\n${newRow}\n`
    }

    writeFileSync(featurePath, updated, "utf-8")

    return {
      content: [{ type: "text", text: `Decision recorded in feature "${feature}".` }],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)