# Component: Progress Bar

> Role: A determinate pill-shaped bar showing a fraction. Used for gauges and meters as much as for progress.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A progress bar is ALWAYS determinate. If you don't know the fraction, use a [[Loaders|spinner]] — never a bar stuck at an arbitrary value.
> Source: Figma `Components` → `Progress bar` (node `2447-593`). Implementation: `pegasus_flutter/lib/asm/components/progress_bar.dart`.

## Overview

A progress bar is a horizontal pill: a track, and a fill covering some fraction of it.

**It does two jobs, and they are not the same.** As *progress*, the fill grows toward completion — a download, a scan, a multi-step form. As a *gauge*, the fill is a measurement that may go up or down and has no completion — a protection score, storage used, password strength. The component is the same; the copy and the color mean different things.

That distinction matters most in the status colors. On a progress bar, a red fill means something went wrong. On a gauge, red means the *measured value* is bad — the bar itself is working perfectly. Getting this backwards produces a scan at 30% that looks like it's failing.

**The bar is always determinate.** There is no indeterminate mode, no animation, and no built-in motion. If the fraction is unknown, this is the wrong component; see [[Loaders]].

## Anatomy

```
   ┌──────────────────────────────────────────────────────┐
   │██████████████████████████                            │
   └──────────────────────────────────────────────────────┘
    ↑                         ↑                          ↑
   fill (value × width)    fill edge                   track

   Both ends fully rounded. The fill is itself rounded, so at low
   values it reads as a pill inside the track rather than a stub.


   In a gauge context — the label and value are the LAYOUT's job:

   Protection score                                    72
   ┌──────────────────────────────────────────────────────┐
   │████████████████████████████████████                  │
   └──────────────────────────────────────────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Track** | Yes | Full width, pill radius. Color paired to the status. |
| **Fill** | — | `value` × width. Also pill-rounded. Absent at 0. |
| **Label** | **Not part of the component** | The layout owns it. |
| **Value text** | **Not part of the component** | The layout owns it. |

**The bar carries no text.** No label, no percentage, no min/max. All of it belongs to the surrounding layout, which means a bare progress bar communicates only a proportion — the user can see it's about two-thirds full but not of what.

**At `value` 0 there is no fill at all** — just the track. So an empty gauge and a not-yet-started operation look identical, and only the label distinguishes them.

### Sizes

| | `thick` (default) | `thin` |
| --- | --- | --- |
| Height | **14** | 8 |

**`thick` is the default and the right choice for a gauge** — a score or meter the user is meant to read as a value.

**`thin` is for progress that accompanies other content** — under a list row, inside a card beneath a title. It's quieter and doesn't compete.

Note 14 is not on the spacing scale, which jumps 12 → 16; 8 is `md.spacing.200`. See [Open Items](#open-items).

## Status

Four status ramps, each pairing a fill with a matching track.

| Status | Fill | Track | Means |
| --- | --- | --- | --- |
| **`brand`** (default) | Brand gradient, red → purple | `surfaceContainerHighest` | Neutral. The default for progress and for unscored gauges. |
| **`moderate`** | `secondary` — blue | `secondaryContainer` | Informational, in-progress. |
| **`critical`** | Brand orange | `errorContainer` | The measured value is bad. |
| **`low`** | `positive` — green | `positiveContainer` | The measured value is good — "all clear". |

**`brand` is the only status with a gradient fill.** The other three are flat.

**The status names describe the measured value, not the bar's health.** `critical` means *the thing being measured* is in a bad state; `low` means it's fine. That reading is natural for a gauge — a `critical` protection score is a bad score — and confusing for progress, where a `critical` bar looks like a failure. **Use `brand` or `moderate` for actual progress** and reserve `critical` and `low` for gauges where the value carries a judgement.

**The names are counterintuitive on their own.** `low` meaning "good" only makes sense if you read it as "low risk". `moderate` was renamed from `attention` when the color changed from orange to blue, and `low` was previously a gradient. Both are documented in the source as historical renames — worth knowing when reading older code.

**Status is announced**, so the meaning isn't color-only. It's part of the default announcement.

## Behaviors

**The value is clamped**, so an out-of-range value renders as full or empty rather than overflowing.

**The bar fills its parent's width by default.** It takes a fixed width only if given one, which means an unconstrained parent produces a zero-width bar. In practice: put it in something with bounded width.

**There is no animation.** A value change snaps. A bar that advances in visible jumps is the result — for a smooth fill, the caller animates the value. [[Loaders]]' brand loader tweens its fill; this one does not.

**The fill is rounded at both ends, and clipped to the track.** At very low values the fill reads as a small pill rather than a sliver, so a 2% value is still visible — good for gauges, slightly overstating for progress.

**The bar is not interactive.** It's an output. A draggable bar is a slider, which this is not, and wrapping it in a tap handler creates a control with no accessible name.

**Reduced motion is irrelevant** — nothing moves.

## Content

The bar has no copy, so all of this is the surrounding layout's responsibility, and **it is not optional** — a bar with no label communicates a proportion of nothing.

**Name what's being measured, not the bar.** "Storage used", not "Progress".

- **Show the value in the layout when the exact number matters.** A gauge usually wants it; progress often doesn't, since the bar's length is the point.
- **For progress, describe the operation**: "Scanning your files…". Pair it with a [[Loaders|spinner]] only if the bar alone doesn't read as active.
- **For a gauge, give the value meaning.** "72" is a number; "72 — Good" is a judgement, and it's what the status color is already implying. Say it in text so the meaning isn't color-only.
- **Never use a percentage as the label.** The bar and the announced value already carry it.
- **Never label a gauge as progress.** "Protection score" is not something that completes.

## Decision Tree

```
Do you know the fraction?
├── no ──────────────────────────────────────→ [[Loaders]] — a spinner
│                                               NEVER a bar at a guessed value
└── yes
    │
    ├── Is it a MEASUREMENT rather than progress?
    │   ├── and it splits into 2–5 named parts?
    │   │   ├── the total is the headline ───→ [[Data Arc Chart]]
    │   │   └── only the split matters ──────→ [[Data Linear Chart]]
    │   └── yes, a single value → PROGRESS BAR as a gauge
    │             ├── value is bad ──────────→ critical
    │             ├── value is good ─────────→ low
    │             ├── informational ─────────→ moderate
    │             └── unscored ──────────────→ brand (default)
    │
    ├── Is it a branded, full-screen or card-level wait?
    │   └── yes ────────────────────────────→ [[Loaders]] — the brand loader
    │
    ├── Are you waiting for content whose LAYOUT you know?
    │   └── yes ────────────────────────────→ [[Skeleton Loader]]
    │
    └── PROGRESS BAR as progress
        ├── status → brand (default) or moderate.
        │            NEVER critical / low — they judge a VALUE, not progress
        ├── the bar is the point ───────────→ thick (default)
        └── it accompanies other content ───→ thin
```

**Progress bar versus the brand loader in [[Loaders]]** — both determinate. The brand loader is a branded moment that owns the screen; a progress bar is a gauge or meter inside a layout. Note they take opposite value scales, which is a live inconsistency; see [Open Items](#open-items).

**Progress bar versus a [[Loaders|spinner]]** is only ever about whether you know the fraction. Never fake one to get a bar.

**Progress bar versus [[Data Linear Chart]]** is the confusion to watch for, because the two are the same shape: a rounded horizontal bar with a coloured fill. The difference is the *track*. A progress bar has one fill against an unfilled remainder, and that remainder means "not yet." A linear chart has no track — its segments always fill the whole bar, and the split between them is the message. A user cannot tell them apart by looking, so never use a linear chart where a remainder would be read as incompleteness, and never use a progress bar to show a composition. The same rule applies to [[Data Arc Chart]], which is a ring with no unfilled track and is therefore not a circular progress indicator.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announced as a labelled container** | Yes. |
| **Value announced** | As a percentage. |
| **Status announced** | Included in the default announcement. |
| **Not color-only** | Status is in the announcement — but see below. |
| **Not focusable** | Correct; it's an output. |
| **Theme-aware** | Fill and track resolve from tokens. |
| **Live region** | **No** — changes are not announced as they happen. |
| **Progress-bar role** | **No** — it's a labelled container with a value, not a progress role. |
| **Automation identifier** | **None** — see [Open Items](#open-items). |

**The default announcement names the status, not the thing being measured.** With no caller-supplied label, a bar announces as "Progress, critical, 40%" — which tells a screen-reader user the severity but not the subject, and says "Progress" for something that may be a gauge. **Always supply a label.** The default is a safety net that keeps the status from being color-only, not a usable announcement.

**The bar is not a live region**, so a value that advances is not announced as it changes. For a long operation the user should be able to follow, the enclosing region needs to announce at intervals — every value change would be intolerable.

**The visible value should be in the layout too.** The announced percentage is only available to assistive tech; a sighted user with low vision reading a 14px bar may not be able to judge the fraction.

**Status color needs a text equivalent for sighted users.** The announcement covers screen readers, but a user who can't distinguish the green from the orange gets nothing — the layout should say "Good" or "At risk" in words.

## Anti-Patterns

**❌ A bar at a guessed value because the fraction is unknown.** → [[Loaders]] — a spinner.

**❌ A bar with no label.** Announces as "Progress, brand, 60%" — a proportion of nothing. → Always label it.

**❌ `critical` or `low` on actual progress.** They judge a measured value; on progress they read as failure or completion. → `brand` or `moderate`.

**❌ A percentage as the label.** → The bar and the announcement already carry it.

**❌ A gauge labelled as progress.** A protection score doesn't complete. → Name the measurement.

**❌ Status color as the only signal for sighted users.** → Put the judgement in text.

**❌ Expecting the bar to animate.** It snaps. → Animate the value at the call site.

**❌ A bar in an unconstrained-width parent.** It collapses to nothing. → Bound the width.

**❌ Overriding the fill or track color.** Bypasses the status ramps and the theme. → Use `status`.

**❌ Wrapping the bar in a tap or drag handler.** A draggable bar is a slider. → This is an output only.

**❌ Announcing every value change.** Intolerable for a screen-reader user. → Announce at intervals from the region.

**❌ A bar so thin the value can't be judged.** `thin` is 8px. → `thick` for anything the user must read as a value.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmProgressBar`, from `pegasus_flutter/lib/asm/components/progress_bar.dart`.

`AsmProgressBar` is stateless. `value` is the only required parameter.

### Enums

```dart
enum AsmProgressBarStatus { brand, moderate, critical, low }  // default: brand
enum AsmProgressBarSize { thick, thin }                       // default: thick
```

### Basic usage

```dart
AsmProgressBar(value: 0.4);
```

**`value` is 0.0–1.0, not 0–100.** [[Loaders]]' `AsmBrandLoader` takes 0–100 for the same concept — don't interchange them. A percentage passed here clamps to 1.0 and renders full.

### A gauge, fully labelled

The bar carries no text, so this is the pattern that actually communicates:

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('Protection score',
            style: context.asmTypographyTokens.bodyMedium),
        // The judgement in text, so it isn't carried by color alone.
        Text('72 — Good',
            style: context.asmTypographyTokens.bodyMediumEmphasized),
      ],
    ),
    SizedBox(height: AsmSpacingScale.s200),
    AsmProgressBar(
      value: 0.72,
      status: AsmProgressBarStatus.low, // low = good
      semanticLabel: 'Protection score',
    ),
  ],
);
```

`semanticLabel` replaces the default "Progress, low" announcement, so the bar announces as "Protection score, 72%".

### Progress, with a smooth fill

The bar doesn't animate, so animate the value:

```dart
TweenAnimationBuilder<double>(
  tween: Tween<double>(end: _fractionComplete),
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeOut,
  builder: (context, value, _) => AsmProgressBar(
    value: value,
    status: AsmProgressBarStatus.moderate,
    semanticLabel: 'Scanning your files',
  ),
);
```

### Thin, beneath a row

```dart
AsmProgressBar(
  value: _uploaded / _total,
  size: AsmProgressBarSize.thin,
  semanticLabel: 'Uploading ${file.name}',
);
```

Guard against a zero total — `0 / 0` is `NaN`, and unlike [[Loaders]]' brand loader, this component's clamp does not sanitise a non-finite value.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `double` | **Yes** | — **0.0 to 1.0** |
| `status` | `AsmProgressBarStatus` | No | `brand` |
| `size` | `AsmProgressBarSize` | No | `thick` |
| `width` | `double?` | No | `null` — fills the parent |
| `foregroundColor` | `Color?` | No | from `status` |
| `foregroundGradient` | `Gradient?` | No | from `status` |
| `trackColor` | `Color?` | No | from `status` |
| `semanticLabel` | `String?` | No | `'Progress, <status>'` |

There is no `automationIdentifier`, no indeterminate mode, and no min/max.

### Guidance

- **`value` is 0.0–1.0.** `AsmBrandLoader.value` is 0–100. The two determinate indicators take opposite scales.
- **Always pass `semanticLabel`.** The default names the status, not the subject.
- **Guard against `NaN`.** A `done / total` with a zero total is not sanitised.
- **Never pass `foregroundColor`, `foregroundGradient`, or `trackColor`.** They bypass the status ramps and the theme; a literal will be wrong in dark mode and high contrast. Use `status`.
- **`width` is rarely needed** — the bar fills its parent. Set it only when the parent is unbounded, and prefer bounding the parent instead.
- **Animate the value, not the bar** — it has no built-in motion.
- **Don't wrap it in a gesture handler.** It's an output.
- **Put the label and value in the layout**, not just in `semanticLabel` — a sighted low-vision user needs them too.
- Remember `critical` and `low` judge a measured value. For progress, use `brand` or `moderate`.

---

## Rules

1. A progress bar is ALWAYS determinate. Unknown fractions MUST use a [[Loaders|spinner]].
2. `value` is 0.0–1.0. `AsmBrandLoader` is 0–100. NEVER interchange them.
3. Every progress bar MUST have a caller-supplied label. The default announcement names the STATUS, not the subject.
4. The label and value MUST appear in the layout, not only in the announcement.
5. `critical` and `low` judge a MEASURED VALUE. NEVER use them for progress.
6. Status meaning MUST also be conveyed in text, never by color alone.
7. NEVER use a percentage as the visible label.
8. NEVER label a gauge as progress.
9. The caller MUST guard against a non-finite value — the bar does not sanitise it.
10. The caller MUST animate the value. The bar has NO motion.
11. NEVER override the fill or track color. Color MUST come from `status`.
12. The bar MUST sit in a width-bounded parent.
13. NEVER wrap a progress bar in a tap or drag handler.
14. Value changes MUST NOT be announced individually — the region announces at intervals.
15. `thick` MUST be used for a value the user has to read; `thin` ONLY when the bar accompanies other content.

---

## Open Items

1. **`value` is 0.0–1.0 here and 0–100 in [[Loaders]]' brand loader.** Two determinate indicators, the same parameter name, opposite scales. Passing the wrong one fails silently: a percentage clamps to full here, a fraction renders 1% there. This is the highest-risk inconsistency in the loading family and should be resolved by picking one convention.
2. **The default semantic label is not usable.** It announces "Progress, <status>" — naming the status but not the subject, and saying "Progress" even for a gauge. It exists so status isn't color-only, which is right, but it means a bar with no label announces as "Progress, critical, 40%" and a screen-reader user cannot tell what is critical.
3. **There is no progress-bar role.** The bar announces as a labelled container with a value rather than as a progress indicator, so assistive tech cannot treat it as one. Flutter exposes no progress role directly, but the gap is worth recording.
4. **No `automationIdentifier`.** [[Chat Bubble]] has the same gap. The bar is non-interactive so the automation-identifier rule doesn't strictly require one, but a progress value is exactly the kind of thing a UI test asserts on, and there's no handle for it.
5. **`foregroundColor`, `foregroundGradient`, and `trackColor` are token-escape hatches on the public API.** Three parameters accepting arbitrary colors, which violates the tokens-only rule and means a caller-supplied fill won't respond to dark mode or high contrast. Same problem as [[Switch]]'s `activeColor` / `inactiveColor` and [[Loaders]]' spinner colors — the pattern recurs across the system and should be addressed once.
6. **The `thick` height of 14 is off the spacing scale**, which jumps 12 → 16. Correctly extracted to a documented named constant, and correctly flagged in the source as having no token — but per the spacing rule an off-scale Figma value should be raised with design rather than absorbed. `thin`'s 8 does resolve to `s200`.
7. **The status names don't describe what they mean.** `low` means "good" (readable only as "low risk"), `critical` means "bad", and `moderate` means "informational". The source records that `moderate` was renamed from `attention` and that `low` used to be a gradient, so the vocabulary has already drifted once. `low` in particular is the kind of name that gets used for "a low value" by someone who hasn't read the docs.
8. **A non-finite value is not sanitised.** The clamp passes `NaN` through, unlike [[Loaders]]' brand loader, which explicitly guards for it with a comment about `done / total` when `total == 0`. The same guard belongs here — the failure mode is identical and more likely, since a fraction is exactly what a caller computes by division.
9. **There is no motion.** A value change snaps, while the brand loader tweens its fill over ~350ms. Two determinate indicators in the same system, one animated and one not, with no motion tokens to relate them.
10. **No indeterminate mode.** Reasonable — that's the spinner's job — but it means a caller who has a bar in the layout and temporarily loses the fraction has no in-place fallback and must swap components.
11. **The pill radius is computed rather than tokenised.** The code takes the smaller of half the height and `AsmCornerRadii.r999`, which is correct behavior for a pill at any height, but it means the radius isn't a token lookup and the r999 branch is unreachable at both shipped heights.
12. **No label or value slot exists on the component**, so every consumer builds the row — label, value text, judgement text, spacing, and the alignment between them. Given that a bar without a label is unusable, and that both the gauge and progress patterns have a conventional layout, the labelled row is the missing component. Same shape of gap as [[Switch]]'s missing settings row.
13. **Figma has no `focus` variant, correctly** — the bar isn't interactive. Noted only because it's the second component after [[Divider]] where that absence isn't a gap.
