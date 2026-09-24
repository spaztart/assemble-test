# Component: Data Arc Chart

> Role: A half-ring gauge that shows how a single total breaks down across a small number of parts, with the total printed in the middle and an optional dotted legend beneath. It is a composition readout, never a progress indicator.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe what the gauge means, how many parts it tolerates, and what it must never be used for. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The legend is **not announced**. The gauge reports only its total and caption to assistive technology and explicitly suppresses everything beneath it, so the breakdown — the entire point of the component — is unavailable to a screen-reader user unless you supply it yourself.
> Source: Figma `Components` → `arc_gauge` (with `size` variants `large` / `small`), legend from `arc_chart_list` and its 184pt `stat-leader` line. No node ids are cited in the implementation. Implementation: `pegasus_flutter/lib/asm/components/arc_chart.dart`.

## Overview

The arc chart is a semicircular ring, open at the bottom, drawn as a set of rounded bands separated by small gaps. Each band's length is proportional to its share of the whole. The total sits in the middle of the arc as large type, with an optional caption below it, and an optional legend below that lists each part with its colour, its label, and its value, joined by a dotted leader.

**The distinction most often got wrong is arc chart versus [[Progress Bar]].** A ring that fills up looks like progress and is not:

| | Arc Chart | [[Progress Bar]] |
| --- | --- | --- |
| Shows | How a whole **divides** | How far along one thing **is** |
| Segments | Several, all meaningful | One, plus a track |
| Direction | Static — the parts don't advance | Advances toward completion |
| Total | A quantity | Always 100% |
| Announces | Its total | Its progress |

If the answer to "what does the empty part of the ring mean?" is "not done yet," you want a progress bar. If it is "nothing — the ring is full," you want this.

**The second distinction is arc versus [[Data Linear Chart]].** They are siblings with the same data model and the same legend. The arc is for a total that matters as a headline number; the bar is for a proportion where the shape of the split matters more than the magnitude. The arc has a centre, so it can print the total; the bar has none, so it cannot. **They are not visually interchangeable and they do not behave identically** — see [Open Items](#open-items) item 1 for the list of ways they diverge.

**The third distinction is that segment values are weights, not the total.** Each segment carries a relative weight; the ring is drawn by dividing each weight by the sum of all weights. The `total` you pass is a **string you formatted yourself** and is printed in the centre without being checked against anything. Nothing verifies that the weights sum to the total. This is deliberate — it lets you print "1.2 GB" in the middle of a ring divided by byte counts — and it means the centre number and the ring can disagree silently.

**The fourth distinction is arc versus a table.** Four bands and four legend rows convey a shape. Eight convey nothing — and past four segments the colour ramp starts repeating, so two bands become the same colour. **Keep an arc chart to four segments or fewer.**

## Anatomy

```
                    ╭━━━━━━━━━━━━━━━━━━━━━━━━━╮
              ╭━━━━╯   ┆3°┆         ┆3°┆      ╰━━━━╮
          ╭━━╯                                      ╰━━╮       ← stroke 26 (large)
        ╭━╯              ┌──────────┐                   ╰━╮       rounded band ends
       ╭╯                │   1,248  │  ← total (display) ╰╮
       │                 │  events  │  ← caption          │
       ╰                 └──────────┘                     ╯
       └─────────────────── 299 wide (large) ──────────────┘
                              ┆16┆
        ●  Messages ·································  12      ← legend row
        ●  Video ·······································  8       dot 8, leader dotted,
        ●  Other ·······································  4       value right-aligned
```

| Part | Required | Notes |
| --- | --- | --- |
| **Arc track** | Yes | A 180° ring, open at the bottom, drawn left → over the top → right. |
| **Bands** | Yes | One per segment, in draw order, length proportional to weight. Rounded ends. |
| **Gaps** | Between non-zero bands | 3° each. Reserved only between bands that actually have length. |
| **Total** | **Yes** | A caller-formatted string in the centre. Asserted non-empty. |
| **Caption** | No | One line under the total. Asserted non-empty if given. |
| **Legend** | No — on by default | One row per **labelled** segment: colour dot, label, dotted leader, value. An unlabelled segment gets a band and no row. Suppressed entirely if no segment carries a label. |
| **Legend dot** | Yes, per row | 8pt, in the band's colour. |
| **Dotted leader** | Yes, per row | 1pt dots on a 6pt pitch, in `outlineVariant`. Takes all remaining width. |
| **Legend value** | Yes, per row | Formatted by the component, right-aligned. |
| **Track behind the bands** | **Absent** | There is no unfilled track. The bands always fill the whole 180°. |
| **Centre hole** | Yes | The ring is annular; the total sits in the hole. |

The absence of an unfilled track is what stops the arc reading as progress — and it is also why a chart with a single segment looks like a completed progress ring. See [Anti-Patterns](#anti-patterns).

## Sizes

| Size | Gauge width | Stroke | Total type | Caption type |
| --- | --- | --- | --- | --- |
| `large` | 299 | 26 | Display large, emphasized | Title small |
| `small` | 224 | 20 | Display medium, emphasized | Body small |

Because the arc is a half-ring, the drawn height is roughly half the width — about 150 for `large` and 112 for `small`, plus whatever the centre text needs.

**`large` is the default and belongs on a dedicated surface** — a dashboard panel or a report page where the total is the headline. **`small` belongs inside a card** alongside other content, where 299pt of width would dominate.

Both sizes use the same 3° gaps, the same rounded band ends, the same 4-colour ramp, and the same legend geometry. The size axis changes the ring's dimensions and the centre type ramp; it does not change the legend at all, which means a `small` gauge with a long legend is mostly legend.

## Variants

There are no colour or style variants. Every arc chart is drawn from one ramp, and the only way to change a band's colour is per segment.

### The ramp, and what happens past four segments

Bands take their colour from a four-stop ramp, in draw order: teal, violet, blue-violet, light lavender. A segment can override its own colour.

**The ramp cycles.** Segment five gets the first colour again, segment six the second, and so on. Adjacent bands therefore never share a colour — but **non-adjacent bands do**, which breaks the legend: two rows with the same coloured dot cannot be matched to two different bands. Since matching legend to band is the legend's only job, a five-segment arc chart has a broken legend.

Two rules follow:

- **Four segments maximum.** This is a hard ceiling, not a preference.
- **If you must exceed four, override every segment's colour explicitly** and take responsibility for the resulting palette — including its contrast against the surface and against its neighbours.

The ramp also **inverts between light and dark mode**. Two of its stops swap ends of the lightness range, so the visual order of the bands from dark to light is not the same in the two themes. Computed contrast against the card surface:

| Stop | Light | Dark |
| --- | --- | --- |
| 1 — teal | 4.53 : 1 | 7.26 : 1 |
| 2 — violet | 7.74 : 1 | **13.41 : 1** — becomes near-white |
| 3 — blue-violet | 4.50 : 1 | 7.57 : 1 |
| 4 — light lavender | **1.90 : 1** | **1.26 : 1** — near-invisible |

Stop 4 fails the 3 : 1 non-text floor in both themes, and in dark mode it is very nearly the surface colour. **A four-segment chart's fourth band is effectively invisible in dark mode.** See [Accessibility](#accessibility) and [Open Items](#open-items) item 3.

## States

**The chart has no states.** There is no hover, focus, pressed, selected, or disabled appearance, because nothing in it is interactive or focusable. [[States]] does not apply to it.

Two consequences worth being explicit about, since a reader expecting the usual state set will look for them:

- **There is no loading state.** The reveal animation is not one — it runs on data that has already arrived. A chart wiping open while a request is in flight tells the user their data is here when it is not. Use [[Skeleton Loader]].
- **There is no empty state.** All-zero data is not handled; the ring simply does not draw. Use [[Empty State]].

The only conditional appearance is the reduced-motion branch, which suppresses the reveal — see [Behaviors](#behaviors).

## Behaviors

- **Segment values are relative weights.** Each band's angle is its weight over the sum of all weights. Passing percentages, counts, or bytes all work; mixing units within one chart does not.
- **Gaps are reserved only between non-zero bands.** A zero-weight segment takes no angle and consumes no gap, so a chart with a zero segment looks exactly like a chart without it — except that the segment still appears in the legend, with a value of zero. That is usually what you want; be aware the ring and the legend disagree on how many parts there are.
- **All-zero data renders nothing.** With every weight at zero, the painter returns before drawing. You get the centre total, the caption, and a legend of zeros, over blank space where the ring should be. There is no empty state and no assert. **Check for this before rendering** and use [[Empty State]] instead. See [Open Items](#open-items) item 5.
- **The reveal animation sweeps the ring open over 700ms** with an ease-in-out curve, and it runs once on first build.
- **Reduced motion is honoured.** When the platform asks for reduced motion the ring is drawn complete with no animation. This is the correct behaviour and the chart is one of the few components in the system that implements it.
- **New data does not re-animate, and may not settle correctly.** The animation is set up once and there is no update hook, so replacing the segments repaints the ring at whatever the animation's current value is. In practice the animation has completed by then and the new ring appears instantly — but a data change *during* the first 700ms will land mid-sweep. See [Open Items](#open-items) item 6.
- **The centre total is a string you format; the legend values are formatted by the component.** The two use different rules and can disagree — see [Content](#content).
- **Legend labels do not wrap.** They are capped at 60% of the row's width and ellipsized. The component's own documentation claims text wraps rather than clipping; it does not. See [Open Items](#open-items) item 4.
- **The legend's dotted leader absorbs all slack**, so the value column is right-aligned and the label column is left-aligned regardless of label length.
- **Nothing about the chart is interactive.** No hover, no tap, no tooltip, no highlight-on-hover, no drill-in. If a user needs a per-segment value, it is in the legend or it is nowhere.
- **Text scale grows the centre text and the legend rows** but not the ring, whose dimensions are fixed per size. At large text scales the centre total can exceed the ring's hole.

## Content

The chart has three kinds of text and each has a different owner.

**The total.** A string you format. It is printed verbatim, asserted non-empty, and never compared to the segment weights.

- **Include the unit if the number needs one** — `1.2 GB`, `48%`, `1,248`. There is no unit slot.
- **Keep it short.** It sits in the ring's hole at display type. Four or five characters at `large`, fewer at `small`.
- **Format it for the locale** — thousands separators, decimal marks. Nothing does this for you.

**The caption.** One line under the total, naming what the total counts.

- **A noun, lower case, no full stop** — `events`, `devices scanned`, `of 5 GB used`.
- **Not a restatement of the chart's own heading.** If the panel above already says "Storage," the caption should not.
- **Omit it rather than pass an empty string** — an empty caption asserts.

**Legend labels and values.** Labels are yours; values are formatted by the component.

- **Labels must be short.** They are capped at 60% of the row width and ellipsized, with no wrapping and no tooltip, so an over-long label is silently truncated with no way to read it.
- **Labels are nouns, matching the vocabulary used elsewhere for the same data.**
- **Every segment must have a label if the legend is shown.** The legend renders one row per *labelled* segment and silently skips the rest, so an unlabelled segment contributes a coloured band with **no legend row at all** — an unexplained slice of the ring. The legend also disappears entirely if no segment carries a label, whatever `showLegend` says.
- **The component formats values as plain integers when whole and as raw decimals otherwise.** A weight of one third prints its full floating-point expansion, with a period as the decimal mark regardless of locale. **Round your weights before passing them,** or pass integers. See [Open Items](#open-items) item 7.

## Decision Tree

```
Does the empty part of the shape mean "not done yet"?
├── Yes ─────────────────────────────────────→ use [[Progress Bar]]
│                                              This chart has no track;
│                                              its bands always fill 180°.
└── No — the whole is divided among its parts
    │
    ├── Is there only one part? ──────────────→ NOT this component. One band
    │                                            filling the whole ring reads
    │                                            as completed progress.
    │
    ├── Are there more than four parts? ──────→ NOT this component. The ramp
    │                                            cycles at four and the legend
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
    └── A total divided among 2–4 parts
        │
        ├── Does the TOTAL matter as a headline number?
        │   ├── Yes ──────────────────────────→ Arc Chart. It has a centre
        │   │                                    to print the total in.
        │   └── No — only the split matters ──→ use [[Data Linear Chart]]
        │
        └── Which size?
            ├── A dedicated dashboard surface ─→ large (299 wide)
            └── Inside a card, beside other
                content ──────────────────────→ small (224 wide)
```

## Accessibility

**The breakdown is not announced.** This is the component's defining accessibility defect and the reason for the banner rule.

The chart presents as a single node whose label is the total followed by the caption — "1,248 events" — and it **explicitly suppresses the semantics of everything inside it, including the legend.** So a screen-reader user is told the total and nothing else. The labels, the values, and the split — the entire content of the chart — are unavailable.

The component's own documentation claims the opposite: that colour is never the only signal because every segment carries its value and label as visible text. That is true for a sighted user and false for a screen-reader user, because the suppression removes exactly that text from the tree.

**You must supply the breakdown yourself.** Compose it into the semantic label:

```
'1,248 events. Messages 12, Video 8, Other 4.'
```

That is what [[Data Linear Chart]] does automatically. See [Open Items](#open-items) item 2.

| Requirement | Status | Notes |
| --- | --- | --- |
| Accessible name | **Partial** | Total + caption only. Overridable, and you should override it. |
| Breakdown available to AT | **No** | Suppressed. The legend is inside the exclusion. |
| Colour not the only signal | **For sighted users only** | The compensating text is not in the semantics tree. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Stop 4 fails both themes** | 1.90 : 1 light, 1.26 : 1 dark. Adjacent bands fail too — see below. |
| Text contrast (WCAG 1.4.3) | Total, caption, legend text pass | The dotted leader is decorative: 1.40 : 1 light, 1.06 : 1 dark. |
| Label truncation | **Ellipsized with no recovery** | Capped at 60% of row width, no wrap, no tooltip. |
| Touch target 48 × 48 | **N/A** | Nothing is interactive. |
| Keyboard reachable | **N/A** | Nothing is focusable. |
| Reduced motion | **Met** | The ring is drawn complete when reduced motion is requested. |
| High contrast | **Not handled** | No branch, and one ramp stop is not remappable. |

**Adjacent bands do not meet 3 : 1 against each other:**

| Adjacent pair | Light | Dark |
| --- | --- | --- |
| 1 → 2 | 1.71 : 1 | 1.85 : 1 |
| 2 → 3 | 1.72 : 1 | 1.77 : 1 |
| 3 → 4 | 2.37 : 1 | 6.00 : 1 |

The 3° gaps between bands mitigate this — the surface shows through, so a reader is separating each band from the *background* rather than from its neighbour, and stops 1–3 all clear 4 : 1 against the surface in light mode. **Stop 4 is the failure that matters**, because it fails against the surface as well, so in dark mode the fourth band has neither adjacency contrast nor surface contrast.

Four obligations the component cannot discharge for you:

1. **Always pass a semantic label that includes the breakdown.** The default label omits it and the legend is suppressed.
2. **Keep legend labels short enough not to truncate.** There is no wrap and no way for any user to recover a truncated label.
3. **Do not rely on band colour alone to identify a part.** Stop 4 is near-invisible in dark mode, adjacent bands fail 3 : 1, and the teal stop is not remapped in a high-contrast theme while the other three are — so a contrast theme changes the ramp's order. The legend is the identification mechanism, and it is visual only.
4. **Check for all-zero data.** A blank ring with a total of zero communicates nothing; it also communicates nothing to a screen reader, which will hear only "0."

## Anti-Patterns

**❌ Using it as a progress indicator.** There is no unfilled track; the bands always fill the whole 180°. → Use [[Progress Bar]].

**❌ A single segment.** One band filling the ring is indistinguishable from completed progress. → Use a number, or [[Progress Bar]].

**❌ More than four segments.** The ramp cycles, so two bands share a colour and the legend can no longer be matched to the ring. → Four maximum, or a table.

**❌ Relying on the default announcement.** It carries the total and caption and nothing else; the legend is explicitly suppressed. → Compose the breakdown into `semanticLabel`.

**❌ Assuming the centre total matches the ring.** Nothing compares them. The total is a string; the bands are weights. → Derive both from the same data.

**❌ Passing unrounded decimals as weights.** A value of one third prints its full floating-point expansion in the legend, with a period as the decimal mark regardless of locale. → Round, or pass integers.

**❌ Formatting the centre total without locale awareness.** It is printed verbatim. → Format it yourself, for the locale.

**❌ Long legend labels.** Capped at 60% of the row and ellipsized, with no wrap and no tooltip. → Short nouns.

**❌ Rendering it with all-zero data.** The painter draws nothing; you get a total, a caption, and blank space. → Guard the case and use [[Empty State]].

**❌ Rendering it while data is loading.** A ring animating open from zero looks like real data arriving. → Use [[Skeleton Loader]].

**❌ Expecting hover or tap on a band.** Nothing is interactive. → The legend is the only per-part readout.

**❌ Mixing units across segments.** The bands are proportional to the weights; two different units produce a meaningless split. → One unit per chart.

**❌ Using a `large` chart inside a card.** 299pt of width plus a legend dominates the card. → `small`.

**❌ Trusting the dark-mode ramp to read like the light-mode ramp.** Two stops swap ends of the lightness range and the fourth is 1.26 : 1 against the surface. → Check both themes.

**❌ Relying on the ramp to survive a high-contrast theme.** There is no branch, and the teal stop comes from the extended palette, which is not remapped. → Do not encode meaning in the colour alone.

---

## Flutter Usage

`AsmArcChart`, `AsmArcChartSegment`, and `AsmArcChartSize` in `lib/asm/components/arc_chart.dart`, exported from `assemble.dart`. It has widget tests and a widgetbook story, but **no product call sites.**

### Enum

```dart
enum AsmArcChartSize { large, small }
```

`large` is the default.

### Basic usage

```dart
AsmArcChart(
  total: '24',
  caption: 'events',
  segments: const [
    AsmArcChartSegment(value: 12, label: 'Messages'),
    AsmArcChartSegment(value: 8, label: 'Video'),
    AsmArcChartSegment(value: 4, label: 'Other'),
  ],
  semanticLabel: '24 events. Messages 12, Video 8, Other 4.',
)
```

**The `semanticLabel` is not optional in practice.** Without it the announcement is "24 events" and the breakdown is suppressed. Every snippet in this doc includes one for that reason.

### Compact, inside a card

```dart
AsmCard(
  child: AsmArcChart(
    size: AsmArcChartSize.small,
    total: '1.2 GB',
    caption: 'of 5 GB used',
    segments: const [
      AsmArcChartSegment(value: 640, label: 'Photos'),
      AsmArcChartSegment(value: 380, label: 'Backups'),
      AsmArcChartSegment(value: 180, label: 'Other'),
    ],
    semanticLabel: '1.2 GB of 5 GB used. Photos 640 MB, Backups 380 MB, Other 180 MB.',
  ),
)
```

Note that the centre string is `1.2 GB` while the weights are megabytes. That is legitimate — the weights only set the angles — but it means the legend prints `640`, `380`, `180` with no unit. If the unit matters in the legend, put it in the label.

### Without the legend

```dart
AsmArcChart(
  total: '87%',
  caption: 'protected',
  showLegend: false,
  segments: const [
    AsmArcChartSegment(value: 87, label: 'Protected'),
    AsmArcChartSegment(value: 13, label: 'At risk'),
  ],
  semanticLabel: '87% protected. 13% at risk.',
)
```

With no legend the colour is the *only* differentiator between bands, so this form is only defensible when the centre total already answers the question. Keep the labels — they are still needed for the semantic label you write.

### Explicit colours

```dart
final ext = context.asmExtendedColors;

AsmArcChart(
  total: '3',
  caption: 'issues',
  segments: [
    AsmArcChartSegment(value: 1, label: 'Critical', color: Theme.of(context).colorScheme.error),
    AsmArcChartSegment(value: 2, label: 'Resolved', color: ext.positive),
  ],
  semanticLabel: '3 issues. Critical 1, Resolved 2.',
)
```

Pass tokens, never hexes. If you override one segment's colour, override them all — a mix of ramp and custom colours has no coherent order.

### Guarding the empty case

```dart
final total = segments.fold<double>(0, (sum, s) => sum + s.value);

if (total == 0) {
  return const AsmEmptyState(/* ... */);
}

return AsmArcChart(
  total: _formatTotal(total),
  segments: segments,
  semanticLabel: _announce(total, segments),
);
```

The component asserts that `segments` is non-empty but says nothing about their values. All-zero weights render a blank ring.

### Full parameter reference — `AsmArcChart`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `segments` | `List<AsmArcChartSegment>` | **Yes** | — ; asserted non-empty |
| `total` | `String` | **Yes** | — ; asserted non-empty. Caller-formatted, never validated against the weights. |
| `caption` | `String?` | No | `null` ; asserted non-empty if given |
| `size` | `AsmArcChartSize` | No | `AsmArcChartSize.large` |
| `showLegend` | `bool` | No | `true` |
| `semanticLabel` | `String?` | No | `null` → `'<total> <caption>'`. **Override it.** |

### Full parameter reference — `AsmArcChartSegment`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `double` | **Yes** | — ; asserted `>= 0`. A **relative weight**, not a percentage. |
| `label` | `String?` | No | `null` ; asserted non-empty if given |
| `color` | `Color?` | No | `null` → the ramp stop at `index % 4` |

There is **no `automationIdentifier`** on either class.

### Tokens and geometry

| Property | Value | Notes |
| --- | --- | --- |
| Gauge width | `large` 299 / `small` 224 | Raw literals from the Figma frame |
| Stroke width | `large` 26 / `small` 20 | Raw literals |
| Sweep | 180°, starting at the left and going over the top | — |
| Gap between bands | 3° | Reserved only between non-zero bands |
| Band end rounding | Half of a full round cap | — |
| Total type | `displayLargeEmphasized` / `displayMediumEmphasized` | See [[Typography]] |
| Caption type | `titleSmall` / `bodySmall` | — |
| Chart → legend gap | `spacing400` | 16 |
| Legend dot | `spacing200` | 8 |
| Legend label | `titleSmall`, capped at 60% of the row, ellipsized | — |
| Legend value | `labelSmallEmphasized` | — |
| Legend row padding | `spacing100` vertical | 4 |
| Dotted leader | 1pt dots on a 6pt pitch, `outlineVariant` | `#DCD9D9` / `#322D2D` |
| Ramp | `extColors.positive`, `colorScheme.tertiary`, `colorScheme.secondary`, `colorScheme.secondaryContainer` | Cycled at 4 |
| Reveal | 700ms, ease-in-out, honours reduced motion | — |

### Guidance

- **Always pass `semanticLabel` with the breakdown in it.** This is the single most important line in this section.
- **Four segments maximum.** The ramp cycles at four and the legend stops being matchable.
- **Guard all-zero data** before rendering. Nothing asserts it and the painter draws nothing.
- **Round segment values, or pass integers.** Non-whole values print their full floating-point expansion with a period as the decimal mark.
- **Format `total` for the locale yourself.** It is printed verbatim.
- **Keep legend labels to one or two words.** They ellipsize at 60% of the row with no recovery.
- **Override all segment colours or none.** A mix of ramp and custom colours has no order.
- **Pass tokens to `color`, never hexes.**
- **Use `small` inside a card**; `large` needs a dedicated surface.
- **Test in dark mode.** The ramp inverts and its fourth stop is 1.26 : 1 against the surface.
- **Do not rebuild the chart with new data during its first 700ms.** There is no update hook, so a mid-animation data change lands at whatever the sweep had reached.
- The dotted-leader painter in this file is **duplicated verbatim** in `linear_chart.dart`. If you change one, change both.

---

## Rules

1. `semanticLabel` MUST be supplied and MUST include the per-segment breakdown. The default announcement carries only the total and caption, and the legend is explicitly suppressed.
2. An arc chart MUST hold no more than four segments. The colour ramp cycles at four and the legend becomes unmatchable.
3. An arc chart MUST NEVER be used as a progress indicator. It has no unfilled track. Use [[Progress Bar]].
4. An arc chart MUST NOT be drawn with a single segment — one band filling the ring reads as completed progress.
5. All-zero data MUST be guarded before rendering. The painter draws nothing and nothing asserts. Use [[Empty State]].
6. Loading data MUST NOT be rendered as an animating ring. Use [[Skeleton Loader]].
7. Segment values MUST be rounded, or integers. Non-whole values print their full floating-point expansion with a locale-blind decimal mark.
8. `total` MUST be formatted for the locale by the caller. It is printed verbatim and never checked against the weights.
9. `total` and the segment weights MUST be derived from the same data. Nothing reconciles them.
10. All segments MUST share one unit.
11. Legend labels MUST be one or two words. They ellipsize at 60% of the row width with no wrap and no tooltip.
12. Every segment MUST carry a `label` when the legend is shown.
13. Segment colours MUST come from tokens, never hexes, and MUST be overridden for all segments or none.
14. Band colour MUST NEVER be the only way to identify a part. Ramp stop 4 is 1.26 : 1 against the surface in dark mode and no stop is remapped in a high-contrast theme.
15. `large` MUST NOT be used inside a card. Use `small`.
16. Both themes MUST be checked. The ramp's lightness order inverts between them.
17. The chart MUST NOT be rebuilt with new data during its 700ms reveal — there is no update hook.

---

## Open Items

1. **The arc chart and [[Data Linear Chart]] are siblings that diverge systematically, with no reason recorded for any of it.** They share a data model, a legend concept, a ramp concept, and a dotted leader, and they disagree on: the **announcement** (this one suppresses the breakdown, the linear chart composes it — item 2), the ramp length (4 vs 5), the legend dot (8, from a token, vs 11, hardcoded), the legend label ramp (`titleSmall` vs `bodySmall`), the legend row padding (4 vs 8), the chart-to-legend gap (16 vs 24), where the value formatter lives (a private method here, a top-level function there), and whether a `total` and `caption` exist at all. The dotted-leader painter is **duplicated verbatim** in both files with identical constants, differing only in which Figma frame its comment names. Two components this similar should share a legend widget, a ramp, a formatter, and a leader painter.
2. **The legend is inside the semantics exclusion, so the breakdown is unavailable to assistive technology.** The chart announces its total and caption and suppresses everything else. Its own accessibility documentation asserts that colour is never the only signal because each segment carries its value and label as visible text — but the suppression removes precisely that text from the tree. The sibling linear chart composes "Label Value, Label Value" automatically and has no total to fall back on, so the component with *less* information announces *more*. This is the most consequential defect in either chart.
3. **The fourth ramp stop fails non-text contrast in both themes** — 1.90 : 1 in light, **1.26 : 1** in dark, against the 3 : 1 floor in WCAG 1.4.11. In dark mode it is very nearly the surface colour, so a four-segment chart's fourth band is effectively absent. The ramp also **inverts**: two stops swap ends of the lightness range between themes, so the bands' dark-to-light order is different in the two themes. Both charts' documentation claims the ramp reads correctly in both themes.
4. **The accessibility documentation states that text wraps rather than clipping; the legend does the opposite.** Labels are capped at 60% of the row width with wrapping disabled and an ellipsis overflow. There is no tooltip and no expansion, so a truncated label is unrecoverable for every user. The same claim and the same implementation appear in [[Data Linear Chart]].
5. **All-zero data renders blank with no assert and no empty state.** `segments` is asserted non-empty but their values are not constrained beyond being non-negative, and the painter returns early when the sum is zero. The result is a total, a caption, a legend of zeros, and empty space where the ring should be — a silently broken chart rather than a loud failure or a designed empty state. [[Data Linear Chart]] has the identical gap.
6. **The chart is a stateful widget with no update hook.** The animation is configured once when the widget's dependencies resolve; there is no handler for a widget update. Replacing the segments therefore does not re-animate, and a data change arriving inside the 700ms reveal paints the new ring at whatever the sweep had reached. Neither chart implements the hook.
7. **The legend's value formatter is locale-blind and inconsistent with the centre total.** It prints whole numbers as integers and everything else as a raw decimal — so one third becomes its full sixteen-digit floating-point expansion, always with a period as the decimal mark, regardless of locale. Meanwhile the centre `total` is a caller-formatted string. **One component formats numbers two different ways.** The same formatter, with the same defect, is duplicated in [[Data Linear Chart]].
8. **No high-contrast branch**, and one ramp stop is not remappable. The teal stop — stop 1 — is read from the extended colour palette, which the platform contrast pipeline does not touch, so a forced-colours theme rewrites the other three bands and leaves that one alone. The ramp's order therefore changes under a contrast theme, which is worse than the ramp merely being ignored. This is the same defect as [[Status Indicators]] open item 9; [[Data Linear Chart]] has it twice over, since its indigo stop is read from the raw token map for the same reason.
9. **The gauge width, stroke width, and gap angle are raw literals.** 299, 224, 26, 20, and 3° are all hardcoded from the Figma frame with no token behind them. 224 and 20 are on no scale; 299 is an odd number that will not divide cleanly at any density. The legend's geometry, by contrast, reads correctly from the spacing scale throughout — so the two halves of one component take opposite approaches.
10. **`total` is an unvalidated string.** It is asserted non-empty and then printed verbatim, with nothing comparing it to the sum of the weights. That flexibility is deliberate and useful — it is how you print `1.2 GB` over a ring divided in megabytes — but it means the headline number and the shape beneath it can contradict each other with no warning at any layer.
11. **No `automationIdentifier` on the chart or on a segment.** An automated test cannot locate the chart, and cannot assert which band is which except by reading the accessibility label — which, given item 2, does not contain the bands.
12. **Nothing is interactive, and nothing records that as a decision.** There is no hover, no per-band tooltip, no highlight, and no drill-in, so the legend is the only per-part readout and it is visual only. For a data-visualisation component that is a significant scope decision with no note explaining it.
13. **Neither chart has a Figma node id.** The `arc_gauge` frame and the `arc_chart_list` legend frame are named, and the leader's rhythm is described as measured across a 184pt line, but no node is cited — so the raw literals in item 9 cannot be re-verified against a specific frame.
14. **The chart has no product call sites.** It ships public, exported, story-covered, and widget-tested, and nothing in the repository uses it outside those two harnesses. Same as [[Data Linear Chart]], [[Expanded Card]], and the carousel indicator in [[Carousel]] — four of the six components documented in this batch exist only as design-system surface, which is also why defects like items 2 and 5 have gone unnoticed.
