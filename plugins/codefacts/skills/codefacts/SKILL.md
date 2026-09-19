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
- Relationship between confirmed symbols: `path` for a shortest static path.

When the relevant source location is already known, read that source directly.
Use map or outline when the overview will help choose the next step; the five
tools are alternatives, not a required sequence.

For a rootless server, pass the absolute target repository as
`repository_root` on every call. Use project-relative values for `file_path`,
`path_prefix`, `from_file_path`, and `to_file_path`. A response is usable only
when `freshness.repository_root` identifies the intended project; its
generation and source hashes are the evidence that the facts were refreshed.

Results are bounded. For more `search` or `outline` results, pass `next_cursor`
as `cursor` with the same query and filters; continue only when more facts are
needed. A truncated page or source excerpt is incomplete. An empty symbol
search does not establish that text is absent: refine the identifier, outline
the known file, or use raw text search as appropriate.

Preserve relation direction and confidence when using the results. Heuristic
or unresolved relationships are candidates, not confirmed calls;
`no_static_path` does not establish runtime unreachability.
