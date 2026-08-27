# AI Discipline Framework

Use only the dimensions relevant to the repository. Each rule should name the
evidence or failure it prevents; remove generic advice that would not change an
agent's decision.

## 1. Product truth and epistemic discipline

Define the repository's source of truth and the vocabulary for claim fidelity.

Ask:

- Which data is recorded, derived, cached, generated, imported, or external?
- What must remain unknown when evidence is absent?
- Which diagnostics must be explicit instead of silently falling back?
- When are fixtures sufficient, and when is real data required?
- Which upstream source, version, schema, or compatibility snapshot owns truth?

Typical rule: preserve provenance and unsupported states; never manufacture
facts merely to fill a UI, graph, report, or capability table.

## 2. Repository knowledge and feedback

Treat repository-local, versioned artifacts as the knowledge available to a
future agent. Keep the always-loaded instruction file small and route to deeper
owners progressively.

Ask:

- Which facts are non-inferable and needed in most tasks?
- Which details belong in architecture, product, reliability, security, or
  workflow documents read only when relevant?
- Who owns each generated catalog, and what proves it is fresh?
- Which recurring review comment, bug, or failed agent run justifies a durable
  lesson?
- Can an agent execute a verification loop without a human copying logs,
  screenshots, commands, or hidden context into the conversation?

Use a promotion ladder: task-local correction -> repository knowledge for a
repeated durable lesson -> Skill for a stable procedure -> script, structural
test, hook, or CI gate for a deterministic invariant. Skip levels when a hard
security or data-integrity boundary already demands mechanical enforcement.
Prune or demote guidance when it stops changing behavior.

## 3. Ownership and architecture

Name canonical owners rather than listing every file.

Ask:

- Which module owns provider, domain, configuration, schema, rendering, or
  execution behavior?
- Which shared code must remain schema-neutral?
- What is the canonical identity across URLs, storage, APIs, and exports?
- Where must validation occur before a typed in-process contract is trusted?
- Which central branches indicate missing capability or ownership design?

Rules should prevent duplicate truth, provider or platform leakage, and
defensive checks scattered below an already-normalized boundary.

Validate and normalize genuinely untrusted data once at its owner. Below that
boundary, trust the typed contract unless a demonstrated mutation or concurrency
path invalidates it. Preserve an explicit error or unknown state rather than
adding silent fallback behavior. When a rule is unnecessary, remove it instead
of surrounding it with another prohibition.

## 4. Scope, authority, and safety

Define what common request verbs authorize.

Distinguish:

- answer, inspect, review, and diagnose;
- plan and propose;
- implement and delete;
- commit, push, publish, deploy, or mutate external systems;
- change credentials, user configuration, provider data, or persistent state.

Record destructive-action boundaries, secret handling, dirty-tree preservation,
and the exact systems the repository is allowed to mutate. Avoid rules that
grant broad authority merely because a task says "finish" or "fix it."

## 5. Simplification discipline

Treat repository complexity as a maintained asset and liability.

Establish that:

- new abstractions require real consumers;
- a helper used once remains direct unless it names a durable domain boundary,
  removes proven duplication, or prevents growth in an already overloaded
  owner;
- a second consumer is evidence to inspect, not an automatic extraction rule;
- generic extension points, option bags, adapters, and compatibility branches
  require a named current variation or consumer;
- compatibility layers require a named current compatibility target;
- tests and historical investment do not give obsolete code permanent rights;
- feature completion includes checking whether the replaced path can be
  removed;
- simplification removes complete vertical slices: implementation, exports,
  flags, dependencies, tests, fixtures, docs, and decision residue;
- public, persistence, security, dynamic, and downstream consumers must be
  checked before deletion;
- net deletion is supporting evidence, never a quota.

Repositories with non-trivial simplifications should recognize
`simplification` as a decision/change category beside feature and bug fix.

## 6. Validation discipline

Create an affected-surface matrix rather than one universal command.

Possible surfaces include:

- documentation and examples;
- types, configuration, and helpers;
- parser, schema, provider, or persistence behavior;
- API, server, index, or state mutation;
- UI, browser interaction, accessibility, or narrow viewport;
- subprocess, platform, security, or permission boundaries;
- packaging, installation, release, and remote publication;
- cross-module refactors and simplifications.

For each, specify focused checks, full checks, real-target evidence, negative or
unavailable coverage, logs to inspect, and completion evidence. Commands must
match the actual repository and declared minimum runtime.

Give the agent a readable pass/fail signal and a bounded inner loop. Use prose
for judgment and mechanical checks for stable invariants. A custom check should
identify the violated owner and a concrete remediation path. Do not add a gate
because it is fashionable, or use an aggregate quality/security score as a
substitute for deciding which individual checks apply.

For distributed software, inspect the applicable concrete supply-chain
behaviors: locked dependencies, automated update visibility, least-privilege
workflow tokens, protected integration branches, CI tests, license policy,
artifact provenance, and published-runtime smoke tests. Adopt only the checks
the repository can own and verify.

## 7. Decision governance

Require a decision record when a change affects a durable boundary, not for
every local edit.

A lightweight lifecycle can use:

```text
.agents/decisions/
  proposed/
  implemented/
  rejected/
```

Useful decision content:

- problem and observed evidence;
- ownership and invariant;
- options and why the chosen one is smallest sufficient;
- public, storage, security, or compatibility consequences;
- implementation paths and verification;
- supersession or reversal rules.

Keep records factual after implementation. A reversal is a new decision, not a
silent rewrite of history.

## 8. Collaboration and specialist routing

Add routing only when the repository benefits from it.

Define:

- when independent implementation or review materially helps;
- which tasks require live platform, browser, provider, or security evidence;
- how helper output is treated as advisory and verified centrally;
- who retains final judgment and diff ownership;
- when parallelism is inappropriate because tasks overlap.

Add routing only where it improves repository work. Avoid elaborate delegation
rules for tiny tasks.

## 9. Delivery and completion

Make "done" observable.

Typical completion evidence includes:

- intended files only and unrelated work preserved;
- focused and required full validation results;
- real-target or negative-path evidence where applicable;
- diff and whitespace checks;
- documentation and decisions synchronized;
- explicit limitations or skipped verification;
- when publication was requested, remote identity, commit alignment, and zero
  divergence rather than trust in command output alone.

Completion discipline must not imply authority to publish when the user only
requested implementation or review.
