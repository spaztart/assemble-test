# Component: Cards

> Role: The system's base surface — a rounded, padded, shadowed rectangle that groups related content. It has no title, no interaction, no state, and no meaning of its own. It is the substrate six other components are built on.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe what a card is, which variant to reach for, and what it must never be asked to do. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The card carries no meaning a screen reader can hear. A coloured variant is decoration — whatever the colour is saying, the card's text must say too.
> Source: Figma `Components` → the card specs are cited in the implementation as loose values (`md.border.radius.24`, 20pt padding, elevation-1) with **no frame or node named**. Implementation: `pegasus_flutter/lib/asm/components/card.dart`.

## Overview

A card is a surface. It draws a 24pt-radius rectangle, fills it, insets its content by 20pt, and drops an elevation-1 shadow behind it. That is the entire component.

**The distinction most often got wrong is card versus the components built on the card.** Six components in this system render an `AsmCard` internally — [[Alert Card]], [[Popover]], the list feature card, [[Expanded Card]], the feature banner, and the guided action panel. Each of those adds structure: a headline slot, a status row, actions, semantics, growth guarantees, focus handling. The plain card adds none of it. So:

- If the thing you are building has a headline, a body, and actions in a known arrangement — you want one of the composed components, not a card.
- If the thing you are building is a genuinely novel grouping of content that no composed component describes — you want a card.
- If you are reaching for a card because a composed component was *nearly* right and you wanted to drop one of its parts — stop. You are about to rebuild a component badly. Take the composed component's own escape hatch instead.

**The second distinction is card versus plain layout.** A card is a visual claim that its contents belong together *and* are separable from what surrounds them. Content that is simply laid out on the page does not need a card. Nesting a card inside a card makes the claim twice and reads as noise; see [Anti-Patterns](#anti-patterns).

**The third distinction is variant versus override.** The card exposes six named variants and seven visual overrides, and it validates nothing. The variants are the API. The overrides exist for one-off colour pairs the variant axis does not cover, and every override you pass is a value that no longer tracks the design system when the system changes. See [Overrides](#overrides).

## Anatomy

```
        ╭──────────────────────────────────────────────────╮
        │                                                  │  ← radius 24 (cornerXLarge)
        │   ┆20┆                                  ┆20┆     │
        │        ┌──────────────────────────┐              │
        │   20   │                          │      20      │
        │        │      child content       │              │
        │        │      (caller-owned)      │              │
        │   20   │                          │      20      │
        │        └──────────────────────────┘              │
        │   ┆20┆                                  ┆20┆     │
        ╰──────────────────────────────────────────────────╯
         ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ← elevation-1 shadow
                                                                 (0 offset, blur 4 per token)
```

| Part | Required | Notes |
| --- | --- | --- |
| **Fill** | Yes | A solid colour or a gradient, chosen by `variant`. Never absent — there is no transparent variant. |
| **Padding** | Yes | 20pt on all four sides (`spacing500`). Overridable, including to zero. |
| **Corner radius** | Yes | 24pt (`cornerXLarge`). The largest radius in the system; see [[Spacing]]. |
| **Shadow** | Yes | Elevation-1, zero offset, in the theme's shadow token. Overridable, including to none. See [[Elevation]]. |
| **Border** | No | Only the `outlined` variant draws one — a 1pt brand gradient stroke on the left and right edges. |
| **Child** | **No** | The child is optional. A card with no child renders as an empty padded surface, 40pt tall by 40pt wide at minimum. |
| **Foreground colour** | Yes | Cascaded to descendant text and icons by the variant. Not a drawn part — a colour the child inherits. |

The card has no headline slot, no icon slot, no action row, and no dismiss affordance. Everything inside it is content the caller composes and owns.

## Variants

Six variants. Each sets a fill and a foreground colour; only one sets a border.

| Variant | Fill | Foreground | Border | Use for |
| --- | --- | --- | --- | --- |
| `surface` | `surfaceBright` | `onSurface` | — | **The default.** What most cards should be. |
| `outlined` | `surfaceBright` | `onSurface` | 1pt brand gradient | Drawing attention to a card without changing its fill. |
| `brand` | `error` (brand red) | `onError` | — | Critical, brand-forward callouts. |
| `secondary` | `secondary` (blue-violet) | `onSecondary` | — | Secondary emphasis. |
| `positive` | `positive` (teal) | `onPositive` | — | A resolved, safe, or completed state. |
| `gradient` | `secondaryContainer` → `positiveContainer` | `onSecondaryContainer` | — | Promotional or celebratory surfaces. |

`surface` is the default and is correct for the overwhelming majority of cards. The five others are all louder than `surface`, and a screen full of loud cards has no hierarchy at all. **One non-`surface` card per screen region** is the working limit.

### `outlined` — the border is only on two edges

The `outlined` variant's stroke is a horizontal brand gradient, and it is drawn on the **left and right edges only**. The top and bottom edges are explicitly empty. This is not a rendering artifact — the border object returns no side for top and bottom by design, so the card reads as a pair of vertical brand rules rather than a closed outline.

Two consequences:

- The gradient runs left-to-right across a border that has no horizontal segments, so what you actually see is a warm stroke down one side and a cool stroke down the other, with nothing between them.
- The 1pt stroke still reserves 1pt of inset on all four sides, so an `outlined` card's content sits 1pt further in than a `surface` card's. Cards of the two variants side by side do not have aligned content edges.

Use `outlined` when you want a card to stand out on a page of `surface` cards without changing its fill. Do not use it expecting a closed frame.

### `brand` — this is not the brand orange

`brand` fills with the **error** colour role, not with any brand-orange token. The result is a red card. The word "brand" here means "brand-forward callout," not "the brand colour."

This is the third distinct meaning of "brand" in the system: this card is `error` red, the severity chip's brand tier in [[Badges]] is `brandOrange`, and the `outlined` card's stroke is the brand *gradient* which starts at a fourth value. **When a spec says "brand card," confirm which red or orange is meant before building.**

`brand`'s foreground computes to roughly **3.9 : 1** against its fill in both themes — see [Accessibility](#accessibility). It passes for large text and fails for body copy.

### `gradient` — the shipped gradient is not the specified gradient

The implementation's own comment records the divergence: the design source specifies a lavender-to-mint gradient at a set of exact stops that **do not exist in the token package**, so the variant is built from the two closest tokens instead. The direction is also a reinterpretation — the specified angle is translated to a top-right → bottom-left sweep.

So `gradient` is a deliberate approximation, documented as one. Treat it as the sanctioned lavender-to-mint surface, and do not attempt to hand-match it to a design file's exact stops — you will produce a hardcoded hex that drifts the moment the tokens land. See [Open Items](#open-items) item 3.

The foreground is `onSecondaryContainer`, chosen for the lavender end. It computes to 6.0 : 1 there and 10.1 : 1 at the mint end in light mode, so it is legible across the sweep. **Do not override the foreground on this variant** — a colour tuned for one end of a gradient will fail at the other.

## Overrides

Seven parameters override the variant's visual decisions. Nothing validates them and nothing warns when they contradict each other.

| Override | Replaces | Precedence |
| --- | --- | --- |
| `backgroundColor` | The variant's solid fill | Loses to `gradient` |
| `gradient` | The fill entirely | **Wins over `backgroundColor` and over the variant's own fill** |
| `foregroundColor` | The cascaded text and icon colour | — |
| `boxShadow` | The elevation-1 shadow. An empty list removes it. | — |
| `border` | The variant's border, including `outlined`'s gradient stroke | — |
| `borderRadius` | The 24pt radius | — |
| `padding` | The 20pt inset, including to zero | — |

Three rules govern their use.

**Always override colours in pairs.** `backgroundColor` and `foregroundColor` are a contrast relationship. Passing one without the other leaves the variant's half of the pair in place, which is how a card ends up with white text on a pale fill. The showcase demonstrates four sanctioned pairs beyond the variant list — an attention/on-attention pair, a pale app-canvas pair, a brand gradient with white foreground, and the default surface pair — and every one of them passes both halves.

**Always pass tokens, never literals.** `AsmCard` accepts any colour, which means it accepts a hex. A hardcoded hex does not follow the theme, does not follow high-contrast mode, and does not change when the palette changes. Read the pair off the extended colours or the colour scheme and pass those.

**Never override `borderRadius` or `padding` to make a card match a mock.** The 24pt radius and 20pt inset are the card's identity across the product. A card at a different radius reads as a different component, and a card with less padding reads as a cramped one. If the mock disagrees with the system, the mock is the thing to fix.

`padding: EdgeInsets.zero` is the one exception with a legitimate use: a card whose child is a full-bleed image or a list that draws its own row insets. In that case the child owns every inset, and the card contributes only fill, radius, and shadow.

## States

The card has **no states**. It is not focusable, not hoverable, not pressable, and not disabled-able. It renders no state layer, and [[States]] does not apply to it.

This is correct, not a gap: a card is a surface, and a surface has no interaction to give feedback about. The consequence is that **the card cannot be made interactive by adding a state layer** — see [Accessibility](#accessibility) and [Anti-Patterns](#anti-patterns).

The card does respond to theme mode, because every value it paints comes from a token. It does **not** have a high-contrast branch — see [Open Items](#open-items) item 6.

## Behaviors

- **Sizing is entirely inherited.** The card sets no width and no height. It grows to fill the width its parent gives it and grows vertically to fit its child plus 40pt of vertical padding. Constrain it from outside, not from within.
- **There is no size axis.** Unlike most components in this system, the card has no `small`/`large` variants and no compact mode. Every card is one geometry.
- **No maximum width.** On a wide canvas a card will stretch to the full content width unless a parent constrains it. A card of running text at full desktop width is unreadable; cap it. See [[Breakpoints]] and [[Grid]] for the content-width tiers.
- **No minimum size beyond padding.** An empty card is 40 × 40. There is no assert preventing one, and an empty card renders as a stray grey rectangle rather than an error.
- **Overflow is the child's problem.** The card does not clip, ellipsize, wrap, or scroll. A child wider than the card's content box overflows visibly and is reported as a layout overflow. Give text children a wrapping or ellipsizing configuration.
- **Text scale grows the card.** Because height is driven by the child, larger text makes the card taller, which is the correct behavior. Nothing is clipped and nothing is capped. Do not put a card in a fixed-height box.
- **No animation.** The card has no entry, exit, or variant-change transition. Swapping the variant repaints instantly. Components built on the card supply their own motion.
- **The foreground cascade is colour only.** The variant's foreground sets the *colour* of descendant text and icons. It does not set the type ramp, weight, or size. The child still has to pick its styles from [[Typography]].
- **The cascade is a merge, so a child that sets its own colour wins.** A `Text` with an explicit colour ignores the variant's foreground entirely — which is how a `brand` card ends up with dark text on red.

## Content

The card owns no copy. It has no title, no label, and no accessible name of its own. Everything a reader sees inside a card is content the caller wrote.

Three obligations follow:

- **Give every card a heading in its content.** Not because the component requires it — it doesn't — but because a card is a claim that its contents form a group, and a group that a screen-reader user encounters mid-page with no heading is a pile of unrelated strings. Use the heading ramp from [[Typography]].
- **Say in text whatever the variant says in colour.** A `brand` (red) card is urgent to a sighted reader and unremarkable to everyone else. If urgency matters, the copy must carry it. If the colour is purely decorative, that is fine — but then do not rely on it.
- **Do not repeat the fill's meaning in the copy when the fill is decorative.** A `positive` card whose text opens "Good news:" for no reason other than that the card is teal is padding.

Interior spacing is the caller's. The 12pt gap between a title and its body (`spacing300`) is the value the showcase demonstrates and the closest thing to a house rule; take gaps from [[Spacing]] rather than inventing them.

## Composition

Six components in this repository render an `AsmCard` internally. This is worth knowing for two reasons.

**First, the card is load-bearing.** A change to the card's radius, padding, or shadow changes [[Alert Card]], [[Popover]], the list feature card, [[Expanded Card]], the feature banner, and the guided action panel simultaneously. There is no such thing as a local change to this component.

**Second, if you are about to nest a card inside one of those, you are almost certainly wrong.** Each of them already *is* a card. Adding a card inside produces two 24pt radii, two 20pt insets, and two shadows — 40pt of dead space and a double-framed surface. The correct move inside a composed component is a *panel*: a filled, rounded region with no shadow, which is exactly what [[Expanded Card]] uses for its revealed section.

| If you are inside… | And you want to group content… | Reach for |
| --- | --- | --- |
| [[Alert Card]] | …below the headline | Its own body override — not a nested card |
| [[Expanded Card]] | …in the reveal | The section panel it already renders, or its custom-content slot |
| [[Popover]] | …inside the surface | Plain layout — the popover is already the surface |
| A plain page | …a novel grouping | `AsmCard` |

## Decision Tree

```
Does the content have a known shape the system already names?
├── Headline + severity + actions, dismissible ─────→ use [[Alert Card]]
├── A row in a list, with leading and trailing ─────→ use a list feature row
├── A collapsible section with a title and options ─→ use [[Expanded Card]]
├── A floating surface anchored to a control ───────→ use [[Popover]] or [[Modal]]
├── A page-width message strip ─────────────────────→ use [[Alert Banner]]
└── None of the above — a novel grouping
    │
    ├── Is the whole thing tappable?
    │   ├── Yes ──→ still a card. Put a real control INSIDE it.
    │   │           NEVER make the card itself the tap target.
    │   └── No ───→ continue
    │
    └── Which variant?
        ├── Default, and almost always ──────────────→ surface
        ├── Needs to stand out, fill must stay light ─→ outlined
        ├── Critical, brand-forward callout ──────────→ brand   (red; 3.9:1 — large text only)
        ├── Secondary emphasis ───────────────────────→ secondary
        ├── Resolved / safe / complete ───────────────→ positive
        ├── Promotional or celebratory ───────────────→ gradient
        └── A colour pair none of these cover ────────→ surface + backgroundColor
                                                         AND foregroundColor, both tokens
```

## Accessibility

The card emits **no semantics at all**. It is a decorated box: no role, no name, no grouping node, no live region. Assistive technology sees only whatever the child puts into the tree.

| Requirement | Applies | Notes |
| --- | --- | --- |
| Accessible name | **Caller** | The card has none. The child's heading is the name a user gets. |
| Grouping | **Caller** | The card does not create a semantics container. Adjacent cards are indistinguishable in the semantics tree. |
| Text contrast (WCAG 1.4.3, 4.5 : 1) | **Varies by variant** | See the table below. `brand` fails for body copy. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Fails for `surface` against the canvas** | The `surface` card's fill is 1.17 : 1 against the page canvas in light mode. Its only boundary is the shadow. |
| Touch target 48 × 48 | **N/A** | The card is not a target. Any control inside it must meet 48 × 48 per [[Icons]]. |
| Focus | **N/A** | The card is not focusable and must not be made focusable. |
| Reduced motion | **N/A** | No animation. |
| High contrast | **Not handled** | No branch. See [Open Items](#open-items) item 6. |

**Computed foreground contrast per variant** — derived from the light and dark token values, not measured on a device:

| Variant | Light | Dark | Verdict |
| --- | --- | --- | --- |
| `surface` / `outlined` | 15.9 : 1 | 10.4 : 1 | Passes comfortably |
| `brand` | **3.86 : 1** | **3.90 : 1** | **Fails 4.5 : 1.** Large text only (≥ 18.66pt bold / 24pt regular). |
| `secondary` | 4.50 : 1 | 7.06 : 1 | Passes, with no margin in light mode |
| `positive` | 4.53 : 1 | 9.82 : 1 | Passes, with no margin in light mode |
| `gradient` (lavender end) | 6.00 : 1 | 6.00 : 1 | Passes |
| `gradient` (mint end) | 10.06 : 1 | 6.21 : 1 | Passes |

Three obligations the card cannot discharge for you:

1. **The card's edge is a shadow, and the shadow is under-rendered.** A `surface` card sits at 1.17 : 1 against the light page canvas — the fill is white on near-white. The only thing separating card from page is the elevation-1 shadow, and the implementation paints that shadow at **half the blur the token specifies** (see [Open Items](#open-items) item 1, and [[Popover]] open item 10). On a low-contrast display, or with shadows suppressed by the platform, a page of `surface` cards has no visible boundaries. Where card boundaries carry meaning, add an `outlined` variant or a border — do not rely on the shadow alone.
2. **A tappable card must contain a real control.** Wrapping `AsmCard` in a gesture detector produces a tap target with no role, no name, no focus, and no keyboard path. Keyboard and switch-control users cannot reach it and screen-reader users are not told it exists. Put a button, link, or list row inside the card and let that be the affordance.
3. **Colour is never the only signal.** The variant axis is entirely colour. Every meaning a variant conveys must also be present in the card's text.

## Anti-Patterns

**❌ Making the card itself tappable.** Wrapping it in a gesture detector yields a target with no role, no accessible name, no focus ring, and no keyboard path. → Put a real control inside the card.

**❌ Nesting a card inside a card, or inside any component built on one.** Two radii, two 20pt insets, two shadows, 40pt of dead space. → Use plain layout, or the filled panel treatment.

**❌ Passing a hex to `backgroundColor` or `foregroundColor`.** It ignores theme mode, ignores high contrast, and silently rots when the palette changes. → Read the pair off the colour scheme or the extended colours.

**❌ Overriding one of `backgroundColor` / `foregroundColor` and not the other.** The variant's half stays in place, which is how white text lands on a pale fill. → Always override colours in pairs.

**❌ Overriding `foregroundColor` on the `gradient` variant.** The default is tuned to stay legible across both ends of the sweep. A colour picked for one end fails at the other. → Leave it alone.

**❌ Changing `borderRadius` or `padding` to match a mock.** The 24pt radius and 20pt inset are the card's identity across the whole product. → Fix the mock.

**❌ Reaching for `AsmCard` because a composed component was nearly right.** You will rebuild [[Alert Card]] or [[Expanded Card]] without their semantics, growth guarantees, or focus handling. → Use the composed component's own escape hatch.

**❌ Using `brand` for body copy.** White on brand red computes to 3.86 : 1 — below the 4.5 : 1 floor. → Use it for large text, or use `surface` with a severity chip from [[Badges]].

**❌ Using `outlined` expecting a closed frame.** The stroke is on the left and right edges only; top and bottom are empty. → Pass an explicit `border` if you need four sides.

**❌ Putting a card in a fixed-height container.** Card height is driven by its child, and its child grows with text scale. → Let the card size itself.

**❌ Setting `boxShadow: []` to flatten a card and then relying on the fill to separate it.** A `surface` card with no shadow is invisible against a light canvas. → If you remove the shadow, add a border or change the fill.

**❌ Leaving `child` null.** It compiles, asserts nothing, and renders a stray 40 × 40 rectangle. → Always pass a child.

**❌ Letting the card be the only thing that says "urgent."** The card has no semantics; the colour is unavailable to a screen reader. → Put it in the copy.

**❌ Using a card for content that is simply part of the page.** A card claims separability. Content that isn't separable reads as arbitrarily boxed. → Use plain layout.

---

## Flutter Usage

`AsmCard` in `lib/asm/components/card.dart`, exported from `assemble.dart`. `GradientBoxBorder` is exported alongside it.

### Enum

```dart
enum AsmCardVariant { surface, outlined, brand, secondary, positive, gradient }
```

`surface` is the default. Every other value is louder — reach for them deliberately.

### Basic usage

```dart
AsmCard(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    children: [
      Text('Scan complete', style: context.asmTypographyTokens.titleMediumEmphasized),
      SizedBox(height: context.asmSpacingTokens.spacing300),
      const Text('No threats were found on this device.'),
    ],
  ),
)
```

`child` is optional in the constructor but never optional in practice.

### A louder variant

```dart
AsmCard(
  variant: AsmCardVariant.positive,
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      const Icon(Icons.check_circle_outline),
      SizedBox(width: context.asmSpacingTokens.spacing200),
      const Text('Protection is on'),
    ],
  ),
)
```

The icon and text take their colour from the variant automatically — do not colour them by hand.

### A colour pair the variants do not cover

```dart
final ext = context.asmExtendedColors;

AsmCard(
  backgroundColor: ext.attention,
  foregroundColor: ext.onAttention,
  child: const Text('Your subscription expires in 3 days'),
)
```

Both halves of the pair, both from tokens. This is the sanctioned override path.

### A full-bleed child

```dart
AsmCard(
  padding: EdgeInsets.zero,
  child: ClipRRect(
    borderRadius: BorderRadius.circular(AsmCornerRadii.r24),
    child: Image.asset('assets/promo.png', fit: BoxFit.cover),
  ),
)
```

`padding: EdgeInsets.zero` requires the child to clip to the same radius — the card does not clip for you.

### A tappable card, done correctly

```dart
AsmCard(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    children: [
      Text('Identity monitoring', style: context.asmTypographyTokens.titleMediumEmphasized),
      SizedBox(height: context.asmSpacingTokens.spacing300),
      const Text('We found 2 accounts that need attention.'),
      SizedBox(height: context.asmSpacingTokens.spacing400),
      AsmButton(
        label: 'Review accounts',
        onPressed: _openReview,
        automationIdentifier: 'identity-card-review-button',
      ),
    ],
  ),
)
```

The card stays inert. The button is the affordance, and it is the thing that carries the role, the name, the focus ring, and the automation id. Never invert this.

### Removing the shadow

```dart
AsmCard(
  boxShadow: const <BoxShadow>[],
  border: Border.all(
    color: Theme.of(context).colorScheme.outlineVariant,
    width: AsmBorderWidths.thin,
  ),
  child: const Text('Flat card on a tinted surface'),
)
```

If you take the shadow away, put a boundary back.

### Full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `child` | `Widget?` | No | `null` — renders an empty 40 × 40 surface |
| `variant` | `AsmCardVariant` | No | `AsmCardVariant.surface` |
| `backgroundColor` | `Color?` | No | `null` — the variant's fill |
| `gradient` | `Gradient?` | No | `null`; the `gradient` variant supplies its own. **Wins over `backgroundColor`.** |
| `foregroundColor` | `Color?` | No | `null` — the variant's foreground |
| `boxShadow` | `List<BoxShadow>?` | No | `null` → a single zero-offset shadow in `colorScheme.shadow` at `blurRadius: 2` |
| `border` | `BoxBorder?` | No | `null`; the `outlined` variant supplies a `GradientBoxBorder` |
| `borderRadius` | `BorderRadius?` | No | `null` → `BorderRadius.circular(cornerXLarge)` (24) |
| `padding` | `EdgeInsetsGeometry?` | No | `null` → `EdgeInsets.all(spacing500)` (20) |

There is **no `automationIdentifier` and no `semanticLabel`**. The card cannot be targeted by an automated test or named for a screen reader; the controls inside it must carry both.

### Tokens

| Property | Token | Light | Dark |
| --- | --- | --- | --- |
| Radius | `cornerXLarge` / `AsmCornerRadii.r24` | 24 | 24 |
| Padding | `spacing500` | 20 | 20 |
| Shadow colour | `colorScheme.shadow` | `#308E8E8E` | `#33000000` |
| Shadow blur | hardcoded `2` (token says `4`) | 2 | 2 |
| `surface` fill | `surfaceBright` | `#FFFFFF` | `#2D2929` |
| `surface` foreground | `onSurface` | `#252121` | `#DCDBDB` |
| `brand` fill | `colorScheme.error` | `#FF1C1C` | `#FF4949` |
| `brand` foreground | `onError` | `#FFFFFF` | `#660B0B` |
| `secondary` fill | `colorScheme.secondary` | `#6161FF` | `#BDB3FF` |
| `secondary` foreground | `onSecondary` | `#FFFFFF` | `#2F275C` |
| `positive` fill | `extColors.positive` | `#00866F` | `#66C9B7` |
| `positive` foreground | `extColors.onPositive` | `#FFFFFF` | `#00100D` |
| `gradient` stops | `secondaryContainer` → `positiveContainer` | `#BDB3FF` → `#B8FFE9` | `#42287F` → `#1F3D37` |
| `gradient` foreground | `onSecondaryContainer` | `#42287F` | `#BDB3FF` |
| `outlined` stroke | `gradientBrandStop1` → `gradientBrandStop2`, 1pt | `#FF402A` → `#6161FF` | identical |

### `GradientBoxBorder`

The public border class behind the `outlined` variant. It paints a single gradient stroke, reports uniform dimensions on all four sides, and returns **no side** for `top` and `bottom`. It has no equality override, so two structurally identical instances compare unequal — which means passing a freshly-constructed one on every build defeats widget-level equality short-circuits. Hoist it to a `static final` if you construct one yourself.

### Guidance

- **Reach for `variant` first, overrides second, and never a hex.** The overrides are for token pairs the variant axis does not name.
- **Override colours in pairs.** `backgroundColor` without `foregroundColor` leaves the variant's foreground in place.
- **Never wrap the card in `GestureDetector` or `InkWell`.** Put the control inside.
- **Do not colour the child by hand** on a filled variant — the cascade already did it, and an explicit colour on a `Text` silently wins.
- **Constrain width from outside.** The card has no maximum; a card of running text at full desktop width is unreadable.
- **Never nest an `AsmCard` inside another `AsmCard`**, or inside `AsmAlertCard`, `AsmPopover`, `AsmExpandedCard`, `AsmListFeatureCard`, `AsmFeatureBanner`, or `AsmGuidedActionPanel` — all six already render one.
- **`padding: EdgeInsets.zero` requires the child to clip** to `AsmCornerRadii.r24` itself.
- **If you pass `boxShadow: []`, pass a `border` too.**
- The widgetbook playground for this component is built from raw Flutter form controls rather than widgetbook knobs, so its state does not appear in the knob panel. That is a showcase inconsistency, not a component one.

---

## Rules

1. `variant` MUST be the first thing you reach for; overrides are for colour pairs the variant axis does not name.
2. `surface` MUST be the default choice. NEVER put more than one non-`surface` card in a screen region.
3. `backgroundColor` and `foregroundColor` MUST be overridden together, never one alone.
4. Override colours MUST come from tokens. NEVER pass a hardcoded hex.
5. `foregroundColor` MUST NOT be overridden on the `gradient` variant.
6. `borderRadius` and `padding` MUST NOT be changed to match a mock. The 24pt radius and 20pt inset are the component's identity.
7. `padding: EdgeInsets.zero` MUST be paired with a child that clips to the card's radius.
8. The card MUST NEVER be the tap target. A tappable card MUST contain a real control that carries the role, name, focus, and `automationIdentifier`.
9. The card MUST NEVER be made focusable. It has no states and no state layer.
10. An `AsmCard` MUST NEVER be nested inside another `AsmCard`, or inside any of the six components that render one internally.
11. Every card MUST have a heading in its content. The card supplies no accessible name.
12. Whatever a variant's colour says, the card's text MUST say too. Colour is NEVER the only signal.
13. `brand` MUST NOT be used for body copy — its foreground computes to 3.86 : 1 in light mode, below the 4.5 : 1 floor.
14. `outlined` MUST NOT be used where a closed four-sided frame is required; it draws left and right edges only.
15. If `boxShadow` is emptied, a `border` or a distinct fill MUST replace it. A shadowless `surface` card is invisible on a light canvas.
16. `child` MUST always be passed, even though the constructor permits `null`.
17. The card MUST NOT be placed in a fixed-height container. Its height follows its child, which follows text scale.
18. A `GradientBoxBorder` you construct yourself MUST be hoisted to a `static final` — the class has no equality override.

---

## Open Items

1. **The card's shadow is half the blur the token specifies.** `AsmElevationLight.level1` is a zero-offset shadow at `blurRadius: 4`. The card writes `blurRadius: 2`, with a comment asserting that the design source's 4pt blur maps to a Flutter blur of 2. Meanwhile [[Peek Label]] writes `blurRadius: 20` for elevation-5, whose specified radius is also 20 — not halved. [[Elevation]]'s table (4 / 20 / 25) and the generated token both agree with the un-halved reading, so **the card is the outlier and its shadow is under-rendered.** This matters more here than anywhere else, because a `surface` card's fill is 1.17 : 1 against the light canvas and the shadow is its only boundary. Already recorded as [[Popover]] open item 10; repeated here because this is the file that contains the drift.
2. **No component uses the generated elevation tokens.** `AsmElevations.elevation1` and `elevation5` are referenced only by the token showcase story. Every component — this one, [[Alert Card]], [[Peek Label]], the alert card tab — hand-rolls its own `BoxShadow` from `colorScheme.shadow`. That is why item 1 went unnoticed: there is no shared definition for the card to have drifted *from* at the call site.
3. **The `gradient` variant's stops do not exist as tokens.** The implementation records the specified lavender-to-mint gradient and its exact stops, then substitutes the two closest available tokens and reinterprets the angle as a top-right → bottom-left sweep. The substitution is honest and documented, but it means the shipped card does not match the design file, and there is no ticket in the repo pointing at the missing tokens.
4. **The card has no Figma frame or node reference.** Every other component in this folder cites a frame name, and most cite a node id. `card.dart` cites only loose values — a radius token name, a padding value, an elevation level. There is nothing to re-measure against, which makes every geometry claim in this doc unverifiable beyond the Dart source.
5. **`AsmCardVariant.brand` is the third distinct "brand" colour in the system.** The card's `brand` is `colorScheme.error` (`#FF1C1C`), the severity chip's brand tier in [[Badges]] is `brandOrange` (`#E13121`), and the `outlined` stroke's warm stop is `gradientBrandStop1` (`#FF402A`). Three near-red values, all called "brand," none interchangeable. A spec that says "brand card" is ambiguous.
6. **No high-contrast branch.** [[Alert Card]], [[Badges]], and two other components branch on the platform's high-contrast setting; the card does not. Its `positive` variant reads from the extended colours, which the Windows contrast pipeline does not remap, so a `positive` card keeps its teal fill in a forced-colours theme while `surface` and `brand` cards shift. This is the same defect as [[Status Indicators]] open item 9.
7. **The `brand` variant fails 4.5 : 1 in both themes** (3.86 : 1 light, 3.90 : 1 dark, computed from the token values). It is documented for "critical, brand-forward callouts," which is exactly the case where body copy is likely. Either the variant needs a darker fill or its documentation needs to restrict it to large text.
8. **`outlined`'s border draws only two edges and nothing says so.** `GradientBoxBorder` returns `BorderSide.none` for `top` and `bottom` while reporting uniform dimensions on all four sides. The variant's own documentation describes it as "a 1pt brand-gradient stroke" with no mention that half the stroke is absent. A reader will expect a closed frame.
9. **`GradientBoxBorder` has no `==` or `hashCode`.** It is a public, exported class used as a widget parameter. Two structurally identical instances compare unequal, so a caller who constructs one inline defeats equality-based rebuild short-circuits. Nothing in the class's documentation warns about this.
10. **Seven overrides, zero asserts.** The card is the least-constrained component in the system: it validates no colour pairing, does not warn when `gradient` silently overrides `backgroundColor`, permits a null child, and permits any radius or padding. Every other component in this folder asserts something. Given that six components are built on it, this is where a contradiction is most expensive and least likely to be caught.
11. **No `automationIdentifier`.** The card cannot be located by an automated test. Every composed component built on it declares one — [[Expanded Card]] even makes it required — so the base surface is the one layer of the stack that is untargetable. Tests must reach for a child instead, which couples them to the card's contents.
12. **No `Semantics` wrapper of any kind.** The card creates no grouping node, so a screen-reader user moving through a page of cards gets an undifferentiated run of content with no boundaries between one card and the next. A `Semantics(container: true)` would cost nothing and would make card boundaries audible. Whether that is the right default given the six components layered on top is a system decision nobody has recorded.
13. **The showcase teaches four colour pairs the variant axis does not include** — an attention pair, a pale app-canvas pair, a custom brand gradient with a white foreground, and the default surface pair. Three of those look like variants the enum is missing rather than one-off overrides. Either they should be promoted to variants or the showcase should mark them as exceptions.
14. **The widgetbook playground uses raw Flutter form controls instead of widgetbook knobs**, unlike every other component's playground, so the card's variant and override state is invisible in the knob panel and cannot be deep-linked. [[Expanded Card]]'s playground has the same problem.
15. **The implementation's spec comment describes the shadow in a web styling format** rather than in the system's own terms. That is how the halving in item 1 was rationalised — a conversion step was invented for a value that needed no conversion. Every geometry note in this file should be restated in points against the token, with no intermediate format.
