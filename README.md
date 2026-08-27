# Guanzhw Plugins

Git-backed Codex marketplace for Guanzhw-developed plugins. It currently
contains `codex-codemapper`, a read-only CodeMapper MCP integration with
mapping, symbol search, file outlines, impact expansion, and static call-path
tracing.

## Install

```powershell
codex plugin marketplace add Guanzhw/codex-plugins --ref main
codex plugin add codex-codemapper@guanzhw
```

Start a new Codex task after installation so the plugin's MCP server and skill
load.

`codex-codemapper` requires Node.js 20 or newer and CodeMapper's `cm`
executable on `PATH` or in `CODEMAPPER_BIN`. Until CodeMapper publishes native
binaries, follow its
[source installation instructions](https://github.com/p1rallels/codemapper#installation).

## Update

```powershell
codex plugin marketplace upgrade guanzhw
codex plugin add codex-codemapper@guanzhw
```

Start a new task after reinstalling. Marketplace releases increment the
plugin's semantic version so Codex refreshes its installed copy.

## Development

The marketplace keeps the plugin's existing dependency-free Node.js tests:

```powershell
npm test
npm run check
```

Validate the distributable plugin with Codex's `plugin-creator` validator:

```powershell
python /path/to/plugin-creator/scripts/validate_plugin.py plugins/codex-codemapper
```

Plugin source and marketplace metadata live together in this repository. Add
new plugins under `plugins/<plugin-name>` and append their entries to
`.agents/plugins/marketplace.json`.
