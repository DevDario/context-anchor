export function projectTemplate(data?: {
  name?: string
  stack?: string[]
  principles?: string[]
  conventions?: string[]
}): string {
  const name = data?.name ?? "My Project"
  const stack = data?.stack?.map((s) => `- ${s}`).join("\n") ?? "- <!-- e.g. Next.js, Node.js, PostgreSQL -->"
  const principles = data?.principles?.map((p) => `- ${p}`).join("\n") ?? "- <!-- e.g. mobile-first, offline-capable -->"
  const conventions = data?.conventions?.map((c) => `- ${c}`).join("\n") ?? "- <!-- e.g. functional services, no classes -->"

  return `# ${name}

## Stack
${stack}

## Principles
${principles}

## Conventions
${conventions}
`
}

export function featureTemplate(name: string): string {
  const title = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return `# Feature: ${title}

## Decisions
| Decision | Reason | Rejected |
|---|---|---|
| <!-- e.g. Use BullMQ directly --> | <!-- Why --> | <!-- Rejected alternative --> |

## Constraints
- <!-- e.g. Email-only for v1 -->

## Open Questions
- [ ] <!-- e.g. Rate limiting strategy -->

## State
- [ ] <!-- First task -->
`
}