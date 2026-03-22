import { z } from "zod"

export const GetContextInput = z.object({
  feature: z
    .string()
    .optional()
    .describe("Feature name to include (e.g. 'auth', 'payments'). Omit for project-only context."),
  cwd: z
    .string()
    .optional()
    .describe("Working directory to resolve .context/ from. Defaults to process.cwd()."),
})

export type GetContextInput = z.infer<typeof GetContextInput>

export const ListFeaturesInput = z.object({
  cwd: z.string().optional(),
})

export type ListFeaturesInput = z.infer<typeof ListFeaturesInput>

export const UpdateFeatureInput = z.object({
  feature: z.string().describe("Feature name to update (must exist in .context/features/)."),
  decision: z.string().describe("What was decided."),
  reason: z.string().describe("Why this decision was made."),
  rejected: z.string().optional().describe("What alternative was rejected, if any."),
  cwd: z.string().optional(),
})

export type UpdateFeatureInput = z.infer<typeof UpdateFeatureInput>

export const ExportContextInput = z.object({
  target: z
   .enum(["claude", "openai", "gemini", "cursor"])
    .describe("Target LLM or tool to format text for."),
  feature: z.string().optional().describe("Feature name to include."),
  cwd: z.string().optional(),
})

export type ExportContextInput = z.infer<typeof ExportContextInput>