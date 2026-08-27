# Bootstrap or Revise Repository AI Discipline

## 1. Discover before writing

Inspect the repository without changing it:

- all applicable existing agent or contributor instructions, including their
  tracked/generated status, loading scope, and precedence;
- working-tree state and repository roots;
- product summary, architecture, package/module boundaries, and public surface;
- configuration, storage, security, provider, platform, and runtime ownership;
- build, test, QA, packaging, release, and deployment workflows;
- current decision records, local Skills, CI checks, and generated artifacts;
- recent representative changes, review feedback, reverted changes, flaky or
  failed checks, and repeated failures when history is available;
- dependency updates, workflow permissions, release provenance, and other
  existing supply-chain controls when the repository publishes artifacts.

Prefer current source and executable workflows over old prose. Note conflicts
instead of silently choosing one.

## 2. Produce a discipline map

Before editing, summarize:

- hard product and security invariants;
- ownership and canonical identities;
- authorization boundaries;
- evidence and uncertainty rules;
- untrusted boundaries and the typed contracts trusted after normalization;
- simplification and compatibility policy;
- instruction budget, knowledge ownership, and feedback-promotion policy;
- affected-surface validation matrix;
- decision threshold;
- stable repeated workflows worth turning into Skills;
- deterministic rules worth checking mechanically;
- missing choices that require repository-owner judgment.

Separate observed facts from proposed policy.

## 3. Select the smallest artifacts

Use `AGENTS.md` or the repository's existing instruction document as a concise
map. Keep durable, non-inferable shared truth there; link to authoritative
documents and name the decisions agents must make instead of copying the
architecture manual into always-loaded context.

Create supporting artifacts only when justified:

- nested `AGENTS.md` for genuinely different subtree rules;
- decision lifecycle and template for durable architectural choices;
- Skills for repeated multi-step workflows with stable boundaries;
- CI or scripts for deterministic checks;
- a validation matrix when affected surfaces need different evidence;
- generated knowledge or catalogs only with a named owner, regeneration path,
  and freshness check.

Avoid a large suite of empty folders, placeholder Skills, or aspirational gates.

## 4. Write decision-changing instructions

For each proposed rule, ask:

- What realistic wrong decision does this prevent?
- Is the rule a fact, invariant, default, or preference?
- Does it name the owning boundary and required evidence?
- Can it remain correct as file layout changes?
- Is it already owned elsewhere?
- Would an unfamiliar capable agent know when the rule applies?
- Would removing this rule cause a demonstrated wrong decision?
- Is this a one-off correction being promoted before recurrence or stability?
- Does the proposed abstraction have a current consumer or enforce a durable
  ownership boundary that direct code cannot express as clearly?

Prefer "provider data is read-only; viewer state belongs in X" over "be
careful with data." Prefer validation routing over a long undifferentiated list
of commands. Prefer an owning boundary fix over downstream guards and fallback
branches. If a deterministic check already enforces a rule, link to its command
or remediation rather than duplicating its implementation details in prose.

Use [assets/agents-outline.md](../assets/agents-outline.md) as an adaptive
outline, not as text to copy verbatim. Use
[assets/decision-template.md](../assets/decision-template.md) only when the
repository lacks an equivalent lifecycle.

## 5. Validate the discipline

Re-read all created or changed guidance for contradictions, stale commands,
broken paths, duplicated ownership, and accidental permission expansion.

Forward-test with realistic requests such as:

- diagnose a bug without implementing it;
- add a feature crossing a public or persistence boundary;
- simplify a duplicate subsystem with one hidden dynamic consumer;
- update a provider or schema with unavailable real data;
- commit and push a dirty worktree containing unrelated changes;
- review a change whose fixtures pass but real-target evidence is missing.
- add a helper or interface used once "for future extensibility";
- add a second guard below an already-normalized typed boundary;
- promote a single review comment into a mandatory repository-wide rule;
- change generated knowledge without its freshness mechanism.

The instructions should lead to correct scope, evidence, validation, and
handoff without prescribing unnecessary ceremony for a small local change.

Run any new mechanical governance check and the repository's documentation or
link checks. Do not claim behavioral validation from text matching alone.
For substantial instruction changes, compare at least one realistic fresh run
with the prior guidance or no guidance. Check whether the rule changes the
decision, validation, or handoff—not merely whether the agent repeats its text.

## 6. Handoff

Report:

- the discipline model and important repository-specific choices;
- files created or changed and their ownership;
- which repeated workflows became Skills and why;
- which rules became mechanical checks and why they are deterministic;
- which candidate rules or scaffolds were deliberately rejected as premature;
- forward-test scenarios and observed results;
- unresolved owner decisions and recommended next adoption step.
