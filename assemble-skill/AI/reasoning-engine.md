# Reasoning Engine

> Role: The procedure. Turns a UI request into an Assemble decision, then into output for the
> target you're writing to.
> Rule: **Route away before you route within.** Every phase below is cheap; getting the
> component wrong makes all of them worthless.
> Companion: [`decision-priority.md`](decision-priority.md) resolves conflicts *inside* these
> phases. [`validation.md`](validation.md) is phase 8.

Run the phases in order. Skipping is allowed only where a phase says it is.

---

## Phase 0 — Frame the request

Answer these four before anything else. Getting phase 0 wrong is the most expensive mistake
available, because every later phase inherits it.

| Question | Why it changes everything |
| --- | --- |
| **Which binding are you writing to?** Flutter / React / Figma design / spec prose / something with no sanctioned binding | Anything but Flutter → stop and read [`platform-adapters.md`](platform-adapters.md) **now**, before phase 1. Assemble has **two** sanctioned bindings, and they are not peers — see the table below. |
| **What kind of task?** Build · choose · review · translate · specify · extend | Sets which phases matter. See the task map below. |
| **What is the container?** Full-width region · beside a 386 side panel · inside a bottom sheet · inside a card · inside a menu row | Layout resolves from **container** width, never window width. A component must be correct in all of these without knowing the window size. |
| **What is the surface behind it?** Light · dark · severity-coloured · imagery/gradient · theme-independent | Several choices are decided by the surface, not by emphasis — `Badges` `type`, `Button` `ghost`/`strict*`, `Accordion` type, `Text Fields` `filled`/`outlined`, `Peek Label` tone. |

**Target map — settle this before phase 1:**

| Target | Status | Also read | Gates | Label |
| --- | --- | --- | --- | --- |
| **Flutter** product code | **sanctioned — production** | `## Flutter Usage` | G5 (G7 `—`) | none |
| **React** / Figma Make prototype | **sanctioned — prototyping**, undocumented | [`react-binding.md`](react-binding.md), **mandatory** | G7 (G5 `—`) | React fidelity notice |
| Figma design file | design source, tier 10 | [`platform-adapters.md`](platform-adapters.md) §6 | both `—` | none |
| Spec prose, tickets, redlines | no binding needed | — | both `—` | none |
| CSS / Vue / SwiftUI / bespoke web | **translation** — nothing sanctioned | [`platform-adapters.md`](platform-adapters.md) §4 | both `—` | translation notice |

**Phases 1–6 are identical for every target.** They are design law, and design law is portable. Only
phase 7 differs — which is exactly why getting phase 0 wrong is recoverable and getting phase 2 wrong
is not.

**The flow is one-way: design law → binding.** If the input to a Flutter task is an approved React
prototype, do **not** port it. Restate the requirement, run phases 1–6 from the docs, and expect
differences — React's parity with Flutter is not guaranteed.

**Task map — which phases are mandatory:**

| Task | Phases |
| --- | --- |
| Build a component | 1 → 8, all |
| "Which component should I use?" | 1, 2, 3, then stop and answer |
| Apply a token / value | 4, 7, 8 |
| Resolve a layout | 0, 4 (layout), 6, 8 |
| Review / audit an existing screen | 2 (was it routed right?), 4, 6, 8 — report findings, don't rewrite unasked |
| Translate a Figma frame to code | 0, 2 (verify the frame chose right), 3, 4, 7, 8 |
| Build a prototype from an approved design | 0, 1 → 8, all. The prototype is not a shortcut past phase 2 |
| Turn an approved prototype into production code | 0, then **1 → 8 from the docs.** Never phase 7 → phase 7 |
| Author a new DS doc | `../Components/_component-doc-template.md`, then 8 |

---

## Phase 1 — Extract the job

State, in one sentence with no component name in it, what the user needs the UI to do.

> "Tell the user their subscription expired and let them renew, and it must stay on screen
> until they do."

This forces the semantic question ahead of the vocabulary question. A request phrased as
*"add a modal for the expiry warning"* has already made a routing decision, and it is usually
wrong — the docs are explicit that most modals should have been a snackbar or an alert banner.

**Then extract the discriminators.** These are the exact axes the decision trees branch on, and
they are almost never stated in the request:

- **Does it act, or navigate?** (`Button` vs a link)
- **Does it commit now, or on submit?** (`Switch` vs `Checkbox`)
- **Does it persist, or expire?** (`Alert Banner` vs `Snackbar`)
- **Must the user respond before continuing?** (`Modal` vs everything else)
- **Do you know the fraction? the layout?** (`Progress Bar` vs `Skeleton Loader` vs `Loaders`)
- **Does the empty part mean "not yet"?** (`Progress Bar` vs the two charts)
- **Is anything inside it focusable?** (`Popover` vs `Tooltip`)
- **Exactly one, or zero-or-more?** (`Radio` vs `Checkbox`)
- **A name, or something about the thing?** (`Peek Label` vs `Tooltip`)
- **Is it a count, a severity, a condition, or a category?** (`Status Indicators` vs `Badges` vs `Tags`)
- **Would the user be stuck if they missed it?** (the question that invalidates most snackbars)

If a discriminator is genuinely unknown and the answers diverge materially, **ask**. If they
converge, pick and state the assumption.

---

## Phase 2 — Route (route away first)

1. Open [`component-router.md`](component-router.md) and find the candidate.
2. Open that component's doc and run its **`## Decision Tree` from the top**. The first branch
   is always *"is this the right component at all?"*
3. **If it routes you elsewhere, go there and start its tree over.** Do not carry your previous
   variant reasoning across.
4. Repeat until a tree terminates on itself. Two hops is normal; three means phase 1 was fuzzy.
5. Confirm the destination's tree names the component you came from. Cross-links are reciprocal
   by design; if it doesn't, you may be reading a stale doc — flag it.

**Terminating on "not a component" is a valid, common, and often correct outcome.** The trees
route to: plain text, more spacing, a heading, a real screen, a table, a list, pagination, a
link, or *nothing at all*. Examples that terminate outside the library:

- Content needed to complete the task → **show it**, don't collapse it (`Accordion`)
- Wait under ~300ms → **no loader**; a flash reads as a glitch (`Loaders`, `Skeleton Loader`)
- Count is zero → **no badge** (`Status Indicators`, `Badges`)
- Two blocks need separating and more space would do → **spacing**, not a divider (`Divider`)
- More than 4–5 chart parts → **a table** (both charts)
- User must compare items in a set → **a list**, never a carousel (`Carousel`)
- A flow needing a minute or internal navigation → **a screen**, not a sheet (`Sheets`)
- Long scrolling content that could be divided → **tabs, accordion, or pagination** (`Scrollbar`)

**Then check the seven undocumented components** (`brand`, `feature banner`, `guided action
panel`, `lists`, `quick action`, `toggle groups`, `topbars`). If the job is one of them, stop:
name the gap, offer the nearest documented component and what it can't do, and don't synthesize
a spec.

---

## Phase 3 — Choose within

Only now. Work the *rest* of the chosen component's tree, and read the prose subsections for any
variant the doc singles out — a variant that gets its own heading gets it because it's misused.

**Decide from the doc's stated input, not from emphasis or taste.** This is where most on-system
work still goes wrong:

| Choice | Decided by | Not by |
| --- | --- | --- |
| `Badges` `type` (primary/secondary/tertiary) | **The surface behind the badge** | How loud you want it. `primary`'s near-white fill is invisible on a light surface. |
| `Button` variant | Emphasis rank, one `filled` per surface | Preference. Never `filled` + `filled`. |
| `Button` `ghost` | The button sits on **imagery or a gradient** | "I want a transparent button" — that's `text`. |
| `Button` `strictBlack`/`strictWhite` | The **surface is theme-independent** | Wanting fixed colours. On a themed surface, `strictWhite` can vanish. |
| `Accordion` type (white/gray) | The **page background** | Aesthetics. |
| `Text Fields` `filled` vs `outlined` | Whether a four-sided stroke **competes with a busy/coloured surface** — and then all fields on it match | Per-field choice. |
| `Alert Card` layout | **Available width** (≥480 expanded / 375–479 medium / <375 compact) | Device class. |
| `Menu` density | Touch vs pointer — `compact` (40) is **under the touch floor** | Row count alone. |
| `Elevation` shadow | Does it float / divide regions (`light`), command attention or raise on interaction (`heavy`), need quiet definition (`subtle`) | Depth vibes. Default is **no shadow**. |
| `Spacing` step | Which band the relationship is in — inside an element (0–8), between elements (10–24), between groups (28–48) | Eyeballing the gap. |
| `Typography` style | What the text is **doing** — read / name a control / name a surface / introduce a section / hero / machine value | How big it should look. |
| `States` role | The **action's meaning** (`primary`/`secondary`/`neutral`/`error`) | The element's current colour. A destructive text button still uses `error`. |

**Then check the size/variant interlocks.** Several are documented and none are enforced:

- All buttons in a group share **one** size. Never mix.
- Exactly one `filled` button per surface. Exactly one `primary`-tone `Switch` per surface.
- `Button` `xsmall` drops to 12px type — never use it to fit a crowded layout; fix the layout.
- `Switch` `small`'s hit region is **under 48×48**.
- A standalone `text`/`textNoPadding` button **must** carry a directional icon; with a
  `filled`/`tonal`/`outline` neighbour, it must not need one.
- `Expanded Card` with both `options` and `expandedContent` **asserts** — it is an error, not a
  precedence question.
- `Peek Label` `inverse` + `offline` — the tone is **silently ignored**.
- `destructive` on `outline`/`ghost`/`textNoPadding`/`strict*` — **silently ignored**.

---

## Phase 4 — Resolve foundations

Every value comes from a foundation. Resolve each axis you touch; skip an axis only if the
component genuinely has none.

**Colour** — pick the semantic role by meaning, then let the theme resolve it. `md.sys.color.*`
for Material roles, `mcafee.color.extended.*` for status/brand/gradient. Never `md.ref.*` or
`md.key.*`. Never a hex. Dark mode is a **theme mode swap**, never a re-pointed token and never a
hardcoded dark value.

**Typography** — one composite token per text run: `display` / `headline` / `title` / `label` /
`body`, plus `label.mono.*` for machine values only. `-emphasized` is how you emphasize — not a
larger size, not a manual weight. **Heavy is display and headline only, promotional contexts
only.** Never alter a token's line height or tracking at the usage site; a different metric means
a different token.

**Spacing** — pick the band from the relationship, start at the band default (`200` inside /
`400` between / `800` between groups), adjust by one step. `md.spacing.400` is the system
default. `50` and `250` are optical corrections — reach for them last. One owner per gap: never
stack a parent's padding with a child's margin.

**Layout** — compute the content region first:
`content = window − 16 − 60 (rail) − 16 − 386 (panel, if present)`.
Then tier (SM 500–979 = 4 columns; MD/Default/Max = 12 columns — **structurally identical**, never
branch among them). Then spans, chosen from the **content region**. Then the 992 cap: surplus
becomes symmetric margin, and that empty space is intentional. Vertical: 24 between items, 30 at
section boundaries. Never nest a second grid inside a card.

**States** — the component's `States` section documents only its **divergences**; the model
itself lives in `Foundations/States.md`. Hover 8%, focus 10%, pressed 10%, dragged 16%, additive
when combined, disabled always wins. Enabled is the *absence* of a layer. Focus ring always.
Selected is a separate axis, not a competing state.

**Elevation** — ask "does this need to lift at all?" first; usually no. Then `light` (float or
divide regions — the default lift), `heavy` (command attention, or raise-on-interaction),
`subtle` (quiet definition, rare). One shadow per surface, peers share it.

**Icons** — Material Symbols Outlined only, weight 400, outlined by default with **filled
reserved for selected state**. Size from the pairing table (button small/medium → 16, large → 20,
alert → 24, nav item → 24, sidebar/dropdown/field → 20). One concept, one glyph, product-wide.
Size the glyph, pad to 48×48.

---

## Phase 5 — Compose

Build from the component's `## Anatomy` table, and treat the **Required** column as the spec:
required parts are non-negotiable, optional parts are genuinely optional, and there is no third
category.

Then honour the component's `## Content` rules, which are usually the ones people drop:

- **Labels are verb phrases** naming the action. Never "OK", "Submit", "Yes".
- **Labels never truncate.** If it doesn't fit, the label is too long or the container too
  narrow. Never abbreviate to fit a size step.
- **An empty state says why it's empty and what to do next.** "No data" tells the user nothing
  they couldn't already see — and *"nothing matched"* is a query problem needing a different
  action from *"nothing yet"*.
- **A field's label persists once typing starts.** Never use the placeholder as the label.
- **Destructive labels name what is destroyed.** "Delete account", not "Confirm".
- **A colour-bearing surface's text says whatever the colour is saying.** A coloured `Cards`
  variant is decoration; the card carries no meaning a screen reader can hear.
- **A bare status dot needs its condition named in adjacent text** — or find room for the label.
- **`Peek Label` names are one or two words.** There is no width cap, so nothing stops you
  overflowing it.

Then check what the **caller** owes, because several components deliberately don't do it:

- `Chat Bubble` — the conversation view owes width constraint (~70–80%), per-sender alignment,
  sender attribution for assistive tech, timestamps, and entry animation.
- Both charts — the **legend is not announced**. Supply the breakdown yourself or it is
  unavailable to screen-reader users.
- `Carousel` dots — decorative, not focusable, not tappable. If users need to jump to an item,
  you build that affordance, and the dots then inherit every obligation a control has.
- Charts summing to zero — they render blank rather than erroring. Check the sum at the call site
  and swap in an `Empty State`.
- `Feedback` — the component's own visual change is **not** acknowledgement; the selected fill is
  nearly invisible. Acknowledge with a `Snackbar` or a follow-up.
- `Scrollbar` — fades when idle and is invisible to screen readers. Overflow must be
  discoverable without it.
- `Radio` — the **group** owns selection, the name, and the default. A radio never exists alone.

---

## Phase 6 — Constrain

Sweep against the floor and the failure catalogue before you write anything.

1. **Accessibility floor** — [`decision-priority.md`](decision-priority.md) §1, all eight items.
2. **The component's `## Accessibility` section** — component-specific obligations, plus who owns
   the announced name. Keep the three string slots distinct: visible **label** (spoken),
   **semantic label** (spoken, expands on a too-terse label — never says something different),
   **automation identifier** (never spoken, kebab-case, derived from purpose, and **required**).
3. **The component's `## Anti-Patterns`** — read them as assertions about your output, not as
   background reading. See [`anti-patterns.md`](anti-patterns.md) for the cross-component set.
4. **Text scale to 200%** — heights are minimums, so things grow rather than clip. Verify the
   touch target survives.
5. **Both theme modes** — and specifically that nothing depends on a hardcoded dark value or a
   theme-independent variant sitting on a themed surface.
6. **Dark-mode elevation** — a light shadow has little contrast on a dark canvas. Lean on the
   surface tokens; never manually darken the shadow.

---

## Phase 7 — Bind to the target

**Everything up to here was portable.** Phases 1–6 are design law and apply to every target
identically. This phase is the only one that branches, and nothing you decide here may change a
decision made above it: if the binding can't express what phases 1–6 concluded, that's a finding to
report, not a reason to re-route.

**Flutter** (the production binding): use `## Flutter Usage`. Snippets must be **complete** —
including `automationIdentifier`, which is required and asserted non-empty. Pass `variant` and
`size` explicitly; the defaults are untrusted (§4 of `SKILL.md`). Disable by passing `null` to
the handler — never `Opacity`, never `IgnorePointer`/`AbsorbPointer`, never a `disabled` flag
that doesn't exist. Never wrap an `Asm*` widget in your own `Semantics` or `GestureDetector`;
both produce competing or nameless tap targets. Branch on `constraints.maxWidth` via
`LayoutBuilder`, never `MediaQuery.size.width`. Never use `Material(elevation:)` or
`Card(elevation:)` — set the decoration and pass the shadow token.

Run **G5**; report **G7** as `—`. No label.

**React** (the prototyping binding): read [`react-binding.md`](react-binding.md) — it is the only
written record of this binding, and it is a procedure rather than a spec. In short:

- **Tokens are the same.** The React library consumes a **web build of the same token source** — same
  semantic names, same meanings. No mapping to declare. Read the naming transform from the web token
  package once, confirm it, use it everywhere. Never inline a literal because you couldn't find the
  variable; a missing token is a gap to report.
- **Verify every name from the source.** Component names, prop names, enum spellings, which variants
  and sizes exist, whether the component exists at all. React uses a **different prefix or plain
  names** — deriving a React name from `Asm*` is a BLOCKER, not a guess.
- **Parity is not guaranteed.** Don't assume `Button`'s 8 variants and 4 sizes crossed over.
- **Pass props explicitly.** React's defaults are distrusted for the same reason Flutter's are, with
  less documentation behind them.
- **A divergence from the doc is an open question, not a feature.** The doc wins. File it.
- **Accessibility does not relax.** The focus ring especially — it is the most common omission in
  generated web code.
- **Layout:** use a container-based mechanism if one exists. A viewport query is wrong whenever a
  side panel is open; if you can only query the viewport, **say so** in the notes.
- **Never invent a component** for the seven undocumented ones, a `Popover`, or a reusable carousel.
  A prototype is exactly where an invented component becomes precedent.

Run **G7**; report **G5** as `—`. Carry the **React fidelity notice**.

**Anything else** → [`platform-adapters.md`](platform-adapters.md) §4. Consume only Layer A
(everything above `## Flutter Usage`), check whether the **web token build** already covers your
target before inventing a mapping, otherwise map token *names* through a **declared, unreviewed**
mapping, never invent an `Asm*` API, never borrow React's names either, never port a snippet from
either binding, and **label the output a translation**.

Report **G5** and **G7** both as `—`.

---

## Phase 8 — Validate and report

Run [`validation.md`](validation.md). Then report, in this shape:

1. **The routing decision and its reason**, citing the doc.
2. **The variant/size/mode choices and the input each was decided from.**
3. **Values as token names.**
4. **Open items touched, and anything you could not verify.**

An answer missing item 4 is incomplete, not concise. Roughly 600 open items exist; a question
that lands on one is normal, and citing it is a better answer than filling the gap.

For **React** work, item 4 carries extra weight: state **which names and props you read from the
source** and which you couldn't confirm. The binding is undocumented, so "I verified this" and "I
assumed this" are the two most useful things in the report — and nothing else in the system
distinguishes them for the reader.

Then attach the label for your target ([`platform-adapters.md`](platform-adapters.md) §7): none for
Flutter, the fidelity notice for React, the translation notice for everything else.
