# Foundation: Elevation

> Role: Defines how surfaces separate from the app canvas and from each other. Elevation in Assemble is expressed with **drop shadows**, not tonal fills.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what each shadow means and when to use it, and apply to any surface built on this design system. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: NEVER hand-author a shadow. There are exactly three shadows; use one of them or none.

## Overview

Elevation communicates that a surface sits **above** the app canvas, and how far above. Assemble expresses this with three drop shadows — `subtle`, `light`, and `heavy` — each with a distinct job:

| Shadow | Character | Primary job | Frequency |
| --- | --- | --- | --- |
| **subtle** | Very narrow, small spread | Emphasize a container without lifting it | Rare |
| **light** | Heavily blurred, light color | Float cards and containers above the canvas; divide regions of UI | Frequent — the default |
| **heavy** | Strongest, most pronounced | Emphasize a container, or raise it on interaction | Occasional |

## Shadow Specs

Effect styles as defined in the Visual Foundations Figma file (`Elevation` page, node `2388:18`). All three are drop shadows with **zero offset** — the shadow is cast evenly on all sides rather than directionally, so elevated surfaces read as ambiently lifted rather than lit from above.

| Effect style | Offset | Blur radius | Spread | Color token |
| --- | --- | --- | --- | --- |
| elevation-subtle | 0, 0 | 4 | 0 | `md.sys.color.shadow` |
| elevation-light | 0, 0 | 20 | 0 | `md.sys.color.shadow` |
| elevation-heavy | 0, 0 | 25 | 0 | `mcafee.color.extended.opaque.dark-40` |

The three differ along two dimensions, not one:

- **Blur** grows 4 → 20 → 25. The jump from `subtle` to `light` is the large one (5×); `heavy` is only slightly blurrier than `light`.
- **Color** is what separates `heavy` from `light`. `subtle` and `light` share the light gray shadow token (`#8E8E8E30`, roughly 19% opacity), while `heavy` switches to a **40% black** (`mcafee.color.extended.opaque.dark-40`). So `heavy` reads as dramatically stronger because it is darker and more opaque, not because it is much wider.

This is why `subtle` and `light` feel like the same family at different scales, while `heavy` reads as a genuinely different depth.

These three are the complete set. Elevation is not a continuous scale — there is no "level 1 through 5" to interpolate. A surface either carries one of these three shadows or it carries none, and **no shadow at all is the most common state**. Most UI sits flat on the canvas and is separated by color, spacing, or a border instead.

### Elevation is shadow-based, not tonal

Material 3 often expresses elevation by shifting a surface's tonal fill (`surface-container-low` → `surface-container-high`). Assemble diverges: **elevation is carried by the shadow**, and surface color is chosen independently from the surface tokens in [[Color]].

That means the `surface-container-*` tokens are **not** an elevation scale here — they are container fills for tertiary UI, as described in [[Color]]. Do not reach for a higher `surface-container-*` step to make something feel raised; apply a shadow instead.

## The Three Shadows

### subtle

A very narrow, small drop shadow — `4` blur at zero offset in the light shadow color. Barely perceptible as a shadow, closer to a soft edge definition.

**Use it to emphasize a particular container** where a full float would be too much. It gives a container just enough definition to read as its own object without implying it hovers above the page.

**Used infrequently.** Most containers need either the `light` float or nothing at all. Reach for `subtle` when a container genuinely needs to be picked out from its surroundings but should still feel seated on the canvas.

- ✅ A container that needs quiet definition against a similar-colored background
- ✅ Emphasizing one element among several without changing its size or color
- ❌ Not a general-purpose default — if you find yourself applying it everywhere, most of those cases want no shadow
- ❌ Not a substitute for a border or divider where a hard line is what's needed

### light

A heavily blurred shadow in a light color — `20` blur at zero offset, 5× the blur of `subtle` in the same color. This is the **workhorse** and the one to reach for first when something needs to lift.

**Use it for cards and containers that float above the app canvas.** The wide, soft blur reads as a diffuse ambient lift rather than a hard cast shadow — it separates a surface from the canvas cleanly without visual noise.

It also does structural work: **use it to divide parts of the UI**. Where two regions need to read as distinct layers rather than one continuous plane, a floating `light` surface communicates that separation without a hard rule or a color change.

- ✅ Cards and containers that sit above the app canvas
- ✅ Separating a region of UI from the content behind or below it
- ✅ Sheets, panels, and surfaces that conceptually float
- ❌ Not for something that should read as flush with the canvas
- ❌ Not stacked with another shadow to intensify it — step up to `heavy` instead

### heavy

The strongest of the three, for surfaces that need real prominence — `25` blur at zero offset, but crucially in **40% black** rather than the light shadow color. Its strength comes from that darker, more opaque color, not from the marginally wider blur.

**Use it where a container should be emphasized** — a carousel is the canonical case, where the shadow helps the carousel read as a distinct, foregrounded object with content passing behind or beside it.

**Also use it for raise-on-interaction.** A card that lifts on hover moves from its resting shadow to `heavy`, so the change in depth reads as feedback. Pair the shadow change with the interaction state layers in [[Color]] rather than changing the surface color arbitrarily.

- ✅ A container that needs to command attention, e.g. a carousel
- ✅ The raised state of an interactive card on hover
- ✅ Surfaces that sit clearly above other already-elevated content
- ❌ Not for resting state on ordinary cards — that's `light`
- ❌ Not as a way to add emphasis to something that isn't a container

## Choosing a Shadow

Resolve in this order:

1. **Does this need to lift at all?** Most surfaces don't. If color, spacing, or a border already separates it, use no shadow.
2. **Does it float above the canvas, or divide regions of UI?** → `light`. This is the common answer.
3. **Does it need real prominence, or is it the raised state of an interaction?** → `heavy`.
4. **Does it just need quiet definition while staying seated?** → `subtle`.

Additional constraints:

- **One shadow per surface.** Never stack or combine shadows to create intermediate depths.
- **Be consistent across peers.** All cards in a list or grid carry the same shadow. A single card with a different elevation reads as broken, not emphasized.
- **Reserve depth for hierarchy, not decoration.** If everything on a screen is elevated, nothing is. The flat canvas is what makes an elevated surface legible.
- **Interaction should change depth, not invent it.** A raise-on-hover moves an already-elevated surface up a step; it doesn't add a shadow to something that had none.
- **Don't use elevation to fix contrast.** If a surface is hard to distinguish from its background, fix the surface color with tokens from [[Color]].

## Shadow Color

The shadows draw on **two** color tokens from [[Color]], not one:

| Token | Value | Used by |
| --- | --- | --- |
| md.sys.color.shadow | `#8E8E8E30` | `subtle`, `light` |
| mcafee.color.extended.opaque.dark-40 | `#00000066` | `heavy` |

`md.sys.color.shadow` is a **light, low-alpha gray** (~19% opacity) rather than black — which is why `subtle` and `light` read as soft ambient lifts instead of hard cast shadows.

`heavy` deliberately breaks from that, using the 40% black opaque token. This is the mechanism behind its prominence: same zero offset, only 5 more blur than `light`, but a much darker and more opaque color.

- Never hand-author a shadow color. Reference the token.
- Never substitute a brand or accent color for a shadow.
- Do not "strengthen" `light` by overriding its opacity — if it needs to be stronger, it needs to be `heavy`.
- Shadow color resolves per theme mode — do not hardcode a dark-mode shadow.

## Dark Mode

Elevation still applies in dark mode, but shadows carry less of the work — a light-colored shadow has little contrast against a dark canvas. Where a shadow alone doesn't achieve separation in dark mode, lean on the surface tokens in [[Color]], whose dark values are already tuned to differentiate stacked surfaces.

Do not compensate by darkening or intensifying the shadow manually. Let the theme resolve it.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

Shadows are exposed through `AsmTokens` alongside color, state layers, and gradients — `AsmTokens.of(context)` (or the `context.asmTokens` extension) aggregates a `shadows` group for the active brightness. See the wiring described in [[Color]].

Apply a shadow through the decoration of the container you're elevating, passing the token's shadow list rather than constructing `BoxShadow` by hand:

```dart
Container(
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surface,
    borderRadius: BorderRadius.circular(12),
    boxShadow: context.asmTokens.shadows.light,
  ),
  child: child,
);
```

The specs map to Flutter as zero-offset `BoxShadow`s — Figma's blur radius corresponds to Flutter's `blurRadius`, and spread to `spreadRadius`:

| Shadow | Flutter equivalent |
| --- | --- |
| subtle | `BoxShadow(offset: Offset.zero, blurRadius: 4, spreadRadius: 0, color: <shadow>)` |
| light | `BoxShadow(offset: Offset.zero, blurRadius: 20, spreadRadius: 0, color: <shadow>)` |
| heavy | `BoxShadow(offset: Offset.zero, blurRadius: 25, spreadRadius: 0, color: <dark-40>)` |

These are shown to make the token values legible — **do not hand-write them**. Reference the shadow from `AsmTokens` so the color resolves per theme.

Guidance:

- Reference the named shadow (`subtle` / `light` / `heavy`) from the tokens — never write a literal `BoxShadow(color: …, blurRadius: …, offset: …)`.
- Do not use Flutter's `Material(elevation:)` or `Card(elevation:)` numeric elevation, which applies Material's own shadow model and bypasses the token set. Set the decoration explicitly instead.
- For raise-on-interaction, swap the shadow token on state change and let the implicit animation handle the transition; keep the surface color driven by the state layers in [[Color]].
- Shadow color resolves per brightness through the token — never pass a hardcoded `Color`.

---

## Rules

1. There are exactly **three** shadows — `subtle`, `light`, `heavy`. Never author a fourth.
2. NEVER hand-author shadow geometry or color. Reference the shadow tokens.
3. Elevation is expressed with **shadows**, not by stepping up `surface-container-*` tonal fills.
4. Default to **no shadow**. Elevate only when a surface genuinely needs to separate.
5. `light` is the default lift for floating cards and containers, and for dividing regions of UI.
6. `heavy` is for emphasized containers (e.g. carousel) and raise-on-interaction states.
7. `subtle` is for quiet container emphasis and is used sparingly.
8. One shadow per surface — never stack shadows to create intermediate depth.
9. Peer surfaces (cards in a list or grid) MUST share the same elevation.
10. Shadow color comes from a token (`md.sys.color.shadow` for `subtle`/`light`, `mcafee.color.extended.opaque.dark-40` for `heavy`) and resolves per theme mode — never hardcode it, never tint it with a brand color.
11. Do not use elevation to solve a contrast problem — fix the surface color instead.
