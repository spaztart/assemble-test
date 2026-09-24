# Known Gaps

> Role: What Assemble does not yet answer, and how to behave when a question lands there.
> Rule: **An absent value is a finding, not a licence.** Citing a gap is a better answer than
> filling it — and the docs already record roughly 600 of them, numbered, so you can point at one.
> Scope: Every target, and both bindings. The single largest gap is that one of the two sanctioned
> bindings — **React** — has no documentation at all (§3.0).
> Source: the `## Open Items` sections of all 34 component docs, plus `../Components/checklist.md`.

---

## 0. How to behave when you hit one

1. **Check `## Open Items` in the relevant doc first.** They're numbered lists specifically so
   they can be cited. There is a good chance your question is already logged.
2. **Say which value is missing, and where you looked.** "`Grid` defines the 12-column grid but no
   doc records which span an alert card takes at MD" is a complete answer.
3. **Offer the nearest documented option and name what it can't do.**
4. **Never** infer a number because it fits the scale, copy one from a sibling component, resolve a
   token to a hex, or invent a variant, state, size, or parameter.
5. **Cite the item by number** — `Alert Card` open item 23, not "there's a naming issue somewhere."

A gap is not a blocker on the whole answer. Deliver everything that doesn't depend on it, then say
precisely what's missing.

---

## 1. Components with no doc (7)

These are enumerated in `../Components/checklist.md` as NOT INCLUDED. **Name the gap; do not
synthesize a spec from a neighbour.**

| Component | Priority | Who routes to it | Why it matters |
| --- | --- | --- | --- |
| **guided action panel** | **1** | `Alert Card`, `Peek Label`, `Cards` | Three finished docs route to it. `Alert Card` docks to it; `Peek Label` is designed against its surface and documents its collapsed handle; `Cards` is built into it. It is the largest load-bearing absence in the system. **Naming conflict:** the draft calls it the "Guided Journey panel" — `Alert Card` open item 23 flags that the two names must be reconciled. |
| **topbars** | **2** | `Navigation Rail` (twice), `Tabs` | Owns the page title and page-level actions, and — critically — the SM menu affordance that opens the overlay drawer. `Breakpoints` **requires** that affordance and no component owns it. |
| **lists** | 3 | `Cards`, `Expanded Card` | The list feature row and list feature card are built on `Cards` and routed to by name. |
| **brand** | 4 | — | |
| **feature banner** | 5 | — | |
| **quick action** | 6 | — | |
| **toggle groups** | 7 | — | |

The two priority-1/2 entries are the ones you will actually hit. When a request needs a topbar, the
correct answer is: *Assemble has no topbar doc; `Navigation Rail` routes to one twice and
`Breakpoints` depends on its menu affordance. Here is what the rail's doc says about the boundary,
and here is what nobody has specified.*

---

## 2. Components with no implementation

Distinct from §1 — these have docs, but the code isn't there.

| Component | Status |
| --- | --- |
| **`Popover`** | **No implementation ships.** The nearest shipped placement logic is the private popup inside `menu.dart`. Do **not** write `AsmPopover` — it does not exist, and autocomplete will happily suggest it. |
| **`Carousel`** | **There is no reusable carousel component** — only `AsmCarouselIndicator` / `AsmDotIndicator`, which are decorative dots. The one working carousel in the product is **private to `Alert Card`** and does not use that indicator. |
| **`Tabs`** | Partially implemented against its own design: design gives the selected tab three signals, the shipped component delivers **two**. Removing another leaves one. |

---

## 3. Standing system-wide gaps

These come up constantly and are not tied to one doc.

### 3.0 The React binding is entirely undocumented — the largest gap in the system

Assemble has **two sanctioned bindings**: Flutter for production products, and **React for
prototyping** in Figma Make and similar tools. All 34 docs cover the Flutter binding in
`## Flutter Usage`. **Nothing covers React.** Not its component names, not its prop names, not which
variants and sizes exist, not its defaults, not its divergences from Flutter.

So every React API question resolves to *"read the source"*, and **nothing catches drift between the
two bindings.** That is worse than an ordinary gap: the Flutter binding's value comes almost entirely
from the reconciliation pass that produced ~600 numbered open items, and React has had none of it.

**Why it persists, which is the interesting part.** The component-doc template instructs authors to
**never mention web, HTML, CSS, React, or web components** — "this system targets Flutter only." That
rule was correct when Flutter was the only binding. It is now the *reason* a real, sanctioned
implementation has no home in the docs.

**Two things close it, in order:**

1. **Amend `../Components/_component-doc-template.md`** — add a `## React Usage` section alongside
   `## Flutter Usage`, under the same layer rule (platform-agnostic design law above, bindings
   below), and narrow the web prohibition so it applies to *design law* only, not to a documented
   binding.
2. **Reconcile per component**, the way Flutter was: read the React source, compare it against the
   doc and against Figma, and log every disagreement as a numbered open item.

**Until then:** [`react-binding.md`](react-binding.md) is the only written record, and it is
deliberately a procedure rather than a spec — it tells you what to verify, not what the answer is.
Treat every React API detail as unverified, and say which ones you checked.

**The consequences you will actually hit:**

- **Coverage is unknown.** Check the component exists before you use it.
- **Parity is not guaranteed.** `Button` documents 8 variants and 4 sizes in Flutter; React's set is
  unverified. Verify per component; don't assume.
- **Names don't carry across.** React uses a different prefix or plain names. `Asm*` is Flutter
  vocabulary.
- **The token naming transform isn't recorded either.** The web build renames tokens mechanically —
  read the transform from the web token package, confirm it once, use it everywhere. Never guess it,
  and never inline a literal because you couldn't find the variable.
- **A React divergence is an open question, not a feature.** An extra prop is not a documented
  modifier; a missing variant is not a deprecation. The doc wins — and filing the divergence may be
  the most useful thing that prototype produces.

### 3.1 No motion tokens

Visible in **at least five components** — `Accordion` open item 8, both chart docs, `Navigation
Rail` open item 24, and others. Every one of them independently records "no motion tokens exist."

`../Components/checklist.md` says this should be **promoted to a Foundations gap** rather than
restated in a sixth component doc. Treat it that way: when a question needs a duration, easing
curve, or transition spec, the answer is *Assemble has no motion foundation*, cited once — not a
per-component surprise.

### 3.2 No breakpoint tokens

`500` and `980` are **measured values**, not tokens. So are the tier names. Nothing stops a
codebase from writing `980` in six places with no shared constant.

### 3.3 No layout tokens

`992` (grid cap), `386` (side panel), `60` (rail), `16` (gutter and outer margin), `24` / `30`
(vertical rhythm) — all measured, none tokenized. This is why "never inline a layout constant" is a
rule: the token system can't enforce it for you.

### 3.4 No column-span-per-component record

`Grid` defines the grid. `Breakpoints` defines the tiers. **Which span each component takes at each
tier was never written down.** So "how wide is an alert card at MD?" has no documented answer —
only the derivation from the content region, which you must state as a derivation, not as a spec.

### 3.5 Foundations have almost no open items

`Color`, `Typography`, `Spacing`, `States`, `Elevation`, and `Icons` each have **zero** open items;
`Grid` and `Breakpoints` have **four each**. That is not evidence the foundations are complete — it
is evidence that reconciliation pressure has been applied to components, where Figma and code are
both concrete, and not to foundations, where drift is harder to see. Read a foundation's silence as
silence, not as confirmation.

---

## 4. Where the open items are

~600 numbered items across 34 component docs. Counts, highest first — a useful proxy for *how much
of a component is still unsettled*:

| Doc | Items | | Doc | Items | | Doc | Items |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Text Fields | **33** | | Tooltip | 17 | | Switch | 14 |
| Navigation Rail | **25** | | Popover | 17 | | Expanded Card | 14 |
| Alert Card | **25** | | Scrollbar | 16 | | Data Arc Chart | 14 |
| Tabs | 23 | | Loaders | 16 | | Carousel | 14 |
| Menu | 22 | | Data Linear Chart | 16 | | Button | 14 |
| Modal | 21 | | Snackbar | 15 | | Radio | 13 |
| Date Picker | 21 | | Peek Label | 15 | | Progress Bar | 13 |
| Sheets | 19 | | Cards | 15 | | Skeleton Loader | 12 |
| Feedback | 19 | | | | | Empty State | 12 |
| Badges | 19 | | | | | Checkbox | 12 |
| Tags | 18 | | | | | Accordion | 12 |
| Status Indicators | 18 | | | | | Alert Banner | 11 |
| | | | | | | Chat Bubble | 10 |
| | | | | | | Divider | 8 |

Foundations: `Grid` 4 · `Breakpoints` 4 · `Typography` 0 · `States` 0 · `Spacing` 0 · `Icons` 0 ·
`Elevation` 0 · `Color` 0.

**How to read this.** A high count is not a warning about quality — it is the opposite. `Text
Fields` at 33 means someone read the Dart source and the Figma set side by side and wrote down every
disagreement. A doc with a low count is either genuinely simple (`Divider`, 8) or hasn't had the
same pressure applied.

**Two docs share nine open items verbatim.** `Data Arc Chart` and `Data Linear Chart` do this
**deliberately** — they are the same problem in two shapes, and duplicating the items keeps each doc
independently readable. Don't "fix" it, and don't report it twice as one finding.

---

## 5. Live conflicts you will hit

Each of these is a real disagreement between two sources, already logged. Follow
[`decision-priority.md`](decision-priority.md), then **cite the item**.

| Conflict | The two sides | Resolution |
| --- | --- | --- |
| `AsmButton` defaults | Ships `variant: text, size: large`; guidance says `filled`/`medium` | Tier 11 loses. Pass both explicitly. |
| `AsmNavigationRail.bottom` | The constructor ships; the rail's banner rule forbids bottom placement absolutely | Tier 2 beats tier 11. `Navigation Rail` open item 1. |
| Button disabled opacity | `States`: 12% container / 38% content. `Button`: 38% both, matching Figma's whole-container opacity | Follow `Button` **for buttons**, cite the divergence, never propagate. `Button` open item 4. |
| Button disabled container colour | `States`: from `on-surface`. `Button`: from `colorScheme.outline` at 38% | Same treatment. Open item. |
| `text`/`textNoPadding` state layer | `States`: every interactive element expresses hover/pressed/focus. `Button`: these two have **no state layer at all** | Documented divergence — and the reason a standalone text button must carry a directional icon. |
| Guided action panel name | Finished docs say "guided action panel"; the draft says "Guided Journey panel" | Unresolved. `Alert Card` open item 23. Use the finished-doc name and flag it. |
| Figma vs code names | e.g. Button sizes `huge`/`spacious`/`default`/`compact` vs `large`/`medium`/`small`/`xsmall` | Translate through the mapping. [`glossary.md`](glossary.md). |
| Touch target 44 vs 48 | `Icons` and `States` previously said 44 | **Resolved: 48.** Both were corrected in the consistency pass. If you see 44 anywhere, it's stale. |
| `Switch` `small` hit region | Under 48×48 | A documented defect, not an exception. |
| `Menu` `compact` row height | 40px, under the floor | Pointer contexts only, and say so. |
| Off-scale button padding | `Button` uses 23/18 vertical padding | Off-scale. Quote it only while citing it as an open item. |
| `Cards` `brand` contrast | 3.9:1 | Accepted exception, **large text only**. Not general licence. |
| Figma focus states | Figma **rarely draws them** | A missing focus variant is a Figma gap, never permission to skip focus. |
| **React vs the docs** | Any React prop, variant, size, or default that the component doc doesn't have — or lacks | **Tier 9 carries no design authority.** The doc wins; the difference is an **open question worth filing**, not a feature and not a deprecation. §3.0. |
| **React vs Flutter** | The two bindings disagree | Neither is evidence about the other. Both route back to Layer A. No doc records a single one of these differences yet — that is §3.0. |
| **An approved prototype vs a Flutter task** | "Build it from the prototype" | The flow is **one-way**: design law → binding. Route the *requirement* through the component docs; porting launders an unreconciled approximation into production. [`react-binding.md`](react-binding.md) §1. |

---

## 6. What has no answer at all

Questions that simply have no source in this system. Say so; don't reason toward a plausible one.

- **Motion** — any duration, easing curve, or transition. (§3.1)
- **Which span a given component takes at a given tier.** (§3.4)
- **Anything about a phone.** Assemble targets desktop apps with resizable windows. SM is a narrow
  window, not a phone. There is no mobile build.
- **Any React API detail** — component names, prop names, which variants and sizes exist, defaults,
  coverage. React **is** a sanctioned binding, so this is not "out of scope"; it is genuinely
  **undocumented**, and the answer comes from the React source, not from these docs. §3.0 and
  [`react-binding.md`](react-binding.md).
- **The web token build's naming convention.** Read it from the web token package. Not recorded here.
- **Whether React and Flutter agree on anything specific.** No reconciliation pass has been run, so
  no doc records a single divergence between the two bindings. §3.0.
- **Any other web target** — hand-written CSS, Vue, SwiftUI, a bespoke web component. Nothing is
  sanctioned there; it is a **translation**. See [`platform-adapters.md`](platform-adapters.md).
- **The seven undocumented components.** (§1)
- **`Popover`'s API.** (§2)
- **A reusable carousel's API.** (§2)
- **Content/copy for anything beyond the documented content rules** — the docs give copy *law*, not
  a copy library.
- **Data-visualisation beyond the two chart shapes.** Both docs route to a table past 4–5 parts,
  and no table component is documented.
- **Anything the docs list as an open item.** That's what an open item is: a question with two
  answers or none.

---

## 7. When a gap should become a doc

If you're repeatedly filling the same gap, that's the signal to write it down rather than answer it
again. The route is `../Components/_component-doc-template.md`, and the non-skippable step is
**reconciliation**: read the Dart source in full, pull the Figma component set, and record every
disagreement in `Open Items`.

A doc that describes only the implementation is a code comment. A doc that describes only Figma is a
redlines file. The value is in the reconciliation — which is exactly why the docs with the most open
items are the most trustworthy ones.

By the checklist's own ordering, the next two docs to write are **guided action panel** and
**topbars**.

**One template amendment sits ahead of both**, because it unblocks a whole binding rather than one
component: add a `## React Usage` section to `_component-doc-template.md` and narrow the web
prohibition to the design-law sections. §3.0.
