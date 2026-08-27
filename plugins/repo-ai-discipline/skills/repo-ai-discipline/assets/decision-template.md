---
title: "<decision>"
status: proposed
date: YYYY-MM-DD
---

# <Decision>

## Problem and evidence

State the observed problem, current behavior, sources, and uncertainty.

## Ownership and invariants

Name the authoritative boundary and behavior that must remain true.

## Options

List viable choices and their complexity, compatibility, and operational costs.
For an abstraction or extension point, name its current consumers and the
direct implementation it would replace. For a new gate, explain why the rule is
deterministic rather than judgment-heavy.

## Decision

Choose the smallest sufficient mechanism and explain why.

## Consequences

Record public, persistence, security, migration, provider, platform, and
maintenance effects.

## Knowledge and enforcement

State where the durable fact is owned, whether any generated artifact needs a
freshness check, and why the decision belongs in prose, a Skill, or a mechanical
check. Do not promote task-local feedback without evidence that it will recur.

## Implementation and verification

List factual paths and observed validation. Update this section when the
decision becomes implemented.

## Reversal

Describe the evidence that would justify a new superseding decision.
