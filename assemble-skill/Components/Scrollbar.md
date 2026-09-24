# Component: Scrollbar

> Role: The brand-styled indicator on a scrollable region — it shows how much content there is, where the user is in it, and gives them a thumb to drag.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A scrollbar is an indicator, NEVER the only way to know content continues. It fades out when idle and it is invisible to a screen reader, so overflow MUST be discoverable without it.
> Source: Figma `Components` → `scroll-vertical` (`5:3901`) and `scroll-horizontal` (`5:3929`), inside container `4102-23304`. Implementation: `pegasus_flutter/lib/asm/components/scrollbar.dart` (`AsmScrollbar`).

## Overview

Every bounded region whose content is taller or wider than the space it has needs to answer two questions: *is there more?* and *where am I?* The scrollbar answers both with one mark — a capsule thumb whose **length** is the fraction of the content currently visible and whose **position** is where that fraction sits in the whole.

Assemble's scrollbar is deliberately quiet. A 6px capsule at 20% opacity, no track, no arrows, no gutter chrome. It reads as a hint rather than a control, which is right for the 95% case where the user scrolls with a wheel, a trackpad, or a swipe and never touches the thumb.

**The quietness has a cost, and it defines how the component must be used.** A faint, fading, unlabelled mark is not a reliable signal that content continues. Users who rely on a screen reader never encounter it. Users on a phone see it appear and disappear. So the scrollbar is always a *second* signal — the layout has to make overflow obvious on its own, by clipping a row mid-height, by a visible partial item, by a section that plainly continues. If the only way to discover the rest of the content is to notice the thumb, the design is broken and no amount of scrollbar styling fixes it.

**It is chrome, not content.** Nothing about a scrollbar is a decision the user makes. It has no variants to pick between, no states to design, and no copy. The only real decision is upstream of it: *should this region scroll at all?* — see the [decision tree](#decision-tree).

## Anatomy

```
  vertical                              horizontal
  ┌────────────┬─┐                      ┌──────────────────────┐
  │ content    │▌│←── thumb             │ content              │
  │            │▌│                      │                      │
  │            │ │                      │                      │
  │            │ │←── track (not drawn) └──────────────────────┘
  │            │ │                       ┆ ▂▂▂▂▂▂▂▂▂           ┆
  └────────────┴─┘                       └───────↑──────────────┘
      3┆ 6 ┆3                                    thumb
       gutter 12                            3 inset, 6 tall
```

| Part | Required | Notes |
| --- | --- | --- |
| **Thumb** | Yes | A 6px capsule. Its length is proportional to the visible fraction; its position to the scroll offset. |
| Track | **No** | Figma draws no track. The channel behind the thumb is empty. |
| Gutter | Drawn, not reserved | Figma shows a 12-wide channel (3 + 6 + 3). See [Open Items](#open-items) — the implementation overlays content rather than reserving space. |
| Arrows / steppers | **No** | Not drawn, not implemented. |
| Labels, tooltips, page counts | **No** | The thumb is unlabelled. |

**There is no track.** The design specifies the thumb and nothing else — no fill, no border, no channel. This means the scrollbar's *extent* is invisible: the user sees where the thumb is but not how long its runway is, and can only infer the total from the thumb's length. That is the intended, minimal treatment.

**The thumb is a single element with no parts.** It does not change colour, size, or shape at any point. See [States](#states) — the absence is the specification.

## Sizes

There is one size.

| Dimension | Value | Notes |
| --- | --- | --- |
| Thumb thickness | 6 | Both orientations. |
| Inset from the region's outer edge | 3 | Keeps the capsule off the very edge. |
| Inset from each end of the track | 3 | The thumb never touches the top/bottom (or left/right) of the runway. |
| Drawn gutter | 12 | 3 + 6 + 3 in Figma. |
| Thumb radius | Full capsule | A pill at any length. |
| Thumb fill | `on-surface` at 20% opacity | One value for light and dark. |

**None of these are on the spacing scale, and that is sanctioned.** 6, 3, the capsule radius, and the 20% alpha are the one set of off-scale numbers the engineering rules explicitly permit as literals, because the Figma frame has no token equivalent for them. Every other component's stray literal is a finding; these are not. They must be copied, never re-derived — see [Flutter Usage](#flutter-usage).

**6px is thin.** It is below the size at which a pointer user can comfortably aim, which is why the thumb's *hit* area is expanded well past its paint (see [Accessibility](#accessibility)), and why the design leans on wheel/trackpad/swipe scrolling as the primary interaction.

## Thumb Length & Position

This is what Figma's variants actually describe. Both `scroll-vertical` and `scroll-horizontal` are two-axis component sets, and neither axis is a style — they are the two readings the thumb has to convey.

**Length axis — how much content there is.** Figma names it by content ratio:

| Variant | Meaning | Thumb length |
| --- | --- | --- |
| `x 2` / `200%` | Content is twice the viewport | 50% of the runway |
| `x 4` / `400%` | Four times | ~26% of the runway |
| `x 8` / `800%` | Eight times | ~14% of the runway |

The relationship is direct: thumb length ÷ runway = viewport ÷ content. A short thumb means a lot of content; a thumb filling the runway means barely any overflow. Figma states no minimum length — see [Open Items](#open-items), because the implementation enforces one.

**Position axis — where the user is.**

| Variant | Meaning |
| --- | --- |
`Top` / `Leading` | At the start. The thumb sits against the leading inset. |
| `Middle` / `Center` | Somewhere in between, proportional to the offset. |
| `Bottom` / `Trailing` | At the end. The thumb sits against the trailing inset. |

**The thumb reaches both ends.** At the very top it touches the leading inset; at the very bottom, the trailing one. This is what tells the user they have arrived — if the thumb stops short of the end, the region reads as having more content when it does not.

**Neither axis is a variant a designer or engineer selects.** Both are computed from the scroll state. There is nothing to configure.

## States

**The thumb has no states.** No hover, no pressed, no dragged, no focus, no disabled. Figma draws one appearance and the implementation paints that one appearance in every condition.

This is a deliberate, and debatable, position:

- **On hover** — the thumb does not thicken, darken, or reveal a track.
- **While being dragged** — the thumb does not darken. The user gets no acknowledgement that they have grabbed it beyond the content moving.
- **On focus** — the thumb is never focused, because it is not in the tab order at all.

The one thing that *does* change is **visibility**: by default the thumb fades in while the region is scrolling and fades out when it goes idle. It can be pinned so it is always shown. See [Behaviors](#behaviors).

The absence of a drag state is the notable gap, and it is recorded in [Open Items](#open-items) — it means the only affordance on the component gives no feedback when used.

## Behaviors

**It appears only when there is overflow.** A region whose content fits shows nothing. This is why a scrollbar can never be a layout element you position around — it is present or absent depending on runtime content.

**It fades.** The default is transient: visible while scrolling, gone shortly after. The alternative is to pin it, which is required in two cases:
- **Horizontal overflow**, always. Off-screen columns are far less discoverable than content below the fold, so the thumb must be standing evidence that the region scrolls sideways.
- **Any region whose overflow is not otherwise obvious** — a list that happens to clip exactly at a row boundary, a panel whose last visible item looks like the last item.

**The thumb is draggable, and the track is clickable.** Dragging scrolls proportionally; clicking an empty part of the runway jumps. Neither is the primary interaction, and neither is available to a keyboard user.

**It overlays content; it does not reserve a gutter.** The thumb floats above the region's trailing edge. Content must therefore keep its own trailing padding, or text will run under the thumb.

**It follows the content, not the container.** Resizing the region changes the thumb's length (more visible content → longer thumb) without changing the scroll offset.

**Nothing else changes with text scale.** The thumb is 6px at every text size — it is chrome, not text. But larger text means *more* overflow, so the thumb gets shorter and the region scrolls more.

## Decision Tree

The real decision is never "which scrollbar" — it is whether the region should scroll.

```
Does the content overflow the space it has?
├── No ─────────────────────────────────────→ no scrollbar (nothing to do)
│
└── Yes
    │
    ├── Is this a floating surface?
    │   ├── [[Popover]] or [[Tooltip]] ──────→ NEVER scroll — cut the content
    │   └── [[Modal]] ──────────────────────→ content that overflows a modal
    │                                          belongs in [[Sheets]] or a screen
    │
    ├── Could the content be divided instead of scrolled?
    │   ├── Into named categories ──────────→ [[Tabs]]
    │   ├── Into collapsible sections ──────→ [[Accordion]]
    │   └── Into numbered pages ────────────→ pagination
    │
    ├── Is the overflow horizontal?
    │   └── Yes ────────────────────────────→ Scrollbar, pinned
    │
    ├── Is the region the whole page / a full-height panel?
    │   └── Yes ────────────────────────────→ Scrollbar, default (fading)
    │
    └── Is it a bounded region inside a larger layout
        (a menu's rows, a sheet's body, a table's viewport)?
        └── Yes ────────────────────────────→ Scrollbar, pinned if the clip
                                               edge is not obviously mid-content
```

**The branch worth pausing on is "could it be divided instead?"** A scrollbar is the answer of last resort for long content — it makes everything reachable but nothing findable. Twelve settings in one scrolling column is worse than four [[Accordion]] sections. A table with thirty columns behind a horizontal scrollbar is worse than a table with the six that matter.

**And the branch that catches real bugs is the floating-surface one.** [[Popover]] and [[Tooltip]] must never scroll — a scrollbar inside them means the content was too long for the shape. [[Modal]]'s content does not scroll either.

## Accessibility

| Requirement | Rule |
| --- | --- |
| Not the only overflow signal | The layout must make overflow evident on its own — a clipped partial row, a visibly continuing section. |
| Keyboard | The region must be scrollable **by keyboard** — arrow keys, Page Up/Down, Home/End — reaching the scrollable, not the scrollbar. The scrollbar itself is not tab-reachable and must not be. |
| Focus follows scroll | Tabbing to an off-screen focusable inside the region scrolls it into view. |
| Screen reader | The scrollbar adds no announcement of its own; the scrollable region carries the scroll semantics. Never label the thumb — it duplicates. |
| Drag target | The thumb's hit area is ≥ 48 even though it paints at 6. |
| Track click | Clicking the runway must scroll, not do nothing. |
| Pinned when non-obvious | Horizontal overflow and clean clip edges get a pinned thumb. |
| Text scale | 6px is chrome and does not scale, but the region must still scroll rather than clip at 200%. |
| Contrast | 20% opacity is very low — see [Open Items](#open-items). |

**"Keyboard reaches the scrollable, not the scrollbar" is the correct design, not an omission.** A tab stop on a scrollbar is a dead end: there is nothing to activate and no way to know what arrow keys will do. The obligation lands on the scrollable region instead — it must accept arrow keys, Page Up/Down, and Home/End, and it must scroll a focused child into view when Tab lands on it. A region that only scrolls by wheel or by thumb-drag is keyboard-inaccessible regardless of how its scrollbar looks.

**The thumb must never be labelled.** A screen reader user moving through a scrolling region already gets scroll position from the region itself. Announcing the thumb adds a nameless control they cannot use.

**A fading thumb is invisible to anyone not currently scrolling** — including a magnifier user panning around the region, and a user who has just arrived. That is the whole reason the "pinned when non-obvious" row exists.

## Anti-Patterns

**❌ Relying on the scrollbar to communicate that content continues.** It fades, it is 20% opacity, and screen-reader users never meet it. → Make the clip edge visibly mid-content.

**❌ A scrollbar inside a [[Popover]] or [[Tooltip]].** The content was too long for the surface. → Cut it, or move to [[Sheets]].

**❌ A scrollbar inside a [[Modal]].** A modal is one decision, and one decision fits. → [[Sheets]] or a screen.

**❌ Horizontal overflow with a fading thumb.** Sideways content is the least discoverable kind and the thumb is the only clue. → Pin it.

**❌ Nested scrolling regions.** A scrollable inside a scrollable produces two thumbs, and the wheel captures unpredictably. → One scroll axis per region.

**❌ Restyling the scrollbar per screen.** Thickness, colour, and radius are the recipe. A screen with its own 8px darker thumb is a screen that looks like a different product. → Use the component.

**❌ Content running under the thumb.** The scrollbar overlays; it does not reserve. → Keep trailing padding on the content.

**❌ Making the region scroll when it should divide.** Everything reachable, nothing findable. → [[Tabs]], [[Accordion]], or pagination.

**❌ Making the thumb a tab stop or giving it a label.** A dead-end focus target and a duplicate announcement. → Leave it out of the tab order.

**❌ A region that only scrolls by wheel or drag.** Keyboard users are stuck. → Arrow keys, Page Up/Down, Home/End.

**❌ Adding arrows, steppers, or a page indicator to the scrollbar.** Not in the design, and they invite the scrollbar to become a control. → It is an indicator.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

`AsmScrollbar` wraps Flutter's Material `Scrollbar` and pre-applies the Assemble recipe, so callers never write a `ScrollbarTheme`. It mirrors `Scrollbar`'s API and is a drop-in replacement.

```dart
import 'package:pegasus_flutter/assemble.dart';
```

### Vertical

```dart
final controller = ScrollController();

AsmScrollbar(
  controller: controller,
  thumbVisibility: true,
  child: ListView.builder(
    controller: controller,
    itemCount: 30,
    itemBuilder: (context, i) => ListTile(title: Text('Row ${i + 1}')),
  ),
)
```

### Horizontal

```dart
final controller = ScrollController();

AsmScrollbar(
  controller: controller,
  thumbVisibility: true,
  scrollbarOrientation: ScrollbarOrientation.bottom,
  child: SingleChildScrollView(
    controller: controller,
    scrollDirection: Axis.horizontal,
    child: wideTable,
  ),
)
```

### Parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `child` | `Widget` | required | The scrollable, or a subtree containing it. |
| `controller` | `ScrollController?` | `null` | When supplied, the **same** controller must be attached to the scrollable inside `child`. When `null`, both fall back to the nearest `PrimaryScrollController`. |
| `thumbVisibility` | `bool?` | `null` | `null` fades the thumb in and out. `true` pins it. Required for horizontal scrolling with a controller. |
| `trackVisibility` | `bool?` | `null` | Shows a track behind the thumb — **not part of the design**, see [Open Items](#open-items). |
| `thickness` | `double?` | `null` → 6 | Escape hatch. Only for a deliberate deviation from the design. |
| `interactive` | `bool?` | `null` | Whether the thumb is draggable and the track clickable. `null` inherits Flutter's platform default, which is **not draggable on Android**. |
| `scrollbarOrientation` | `ScrollbarOrientation?` | `null` | Which edge the bar pins to. `null` lets Flutter infer it from the scroll axis. |
| `notificationPredicate` | `ScrollNotificationPredicate?` | `null` | Which `ScrollNotification`s drive the bar. `null` uses Flutter's depth-0 default. |

### What the component sets for you

| Property | Value | Replaces Flutter's default |
| --- | --- | --- |
| `thumbColor` | `colorScheme.onSurface` at `alpha: 0.2` | per-state 0.1 / 0.5 / 0.6 (light) |
| `thickness` | `6` | `8` (12 with a visible track on hover) |
| `radius` | `Radius.circular(1000)` | `8` |
| `crossAxisMargin` | `3` | `2` |
| `mainAxisMargin` | `3` | `0` |

Everything else — fade timing, minimum thumb length, track colours, whether the thumb is draggable on a given platform — is Flutter's default and is **not** specified by Assemble.

### Guidance

- **Share the controller.** Without an explicit `ScrollController` on both the scrollbar and the scrollable, the thumb is inert — it paints but cannot be dragged. The story documents this and it is the most common mistake.
- **Pin the thumb for horizontal.** Flutter asserts on a controller-backed always-visible horizontal thumb unless you ask for it, and the design reason is stronger than the assert: sideways overflow needs standing evidence.
- **Pass `interactive: true` if the thumb must be draggable on Android.** Flutter's default makes it non-draggable there, and neither the component's doc comment nor the story says so — see [Open Items](#open-items).
- **Do not copy the recipe.** The 6 / 3 / capsule / 20% constants are permitted literals *inside the component*, not licence to re-inline a `ScrollbarTheme` at a call site. Two components in the repo do exactly that and should not — see [Open Items](#open-items).
- **Do not set `thickness`.** It exists for a deliberate deviation, and there is no known one.
- **Do not turn on `trackVisibility`.** Figma draws no track, and Flutter's track colours are un-tokened Material values.
- **Keep trailing padding on the content.** The thumb overlays the region's edge.
- **Make sure the region is keyboard-scrollable.** `AsmScrollbar` contributes nothing here. Standard Flutter scrollables handle arrow keys and Page Up/Down when focused, and `Scrollable.ensureVisible` handles focus-into-view — verify both, because the scrollbar's presence is not evidence of either.

---

## Rules

1. A scrollbar MUST NEVER be the only signal that content continues. The layout MUST make overflow evident on its own.
2. A scrollbar MUST appear only when the content overflows. A region whose content fits shows nothing.
3. Horizontal scrollbars MUST be pinned, always.
4. A scrollbar MUST be pinned wherever the clip edge does not obviously fall mid-content.
5. The thumb's length MUST be proportional to the visible fraction, and its position to the scroll offset.
6. The thumb MUST reach both ends of its runway at the extremes of the scroll range.
7. The thumb MUST be 6 thick, capsule-radiused, inset 3 from the outer edge and 3 from each end, filled with `on-surface` at 20%.
8. The scrollbar MUST NOT be tab-reachable and MUST NOT be labelled for screen readers.
9. The scrollable region MUST be operable by keyboard — arrow keys, Page Up/Down, Home/End — and MUST scroll a focused child into view.
10. The thumb's hit area MUST be ≥ 48 even though it paints at 6.
11. Clicking the runway MUST scroll.
12. The scrollbar overlays content; content MUST keep its own trailing padding.
13. A scrollbar MUST NEVER appear inside a [[Popover]], a [[Tooltip]], or a [[Modal]].
14. Scrolling regions MUST NOT be nested on the same axis.
15. The recipe MUST NOT be restyled per screen. `thickness` and `trackVisibility` MUST be left at their defaults.
16. A track MUST NOT be shown — the design draws none.
17. Arrows, steppers, and page indicators MUST NEVER be added to a scrollbar.
18. Long content MUST be divided ([[Tabs]], [[Accordion]], pagination) before it is made scrollable, wherever division is possible.

---

## Open Items

1. **`buildAsmThemeData` sets no `scrollbarTheme`, so every un-wrapped scrollable in the system renders Flutter's default scrollbar, not the brand's.** A grep for `scrollbarTheme` across the whole repo returns nothing. This is the single highest-leverage fix in the component: one `ScrollbarThemeData` on the theme would brand every scrollable in every consuming app at once, and would make `AsmScrollbar` a thin convenience rather than the only route to the correct appearance. As it stands, the correct appearance is opt-in per call site — which is why the two findings below exist.

2. **Six components scroll without it.** `nav_drawer.dart` (`SingleChildScrollView`), `side_sheet.dart`, `bottom_sheet.dart`, `year_month_picker.dart` (both a `GridView` and a `ListView`), and `guided_action_panel.dart` (two `SingleChildScrollView`s) all scroll with neither `AsmScrollbar` nor an inline `ScrollbarTheme`. On desktop they get Flutter's 8px, radius-8, per-state-alpha Material thumb; the brand's 6px capsule appears nowhere in them. These are shipped surfaces with the wrong scrollbar.

3. **And two components inline the recipe instead of using the component.** `menu.dart` and `phoneput.dart` each hand-write the same `ScrollbarTheme(thumbColor: onSurface@0.2, thickness: 6, radius: 1000, crossAxisMargin: 3, mainAxisMargin: 3)` block that `AsmScrollbar` exists to encapsulate — three copies of five values. The engineering rules sanction the literals but explicitly say to copy them from the canonical implementation, which is now `scrollbar.dart`; both call sites predate it and should be replaced with `AsmScrollbar`.

4. **The thumb colour is pinned with `WidgetStateProperty.all`, which removes hover and drag feedback.** Flutter's Material scrollbar resolves three alphas — idle `0.1`, hover `0.5`, dragged `0.6` in light mode — so the thumb darkens under the pointer and darkens further while grabbed. `AsmScrollbar` returns a flat `0.2` for every state. Figma draws no states either, so the implementation matches the design; the point is that **the design specifies no feedback for the one affordance the component has.** A user who grabs the thumb gets no acknowledgement that they have it. Worth taking to design — a hover/drag alpha is a two-value addition, and its absence is felt on desktop.

5. **20% opacity is far below the non-text contrast floor.** `on-surface` (`#252121`) at 20% over white resolves to roughly `#d3d3d3`, about **1.5:1** against the surface. WCAG 1.4.11 asks 3:1 for the visual boundary of a user-interface component, and the thumb *is* draggable and clickable. It is also the sole indicator of scroll position. Confirm with design whether 20% is intended for the resting state with a stronger hover/drag value on top, or whether the resting value itself needs to come up.

6. **The same 20% is used in dark mode, where Flutter bumps its own default.** Material uses `0.1` light / `0.3` dark, on the reasoning that a light thumb over a dark surface reads fainter at the same alpha. Assemble applies one value to both, and Figma names only the light `on-surface` (`#252121`) — the dark-mode value was never specified. Verify the thumb is legible on the dark surface at 20%.

7. **Figma draws a 12-wide gutter that the implementation does not reserve.** The symbol is 12 wide with the 6px thumb centred (3 clear on each side), which reads as reserved space beside the content. Flutter's `crossAxisMargin: 3` insets the thumb 3 from the region's outer edge and reserves nothing — the thumb floats *over* content, and content can run beneath it. Either the Figma frame is a specification diagram rather than a gutter (likely), or the implementation should be laying out an actual 12px channel. Design should say which, because it changes every scrolling region's content padding.

8. **Figma's thumb lengths are all shorter than the minimum the implementation will render.** The variants specify proportional lengths — `x 2` = 50% of the runway, `x 4` ≈ 26%, `x 8` ≈ 14% — with no floor stated. `AsmScrollbar` does not set `minThumbLength`, so Flutter's default of **48** applies: in a 240-tall menu with 8× content, the proportional thumb would be 30 and the rendered one is 48. The thumb therefore over-reports how much content is visible on long lists, and the `x 8` variant as drawn is unreachable. The implementation's behaviour is arguably correct — a 6×30 capsule is hard to grab, a 6×8 one is impossible — but Figma states no minimum and the two do not agree. Design should specify the floor.

9. **The capsule radius is a bare `1000` when a pill token exists.** `AsmCornerRadii.r999` is the design system's full-round radius. `scrollbar.dart` writes `Radius.circular(1000)`, and the engineering rules bless that literal by name — but the carve-out was written before `r999` was available, and using the token would remove the last unexplained number in the file. Same literal appears in `menu.dart` and `phoneput.dart`.

10. **`AsmScrollbar` has no `automationIdentifier`.** The rule requires one on every interactive `Asm*` component, and the thumb is draggable and the track clickable. `AsmScrollbar` is not in the rollout list at all. Arguably a scrollbar should be excluded — automation should drive the scrollable, not the chrome — but the exclusion is not stated anywhere, so it reads as an oversight rather than a decision.

11. **The class doc's accessibility note conflates keyboard with pointer.** It says *"the underlying `Scrollbar` is interactive — the thumb is draggable and responds to track clicks — so keyboard and pointer users can move through overflow content."* Dragging and track-clicking are pointer interactions; the scrollbar is not focusable and has no keyboard behaviour whatsoever. Keyboard users scroll the scrollable, which is a separate obligation the component neither provides nor verifies. The sentence should be split, because as written it reads as a keyboard-accessibility guarantee the component does not make. This is the seventh component found with a doc comment that overstates or contradicts its behaviour.

12. **The doc also states the thumb is draggable, unqualified — on Android and Fuchsia it is not.** Flutter's `interactive` default is `!useAndroidScrollbar`, so the thumb is drag-inert on those platforms unless the caller passes `interactive: true`. Neither the class doc nor the widgetbook story mentions it, and the story's `interactive` knob defaults to `true`, which hides the platform difference from anyone evaluating the component in Widgetbook on macOS.

13. **`trackVisibility` is exposed but has no design source.** Figma draws no track. If a caller turns it on, the track fill and border come from Flutter's un-tokened Material values (`onSurface` at 3% / 5% fill, 10% / 25% border). Either the design should specify a track for the cases that want one, or the parameter should not be on the public surface.

14. **`thickness` is a token-escape-hatch parameter.** It lets a caller deviate from the one documented geometry, and its own doc comment says only to use it "for a deliberate deviation" — with no example of one. This is the same pattern already flagged on `AsmSwitch`, `AsmLoader`, `AsmProgressBar`, `AsmEmptyState`, `AsmModal`, and `AsmCard`: a parameter whose correct value is always the default.

15. **No motion tokens for the fade.** The thumb fades over 300ms after a 600ms idle delay — both Flutter defaults, neither surfaced as a parameter nor recorded as a design value, and Figma specifies no timing. This is the eleventh component whose motion is undocumented literals.

16. **Figma names the two orientations as separate components (`scroll-vertical`, `scroll-horizontal`) where the code is one widget with an orientation parameter.** The code's shape is right; the note is that a designer looking for "scrollbar" in the Figma file will not find that name, and the two frames' shared geometry is duplicated rather than expressed as a variant axis.
