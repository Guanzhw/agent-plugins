# Review Existing Repository AI Discipline

Assess usefulness, truthfulness, and executability rather than document length.

## Findings to look for

- Rules that are generic encouragement and do not change a decision.
- Commands, paths, versions, package names, or architecture descriptions that
  disagree with current source or CI.
- Instruction files treated as established repository policy without checking
  whether they are tracked, generated, ignored, locally overridden, or actually
  loaded for the paths under review.
- Contradictory instructions across root, nested, contributor, Skill, and
  decision documents.
- An always-loaded instruction file acting as an architecture manual instead of
  a concise map to owned knowledge.
- One-off review comments accumulated as permanent rules without demonstrated
  recurrence or behavioral effect.
- Product invariants without an owning module or validation boundary.
- Public, storage, provider, platform, or security contracts treated as normal
  internal refactors.
- Review, diagnosis, or planning language that accidentally authorizes edits,
  deletion, publication, or external mutation.
- Missing dirty-work, secret, destructive-action, or provider-data boundaries.
- Validation commands without affected-surface routing or real-target criteria.
- Fixtures presented as sufficient for dynamic schemas, browser behavior,
  platforms, subprocesses, or providers.
- Defensive validation, guards, copies, sanitization, or fallback behavior
  repeated below an already-normalized typed boundary.
- Explicit failures or unknown states converted into silent success.
- New abstractions and compatibility paths without current consumers.
- Single-use helpers, generic extension points, option bags, or adapters added
  only for hypothetical future variation.
- No first-class simplification or retirement discipline.
- Every design choice requiring a decision record, or no durable choices ever
  requiring one.
- Repeated stable workflows copied into prose instead of bounded Skills.
- Judgment-heavy policies enforced through brittle regex or line-count gates.
- Generated knowledge, schemas, catalogs, or lock artifacts without an owner,
  regeneration command, or freshness check.
- Prose used for a deterministic security or architecture boundary that the
  repository could actually enforce, or a mechanical gate used for a decision
  that still requires judgment.
- Aggregate quality or security scores treated as universal requirements
  instead of inspecting the applicable underlying behaviors.
- Model or tool routing that is unavailable, stale, or mandatory for tiny work.
- Completion rules that say "tests pass" but do not require diff, live, release,
  or remote evidence when those surfaces are affected.

## Review output

Lead with whether the repository currently has an effective discipline, a
partially executable guide, or mostly prose.

For each actionable finding provide:

- exact file and narrow location;
- the realistic agent decision it can cause;
- repository evidence that contradicts or is missing from the rule;
- the smallest correction and its owning artifact.

Then provide a prioritized adoption plan:

1. safety, authority, and product-truth boundaries;
2. ownership and canonical contracts;
3. validation and completion evidence;
4. simplification and decision lifecycle;
5. reusable Skills and deterministic governance checks.

Also identify what should be removed or deliberately left unimplemented. A
discipline review that only adds rules and gates is incomplete.

Do not implement the plan unless requested.
