---
name: codemapper
description: Use CodeMapper for fast repository mapping, symbol discovery, file outlines, impact analysis, and static call-path tracing before broad source reads.
---

# CodeMapper Workflow

Use the `codemapper_*` tools to reduce the search space before reading many
files. Pass the absolute active repository path as `root` when it is known.

## Recommended sequence

1. Use `codemapper_map` for an unfamiliar repository or package.
2. Use `codemapper_search` with one symbol/concept or `|`-separated alternatives.
3. Use `codemapper_outline` before reading a large file.
4. Use `codemapper_expand` before editing a known symbol.
5. Use `codemapper_path` only after confirming both endpoint symbols.

## Search boundaries

CodeMapper searches indexed symbol names, Markdown headings, and detected
endpoints. It does not replace grep for arbitrary source text.

- Prefer `auth|login|session`, not a natural-language question.
- A whitespace-separated list of identifier-like terms is accepted and
  normalized to an OR query.
- Use `rg` or another text-search tool for string literals, regexes, field
  access patterns, or exact source text.

Treat static call-graph results as leads. Verify important relationships in
source and tests before changing behavior.
