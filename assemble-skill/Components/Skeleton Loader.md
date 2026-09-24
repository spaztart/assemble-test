# Component: Skeleton Loader

> Role: A placeholder that occupies the shape of content that is about to arrive.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A skeleton MUST match the footprint of the content it replaces. A skeleton that doesn't reserve the right space causes the layout jump it exists to prevent.
> Source: Figma `Components` → `Skeleton Loader` (node `4101-19111`), `Skeleton Loader (Desktop)` (node `4961-6506`). Implementation: `pegasus_flutter/lib/asm/components/skeleton_loading.dart`.

## Overview

A skeleton is a soft-edged block with a highlight sweeping across it, standing in for content that hasn't loaded.

**Its entire value is that it occupies the right space.** A [[Loaders|spinner]] tells the user to wait; a skeleton tells them to wait *and* shows them the shape of what's coming, so when the content arrives nothing moves. That second property is the reason to use one, and it's also the reason a mismatched skeleton is worse than a spinner — a placeholder the wrong size causes exactly the layout jump it was meant to prevent, plus it lied about the layout.

So the decision to use a skeleton is a claim: **you know what the content looks like.** If you don't — an unpredictable result count, a variable layout, an error you might render instead — a spinner is more honest.

**A skeleton is composed, not configured.** One skeleton is one block. A loading screen is several of them arranged to mirror the real layout, which the consumer builds.

**Skeletons are invisible to assistive technology**, by design. They convey "loading" purely visually, so a screen-reader user gets nothing from them at all — which makes announcing the wait at the region level mandatory rather than a nicety. See [Accessibility](#accessibility).

## Anatomy

```
   ┌────────────────────────────────────────────┐
   │▓▓▓▓▓▒▒▒▒░░░░░  ░░░░▒▒▒▓▓▓░░░░              │
   └────────────────────────────────────────────┘
    ↑              ↑                           ↑
   base fill    sweeping highlight          rounded corners
   (fades across a shallow diagonal)


   A loading screen is COMPOSED — this is the consumer's layout:

   ┌────────────────────────────────────────────┐
   │ ┌────┐  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │   icon + text
   │ │▓▓▓▓│  ▓▓▓▓▓▓▓▓▓▓▓▓                       │
   │ └────┘                                     │
   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   card
   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
   │      ┌──────────────┐                      │   button
   │      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓│                      │
   │      └──────────────┘                      │
   └────────────────────────────────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Base fill** | Yes | The `background` token fading to transparent across a shallow diagonal. |
| **Highlight** | — | A translucent band sweeping left to right on a loop. |
| **Corners** | Yes | Rounded — 16 for every shape except the button, which is a pill. |

**The base fill is a gradient, not a flat tone.** It fades from opaque to transparent diagonally, so a skeleton is slightly lighter at its bottom-right than its top-left. That's the Figma treatment; it makes a large block less of a solid slab.

**The highlight sweep is what signals activity.** Without it a skeleton is just a gray box and reads as content that failed to load rather than content still arriving. It loops continuously.

**Because the base fades to transparent, whatever sits behind a skeleton shows through it.** A skeleton over a colored or patterned surface will pick up that surface — worth checking rather than assuming a neutral block.

## Shapes

Seven named shapes, each with a footprint and radius matching a kind of content.

| Shape | Footprint | Radius | Stands in for |
| --- | --- | --- | --- |
| **`neutralShape`** (default) | 346 × 44 | 16 | A generic block. |
| `card` | 346 × 140 | 16 | A card surface. |
| `standaloneText` | 346 × 24 | 16 | One line of text. |
| `icon` | 48 × 48 | 16 | An icon square. |
| `listItem` | 346 × 72 | 16 | A list row. |
| `tile` | 168 × 154 | 16 | A grid tile. |
| `button` | 213 × 56 | **40 — a pill** | A button. |

**The shapes are defaults, not constraints.** Each supplies a width, height, and radius that any call can override. Their value is as a starting point that already matches the design's proportions — and as a vocabulary, so "a listItem skeleton" means something specific.

**`346` recurs because it's a mobile content width.** Six of the seven shapes are 346 wide, which is a phone's content column. **On a wider surface these defaults are wrong** — a 346px card skeleton in a desktop layout reserves a fraction of the real card's width, which is the mismatch this component exists to avoid. Override the width, or pass an infinite width to fill the parent.

**`button` is the only pill.** Its 40 radius matches the real button's shape, which matters — a square-cornered button skeleton followed by a pill button is a visible pop.

**Pick the shape that matches, then fix the size.** The shape name gets the radius and the proportions right; the width almost always needs to come from the layout.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Radius (six shapes) | 16 | `md.border.radius.16` |
| Radius (`button`) | 40 | `md.border.radius.40` |
| Base fill | `background`, fading to transparent | |
| Highlight | `background` lerped 60% toward white, at 50% alpha | |
| Highlight band width | 30% of the block | — |
| Sweep duration | ~1.5s per pass | — |

## Behaviors

**The sweep runs continuously and honors reduced motion.** With reduced motion on, the highlight freezes at its mid-sweep position — so the skeleton still reads as a placeholder with a highlight on it rather than becoming a flat box. Nothing keeps moving.

**A skeleton has no completion state.** It sweeps until the consumer replaces it. A skeleton left on screen after the data arrives looks like content that never loaded.

**The sweeps of adjacent skeletons are not synchronized.** Each block runs its own loop, so a column of five skeletons has five highlights at unrelated positions. Whether that's the design intent is unconfirmed — see [Open Items](#open-items).

**Skeletons don't compose themselves.** There is no group, no list, and no screen-level variant; a loading layout is several skeletons in the consumer's own layout widgets.

**A skeleton is not interactive** and never focusable. Content that isn't there yet can't be acted on, so the region should also block interaction while loading rather than leaving live controls among the placeholders.

**Show skeletons only for a wait long enough to see.** Same rule as [[Loaders]]: a skeleton that flashes for 100ms is a flicker. And unlike a spinner, a skeleton *replacing* content that's already on screen — a refresh — makes the screen appear to break. Prefer leaving stale content in place during a refresh.

## Decision Tree

```
Is content loading?
├── no ──────────────────────────────────────→ no placeholder
└── yes
    │
    ├── Is the wait under ~300ms?
    │   └── yes → nothing. A flash reads as a glitch.
    │
    ├── Is content ALREADY on screen and being refreshed?
    │   └── yes → prefer leaving the stale content. Replacing loaded
    │             content with skeletons looks like a failure.
    │
    ├── Do you know the LAYOUT of what's arriving?
    │   ├── no ─────────────────────────────→ [[Loaders]] — a spinner
    │   └── yes
    │       │
    │       ├── Do you also know the PROGRESS FRACTION?
    │       │   └── yes → still a SKELETON for the layout, and consider
    │       │             a [[Progress Bar]] alongside it
    │       │
    │       └── SKELETON — one per content block
    │           ├── a card ──────────────→ card
    │           ├── a list row ──────────→ listItem
    │           ├── a grid tile ─────────→ tile
    │           ├── a line of text ──────→ standaloneText
    │           ├── an icon ─────────────→ icon
    │           ├── a button ────────────→ button (the only pill)
    │           └── anything else ───────→ neutralShape + explicit size
    │
    └── Is the result likely to be EMPTY?
        └── yes → the skeleton is still right while loading, but the
                  empty result needs an [[Empty State]], not a skeleton
                  that never resolves
```

**Skeleton versus [[Loaders|spinner]]** is the only real decision, and it turns on whether you can predict the layout. Predictable → skeleton, because it reserves the space. Unpredictable → spinner, because a wrong skeleton is worse than an honest spinner.

**Skeleton and [[Empty State]] are both what you show when there's no content**, but for different reasons — one means "not yet", the other means "none". A skeleton that never resolves because the result was empty is a hang.

## Content

**A skeleton has no content, and must not be given any.** No text, no icon, no "Loading…" inside the block. The whole point is a shape with nothing in it.

**The composition is the content.** A loading state that mirrors the real layout — the same number of rows, the same proportions — reads as the page arriving. A single large block reads as a placeholder for nothing in particular, which is a spinner with extra steps.

- **Match the count when you know it.** Five list rows if five are coming.
- **Approximate when you don't.** Three rows is a conventional guess; it sets an expectation without claiming precision.
- **Vary text-line widths.** Real paragraphs don't have uniform line lengths, so a stack of identical full-width text skeletons reads as artificial. Shortening the last line is the standard treatment.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Hidden from assistive tech** | Yes — deliberately excluded. |
| **Not focusable** | Correct. |
| **Reduced motion** | Sweep freezes mid-position. |
| **Theme-aware** | The fill resolves from tokens. |
| **The wait announced** | **Not by the skeleton** — the region must do it. |
| **Automation identifier** | None. |

**A screen-reader user gets nothing from a skeleton.** This is the correct design — announcing seven placeholder blocks would be noise — but it means **the wait is completely unannounced unless the region announces it.** A screen full of skeletons is, to a screen-reader user, an empty screen. Wrap the placeholder group in a live region that announces the wait once.

**Announce completion too.** Nothing announces that content arrived. A user who heard "Loading your devices" needs to hear that the devices are there; a live region on the region covers both transitions.

**Don't leave interactive controls among skeletons.** A tab stop that leads into a half-loaded region is disorienting. Block interaction on the whole region while it loads.

**Contrast is not a concern for the skeleton itself** — it carries no information and no text. It does become one if a skeleton is placed over a colored surface, since the base fades to transparent and picks up what's behind it.

## Anti-Patterns

**❌ A skeleton whose footprint doesn't match the content.** Causes the layout jump it exists to prevent. → Match the size, or use a spinner.

**❌ The default 346px width in a desktop layout.** Six of the seven shapes are a phone's content width. → Override the width, or fill the parent.

**❌ A skeleton where the layout is unpredictable.** It claims to know the shape. → [[Loaders]] — a spinner.

**❌ Skeletons replacing content that's already loaded during a refresh.** The screen appears to break. → Leave the stale content.

**❌ A skeleton for a wait under ~300ms.** → Nothing.

**❌ A skeleton left after the content arrives.** → Replace it.

**❌ Skeletons with no region-level announcement.** A screen-reader user perceives an empty screen. → Live region on the region, announcing both start and completion.

**❌ Text or an icon inside a skeleton.** → It's an empty shape.

**❌ One large block standing in for a whole screen.** → Mirror the real layout.

**❌ Identical full-width text-line skeletons.** Reads as artificial. → Vary the widths.

**❌ A square-cornered skeleton where a button will be.** → The `button` shape, which is a pill.

**❌ Interactive controls interleaved with skeletons.** → Block interaction on the region.

**❌ A skeleton that never resolves because the result was empty.** → An [[Empty State]].

**❌ Wrapping a skeleton in a tap handler.** → Content that isn't there can't be acted on.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmSkeletonLoading`, from `pegasus_flutter/lib/asm/components/skeleton_loading.dart`.

Every parameter is optional. One widget is one block; a loading screen is several.

### Enum

```dart
enum AsmSkeletonShape {
  card, standaloneText, icon, listItem, neutralShape, tile, button,
}
// default: neutralShape
```

### Basic usage

```dart
const AsmSkeletonLoading(shape: AsmSkeletonShape.card);
```

346 × 140, radius 16. **The 346 is a mobile content width** — in a wider layout, override it.

### Filling the parent's width

```dart
const AsmSkeletonLoading(
  shape: AsmSkeletonShape.listItem,
  width: double.infinity,
);
```

`double.infinity` is the documented way to fill the parent, and it's what you want for anything full-width. This requires a bounded parent.

### A composed loading state

The realistic case — the component gives you blocks, you build the screen:

```dart
Semantics(
  // The skeletons are invisible to assistive tech, so the region must
  // announce the wait — and announce again when content arrives.
  liveRegion: true,
  label: 'Loading your devices',
  child: Padding(
    padding: EdgeInsets.all(AsmSpacingScale.s400),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const AsmSkeletonLoading(shape: AsmSkeletonShape.icon),
            SizedBox(width: AsmSpacingScale.s300),
            const Expanded(
              child: AsmSkeletonLoading(
                shape: AsmSkeletonShape.standaloneText,
                width: double.infinity,
              ),
            ),
          ],
        ),
        SizedBox(height: AsmSpacingScale.s400),
        // Three rows: a conventional guess when the count is unknown.
        for (var i = 0; i < 3; i++) ...[
          const AsmSkeletonLoading(
            shape: AsmSkeletonShape.listItem,
            width: double.infinity,
          ),
          SizedBox(height: AsmSpacingScale.s200),
        ],
      ],
    ),
  ),
);
```

### Text lines with varied widths

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const AsmSkeletonLoading(
        shape: AsmSkeletonShape.standaloneText, width: double.infinity),
    SizedBox(height: AsmSpacingScale.s200),
    const AsmSkeletonLoading(
        shape: AsmSkeletonShape.standaloneText, width: double.infinity),
    SizedBox(height: AsmSpacingScale.s200),
    // Short last line — real paragraphs don't end flush.
    const AsmSkeletonLoading(
        shape: AsmSkeletonShape.standaloneText, width: 180),
  ],
);
```

### A custom block

```dart
AsmSkeletonLoading(
  width: double.infinity,
  height: 96,
  borderRadius: BorderRadius.circular(AsmCornerRadii.r12),
);
```

With every default overridden the `shape` is irrelevant. Take the radius from `AsmCornerRadii` so it matches the real content's corners.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `shape` | `AsmSkeletonShape` | No | `neutralShape` |
| `width` | `double?` | No | the shape's width |
| `height` | `double?` | No | the shape's height |
| `borderRadius` | `BorderRadius?` | No | the shape's radius |

There is no `automationIdentifier`, no semantics parameter, no group widget, and no way to disable the sweep.

### Guidance

- **Override `width` in anything wider than a phone.** Six shapes default to 346.
- **`width: double.infinity` fills the parent** and needs a bounded parent.
- **Put the wait announcement on the enclosing region** with `liveRegion: true` — skeletons are excluded from semantics entirely.
- **Announce completion as well as the start.**
- **Match `borderRadius` to the real content's radius** using `AsmCornerRadii`, so nothing pops when the content lands.
- **Use `AsmSkeletonShape.button` for a button placeholder** — it's the only pill.
- **Vary text-line widths.** Uniform lines read as artificial.
- **Don't wrap a skeleton in a gesture handler.**
- **Don't try to synchronize sweeps** — there is no shared controller.
- **Replace skeletons the moment content arrives**, and route an empty result to an [[Empty State]].

---

## Rules

1. A skeleton MUST match the footprint of the content it replaces.
2. Unpredictable layouts MUST use a [[Loaders|spinner]], never a skeleton.
3. The default 346px width MUST be overridden in any layout wider than a phone.
4. NEVER show a skeleton for a wait under ~300ms.
5. NEVER replace already-loaded content with skeletons during a refresh.
6. The enclosing region MUST announce the wait — skeletons are invisible to assistive tech.
7. The region MUST also announce when content arrives.
8. A skeleton MUST contain NO text and NO icon.
9. A loading state MUST mirror the real layout, not be one large block.
10. Text-line skeletons MUST vary in width.
11. A button placeholder MUST use the `button` shape — it is the only pill.
12. Custom radii MUST match the real content's radius.
13. Interactive controls MUST NOT be interleaved with skeletons.
14. NEVER wrap a skeleton in a tap handler.
15. Skeletons MUST be replaced when the wait ends. An empty result MUST route to an [[Empty State]].

---

## Open Items

1. **Six of the seven shapes default to 346px, a mobile content width, and nothing signals that.** A `card` skeleton dropped into a desktop layout reserves less than half the real card's width — the exact layout mismatch this component exists to prevent. The registry lists a separate `Skeleton Loader (Desktop)` Figma frame (`4961-6506`) mapped to the same implementation, which strongly suggests the desktop footprints exist in design and were not carried into the code. **The most significant gap in this component.**
2. **The default footprints are inline `Size` literals, not named constants.** Fourteen numbers across seven shapes, with no reference to the Figma frame each came from. The spacing rule requires structural dimensions to be named constants with a comment stating their source; these are bare literals in a switch.
3. **The highlight color is computed in code, not tokenised.** It's the `background` token lerped 60% toward `white`, then applied at 50% alpha — three magic numbers, none of them tokens, producing a color that cannot be adjusted from Figma. [[Loaders]]' spinner track uses the `ghost` token for a comparable purpose; one of the two approaches is wrong.
4. **The base gradient's alignment is off-token too** — a shallow diagonal expressed as inline alignment literals with no stated source. The Figma treatment is named in the comment ("opaque gradient") but the angle isn't traced to it.
5. **The sweep band width and the 1.5s duration are inline literals.** Same missing-motion-token gap as the rest of the family: [[Loaders]] has five unrelated durations, [[Accordion]] has 200ms, [[Switch]] has 150/100ms, and nothing relates them.
6. **Adjacent skeletons sweep independently.** Each block owns its own controller, so a column of placeholders shows highlights at unrelated positions. A synchronized sweep across a group is the more common treatment and reads as one surface loading rather than several; whether Figma specifies either is unconfirmed. There's no shared controller and no way for a consumer to add one.
7. **The base fill fades to transparent, so the surface behind shows through.** Correct per the Figma "opaque gradient", but it means a skeleton over a colored or patterned background is tinted by it, and nothing documents that. The multiply blend named in the class documentation is not actually applied in the build method — the comment describes a blend mode the code doesn't use, which is a stale-comment defect of the same kind found in [[Alert Banner]].
8. **There is no group or screen-level component.** Every consumer composes skeletons by hand, which means every loading screen re-derives the row counts, the spacing between blocks, the text-line width variation, and the region-level live region. The live region in particular is required for the component to be accessible at all and is entirely outside the component — the same shape of gap as [[Switch]]'s missing settings row and [[Progress Bar]]'s missing labelled row.
9. **Nothing announces the wait or its completion.** By design for the block, but there is no wrapper that does it either, so the accessibility of a skeleton screen depends entirely on the consumer remembering. A `AsmSkeletonGroup` that owned the live region would make it structural.
10. **`shape` becomes meaningless once width, height, and radius are all overridden**, yet it remains required-by-default and silently ignored. A separate custom constructor would express that better than a shape parameter with no effect.
11. **There is no way to freeze or disable the sweep** other than the OS reduced-motion setting. A consumer who wants a static placeholder — in a screenshot test, or a print view — has no parameter for it.
12. **Reduced motion is implemented a fourth time here**, with slightly different logic from the three copies in [[Loaders]] (this one parks the controller at 0.5 rather than leaving it wherever it stopped). All four are correct; nothing keeps them in step.
