---
name: codefacts
description: Use CodeFacts when a task needs source-backed symbol discovery, repository structure, or static relationships.
---

# CodeFacts workflow

Choose the default read-only tool that answers the current question:

- `explore`: orient in an unfamiliar repository, locate implementation from
  concrete code terms, or read known source. Omit `query` for orientation; use
  `path_prefix` to narrow lexical candidates, including Markdown documentation.
  Follow source previews with `file_path`/`start_line` or up to eight explicit
  `reads` ranges to establish behavior from current source. Lexical matches and
  documentation associations need source judgment; they do not confirm calls.
- `expand`: inspect a confirmed symbol's definition, callers, callees,
  references, and related tests. Use `section: "callers"`, `"callees"`, or
  `"tests"` when only that relationship is needed. Disambiguate same-name
  symbols with `file_path` or an exact symbol id.
- `impact`: trace bounded static dependents of one confirmed symbol, with
  shortest graph-hop witnesses and reached test-associated symbols. Use
  `file_path` or an exact id to disambiguate. Preserve witness direction and
  depth, node, and work cutoffs. Heuristic/unresolved bindings are excluded;
  extraction gaps and runtime dispatch may omit dependencies.

When the relevant source location is already known, read that source directly.
An empty lexical result does not establish that text is absent: refine to a
concrete identifier or use ordinary text search to locate source.

For a rootless server, pass the absolute target repository as `repository_root`
on every call. Use project-relative `file_path` and `path_prefix` values.
Check that returned freshness identifies the intended repository; retain
partial freshness and omissions. `explore` verifies source reads against disk
and shows concise source locations.

`explore` returns text only. Its `max_bytes` is the total rendered UTF-8 response
budget including metadata (2,000–32,000; default 24,000). It returns complete
small source owners when they fit the budget. MCP queries with omitted `format`
return readable Markdown text, matching the CLI default. Use explicit
`format: "compact"` or `"full"` for JSON with structured content and source
hash metadata. A truncated page or excerpt is incomplete. For
`expand`, continue a cursor from `next` with the matching `section`, symbol,
file and format; reuse the returned cursor verbatim.

The launcher uses the native three-tool default. An explicitly configured
`mcp --tools all` also exposes `map`, `search`, `outline`, and `path`; search
includes symbols, endpoints, and Markdown headings. `mcp --tools explore`
exposes only `explore`. Direct native CLI queries retain every workflow:
`node` aliases `expand`, and `callers`/`callees` select its matching section.
A missing static path does not establish runtime unreachability.

CodeFacts runs locally through the native binary and keeps its fact store
outside the repository by default. Querying facts needs no external service.
