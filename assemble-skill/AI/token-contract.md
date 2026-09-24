# Token Contract

> Role: The single place that says what a value in Assemble is allowed to be. Every closed scale,
> every allowed namespace, every forbidden one.
> Rule: **If it isn't a token, it isn't a value.** A number in your output is a defect until you
> can name the token it came from.
> Scope: Applies to every target, and to **both** sanctioned bindings — Flutter and React. The
> token *names* and every scale below are portable; only the per-binding **accessors** at the
> bottom of this file are not.
> Source: `../Foundations/Color.md`, `Typography.md`, `Spacing.md`, `States.md`, `Elevation.md`,
> `Icons.md`. Those docs win over this one — this is a consolidation for fast lookup.

---

## 1. The three layers

```
md.key.*                      key        — the raw inputs. Authoring only.
   ↓
md.ref.palette.*              reference  — the resolved palette. Authoring only.
md.ref.brand.*
md.ref.type.font.*
   ↓
md.sys.color.*                semantic   — meaning. THIS is what UI consumes.
mcafee.color.extended.*
```

| Layer | Who may reference it |
| --- | --- |
| **key** | Only the token pipeline. Never a component, never a screen, never your output. |
| **reference** | Only the semantic layer. Never a component. |
| **semantic** | Everything. This is the only layer a UI is allowed to name. |

A reference-layer token in application code is a **BLOCKER**, not a style preference. It means the
value can no longer respond to theme, and the token system has been bypassed at the exact point it
was supposed to work.

### One source, two builds

```
                     THE TOKEN SOURCE
              key → reference → semantic
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
      Flutter build            web build
   `assemble_flutter_tokens`   CSS custom properties / JS export
      → Flutter binding           → React binding
```

**Both bindings consume the same semantic layer.** Same three layers, same names, same meanings —
so there is **no mapping to declare and no approximation to make** between them. Everything in
sections 1–9 of this file is true in both.

The web build necessarily **renames** tokens into whatever form the target consumes, so
`md.sys.color.primary` appears under a transformed name. That transform is mechanical and it lives
in the web token package: **read it there once, confirm it, and use it everywhere.** Do not guess
the convention, and do not fall back to a literal because you couldn't find the variable. A token
with no entry in the web build is a **gap in the web build** to report — never licence to inline a
value.

### Allowed in UI

```
md.sys.color.*                 Material semantic roles
mcafee.color.extended.*        status, brand, gradient, opaque
md.sys.state.*                 state layer colours
md.sys.typescale.*             composite type styles
md.spacing.*                   the 15-step scale
md.border.size.*               border widths
md.border.radius.*             corner radii
md.border.focus                the focus ring
```

### Forbidden in UI

```
md.key.*                       ✗
md.ref.palette.*               ✗
md.ref.brand.*                 ✗
md.ref.type.font.*             ✗
md.type.size.*                 ✗
```

### Forbidden always

Raw `#RRGGBB` / `#RRGGBBAA` / `rgb()` / `rgba()` / `hsl()` / `Color(0x…)`. Raw font size, weight,
line height, or letter-spacing. Raw padding, gap, margin, radius, or border width. Hand-authored
`BoxShadow`. A hardcoded dark-mode value.

**The one exception:** quoting a documented raw value while *citing* it as an open item — e.g.
"`Button` uses 23/18 vertical padding, off-scale, `Button` open item 5." Quoting a defect is not
committing one, but say which it is.

---

## 2. Colour

**Pick the semantic role by what the thing means, then let the theme resolve it.** Do not pick a
role because you like the colour it currently produces.

| Family | Use for |
| --- | --- |
| `md.sys.color.primary` / `on-primary` / `primary-container` / `on-primary-container` | the main action and its surfaces |
| `md.sys.color.secondary` / `tertiary` families | supporting and accent actions |
| `md.sys.color.error` / `on-error` / `error-container` | errors, destructive meaning |
| `md.sys.color.surface` / `on-surface` / `on-surface-variant` | canvases and text on them |
| `md.sys.color.surface-container` / `-low` / `-high` / `-highest` | container fills for tertiary UI — **not an elevation scale** |
| `md.sys.color.outline` / `outline-variant` | borders and dividers |
| `md.sys.color.inverse-surface` / `on-inverse-surface` | inverted surfaces (snackbar, tooltip, peek label) |
| `md.sys.color.shadow` | the shadow colour for `subtle` and `light` (`#8E8E8E30`) |
| `mcafee.color.extended.*` | status, brand, gradients, and opaque overlays that Material has no role for |
| `mcafee.color.extended.opaque.dark-40` | the `heavy` shadow colour (`#00000066`, 40% black) |

**Contrast minimums:** 4.5:1 normal text · 3:1 large text · 3:1 interactive and non-text.

**Dark mode is a theme-mode swap.** You do not re-point a token, you do not branch on brightness
at the usage site, and you do not write a dark value anywhere. If a colour looks wrong in dark
mode, the wrong *role* was chosen.

**Never colour alone.** Every status, severity, or destructive meaning also needs a glyph, a
label, or adjacent text. This is a tier-1 accessibility rule, not a nicety.

---

## 3. Typography

One **composite** token per text run. A composite token carries size, weight, line height, and
tracking together — naming any of them separately breaks the contract.

| Style | large | medium | small |
| --- | --- | --- | --- |
| `display` | 57 | 44 | 36 |
| `headline` | 32 | 28 | 24 |
| `title` | 22 | 18 | 16 |
| `label` | 14 | 12 | 11 |
| `label.mono` | 14 | 12 | 11 | *(line height 1.0)* |
| `body` | 16 | 14 | 12 |

Typeface: **McAfee Sans**; **McAfee Sans Mono** for the mono variants.

| Rule | |
| --- | --- |
| **Emphasis** | `-emphasized` (weight 700). Never a manual weight, never a larger size. |
| **Heavy** | `display` and `headline` **only**, and only in promotional contexts. Never on title/label/body, never in standard product UI. |
| **Mono** | Data values only, sparingly. Never on a control, prose, or a heading. |
| **Never alter metrics** | A different line height or tracking means a different token, not an override at the usage site. |
| **Choose by function** | What the text is *doing* — read (`body`) / name a control (`label`) / name a surface (`title`) / introduce a section (`headline`) / hero (`display`) / machine value (`label.mono`) — not by how big it should look. |

---

## 4. Spacing

A **closed set of 15 steps.** There is no sixteenth.

| Token | px | | Token | px |
| --- | --- | --- | --- | --- |
| `md.spacing.0` | 0 | | `md.spacing.500` | 20 |
| `md.spacing.50` | 2 | | `md.spacing.600` | 24 |
| `md.spacing.100` | 4 | | `md.spacing.700` | 28 |
| `md.spacing.200` | 8 | | `md.spacing.800` | 32 |
| `md.spacing.250` | 10 | | `md.spacing.900` | 36 |
| `md.spacing.300` | 12 | | `md.spacing.1000` | 40 |
| `md.spacing.400` | **16 — the default** | | `md.spacing.1100` | 44 |
| | | | `md.spacing.1200` | 48 |

**Choose by the relationship, not by eye.** Three bands:

| Band | Range | Means | Start at |
| --- | --- | --- | --- |
| Inside an element | 0–8 | parts of one thing | `md.spacing.200` |
| Between elements | 10–24 | separate things, related | `md.spacing.400` |
| Between groups | 28–48 | distinct regions | `md.spacing.800` |

Pick the band from the relationship, start at its default, and adjust by **one** step. Crossing a
band means you changed what you're claiming about the content.

`md.spacing.50` (2) and `md.spacing.250` (10) are **optical corrections** — reach for them last,
and only when a band default is visibly wrong.

**One owner per gap.** Never stack a parent's padding with a child's margin; pick one and let the
other be zero. Double padding is the most common off-scale value in practice — the number in the
code is on-scale, the rendered gap isn't.

If a layout seems to need an off-scale value, it needs a **different step**, or the layout is
wrong.

---

## 5. Border width and radius

```
md.border.size.{0,100,200,300,400}     →  0, 1, 2, 3, 4
md.border.radius.*                     →  0, 2, 4, 6, 8, 12, 16, 24, 32, 36, 40, 48, 56, 64, 999
```

`999` **is** the pill. Never approximate one with a large fixed radius — the shape breaks the
moment the element's height changes.

---

## 6. States

| State | Layer opacity |
| --- | --- |
| enabled | **none** — the absence of a layer |
| hover | 8% |
| focus | 10% |
| pressed | 10% |
| dragged | 16% |

Combined states are **additive** (hover + pressed = 18%). Precedence:
**disabled → pressed → focus → hover → enabled.**

**Role** — the state layer's colour comes from the **action's meaning**, not the element's current
colour: `primary` · `secondary` · `neutral` · `error`. A destructive *text* button still uses
`error`.

**Focus ring** — `md.border.focus`: `md.sys.color.primary`, `md.border.size.200` (2px), solid,
2px offset outside the element. **Keyboard-only** — it must not appear after a plain mouse click.
Never removed, narrowed, or recoloured.

**Disabled** — **12% container / 38% content**, both derived from `on-surface`. No other state
applies, and the element leaves the tab order. Because disabled text does not meet contrast, it
may never be the only place information appears.

**Selected is a separate axis**, not a competing state — a selected element still expresses hover,
focus, and pressed.

Component docs' `States` sections document only their **divergences** from this model. Three live
ones are catalogued in [`decision-priority.md`](decision-priority.md) §2.

---

## 7. Elevation

**Exactly three shadows. All zero-offset.** This is a *shadow* system, not a scale.

| Token | Blur | Colour | Use for |
| --- | --- | --- | --- |
| `elevation-subtle` | 4 | `md.sys.color.shadow` | quiet definition. Rare. |
| `elevation-light` | 20 | `md.sys.color.shadow` | floats above content, or divides regions. The default lift. |
| `elevation-heavy` | 25 | `mcafee.color.extended.opaque.dark-40` | commands attention, or raises on interaction. |

**The most common correct answer is no shadow.** Ask "does this need to lift at all?" first —
colour, spacing, or a border usually already separates it.

One shadow per surface. Never stack them, never interpolate, never invent a fourth. Peers in a
grid share the same shadow.

**Elevation is not tonal.** `md.sys.color.surface-container-*` is a set of container fills for
tertiary UI. Stepping it up does not raise anything; it just makes a greyer box.

In dark mode a light shadow has little contrast against a dark canvas. Lean on the surface tokens.
Never manually darken the shadow.

---

## 8. Icons

**Material Symbols Outlined**, weight **400**, held constant. Outlined by default; **filled is
reserved for the selected state** and never used for emphasis.

Sizes: **16 · 20 · 24 · 40 · 48**. Take the size from the pairing table in
`../Foundations/Icons.md` — button small/medium → 16, button large → 20, alert → 24, nav item →
24, sidebar/dropdown/field → 20.

| Rule | |
| --- | --- |
| One concept, one glyph | product-wide. Never rotate, flip, or redraw a library glyph. |
| Size the glyph, pad the target | 48×48 interactive minimum comes from padding. |
| No `AsmIcon` widget exists | use the framework `Icon`. `AsmIconButton` and `AsmIconContainer` (60×60 box, 24px glyph) do exist. |
| Meaningful icons are named | decorative ones are hidden from assistive technology. |
| Don't constrain the box to size the glyph | and don't override an icon size on a component slot. |

---

## 9. Layout values — the honest part

**These are not tokens.** They are measured constants, and that is a standing gap
([`known-gaps.md`](known-gaps.md)).

```
thresholds        500, 980                     (exactly two — never a third)
grid cap          992   = (12 × 68) + (11 × 16)
gutter / margin   16
rail              60
side panel        386
vertical rhythm   24 between items, 30 at section boundaries
content region    window − 16 − 60 − 16 − 386 (panel, if present)
```

Because they aren't tokenized, **never inline them at a call site** — name a constant, and derive
everything you can from the content region rather than restating a number.

Layout decisions come from the **content region**, never from window width. 1280 and 1440 are
window sizes, not breakpoints: the grid already capped at 992, so the content is identical and only
the margin differs.

---

## Flutter Access — the production binding

*Non-portable. Everything above this line is target-independent; this section and the next are not,
and neither is authority for the other.*

| Need | Accessor |
| --- | --- |
| Colour scheme | `asmColorScheme(brightness: …)` |
| All tokens | `AsmTokens.of(context)` / `context.asmTokens` |
| Extended colours | `context.asmExtendedColors` |
| State colours | `context.asmStateColors` |
| Gradients | `context.asmGradients` |
| Shadows | `context.asmTokens.shadows` |
| Spacing | `AsmSpacing.*` |

Package: `assemble_flutter_tokens`.

**Forbidden in Flutter:**

- `Color(0x…)` anywhere in application code
- `Material(elevation:)`, `Card(elevation:)` — set the decoration, pass the shadow token
- `TextStyle` overrides on a component that applies its own weight and leading
- `EdgeInsets` with a literal that isn't from the spacing scale
- `BorderRadius.circular(<big number>)` where the pill (`999`) was meant
- `MediaQuery.of(context).size.width` for a **layout decision** — use `LayoutBuilder` and
  `constraints.maxWidth`. (`MediaQuery` remains correct for safe areas, insets, and text scale.)
- `size:` on an icon handed to a component slot
- `Padding` wrapped around a component to change its size — use the component's size step
- Tracking hover/press in local `setState` instead of resolving from `WidgetState`
- Overriding a button's shape — it is not configurable

---

## Web Access — the React prototyping binding

*Non-portable, and **undocumented**. There is no written record of the web token build's naming
convention — read it from the web token package. See [`react-binding.md`](react-binding.md) §3.*

| Need | Where it comes from |
| --- | --- |
| Every semantic token | the **web build** of the token source — CSS custom properties, a JS export, or both |
| The naming transform | **read it from the web token package.** Confirm it once; never guess it |
| Theme / dark mode | a **theme swap** at the root, exactly as in Flutter. Never a value, never a branch at the usage site |
| Composite type styles | the composite token, applied whole — never split into size/weight/line-height/tracking |

**Forbidden in React / web output:**

- Any hex, `rgb()`, `rgba()`, `hsl()`, or named CSS colour — including "just for the prototype"
- A raw `px`/`rem` value for padding, gap, margin, radius, or border width
- A hand-written `box-shadow` — use the three shadow tokens
- Splitting a composite type token into separate `font-size` / `font-weight` / `line-height` /
  `letter-spacing` declarations
- `@media (min-width: …)` on the **viewport** for a layout decision — Assemble decides from the
  **content region**, and a viewport query is wrong whenever a side panel is open. Use a
  container-based mechanism, or state the caveat explicitly
- A third breakpoint threshold. There are **two**: 500 and 980
- `outline: none` on any focusable element, and any narrowing or recolouring of the focus ring
- Reaching into `md.key.*` or `md.ref.*`, whatever the web build happens to expose
- An `Asm*` name. `Asm*` is Flutter vocabulary — React uses a different prefix or plain names
- Inlining a value because you couldn't find the variable. That is a **gap to report**
