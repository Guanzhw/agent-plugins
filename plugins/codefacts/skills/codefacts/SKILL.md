---
name: codefacts
description: Use CodeFacts when a task needs source-backed symbol discovery, repository structure, or static relationships.
---

# CodeFacts workflow

Choose the read-only tool that answers the current question:

- Known identifier or code term: `search`; use `path_prefix` when its file or
  directory is known. Search covers indexed symbols, endpoints, and Markdown
  headings; query words are prefix matches joined with AND, not natural-language
  questions or raw text search.
- Repository overview: `map`. File overview: `outline`.
- Confirmed symbol: `expand` with `symbol` and, when known, `file_path` to inspect
  its definition, callers, callees, references, and tests.
- Unfamiliar repository or behavior-to-source question: `explore`; omit `query`
  for orientation, or use concrete code terms and `path_prefix` for lexical
  candidates. Follow previews with `file_path`/`start_line` or up to eight
  explicit `reads` ranges to establish behavior from current source.
- Change impact of a confirmed symbol: `impact` with `symbol` and optional
  `file_path` for bounded static dependents, shortest graph-hop witnesses, and
  reached test-associated symbols. Inspect its explicit depth, node, and work
  cutoffs. Heuristic/unresolved bindings are excluded; extraction gaps and
  runtime dispatch may omit dependencies.
- Relationship between confirmed symbols: `path` for a shortest static path.

When the relevant source location is already known, read that source directly.
Use map or outline when the overview will help choose the next step. The seven
tools (`explore`, `impact`, `map`, `search`, `outline`, `expand`, `path`) are
alternatives, not a required sequence. Disambiguate same-name symbols with
`file_path` or an exact symbol id; use `from_file_path`/`to_file_path` for `path`.

For a rootless server, pass the absolute target repository as
`repository_root` on every call. Use project-relative values for `file_path`,
`path_prefix`, `from_file_path`, and `to_file_path`. A response is usable only
when `freshness.repository_root` identifies the intended project; its
generation and source hashes are the evidence that the facts were refreshed.
Exploration reports this evidence in its text header and verifies source reads
against current disk content. Preserve partial freshness and omissions.

Results are bounded. For more `search` or `outline` results, pass `next_cursor`
as `cursor` with the same query and filters; continue only when more facts are
needed. For `expand`, use a cursor from `next` with its matching `section`,
symbol/file and format. Reuse the returned cursor verbatim; for JSON, pass it
directly from the result object when possible. A truncated page or source
excerpt is incomplete. An empty symbol
search does not establish that text is absent: refine the identifier, outline
the known file, or use raw text search as appropriate.

The five exact-fact tools and `impact` default to `format: "compact"`.
Use `format: "markdown"` when an
agent is reading the result directly: it is a text-only, fact-preserving
presentation of the compact response. JSON consumers should keep `compact` or
request `full` when they need the expanded structure. `explore` returns text
only and takes `max_bytes` (2,000–32,000; default 24,000) as its total rendered
UTF-8 response budget including metadata. It has no `format` or
`structuredContent`; lexical matches are candidates that need source judgment.

For native CLI use, `node` aliases `expand`, and `callers`/`callees` select its
matching section. `explore` and `impact` are also native commands. CodeFacts
keeps its fact store outside the repository by default and runs locally with
the native binary; querying facts needs no external service.

Preserve relation direction and confidence when using the results. Heuristic
or unresolved relationships are candidates, not confirmed calls;
`no_static_path` does not establish runtime unreachability.
