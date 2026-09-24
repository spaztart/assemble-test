# Component: Navigation Rail

> Role: The application's primary navigation surface — a narrow, permanently left-docked column of icon-only destinations that moves the user between top-level pages. It is not a toolbar, not a page-level tab strip, and not a container for actions.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe where the rail goes, how it reacts to the space it is given, and what it must never be asked to do. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: **The rail is docked to the left edge and nowhere else, at every window size, without exception.** It is never moved to the right, never laid along the bottom, never floated into content, and never turned on its side. At the smallest tier it does not relocate — it *hides*, and returns as an overlay drawer from the same left edge.

## Overview

The rail is a 60pt-wide vertical strip pinned to the left edge of the application shell. Every destination in it is a 52 × 52 slot holding a single 20pt glyph and nothing else — no text, no counter, no caption. The name of a destination is only ever visible while the pointer or keyboard is on it, as a floating [[Peek Label]] chip to the *right* of the slot. The rail's entire job is to be the one place a user goes to change pages, and to occupy as little of the window as it can while doing it.

**The distinction most often got wrong is where the rail is allowed to be.** The rail has exactly one position. It is left-docked, full-height, and structural: [[Grid]] subtracts its 60pt from the window *before* any column math happens, so the content region is defined in terms of the rail's presence. Moving it anywhere else does not "reposition a component" — it invalidates the grid, and every card width on the page with it. Three consequences follow, and all three are load-bearing:

- **The rail never appears on the right.** The right edge of the shell is where the side panel lives (386pt, per [[Grid]]). Two fixed regions cannot share one edge.
- **The rail never becomes a bottom bar.** A horizontal strip along the bottom is a different navigation pattern with a different capacity, a different reading order, and no room for the peek chip that carries the destination names. The implementation ships a constructor that does exactly this; see [Variants](#variants) and [Open Items](#open-items) item 1. **Do not use it.**
- **At the smallest tier the rail disappears rather than relocating.** [[Breakpoints]] defines the transformation: the persistent rail is replaced by a menu affordance that opens a drawer over a dimmed scrim, and the content region reclaims the 60pt. The drawer floats in from the left, over the content, and closes again. See [The Small-Tier Form](#the-small-tier-form).

**The second distinction is rail versus [[Tabs]] versus a topbar.** All three are rows or columns of labelled targets with one marked active, and the difference is scope. The rail moves between *pages*. [[Tabs]] swap a region *inside* one page. A topbar carries the current page's title and its page-level actions. The test [[Tabs]] gives is the right one and it runs in reverse here: if switching the target changes the page title, the breadcrumb, or where the back button goes, it is navigation and it belongs in the rail.

**The third distinction is destination versus switch.** A slot can be a plain destination, or it can carry a coloured status dot and a hover chip that reads "Turn on Firewall" — at which point tapping the chip changes a product setting without navigating anywhere. These are two different controls wearing the same 52pt box, distinguished only by whether a status was supplied. The visual treatment of "selected destination" and "feature is on" also differ deliberately: a selected destination gets a **solid** brand fill, a feature that is on gets a **12%-alpha** brand gradient wash. Mixing them up produces a rail where the user cannot tell which page they are on. See [Modifiers](#modifiers).

## Anatomy

```
   ┌──────────┐   ← rail surface: 60 wide, radius 16, `surfaceBright`,
   │  ┌────┐  │      4pt padding on all sides, `light` elevation shadow
   │  │ 🛡  │  │   ← brand slot — pinned, never collapses, never scrolls
   │  └────┘  │
   │   ┆4┆    │
   │  ┌────┐  │
   │  │ ◻  │  │   ┐
   │  └────┘  │   │ top group — pinned to the top
   │   ┆4┆    │   │
   │  ┌────┐  │   │
   │  │ ◻  │  │   ┘
   │          │
   │  ┌────┐  │   ┐
   │  │ ◻  │  │   │ middle group — centred in the leftover space
   │  └────┘  │   ┘
   │          │
   │  ┌────┐  │   ┐
   │  │ ◻ ●│  │   │ bottom group — pinned to the bottom
   │  └────┘  │   ┘
   └──────────┘
        ↑
   the left edge of the application shell — always
```

A single slot, and the chip that names it:

```
   ┌───────────────┐                  ╭────────────────────────╮
   │  ┆4┆      ● ←─┼── 6pt status dot │   Identity monitoring  │
   │   ┌───────┐   │      at top 4    ╰────────────────────────╯
   │   │ glyph │   │      / right 4     ↑
   │   │ 20×20 │   │  ┆8┆              the peek chip — see [[Peek Label]]
   │   └───────┘   │   gap
   │  ┆4┆          │
   └───────────────┘
      52 × 52, radius 12
```

When the rail is too short for its destinations, the three groups flatten into one top-anchored stack and the tail folds away:

```
   ┌──────────┐
   │  [ 🛡  ]  │   brand — pinned
   │  [ ◻  ]  │   first destination — folds last
   │  [ ◻  ]  │
   │  [ ⋯ ●]  │   overflow — pinned; opens a menu to the RIGHT,
   └──────────┘   listing every hidden destination as icon + name
```

| Part | Required | Notes |
| --- | --- | --- |
| Rail surface | Yes | 60 wide (derived, not declared — see [Open Items](#open-items) item 17), radius 16, `surfaceBright`, 4pt inset, `light` elevation from [[Elevation]] |
| Brand slot | No | The McAfee shield in a 52 × 52 slot at the top. Decorative by default; becomes a selectable "home" destination when a handler is wired |
| Destination slot | At least one | 52 × 52, radius 12, one 20pt glyph centred, 4pt vertical padding |
| Status dot | No | 6pt indicator at top 4 / right 4 of the slot. Decorative — see [[Status Indicators]] |
| Peek chip | Automatic | Floats 8pt to the right of the hovered or keyboard-focused slot. Drawn by [[Peek Label]], positioned by the rail |
| Top / middle / bottom groups | No | Optional three-way split. Omit them and every destination becomes one top-anchored group |
| Overflow slot | Automatic | Appears only when the height cannot fit every slot. A `⋯` glyph plus an informational dot, opening a right-anchored [[Menu]] |
| Inter-slot gap | Fixed | 4pt, inserted by the rail. Callers cannot change it |

## Placement

**The rail occupies the left edge of the application shell and no other position exists.** This is not a default that a layout can override; it is the assumption the rest of the layout system is built on.

**It is a fixed structural region, not content.** [[Grid]] lists the rail at 60pt alongside the 16pt outer margin and the 386pt side panel, and requires that it be subtracted before columns are computed. All flex is absorbed by the content columns; resizing the window changes card widths and never changes the rail. The rail is deliberately *outside* the grid — it is not a column and must never be treated as one.

**It is full-height and it does not scroll.** Every destination the tier can show is visible at once, and the ones that cannot fit are reachable through the overflow menu rather than by scrolling. A rail the user has to scroll has failed at being a fixed reference point.

**The 8pt peek chip opens rightward, and that is only safe because the rail is on the left.** The chip has no maximum width and does not wrap ([[Peek Label]]) — it grows to whatever the destination name needs. On the left edge it grows into the content region, where there is a whole viewport of room. On the right edge it would grow off-screen; along the bottom it would collide with its neighbours, which is precisely why the bottom-docked constructor suppresses the chip entirely and leaves its destinations with no visible names at all.

**The overflow menu also opens rightward,** anchored to the top of the `⋯` slot. Same reasoning, same dependency on the left edge. [[Menu]] documents this anchor and names the rail's overflow slot as its motivating case.

**Never place anything between the rail and the left edge.** No margin, no gutter, no decorative strip. The rail is the leftmost interactive surface in the shell.

## The Small-Tier Form

At the smallest tier the rail is **not present on screen**. [[Breakpoints]] owns the transformation and states it plainly: the persistent 60pt rail is replaced by a menu affordance that opens a drawer over a dimmed scrim, the drawer floats above content rather than displacing it, and the content region reclaims the 60pt.

What that means in practice:

- **The rail is hidden until the user opens it.** There is no permanently visible navigation surface at this tier. The user taps an affordance — conventionally in the topbar — and navigation arrives.
- **It arrives from the left.** The drawer is a left-docked overlay. Its corner radius makes the dependency literal: only its two *trailing* corners are rounded, because its leading edge is flush against the left edge of the screen. A right-docked drawer would need the mirror image and is not what this component draws.
- **It floats over content, it does not push it.** Nothing reflows when the drawer opens. The scrim behind it comes from [[Color]]; the drawer's own lift comes from [[Elevation]].
- **It shows names, not just glyphs.** The overlay has room, so the drawer's rows are icon-plus-label rows with a trailing forward arrow, grouped under uppercase mono category headers. The peek chip has no role here — the names are already visible.
- **It scrolls.** Unlike the rail, the drawer's body is a scroll region, so every destination stays reachable at small heights and large text scales. A footer group (a single "Sign out" row, typically) pins outside the scroll region at the bottom.

The drawer's own anatomy:

```
   ┌────────────────────────────────╮
   │   McAfee wordmark             │  ← header, replaceable
   │                                │
   │  CATEGORY                     │  ← uppercase mono header, hairline rule
   │  ┌──────────────────────────┐ │
   │  │ ◻   Protection        →  │ │  ← row: 24pt icon, name, 24pt arrow
   │  └──────────────────────────┘ │
   │  ┌──────────────────────────┐ │
   │  │ ◻   Devices           →  │ │
   │  └──────────────────────────┘ │     scrolls
   │  CATEGORY                     │
   │  ...                          │
   │                                │
   │  ┌──────────────────────────┐ │
   │  │ ◻   Sign out          →  │ │  ← footer, pinned outside the scroll
   │  └──────────────────────────┘ │
   └────────────────────────────────╯
    ↑ flush with the left edge      ↑ only these corners are rounded
```

**The mechanism around the drawer is the consumer's, and that is a gap.** The panel is implemented; the open/closed state, the menu affordance that triggers it, the scrim, the slide-in, the focus trap, and dismissal on Escape or scrim tap are not. Every product that needs the small-tier form builds them, and they will diverge. See [Open Items](#open-items) item 2.

## Variants

There are three constructors. Only one of them is permitted by this doc's placement rule.

| Variant | Orientation | Capacity | Use it? |
| --- | --- | --- | --- |
| Side rail *(default)* | Vertical, left-docked | Unbounded; the tail folds into an overflow menu | **Yes** — this is the component |
| Bottom nav | Horizontal, bottom-docked | Three slots total, brand included | **No** — see below |
| Collapsible *(deprecated)* | Vertical, left-docked | Same as the default | **No** — a compatibility alias only |

### The bottom-nav variant, and why it is not an option

The implementation ships a horizontal constructor that renders the same 52 × 52 slots in a left-aligned row with 4pt gaps, capped at three slots including the brand. It is described in the source as the "mobile / compact" form. **It contradicts this component's placement rule, and it also contradicts [[Breakpoints]],** which defines the small-tier treatment as an overlay drawer over a scrim — not a bottom bar. It is additionally the only part of the component with no Figma frame or node cited, while the side rail cites `10293:15244` and the overflow menu cites `8946:4908`.

It is not merely off-spec, it is degraded: because a rightward chip would collide with the next slot, the variant **disables the peek label entirely**. Its destinations therefore have no visible names, ever — three unlabelled glyphs with no way to discover what they do short of tapping them. The screen-reader name survives; the sighted name does not.

Recorded as [Open Items](#open-items) item 1. Use the drawer form described in [The Small-Tier Form](#the-small-tier-form) instead.

### The deprecated collapsible variant

Height-aware collapse used to be opt-in and is now unconditional for every vertical rail. The old constructor remains as a thin alias that forwards the same ordered destination list to the same engine. It exists so existing call sites keep compiling. Migrate them; do not write new ones.

## Modifiers

Four per-slot flags cut across every destination. They interact, and the interactions are where mistakes happen.

| Modifier | Effect | Notes |
| --- | --- | --- |
| `active` | Marks the slot as the current one | Rendering depends on whether a status is present — see below |
| `status` | Adds a 6pt dot and, implicitly, turn-on/turn-off behaviour | Presence of a status is what makes a slot a switch rather than a destination |
| `disabled` | 38% glyph opacity, no fill, no chip, no taps, "not allowed" cursor, announced disabled | Removes the slot from the tab order |
| `loading` | Replaces the dot with a small spinner and makes the slot inert | Also removes it from the tab order, and is indistinguishable from `disabled` to a screen reader |

**Active renders two completely different ways, and which one you get is decided by `status`.**

- A **plain destination** that is active gets a **solid** brand fill with a light glyph. This is the "you are here" signal, and exactly one slot in the rail should ever carry it.
- A slot **with a status** that is active gets a **12%-alpha brand gradient wash** instead, and keeps an informational dot. This is the "this feature is on" signal, and any number of slots can carry it at once.

The switch between them is silent and derived. Add a `status` to a plain destination and its selected state quietly changes from a solid fill to a faint wash — which reads as "on", not as "current page". If a slot is a navigation destination, do not give it a status.

**Disabled and loading both remove the slot from keyboard traversal.** A destination that becomes `loading` while it holds focus drops out of the tab order under the user, and the spinner is not announced. Prefer leaving a slot enabled and handling the in-flight state on the destination page.

## Height and Collapse

The rail is height-aware by construction, and this is the behaviour most often misconfigured.

**Every slot is a known size, so the fit is computed rather than measured.** A slot is 52pt and the gap between slots is 4pt, so a stack of `s` slots needs `s × 52 + (s − 1) × 4`. The rail inverts that: the number of slots that fit in the height it has been handed is

```
capacity = floor((available height + 4) / 56)
```

**One of two layouts is then chosen, per layout pass:**

- **Everything fits** — the three groups are spread apart: brand and the top group pinned to the top, the middle group centred, the bottom group pinned to the bottom. This is the design's normal rail.
- **It does not fit** — the groups flatten into a single top-anchored stack in top → middle → bottom order, and the lowest-priority tail folds into one `⋯` overflow slot. Tapping or keyboard-activating it opens a right-anchored [[Menu]] listing every hidden destination as an icon-plus-name row, so nothing is ever clipped or unreachable.

**Order is priority.** The flattened top → middle → bottom sequence *is* the collapse order, tail-first: the last bottom-group destination folds first, bottom folds before middle, middle folds before top, and the first destination folds last. Put the destinations the user needs most at the front. The brand slot and the `⋯` slot are pinned and never fold.

**The collapse is fully reactive — there is nothing to listen for.** It recomputes on every layout pass, so it folds and unfolds live as the window is resized vertically.

**But it only reacts if something bounds the height.** The rail's nominal height is a **maximum**, not a fixed size. It fills the height its parent gives it, capped at that maximum. So:

| Parent | What happens |
| --- | --- |
| Bounds the height to the viewport — the shell's body region, an expanded child of a column, a positioned element with both a top and a bottom | The rail sees the live viewport height and the tail folds and unfolds as the window resizes. **This is the correct setup.** |
| Is tall or unbounded — a scroll region, a centring wrapper, a row or column that does not constrain height | The rail renders at its full nominal height and **nothing ever collapses**, no matter how small the window gets |
| Bounds the height, and the cap is removed | The rail simply fills the parent |

A rail that never collapses is almost always a rail whose parent does not bound its height. That is the single most common way to get this component wrong.

## States

The rail follows [[States]] for its state layers and focus treatment. Only the divergences are documented here.

| State | Treatment | Divergence |
| --- | --- | --- |
| Rest | No fill | — |
| Hover | Neutral hover state layer behind the glyph, plus the peek chip | The 52pt box never grows — hover changes the fill only |
| Keyboard focus | Neutral focus state layer, **plus** the branded focus ring, **plus** the peek chip | Figma's `state=focus` symbol draws only the neutral fill and no ring. The ring is a deliberate, signed-off override, because that fill is effectively invisible in both themes. See [Open Items](#open-items) item 14 |
| Pressed | A brief scale-**down** of the whole slot, springing back on release | The rail has **no pressed state layer**. Press is communicated by motion alone, which means it does not exist for a user who has reduced motion enabled |
| Selected (destination) | Solid brand fill, light glyph, no dot | — |
| On (status slot) | 12%-alpha brand gradient wash at 60°, plus an informational dot | — |
| Disabled | 38% glyph opacity only — no fill, no gradient | Diverges from [[States]] in that nothing but the glyph changes |
| Loading | Spinner in place of the dot; hover, taps and the toggle chip all suppressed | Not a [[States]] role. Announced identically to disabled |

**State precedence is fixed and not obvious.** Evaluated in order: disabled → selected-destination → hover → focus → on → rest. Hover therefore *overrides* the "on" gradient: hovering a switched-on feature replaces its gradient with the neutral hover fill, so the "on" signal disappears for as long as the pointer is over it. The dot remains, and is the only surviving indication.

**High contrast adds a solid 2pt outline** in the glyph colour to any state that otherwise relies on a faint low-alpha fill — hover, focus, and "on". The solid brand-filled selected state needs no outline and gets none, and the brand colour itself is centrally remapped to the operating system's highlight pair, so a selected destination uses the platform's own selection colour rather than a custom red. The one gap: the `⋯` overflow slot outlines on hover but **not** on focus, so a keyboard user in high contrast gets no outline there. See [Open Items](#open-items) item 13.

## Behaviors

**The rail can own selection, or the caller can.** Supply each destination with a stable id and hand the rail the currently-selected id plus a selection callback, and it derives every slot's active state and wires every tap itself. Explicit per-slot values still win, which is how the two modes coexist — and also how two slots can end up brand-filled simultaneously if a caller sets one explicitly while the rail selects another. See [Open Items](#open-items) item 7.

**The brand slot is decorative by default and becomes a destination when you wire it.** Left alone it is a logo, announced as an image, always in the solid brand fill. Give it a handler — or let the rail manage selection — and it becomes a real selectable destination with focus, keyboard activation, and its own peek chip, and it is treated as the "home" destination that is selected when nothing else is.

**The peek chip appears on hover, and on keyboard focus — but only on genuine keyboard traversal.** The distinction matters: focus is also *restored* to whatever was focused before a menu or dialog opened, and a chip popping up unbidden after a popup closes is noise. The rail suppresses that case by requiring that the most recent input actually was a key press. Closing a popup with the mouse leaves the chip hidden; tabbing back in surfaces it.

**Keyboard traversal is contained.** Tab moves through the rail's slots as a single group in visual top-to-bottom order, then leaves for the next region of the app — rather than bouncing between the rail and adjacent content. Enter, Space, and numpad Enter all activate a slot.

**A status slot's hover chip becomes a control.** Instead of the destination's name, the chip reads "Turn on *X*" or "Turn off *X*", and tapping it toggles the feature. The chip's hit area deliberately includes the 8pt gap so the pointer can travel from slot to chip without the chip vanishing. **This is a pointer-only affordance** — it is not announced, and pressing Enter on the slot navigates instead of toggling. See [Open Items](#open-items) item 4.

**The toggle keeps its own local state, permanently.** Once the user toggles a feature from the chip, the rail's own record of that slot's state overrides whatever the caller passes from then on. A caller that later re-renders the slot with a different value will find it ignored. See [Open Items](#open-items) item 6.

**Motion honours the reduced-motion preference.** Both the fill crossfade and the press scale collapse to zero duration when it is set, per WCAG 2.3.3. The consequence, noted above, is that the press feedback disappears entirely rather than degrading — the press has no non-motion channel.

**The rail is immune to text scale, and the overflow menu is not.** There is no text in the rail, so the 52pt slot, the 20pt glyph, the 4pt gaps, and therefore the computed capacity are all identical at every text size. The peek chip and the overflow menu rows *do* scale, because they carry text; [[Peek Label]] and [[Menu]] own that behaviour.

**Over-filling is clipped, not reported.** The rail clips its own content to its rounded surface so that too many slots for the available height fail silently rather than throwing. At very short heights this hides the `⋯` slot itself — see [Open Items](#open-items) item 8.

## Content

**A destination name is one or two words.** It is the only text the component has, it appears in a chip with no maximum width and no wrapping, and it doubles as the accessible name. "Identity monitoring" is the upper bound of what is comfortable. A phrase, a sentence, or a name with a parenthetical belongs somewhere else.

**Name the destination, not the action.** "Devices", not "View devices". The rail is a place, not a verb.

**Every slot must have a name, and there is no default.** The component supplies no fallback and rejects an empty one, because the name is the slot's accessible name and a glyph on its own is not a label. If a destination genuinely has no name, it is not a destination.

**Provide a separate spoken name only when the visible one is too terse.** Expanding an abbreviation is the case this exists for. Otherwise the visible chip and the announced name are the same string, which is the desired outcome.

**Toggle phrasing is templated and localized.** The chip composes "Turn on *X*" / "Turn off *X*" from a localized template around the feature name — available in 29 locales. Override the whole phrase only when the template cannot produce correct grammar for a given feature, and override it in every locale you ship, not just English.

**The overflow slot's name is "More", localized.** Override it only if a product has a more specific word for the same thing; do not overload it with a count.

## Decision Tree

```
Is this app-level navigation between top-level pages?
├── No — it swaps a region inside a single page ──────→ use [[Tabs]]
├── No — it is the current page's title or actions ───→ use a topbar
├── No — it is a list of links inside page content ───→ use [[Button]] links or a list
├── No — it is a menu opened from a trigger ──────────→ use [[Menu]]
└── Yes
    │
    ├── Where does it go?  ← there is only one answer
    │   └── The LEFT edge of the shell. Always. Never right,
    │       never bottom, never floated into content.
    │
    ├── Which tier is the window in? (see [[Breakpoints]])
    │   ├── SM ─────────→ the rail is HIDDEN. Provide a menu affordance
    │   │                 that opens the left overlay drawer over a scrim.
    │   │                 Do NOT use the bottom-nav constructor.
    │   └── MD and up ──→ the persistent side rail, 60pt, docked left
    │
    ├── How are destinations arranged?
    │   ├── Some belong at the very bottom (account, notifications)
    │   │                   ──────────────→ use the three groups
    │   └── They are one flat, priority-ordered list
    │                       ──────────────→ pass one ordered list;
    │                                       the last entry folds first
    │
    └── What kind of slot is each destination?
        ├── Goes to a page ─────────────────→ id + name + glyph
        ├── Goes to a page and has state to
        │   report (a warning, an alert) ───→ add a status dot
        └── Switches a feature on and off,
            without navigating ─────────────→ add a status dot and the
                                              turn-on / turn-off handlers
                                              (pointer-only — see item 4)
```

## Accessibility

| Requirement | How the rail meets it |
| --- | --- |
| Every destination has an accessible name | The name is required and rejected if empty. There is no default and no way to omit it |
| Only labelled destinations can be placed in the rail | Enforced, not advised: passing any other widget into a slot list throws a descriptive error in debug builds rather than rendering an unlabelled control |
| Correct role | Each slot is announced as a button, reporting its selected state and whether it is enabled |
| Keyboard operable | Tab reaches every enabled slot as one contained group in visual order; Enter, Space, and numpad Enter activate |
| Visible focus indicator | The branded focus ring, on every interactive slot including the brand slot and the overflow slot. This overrides Figma, which draws no ring |
| Keyboard-only focus indicator | A pointer click does not light the ring |
| Touch target ≥ 48 × 48 | Every slot is 52 × 52, comfortably over the 48 required by [[Icons]] |
| Non-colour signal for state | A selected destination is a solid fill *and* a shape change in the glyph's contrast; a status is a dot *and* the chip's turn-on/turn-off phrasing. Colour is never the only channel — except for the "on" gradient wash, whose only companion signal is the dot |
| Decorative parts silenced | The status dot, the loading spinner, the brand glyph, and the peek chip are all excluded from the accessibility tree, because each one repeats something the slot already announces |
| Reduced motion | Both animations collapse to zero duration |
| High contrast | Faint fills are backed by a solid 2pt outline; the brand colour is remapped to the platform highlight pair. One exception — the overflow slot's focus state |
| Every interactive part has a stable automation id | Slots, the brand slot, the overflow slot, and each overflow menu row all carry one, with per-index fallbacks. The rail surface itself does not |

**Component-specific obligations on the consumer:**

- **The rail is not announced as a navigation landmark.** It has no container semantics and no region name, so a screen-reader user cannot jump to navigation as a landmark — they can only find the buttons individually. The drawer form *does* announce itself as a labelled navigation region. Until the rail does the same, wrap it in a labelled navigation region yourself. See [Open Items](#open-items) item 3.
- **The turn-on / turn-off toggle is unreachable without a pointer.** If a feature can only be switched from a rail slot, it cannot be switched by a keyboard or screen-reader user at all. Provide the same control somewhere reachable — a settings page, a [[Switch]] on the destination page — and treat the rail chip as a shortcut, never as the only path.
- **Give every slot a unique automation id.** The default is shared across every slot in the rail, so an automation suite cannot tell them apart. Compose one from the destination name.
- **Do not let a focused slot become loading.** It leaves the tab order silently and the spinner is not announced.
- **The overflow menu is the only path to a hidden destination.** Anything that prevents it opening — a stacking context that clips overlays, a parent that swallows the tap — makes those destinations unreachable rather than merely inconvenient.

## Anti-Patterns

**❌ Docking the rail to the right, the bottom, or anywhere but the left.** [[Grid]] subtracts a left-edge 60pt region before computing columns, and the peek chip and overflow menu both open rightward on the assumption that content is to the right. → Dock it left, at every tier, without exception.

**❌ Using the bottom-nav constructor for the small tier.** It contradicts the placement rule and [[Breakpoints]], cites no Figma frame, caps you at three destinations, and suppresses the peek chip so its destinations have no visible names. → Hide the rail and open the left overlay drawer instead.

**❌ Treating the rail as a grid column.** It is a fixed region outside the grid. → Subtract its 60pt from the window before any column math, per [[Grid]].

**❌ Putting the rail inside a scroll region, a centring wrapper, or an unconstrained row.** Nothing bounds its height, so the collapse engine never fires and the rail renders at full height regardless of the window. → Give it a parent that bounds the height to the viewport.

**❌ Pinning the rail to a fixed height to "make it stable".** The nominal height is a maximum for exactly this reason. Pinning it re-creates a rail that ignores the window. → Leave the height to the parent.

**❌ Making the rail scrollable so more destinations fit.** A navigation surface the user has to scroll is no longer a fixed reference point, and the overflow menu already solves this without clipping anything. → Order the destinations by priority and let the tail fold.

**❌ Ordering destinations by grouping convenience rather than importance.** The flattened order is the collapse order. Whatever you put last disappears first. → Put the most-used destinations at the front.

**❌ Adding a status dot to a plain navigation destination.** It silently converts the slot's selected treatment from a solid brand fill to a faint 12% wash, and switches on a turn-on/turn-off chip the destination has no use for. → Use a status only on slots that genuinely represent a feature's state.

**❌ Making a rail-slot toggle the only way to switch a feature.** The chip is pointer-only and unannounced. → Duplicate the control somewhere keyboard-reachable.

**❌ Putting a raw icon, an icon button, or a container into a slot list.** It throws — the rail refuses to render an interactive slot it cannot label. → Wrap it in a proper destination with a name.

**❌ Writing a sentence as a destination name.** The chip has no maximum width and does not wrap, so it grows until it runs out of window. → One or two words. Use a [[Tooltip]] elsewhere if something needs explaining.

**❌ Overriding the rail's fill, radius, padding, or shadow to fit a screen.** Those escape hatches exist for the design system, not for products. Every override is a value that stops tracking [[Color]], [[Spacing]], and [[Elevation]] the moment either changes. → Leave them alone.

**❌ Inserting spacers between slots to adjust rhythm.** They are accepted and then discarded; the rail inserts its own 4pt gaps. → Accept the 4pt gap.

**❌ Using the deprecated collapsible constructor in new code.** Every vertical rail collapses by default now. → Use the default constructor with the same ordered list.

**❌ Relying on the press animation as the only press feedback.** It is a scale change with no state-layer companion, so it does not exist under reduced motion. → Do not build interactions that depend on the user perceiving the press.

**❌ Announcing the status dot or the peek chip.** Both repeat what the slot already says, and both are already silenced. Re-adding semantics produces a double announcement. → Leave them decorative; fix the slot's name if the announcement is wrong.

---

## Flutter Usage

The rail is `AsmNavigationRail` and its slots are `AsmNavigationRailItem`, both in `lib/asm/components/navigation_rail.dart`. The small-tier drawer form is `AsmNavDrawer`, with `AsmNavSection`, `AsmNavCategoryHeader`, and `AsmNavListItem`, in `lib/asm/components/nav_drawer.dart`.

Icons are supplied as a builder rather than a widget, so the rail owns the size and colour:

```dart
typedef AsmNavigationRailIconBuilder = Widget Function(double size, Color color);
```

### Basic usage — rail-managed single select

This is the recommended shape. Give every destination an `id`, pass `selected` and `onDestinationSelected`, and the rail derives each slot's `active` and wires each `onPressed` itself.

```dart
class _ShellState extends State<Shell> {
  String _selected = AsmNavigationRail.brandSelectionId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          AsmNavigationRail(
            brand: true,
            selected: _selected,
            onDestinationSelected: (id) => setState(() => _selected = id),
            items: [
              AsmNavigationRailItem(
                id: 'protection',
                label: 'Protection',
                icon: (size, color) =>
                    Icon(Icons.shield_outlined, size: size, color: color),
                automationIdentifier: 'nav-rail-protection',
              ),
              AsmNavigationRailItem(
                id: 'devices',
                label: 'Devices',
                icon: (size, color) =>
                    Icon(Icons.devices_outlined, size: size, color: color),
                automationIdentifier: 'nav-rail-devices',
              ),
              AsmNavigationRailItem(
                id: 'account',
                label: 'Account',
                icon: (size, color) => Icon(
                  Icons.account_circle_outlined,
                  size: size,
                  color: color,
                ),
                automationIdentifier: 'nav-rail-account',
              ),
            ],
          ),
          const Expanded(child: _PageContent()),
        ],
      ),
    );
  }
}
```

`Scaffold.body` bounds the height, so the default `height: 792` acts as a cap and the tail folds and unfolds as the window is resized vertically. Do not wrap the rail in `Expanded` — it uses `IntrinsicWidth` so its width hugs its content at 60.

### Three-group layout

Use `topChildren` / `middleChildren` / `bottomChildren` when some destinations must sit at the bottom edge. When the rail fits, the groups are spread with `MainAxisAlignment.spaceBetween`; when it does not, they flatten top → middle → bottom and the tail folds.

```dart
AsmNavigationRail(
  brand: true,
  selected: _selected,
  onDestinationSelected: (id) => setState(() => _selected = id),
  topChildren: [
    AsmNavigationRailItem(
      id: 'protection',
      label: 'Protection',
      icon: (s, c) => Icon(Icons.shield_outlined, size: s, color: c),
      automationIdentifier: 'nav-rail-protection',
    ),
  ],
  middleChildren: [
    AsmNavigationRailItem(
      id: 'scan',
      label: 'Scan',
      icon: (s, c) => Icon(Icons.qr_code_scanner, size: s, color: c),
      automationIdentifier: 'nav-rail-scan',
    ),
  ],
  bottomChildren: [
    AsmNavigationRailItem(
      id: 'account',
      label: 'Account',
      icon: (s, c) => Icon(Icons.account_circle_outlined, size: s, color: c),
      automationIdentifier: 'nav-rail-account',
    ),
  ],
)
```

`items` and the group parameters are mutually exclusive, and so are `children` and the group parameters; both are asserted.

### A slot that switches a feature

Supplying `status` turns the slot into a switch: the dot appears, and the hover chip becomes "Turn on Firewall" / "Turn off Firewall". Because the chip is pointer-only, mirror the control somewhere keyboard-reachable.

```dart
AsmNavigationRailItem(
  label: 'Firewall',
  icon: (s, c) => Icon(Icons.security_outlined, size: s, color: c),
  status: _firewallOn
      ? AsmStatusIndicatorStatus.success
      : AsmStatusIndicatorStatus.warning,
  active: _firewallOn,
  turnOnTarget: 'Firewall',
  onTurnOn: _enableFirewall,
  onTurnOff: _disableFirewall,
  automationIdentifier: 'nav-rail-firewall',
)
```

Do **not** also give this slot an `id`. A switch is not a navigation destination, and a status slot's active treatment is the 12% gradient wash rather than the solid selected fill.

### The small-tier drawer

`AsmNavDrawer` is the panel only. The affordance, the scrim, the animation, and dismissal are the consumer's — Flutter's `Scaffold.drawer` supplies the scrim and the slide-in, which is the least-divergent way to wire it.

```dart
Scaffold(
  drawer: AsmNavDrawer(
    sections: [
      AsmNavSection(
        title: 'Protection',
        items: [
          AsmNavListItem(
            label: 'Devices',
            icon: Icons.devices_outlined,
            onPressed: () => _go('devices'),
            automationIdentifier: 'nav-drawer-devices',
          ),
          AsmNavListItem(
            label: 'Scan',
            icon: Icons.qr_code_scanner,
            onPressed: () => _go('scan'),
            automationIdentifier: 'nav-drawer-scan',
          ),
        ],
      ),
    ],
    footer: AsmNavSection(
      items: [
        AsmNavListItem(
          label: 'Sign out',
          icon: Icons.logout,
          showTrailingIcon: false,
          onPressed: _signOut,
          automationIdentifier: 'nav-drawer-sign-out',
        ),
      ],
    ),
  ),
  body: const _PageContent(),
)
```

Pick between the rail and the drawer on the tier, per [[Breakpoints]] — not on `MediaQuery` height, and not on whether a pointer is attached.

### `AsmNavigationRail` — full parameter reference

The default (vertical) constructor. `width` is not exposed; the rail's 60 is derived from the slot extent plus its 4pt padding.

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `items` | `List<AsmNavigationRailItem>?` | No | `null` — preferred input; one flat priority-ordered list |
| `children` | `List<Widget>?` | No | `null` — legacy flat list; becomes the top group |
| `topChildren` | `List<Widget>?` | No | `null` |
| `middleChildren` | `List<Widget>?` | No | `null` |
| `bottomChildren` | `List<Widget>?` | No | `null` |
| `selected` | `String?` | No | `null` — when the rail manages selection, `null` selects the brand slot |
| `onDestinationSelected` | `ValueChanged<String>?` | No | `null` |
| `brand` | `bool` | No | `false` |
| `onBrandPressed` | `VoidCallback?` | No | `null` — omit and the brand slot is decorative |
| `brandActive` | `bool` | No | `false` |
| `brandSemanticLabel` | `String` | No | `'McAfee'` |
| `brandAutomationIdentifier` | `String` | No | `'asm-navigation-rail-brand'` |
| `height` | `double?` | No | `792` — a **maximum**, not a fixed height. `null` removes the cap |
| `padding` | `EdgeInsetsGeometry?` | No | `null` → `spacing100` (4) on all sides |
| `backgroundColor` | `Color?` | No | `null` → `colorScheme.surfaceBright` |
| `borderRadius` | `BorderRadiusGeometry?` | No | `null` → `cornerLarge` (16) |
| `boxShadow` | `List<BoxShadow>?` | No | `null` → zero-offset, 20 blur, in the shadow colour |
| `overflowLabel` | `String?` | No | `null` → the localized "More" |
| `overflowAutomationIdentifier` | `String` | No | `'asm-navigation-rail-overflow'` |

`AsmNavigationRail.bottom` replaces `height` with `width`, requires `children`, defaults `brand` to `true`, asserts at most three slots including the brand, and drops the overflow parameters. **Do not use it** — see [Variants](#variants).

`AsmNavigationRail.collapsible` is deprecated and forwards `items` to the default constructor.

### `AsmNavigationRailItem` — full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | **Yes** | — asserted non-empty |
| `icon` | `AsmNavigationRailIconBuilder` | **Yes** | — called with `20` and the resolved colour |
| `id` | `String?` | No | `null` — required to join rail-managed selection; asserted non-empty |
| `semanticLabel` | `String?` | No | `null` → `label` |
| `status` | `AsmStatusIndicatorStatus?` | No | `null` — supplying one makes the slot a switch |
| `active` | `bool` | No | `false` |
| `disabled` | `bool` | No | `false` |
| `onPressed` | `VoidCallback?` | No | `null` |
| `turnOnTarget` | `String?` | No | `null` → `label` in the chip phrase |
| `turnOnLabel` | `String?` | No | `null` → the localized `Turn on {feature}` |
| `turnOffLabel` | `String?` | No | `null` → the localized `Turn off {feature}` |
| `onTurnOn` | `VoidCallback?` | No | `null` |
| `onTurnOff` | `VoidCallback?` | No | `null` |
| `loading` | `bool` | No | `false` |
| `automationIdentifier` | `String?` | No | `null` → the shared `'asm-navigation-rail-item'` |

### `AsmNavDrawer` — full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `sections` | `List<AsmNavSection>` | **Yes** | — the scrollable body |
| `footer` | `AsmNavSection?` | No | `null` — pinned outside the scroll region |
| `header` | `Widget?` | No | `null` → the McAfee wordmark |
| `semanticLabel` | `String?` | No | `null` → the localized "Navigation" |

`AsmNavSection` takes `items` (required) and an optional `title` that renders an `AsmNavCategoryHeader`. `AsmNavListItem` takes `label` and `onPressed` (both required; a `null` handler renders and announces the row as disabled), plus `icon`, `trailingIcon` (default `Icons.arrow_forward`), `showTrailingIcon` (default `true`), `semanticLabel`, and `automationIdentifier`.

### Guidance

- **Give the rail a height-bounded parent and leave `height` alone.** `Scaffold.body`, `Expanded` inside a `Column`, `SizedBox.expand`, or a `Positioned` with both `top` and `bottom`. Under a `SingleChildScrollView`, a `Center`, or an unconstrained `Row`, the collapse engine never fires.
- **Never wrap the rail in `Expanded`.** `IntrinsicWidth` already sizes it to 60.
- **Prefer `items` with `selected` + `onDestinationSelected`** over per-slot `active` / `onPressed`. It is less code and it is what keeps exactly one slot brand-filled — mixing the two is how you get two.
- **Set `automationIdentifier` on every slot.** The default is shared, so automation cannot distinguish slots without it. Compose it from the destination name.
- **Pass the icon builder's `size` and `color` straight through.** Hardcoding either breaks dark mode, the selected-state glyph flip, and the overflow menu's 24pt reuse of the same builder.
- **Do not pass `SizedBox` spacers.** They are accepted by the validator and then discarded; the rail inserts its own 4pt gaps.
- **Leave `padding`, `backgroundColor`, `borderRadius`, and `boxShadow` unset in product code.** They exist so the design system can retheme the rail centrally.
- **Do not add `Semantics` around a slot, the dot, or the chip.** The slot already announces itself and the decorative parts are already excluded; adding more produces a double announcement.
- **Wrap the rail in a labelled navigation region until it provides one.** `AsmNavDrawer` does this itself; `AsmNavigationRail` does not.
- **Choose the rail or the drawer on the [[Breakpoints]] tier**, and render exactly one of them at a time.

---

## Rules

1. The rail MUST be docked to the **left edge** of the application shell, at every window size, with no exception. It MUST NEVER be placed on the right, along the bottom, floated into content, or rotated.
2. At the smallest tier the rail MUST be **hidden until the user opens it**, and MUST return as a left-docked overlay drawer over a dimmed scrim, per [[Breakpoints]]. It MUST NEVER be relocated to a different edge instead.
3. The bottom-nav constructor MUST NEVER be used. It contradicts rule 1, contradicts [[Breakpoints]], cites no Figma frame, and suppresses the peek chip so its destinations have no visible names.
4. The rail's 60pt MUST be subtracted from the window before any column math, per [[Grid]]. It MUST NEVER be treated as a grid column.
5. Nothing MUST be placed between the rail and the left edge of the shell.
6. The rail MUST be given a parent that bounds its height to the viewport. Its height parameter is a **maximum**, not a fixed size, and MUST NEVER be pinned to force a layout.
7. The rail MUST NEVER be made scrollable. Destinations that do not fit MUST reach the user through the overflow menu.
8. Destinations MUST be ordered by priority, because the order is the collapse order and the last entry folds first.
9. The brand slot and the overflow slot MUST NEVER be collapsed, reordered, or replaced.
10. Every slot MUST carry a non-empty name. There is no default, and an unnamed slot MUST NEVER be rendered.
11. A destination name MUST be one or two words. It MUST NEVER be a sentence — the chip has no maximum width and does not wrap.
12. Only proper labelled destinations (or inert spacers) MUST be placed in a slot list. Raw icons, icon buttons, and containers MUST NEVER be, and are rejected at build time.
13. Exactly one destination MUST be marked as the current one at a time. Rail-managed selection MUST be preferred over per-slot flags, and the two MUST NEVER be mixed for the same rail.
14. A status MUST NEVER be added to a plain navigation destination. Doing so converts its selected treatment to the "on" gradient and switches on a toggle it has no use for.
15. A feature that can be switched from a rail slot MUST also be switchable somewhere keyboard-reachable. The chip is pointer-only and unannounced, and MUST NEVER be the only path.
16. Every interactive slot MUST carry a unique automation identifier composed from a stable field. The shared default MUST NEVER be relied on for more than one slot.
17. The rail MUST be wrapped in a labelled navigation region by the consumer until the component provides one itself.
18. The decorative status dot, the loading spinner, the brand glyph, and the peek chip MUST stay excluded from the accessibility tree. Semantics MUST NEVER be re-added to them.
19. The rail's fill, radius, padding, and shadow MUST NEVER be overridden in product code — they exist for central retheming and every override stops tracking [[Color]], [[Spacing]], and [[Elevation]].
20. Spacers MUST NEVER be used to tune the gap between slots. The 4pt gap is fixed and caller-supplied spacers are discarded.
21. The deprecated collapsible constructor MUST NEVER be used in new code.
22. Interactions MUST NEVER depend on the press animation being perceived — it is motion-only and vanishes under reduced motion.
23. Exactly one of the rail and the drawer MUST be rendered at a time, chosen on the [[Breakpoints]] tier.

---

## Open Items

1. **The implementation ships a bottom-docked variant that this component's placement rule and [[Breakpoints]] both forbid.** `AsmNavigationRail.bottom` renders the same 52pt slots as a horizontal, bottom-anchored row capped at three slots. It is described in the source as the mobile / compact form, but [[Breakpoints]] defines the small-tier treatment as a left overlay drawer over a dimmed scrim — a bottom bar appears nowhere in Foundations. It is also the only part of the component with **no Figma frame or node cited**: the side rail cites `10293:15244`, the overflow menu `8946:4908`, and its rows `3709:926`, while the bottom variant's "Specs (from Figma)" block names nothing. And it is functionally degraded: because a rightward chip would collide with its neighbour, the variant disables [[Peek Label]] outright, leaving three unlabelled glyphs with no visible names at all. Three sources — the stated design rule, Foundations, and the component's own labelling contract — disagree with one constructor. It needs to be removed or given a Figma frame and a Foundations home.

2. **The small-tier form is specified in Foundations but only half-built.** [[Breakpoints]] requires a menu affordance, a drawer that opens over a dimmed scrim, and a content region that reclaims the rail's 60pt. `AsmNavDrawer` implements the **panel** and nothing else: there is no open/closed state, no scrim, no slide-in, no focus trap, no dismissal on Escape or scrim tap, and no affordance to trigger it. Every product that needs the small tier builds that mechanism itself, and they will diverge on scrim opacity, animation, dismissal, and focus restoration — all of which [[Color]], [[Elevation]], and [[States]] already have opinions about.

3. **The rail is not announced as a navigation landmark; the drawer is.** `AsmNavDrawer` wraps itself in a labelled container region using a localized "Navigation" string that ships in 29 locales. `AsmNavigationRail` has no container semantics and no region name at all — its surface tree goes straight from the decorated box to a focus traversal group to the slots. So the same navigation, in the same app, is a discoverable landmark at one tier and a bare pile of buttons at another. The localized string already exists; the rail simply does not use it. The rail surface also carries no automation identifier of its own (see item 20).

4. **The turn-on / turn-off toggle is pointer-only and inaudible — the most serious gap in the component.** The chip is rendered into an overlay wrapped in `ExcludeSemantics`, so a screen reader never hears that a toggle exists; the slot's announced name is the plain destination name. The slot's keyboard `ActivateIntent` is wired to `onPressed`, **not** to the toggle. And the chip *does* surface on keyboard focus. The result: a keyboard user tabs to the slot, sees a chip that reads "Turn on Firewall", presses Enter, and navigates instead. A screen-reader user is told the slot is a button named "Firewall" and has no way to learn the feature can be switched here. This is a WCAG 2.1.1 (keyboard) and 4.1.2 (name, role, value) failure on any feature whose only switch is a rail slot.

5. **A switch slot reports itself as `selected` rather than as toggled.** The slot's semantics use `selected:` for both meanings — "this is the current page" and "this feature is on". A control with an on/off state should report a checked or toggled state, not a selection state, so assistive technology can announce "on" / "off" rather than "selected". As it stands, a switched-on firewall and the currently-open page are announced identically.

6. **The chip's toggle state is a local override that never resyncs.** Tapping the chip records the new state inside the slot, and from then on that local record wins over whatever the caller passes. There is **no `didUpdateWidget` anywhere in the file**, so a caller that rebuilds the slot with a corrected value — because the toggle request failed on the server, or because the state changed elsewhere in the app — will find it silently ignored for the lifetime of that slot. The rail's displayed state and the product's actual state can diverge permanently.

7. **Rail-managed selection can brand-fill two slots at once.** When the rail derives selection it computes each slot's active state as "already explicitly active, *or* this slot's id matches the selected one". A slot that was passed `active: true` therefore stays active even when a different id is selected. The source's own comment asserts that "exactly one slot in the rail is brand-filled at a time"; the derivation does not guarantee it. The fix is to let the derived value win when the rail is managing selection, or to assert that the two APIs are not mixed.

8. **Below roughly 116pt of height the overflow slot itself is clipped away, taking every hidden destination with it.** The capacity formula yields 1 for any height from 56 up to 108, so with the brand slot enabled the layout emits two pinned slots — the brand and the `⋯` — into room for one. The surface's clip then hides the second, and the clip is documented as intentional ("the overflow is hidden rather than tripping an overflow assertion"). So the escape hatch that guarantees *nothing is ever unreachable* is the first thing discarded when the rail runs out of room, silently. The collapsed branch also computes a negative slot allowance before clamping, which is the arithmetic tell.

9. **The overflow slot's informational dot is unconditional and inaudible.** The `⋯` slot always paints an informational status dot, whether or not any hidden destination has anything to report, and the dot is excluded from the accessibility tree. Visually it is indistinguishable from a real status, so it trains users to ignore the one signal that matters; for a screen-reader user it does not exist at all. Either the dot should reflect the hidden destinations' actual statuses, or it should be dropped.

10. **One destination renders at two different glyph sizes, and [[Icons]] supports both.** In the rail a destination's glyph is 20pt; in the overflow menu the *same* builder is called at 24pt. [[Icons]] guidance says to keep one icon size per component instance — and [[Icons]] is itself split on which is right, listing `Medium 24` as the "Navigation" size in its size table while its per-component table lists `sidebar item` at 20. A destination that folds into the menu therefore grows by 4pt, and no source says which value is correct.

11. **The brand shield is 16pt while every destination glyph is 20pt.** In the same 52pt box, the brand mark is optically the smallest thing in the rail. No source explains the difference, and [[Icons]] has no 16pt entry for a navigation context.

12. **The overflow menu is 200 wide against a Figma frame of 165.** The source states the divergence and its reason — longer destination names would ellipsize at 165 — and treats 200 as a minimum. The Figma frame has not been updated to match, so the redlines and the build disagree by 35pt on a surface a designer will measure.

13. **The overflow slot's high-contrast outline covers hover but not focus.** Destination slots and the brand slot both outline on hover, focus, and "on"; the `⋯` slot outlines on hover only. A keyboard user in a high-contrast theme therefore gets no visible outline on the one slot that guards every hidden destination — its focus fill is the same faint low-alpha grey the outline exists to compensate for.

14. **The focus ring is a deliberate, signed-off deviation from Figma, recorded here so nobody "corrects" it back.** Figma's `navigation_rail` `state=focus` symbol draws only the neutral focus fill plus the peek chip, with no outline. That fill is effectively invisible in both themes, so the implementation rings the slot anyway. Design signed off. The Figma symbol has not been updated, so the divergence will keep resurfacing in every redlines review until it is.

15. **A comment claims the focus flag is keyboard-only; the same file explains why that is not true.** Two slots carry comments asserting the focus flag "is only set via Tab — never on a mouse click". The file's own input-modality mixin exists precisely because the underlying focus callback fires for *any* focus in the default highlight mode, including the focus Flutter restores when a popup closes — which is why the peek chip is additionally gated on the last input being a key press. The **ring** is not gated that way. So the chip correctly stays hidden after a popup is dismissed with the mouse, while the ring lights up. Either the comment is wrong or the ring is missing the same gate.

16. **"Elevation-5" names a level [[Elevation]] does not have, and the two navigation surfaces render it differently.** [[Elevation]] is explicit that elevation is not a continuous scale and that there is no "level 1 through 5" — there are three named shadows. Both navigation files cite "elevation-5". The rail renders a zero-offset 20-blur shadow in the shadow colour, which is exactly the `light` shadow and is **correct**. The drawer re-applies 19% alpha to a token [[Elevation]] describes as already sitting at roughly 19%, so its shadow lands at about a fifth of the intended strength — on a surface whose only separation from the content beneath it is that shadow plus the scrim. [[Cards]] halves the blur instead, making three renderings of one shadow across four surfaces. [[Elevation]] additionally requires referencing the named shadow rather than writing a literal shadow; both files write literals.

17. **The rail's 60pt width is derived, not declared, and nothing ties it to the structural 60 that [[Grid]] depends on.** The rail pins its inner column to the 52pt slot extent and adds 4pt of padding on each side; 52 + 4 + 4 = 60. [[Grid]] lists 60 as a fixed region that all column math is derived from, and the vertical constructor deliberately exposes no width parameter — so the value is structurally correct and structurally invisible. Changing the slot extent or the rail's padding would silently move every column on every page, with no assertion, no comment, and no test connecting the two.

18. **The collapse engine — the component's headline behaviour — has no test.** Three test files exist, covering the focus ring, high-contrast styling, and the peek chip's focus-restore suppression. Nothing covers the capacity arithmetic, the fits-versus-collapsed branch, tail-first fold priority, the contents of the overflow menu, the clipping described in item 8, the accessibility gate that rejects non-destination children, or rail-managed selection. The parts under test are the polish; the parts that decide whether a destination is reachable are not.

19. **The default height is a Figma canvas dimension presented as a component default.** 792 is the height of the design's side-rail frame. As a default it is inert under a height-bounding parent (which is the recommended setup, where the parent's height always wins) and load-bearing under an unbounded one (where it silently prevents any collapse). A default whose effect depends entirely on a property of the parent, and which does nothing in the recommended configuration, is the most misconfigurable part of the API — and the source's own documentation devotes a section to explaining it.

20. **The rail surface has no automation identifier.** Every slot, the brand slot, the overflow slot, and each overflow menu row carries one, with a documented per-index fallback for rows. The rail itself does not, so an automation suite cannot assert on the presence, absence, or identity of the navigation surface — only on the individual buttons inside it.

21. **The deprecated collapsible constructor is still exported.** It is annotated for removal in a future major release and forwards to the default constructor, so it is harmless — but it remains discoverable in autocomplete alongside the constructor that replaced it, and it is the second of three constructors a reader meets.

22. **Spacers are accepted by the validator and then thrown away.** The accessibility gate permits `SizedBox` in a slot list, and its error text tells callers the exemption is "reserved exclusively for the 4pt inter-slot spacers" — but the flattening step drops every one of them and the column inserts its own 4pt gaps. So the documented purpose of the exemption no longer has any effect, and a caller who inserts a 12pt spacer to adjust rhythm gets 4pt and no warning. Either the exemption should be removed or the error text should stop describing a behaviour that was replaced.

23. **The loading spinner's own constraints resolve it to half its documented size.** The spinner's spec calls for a 16 × 16 ring, and it is placed in a fixed 16pt-wide box with 4pt of horizontal padding — leaving 8pt of content width for a nested aspect-ratio box, which therefore resolves to 8 × 8. The 2pt stroke then reads as a quarter of the ring's diameter rather than an eighth. The spec, the container, and the padding cannot all three be right.

24. **Motion values are literals because no motion tokens exist.** The fill crossfade (150ms), the press scale (110ms and a 0.86 factor), and both easing curves are written in the file with an explicit rationale and a note to replace them when a token lands upstream. This is the same gap [[Accordion]] records for its own duration literal, and the same gap the chart components record for theirs — it is now visible in at least five components, which makes it a system gap rather than a component one.

25. **Two rule files cited by the source are not resolvable in the checkout.** The motion literals are justified "per rule 20_tokens" and the focus-ring override "per rule 40_accessibility.md", but the repository's rules directory currently contains only the release rule. [[Popover]] and [[Status Indicators]] cite two further rule files by the same convention. Either the rules live somewhere this doc cannot see, in which case the citations should say where, or the design system's own authorities are unverifiable from the source that appeals to them.
