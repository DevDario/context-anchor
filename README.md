# context-anchor

> Git-native context layer for AI-assisted development.

LLMs forget. Every new session, every tool switch — you re-explain the stack, the decisions, the constraints. Context Anchor externalizes that knowledge into versioned markdown files that any LLM can read, any time.

Built on the [MCP protocol](https://modelcontextprotocol.io). Works with Claude Code, Cursor, and any MCP-compatible client.

---

## The problem

When you work with AI across multiple sessions or tools, context erodes. The model remembers *what* you decided but forgets *why*. You keep conversations alive longer than you should — not because they're productive, but because closing them means losing everything.

Context Anchor solves this by treating context as infrastructure, not conversation.

---

## How it works

```
.context/
  project.md        ← stack, principles, conventions (stable)
  features/
    auth.md         ← decisions, constraints, open questions, state
    payments.md
  history/          ← automatic snapshots on every git commit
```

Your MCP-compatible editor calls `get_context` at the start of every task. The LLM gets full project + feature context in seconds — warm start, every session.

---

## Install

```bash
npm install -g @context-anchor/cli
```

Or with pnpm:

```bash
pnpm add -g @context-anchor/cli
```

---

## Usage

```bash
# Initialize in your project
ctx init --interactive

# Create a feature context doc
ctx new-feature "user auth"

# Start the MCP server
ctx serve

# Check status
ctx status

# Export context for a specific LLM
ctx export claude
ctx export openai --feature user-auth
ctx export cursor --copy

# Manual snapshot
ctx snapshot

# Install git hook (auto-snapshot on commit)
ctx install-hook
```

---

## MCP Tools

Once `ctx serve` is running, your editor has access to:

| Tool | Description |
|---|---|
| `get_context` | Get project + feature context. Call at the start of every task. |
| `list_features` | List all feature docs with status. |
| `update_feature` | Record a decision after it's made. |
| `export_context` | Export context formatted for a specific LLM. |

---

## Connecting to your editor

### Cursor

Add to your Cursor MCP config (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "context-anchor": {
      "command": "node",
      "args": ["/path/to/context-anchor/packages/server/dist/index.js"]
    }
  }
}
```

### Claude Code

```json
{
  "mcpServers": {
    "context-anchor": {
      "command": "ctx",
      "args": ["serve"]
    }
  }
}
```

---

## Project context format

`.context/project.md` — edit once, rarely update:

```markdown
# My Project

## Stack
- Next.js 14, Node.js, PostgreSQL

## Principles
- Mobile-first, offline-capable
- Multi-tenant: always scope queries by tenantId

## Conventions
- Functional services, no classes
- Result pattern for error handling
```

`.context/features/auth.md` — evolves per session:

```markdown
# Feature: Auth

## Decisions
| Decision | Reason | Rejected |
|---|---|---|
| JWT stateless | No session store needed | Sessions (infra overhead) |

## Constraints
- Tokens expire in 7 days
- Refresh tokens stored in httpOnly cookie

## Open Questions
- [ ] OAuth providers for v2?

## State
- [x] Login + register
- [ ] Password reset
```

---

## Why not just use Cursor's memory / Claude Projects?

Those tools operate at the project level — they remember your stack, not your feature-level decisions. They don't capture *why* you chose one approach over another, what was rejected, or what's still open. And they're locked to one tool.

Context Anchor is portable, versionable, and works across every LLM you use.

---

## Roadmap

- [x] MCP server (get, list, update, export)
- [x] CLI (init, serve, status, new-feature, snapshot, export)
- [x] Git hook for automatic snapshots
- [x] Multi-LLM formatter (Claude, OpenAI, Gemini, Cursor)
- [ ] `diff` between snapshots
- [ ] Team sync (shared context across developers)
- [ ] Web dashboard
- [ ] VS Code extension

---

## Built with

- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- TypeScript, pnpm workspaces

---

## License

MIT