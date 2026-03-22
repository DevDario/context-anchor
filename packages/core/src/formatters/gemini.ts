import type { AnchoredContext } from "../types.js"

export function formatForGemini(ctx: AnchoredContext): string {
  const lines: string[] = []

  lines.push(`### Project: ${ctx.project.name}`)

  if (ctx.project.stack.length > 0) {
    lines.push(`\n**Stack:** ${ctx.project.stack.join(", ")}`)
  }

  if (ctx.project.principles.length > 0) {
    lines.push(`\n**Principles**`)
    ctx.project.principles.forEach((p) => lines.push(`- ${p}`))
  }

  if (ctx.project.conventions.length > 0) {
    lines.push(`\n**Conventions**`)
    ctx.project.conventions.forEach((c) => lines.push(`- ${c}`))
  }

  if (ctx.feature) {
    const f = ctx.feature
    lines.push(`\n---\n### Active Feature: ${f.name}`)

    if (f.decisions.length > 0) {
      lines.push("\n**Decisions made — do not re-propose rejected alternatives**")
      f.decisions.forEach((d) => {
        lines.push(`- **${d.decision}** — ${d.reason}${d.rejected ? ` *(rejected: ${d.rejected})*` : ""}`)
      })
    }

    if (f.constraints.length > 0) {
      lines.push("\n**Constraints**")
      f.constraints.forEach((c) => lines.push(`- ${c}`))
    }

    if (f.openQuestions.length > 0) {
      lines.push("\n**Open Questions**")
      f.openQuestions.forEach((q) => lines.push(`- [ ] ${q}`))
    }

    const { done, pending } = f.state
    if (done.length > 0 || pending.length > 0) {
      lines.push("\n**Implementation State**")
      done.forEach((d) => lines.push(`- [x] ${d}`))
      pending.forEach((p) => lines.push(`- [ ] ${p}`))
    }
  }

  lines.push(`\n<!-- context-anchor @ ${ctx.mergedAt} -->`)

  return lines.join("\n")
}