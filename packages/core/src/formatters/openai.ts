import type { AnchoredContext } from "../types.js"

// eats JSON, like a normal LLM should
export function formatForOpenAI(ctx: AnchoredContext): string {
  const payload: Record<string, unknown> = {
    project: {
      name: ctx.project.name,
      stack: ctx.project.stack,
      principles: ctx.project.principles,
      conventions: ctx.project.conventions,
    },
  }

  if (ctx.feature) {
    const f = ctx.feature

    payload.active_feature = {
      name: f.name,
      decisions: f.decisions.map((d) => ({
        choice: d.decision,
        reason: d.reason,
        ...(d.rejected ? { rejected_alternative: d.rejected } : {}),
      })),
      constraints: f.constraints,
      open_questions: f.openQuestions,
      implementation_state: {
        done: f.state.done,
        pending: f.state.pending,
      },
    }
  }

  const lines: string[] = [
    "You are a senior software engineer working on the following project.",
    "Respect all decisions and constraints listed below. Do not re-propose rejected alternatives.",
    "",
    "```json",
    JSON.stringify(payload, null, 2),
    "```",
    "",
    `<!-- context-anchor @ ${ctx.mergedAt} -->`,
  ]

  return lines.join("\n")
}