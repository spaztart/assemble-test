# Assemble Design System — Copilot Instructions

<!--
  Install: copy to `.github/copilot-instructions.md` in the repo root.
  GitHub Copilot loads that file automatically for chat and edit sessions in VS Code,
  Visual Studio, JetBrains, and on github.com.

  Full source: `Skill DS/AI/SKILL.md` plus the 34 component and 8 foundation docs in
  `Skill DS/Components/` and `Skill DS/Foundations/`. This file is the always-loaded subset.
  Open the component's own doc before writing that component.
-->

## What this system is

**Assemble** is the McAfee design system, for **desktop applications with resizable windows**. There
is **no mobile build**. It has **two sanctioned bindings**:

- **Flutter** — the **production** binding. Widgets prefixed `Asm*`, in the Pegasus Flutter repo.
  Tokens from `assemble_flutter_tokens`. Documented in the `## Flutter Usage` section of all 34
  component docs, and reconciled against Figma (~600 numbered open items).
- **React** — the **prototyping** binding, used in Figma Make and similar. Tokens from the **web
  build of the same token source**. **Undocumented**: no doc records its component names, prop names,
  variant coverage, or defaults. Its parity with Flutter is **not guaranteed**.

**Establish which one this repo is before writing a line.**

- **Flutter repo** → everything below applies directly, including the `Asm*` API.
- **React repo using the Assemble React library** → sanctioned, so **not** a translation. Read
  `Skill DS/AI/react-binding.md` first. All the design law below applies unchanged; the `Asm*` API and
  the Flutter mechanisms do not. **Verify component names, prop names, and which variants and sizes
  exist from the React source** — deriving a React name from a Flutter one is a blocker, not a guess.
  Read the web token build's naming transform from the web token package; never inline a value because
  you couldn't find the variable.
- **Anything else** (hand-written CSS, Vue, SwiftUI, a bespoke component set) → read
  `Skill DS/AI/platform-adapters.md` first. The design law is portable; the `Asm*` API is not, and
  neither are React's names. Label the output a **translation** and declare your token mapping.

**The flow is one-way: design law → binding.** Never derive Flutter code from a React prototype, and
never treat a React prop as evidence that Assemble has that modifier — React is authoritative about
React and about nothing else. Never write `Asm*` in a `.tsx` file: it's a real name in the wrong
vocabulary, which makes it easier to miss than an invented one.

## The rule above all others

**Never state a value you have not read in the design-system docs.** No inferred numbers, no values
copied from a sibling component, no invented variants, states, sizes, or parameters. If a doc doesn't
give you the number, say it isn't specified. Roughly 600 numbered open items exist — citing one is a
better answer than filling the gap.

## Tokens

- Never a hex, `rgb()`, `hsl()`, or `Color(0x…)`.
- Never a raw font size, weight, line height, or tracking. Type tokens are **composite**; emphasis
  is `-emphasized` (weight 700), never a bigger size or a manual weight.
- Never a hardcoded padding, gap, margin, radius, or border width.
- Never a hand-authored `BoxShadow`.
- **Semantic layer only:** `md.sys.color.*` and `mcafee.color.extended.*`. The authoring layers
  `md.key.*`, `md.ref.palette.*`, `md.ref.brand.*`, `md.ref.type.font.*`, and `md.type.size.*` must
  never appear in UI code.
- **Spacing is a closed set of 15 steps** — `md.spacing.` 0/50/100/200/250/300/400/500/600/700/800/
  900/1000/1100/1200 = 0/2/4/8/10/12/16/20/24/28/32/36/40/44/48. `md.spacing.400` (16) is the
  default. Pick by relationship: 0–8 inside an element, 10–24 between elements, 28–48 between groups.
  An off-scale value means the wrong step, not a missing one. One owner per gap — never stack a
  parent's padding with a child's margin.
- **Radius:** 0, 2, 4, 6, 8, 12, 16, 24, 32, 36, 40, 48, 56, 64, **999**. `999` *is* the pill; never
  approximate one with a large fixed radius. **Border width:** 0, 1, 2, 3, 4.
- **Heavy** weight is `display` and `headline` only, promotional only. **Mono** (`label.mono.*`) is
  data values only, never on a control, prose, or heading.
- **Dark mode is a theme-mode swap.** Never hardcode a dark value; never branch on brightness at the
  usage site. A colour that looks wrong in dark mode means the wrong semantic role was chosen.

## Accessibility — non-negotiable

1. **48×48** minimum touch target, achieved with **padding**, never by enlarging a glyph, holding at
   200% text scale.
2. **Visible keyboard focus ring:** `md.sys.color.primary`, 2px, 2px offset, solid. **Keyboard
   only** — it must not appear after a plain mouse click. Never removed, narrowed, or recoloured.
3. Every interactive element expresses **hover, pressed, focus, and disabled**. There is no partial
   set.
4. **Never convey meaning by colour alone** — status dots, badges, severity, destructive actions,
   chart segments.
5. Meaningful icons have accessible names; decorative icons are hidden from assistive technology.
   **Icon-only controls need both an accessible label and a tooltip.**
6. Contrast: **4.5:1** normal text, **3:1** large text, **3:1** interactive and non-text.
7. **Nothing consequential lives only in a transient or hover-only surface.** Snackbars expire,
   tooltips vanish, scrollbars fade.
8. **Disabled elements leave the tab order** and receive no other state — 12% container / 38%
   content, derived from `on-surface`.
9. Keep the three string slots distinct: visible **label** (spoken) · **semantic label** (spoken;
   expands a too-terse label, never says something different) · **`automationIdentifier`** (never
   spoken, kebab-case, derived from purpose, **required** and asserted non-empty).
10. Never mutate a label to communicate progress ("Save" → "Saving…") — it changes the accessible
    name mid-interaction. Use the component's loading state.

## States

hover **8%** · focus **10%** · pressed **10%** · dragged **16%**. Additive when combined. Enabled is
the **absence** of a layer. Precedence: **disabled → pressed → focus → hover → enabled**.

The layer's **role** — `primary` / `secondary` / `neutral` / `error` — comes from the **action's
meaning**, not the element's current colour. A destructive text button still uses `error`.

**Selected is a separate axis**, not a competing state: a selected element still expresses hover,
focus, and pressed.

## Elevation

**Exactly three shadows, all zero-offset:** `subtle` (blur 4), `light` (blur 20), `heavy` (blur 25).
No fourth, no stacking, no interpolation.

**The most common correct answer is no shadow** — ask "does this need to lift at all?" first. One
shadow per surface; peers in a grid share it.

**Elevation is not tonal.** `md.sys.color.surface-container-*` is a container fill for tertiary UI,
not an elevation scale. Never `Material(elevation:)` or `Card(elevation:)`.

## Layout

Decide from the **content region**, never window width:

```
content = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (side panel, if present)
```

**Exactly two structural thresholds: 500 and 980.**

| Tier | Range | Columns | Nav | Secondary surface |
| --- | --- | --- | --- | --- |
| SM | 500–979 | 4 | overlay drawer | bottom sheet |
| MD / Default / Max | 980+ | 12 | persistent rail | side panel |

MD, Default, and Max are **structurally identical** — never branch among them. 1280 and 1440 are
window sizes, not breakpoints; the grid already capped at 992, so the content is identical and only
the margin differs. The SM transforms (rail→drawer, panel→bottom sheet, 12→4 columns) move together.

Grid: gutter and outer margin 16 at every tier. Caps at **992** `((12×68)+(11×16))` and centres — the
surplus margin is intentional, not something to fill. The rail (60) and side panel (386) are **fixed**
and sit **outside** the grid, as **siblings** of the content, not ancestors. Vertical rhythm: 24
between items, 30 at section boundaries. **No nested grid inside a card.** Never hardcode a card or
column width — derive it.

In Flutter, branch on `LayoutBuilder` / `constraints.maxWidth`. **Never
`MediaQuery.of(context).size.width` for a layout decision** (`MediaQuery` remains correct for safe
areas, insets, and text scale).

Components are **container-agnostic**: correct beside a 386 panel, inside a bottom sheet, and inside a
card, without knowing the window size. A component never takes a breakpoint tier as a parameter.

These layout numbers are **measured, not tokenized** — so never inline them at a call site.

## Choosing a component: route away first

Every component doc's `## Decision Tree` asks *"is this the right component at all?"* first, and its
most valuable answer is usually a different component — or none at all. Start at
`Skill DS/AI/component-router.md`.

The discriminators:

- **Act or navigate?** → `Button` vs a link (`Button` has no navigation role).
- **Does anything happen on click, or does it wait for Save?** → `Switch` vs `Checkbox`.
- **Would the user be stuck if they missed it?** → `Alert Banner` vs `Snackbar`.
- **Must the user respond before anything else can happen?** → `Modal` vs everything else. Usually
  no.
- **Do you know the fraction? the layout?** → `Progress Bar` vs `Skeleton Loader` vs `Loaders`.
- **Does the unfilled part mean "not yet"?** → `Progress Bar` has a **track**; the charts have none
  and their split *is* the message. `Progress Bar` and `Data Linear Chart` look identical and mean
  opposite things; `Data Arc Chart` is not a circular progress indicator.
- **Is anything inside it focusable?** → `Popover` vs `Tooltip`.
- **Exactly one, or zero-or-more?** → `Radio` vs `Checkbox`.
- **A count, a severity, a condition, or a category?** → notification badge (`Status Indicators`) vs
  `Badges` vs status label (`Status Indicators`) vs `Tags`. **Three different things are called
  "badge"** — if it holds a count, it is not `Badges`.

Correct terminations that leave the library: show the content · **nothing at all** (wait under
~300ms) · **no badge** (count is zero) · **no shadow** · spacing instead of a divider · a link · a
list · a table (charts past 4–5 parts) · pagination · a real screen · plain text.

## Variant and size come from the doc's stated input

Never from emphasis or taste:

- `Badges` `type` ← **the surface behind it**. `primary`'s near-white fill is invisible on light.
- `Accordion` type ← the **page background**.
- `Text Fields` `filled` vs `outlined` ← whether a four-sided stroke competes with a busy or coloured
  surface — and then **all** fields on that surface match. Never per-field.
- `Button` `ghost` ← it sits on **imagery or a gradient**. `strictBlack`/`strictWhite` ← the surface
  is **theme-independent** (on a themed surface, `strictWhite` can vanish).
- `Alert Card` layout ← **available width**: ≥480 expanded, 375–479 medium, <375 compact.
- Spacing step ← the **relationship band**. Type style ← what the text is **doing**.

Interlocks: one size per button group · exactly one `filled` button per surface · a standalone
`text`/`textNoPadding` button **must** carry a directional icon (those two variants have **no state
layer at all**) · `xsmall` drops to 12px type and is never a fix for a crowded layout · `Switch`
`small`'s hit region is under 48×48 · `Menu` `compact` rows are 40px, under the floor.

## Silent failures — these compile and do nothing

- `destructive` on `outline` / `ghost` / `textNoPadding` / `strict*` → **silently ignored**; renders
  an ordinary button you believe is destructive.
- `Peek Label` `inverse` + `offline` → the tone is **silently ignored**.
- `Expanded Card` with both `options` and `expandedContent` → **asserts**.
- A chart whose values sum to zero → renders **blank** rather than erroring. Check the sum at the
  call site and swap in an `Empty State`.
- Both chart **legends are not announced** — supply the breakdown yourself or the data is unavailable
  to screen-reader users.
- `Carousel` dots are **decorative**: not focusable, not tappable. If users must jump to an item, you
  build that control and inherit every obligation it carries.
- `Feedback`'s own visual change is **not acknowledgement** — the selected fill is nearly invisible.
  Acknowledge with a `Snackbar` or a follow-up.
- `Chat Bubble` does **not** own width constraint (~70–80%), per-sender alignment, sender attribution
  for assistive tech, timestamps, or entry animation. The conversation view does.
- A `Radio` never exists alone — the **group** owns selection, the name, and the default.

## Flutter binding (skip if this repo is not Flutter)

- **Pass `variant` and `size` explicitly.** `AsmButton` defaults to `variant: text, size: large`,
  while the documented guidance is `filled` and `medium`. Treat every `Asm*` default as untrusted
  until you've read that doc's parameter table.
- `automationIdentifier` is **required** and asserted non-empty — a snippet without it will not run.
- Disable by passing **`null`** to the handler. Never `Opacity`, `IgnorePointer`, `AbsorbPointer`, or
  an invented `disabled` flag.
- **Never** wrap an `Asm*` widget in your own `Semantics` or `GestureDetector` — it produces a
  competing announcement or a second, nameless tap target.
- No `Padding` wrapper to change a component's size (use its size step). No `TextStyle` override on a
  component that applies its own weight and leading. Don't override a button's shape — it is not
  configurable. Pass icons bare; no `size:` on a component slot.
- Resolve hover/press from `WidgetState`, not local `setState`.
- Gaps are owned by the parent (`Column(spacing:)` or explicit gaps), not by a margin on every child.
  Never `Spacer`/`Expanded` for a *defined* gap.
- Token access: `asmColorScheme(brightness:)`, `AsmTokens.of(context)`, `context.asmExtendedColors`,
  `context.asmStateColors`, `context.asmGradients`, `context.asmTokens.shadows`, `AsmSpacing.*`.

## React binding (skip if this repo is not React)

Sanctioned for **prototyping**, and **undocumented**. Everything above this section still applies —
the design law, the tokens, the accessibility floor, the layout model, the routing. What changes is
that you must **verify instead of assume**, and say which you did.

- **Read `Skill DS/AI/react-binding.md`.** It is the only written record of this binding.
- **Verify from the React source:** the component's name, its prop names and enum spellings, which
  variants and sizes exist, its prop defaults, and whether the component exists at all. Parity with
  Flutter is **not guaranteed** — `Button` documents 8 variants and 4 sizes in Flutter, and React's
  set is unverified until you read it.
- **Never write `Asm*`.** React uses a different prefix or plain names. Deriving a React name from a
  Flutter one is a blocker, not a guess.
- **Pass props explicitly.** React's defaults are distrusted for the same reason Flutter's are, with
  less documentation behind them.
- **Tokens come from the web build** of the same token source — same semantic names, mechanically
  renamed. Read the transform from the web token package, confirm it once, use it everywhere. No hex,
  no `rgb()`, no raw `px`/`rem`, no hand-written `box-shadow`, no split composite type token, no
  `outline: none`. A token missing from the web build is a **gap to report**, never licence to inline.
- **Layout still comes from the content region**, not the viewport. Use a container-based mechanism if
  one exists; if you can only query the viewport, say plainly that the layout breaks whenever a side
  panel is open.
- **Accessibility does not relax for a prototype.** The focus ring especially — it is the most common
  omission in generated web code and the most consequential.
- **Use the library.** Hand-rolling a component it already has is how a prototype becomes a fork.
- **A divergence from the doc is an open question, not a feature.** An extra prop is not a documented
  modifier; a missing variant is not a deprecation. The doc wins — file the difference.
- **Never port this to Flutter, and never cite it as evidence about the design system.** Label the
  output: *React prototype — sanctioned binding, not a production spec*, and state what you verified
  and what you couldn't.

## Do not suggest these — they do not exist

`AsmIcon` (use the framework `Icon`; `AsmIconButton` and `AsmIconContainer` do exist) ·
**`AsmPopover`** — `Popover` ships **no** implementation, the nearest being the private popup inside
`menu.dart` · **any reusable carousel** — only `AsmCarouselIndicator` / `AsmDotIndicator`; the one
working carousel is private to `Alert Card` · `AsmTopbar`.

**`AsmGuidedActionPanel` is the opposite case — it ships, but has no doc.** `guided_action_panel.dart`
is real and cited from three component docs. Use it; just don't expect documented guidance, and don't
infer its API from a neighbour. **Undocumented ≠ nonexistent**, and the two failure modes are
opposite: inventing a widget that doesn't exist, versus refusing to use one that does.

**`AsmNavigationRail.bottom` ships but is forbidden.** The rail docks **left at every tier**, without
exception — the system's only absolute placement rule. At SM it hides and returns as a left overlay
drawer over a scrim.

**Seven components have no doc:** `brand`, `feature banner`, **`guided action panel`**, `lists`,
`quick action`, `toggle groups`, **`topbars`**. Name the gap and offer the nearest documented
component; never improvise a spec from a neighbour. This holds in a prototype too — a prototype is
exactly where an invented component becomes precedent.

**Also: any `Asm*` name in a `.tsx` file.** Not a missing widget — the wrong vocabulary. `AsmButton`
is real, and real in Flutter only, which makes it easier to miss than an invented name.

## Also true

- `Tags` bodies are **never** pressable — only the `filter` variant's × is interactive.
- A whole card is never the tap target; put a real control inside it.
- Several `Alert Card`s never stack on one surface — "many alerts" is many items inside **one**.
- `Tabs` swap a region of one page. They are not navigation and not a filter. The selected tab already
  has only two of design's three signals — never remove another.
- A scrollbar inside a `Popover`, `Tooltip`, or `Modal` means the content outgrew the shape.
- Filled icons mean **selected**. Never for emphasis, never mixed with outlined in one group.
  Material Symbols Outlined, weight 400, sizes 16/20/24/40/48 from the pairing table. One concept,
  one glyph, product-wide — never rotated, flipped, or redrawn.
- Labels are **verb phrases** naming the action — never "OK", "Submit", "Yes", "Confirm". Destructive
  labels name what is destroyed ("Delete account"). Labels **never truncate**.
- An empty state says **why** it's empty and **what to do next**. "No data" says nothing, and
  "nothing matched" needs a different action from "nothing yet".
- A field's label **persists** once typing starts — never use the placeholder as the label.
- **There are no motion tokens.** Any duration, easing, or transition question has no answer in this
  system — say so.

## Before you hand anything back

Report four things: the **routing decision and why** (cite the doc) · the **variant/size choices and
the input each was decided from** · **every value as a token name** · **open items touched and
anything you could not verify**. An answer missing the last one is incomplete, not concise.

Never silently reconcile a conflict. Where Figma and the implementation disagree, surface both and
cite the open item. Figma is a lower authority than the implementation on what to type, and it
**rarely draws focus states** — a missing focus variant is a Figma gap, never permission to skip
focus. Names drift between the two: `Button`'s Figma `default` maps to code's **`small`**.
