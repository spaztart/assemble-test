# Component: Data Linear Chart

> Role: A single horizontal bar divided into proportional coloured segments, with an optional dotted legend beneath it, showing how one total splits across a small number of categories. It is a composition readout, never a progress indicator.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe what the bar means, how many segments it tolerates, and what it must never be used for. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: There is no total. The bar shows only the *shape* of the split, and the legend is the only place a magnitude appears — so if the size of the whole matters, this component cannot express it and you want [[Data Arc Chart]] instead.
> Source: Figma `Components` → `linear_chart`, with the `bar` frame (28pt), the legend rows, and the 184pt `stat-leader` dotted line. No node ids are cited in the implementation. Implementation: `pegasus_flutter/lib/asm/components/linear_chart.dart`.

## Overview

The linear chart is one pill-shaped bar, filling whatever width it is given, divided left to right into bands whose widths are proportional to their weights. Only the two outer ends of the bar are rounded; the joins between bands are square, separated by hairline gaps, so the whole thing reads as one pill split by cuts rather than as a row of separate pills. Below it, optionally, sits a legend listing each named band with its colour, its label, and its value, joined by a dotted leader.

**The distinction most often got wrong is linear chart versus [[Progress Bar]].** They are the same shape:

| | Linear Chart | [[Progress Bar]] |
| --- | --- | --- |
| Shows | How a whole **divides** | How far along one thing **is** |
| Segments | Several, all meaningful | One, plus an unfilled track |
| Unfilled remainder | **None** — the bands always fill the bar | The point of the component |
| Direction | Static — the bands don't advance | Advances toward completion |
| Announces | Its breakdown | Its progress |

There is no track behind the bands. The bar is always full. **If any part of the bar means "not yet," you want [[Progress Bar]]** — and because the two look nearly identical, this is a mistake a user will make on your behalf if you give them the chance.

**The second distinction is linear versus [[Data Arc Chart]].** They are siblings with the same data model and the same legend. The difference is that the arc has a centre, so it can print the total as a headline; the bar has nowhere to put one. Choose the bar when the split is the message and the magnitude is secondary, or when the space you have is a narrow column or a list row where a 299pt gauge will not fit. Choose the arc when the total is the number the user came for. **They are not interchangeable and they do not behave identically** — see [Open Items](#open-items) item 1.

**The third distinction is that segment values are weights, not percentages.** Each band's width is its weight over the sum of all weights. Counts, bytes, and percentages all work; mixing units within one bar does not. Because there is no total to print, the weights are never compared against anything — but they are the only numbers the legend shows, so they must be meaningful to a user, not just proportional.

**The fourth distinction is linear versus a table.** Five bands and five legend rows convey a shape. Nine convey nothing — and past five segments the colour ramp repeats, so two bands become the same colour and the legend stops being matchable. **Keep a linear chart to five segments or fewer.**

## Anatomy

```
   ╭──────────────────┬┄┬──────────┬┄┬──────┬┄┬────╮
   │                  ┆ ┆          ┆ ┆      ┆ ┆    │   ← 28 tall, outer ends
   ╰──────────────────┴┄┴──────────┴┄┴──────┴┄┴────╯     rounded at 8, interior
   └── proportional to weight ──┘   gap 4                joins square
                        ┆24┆
        ●  Messages ································  12    ← legend row
        ●  Video ······································  8       dot 11, leader dotted,
        ●  Photos ·····································  5       value right-aligned
        ●  Other ·······································  2
```

| Part | Required | Notes |
| --- | --- | --- |
| **Bar** | Yes | 28 tall, full width of its parent, always completely filled. |
| **Bands** | Yes | One per non-zero segment, in draw order left to right. |
| **Outer rounding** | Yes | 8pt, applied only to the leading edge of the first *visible* band and the trailing edge of the last. |
| **Interior joins** | Yes | Square. The bands butt up against the gaps. |
| **Gaps** | Between non-zero bands | 4pt each. Reserved only between bands that actually have width. |
| **Legend** | No — on by default | One row per **labelled** segment: colour dot, label, dotted leader, value. |
| **Legend dot** | Yes, per row | 11pt, in the band's colour. |
| **Dotted leader** | Yes, per row | 1pt dots on a 6pt pitch, in `outlineVariant`. Takes all remaining width. |
| **Legend value** | Yes, per row | Formatted by the component, right-aligned. |
| **Unfilled track** | **Absent** | There is none. This is what separates it from [[Progress Bar]]. |
| **Total** | **Absent** | There is no slot for one. Put it in a heading above the chart. |
| **Caption** | **Absent** | Same. [[Data Arc Chart]] has both; this does not. |

The rounding rule is worth reading twice: the corners are computed from the first and last band **with a non-zero weight**, not the first and last in the list. So a chart whose first segment is zero still gets a properly rounded left end — the zero band is skipped entirely rather than contributing a square-cornered sliver.

## Sizes

There is no size axis. The bar is 28pt tall and takes the full width of its parent, always.

**That makes the parent the size control.** The bar adapts to a column, a sheet, a list row, or a split view without knowing anything about the screen — which is the reason to choose it over [[Data Arc Chart]], whose gauge is a fixed 299 or 224pt wide.

Two consequences:

- **In a very narrow parent the bands become unreadable slivers** before anything warns you. A 4pt gap between bands in a 120pt-wide bar is a meaningful fraction of the whole. Below roughly 200pt of width, prefer the legend alone.
- **In a very wide parent the bar stretches indefinitely.** There is no maximum width. A full-bleed bar on a desktop layout is 28pt tall and a thousand wide, which reads as a rule rather than a chart. Constrain it yourself.

## Variants

There are no colour or style variants. Every linear chart is drawn from one ramp, and the only way to change a band's colour is per segment.

### The ramp, and what happens past five segments

Bands take their colour from a five-stop ramp, in draw order: teal, indigo, violet, blue-violet, light lavender. A segment can override its own colour.

**The ramp cycles.** Segment six gets the first colour again, and so on. Adjacent bands therefore never share a colour — but **non-adjacent bands do**, which breaks the legend: two rows with the same coloured dot cannot be matched to two different bands. Since matching legend to band is the legend's only job, a six-segment linear chart has a broken legend.

Two rules follow:

- **Five segments maximum.** This is a hard ceiling, not a preference.
- **If you must exceed five, override every segment's colour explicitly** and take responsibility for the resulting palette — including its contrast against the surface and against its neighbours.

Two defects live in this ramp, and both are worse than the arc chart's.

**The indigo stop is theme-invariant.** It is read directly from the raw generated token map rather than from the theme's colour scheme, because it is not surfaced on either the standard scheme or the extended palette. The value is **identical in the light and dark maps**, so unlike every other stop it does not adapt. Computed contrast against the card surface:

| Stop | Light | Dark |
| --- | --- | --- |
| 1 — teal | 4.53 : 1 | 7.26 : 1 |
| 2 — indigo | 8.11 : 1 | **1.77 : 1** — same colour, dark surface |
| 3 — violet | 7.74 : 1 | **13.41 : 1** — becomes near-white |
| 4 — blue-violet | 4.50 : 1 | 7.57 : 1 |
| 5 — light lavender | **1.90 : 1** | **1.26 : 1** — near-invisible |

**Two of the five stops fail the 3 : 1 non-text floor in dark mode**, and stop 5 fails in both. Where the arc chart has one failing stop, this has two.

**And the adjacency between stops 2 and 3 is 1.05 : 1 in light mode** — indigo and violet are all but the same colour to the eye. The 4pt gap between bands is the only thing separating them, and both clear 7 : 1 against the surface, so a reader is distinguishing each band from the *background* rather than from its neighbour. That works. It stops working the moment a band is narrow enough that the gaps on either side dominate it.

Full adjacency figures:

| Adjacent pair | Light | Dark |
| --- | --- | --- |
| 1 → 2 | 1.79 : 1 | 4.09 : 1 |
| 2 → 3 | **1.05 : 1** | 7.56 : 1 |
| 3 → 4 | 1.72 : 1 | 1.77 : 1 |
| 4 → 5 | 2.37 : 1 | 6.00 : 1 |

**Also: the indigo stop has a silent fallback.** If the token key it reads ever disappears from the generated map, the ramp substitutes the violet stop — which is the stop immediately next to it. The chart would then draw bands 2 and 3 in the same colour, adjacent, with no error at any layer. See [Open Items](#open-items) item 4.

## States

**The chart has no states.** There is no hover, focus, pressed, selected, or disabled appearance, because nothing in it is interactive or focusable. [[States]] does not apply to it.

Two consequences worth being explicit about, since a reader expecting the usual state set will look for them:

- **There is no loading state.** The left-to-right wipe is not one — it runs on data that has already arrived, and because it looks exactly like a determinate [[Progress Bar]] filling, it is the most misleading loading placeholder in the system. Use [[Skeleton Loader]].
- **There is no empty state.** All-zero data is not handled; the bar simply does not draw. Use [[Empty State]].

The only conditional appearance is the reduced-motion branch, which suppresses the wipe — see [Behaviors](#behaviors).

## Behaviors

- **Segment values are relative weights.** Each band's width is its weight over the sum of all weights, computed after the fixed gaps have been reserved.
- **Gaps are reserved only between non-zero bands.** A zero-weight segment takes no width and consumes no gap. It still appears in the legend, with a value of zero, so the bar and the legend can disagree on how many parts there are.
- **Zero-weight segments do not affect the rounding.** The outer corners come from the first and last band with actual width.
- **All-zero data renders nothing.** With every weight at zero, the painter returns before drawing. You get an empty 28pt-tall strip and a legend of zeros. There is no empty state and no assert. **Check for this before rendering** and use [[Empty State]] instead. See [Open Items](#open-items) item 6.
- **The reveal animation wipes the bar in from the left over 700ms** with an ease-in-out curve, and it runs once on first build. Because it is a clip rather than a per-band grow, a mid-animation frame shows complete bands on the left and nothing on the right — the bar appears to be drawn rather than to grow.
- **Reduced motion is honoured.** When the platform asks for reduced motion the bar paints at full width with no animation. This is correct, and the chart is one of the few components in the system that implements it.
- **New data does not re-animate, and may not settle correctly.** The animation is set up once and there is no update hook, so replacing the segments repaints the bar at whatever the animation's current value is. In practice the wipe has completed by then and the new bar appears instantly — but a data change *during* the first 700ms will land mid-wipe. See [Open Items](#open-items) item 7.
- **The breakdown is announced.** Unlike [[Data Arc Chart]], this chart composes its labelled segments and their values into a single announcement — "Messages 12, Video 8" — and suppresses the bar and legend beneath it so it is said once rather than twice. **If no segment has a label, the composed announcement is empty**, which produces a container that announces nothing and hides everything inside it. See [Open Items](#open-items) item 3.
- **Legend labels do not wrap.** They are capped at 60% of the row's width and ellipsized. The component's own documentation claims text wraps rather than clipping; it does not. See [Open Items](#open-items) item 5.
- **The legend's dotted leader absorbs all slack**, so the value column is right-aligned and the label column left-aligned regardless of label length.
- **Nothing about the chart is interactive.** No hover, no tap, no tooltip, no highlight, no drill-in. If a user needs a per-band value, it is in the legend or it is nowhere.
- **Text scale grows the legend rows** but not the bar, whose 28pt height is fixed.

## Content

The chart has two kinds of text, and there is nowhere to put a total.

**There is no total and no caption slot.** [[Data Arc Chart]] has both; this has neither. If the magnitude of the whole matters, it goes in a heading, a `titleMedium` line, or a stat above the chart — not inside it. That heading is *not* part of the chart's announcement, so screen-reader users hear the breakdown without the total unless you compose it in yourself.

**Legend labels.** Yours.

- **One or two words.** They are capped at 60% of the row width and ellipsized, with no wrapping and no tooltip, so an over-long label is silently truncated with no way for any user to read it.
- **Nouns, matching the vocabulary used elsewhere for the same data.** If the settings screen calls it "Backups," the legend says "Backups."
- **Every segment needs one.** The legend renders one row per *labelled* segment and silently skips the rest, so an unlabelled segment contributes a coloured band with **no legend row at all** — an unexplained slice of the bar. Worse, the announcement is built from the same filter, so an unlabelled segment is invisible to a screen reader entirely.
- **At least one label is mandatory in practice.** With none, the legend disappears whatever `showLegend` says, *and* the announcement is empty.

**Legend values.** Formatted by the component.

- **It prints whole numbers as integers and everything else as a raw decimal.** A weight of one third prints its full floating-point expansion, with a period as the decimal mark regardless of locale. **Round your weights before passing them,** or pass integers. See [Open Items](#open-items) item 8.
- **There is no unit slot.** If `12` needs to read as `12 GB`, put the unit in the label — `Photos (GB)` — or pre-scale the weights and say the unit in the heading.

## Decision Tree

```
Does any part of the bar mean "not done yet"?
├── Yes ─────────────────────────────────────→ use [[Progress Bar]]
│                                              This chart has no track;
│                                              the bands always fill the bar.
└── No — the whole is divided among its parts
    │
    ├── Is there only one part? ──────────────→ NOT this component. One band
    │                                            filling the bar is
    │                                            indistinguishable from a
    │                                            completed progress bar.
    │
    ├── Are there more than five parts? ──────→ NOT this component. The ramp
    │                                            cycles at five and the legend
    │                                            breaks. Use a table.
    │
    ├── Are all the values zero, or is the
    │   data still loading?
    │   ├── Zero ────────────────────────────→ use [[Empty State]]
    │   └── Loading ─────────────────────────→ use [[Skeleton Loader]]
    │
    ├── Does the user need per-part values on
    │   demand, by pointing at the chart? ────→ NOT this component. Nothing
    │                                            here is interactive. Use a table.
    │
    └── A total divided among 2–5 parts
        │
        ├── Does the TOTAL matter as a headline number?
        │   ├── Yes ──────────────────────────→ use [[Data Arc Chart]]
        │   │                                    It has a centre to print it in.
        │   │                                    This chart has no total slot.
        │   └── No — only the split matters ──→ continue
        │
        └── How much width is available?
            ├── Under ~200pt ─────────────────→ the bands become slivers.
            │                                   Show the legend alone, or a table.
            ├── A column, list row, or sheet ─→ Linear Chart. It fills what
            │                                   it is given.
            └── Full-bleed desktop width ─────→ Linear Chart, but constrain it.
                                                There is no max width and a
                                                1000pt bar reads as a rule.
```

## Accessibility

**The breakdown is announced, and this is the one place the linear chart is better than [[Data Arc Chart]].** The chart presents as a single node whose label is the labelled segments and their values, comma-joined — "Messages 12, Video 8" — and suppresses the bar and the legend so the content is said once. The arc chart, which has *more* information, announces *less*: only its total, with its legend suppressed and unavailable.

Two caveats on that announcement:

1. **It carries no total, because there is none.** A screen-reader user hears "Messages 12, Video 8" with no frame of reference and no unit. Override the label to supply both: `'Storage used: 20 GB total. Messages 12 GB, Video 8 GB.'`
2. **With no labelled segments the announcement is empty**, producing a container that says nothing and hides its children. A chart with zero labels is inaudible.

| Requirement | Status | Notes |
| --- | --- | --- |
| Accessible name | **Met, with caveats** | Composed from labelled segments. Empty if none are labelled. Overridable. |
| Breakdown available to AT | **Yes** | The reason to prefer this over [[Data Arc Chart]]. |
| Total available to AT | **No** | There is no total. Compose it into the label yourself. |
| Colour not the only signal | **For sighted users only** | The compensating text is inside the exclusion — but here it is re-composed into the label, so it survives. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Stops 2 and 5 fail in dark; stop 5 fails in light** | Indigo 1.77 : 1 dark, lavender 1.90 : 1 light / 1.26 : 1 dark. |
| Adjacent band separation | **1.05 : 1 between stops 2 and 3 in light** | Mitigated by the 4pt gaps, not by the colours. |
| Text contrast (WCAG 1.4.3) | Legend label and value pass | The dotted leader is decorative: 1.40 : 1 light, 1.06 : 1 dark. |
| Label truncation | **Ellipsized with no recovery** | Capped at 60% of row width, no wrap, no tooltip. |
| Touch target 48 × 48 | **N/A** | Nothing is interactive. |
| Keyboard reachable | **N/A** | Nothing is focusable. |
| Reduced motion | **Met** | The bar paints at full width when reduced motion is requested. |
| High contrast | **Not handled** | No branch, and two ramp stops are not remappable. |

Four obligations the component cannot discharge for you:

1. **Label every segment.** An unlabelled segment is absent from both the legend and the announcement, so it is a coloured band nobody can name and a screen-reader user does not know exists.
2. **Override the semantic label to include the total and the units.** The composed default has neither.
3. **Keep legend labels short enough not to truncate.** There is no wrap and no way for any user to recover a truncated label.
4. **Do not rely on band colour alone to identify a part.** Two stops are near-invisible in dark mode, one adjacency is 1.05 : 1 in light, and neither the teal nor the indigo stop is remapped in a high-contrast theme. The legend is the identification mechanism, and it is visual only.

## Anti-Patterns

**❌ Using it as a progress indicator.** There is no unfilled track; the bands always fill the bar. This is the single most likely misuse because the two components are the same shape. → Use [[Progress Bar]].

**❌ A single segment.** One band filling the bar is indistinguishable from a completed progress bar. → Use a number, or [[Progress Bar]].

**❌ More than five segments.** The ramp cycles, so two bands share a colour and the legend can no longer be matched to the bar. → Five maximum, or a table.

**❌ Leaving a segment unlabelled.** It gets a band but no legend row *and* no place in the announcement. → Label every segment.

**❌ Rendering it with no labelled segments at all.** The legend disappears and the announcement is empty, so the chart is a silent coloured strip. → Always label, or pass an explicit semantic label.

**❌ Relying on the default announcement alone.** It has no total and no units. → Compose both into `semanticLabel`.

**❌ Expecting a total slot.** There is none, and adding one by wrapping the chart puts the total outside the announcement. → Put the total in a heading *and* in the semantic label.

**❌ Passing unrounded decimals as weights.** A value of one third prints its full floating-point expansion in the legend, with a period as the decimal mark regardless of locale. → Round, or pass integers.

**❌ Long legend labels.** Capped at 60% of the row and ellipsized, with no wrap and no tooltip. → Short nouns.

**❌ Rendering it with all-zero data.** The painter draws nothing; you get an empty strip and a legend of zeros. → Guard the case and use [[Empty State]].

**❌ Rendering it while data is loading.** A bar wiping in from the left looks like real data arriving. → Use [[Skeleton Loader]].

**❌ Expecting hover or tap on a band.** Nothing is interactive. → The legend is the only per-part readout.

**❌ Mixing units across segments.** The bands are proportional to the weights; two different units produce a meaningless split. → One unit per chart.

**❌ Putting it in a very narrow column.** Under roughly 200pt the 4pt gaps are a meaningful fraction of the bar and the bands become slivers. → Show the legend alone.

**❌ Letting it span a full desktop width.** There is no maximum width; a 28pt-tall bar a thousand wide reads as a horizontal rule. → Constrain it.

**❌ Trusting the dark-mode ramp to read like the light-mode ramp.** One stop does not change at all between themes, another becomes near-white, and a third is 1.26 : 1 against the surface. → Check both themes.

**❌ Relying on the ramp to survive a high-contrast theme.** There is no branch; the teal stop comes from the extended palette and the indigo stop from the raw token map, neither of which is remapped. → Do not encode meaning in the colour alone.

---

## Flutter Usage

`AsmLinearChart` and `AsmLinearChartSegment` in `lib/asm/components/linear_chart.dart`, exported from `assemble.dart`. It has widget tests and a widgetbook story, but **no product call sites.**

There is **no size enum** — compare `AsmArcChartSize` on [[Data Arc Chart]].

### Basic usage

```dart
AsmLinearChart(
  segments: const [
    AsmLinearChartSegment(value: 12, label: 'Messages'),
    AsmLinearChartSegment(value: 8, label: 'Video'),
    AsmLinearChartSegment(value: 5, label: 'Photos'),
    AsmLinearChartSegment(value: 2, label: 'Other'),
  ],
)
```

That announces `'Messages 12, Video 8, Photos 5, Other 2'` — composed automatically, with no total and no units.

### With a heading and a total

The chart has no total slot, so the total lives above it — and must be repeated into the semantic label, because the heading is not part of the chart's announcement.

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('27 GB used', style: context.asmTypographyTokens.titleLargeEmphasized),
    SizedBox(height: context.asmSpacingTokens.spacing400),
    AsmLinearChart(
      segments: const [
        AsmLinearChartSegment(value: 12, label: 'Messages'),
        AsmLinearChartSegment(value: 8, label: 'Video'),
        AsmLinearChartSegment(value: 5, label: 'Photos'),
        AsmLinearChartSegment(value: 2, label: 'Other'),
      ],
      semanticLabel: '27 GB used. Messages 12 GB, Video 8 GB, '
          'Photos 5 GB, Other 2 GB.',
    ),
  ],
)
```

### Bar only

```dart
AsmLinearChart(
  showLegend: false,
  segments: const [
    AsmLinearChartSegment(value: 87, label: 'Protected'),
    AsmLinearChartSegment(value: 13, label: 'At risk'),
  ],
  semanticLabel: '87% protected, 13% at risk.',
)
```

Keep the labels even with the legend hidden — they are what the default announcement is built from, and with none the announcement is empty. With no legend the colour is the *only* differentiator between bands, so this form needs a heading that already answers the question.

### Explicit colours

```dart
final ext = context.asmExtendedColors;
final scheme = Theme.of(context).colorScheme;

AsmLinearChart(
  segments: [
    AsmLinearChartSegment(value: 1, label: 'Critical', color: scheme.error),
    AsmLinearChartSegment(value: 4, label: 'Resolved', color: ext.positive),
  ],
  semanticLabel: '5 issues. Critical 1, Resolved 4.',
)
```

Pass tokens, never hexes. If you override one segment's colour, override them all — a mix of ramp and custom colours has no coherent order.

### Constraining the width

```dart
ConstrainedBox(
  constraints: const BoxConstraints(maxWidth: 480),
  child: AsmLinearChart(segments: segments, semanticLabel: label),
)
```

The bar fills whatever width it is given, with no maximum.

### Guarding the empty case

```dart
final total = segments.fold<double>(0, (sum, s) => sum + s.value);

if (total == 0) {
  return const AsmEmptyState(/* ... */);
}

return AsmLinearChart(segments: segments, semanticLabel: _announce(segments));
```

The component asserts that `segments` is non-empty but says nothing about their values. All-zero weights paint an empty strip.

### Full parameter reference — `AsmLinearChart`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `segments` | `List<AsmLinearChartSegment>` | **Yes** | — ; asserted non-empty |
| `showLegend` | `bool` | No | `true` — but the legend only renders if at least one segment has a label |
| `semanticLabel` | `String?` | No | `null` → labelled segments and values, comma-joined. **No total, no units.** |

There is **no `total`, no `caption`, and no `size`.** All three exist on `AsmArcChart`.

### Full parameter reference — `AsmLinearChartSegment`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `double` | **Yes** | — ; asserted `>= 0`. A **relative weight**, not a percentage. |
| `label` | `String?` | No | `null` ; asserted non-empty if given. Omitting it drops the segment from the legend **and** the announcement. |
| `color` | `Color?` | No | `null` → the ramp stop at `index % 5` |

There is **no `automationIdentifier`** on either class.

### Tokens and geometry

| Property | Value | Notes |
| --- | --- | --- |
| Bar height | `spacing700` | 28 |
| Bar width | Full width of parent | No minimum, no maximum |
| Outer corner radius | `AsmCornerRadii.r8` | 8; applied only to the first and last **visible** band |
| Interior joins | Square | — |
| Gap between bands | `spacing100` | 4; reserved only between non-zero bands |
| Bar → legend gap | `spacing600` | 24 |
| Legend dot | 11 | A **hardcoded literal**, on no scale — the arc chart's is `spacing200` (8) |
| Legend label | `bodySmall`, capped at 60% of the row, ellipsized | The arc chart uses `titleSmall` |
| Legend value | `labelSmallEmphasized` | Matches the arc chart |
| Legend row padding | `spacing200` vertical | 8 — the arc chart uses `spacing100` (4) |
| Dotted leader | 1pt dots on a 6pt pitch, `outlineVariant` | `#DCD9D9` / `#322D2D` — painter duplicated verbatim from `arc_chart.dart` |
| Ramp | `extColors.positive`, raw token `onSecondaryFixedVariant`, `colorScheme.tertiary`, `colorScheme.secondary`, `colorScheme.secondaryContainer` | Cycled at 5 |
| Reveal | 700ms, ease-in-out, left-to-right clip; honours reduced motion | — |

`linearChartVisibleRange` is exported as a `@visibleForTesting` top-level function so the corner rule can be asserted without inspecting the canvas. Do not call it from product code.

### Guidance

- **Label every segment.** An unlabelled one is dropped from the legend *and* the announcement.
- **Always pass `semanticLabel`** with the total and the units in it. The composed default has neither.
- **Five segments maximum.** The ramp cycles at five and the legend stops being matchable.
- **Guard all-zero data** before rendering. Nothing asserts it and the painter draws nothing.
- **Round segment values, or pass integers.** Non-whole values print their full floating-point expansion with a period as the decimal mark.
- **Keep legend labels to one or two words.** They ellipsize at 60% of the row with no recovery.
- **Override all segment colours or none.** A mix of ramp and custom colours has no order.
- **Pass tokens to `color`, never hexes.**
- **Constrain the width** on wide layouts, and prefer the legend alone below roughly 200pt.
- **Test in dark mode.** One ramp stop does not change at all between themes and two fail 3 : 1 against the dark surface.
- **Do not rebuild the chart with new data during its first 700ms.** There is no update hook, so a mid-wipe data change paints the new bar at whatever the clip had reached.
- The dotted-leader painter and the value formatter in this file are **duplicated** in `arc_chart.dart`. If you change one, change both.

---

## Rules

1. Every segment MUST carry a `label`. An unlabelled segment is dropped from the legend and from the announcement, leaving a band no user can name.
2. `semanticLabel` MUST be supplied whenever the total or the unit matters. The composed default carries neither, because the component has no total slot.
3. A chart MUST NOT be rendered with zero labelled segments — the legend disappears and the announcement is empty.
4. A linear chart MUST hold no more than five segments. The colour ramp cycles at five and the legend becomes unmatchable.
5. A linear chart MUST NEVER be used as a progress indicator. It has no unfilled track. Use [[Progress Bar]].
6. A linear chart MUST NOT be drawn with a single segment — one band filling the bar is indistinguishable from completed progress.
7. All-zero data MUST be guarded before rendering. The painter draws nothing and nothing asserts. Use [[Empty State]].
8. Loading data MUST NOT be rendered as a wiping bar. Use [[Skeleton Loader]].
9. Segment values MUST be rounded, or integers. Non-whole values print their full floating-point expansion with a locale-blind decimal mark.
10. All segments MUST share one unit.
11. Legend labels MUST be one or two words. They ellipsize at 60% of the row width with no wrap and no tooltip.
12. Segment colours MUST come from tokens, never hexes, and MUST be overridden for all segments or none.
13. Band colour MUST NEVER be the only way to identify a part. Two ramp stops fail 3 : 1 against the dark surface, one adjacency is 1.05 : 1 in light, and neither the teal nor the indigo stop is remapped in a high-contrast theme.
14. The bar MUST be constrained on wide layouts. There is no maximum width.
15. Below roughly 200pt of available width the legend MUST be used alone — the bands become slivers.
16. Both themes MUST be checked. One ramp stop is identical in both and two invert.
17. The chart MUST NOT be rebuilt with new data during its 700ms reveal — there is no update hook.
18. A total, when one exists, MUST appear both in a heading above the chart and in `semanticLabel`. The heading is outside the chart's announcement.

---

## Open Items

1. **The linear chart and [[Data Arc Chart]] are siblings that diverge systematically, with no reason recorded for any of it.** They share a data model, a legend concept, a ramp concept, a value formatter, and a dotted leader, and they disagree on: the **announcement** (this one composes the breakdown, the arc suppresses it — item 3), the ramp length (5 vs 4), the legend dot (11, hardcoded, vs 8, from `spacing200`), the legend label ramp (`bodySmall` vs `titleSmall`), the legend row padding (`spacing200` vs `spacing100`), the chart-to-legend gap (`spacing600` vs `spacing400`), where the value formatter lives (a top-level function here, a private method there), and whether a `total`, a `caption`, or a size axis exists at all. The dotted-leader painter is **duplicated verbatim** in both files with identical constants, differing only in which Figma frame its comment names. Two components this similar should share a legend widget, a ramp, a formatter, and a leader painter. Recorded identically as item 1 on [[Data Arc Chart]].
2. **The legend dot is 11pt, hardcoded, and off every scale.** Its own comment acknowledges this — the Figma frame draws an 11px swatch, which sits between `spacing200` (8) and `spacing300` (12), so it is encoded as a component-level constant instead. The arc chart's equivalent dot is `spacing200`. Either Figma is wrong and the dot should be 12, or the arc chart is wrong and should also be 11; both cannot be right, and the two legends currently look different for no stated reason.
3. **This chart announces its breakdown and [[Data Arc Chart]] does not.** The arc chart wraps itself in a semantics container labelled with its total and caption and suppresses everything beneath, so its legend — the entire breakdown — is unavailable to assistive technology. This chart composes "Label Value, Label Value" from the same data. **The component with less information announces more.** Both dartdocs claim colour is never the only signal because each segment carries its value and label as visible text; that claim is true here and false there. The fix belongs on the arc chart, and both docs should point at one shared announcement helper.
4. **The indigo ramp stop bypasses the theme and fails silently.** It is read directly from the generated token map with the violet stop as a fallback, because the token is surfaced on neither the colour scheme nor the extended palette. Three consequences: (a) the value is **identical in the light and dark maps**, so alone among the five stops it does not adapt — 8.11 : 1 in light, **1.77 : 1** in dark, below the 3 : 1 floor; (b) if the key ever disappears from the map the fallback is the *adjacent* stop, so bands 2 and 3 would render in the same colour, side by side, with no error at any layer; (c) reading raw token maps in a widget bypasses the theme extension the rest of the system uses. The token should be surfaced on `AsmExtendedColors` with a dark value, and the fallback should be a stop that is not its own neighbour.
5. **The accessibility documentation states that legend text wraps rather than clipping; it does the opposite.** Labels are capped at 60% of the row width with wrapping disabled and an ellipsis overflow. There is no tooltip and no expansion, so a truncated label is unrecoverable for every user. The same claim and the same implementation appear on [[Data Arc Chart]].
6. **All-zero data renders blank with no assert and no empty state.** `segments` is asserted non-empty but their values are not constrained beyond being non-negative, and the painter returns early when the sum is zero. The result is an empty 28pt strip above a legend of zeros — a silently broken chart rather than a loud failure or a designed empty state. [[Data Arc Chart]] has the identical gap.
7. **The chart is a stateful widget with no update hook.** The animation is configured once when the widget's dependencies resolve; there is no handler for a widget update. Replacing the segments therefore does not re-animate, and a data change arriving inside the 700ms wipe paints the new bar at whatever the clip had reached. Neither chart implements the hook.
8. **The value formatter is locale-blind.** It prints whole numbers as integers and everything else as a raw decimal — so one third becomes its full sixteen-digit floating-point expansion, always with a period as the decimal mark, regardless of locale. It is also the only number formatting in the component, since there is no total. The same function, with the same defect, is duplicated on [[Data Arc Chart]] — where it additionally contradicts the caller-formatted `total` string.
9. **No high-contrast branch**, and two ramp stops are not remappable. The teal stop is read from the extended colour palette and the indigo stop from the raw token map, neither of which the platform contrast pipeline touches, so a forced-colours theme shifts three of the five bands and leaves two. This is the same defect as [[Status Indicators]] open item 9, and it affects both charts.
10. **The ramp's stop 2 and stop 3 are 1.05 : 1 apart in light mode** — indigo and violet are effectively one colour. It passes only because the 4pt gaps let the surface show through and both stops clear 7 : 1 against it, which means the *separation* is doing the work the *colours* should. Any narrowing of the gap, or any band narrow enough that its neighbours' gaps dominate it, breaks the distinction. Two adjacent stops this close should not both be in a five-stop categorical ramp.
11. **There is no minimum or maximum width.** The bar fills whatever it is given, so a 120pt column produces slivers separated by 4pt gaps and a full-bleed desktop layout produces a 28pt-tall horizontal rule. Neither is guarded, asserted, or mentioned in the dartdoc, whose responsiveness note frames unbounded width as a feature.
12. **There is no `total` or `caption` slot, and no note explaining the omission.** The sibling arc chart has both. The consequence is not merely cosmetic: any total the caller renders above the chart sits outside the semantics container, so it is absent from the announcement unless `semanticLabel` is overridden — which means the default announcement for the common "X GB used, split four ways" case is a list of bare numbers.
13. **No `automationIdentifier` on the chart or on a segment.** An automated test cannot locate the chart, and can only assert its content through the accessibility label. `linearChartVisibleRange` is exported `@visibleForTesting` to work around part of this for the corner rule, which is a narrower fix than an identifier would be.
14. **Nothing is interactive, and nothing records that as a decision.** There is no hover, no per-band tooltip, no highlight, and no drill-in, so the legend is the only per-part readout and it is visual only. For a data-visualisation component that is a significant scope decision with no note explaining it.
15. **Neither chart has a Figma node id.** The `linear_chart` frame, its `bar` sub-frame, and the 184pt `stat-leader` line are all named, and the 11pt dot and the 18pt row rhythm are described as measured — but no node is cited, so the off-scale literals in item 2 cannot be re-verified against a specific frame.
16. **The chart has no product call sites.** It ships public, exported, story-covered, and widget-tested, and nothing in the repository uses it outside those two harnesses. Same as [[Data Arc Chart]], [[Expanded Card]], and the carousel indicator in [[Carousel]] — four of the six components documented in this batch exist only as design-system surface, which is also why defects like items 4 and 6 have gone unnoticed.
