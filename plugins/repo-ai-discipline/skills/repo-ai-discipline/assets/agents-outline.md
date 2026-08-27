# Repository Agent Guide Outline

Adapt this outline to observed repository facts. Delete irrelevant sections and
link to existing authoritative documents instead of duplicating them.

## Product summary

- What the product does and deliberately does not do.
- Supported runtime, languages, and dependency constraints.

## Non-negotiable invariants

- Data and state ownership.
- Canonical identities and public contracts.
- Security, privacy, and execution boundaries.
- Evidence, provenance, and unsupported-state semantics.

## Repository map and ownership

- Authoritative modules and provider/domain boundaries.
- Source versus generated or runtime artifacts.
- Pointers to deeper owned knowledge; keep this file a map, not a manual.

## Source and implementation conventions

- Rules that affect correctness or interoperability.
- Dependency and portability constraints.
- Untrusted boundaries that normalize once, followed by trusted typed
  same-process contracts.
- Current-consumer requirement for helpers, abstractions, compatibility paths,
  and extension points.

## Scope and authorization

- Inspect/review/diagnose versus implement/delete.
- Commit/push/release/deploy and external mutation boundaries.
- Dirty work, secrets, and destructive actions.

## Simplification discipline

- Consumer evidence and compatibility requirements.
- Complete vertical-slice deletion.
- When simplification requires a decision record.

## Validation matrix

- Affected surface to focused, full, live, negative, browser, platform,
  packaging, or release checks.

## Repeated workflows and Skills

- Stable repository-local Skills and when to use them.
- Optional specialist or independent review routing.
- Feedback promotion: task correction, durable knowledge, Skill, then
  deterministic enforcement.

## Knowledge freshness

- Owners and regeneration paths for generated docs, schemas, catalogs, and
  lock artifacts.
- How stale or contradictory guidance is detected and retired.

## Decision governance

- Threshold, lifecycle, location, and reversal rules.

## Completion checklist

- Diff, tests, live evidence, docs, decisions, limitations, and remote proof
  when publication is requested.
