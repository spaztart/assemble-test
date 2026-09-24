# AGENTS.md — Assemble Design System

<!--
  Install: copy or append to `AGENTS.md` in the repo root. Read by agents following the AGENTS.md
  convention (Codex, Jules, Devin, Zed, Amp, Aider, and others). For Claude Code use
  `claude-code.md`; for Cursor `cursor.mdc`; for Copilot `copilot-instructions.md`.

  This file is deliberately self-contained: it assumes the agent may not be able to open the
  design-system docs. Where it can, the full source is Skill DS/AI/SKILL.md plus the 34 component
  and 8 foundation docs in Skill DS/Components/ and Skill DS/Foundations/.
-->

## The system

**Assemble** — the McAfee design system, for **desktop applications with resizable windows**. Derived
from Material 3 with documented divergences. **No mobile build** — the SM tier is a narrow desktop
window, not a phone.

It has **two sanctioned bindings**, and they are not peers:

| | Flutter | React |
| --- | --- | --- |
| Used for | **McAfee production products** | **prototyping** (Figma Make and similar) |
| Names | widgets prefixed `Asm*`, Pegasus Flutter repo | a different prefix or plain names — **never `Asm*`** |
| Tokens | `assemble_flutter_tokens` | the **web build** of the same token source |
| Documented | yes, in all 34 component docs | **no — nothing records its names, props, variants, or defaults** |
| Reconciled against Figma | yes, ~600 numbered open items | no |
| Parity with the other | — | **not guaranteed**; a looser approximation |

**Establish which binding this repo is before writing a line.**

- **Flutter** (`.dart`) → everything here applies directly, including the `Asm*` API.
- **React using the Assemble React library** (`.tsx`/`.jsx`) → sanctioned, so **not** a translation.
  Everything above "Flutter binding" applies unchanged; see "React binding" below for what replaces it.
- **Anything else** (hand-written CSS, Vue, SwiftUI, a bespoke component set) → see "Non-Flutter,
  non-React targets" below. It is a **translation**: label it and declare your token mapping.

**The flow is one-way: design law → binding.** Never derive Flutter code from a React prototype, and
never cite a React prop as evidence that Assemble has that modifier — React is authoritative about
React and about nothing else. Never write `Asm*` in a `.tsx` file: a real name in the wrong vocabulary
is easier to miss than an invented one.

## Priority of sources

When two sources disagree, higher wins:

1. Accessibility floors
2. A component doc's banner `Rule:` line
3. That component's `## Rules`
4. A foundation's `## Rules`
5. That component's `## Decision Tree`
6. Component body prose
7. `## Anti-Patterns`
8. `## Flutter Usage` — binding, not design law
9. **The React source** — authoritative about React's own API (it is code), and about **nothing else**.
   No design authority: undocumented, unreconciled, parity not guaranteed.
10. Figma — drifts from code, and **rarely draws focus states**
11. **Shipped defaults — actively distrusted.** `Asm*` widget defaults contradict the guidance in
    several places; React's prop defaults are worse, because no doc reconciles them at all.
12. Legacy docs, and your own inference — **no authority**

Tiers 8 and 9 are siblings, not a ranking of quality: each binding is authoritative about itself only.
Neither is evidence about the other, and neither outranks the design law above it.

Never silently reconcile a conflict. State which side you took and cite the open item (~600 exist,
numbered, in each doc's `## Open Items`).

## Rule zero

**Never state a value you have not read in the docs.** No inferred numbers, no values borrowed from a
sibling component, no invented variants, states, sizes, or parameters. If a doc doesn't give you the
number, say it isn't specified. A plausible-but-wrong value is worse than an acknowledged gap, because
the reader cannot tell the difference.

## Tokens

Forbidden anywhere: hex / `rgb()` / `hsl()` / `Color(0x…)` · raw font size, weight, line height, or
tracking · hardcoded padding, gap, margin, radius, border width · hand-authored `BoxShadow` · a
hardcoded dark-mode value.

Three token layers — **key** (`md.key.*`) → **reference** (`md.ref.*`) → **semantic**
(`md.sys.*`, `mcafee.*`). **UI consumes the semantic layer only.** A reference-layer token in UI code
is a blocker: the value stops responding to theme at exactly the point the token system was supposed
to work.

**Spacing — a closed set of 15 steps.** `md.spacing.` 0/50/100/200/250/300/400/500/600/700/800/900/
1000/1100/1200 = 0/2/4/8/10/12/16/20/24/28/32/36/40/44/48. `400` (16) is the default. Choose by the
**relationship**: 0–8 inside an element, 10–24 between elements, 28–48 between groups. Start at the
band default, adjust one step. `50` and `250` are optical corrections — last resort. One owner per
gap: never stack a parent's padding with a child's margin. Off-scale means the wrong step, not a
missing one.

**Radius:** 0, 2, 4, 6, 8, 12, 16, 24, 32, 36, 40, 48, 56, 64, **999**. `999` *is* the pill.
**Border width:** 0, 1, 2, 3, 4.

**Type** — one composite token per run: `display` (57/44/36) · `headline` (32/28/24) · `title`
(22/18/16) · `label` (14/12/11) · `label.mono` (14/12/11, line height 1.0) · `body` (16/14/12).
Typeface McAfee Sans / McAfee Sans Mono. Emphasis is **`-emphasized`** (weight 700) — never a bigger
size, never a manual weight. **Heavy** weight: `display` and `headline` only, promotional only.
**Mono**: data values only. Never alter a token's line height or tracking at the usage site — a
different metric means a different token.

**Colour** — pick the semantic role by **meaning**, then let the theme resolve it. Dark mode is a
**theme-mode swap**: never re-point a token, never branch on brightness at the usage site. A colour
that looks wrong in dark mode means the wrong role was chosen.

## Accessibility floor — overrides everything else in the system

1. **48×48** minimum touch target, achieved with **padding**, never by enlarging a glyph, holding at
   200% text scale.
2. **Visible keyboard focus ring** — `md.sys.color.primary`, 2px, 2px offset, solid. **Keyboard
   only.** Never removed, narrowed, or recoloured.
3. Every interactive element expresses **hover, pressed, focus, disabled**. No partial sets.
4. **Never meaning by colour alone** — status, severity, destructive, chart segments.
5. Meaningful icons have accessible names; decorative icons are hidden. **Icon-only controls need
   both a label and a tooltip.**
6. Contrast: **4.5:1** normal text · **3:1** large text · **3:1** interactive and non-text.
7. **Nothing consequential lives only in a transient or hover-only surface** — snackbars expire,
   tooltips vanish, scrollbars fade.
8. **Disabled leaves the tab order** and receives no other state (12% container / 38% content, from
   `on-surface`). Because disabled text fails contrast, it may never be the only place information
   appears.

Two documented exceptions, both narrow: disabled content at 38%, and `Cards`' `brand` variant at
3.9:1 (large text only).

Three string slots, never conflated: visible **label** (spoken) · **semantic label** (spoken;
*expands* a too-terse label, never says something different) · **automation identifier** (never
spoken, kebab-case, from purpose, **required**). Never mutate a label to show progress ("Save" →
"Saving…") — it changes the accessible name mid-interaction.

## States

hover **8%** · focus **10%** · pressed **10%** · dragged **16%**. Additive when combined. Enabled is
the **absence** of a layer. Precedence: **disabled → pressed → focus → hover → enabled**. The layer's
**role** — `primary`/`secondary`/`neutral`/`error` — comes from the **action's meaning**, not the
element's current colour. **Selected is a separate axis**, not a competing state.

## Elevation

**Exactly three shadows, all zero-offset:** `subtle` (blur 4) · `light` (blur 20) · `heavy` (blur 25).
No fourth, no stacking, no interpolation. **The most common correct answer is no shadow** — colour,
spacing, or a border usually already separates it. One per surface; peers match.

**Elevation is shadow-based, not tonal.** `surface-container-*` is a container fill for tertiary UI;
stepping it up raises nothing.

## Layout

Decide from the **content region**, never window width:

```
content = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (side panel, if present)
```

**Exactly two structural thresholds: 500 and 980.** SM (500–979): 4 columns, overlay drawer, bottom
sheet. MD (980–1279) / Default (1280–1439) / Max (1440+): 12 columns, persistent rail, side panel —
and these three are **structurally identical**; never branch among them. The SM transforms move
together.

Grid: gutter and outer margin **16** at every tier. Caps at **992** `((12×68)+(11×16))` and centres —
the surplus margin is intentional, not something to fill. Rail (**60**) and side panel (**386**) are
**fixed**, sit **outside** the grid, and are **siblings** of the content, not ancestors — as ancestors
the content never receives real constraints. Vertical rhythm: **24** between items, **30** at section
boundaries. **No nested grid inside a card.** Never hardcode a card or column width.

Components are **container-agnostic**: correct beside a 386 panel, inside a bottom sheet, and inside a
card, without knowing the window size. A component never takes a breakpoint tier as a parameter.

These layout numbers are **measured, not tokenized** — so never inline them at a call site.

## Routing — route away before routing within

Every component doc's `## Decision Tree` asks *"is this the right component at all?"* first, and its
most valuable answer is usually a **different component, or none**. Most modals should have been a
snackbar or an alert banner; most carousels a list; most scrolling regions tabs or an accordion.

The discriminators:

| Question | Decides |
| --- | --- |
| Act, or navigate? | `Button` vs a link (`Button` has no navigation role) |
| Does anything happen on click, or does it wait for Save? | `Switch` vs `Checkbox` |
| Would the user be stuck if they missed it? | `Alert Banner` vs `Snackbar` |
| Must the user respond before anything else can happen? | `Modal` vs everything (usually no) |
| Do you know the fraction? the layout? | `Progress Bar` vs `Skeleton Loader` vs `Loaders` |
| Does the unfilled part mean "not yet"? | `Progress Bar` (has a **track**) vs the charts (no track) |
| Is anything inside it focusable? | `Popover` vs `Tooltip` |
| A *name*, or something *about* the thing? | `Peek Label` vs `Tooltip` |
| Exactly one, or zero-or-more? | `Radio` vs `Checkbox` |
| A count, a severity, a condition, or a category? | notification badge vs `Badges` vs status label vs `Tags` |

Valid, common terminations **outside** the library: show the content · **nothing at all** (wait under
~300ms) · **no badge** (count is zero) · **no shadow** · spacing instead of a divider · a link · a
list · a table (charts past 4–5 parts) · pagination · a real screen (a sheet has no URL and no back
stack) · plain text.

**Look-alikes that mean opposite things.** `Progress Bar` and `Data Linear Chart` are the same shape;
the bar has a **track** and its remainder means *"not yet"*, the chart has none and the split *is* the
message. `Data Arc Chart` is **not** a circular progress indicator. Never substitute one for the
other.

**Three different things are called "badge":** the severity chip (`Badges` / `AsmBadge`), the numeric
notification badge, and the dot-plus-word status label (both in `Status Indicators`). **If it holds a
count, it is not `Badges`.**

## Variant and size come from the doc's stated input

- `Badges` `type` ← **the surface behind it** (`primary`'s near-white fill is invisible on light)
- `Accordion` type ← the **page background**
- `Text Fields` `filled`/`outlined` ← whether a four-sided stroke competes with a busy or coloured
  surface — and then **all** fields on that surface match
- `Button` `ghost` ← it sits on **imagery or a gradient**; `strictBlack`/`strictWhite` ← the surface is
  **theme-independent**
- `Alert Card` layout ← **available width** (≥480 expanded / 375–479 medium / <375 compact)
- Spacing step ← the **relationship band**; type style ← what the text is **doing**; state role ← the
  **action's meaning**

Interlocks: one size per button group · exactly one `filled` button per surface · a standalone
`text`/`textNoPadding` button **must** carry a directional icon (those two variants have **no state
layer at all**) · `xsmall` drops to 12px type and is never a fix for a crowded layout · `Switch`
`small`'s hit region is under 48×48 · `Menu` `compact` rows are 40px, under the floor.

## Silent failures

- `destructive` on `outline` / `ghost` / `textNoPadding` / `strict*` → **ignored**
- `Peek Label` `inverse` + `offline` → tone **ignored**
- `Expanded Card` with both `options` and `expandedContent` → **asserts**
- Charts summing to zero → render **blank**. Check the sum; swap in an `Empty State`
- Both chart **legends are not announced** — supply the breakdown yourself
- `Carousel` dots are **decorative** — not focusable, not tappable
- `Feedback`'s own visual change is **not** acknowledgement — use a `Snackbar` or a follow-up
- `Chat Bubble` does not own width (~70–80%), alignment, sender attribution, timestamps, or entry
  animation — the conversation view does
- A `Radio` never exists alone; the **group** owns selection, the name, and the default

## Does not exist

`AsmIcon` (use the framework `Icon`; `AsmIconButton` and `AsmIconContainer` do exist) ·
**`AsmPopover`** — `Popover` ships **no** implementation (nearest: the private popup in `menu.dart`) ·
**any reusable carousel** — only `AsmCarouselIndicator` / `AsmDotIndicator`; the one working carousel
is private to `Alert Card` · `AsmTopbar`.

**`AsmGuidedActionPanel` is the opposite case — it ships, but has no doc.** `guided_action_panel.dart`
is real and cited from three component docs. Use it; just don't expect documented guidance, and don't
infer its API from a neighbour. **Undocumented ≠ nonexistent.**

**`AsmNavigationRail.bottom` ships and is forbidden.** The rail docks **left at every tier**, without
exception — the system's only absolute placement rule. At SM it hides and returns as a left overlay
drawer over a scrim.

**Seven components have no doc:** `brand`, `feature banner`, **`guided action panel`**, `lists`,
`quick action`, `toggle groups`, **`topbars`**. Name the gap and offer the nearest documented
component; never improvise a spec. This holds in a prototype too — a prototype is exactly where an
invented component becomes precedent.

**Also: any `Asm*` name in a `.tsx` file.** Not a missing widget — the wrong vocabulary. `AsmButton` is
real, and real in Flutter only, which is what makes it easy to miss.

**There are no motion tokens.** Any duration, easing, or transition question has no answer here.

## Flutter binding

Skip this section entirely if the repo is not Flutter — see "React binding" or "Non-Flutter,
non-React targets" below.

- **Pass `variant` and `size` explicitly.** `AsmButton` defaults to `variant: text, size: large`; the
  documented guidance is `filled` / `medium`. Every `Asm*` default is untrusted.
- `automationIdentifier` is **required** and asserted non-empty — a snippet without it will not run.
- Disable by passing **`null`** to the handler. Never `Opacity` / `IgnorePointer` / `AbsorbPointer` /
  an invented `disabled` flag.
- **Never** wrap an `Asm*` widget in `Semantics` or `GestureDetector`.
- No `Padding` wrapper to resize a component. No `TextStyle` override. Don't override a button's
  shape. Pass icons bare — no `size:` on a component slot.
- Never `Material(elevation:)` / `Card(elevation:)` — set the decoration, pass the shadow token.
- Branch on `LayoutBuilder` / `constraints.maxWidth`, **never** `MediaQuery.of(context).size.width`
  (`MediaQuery` is still right for safe areas, insets, text scale).
- Resolve hover/press from `WidgetState`, not local `setState`.
- Gaps are owned by the parent, not by a margin on every child. Never `Spacer`/`Expanded` for a
  *defined* gap.
- Tokens: `asmColorScheme(brightness:)` · `AsmTokens.of(context)` · `context.asmExtendedColors` ·
  `context.asmStateColors` · `context.asmGradients` · `context.asmTokens.shadows` · `AsmSpacing.*`.

## React binding

Skip this section entirely if the repo is not React.

Sanctioned for **prototyping**, and **undocumented** — no doc records its component names, prop names,
variant coverage, or defaults. So everything above "Flutter binding" still applies in full: the design
law, the tokens, the accessibility floor, the layout model, the routing, the silent failures. What
changes is that you must **verify instead of assume**, and say in your output which you did.

1. **Verify from the React source:** the component's name, its prop names and enum spellings, which
   variants and sizes exist, its prop defaults, and whether the component exists at all. Parity with
   Flutter is not guaranteed — `Button` documents 8 variants and 4 sizes in Flutter, and React's set is
   unverified until you read it. **Deriving a React name from a Flutter one is a blocker, not a guess.**
2. **Never write `Asm*`.** Those names belong to the Flutter library.
3. **Pass props explicitly.** React's defaults are distrusted for the same reason Flutter's are, with
   less documentation behind them.
4. **Tokens come from the web build of the same token source** — same three layers, same semantic
   names, mechanically renamed into whatever the target consumes (CSS custom properties, a JS export,
   or both). **There is no mapping to declare and no approximation to make.** Read the naming transform
   from the web token package, confirm it once, use it everywhere — never guess the convention. Still
   forbidden: hex / `rgb()` / `hsl()`, a named CSS colour, a raw `px`/`rem` value, a hand-written
   `box-shadow`, a composite type token split into separate declarations, `md.key.*` or `md.ref.*` in
   component code, `outline: none`, and a viewport `@media` query for a layout decision. A token
   missing from the web build is a **gap to report**, never licence to inline the value.
5. **Layout still comes from the content region**, not the viewport. Use a container-based mechanism if
   one exists; if you can only query the viewport, say plainly that the layout breaks whenever a side
   panel is open. Silence there reads as "this works."
6. **Accessibility does not relax for a prototype** — the focus ring especially. It is the most common
   omission in generated web code and the most consequential, and the prototype is what stakeholders
   approve.
7. **Use the library.** Hand-rolling a component it already has is how a prototype becomes a fork, and
   a prototype is exactly where an invented component becomes precedent.
8. **A divergence from the doc is an open question, not a feature.** An extra prop is not a documented
   modifier; a missing variant is not a deprecation. The doc wins — file the difference.
9. **Never port this to Flutter, and never cite it as evidence about the design system.** Label the
   output:

```
REACT PROTOTYPE — SANCTIONED BINDING, NOT A PRODUCTION SPEC
  Design law applied : <component>.md, everything above ## Flutter Usage
  Binding            : Assemble React (prototyping)
  Tokens             : web build of the shared token source — semantic layer only
  API verified from  : <source read> | NOT VERIFIED: <what you couldn't confirm>
  Parity             : not guaranteed against Flutter — variants/sizes verified per component
  Do not             : port this to Flutter, or cite it as evidence about the design system
  Layout caveat      : <container-based | viewport-based — wrong when a side panel is open>
```

## Non-Flutter, non-React targets

Every component doc is cut at `## Flutter Usage`. Everything **above** it — routing, meaning, anatomy,
content rules, accessibility obligations, anti-patterns — is **portable design law** and applies in
full to both bindings and to any other target. `## Flutter Usage` and below is Flutter binding and
carries **no authority** anywhere else — and neither does React's API.

If the target is neither sanctioned binding:

1. Consume the portable layer in full, and cite it.
2. Map token **names** through a **declared** mapping — never resolve a token to a hex. An unmapped
   token is a finding, not something to approximate. (If the target consumes CSS or JS, check whether
   the **web token build** already covers it before inventing a mapping.)
3. **Never invent an `Asm*` API** in another language, and **never borrow React's names** either.
4. **Never port a snippet from either binding.** Build natively from the design law.
5. **Label the output a translation** — it is not sanctioned Assemble, and no one has reviewed the
   mapping.

The sharpest translation gap: Assemble decides layout from the **content region**, not the viewport. A
target that can only query the viewport will believe it has 386px more room than it does whenever a
side panel is open. Say so.

## Report shape

Every answer carries four things:

1. **The routing decision and its reason**, citing the doc.
2. **The variant/size/mode choices and the input each was decided from.**
3. **Every value as a token name.**
4. **Open items touched, and anything you could not verify.**

An answer missing item 4 is incomplete, not concise.
