# Component: Loaders

> Role: Signals that the app is working. Three forms — an indeterminate spinner, an AI "thinking" row, and a determinate branded shield.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A loader says "working" and nothing else. If you know the shape of what's arriving, use a [[Skeleton Loader]]; if you know the fraction, use a [[Progress Bar]].
> Source: Figma `Components` → `Loader` (node `2002-11`), `AI Loading` (node `2521-5032`), `mcafee_loading` / `logo_loader` (frame `11056-34`). Implementation: `pegasus_flutter/lib/asm/components/loader.dart`.

## Overview

Three distinct loaders ship in this component, and they are not interchangeable.

| Loader | Determinate? | Use for |
| --- | --- | --- |
| **Spinner** | No | Any short wait where the fraction is unknown. The default. |
| **AI loader** | No | An AI or agent action in flight — a streaming reply, a summary being generated. |
| **Brand loader** | **Yes** | A branded, full-screen or card-level wait with a real progress fraction. |

**Picking the right loading indicator is mostly about how much you know.** If you know nothing except that you're waiting, a spinner. If you know the layout of what's coming back, a [[Skeleton Loader]] tells the user more. If you know how far along you are, a [[Progress Bar]] or the brand loader tells them more still. Reaching for a spinner when you have better information wastes it.

The second question is *where* the wait is. A spinner replaces a small thing — a button's label, a row. A skeleton replaces a region's content. A brand loader takes over a screen.

## Anatomy

### Spinner

```
   bar style (default)          halfTrack style

        ╭─────╮                     ╭━━━━━╮
      ╭╯       ╰╮                 ╭━╯     ╰╮
     ┃    ●     ┃                ┃    ●    ┃
      ╰╮  ━━━  ╭╯                 ╰╮     ╭╯
        ╰─────╯                     ╰────╯

   ━ foreground arc  ─ track     the arc covers ~half the ring
   arc ~50°, gap each side       rotating clockwise
```

| Part | Required | Notes |
| --- | --- | --- |
| **Track** | Yes | The full ring, minus the arc and its two gaps. A quiet neutral. |
| **Foreground arc** | Yes | The moving part. `secondary` by default. |
| **Rotation** | — | One full turn per cycle, roughly a second. |

Both the track and the arc use the same stroke width, and the two are separated by a small gap on each side of the arc — so the ring is never quite closed.

### AI loader

```
   ◉  On it! Just a moment.
   ↑  ↑                  ↑
 bubble  mono message   dots cycle 0→3
 (gradient, rotating)
```

| Part | Required | Notes |
| --- | --- | --- |
| **Bubble** | Yes | A small circle filled with a rotating two-stop brand gradient. |
| **Message** | Yes | Monospaced. Doubles as the announcement. |
| **Animated dots** | — | If the message ends in dots, they cycle 0→3. |

**The dots are extracted from the message, not appended to it.** A message ending in `...` or `…` has them stripped and re-rendered as an animation. The row's width doesn't change as they cycle, so nothing jitters.

**The monospaced type is deliberate** — it reads as machine output, which is the point for agent work.

### Brand loader

```
        ╱╲               ╱╲               ╱╲
       ╱  ╲             ╱  ╲             ╱▓▓╲
      │    │           │    │           │▓▓▓▓│
      │    │           │▓▓▓▓│           │▓▓▓▓│
       ╲  ╱             ╲▓▓╱             ╲▓▓╱
        ╲╱               ╲╱               ╲╱
      Loading.        Loading..        Loading...
       0%                50%              100%
```

| Part | Required | Notes |
| --- | --- | --- |
| **Shield outline** | Yes | Always drawn, at every value — so the mark is legible at 0%. |
| **Rising fill** | — | Fills the shield from the bottom in proportion to the value. |
| **Label** | No | Beneath the mark. Shown by default when supplied. |
| **Animated dots** | — | Appended to the label automatically, cycling 1→3. |

**The fill rises between the glyph's own bounds, not the frame's**, so 0% is an empty outline and 100% is solid with nothing left over. **The outline is always stroked on top**, which is what keeps the shield recognizable when it's empty.

**The label's dots are appended by the component** — don't include them in the label text or you get six.

**The brand loader has one size.** It renders at its natural dimensions, matching the design.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| **Spinner** default size | 40 × 40 | — |
| Spinner stroke | 3 | — |
| Spinner arc (bar) | ~50° | — |
| Spinner arc (halfTrack) | ~130° | — |
| Spinner rotation | ~1.1s per turn | — |
| Spinner arc color | `secondary` | |
| Spinner track color | `ghost` (19% black/white) | |
| **AI loader** bubble | 12 × 12 | — |
| AI bubble gradient | brand purple → brand red | |
| AI gradient rotation | ~1.8s per turn | — |
| AI message style | 14 mono | `label.medium.mono` |
| AI message color | `primary` | |
| Bubble-to-message gap | 8 | `md.spacing.200` |
| **Brand loader** mark | ~17 × 19 | — |
| Brand label style | 14 bold | `label.large.emphasized` |
| Brand mark color | `primary`, or strict white | |
| Mark-to-label gap | 2 | — below the scale |
| Brand fill tween | ~350ms | — |
| Brand dots cycle | ~1.2s | — |

Nearly every number here is a hardcoded literal or a caller-supplied default. See [Open Items](#open-items).

## Spinner styles

Two styles, differing only in how much of the ring the moving arc covers.

| Style | Arc | Use |
| --- | --- | --- |
| **`bar`** (default) | ~50° | Inline spinners — inside a button, a list row, a small region. |
| **`halfTrack`** | ~130° | The page-level or large loading visual. |

**Use `bar` for anything inline.** At small sizes a long arc reads as a nearly-complete ring, which suggests progress that isn't there.

**Use `halfTrack` when the spinner is the main thing on the screen.** At larger sizes the longer arc reads as more substantial and its rotation is easier to follow.

Neither style implies a fraction. They're the same indeterminate spinner with different arc lengths.

## Behaviors

**All three loaders honor reduced motion.** With reduced motion on, the spinner freezes at a static frame, the AI bubble stops rotating and renders as a static gradient, the AI dots render as a complete `...`, the brand dots render as all three, and the brand fill jumps to its value without tweening. Nothing continues moving, and nothing disappears — the frozen state still reads as a loading state.

**A loader must be removed when the wait ends.** A spinner that keeps spinning after the work is done tells the user the app is stuck. This is the caller's job.

**Loaders occupy their own footprint, not the space of the content they precede.** A spinner where a paragraph will appear causes the layout to jump when the content arrives. If the layout shift matters, that's what a [[Skeleton Loader]] is for.

**Don't show a loader for a wait shorter than a few hundred milliseconds.** A spinner that flashes on and off is worse than nothing — it reads as a glitch. Delay showing it, and once shown, keep it up long enough to be seen rather than flickering out.

**The brand loader clamps its value and survives a non-finite one.** A value computed as `done / total` with a zero total renders as 0% rather than breaking.

**The brand loader's fill tweens between values**, so a value that jumps forward animates rather than snapping.

**The AI loader's message re-announces when it changes**, which is correct for streaming output — the user hears each new message without refocusing.

## Content

**Only two of the three loaders carry text.**

**The AI loader's message is user-facing copy and also the announcement.**
- Keep it short and conversational — it's a machine reporting in. "On it! Just a moment…" is the default.
- **End it with dots if you want the animated ellipsis.** The component strips them and animates them.
- **Say what's happening when it's non-obvious.** "Generating your summary…" beats the generic default when the user asked for something specific.

**The brand loader's label names the operation**, and the dots are added for you.
- "Loading", "Scanning", "Updating" — a gerund, no dots, no period.
- **Never include trailing dots.** They're appended.
- **Never restate the percentage in the label.** The value is announced separately.

**The spinner's announcement defaults to "Loading"** and is not visible. Override it when the wait is specific enough to be worth naming, or silence it when the surrounding region already announces the wait.

## Decision Tree

```
Is the app doing work the user should know about?
├── no ──────────────────────────────────────→ no loader
└── yes
    │
    ├── Is the wait under ~300ms?
    │   └── yes → no loader. A flash reads as a glitch.
    │
    ├── Do you know the PROGRESS FRACTION?
    │   ├── yes, and this is a branded full-screen / card wait
    │   │   ────────────────────────────────→ BRAND LOADER
    │   ├── yes, and it's a gauge or meter in a layout
    │   │   ────────────────────────────────→ [[Progress Bar]]
    │   └── no
    │       │
    │       ├── Is it an AI / agent action in flight?
    │       │   └── yes ───────────────────→ AI LOADER
    │       │
    │       ├── Do you know the LAYOUT of what's arriving?
    │       │   └── yes ───────────────────→ [[Skeleton Loader]]
    │       │            (avoids the layout jump a spinner causes)
    │       │
    │       └── SPINNER
    │           ├── inline — in a button, a row, a small region → bar
    │           └── the main thing on the screen ──────────────→ halfTrack
    │
    └── Is the work a toggle the user just flipped?
        └── yes → not a loader. [[Switch]] has its own loading state.
```

**Spinner versus [[Skeleton Loader]]** is about whether you can predict the layout. A skeleton reserves the space the content will occupy, so nothing shifts when it arrives — strictly more informative than a spinner when you know the shape.

**Brand loader versus [[Progress Bar]]** are both determinate. The brand loader is a branded moment that owns the screen; a progress bar is a gauge that lives in a layout. A progress bar inside a card showing 60% of a scan is a progress bar. The screen you see while the app boots is a brand loader.

## Accessibility

| Requirement | Spinner | AI loader | Brand loader |
| --- | --- | --- | --- |
| **Announced** | Yes, default "Loading" | Yes, the message | Yes, label + percentage |
| **Progress announced** | n/a (indeterminate) | n/a | Yes, as a percentage |
| **Live region** | **No** | Yes | Yes |
| **Reduced motion** | Freezes | Freezes | No tween, static dots |
| **Silenceable** | Yes | **No** | Yes |
| **Single node** | Yes | Yes, bubble excluded | Yes |
| **Not focusable** | Correct — loaders aren't controls | | |

**Announce the wait once, at the right level.** The most common accessibility mistake with loaders is announcing several times: a region that says "Loading" and five spinners inside it that each say "Loading" too. Silence the individual loaders and announce at the region, or announce per-loader and not at the region — never both.

**The spinner is not a live region**, so it announces when focus reaches it rather than when it appears. For a wait the user should hear about immediately, the surrounding region needs the live region and the spinner should be silenced. This differs from the AI and brand loaders, which do announce on appearance.

**Announce when the wait ends, not just when it starts.** None of the three loaders announces completion — they simply stop existing. A screen-reader user who heard "Loading" gets no confirmation, so the region should announce the result.

**A loader is never focusable and never interactive.** If the user needs to cancel, that's a [[Button]] beside the loader.

**Color is never the only signal in any of the three.** The spinner rotates, the AI loader has a message, the brand loader has a label and dots.

## Anti-Patterns

**❌ A spinner for a wait under ~300ms.** Flashes read as glitches. → Show nothing, or delay the loader.

**❌ A spinner left running after the work finishes.** Reads as stuck. → Remove it.

**❌ A spinner where you know the layout of what's coming.** → [[Skeleton Loader]], so nothing shifts.

**❌ A spinner where you know the fraction.** → [[Progress Bar]] or the brand loader.

**❌ A determinate loader whose value doesn't move.** Worse than indeterminate — it looks frozen. → A spinner.

**❌ Both a region announcement and per-loader announcements.** The user hears "Loading" six times. → Silence the individual loaders.

**❌ A spinner as the only signal of a wait for a screen-reader user.** It isn't a live region — it announces only when focused. → Live region on the region.

**❌ Trailing dots in the brand loader's label.** They're appended. → "Loading", not "Loading…".

**❌ The percentage restated in the brand loader's label.** → It's announced separately.

**❌ The AI loader for a generic page load.** It says an agent is working. → Spinner.

**❌ A spinner for an async [[Switch]] toggle.** → The switch has a loading state built in.

**❌ Overriding the spinner's colors to brand a surface.** Bypasses the theme. → Leave them.

**❌ A loader with no way out.** A wait that can fail needs an error path and, if it's long, a cancel. → [[Alert Banner]] on failure, [[Button]] to cancel.

**❌ `halfTrack` at a small inline size.** The long arc reads as near-complete progress. → `bar`.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. All three widgets live in `pegasus_flutter/lib/asm/components/loader.dart`: `AsmLoader`, `AsmAiLoader`, and `AsmBrandLoader`.

### Enums

```dart
enum AsmLoaderStyle { bar, halfTrack }   // default: bar
```

`AsmAiLoader` and `AsmBrandLoader` have no enums.

### Spinner — basic usage

```dart
const AsmLoader();
```

40×40, `bar` style, `secondary` arc, announcing "Loading". That's the common case.

```dart
// Inline in a button, silenced because the button already says what's happening.
AsmButton(
  label: 'Saving…',
  onPressed: null,
  startIcon: const AsmLoader(size: 16, excludeSemantics: true),
  automationIdentifier: 'save-button',
);
```

```dart
// Page-level.
const AsmLoader(
  size: 64,
  style: AsmLoaderStyle.halfTrack,
  semanticLabel: 'Loading your dashboard',
);
```

Note `strokeWidth` defaults to 3, which is calibrated for the 40px default. A much larger or smaller `size` needs the stroke scaled with it — nothing does that automatically.

### Spinner — announcing at the region level

The pattern for a region containing several loaders:

```dart
Semantics(
  liveRegion: true,
  label: 'Loading your devices',
  child: Column(
    children: [
      for (final _ in placeholders)
        // Silenced — the region announces once.
        const AsmLoader(excludeSemantics: true),
    ],
  ),
);
```

### AI loader

```dart
const AsmAiLoader();
```

Renders "On it! Just a moment..." with the animated dots. To name the specific work:

```dart
const AsmAiLoader(text: 'Generating your security summary...');
```

The trailing dots are stripped and animated. `text` is announced in full — including the dots — as a live region, so a streaming sequence of messages re-announces as each arrives.

There is no way to silence the AI loader; see [Open Items](#open-items).

### Brand loader

```dart
AsmBrandLoader(
  value: _percentComplete, // 0–100, NOT 0.0–1.0
  label: 'Scanning',
);
```

**`value` is 0–100, not 0–1** — the opposite of [[Progress Bar]], which takes a fraction. Getting it wrong renders a bar that appears stuck at 1%.

```dart
// On a dark or colored background that doesn't flip with the theme.
AsmBrandLoader(
  value: _percentComplete,
  label: 'Loading',
  strictWhite: true,
);
```

```dart
// The mark alone, no label.
AsmBrandLoader(value: _percentComplete, showLabel: false);
```

With no label the announcement falls back to "Loading", still with the percentage.

### Parameter reference

**`AsmLoader`**

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `size` | `double` | No | `40` |
| `style` | `AsmLoaderStyle` | No | `bar` |
| `strokeWidth` | `double` | No | `3` |
| `foregroundColor` | `Color?` | No | `colorScheme.secondary` |
| `trackColor` | `Color?` | No | `extended.ghost` |
| `duration` | `Duration` | No | 1100ms |
| `semanticLabel` | `String` | No | `'Loading'` |
| `excludeSemantics` | `bool` | No | `false` |

**`AsmAiLoader`**

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `text` | `String` | No | `'On it! Just a moment...'` |
| `bubbleSize` | `double` | No | `12` |
| `duration` | `Duration` | No | 1800ms |

**`AsmBrandLoader`**

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `double` | No | `0` — **0 to 100** |
| `label` | `String?` | No | `null` |
| `showLabel` | `bool` | No | `true` |
| `strictWhite` | `bool` | No | `false` |
| `dotsDuration` | `Duration` | No | 1200ms |
| `semanticLabel` | `String?` | No | inherits `label`, else `'Loading'` |
| `excludeSemantics` | `bool` | No | `false` |

None of the three takes an `automationIdentifier` — none is interactive.

### Guidance

- **`AsmBrandLoader.value` is 0–100. [[Progress Bar]]'s is 0.0–1.0.** The two determinate indicators take opposite scales.
- **Silence loaders inside an announced region** with `excludeSemantics: true`, so the wait is announced once.
- **The spinner is not a live region** — put the live region on the enclosing region if the user should hear the wait as it starts.
- **Scale `strokeWidth` with `size`.** The default 3 is tuned for 40.
- **Never pass `foregroundColor` or `trackColor`.** They bypass the theme; a literal will be wrong in dark mode and high contrast.
- **Never put trailing dots in `AsmBrandLoader.label`** — the animated ellipsis is appended.
- **Do put trailing dots in `AsmAiLoader.text`** if you want them animated — the behaviour is the reverse.
- **`strictWhite` is for backgrounds that don't flip with the theme**, matching the same pattern on [[Button]].
- **Remove the loader when the wait ends**, and announce the result.
- **Don't wrap a loader in a tap handler.** If the wait is cancelable, put an [[Button]] beside it.
- `duration` on the spinner and AI loader is exposed but should be left alone — a non-default rotation speed is inconsistent with every other loader on screen.

---

## Rules

1. A loader means "working" and NOTHING more. Known layout → [[Skeleton Loader]]; known fraction → [[Progress Bar]] or the brand loader.
2. NEVER show a loader for a wait under ~300ms.
3. The caller MUST remove the loader when the wait ends.
4. A determinate loader's value MUST actually advance. A frozen value is worse than a spinner.
5. The wait MUST be announced exactly ONCE. Silence individual loaders inside an announced region.
6. The spinner is NOT a live region — an immediate announcement MUST come from the enclosing region.
7. The end of the wait MUST be announced by the region. No loader announces completion.
8. `AsmBrandLoader` takes 0–100. [[Progress Bar]] takes 0.0–1.0. NEVER interchange them.
9. NEVER include trailing dots in the brand loader's label — they are appended.
10. NEVER restate the percentage in the brand loader's label.
11. NEVER override a loader's colors. They MUST resolve from the theme.
12. `bar` for inline, `halfTrack` for page-level. NEVER `halfTrack` at a small size.
13. The AI loader is for AI/agent work ONLY, never a generic page load.
14. `strokeWidth` MUST be scaled when `size` diverges much from 40.
15. A loader is NEVER interactive. Cancel affordances are a separate [[Button]].
16. A wait that can fail MUST have an error path.

---

## Open Items

1. **`AsmBrandLoader.value` is 0–100 while [[Progress Bar]]'s `value` is 0.0–1.0.** Two determinate indicators in the same system take opposite scales for the same concept, and both are named `value`. Passing a fraction to the brand loader renders 1% and passing a percentage to the progress bar clamps to 100% — both fail silently in release, since the range assert is debug-only. This is the highest-risk inconsistency in the loading family.
2. **The `AsmAiLoader` cannot be silenced.** It has no `excludeSemantics` and always announces as a live region, unlike the other two. In a region that already announces the wait, the AI loader will double-announce with no way to prevent it.
3. **The registry says AI Loading has no implementation.** `.claude/figma_component_registry.md` marks Figma node `2521-5032` as "— (none yet)" with a note that it's a candidate, but `AsmAiLoader` ships. The registry needs updating, and the implementation should be reconciled against that frame — nothing currently confirms the shipped bubble and message match it.
4. **The brand loader's Figma frame is not in the registry at all.** The implementation cites `mcafee_loading` / `logo_loader` frame `11056:34`, which appears nowhere in the component registry. So the one loader with a verifiable Figma source is the one the registry can't route you to.
5. **The spinner's geometry is entirely caller-supplied defaults, not tokens.** `size: 40` and `strokeWidth: 3` are parameter defaults rather than named constants tied to the Figma frame, so nothing prevents a caller from rendering a 200px spinner with a 3px stroke. The arc sweeps (0.28π and 0.72π) are inline literals in the painter with no reference to the Figma arc angles they came from.
6. **`strokeWidth` does not scale with `size`.** The default 3 is documented as "calibrated for the 40 px Figma loader", but a caller changing `size` gets no adjustment and no warning. A ratio-derived default would remove the footgun.
7. **The mark-to-label gap is 2px, below the spacing scale's 4px minimum.** Correctly extracted to a documented named constant per the spacing rule, and correctly flagged as having no token — but it means the Figma frame itself uses an off-scale value, which per the same rule should be raised with design rather than absorbed.
8. **The spinner's `foregroundColor` and `trackColor`, and the progress bar's equivalents, are token-escape hatches on the public API.** They accept arbitrary `Color`s, which violates the tokens-only rule the same way [[Switch]]'s `activeColor` does. A caller-supplied color won't respond to dark mode or high contrast.
9. **The skeleton's highlight and the spinner's track resolve differently for the same visual purpose.** The spinner track uses the `ghost` extended token; [[Skeleton Loader]]'s highlight is computed by lerping `background` toward `white` at 60%. One reads a token, the other derives a color in code — and the derived one can't be adjusted in Figma.
10. **The AI bubble's gradient is assembled from two unrelated token accessors.** The code takes the purple endpoint from `gradientSurfaceModerateStop3` and the red from `gradientBrandStop1` — two stops from two different named gradients — because no token exposes the `gradient.moderate` pair the Figma frame actually uses. The comment is explicit that this is a workaround to avoid hardcoded hex. The token is missing upstream.
11. **The AI loader's line height is overridden in component code.** `labelMediumMono` ships a line height of 1.0 and the component overrides it to 1.3 to stop descenders clipping. Either the token's line height is wrong for its intended use, or this row needs a different token — a component correcting a typography token locally is a token bug, not a component decision.
12. **Animation durations are hardcoded literals throughout**: 1100ms spinner, 1800ms AI gradient, 1200ms brand dots, 350ms brand fill tween, 1500ms skeleton shimmer. Five unrelated timings across the loading family with no motion tokens to relate them, so nothing keeps them coherent. Same gap as [[Accordion]]'s 200ms and [[Switch]]'s 150/100ms.
13. **No loader announces completion.** All three announce the start of the wait; none announces the end. For a screen-reader user, a wait simply stops being mentioned. The fix belongs to the calling region, and nothing documents it.
14. **No delay-before-showing exists anywhere in the family.** The "don't flash a loader for a short wait" rule is entirely the caller's to implement, and every consumer will implement it differently or not at all. A `delay` parameter, or a wrapper that defers appearance, would make the rule enforceable.
15. **The three loaders in one file are three unrelated components.** `AsmLoader`, `AsmAiLoader`, and `AsmBrandLoader` share no code beyond the reduced-motion pattern, which is duplicated three times. They map to three different Figma frames. Whether they belong in one file is a code-organisation question, but the shared reduced-motion logic is genuinely duplicated and should be extracted.
16. **Reduced motion is handled three times, slightly differently.** Each widget re-implements the same `didChangeDependencies` pattern; the skeleton loader implements a fourth variant that also parks the controller at a specific value. The behaviours are all correct but nothing guarantees they stay in step.
