# Foundation: Spacing

> Role: Defines the spacing scale — the complete set of values available for padding, margins, and gaps.
> Rule: NEVER hardcode a spacing value. Always reference a token from the scale.

## Overview

Spacing usage follows **Material 3's spacing guidelines** closely — space is the primary tool for grouping, separating, and creating rhythm, and consistent spacing does more for legibility than any other single decision.

Assemble's scale is a **4px-based system** with two sub-4 steps for fine adjustments. Every value is a multiple of 4 except `50` (2px) and `250` (10px).

The scale is a closed set of **15 steps**. If a layout seems to need a value that isn't on the scale, the answer is a different step, not a new value.

Spacing governs the space *inside and between* components. The space that structures a page — outer margins, column gutters, section gaps — is defined by [[Grid]].

## The Spacing Scale

Tokens are named `md.spacing.*` on a numeric scale where the token name is roughly 25× the pixel value. The name is the stable reference; the pixel value is an implementation detail.

| Token | Value | Typical use |
| --- | --- | --- |
| md.spacing.0 | 0 | Explicitly removing space |
| md.spacing.50 | 2 | Hairline separation; icon-to-label in dense controls |
| md.spacing.100 | 4 | Tightest real gap; related inline elements |
| md.spacing.200 | 8 | Icon-to-label, chip padding, tight stacks |
| md.spacing.250 | 10 | Fine adjustment between 8 and 12 |
| md.spacing.300 | 12 | Compact component padding, list row padding |
| md.spacing.400 | 16 | **The default.** Standard padding and gaps |
| md.spacing.500 | 20 | Comfortable component padding |
| md.spacing.600 | 24 | Card padding; gap between cards |
| md.spacing.700 | 28 | Between subsections |
| md.spacing.800 | 32 | Generous container padding |
| md.spacing.900 | 36 | Section separation |
| md.spacing.1000 | 40 | Large section separation |
| md.spacing.1100 | 44 | Major region separation |
| md.spacing.1200 | 48 | Largest step; top-level region separation |

**`md.spacing.400` (16) is the default.** Start there and move up or down only with a reason.

### The scale has a shape

The steps are not interchangeable. They fall into three bands, and knowing which band you're in matters more than picking the exact number:

- **0 – 8** (`0`, `50`, `100`, `200`) — *inside* a single element. Icon to its label, text to its container edge in a dense control. At this range, space separates parts of one thing.
- **10 – 24** (`250`, `300`, `400`, `500`, `600`) — *between* elements and as component padding. This is where most spacing decisions land, and `400` is its center.
- **28 – 48** (`700` through `1200`) — *between* groups and regions. Space at this scale says "these are different things."

Crossing a band boundary changes what the space communicates. Going from 8 to 16 doesn't just make a gap bigger; it changes two parts of one element into two separate elements.

### The two off-grid steps

`50` (2px) and `250` (10px) break the 4px rhythm and exist for optical correction, not layout:

- **`50`** is for hairline separation where 4px is already too much — typically inside a dense control.
- **`250`** exists because 8 is sometimes tight and 12 sometimes loose for the same element.

Reach for these last. If an off-grid step is load-bearing in a layout, the surrounding spacing is usually the real problem.

## Choosing a Value

Resolve in this order:

1. **Is this space inside one element, between elements, or between groups?** That picks the band.
2. **Start at the band's default** — `200` inside, `400` between elements, `800` between groups.
3. **Adjust by one step if needed.** One step is almost always enough.
4. **Is the relationship being expressed correctly?** Related things sit closer than unrelated things. If two elements read as more related than they are, the gap is too small.

Additional constraints:

- **Space communicates grouping.** Proximity is the strongest grouping signal available — stronger than borders, backgrounds, or alignment. Use it before reaching for a divider.
- **Be consistent within a surface.** A card using `600` padding should not have a sibling using `500`. Peer elements share spacing.
- **Prefer fewer distinct values.** A screen using three steps consistently reads better than one using seven precisely.
- **Do not use spacing to fix alignment.** If something looks off-center, the layout is wrong; nudging with `50` hides the problem.
- **Do not stack spacing.** Padding on a parent plus margin on a child produces a total nobody authored. Pick one owner for each gap.

## Spacing vs. Layout

Spacing tokens and grid values solve different problems and should not be substituted for each other:

| Concern | Owned by | Examples |
| --- | --- | --- |
| Space inside a component | Spacing scale | Card padding, button padding, icon-to-label |
| Space between components | Spacing scale | Gap between cards in a stack |
| Page structure | [[Grid]] | Outer margin, column gutters, content max width |

The grid's 16px margin and gutter happen to coincide with `md.spacing.400`, and its 24px row gap with `md.spacing.600` — but they are **layout values that belong to the grid**, not spacing tokens applied to a page. Change one and the other does not follow.

## Related Scales

Two other utility scales sit alongside spacing and follow the same rules — reference the token, never the value.

**Border width** (`md.border.size.*`): `0` (0), `100` (1), `200` (2), `300` (3), `400` (4). The focus ring uses `200` — see [[States]].

**Border radius** (`md.border.radius.*`): 0, 2, 4, 6, 8, 12, 16, 24, 32, 36, 40, 48, 56, 64, and `999` for fully rounded. Use `999` for pill shapes rather than a large fixed number, so the shape holds at any height.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

Spacing resolves to `double` constants. Reference them from the generated token constants rather than writing literals:

```dart
Padding(
  padding: EdgeInsets.all(AsmSpacing.s400),
  child: child,
);
```

**Gaps between children** belong to the parent, not the children. Use a `Column`/`Row` with `spacing:`, or explicit `SizedBox` gaps — do not put a bottom margin on every child:

```dart
Column(
  spacing: AsmSpacing.s600,
  children: [cardA, cardB, cardC],
);
```

**Asymmetric padding** composes from the same scale — `EdgeInsets.symmetric(horizontal: AsmSpacing.s600, vertical: AsmSpacing.s400)`. Both values still come from the scale.

Guidance:

- Never write a numeric literal in `EdgeInsets`, `SizedBox`, or `spacing:`. Reference the scale.
- Do not use `Spacer` or `Expanded` to create a specific gap — those fill available space. Use an explicit spacing value when the gap has a defined size.
- Radius comes from the border radius scale via `BorderRadius.circular(...)`; use the `999` step for pill shapes.
- Do not add padding to a widget that already has it from its `Asm*` parent — check before wrapping.

---

## Rules

1. NEVER hardcode a spacing value. Always reference a token from the scale.
2. The scale is a **closed set of 15 steps**. Never introduce a value outside it.
3. `md.spacing.400` (16) is the default. Deviate only with a reason.
4. Match the band to the relationship — inside an element (0–8), between elements (10–24), between groups (28–48).
5. Peer elements MUST use the same spacing. A card's padding matches its siblings'.
6. Use proximity to express grouping before reaching for a border or background.
7. Do not stack padding and margin for the same gap — one owner per gap.
8. `md.spacing.50` and `md.spacing.250` are optical corrections, not layout values. Reach for them last.
9. Do not use spacing to correct alignment problems.
10. Page structure (outer margin, gutters, content width) comes from [[Grid]], not from spacing tokens.
11. Prefer fewer distinct steps per surface over precisely-chosen many.

---

