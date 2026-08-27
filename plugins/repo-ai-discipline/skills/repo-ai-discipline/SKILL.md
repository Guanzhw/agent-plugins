---
name: repo-ai-discipline
description: Establish or improve repository-local engineering discipline for AI coding agents using concise evidence-based instructions, maintainability boundaries, feedback loops, validation rules, simplification practice, and bounded reusable workflows. Use when bootstrapping, auditing, or revising how AI agents should work in a code repository.
---

# Repository AI Discipline

Build a small, repository-specific operating system for AI contributors. The
result should help an unfamiliar capable agent make correct decisions from
local evidence without turning the repository into a manual for every possible
task.

AI discipline is not a prompt style. It is the combination of truth boundaries,
ownership, authority, simplification, verification, collaboration, and delivery
rules that keep repeated agent work safe and maintainable.

## Choose the mode

- **Assess** an existing repository without changing it: read
  [references/review-checklist.md](references/review-checklist.md).
- **Bootstrap or revise** repository discipline: read
  [references/bootstrap-workflow.md](references/bootstrap-workflow.md), then use
  [references/discipline-framework.md](references/discipline-framework.md) for
  the dimensions that need explicit rules.
- **Explain or design** the discipline before implementation: read
  [references/discipline-framework.md](references/discipline-framework.md) and
  produce a proposal rather than editing files.

When choosing between instructions, Skills, checks, hooks, decision records, or
generated knowledge, read
[references/practice-evidence.md](references/practice-evidence.md). It records
the primary-source community practices behind that routing without making every
repository adopt the same harness.

Assessment and planning are read-only. Do not create or modify governance files
unless the user requested implementation.

## Core rules

1. **Derive discipline from repository facts.** Inspect source, architecture,
   public contracts, runtime behavior, contribution guidance, CI, release
   workflows, decision records, and recurring failures. Do not paste a generic
   `AGENTS.md` and call the repository governed.
2. **Separate invariants from preferences.** Use firm language for data
   ownership, security, canonical identity, compatibility, and authorization.
   Present tool choices, model routing, formatting, and workflow conveniences as
   defaults unless deviation creates a concrete risk.
3. **Keep authority explicit.** Permission to inspect, diagnose, review, or plan
   does not authorize implementation, deletion, publishing, external mutation,
   credential changes, or user-level configuration changes.
4. **Make evidence and uncertainty visible.** Require agents to distinguish
   observed, recorded, derived, assumed, unavailable, and unverified claims when
   that distinction matters to the product. Missing evidence must not be
   converted into fabricated parity or silent success.
5. **Treat simplification as maintenance.** Require evidence for new
   abstractions and continued complexity. Make removal of obsolete, duplicate,
   speculative, and zero-consumer surfaces a first-class governed change—not a
   line-count quota or permission for indiscriminate deletion.
6. **Validate once at the owning boundary.** Normalize genuinely untrusted
   inputs where they enter, then trust the established typed same-process
   contract. Preserve explicit failures and missing evidence instead of adding
   redundant guards, copies, fallbacks, or impossible-state tests downstream.
7. **Keep instructions as a map.** Put only durable, non-inferable,
   decision-changing rules in always-loaded guidance. Link to owned detail and
   remove rules that no longer change observed agent behavior.
8. **Validate the real affected surface.** Define a validation matrix that
   scales from documentation checks to focused tests, full suites, real data,
   browser or process checks, packaging, and remote verification. A command
   list without routing criteria is not a validation policy.
9. **Promote feedback proportionately.** Keep one-off corrections in the task;
   update repository knowledge for repeated durable lessons; create a Skill for
   a stable multi-step workflow; add a mechanical check only for a deterministic
   invariant with an actionable failure message. Do not turn every review
   comment into permanent policy.
10. **Preserve repository and user state.** Require dirty-tree inspection,
   scoped edits, non-destructive Git behavior, secret-safe verification, and
   explicit publication authority.

## Artifact hierarchy

Prefer the smallest set that makes the discipline executable:

1. A root `AGENTS.md` or existing repository-native equivalent is a concise map
   of product invariants, boundaries, routing, validation, and deeper owners—not
   an encyclopedia.
2. Nested guidance exists only where a subtree genuinely has different rules.
3. Decision records capture cross-module, public-contract, persistence,
   security, or release choices and their evidence.
4. Repository-local Skills encode stable multi-step workflows such as review,
   pre-push, release, provider onboarding, or simplification audits.
5. Mechanical checks validate deterministic rules such as decision lifecycle,
   stale paths, generated-file drift, forbidden dependencies, or architecture
   boundaries.
6. Generated catalogs or knowledge indexes exist only when a real navigation or
   drift problem justifies them, and must have an owner plus a freshness check.

Do not duplicate the same rule across all layers. Link to the owning source.

## Required outcome

The finished discipline should answer, using repository-local facts:

- What does this product own, and what must remain read-only or external?
- Which identities, formats, APIs, and security boundaries are canonical?
- How should an agent decide whether to add, derive, preserve, simplify, or
  delete something?
- Where is untrusted input normalized, and which typed contracts should be
  trusted afterward?
- Which validation is required for each affected surface?
- How does a repeated failure become better knowledge or a deterministic check
  without accumulating one-off rules?
- When are decisions, independent review, live verification, commit, and push
  required?
- What must an agent report when work is complete or blocked?

Test the result against realistic requests. An agent should be able to act
correctly without reading obsolete prose, yet retain judgment where the
repository has not established a fact.
