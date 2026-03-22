import type { AnchoredContext } from "../types.js"

export function formatForClaude(ctx: AnchoredContext): string {
  const lines: string[] = []

  lines.push("<context>")
  lines.push(`<project name="${ctx.project.name}">`)

  if (ctx.project.stack.length > 0) {
    lines.push(`  <stack>${ctx.project.stack.join(", ")}</stack>`)
  }

  if (ctx.project.principles.length > 0) {
    lines.push("  <principles>")
    ctx.project.principles.forEach((p) => lines.push(`    - ${p}`))
    lines.push("  </principles>")
  }

  if (ctx.project.conventions.length > 0) {
    lines.push("  <conventions>")
    ctx.project.conventions.forEach((c) => lines.push(`    - ${c}`))
    lines.push("  </conventions>")
  }

  lines.push("</project>")

  if (ctx.feature) {
    const f = ctx.feature
    lines.push(`\n<feature name="${f.name}">`)

    if (f.decisions.length > 0) {
      lines.push("  <decisions>")
      f.decisions.forEach((d) => {
        lines.push(`    <decision>`)
        lines.push(`      <choice>${d.decision}</choice>`)
        lines.push(`      <reason>${d.reason}</reason>`)
        if (d.rejected) lines.push(`      <rejected>${d.rejected}</rejected>`)
        lines.push(`    </decision>`)
      })
      lines.push("  </decisions>")
    }

    if (f.constraints.length > 0) {
      lines.push("  <constraints>")
      f.constraints.forEach((c) => lines.push(`    - ${c}`))
      lines.push("  </constraints>")
    }

    if (f.openQuestions.length > 0) {
      lines.push("  <open_questions>")
      f.openQuestions.forEach((q) => lines.push(`    - ${q}`))
      lines.push("  </open_questions>")
    }

    const { done, pending } = f.state
    if (done.length > 0 || pending.length > 0) {
      lines.push("  <implementation_state>")
      done.forEach((d) => lines.push(`    <done>${d}</done>`))
      pending.forEach((p) => lines.push(`    <pending>${p}</pending>`))
      lines.push("  </implementation_state>")
    }

    lines.push("</feature>")
  }

  lines.push("</context>")
  lines.push(`\n<!-- context-anchor @ ${ctx.mergedAt} -->`)

  return lines.join("\n")
}