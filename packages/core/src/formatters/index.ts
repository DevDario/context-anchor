import type { AnchoredContext } from "../types.js"
import { formatForClaude } from "./claude.js"
import { formatForOpenAI } from "./openai.js"
import { formatForGemini } from "./gemini.js"
import { formatForCursor } from "./cursor.js"

export type LLMTarget = "claude" | "openai" | "gemini" | "cursor"

export interface FormatterOutput {
  target: LLMTarget
  content: string
  instructions: string 
}

const formatters: Record<LLMTarget, (ctx: AnchoredContext) => string> = {
  claude:  formatForClaude,
  openai:  formatForOpenAI,
  gemini:  formatForGemini,
  cursor:  formatForCursor,
}

export function formatContext(ctx: AnchoredContext, target: LLMTarget): FormatterOutput {
  const instructions: Record<LLMTarget, string> = {
    claude:  "Paste this into the system prompt or start of your conversation.",
    openai:  "Use this as the `system` message content in your API call or paste at conversation start.",
    gemini:  "Paste this into the system instructions field or start of your conversation.",
    cursor:  "Save this as .cursorrules in your project root, or paste into Cursor's system prompt.",
  }

  return {
    target,
    content: formatters[target](ctx),
    instructions: instructions[target],
  }
}

export { formatForClaude, formatForOpenAI, formatForGemini, formatForCursor }