# Glossary

> Role: Disambiguation. Every word in Assemble that means more than one thing, and every place the
> Figma vocabulary and the code vocabulary disagree.
> Rule: **Assume the vocabularies disagree until a table proves otherwise.** A name is not a
> mapping.
> Scope: Every target. **Three vocabularies are in play** — Figma names, Flutter `Asm*` names, and
> React names (a different prefix or plain names). §2.
> Source: the 34 component docs, 8 foundations, and `../Components/checklist.md`.

---

## 1. The collisions

### "badge" — three different things

The highest-traffic ambiguity in the system.

| What it is | Where it's documented | Widget | Test |
| --- | --- | --- | --- |
| A **severity chip** — a word like "CRITICAL RISK" | `Badges` | `AsmBadge` | It says *how bad*. |
| A **numeric notification badge** — a count on an icon or a nav item | `Status Indicators` | — | It holds a **count**. |
| A **status label** — a dot plus a word ("Protected", "Online") | `Status Indicators` | `AsmStatusIndicator` | It reports a **live condition**. |

**The rule: if it holds a count, it is not `Badges`.** And a `Badges` `type` is chosen by the
**surface behind it**, never by how much emphasis you want — `primary`'s near-white fill is
invisible on a light surface.

`Badges` also carries a `stat status` form for a metric-as-chip ("0042 COUNT"), which is still
`Badges`, not a notification badge.

### "card" — a substrate and six components

`Cards` is a **substrate**: no title, no interaction, no state, no meaning. Six components are built
on it, and each owns its own meaning:

`Alert Card` · `Expanded Card` · list feature row · list feature card · floating card · strip card

(The two list forms have **no doc** — see [`known-gaps.md`](known-gaps.md).)

Route **down** to `Cards` for the surface; never restate its variants in a doc built on it. And if
the content's shape is already named by the system, use the named component — `Cards` is for
groupings the system hasn't named.

### "chart" vs "progress"

Same shape, opposite meanings.

| | Has a track? | The unfilled part means | Total slot |
| --- | --- | --- | --- |
| `Progress Bar` | **yes** | "not yet" | — |
| `Data Linear Chart` | **no** | nothing — the bands always fill | no |
| `Data Arc Chart` | **no** | nothing | **yes**, a centre to print it in |

`Data Arc Chart` is **not** a circular progress indicator. A user cannot tell these apart by
looking, which is why substitution is forbidden rather than discouraged.

### "loader" — three unrelated things in one doc

| Form | Determinate? | Use |
| --- | --- | --- |
| spinner | no | generic wait (`bar` inline, `halfTrack` owning the screen) |
| AI loader | no | an AI/agent action in flight |
| brand loader | **yes** | a branded determinate moment owning the screen or card |

All in `Loaders`. Only the brand loader knows a fraction.

### "sheet" — bottom and side

Both in `Sheets`. The side sheet is the **386px panel** that appears in the content-region formula.
The choice between them is *"must the main UI stay visible **and usable**?"* — never screen size and
never content length.

### "rail" / "drawer" / "nav"

`Navigation Rail` covers **two Dart families**:

- `AsmNavigationRail` — the persistent 60px rail, MD and up
- `AsmNavDrawer` — the SM overlay drawer form

There is **deliberately no separate "nav drawer" doc.** `AsmNavigationRail.bottom` ships and is
**forbidden** (`Navigation Rail` open item 1).

### "tooltip" / "peek label" / "popover"

| | Contains focusable content? | Says |
| --- | --- | --- |
| `Tooltip` | **never** | something *about* the thing |
| `Peek Label` | never | the thing's **name** (a collapsed rail destination) |
| `Popover` | **yes** — that's the discriminator | anything |

`Popover` ships **no implementation.**

### "guided action panel" vs "Guided Journey panel"

**Two names for one thing, unresolved.** The finished docs (`Alert Card`, `Peek Label`, `Cards`) say
**guided action panel**; `../Components/drafts/Alert Card.md` says **Guided Journey panel**.
`Alert Card` open item 23 flags that the two must be reconciled.

Neither has a doc. Use the finished-doc name, and flag the conflict when it comes up.

### "text field" — two widgets

`Text Fields` covers `AsmTextField` **and** `AsmTextFormField`. `filled` vs `outlined` is decided by
whether a four-sided stroke competes with a busy or coloured surface — and then **all fields on that
surface match**. It is never a per-field choice.

### "date picker" — a family

Not one widget: a **typed field**, a **month grid**, and **month/year lists**. The typed field must
always be available — a grid-only picker for a date the user already knows is an anti-pattern.

### "carousel"

**There is no carousel component.** `Carousel` documents `AsmCarouselIndicator` /
`AsmDotIndicator` — decorative dots, not focusable, not tappable. The one working carousel is
**private to `Alert Card`** and does not use that indicator.

### "tag" vs "badge" vs "status"

| Question | Answer |
| --- | --- |
| What **kind** is it? (category, name, attribute) | `Tags` |
| How **bad** is it? (severity in a word) | `Badges` |
| What **condition** is it in right now? | `Status Indicators` |
| **How many** need attention? | `Status Indicators` — notification badge |

Tag **bodies are never pressable**. Only the `filter` variant's × is interactive.

### "elevation"

Means **shadow**, not a numeric level and not a tonal step. Three shadows, all zero-offset.
`md.sys.color.surface-container-*` is a set of **container fills for tertiary UI** — not an
elevation scale, and stepping it up raises nothing.

### "state" vs "selected"

**Separate axes.** States are hover / focus / pressed / dragged / disabled (enabled = the absence of
a layer). **Selected** is not a state — a selected element still expresses hover, focus, and
pressed.

### "default"

Means three different things. Always say which.

| Sense | Meaning |
| --- | --- |
| Figma's `default` **button size** | maps to code's **`small`** |
| The **Default tier** | 1280–1439 window width |
| A **binding's default parameter/prop value** | precedence tier **11** — actively distrusted, in both Flutter and React |

### "label"

Three distinct string slots, never interchangeable:

| Slot | Spoken? | Job |
| --- | --- | --- |
| visible **label** | yes | what the user reads |
| **semantic label** | yes | **expands** a too-terse label — never says something *different* |
| **automation identifier** | **no** | kebab-case, derived from purpose, **required** and asserted non-empty |

Also: `label` is a **typescale style** (`label.large/medium/small` and `label.mono.*`) for naming
controls. Unrelated to the above.

### "small" / "medium" / "large"

Not comparable across components. `Button` `small` is 52px tall; `Menu` `compact` is 40; the
typescale's `label.small` is 11px type. Always qualify: *which component's* small.

### "content"

| Sense | Meaning |
| --- | --- |
| the **content region** | `window − 16 − 60 − 16 − 386 (panel, if present)` — the layout input |
| a doc's `## Content` section | copy law: labels, empty-state wording, truncation rules |
| a component's `expandedContent` | a Flutter parameter |

### "SM"

A **narrow desktop window**, 500–979px. **Not a phone.** Assemble has no mobile build.

---

## 2. The three vocabularies

Assemble names things in **three** places, and no two are guaranteed to agree:

| Vocabulary | Style | Authority | Recorded where |
| --- | --- | --- | --- |
| **Figma** | human-readable, spaced, sometimes title-case | tier 10 — redlines and geometry | the Figma file, plus each doc's mapping table |
| **Flutter `Asm*`** | `AsmThing`, `lowerCamelCase` enum values | tier 8 — what you type in Flutter | `## Flutter Usage` in each doc |
| **React** | **a different prefix or plain names** — never `Asm*` | tier 9 — what you type in React | **nowhere.** Read the React source |

**Never use one vocabulary's name in another's output.** No `<AsmButton>` in React, no React prop
name in Dart, no Figma variant name as a code identifier. Translate through the doc's own mapping
table where one exists — and where one doesn't (React), **verify from the source**.

There is no React↔Flutter name mapping anywhere in these docs, because no reconciliation pass has
been run on the React binding. That is a gap, not an omission from this file — see
[`known-gaps.md`](known-gaps.md) §3.0.

### Button sizes — the documented Figma↔Flutter case, and the trap

| Figma | Code | Height |
| --- | --- | --- |
| `huge` | `large` | 70 |
| `spacious` | `medium` | 60 |
| **`default`** | **`small`** | 52 |
| `compact` | `xsmall` | 48 |

Figma's **`default` maps to code's `small`** — and the *documented* default size is `medium`. Three
different meanings of one word in one table. Meanwhile `AsmButton`'s shipped default is `large`.

Nothing records whether React uses `huge`/`spacious`/`default`/`compact`, Flutter's
`large`/`medium`/`small`/`xsmall`, or a third set — or whether it has four sizes at all. Verify from
the source.

### General expectations

| | Figma | Code (either binding) |
| --- | --- | --- |
| Naming style | human-readable, spaced, sometimes title-case | `lowerCamelCase` enum values / string unions |
| Variant sets | may collapse several axes into one property | separate parameters or props |
| Focus states | **rarely drawn** | must exist |
| Authority | tier 10 — redlines and geometry | tier 8 (Flutter) / tier 9 (React) — what you type |

A missing focus variant in Figma is a **Figma gap**, never permission to skip focus.

Where Figma and the implementation disagree: **document both and flag the conflict.** That's the
authoring rule and the reading rule. See [`decision-priority.md`](decision-priority.md) §3.

---

## 3. Flutter widget names that exist

**This section is Flutter vocabulary only.** Every name below is verified in the docs, and none of it
is valid in React — React uses a different prefix or plain names, and nothing records them. Anything
not on this list should be checked before you type it: autocomplete will invent `Asm*` names that
sound right, and it will do it in a `.tsx` file just as readily as in a `.dart` one.

```
AsmButton              AsmIconButton          AsmIconContainer  (60×60 box, 24px glyph)
AsmBadge               AsmStatusIndicator     AsmScrollbar
AsmCarouselIndicator   AsmDotIndicator
AsmNavigationRail      AsmNavDrawer           AsmNavigationRail.bottom  ← ships, FORBIDDEN
AsmTextField           AsmTextFormField
AsmTokens              AsmSpacing
```

Token accessors: `asmColorScheme(brightness:)` · `AsmTokens.of(context)` · `context.asmTokens` ·
`context.asmExtendedColors` · `context.asmStateColors` · `context.asmGradients` ·
`context.asmTokens.shadows`. Package: `assemble_flutter_tokens`.

**Does not exist:**

| Name | Reality |
| --- | --- |
| `AsmIcon` | No such widget. Use the framework `Icon`. |
| `AsmPopover` | `Popover` ships **no** implementation. Nearest is the private popup inside `menu.dart`. |
| a reusable carousel | Indicator only. The working one is private to `Alert Card`. |
| `AsmTopbar` and friends | Undocumented component. |
| `AsmGuidedActionPanel` and friends | Undocumented component. |
| **any `Asm*` name in React** | Wrong vocabulary, not a missing widget. Validation gate **G7.2**. |

The last row is a different kind of error from the others. `AsmIcon` doesn't exist anywhere;
`AsmButton` exists but is **Flutter-only vocabulary**. Both are defects in React output, for
different reasons — and the second is the easier mistake to make, because the name is real.

### React component names

**No list exists.** Not here, not in any doc. React's component and prop names must be read from the
React source, per component, every time — and what you verified must be stated in the output
([`react-binding.md`](react-binding.md) §7). Deriving a React name from a Flutter one is a **BLOCKER**
(gate **G7.3**), not a reasonable guess: parity between the two bindings is not guaranteed, so the
component may be named differently, shaped differently, or absent.

---

## 4. Terms of art

| Term | Means |
| --- | --- |
| **Assemble** | The McAfee design system. |
| **Pegasus / Pegasus Flutter** | The implementation repo where `Asm*` widgets live. |
| **`Asm*`** | The **Flutter** widget prefix. Flutter vocabulary only — never in React, never in a translation. |
| **binding** | A sanctioned implementation of Assemble. There are **two**: Flutter (production, documented) and React (prototyping, undocumented). Neither is the design law. |
| **the one-way flow rule** | Design law → binding, never binding → binding. A React prototype is never a Flutter spec and never evidence about the design. [`react-binding.md`](react-binding.md) §1. |
| **key / reference / semantic** | The three token layers. UI consumes **semantic only**, in both bindings. |
| **the web token build** | The build of the same token source that React consumes. Same semantic names, mechanically transformed; the transform is **not recorded here** — read it from the web token package. |
| **Layer A / Layer B** | Layer A = everything above `## Flutter Usage` — portable design law, both bindings. Layer B = a binding: `## Flutter Usage`, or the React source. Three layers, two of them Layer B. See [`platform-adapters.md`](platform-adapters.md). |
| **content region** | `window − 16 − 60 − 16 − 386 (if panel)`. The only legitimate layout input. |
| **threshold** | One of **exactly two** structural breakpoints: 500, 980. |
| **tier** | SM / MD / Default / Max. MD, Default, and Max are **structurally identical**. |
| **the 992 cap** | `(12 × 68) + (11 × 16)`. Content stops growing and centres; the surplus is margin. |
| **substrate** | A component with no meaning of its own that others are built on — `Cards`. |
| **route away** | Terminate a decision tree *outside* the component you started in. The most valuable thing a tree does. |
| **discriminator** | The single question that decides between two look-alike components. |
| **divergence** | A documented, cited departure from a foundation, valid **only** for that component. Never propagated. |
| **open item** | A numbered, logged conflict or gap. Citable. ~600 exist. |
| **banner** | The four-line `Role / Scope / Rule / Source` header on every doc. The `Rule:` line is precedence tier 2. |
| **translation** | Output with **no sanctioned binding** — CSS, Vue, SwiftUI, bespoke web. Must be labeled; is not sanctioned Assemble. Flutter and Assemble-React output are **not** translations. |
| **fidelity notice** | The label React output carries instead of a translation notice: sanctioned binding, not a production spec. [`platform-adapters.md`](platform-adapters.md) §7. |
| **`-emphasized`** | The typescale suffix for weight 700. The **only** way to emphasize. |
| **Heavy** | An extra weight, `display` and `headline` only, promotional only. |
| **mono** | `label.mono.*`, line height 1.0. Data values only. |
| **state layer** | The 8/10/10/16 overlay. Additive when combined. Enabled = its **absence**. |
| **focus ring** | `md.border.focus` — primary, 2px, 2px offset, **keyboard only**. |
| **`automationIdentifier`** | Required, kebab-case, asserted non-empty, never spoken. |
