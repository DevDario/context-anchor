import type { AnchoredContext } from "@context-anchor/core"

export function formatContextForLLM(ctx: AnchoredContext): string {
  const lines: string[] = []

  lines.push(`# Project: ${ctx.project.name}`)

  if (ctx.project.stack.length > 0) {
    lines.push(`\n## Stack\n${ctx.project.stack.map((s) => `- ${s}`).join("\n")}`)
  }

  if (ctx.project.principles.length > 0) {
    lines.push(`\n## Principles\n${ctx.project.principles.map((p) => `- ${p}`).join("\n")}`)
  }

  if (ctx.project.conventions.length > 0) {
    lines.push(`\n## Conventions\n${ctx.project.conventions.map((c) => `- ${c}`).join("\n")}`)
  }

  if (ctx.feature) {
    lines.push(`\n---\n# Feature: ${ctx.feature.name}`)

    if (ctx.feature.decisions.length > 0) {
      lines.push("\n## Decisions")
      lines.push("| Decision | Reason | Rejected |")
      lines.push("|---|---|---|")
      for (const d of ctx.feature.decisions) {
        lines.push(`| ${d.decision} | ${d.reason} | ${d.rejected ?? "—"} |`)
      }
    }

    if (ctx.feature.constraints.length > 0) {
      lines.push(`\n## Constraints\n${ctx.feature.constraints.map((c) => `- ${c}`).join("\n")}`)
    }

    if (ctx.feature.openQuestions.length > 0) {
      lines.push(
        `\n## Open Questions\n${ctx.feature.openQuestions.map((q) => `- [ ] ${q}`).join("\n")}`
      )
    }

    const { done, pending } = ctx.feature.state
    if (done.length > 0 || pending.length > 0) {
      lines.push("\n## State")
      done.forEach((d) => lines.push(`- [x] ${d}`))
      pending.forEach((p) => lines.push(`- [ ] ${p}`))
    }
  }

  lines.push(`\n<!-- context anchored at ${ctx.mergedAt} -->`)

  return lines.join("\n")
}