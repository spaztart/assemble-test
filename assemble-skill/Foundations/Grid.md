# Foundation: Grid

> Role: Defines the column grid, the fixed structural regions, and vertical rhythm. Companion to [[Breakpoints]], which defines the tiers and what changes shape at each one.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define how space is divided and how content aligns, and apply to any surface built on this design system. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: NEVER hardcode a card or content-column width. Derive it from the grid.

## Overview

Assemble layouts are built on a **column grid inside a fixed structural frame**. Two values are constant at every window size — a 16px outer margin and a 16px gutter — and one region is constant above the smallest tier: a 60px navigation rail.

The grid is **fluid up to 992px, then it locks and centers**. Past that point content stops growing and gains symmetric empty margins instead.

Which column count applies at a given window size is determined by [[Breakpoints]]. This document defines the grid itself.

## The Column Grid

| Property | Desktop (MD and up) | Mobile (SM) |
| --- | --- | --- |
| Columns | 12 | 4 |
| Gutter | 16 | 16 |
| Outer margin | 16 | 16 |
| Grid max width | 992 (then centered) | fluid |

**The desktop 12-column grid applies at every tier down to SM**, where it switches to the 4-column mobile grid. Gutter and margin are 16px in both, so those two values never change at any width — the only thing the 500 threshold changes is the column count.

At the locked maximum the arithmetic is exact:

```
(12 × 68) + (11 × 16) = 816 + 176 = 992
```

At SM, the 4-column grid on a 420px content width gives 85px columns:

```
16 + (4 × 85) + (3 × 16) + 16 = 420
```

Column width at any width is:

```
column = (available − (2 × 16) − (16 × (columns − 1))) / columns
```

where `available` is the window width minus the navigation rail minus any side panel. **Columns are never sized by hand** — they are the remainder after the fixed regions are subtracted.

### The grid locks at 992px

Once the grid reaches 992px it stops growing. Additional window width becomes symmetric outer margin, not wider content.

| Window | Grid width | Margin each side |
| --- | --- | --- |
| 980 | fills available | — |
| 1280 | 992 | ~97 |
| 1440 | 992 | ~177 |

This is why content measures the same at 1280 and 1440. The empty space at wide windows is **intentional** — it keeps line lengths readable and prevents cards from stretching into unusable proportions. Do not "fix" it by widening the grid or adding filler content.

### The navigation rail sits outside the grid

The 60px rail is **not** a grid column. The content region begins after the outer margin and the rail, and the 12 columns are laid out in the space that remains:

```
content region = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (panel, if present)
```

Always subtract the rail before doing column math. Treating the rail as grid columns produces misaligned content at every width.

## Fixed Regions

These values do not scale. They are the same number at every window size where they appear.

| Region | Value | Notes |
| --- | --- | --- |
| Outer margin | 16 | Every tier, every edge |
| Gutter | 16 | Every tier |
| Navigation rail | 60 | MD and up; becomes an overlay drawer at SM |
| Side panel | 386 | MD and up; becomes a bottom sheet at SM |
| Grid max width | 992 | Centers once reached |

Because the rail and the side panel are fixed, **all flex is absorbed by the content columns**. Resizing a window changes card widths; it never changes the rail or the panel.

The SM transformations of the rail and panel are defined in [[Breakpoints]].

## Column Spans

The grid stays at 12 columns across every tier above SM. **What changes is how many columns each item spans** — a card that spans 6 columns in a wide content region spans all 12 when the region narrows. Cards do not switch to "a different grid"; the grid is stable and the spans adapt.

| Content region | Typical card span | Result |
| --- | --- | --- |
| ~1188 (1280, no panel) | 6 of 12 | 2-up |
| ~772 (1280, with panel) | 6 of 12 | 2-up |
| ~888 (980, no panel) | 6 of 12 | 2-up |
| ~472 (980, with panel) | 12 of 12 | 1-up |

Note that the span is chosen from the **content region**, not the window — the last two rows are the same window width and take different spans. That rule and its rationale live in [[Breakpoints]].

Practical consequence: a component must respond to the width of **its own container**. The same card can appear beside a side panel, inside a full-width region, or inside a bottom sheet, and it needs to be correct in all three without knowing the window size.

## Vertical Rhythm

| Spacing | Value | Use |
| --- | --- | --- |
| Between cards in a row or stack | 24 | The standard gap |
| Between major sections | 30 | A section boundary |

24px is the default vertical gap and matches the horizontal gutter closely enough to read as a consistent rhythm. Reserve 30px for a genuine change of subject, not for general breathing room — if every gap is 30, none of them signals a boundary.

Card heights are content-driven and are not part of the grid. There is no vertical baseline grid to snap to; align to the spacing values above and let type metrics from [[Typography]] determine the rest.

## Applying the Grid

Resolve in this order:

1. **What is the content region?** Subtract the outer margins, the rail, and any side panel from the window width. This is the number everything else is derived from.
2. **How many columns?** 12 above SM, 4 at SM, per [[Breakpoints]]. The count does not otherwise vary.
3. **How many columns does each item span?** Choose spans so items divide the content region evenly, and so the same component still works when the region narrows.
4. **Has the grid locked?** If the content region would exceed 992px, cap it and center. The leftover is margin.
5. **What separates items?** 16px gutters horizontally, 24px between rows, 30px at section boundaries.

Additional constraints:

- **Never hardcode a pixel width for a card or content column.** Derive it from the grid.
- **Peer items share a span.** All cards in a row span the same number of columns unless the layout deliberately expresses hierarchy through size.
- **Do not let content escape the grid.** Full-bleed regions are the exception and need a deliberate reason; the default is that everything aligns to columns.
- **Do not nest a second grid inside a card.** Cards lay out their contents with spacing values, not with their own column system.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

**Derive columns from constraints.** Use `LayoutBuilder` and compute spans from `constraints.maxWidth`, not from the window size — see [[Breakpoints]] for why window width is the wrong input.

**Cap and center the grid** with a `ConstrainedBox` inside a `Center`, so surplus width becomes margin:

```dart
Center(
  child: ConstrainedBox(
    constraints: const BoxConstraints(maxWidth: 992),
    child: content,
  ),
);
```

**Gutters and gaps** come from the spacing values above — 16px between columns, 24px between rows. Prefer `Row`/`Wrap` spacing or explicit `SizedBox` gaps over `Padding` on each child, so the outer margin stays a single value rather than being smeared across children.

**The rail and panel are siblings of the content, not ancestors.** Lay out the shell as a `Row` of rail → content → panel so the content region receives real constraints from the remaining space, and column math follows automatically.

Guidance:

- Do not hardcode 992, 386, or 60 at call sites — reference shared layout constants so a change propagates.
- Do not size cards with fixed widths. Let them take their share of the content region.
- Do not use a nested grid inside a card; use spacing values.

---

## Rules

1. NEVER hardcode a card or content-column width. Derive it from the grid.
2. The grid is **12 columns** at MD and up, and **4 columns** at SM. No other column count exists.
3. Outer margin and gutter are **16px at every tier**. These never scale.
4. The grid caps at **992px** and centers; surplus width becomes margin, not wider content.
5. The navigation rail (60px) and side panel (386px) are **fixed** — all flex is absorbed by the content columns.
6. The rail is NOT a grid column. Subtract it before any column math.
7. Column spans MUST be chosen from the content region, not the window width.
8. Peer items in a row MUST share the same span unless size deliberately expresses hierarchy.
9. Vertical gaps are **24px** between items and **30px** at section boundaries.
10. Do not nest a second column grid inside a card.
11. Full-bleed content that escapes the grid is an exception requiring a deliberate reason.

---

## Open Items

- **No layout tokens exist.** The values in this document (992, 386, 60, 16, 24, 30) are measured from design sources, not tokenized. They should live alongside the token sets in [[Color]] and [[Typography]] so they can be referenced rather than repeated.
- **Padding drift at SM.** The 500px design frame shows 16px outer margin on some rows and 22px on others. 16px is the rule; the 22px instances are drift to be corrected in the source file.
- **Column spans are not documented per component.** This foundation defines the grid; which span each card or component takes at each tier is a component-level decision that has not been recorded.
- **The 68px column width is derived, not specified.** It falls out of the 992px cap across 12 columns with 16px gutters. If the cap changes, the column width changes with it — treat 992 as the authored value and 68 as its consequence.
