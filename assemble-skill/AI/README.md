# Assemble Design System — AI Skill Package

A portable skill package that lets an AI agent use the Assemble design system correctly: route to the
right component, apply the right tokens, resolve layout the way the system actually resolves it, and
report what it couldn't verify.

**This folder is an index and a procedure. It is not a replacement for the docs.** The 34 component
docs in `../Components/` and the 8 foundation docs in `../Foundations/` remain the source of truth, and
they win over anything restated here.

Whole-screen **compositions** live in [`../templates/`](../templates/README.md) — region geometry,
section order, and slot assignment for a feature, with every component delegated to its own doc.

---

## What's in here

### The core five

| File | What it does |
| --- | --- |
| **[`SKILL.md`](SKILL.md)** | The entry point. YAML frontmatter for skill discovery, the progressive-disclosure load table, the 15 hard constraints, the five traps, the required answer shape, and when to refuse. **Start here.** |
| **[`manifest.json`](manifest.json)** | Machine-readable index. Every foundation and component with its doc path, widget names, open-item count, and decided-by rule; the two sanctioned bindings and the one-way flow rule; the closed scales; the undocumented gaps; the precedence ladder; the load order. For tooling and for agents that prefer structure to prose. |
| **[`decision-priority.md`](decision-priority.md)** | The 12-tier precedence ladder. What wins when two sources disagree, the accessibility floor that overrides everything, why the two bindings are not peers, the three live component-vs-foundation divergences, and nine worked resolutions. |
| **[`reasoning-engine.md`](reasoning-engine.md)** | The procedure, phases 0–8: frame (and establish the binding) → extract the job → route away → choose within → resolve foundations → compose → constrain → bind to target → validate. Phases 1–6 are identical whatever you're writing to. |
| **[`validation.md`](validation.md)** | 133 gates in seven groups (tokens, accessibility, layout, component integrity, Flutter binding, output hygiene, React binding), each marked BLOCKER / DEFECT / REVIEW, plus a runnable regex sweep in Dart and web variants and the `ASSEMBLE VALIDATION` self-report block. G5 and G7 are mutually exclusive. |

### The reference layer

| File | What it does |
| --- | --- |
| **[`component-router.md`](component-router.md)** | Job → candidate component, synthesized from all 34 decision trees. The six discriminators that settle most routing, 34 confusion pairs with their single deciding question, the routes that correctly leave the library, and the components that aren't what their names suggest. |
| **[`token-contract.md`](token-contract.md)** | Every closed scale in one place: the three token layers and which are forbidden in UI, the 15 spacing steps, radius and border scales, the type scale, state opacities, the three shadows, icon sizes — and the layout constants that aren't tokenized. |
| **[`anti-patterns.md`](anti-patterns.md)** | ~100 documented failures grouped by cause (token bypass, accessibility, routing, variant/size, layout, elevation, composition, content, process) rather than by component. |
| **[`known-gaps.md`](known-gaps.md)** | The 7 undocumented components, the 3 with no implementation, the standing system-wide gaps, the ~600 open items by doc, the live conflicts, and what has no answer at all. |
| **[`glossary.md`](glossary.md)** | Every word that means more than one thing — starting with the three different things called "badge" — plus the three vocabularies (Figma, Flutter, React) and their drift, and a list of `Asm*` widgets that do and don't exist. |
| **[`platform-adapters.md`](platform-adapters.md)** | **Mandatory for anything but Flutter.** The target router, the three-layer model (design law / Flutter binding / React binding), the token-mapping protocol, what travels and what doesn't, and the three label types. |
| **[`react-binding.md`](react-binding.md)** | **The only written record of the React binding.** What React is for, the one-way flow rule, what carries across vs what you must verify from the source, why tokens are the easy part, why accessibility doesn't relax for a prototype, and the fidelity notice. |

### Tool adapters

| File | Target |
| --- | --- |
| **[`adapters/claude-code.md`](adapters/claude-code.md)** | Claude Code — install, triggering, a `CLAUDE.md` block, an optional pre-commit token sweep |
| **[`adapters/cursor.mdc`](adapters/cursor.mdc)** | Cursor project rule, with frontmatter and globs |
| **[`adapters/copilot-instructions.md`](adapters/copilot-instructions.md)** | GitHub Copilot — copy to `.github/copilot-instructions.md` |
| **[`adapters/AGENTS.md`](adapters/AGENTS.md)** | Any agent following the `AGENTS.md` convention. Self-contained. |
| **[`adapters/figma-make.md`](adapters/figma-make.md)** | Figma Make, Figma design authoring, and the Figma MCP tools |

---

## Install matrix

| Tool | Where it goes | Notes |
| --- | --- | --- |
| **Claude Code** | `~/.claude/skills/assemble-design-system` → symlink to this `AI/` folder | Native. Reads `SKILL.md` frontmatter and loads the rest on demand. See [`adapters/claude-code.md`](adapters/claude-code.md). |
| **Cursor** | `.cursor/rules/assemble.mdc` ← copy of `adapters/cursor.mdc` | Frontmatter sets globs and `alwaysApply: false`. |
| **GitHub Copilot** | `.github/copilot-instructions.md` ← copy of `adapters/copilot-instructions.md` | Loaded automatically in VS Code, Visual Studio, JetBrains, and github.com. |
| **Codex / Jules / Devin / Zed / Amp / Aider** | `AGENTS.md` in the repo root ← copy or append `adapters/AGENTS.md` | Self-contained; assumes the agent may not be able to open the docs. |
| **Figma Make** | Paste `adapters/figma-make.md` into the project context, plus `react-binding.md` | Output uses the **Assemble React library** — a sanctioned binding, so **not** a translation. It still carries a **fidelity notice**: not a production spec. |
| **Anything else** | Point it at `SKILL.md` and let it follow the load table | |

**Symlink rather than copy** where you can. `SKILL.md` reaches the source docs through relative paths
(`../Components/…`, `../Foundations/…`), so the skill folder must sit inside the vault. A copy drifts
the moment the vault changes.

---

## The one thing to know before using this

**Assemble has two sanctioned bindings, and they are not peers.**

| | Flutter | React |
| --- | --- | --- |
| Used for | **McAfee production products** | **prototyping** (Figma Make and similar) |
| Names | widgets prefixed `Asm*`, Pegasus repo | a different prefix or plain names — **never `Asm*`** |
| Tokens | `assemble_flutter_tokens` | the **web build** of the same token source |
| Documented | yes, in all 34 component docs | **no** — nothing records its names, props, or coverage |
| Reconciled against Figma | yes, ~600 numbered open items | no |
| Parity with the other | — | **not guaranteed**; a looser approximation |

It targets desktop applications with resizable windows; there is **no mobile build** (SM is a narrow
desktop window, not a phone).

The package models this as a **three-layer split**:

```
Layer A    everything above `## Flutter Usage` in any component doc
           routing, meaning, anatomy, content rules, accessibility, anti-patterns
           → DESIGN LAW. Applies in full to BOTH bindings and to every other target.
             This is where all the authority lives.

Layer B    `## Flutter Usage` and below — widget names, enums, parameters, snippets
(Flutter)  → the Flutter binding. Authoritative about Flutter, and about nothing else.

Layer B    the React source itself — undocumented, recorded in no doc anywhere
(React)    → the React binding. Authoritative about React, and about nothing else.
             Verify names, props, variants, and defaults by reading it. Never derive them.
```

So a React target applies **all** of Layer A, binds to the **web token build** (same semantic names —
no mapping to declare, no approximation to make), verifies every API detail from the React source, and
carries a **fidelity notice**: *React prototype — sanctioned binding, not a production spec*. A target
that is *neither* binding maps token names through a **declared** mapping, invents no `Asm*` API,
borrows no React names, ports no snippet, and is **labelled a translation — not sanctioned Assemble**.
BLOCKER gates in `validation.md` enforce both labels.

**The flow is one-way: design law → binding, never binding → binding.** Never derive Flutter code from
an approved React prototype, and never cite a React prop as evidence that Assemble has that modifier.
When a prototype gets approved and the production screen is next, route the *requirement* back through
the component docs.

This matters because the failure mode is quiet in both directions: a Figma Make component that looks
like an Assemble implementation gets cited back as precedent, and a prototype's invented prop gets
built into a shipping product.

**The largest known gap in the system is that the React binding is entirely undocumented.** The
component-doc template forbids mentioning web, HTML, CSS, or React — correct when Flutter was the only
binding, and now the reason a real sanctioned implementation has no home in the docs. See
[`known-gaps.md`](known-gaps.md) §3.0.

---

## What the skill enforces

The parts of Assemble an agent gets wrong without being told:

- **Route away before routing within.** Every decision tree's first question is *"is this the right
  component at all?"* — and its most valuable answer is usually a different component, or none.
- **Library defaults are untrusted.** `AsmButton` ships `variant: text, size: large`; the guidance is
  `filled` / `medium`. Shipped defaults sit at precedence tier **11** for this reason — and React's
  prop defaults are worse, because no doc reconciles them at all.
- **Look-alikes that mean opposite things.** `Progress Bar` has a track and its remainder means "not
  yet"; `Data Linear Chart` has none and the split *is* the message. Users can't tell them apart.
- **Layout comes from the content region**, `window − 16 − 60 − 16 − 386`, never window width. There
  are exactly two thresholds, and 1280 vs 1440 produce identical content.
- **Elevation is three shadows, not a scale** — and no shadow is the most common right answer.
- **Never state an unverified value.** ~600 numbered open items exist; citing one beats filling it. In
  React this extends to the API itself: a component name, prop name, or variant you didn't read in the
  source is unverified, and deriving one from Flutter is a BLOCKER.

---

## Maintenance

**This package restates things.** That is a deliberate trade — an agent shouldn't have to open eight
foundation docs to know the spacing scale is closed. The cost is drift, so:

- The **docs win.** Anything in `AI/` that contradicts `../Components/` or `../Foundations/` is a bug
  in `AI/`.
- The values most likely to drift are the closed scales in `token-contract.md` and `manifest.json`,
  and the open-item counts in `known-gaps.md` and `manifest.json`.
- When a component doc changes, check `component-router.md` (did a decision tree's routing change?),
  `anti-patterns.md`, and `manifest.json`.
- `react-binding.md` is the only record of the React binding, so it drifts fastest and silently —
  nothing in the repo contradicts it when it goes stale. Re-check it whenever the React library
  changes, and prefer amending the component-doc template (`known-gaps.md` §3.0) over growing this
  file, so the record eventually lives beside the design law rather than beside the skill.
- When one of the seven undocumented components gets a doc, update `SKILL.md` §2, `manifest.json`
  `undocumented_components`, `known-gaps.md` §1, and `component-router.md` §5. **Guided action panel**
  and **topbars** are next by the checklist's own priority.
- Adding a doc? Follow `../Components/_component-doc-template.md` exactly. The non-skippable step is
  **reconciliation** — read the Dart source in full, pull the Figma component set, and log every
  disagreement as a numbered open item. A doc that describes only the implementation is a code
  comment; a doc that describes only Figma is a redlines file. The value is in the reconciliation,
  which is why the docs with the most open items are the most trustworthy ones.
