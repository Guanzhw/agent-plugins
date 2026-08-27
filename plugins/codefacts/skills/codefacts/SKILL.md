---
name: codefacts
description: Use CodeFacts for bounded, source-backed repository structure and relationship facts before broad source reads or edits.
---

# CodeFacts workflow

CodeFacts exposes exactly five read-only MCP tools:

- `map` — repository structure and explicit language file/symbol counts.
- `search` — indexed symbols, endpoints, and Markdown headings.
- `outline` — symbols or headings in one file.
- `expand` — one definition with static callers, callees, references, and tests.
- `path` — a shortest confirmed static relationship path between symbols.

For a rootless server, pass the absolute target repository as
`repository_root` on every call. Use project-relative values for `file_path`,
`path_prefix`, `from_file_path`, and `to_file_path`. A response is usable only
when `freshness.repository_root` identifies the intended project; its
generation and source hashes are the evidence that the facts were refreshed.

Start with `map`, narrow candidates with `search`, inspect a file with
`outline`, then use `expand` or `path` after confirming the symbol names.
Results are bounded and source-located. Static uncertainty is reported as
uncertainty: `no_static_path` describes missing confirmed static edges, not
runtime unreachability.
