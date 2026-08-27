# Guanzhw Agent Plugins

Git-backed plugin marketplace for Codex and Claude Code. Each plugin is
self-contained and keeps host-specific manifests beside shared skills and MCP
configuration.

## Plugins

| Plugin | Purpose | Runtime |
|---|---|---|
| `codefacts` | Bounded, source-backed repository structure and relationships | Node.js plus the published `codefacts` launcher |
| `repo-ai-discipline` | Evidence-based repository discipline for AI coding agents | Skill only |
| `agentsession` | Bounded, read-only local coding-agent session history | Node.js 22.15 or newer |

## Install for Codex

```powershell
codex plugin marketplace add Guanzhw/agent-plugins --ref main
codex plugin add codefacts@guanzhw
codex plugin add repo-ai-discipline@guanzhw
codex plugin add agentsession@guanzhw
```

Start a new Codex task after installation so skills and MCP servers load.

## Install for Claude Code

```powershell
claude plugin marketplace add Guanzhw/agent-plugins
claude plugin install codefacts@guanzhw
claude plugin install repo-ai-discipline@guanzhw
claude plugin install agentsession@guanzhw
```

Run `/reload-plugins` or start a new Claude Code session after installation.

## Update

```powershell
codex plugin marketplace upgrade guanzhw
codex plugin add codefacts@guanzhw
codex plugin add repo-ai-discipline@guanzhw
codex plugin add agentsession@guanzhw

claude plugin marketplace update guanzhw
claude plugin update codefacts@guanzhw
claude plugin update repo-ai-discipline@guanzhw
claude plugin update agentsession@guanzhw
```

Start a new task or session after updating.

## Development

```powershell
npm test
npm run check
```

Validate every plugin with the relevant host CLIs before publishing:

```powershell
python /path/to/plugin-creator/scripts/validate_plugin.py plugins/codefacts
python /path/to/plugin-creator/scripts/validate_plugin.py plugins/repo-ai-discipline
python /path/to/plugin-creator/scripts/validate_plugin.py plugins/agentsession
claude plugin validate --strict plugins/codefacts
claude plugin validate --strict plugins/repo-ai-discipline
claude plugin validate --strict plugins/agentsession
claude plugin validate --strict .
```

Plugin source and marketplace metadata live together in this repository. Add
new plugins under `plugins/<plugin-name>` and register them in both marketplace
files when both hosts are supported.
