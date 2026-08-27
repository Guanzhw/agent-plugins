# Practice Evidence for AI-Maintained Repositories

Read this only when choosing or revising repository-discipline mechanisms. It
records transferable practices from primary sources; it is not a checklist that
every repository must adopt.

## Instruction and knowledge design

- OpenAI's agent-first repository treats a short `AGENTS.md` as a map to an
  owned, versioned knowledge base. It mechanically checks documentation
  structure, links, and freshness; it enforces architectural invariants while
  leaving implementation choices local. Its central feedback question is what
  capability, documentation, or guardrail was missing when an agent failed.
  Source: [Harness engineering](https://openai.com/index/harness-engineering/).
- Anthropic recommends keeping always-loaded instructions concise, retaining
  only information whose removal would cause mistakes, moving conditional
  procedures into Skills, and using hooks for zero-exception deterministic
  actions. It recommends evaluating instruction changes through observable
  behavior rather than file presence.
  Source: [Claude Code best practices](https://code.claude.com/docs/en/best-practices).
- The cross-agent `AGENTS.md` convention supports nested instructions whose
  closest scope wins. Use nesting for real subtree differences, not to copy the
  same repository rules repeatedly.
  Source: [AGENTS.md](https://agents.md/).

## Stable workflow and decision history

- DeepSeek Harness keeps development rationale in linked Agent Notes and gives
  generated contracts and worktree-local integrations explicit owners and
  regeneration paths. This keeps operational detail discoverable without
  placing the whole build model in the root instruction file.
  Source: [DeepSeek Harness development guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/development.md).
- GitHub Spec Kit separates governing principles, requirements, implementation
  planning, and tasks. Adopt that separation for durable or cross-boundary
  changes; do not impose the entire workflow on small local edits.
  Source: [GitHub Spec Kit](https://github.com/github/spec-kit).

## Directness, abstraction, and verification

- The open-source Codex repository contains concrete anti-complexity rules such
  as avoiding helpers referenced only once, minimizing public API surface, and
  routing tests by the affected crate. It also demonstrates the complementary
  case: split an overloaded owner when continued growth is itself observed
  evidence, rather than creating generic extension points in advance.
  Source: [openai/codex AGENTS.md](https://github.com/openai/codex/blob/main/AGENTS.md).
- OpenAI and Anthropic both close the agent loop with executable feedback:
  focused tests, builds, screenshots, logs, metrics, and real application
  behavior. Instructions define what matters; runnable evidence tells the agent
  whether the work succeeded.

## Mechanical maintenance and security

- OpenSSF Scorecard exposes individual, machine-checkable repository behaviors
  such as dependency-update automation, CI tests, review, pinned dependencies,
  workflow permissions, packaging, and release practices. Its own documentation
  warns that aggregate scores are heuristic and not a universal requirement.
  Select applicable checks and retain maintainer judgment.
  Source: [OpenSSF Scorecard](https://github.com/ossf/scorecard).

## Adoption test

Before importing any practice, require all of the following:

1. A current repository failure, repeated workflow, durable boundary, or
   maintenance risk that the mechanism addresses.
2. A named owner and an observable success or freshness signal.
3. Less expected drift or repeated explanation than the mechanism itself adds.
4. A retirement or simplification path when the consumer disappears.
