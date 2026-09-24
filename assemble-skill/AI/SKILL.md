---
name: assemble-design-system
description: >
  Assemble — the McAfee design system. Two sanctioned bindings: Flutter/Pegasus (`Asm*` widgets)
  for production products, and React for prototyping in Figma Make. Shared tokens
  (`md.sys.*` / `mcafee.color.extended.*`). Use this skill whenever a task involves building,
  reviewing, specifying, or designing McAfee product UI: choosing a component, picking a
  variant or size, applying color/type/spacing/elevation/state/icon tokens, resolving a
  responsive layout, writing `Asm*` Flutter code, building a React prototype, translating a
  Figma frame to code, auditing a screen for design-system compliance, or authoring a new
  component doc. Triggers on: Assemble, ASM, `Asm*`, Pegasus, McAfee UI, alert card,
  navigation rail, peek label, guided action panel, `md.sys.color`, `md.spacing`, `AsmTokens`,
  "design system", "which component should I use", "is this on-system", and on React or
  Figma Make prototyping work against McAfee UI.
version: 1.0.0
source_of_truth: ../
targets: [claude-code, cursor, copilot, figma-make, figma-mcp, generic-agent]
---

# Assemble Design System — AI Skill

> **Role:** Turn a UI request into a correct Assemble decision, then into correct output for
> whatever target you are writing to.
> **Rule:** Never state a value you have not read in these docs. A plausible-but-wrong value
> is worse than an acknowledged gap, because the reader cannot tell the difference.
> **Source of truth:** the 34 component docs and 8 foundation docs in `../Components/` and
> `../Foundations/`. This skill is an **index and a procedure**, not a replacement for them.

---

## 0. The one-paragraph version

Assemble is a design system for **desktop applications with resizable windows**, with **two
sanctioned bindings**: **Flutter** (`Asm*`, the Pegasus repo) for McAfee production products, and
**React** for prototyping in Figma Make and similar. Both consume the same tokens; neither is the
design law. Every component doc is split at `## Flutter Usage` — everything above it is
platform-agnostic design law that applies to **both** bindings, everything below it is Flutter
binding. React's API is **undocumented** and its parity with Flutter is **not guaranteed**, so a
React prototype is never a production spec and never evidence about the system. Colors, type,
spacing, elevation, and states are **token-only** — raw hex, raw font sizes, and raw padding
numbers are defects, not shortcuts. Responsive decisions come from **available content width**,
never window width. Elevation is **three shadows**, not a scale. There are **exactly two**
breakpoint thresholds. Touch targets are **48×48** system-wide. When two components compete for a
job, the component docs' decision trees tell you which one wins — and their most valuable answer
is usually *"use a different component."*

---

## 1. When to load what (progressive disclosure)

Do not read the whole system. Load in this order and stop when you have what you need.

| Need | Read |
| --- | --- |
| Anything at all | This file, §3–§6 below |
| "Which component?" | [`component-router.md`](component-router.md) → then that component's `## Decision Tree` |
| Any color / type / spacing / shadow / icon / state value | [`token-contract.md`](token-contract.md), then the owning foundation doc |
| A layout, a resize, a "does it fit" question | `../Foundations/Breakpoints.md` **and** `../Foundations/Grid.md` — always both |
| Building or reviewing one component | That component's doc **in full**, top to bottom |
| Building a whole **screen** or feature, not one component | [`../templates/README.md`](../templates/README.md) → the matching template. Compositions only; every component still delegates to its own doc |
| Two rules disagree | [`decision-priority.md`](decision-priority.md) |
| Working out *how* to answer | [`reasoning-engine.md`](reasoning-engine.md) |
| Before you hand anything back | [`validation.md`](validation.md) |
| Working out which binding you're writing to | [`platform-adapters.md`](platform-adapters.md) — **mandatory** for anything but Flutter |
| React, or a Figma Make prototype | [`react-binding.md`](react-binding.md) — the only written record; there are no React docs |
| "Is this a known problem?" | [`known-gaps.md`](known-gaps.md) |
| Two things share a name | [`glossary.md`](glossary.md) |
| Writing a *new* component doc | `../Components/_component-doc-template.md` |
| Machine-readable index | [`manifest.json`](manifest.json) |

**Read the component doc in full.** These docs are long because the traps are in the middle.
Grepping for a variant name and stopping is the single most reliable way to get this system
wrong — the reason a variant exists is rarely next to the variant's name.

---

## 2. System inventory

**8 foundations** (own their subject; component docs delegate to them and must not restate them):

`Color` · `Typography` · `Spacing` · `Grid` · `Breakpoints` · `States` · `Elevation` · `Icons`

**34 component docs:**

Accordion · Alert Banner · Alert Card · Badges · Button · Cards · Carousel · Chat Bubble ·
Checkbox · Data Arc Chart · Data Linear Chart · Date Picker · Divider · Empty State ·
Expanded Card · Feedback · Loaders · Menu · Modal · Navigation Rail · Peek Label · Popover ·
Progress Bar · Radio · Scrollbar · Sheets · Skeleton Loader · Snackbar · Status Indicators ·
Switch · Tabs · Tags · Text Fields · Tooltip

**7 components with NO doc.** If the request needs one of these, say so — do not improvise one
from a neighbour:

`brand` · `feature banner` · **`guided action panel`** · `lists` · `quick action` ·
`toggle groups` · **`topbars`**

The two in bold are load-bearing absences: three finished docs already route to the guided
action panel, and `Navigation Rail` routes to a topbar twice. Both are named in
`../Components/checklist.md` as the highest-priority gaps.

**Two bindings, one of them undocumented.** All 34 docs cover the **Flutter** binding in
`## Flutter Usage`. The **React** binding — the prototyping library used in Figma Make — has **no
doc at all**: not its component names, not its props, not its variant coverage, not its
divergences. That is the largest single gap in the system. See
[`react-binding.md`](react-binding.md) and [`known-gaps.md`](known-gaps.md).

---

## 3. Hard constraints — never violated, never negotiated

These hold across every component, every target, every request.

1. **No raw values.** No hex/rgb/hsl. No raw font size, weight, line height, or tracking. No
   hardcoded padding, gap, radius, or border width. No hand-authored shadow. Reference a token.
2. **Semantic layer only.** UI consumes `md.sys.color.*` and `mcafee.color.extended.*`. It
   **never** touches `md.key.*`, `md.ref.palette.*`, `md.ref.brand.*`, `md.ref.type.font.*`,
   or `md.type.size.*` — those are authoring layers.
3. **48×48 minimum touch target**, system-wide, achieved with padding — never by growing the
   glyph. (`Icons` and `States` used to say 44; they were corrected. Write 48.)
4. **Focus is a visible ring** — `md.sys.color.primary`, 2px, offset 2px outside, **keyboard
   only**. Never removed, never narrowed, never recoloured to something subtler.
5. **Every interactive element expresses hover, pressed, focus, and disabled.** There is no
   partial set.
6. **Never convey meaning by colour alone.** Applies to status dots, badges, severity,
   destructive actions, chart segments — everything.
7. **Responsive decisions come from available content width**, never raw window width:
   `content = window − 16 − 60 (rail) − 16 − 386 (panel, if present)`.
8. **Exactly two structural thresholds: 500 and 980.** 1280 and 1440 are window sizes, not
   breakpoints. Never introduce a third threshold.
9. **Exactly three shadows: `subtle`, `light`, `heavy`.** No fourth, no stacking, no
   interpolation, and **no shadow at all is the most common correct answer**.
10. **Elevation is not tonal.** `surface-container-*` is not an elevation scale. To lift
    something, add a shadow — never step up a container fill.
11. **The spacing scale is a closed set of 15 steps.** If a layout seems to need an off-scale
    value, it needs a different step.
12. **The navigation rail is docked to the left edge, at every tier, without exception.** At SM
    it hides and returns as a left overlay drawer. `AsmNavigationRail.bottom` ships but is
    **forbidden** — see `Navigation Rail` open item 1.
13. **Never state an unverified value.** If a doc doesn't give you the number, you don't have
    the number. Say so.
14. **Never silently reconcile a conflict.** Where Figma and the implementation disagree,
    surface both. See [`decision-priority.md`](decision-priority.md).
15. **Two bindings, and the flow between them is one-way.** Design law → binding, never binding →
    binding. Never write `Asm*` in React or React prop names in Dart. Never derive Flutter code
    from a React prototype, and never treat React's API as evidence about the design — it is
    undocumented, unreconciled, and its parity with Flutter is not guaranteed.
    See [`react-binding.md`](react-binding.md) §1.

---

## 4. The five traps that catch everyone

Ranked by how often they land. Each is a real, documented failure in this system.

**1. Library defaults contradict the guidance.**
`AsmButton` defaults to `variant: text` and `size: large`. The documented defaults are
`filled` (for a primary action) and `medium`. A call site that omits both gets a large text
button, which is almost never wanted. **Always pass `variant` and `size` explicitly.** Treat
every `Asm*` default as untrusted until you've read that doc's parameter table — and treat React's
prop defaults as *more* untrusted, since no doc reconciles them.

**2. Figma names and code names disagree.**
Button sizes: Figma `huge`/`spacious`/`default`/`compact` → code `large`/`medium`/`small`/`xsmall`.
Figma's **`default` maps to code's `small`** — actively misleading. Never assume the two
vocabularies agree; translate through the doc's own mapping table.

**3. Routing within before routing away.**
Every decision tree asks *"is this the right component at all?"* first, and the most valuable
answer it gives is usually a different component. Most modals should have been a snackbar or an
alert banner. Most carousels should have been a list. Most scrolling regions should have been
tabs or an accordion. **Answer question one before you touch variants.**

**4. Three different things are called "badge."**
The severity chip is `Badges` (`AsmBadge`). The numeric notification badge **and** the dot-plus-
word status label both live in `Status Indicators`. If it holds a count, it is not `Badges`.
See [`glossary.md`](glossary.md).

**5. Two components that look identical mean opposite things.**
`Progress Bar` and `Data Linear Chart` are both rounded horizontal bars with coloured fill. The
progress bar has a **track**, and its unfilled remainder means *"not yet."* The linear chart has
**no track** — its segments always fill the bar and the split is the message. Same for
`Data Arc Chart` vs a circular progress indicator. A user cannot tell them apart by looking, so
never substitute one for the other.

---

## 5. Answer shape

Whatever the target, a correct answer carries these four things. Omitting any of them is an
incomplete answer, not a concise one.

1. **The routing decision, with its reason.** "Alert banner, not snackbar — the condition
   persists until the user updates the app." Cite the doc.
2. **The variant/size/mode choice, from the doc's own criteria** — not from taste. If the doc
   says the choice is decided by the surface behind it (`Badges` `type`) or by the available
   content width (`Alert Card` layout), decide it that way and say which input you used.
3. **Every value as a token name.** `md.spacing.400`, not 16 — unless the reader specifically
   asked for the resolved value, in which case give both.
4. **Open items you touched, and anything you could not verify.** If a value isn't in the docs,
   say "not specified in Assemble" rather than filling it in. See [`known-gaps.md`](known-gaps.md).

Then run [`validation.md`](validation.md) before you hand it over.

---

## 6. Refusals and escalations

Say so plainly, and stop, when:

- **The component has no doc** (§2's list of 7). Name the gap, offer the nearest documented
  component and what it can't do, and do not synthesize a spec.
- **The component has no implementation.** `Popover` ships **no** widget — the nearest shipped
  placement logic is the private popup inside `menu.dart`. Don't write `AsmPopover`.
- **The component doesn't exist at all.** There is **no reusable carousel** in this system, only
  the dot indicator (`AsmCarouselIndicator` / `AsmDotIndicator`). The one working carousel is
  private to `Alert Card`.
- **The target is not Flutter.** Stop and read [`platform-adapters.md`](platform-adapters.md)
  first. Three cases, and they are not the same: **React** (Figma Make and similar) is a
  sanctioned binding, but undocumented — read [`react-binding.md`](react-binding.md) and carry
  its fidelity notice. **Figma** is the design source, at precedence tier 10. **Everything else**
  — hand-written CSS, Vue, SwiftUI, a bespoke web component — is a **translation** and must be
  labeled as one.
- **You are being asked to port a prototype into production.** The flow is one-way: design law →
  binding. Route the *requirement* through the component docs; never derive Flutter code from a
  React prototype, and never cite React as evidence about the design.
- **The docs conflict and the conflict is load-bearing.** Follow
  [`decision-priority.md`](decision-priority.md), state which side you took, and cite the open
  item.

---

## 7. Extending the system

To add or change a design-system doc, follow `../Components/_component-doc-template.md`
exactly — the section order, the four-line banner, the platform-agnostic/Flutter split, and the
delegate-to-foundations rule. The non-skippable step is **reconciliation**: read the Dart source
in full, pull the Figma component set, and record every disagreement in `Open Items`. A doc that
describes only the implementation is a code comment; a doc that describes only Figma is a
redlines file. The value is in the reconciliation.

New docs must also keep the cross-link pairs reciprocal (`../Components/checklist.md` lists
them) — a decision tree that never names an alternative cannot be used to make a decision.

**One template amendment is outstanding.** The template currently forbids mentioning web, HTML,
CSS, React, or web components anywhere — written when Flutter was the only binding, and now the
reason a real sanctioned implementation has no home in the docs. It should gain a
`## React Usage` section alongside `## Flutter Usage`, with the prohibition narrowed to the
*design-law* sections only. See [`react-binding.md`](react-binding.md) §8.
