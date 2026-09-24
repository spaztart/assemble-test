# Foundation: Breakpoints

> Role: Defines the breakpoint tiers and what changes shape at each one. Companion to [[Grid]], which defines how space is divided within a tier.

> Rule: Responsive decisions MUST be made from the **available content width**, never from the raw window width.

## Overview

McAfee products are desktop applications with resizable windows, so layout changes are driven by window resize rather than by device class. A narrow desktop window and a small screen are the same case, and there is no separate "mobile build" to reason about.

There are **two thresholds that change the shape of the layout** — 500 and 980. Everything else commonly called a breakpoint here is either a default window size or a consequence of the grid reaching its maximum width, not a change of layout structure.

This document defines *when* the layout changes. [[Grid]] defines *how* space is divided once a tier is established.

## Breakpoint Tiers

| Tier        | Range       | Columns | Nav             | Secondary content |
| ----------- | ----------- | ------- | --------------- | ----------------- |
| **SM**      | 500 – 979   | 4       | Overlay drawer  | Bottom sheet      |
| **MD**      | 980 – 1279  | 12      | Persistent rail | Side panel        |
| **Default** | 1280 – 1439 | 12      | Persistent rail | Side panel        |
| **Max**     | 1440 and up | 12      | Persistent rail | Side panel        |

MD, Default, and Max are **structurally identical**. They differ only in how much window there is, and the grid stops consuming it at 992px — see [The Grid Locks at 992px](Grid.md#the-grid-locks-at-992px). Column count, navigation, and secondary-content patterns are the same across all three.

## The Two Thresholds

### 500 — the column threshold

Below 500 the layout enters a genuinely different mode. Three things change **together**:

1. **12 columns → 4 columns**
2. **Persistent rail → overlay drawer**
3. **Side panel → bottom sheet**

These are not independent switches. A layout with a persistent rail and a 4-column grid, or an overlay drawer and a side panel, is wrong. See [Layout Transformations at SM](#layout-transformations-at-sm).

### 980 — the pattern threshold

980 is where a persistent 60px rail plus a fixed 386px side panel stops leaving enough room for multi-column content. Above it, both can coexist alongside multiple columns of content. At it, they cannot — the content region narrows enough that cards collapse to a single column while the grid itself stays at 12.

This is a **pattern** boundary rather than a column-count boundary: the column count does not change at 980, but what fits inside those columns does.

### Why 1280 and 1440 are not thresholds

1280 is the default window size and 1440 is the maximum. Neither changes layout shape, because the grid has already capped at 992px before either is reached — additional width becomes symmetric outer margin, not wider content.

The practical consequence: **a 1280px window and a 1440px window produce identical content.** Any rule that branches between them is describing margin, not layout.

Do not introduce additional breakpoints. If a layout appears to need one, the component inside it should adapt to its own container width instead — see [Decide From Content Width](#decide-from-content-width).

## Decide From Content Width

This is the rule most likely to be got wrong, so it is stated plainly: **window width is not the input to a responsive decision.** The input is the width remaining after the fixed regions are subtracted.

```
content region = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (panel, if present)
```

The clearest demonstration is a single window width producing two different layouts:

| Window | Side panel | Content region | Result |
| --- | --- | --- | --- |
| 1280 | none | ~1188 | Cards sit 2-up |
| 1280 | 386 | ~772 | Cards sit 2-up |
| 980 | none | ~888 | Cards sit 2-up |
| 980 | 386 | ~472 | Cards collapse to 1-up |

Rows three and four are the **same window width** and disagree. A rule written against window width gets the fourth row wrong, because it cannot see the 386px panel that consumed the space.

So the tier tells you which patterns are available, but the container width tells you how content lays out inside them. A component must be correct whether it sits beside a side panel, fills a full-width region, or appears inside a bottom sheet — without knowing the window size.

## Layout Transformations at SM

SM is a different layout mode, not a narrower version of the desktop one.

**Navigation rail → overlay drawer.** The persistent 60px rail is replaced by a menu affordance that opens a drawer over a dimmed scrim. The drawer floats above content rather than displacing it, so the content region reclaims the rail's 60px.

**Side panel → bottom sheet.** The 386px side panel has no room to exist. Its content moves into a bottom sheet the user can drag to expand. Same content, different container.

**12 columns → 4 columns.** Cards span the full 4 columns, so the practical result is a single-column stack.

The scrim behind the drawer uses the opaque scrim token from [[Color]], and the drawer and sheet carry elevation from [[Elevation]] — they float above the canvas rather than sitting on it.

Because the side panel and the bottom sheet hold the same content, **author that content once and let its container change.** Content that only works in a 386px-wide column has been built wrong.

## Resolving a Layout

1. **Which tier is the window in?** This tells you the column count and which navigation and secondary-content patterns apply.
2. **What is the content region?** Subtract the outer margins, the rail, and any side panel. This is the number every layout decision downstream is derived from.
3. **How does content lay out in that region?** Follow [[Grid]] — spans, gutters, and the 992px cap.
4. **Does the component need to adapt further?** If so, it adapts to its own container width, not to the tier.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

**Measure the container, not the window.** Use `LayoutBuilder` and branch on `constraints.maxWidth`. Do not branch on `MediaQuery.of(context).size.width` for layout decisions — that returns the window size, which does not account for the rail or a side panel, and produces exactly the wrong result in the 980-with-panel case above.

```dart
LayoutBuilder(
  builder: (context, constraints) {
    final columns = constraints.maxWidth < 500 ? 4 : 12;
    return ...;
  },
);
```

`MediaQuery` remains correct for things that genuinely concern the window or viewport — safe areas, insets, and text scale — just not for tier or grid decisions.

**Lay the shell out as siblings.** Structure it as a `Row` of rail → content → panel so the content region receives real constraints from the remaining space. The rail and panel are siblings of the content, not ancestors of it, which makes the subtraction automatic rather than something call sites recompute.

**At SM**, use a `Drawer` over a scrim for navigation and a draggable bottom sheet for what was the side panel. Drive the shadow on both from the tokens in [[Elevation]] rather than Flutter's numeric `elevation:`.

Guidance:

- Branch on `constraints.maxWidth`, never on window width.
- Do not write a widget that takes a breakpoint tier as a parameter. Pass it width, or let it measure its own constraints.
- Do not hardcode 500, 980, 60, or 386 at call sites — reference shared layout constants so a change propagates.

---

## Rules

1. Responsive decisions MUST be derived from the **available content width**, never from the raw window width.
2. There are exactly **two** structural thresholds — 500 and 980. Never introduce another breakpoint.
3. 1280 and 1440 are window sizes, NOT thresholds. Never branch between them.
4. At SM the rail becomes an overlay drawer AND the side panel becomes a bottom sheet AND the grid drops to 4 columns — these change together, never independently.
5. Content appearing in both a side panel and a bottom sheet MUST be authored once and adapt to its container.
6. Components MUST respond to their own container's width, not to the window size or a tier passed in.
7. MD, Default, and Max are structurally identical — do not write tier-specific behavior among them.

---

## Open Items

- **No breakpoint tokens exist.** The threshold values (500, 980) are measured from design sources, not tokenized. They should live alongside the token sets in [[Color]] and [[Typography]] so they can be referenced rather than repeated.
- **SM upper bound unverified in design.** SM is documented as 500–979 because 980 is the next labeled tier, but no design frame exists between 500 and 980. Whether SM behavior genuinely holds at, say, 900px wants confirmation.
- **Side panel behavior below 980 undocumented.** At 980 with a panel the cards collapse to a single column. Whether the panel persists at all between 500 and 980, or converts to a sheet earlier than 500, is unspecified.
- **Minimum window width not settled here.** Window-level minimums are an application shell concern and were deliberately excluded from this document. If the shell permits a window narrower than 500, the behavior below SM is undefined.
