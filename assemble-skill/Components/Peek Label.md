# Component: Peek Label

> Role: A small floating chip that surfaces the human-readable name of an adjacent icon-only affordance — the [[Navigation Rail]]'s destinations on hover, the collapsed guided action panel's handle. It is a label, never a control, and it never explains anything.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe what the chip means, where it goes, and what it must never be asked to do. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The chip has no semantics, and that is correct — it repeats a name the affordance underneath it must already carry. If you find yourself wanting the chip announced, the affordance is missing its label. Fix the affordance.
> Source: Figma `Components` → `peek-label`, with `size=default` / `size=small` and `state=Offline`. No node ids are cited in the implementation. Implementation: `pegasus_flutter/lib/asm/components/peek_label.dart`.

## Overview

An icon-only affordance is compact and ambiguous. The peek label resolves the ambiguity by putting the destination's actual name next to it, on hover or focus, in a bright chip that reads as part of the navigation surface.

**The distinction most often got wrong is peek label versus [[Tooltip]].** Both are small floating strings attached to an icon-only control, and they are separate components with different jobs:

| | Peek Label | [[Tooltip]] |
| --- | --- | --- |
| Fill | Bright — `surfaceBright` | Inverse — a dark bubble |
| Type size | 14pt | 12pt |
| Elevation | Elevation-5 shadow | None |
| Height | 32 or 28 | 24 |
| Radius | 12 | Smaller |
| Says | **The thing's name** | **Something about the thing** |
| Built for | Navigation-rail destinations, collapsed panel handles | Arbitrary controls anywhere |

The peek label reads as part of the navigation surface; the tooltip reads as an annotation floating over the app. **Use the peek label in a navigation rail and the tooltip everywhere else.** And the division is not only visual: a peek label carries a *name*, so it is one or two words; a tooltip carries an *explanation*, so it can be a sentence. The chip has no maximum width and will run off-screen given a sentence — see [Behaviors](#behaviors).

**The second distinction is peek label versus [[Popover]].** The peek label is presentational and not focusable, so anything interactive placed inside or beside it is unreachable by keyboard. A floating surface that contains a control is a popover, not a peek label. [[Popover]] records this as an explicit prohibition.

**The third distinction is label versus tab stop.** The chip appears on hover or focus of something *else*. It is never itself the thing a user moves to. It has no tap handler, no focus node, and no pointer behaviour of any kind — it does not even position itself. The caller owns everything except the drawing. See [Placement](#placement).

## Anatomy

```
                   ╭──────────────────────────────────────╮
   ┌──────────┐    │ ┆16┆                          ┆16┆   │  ← 32 minimum height
   │          │    │        Identity monitoring  ┆4┆ ◇    │     radius 12
   │   icon   │┆8┆ │ ┆16┆                          ┆16┆   │
   │  52×52   │    ╰──────────────────────────────────────╯
   └──────────┘     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← elevation-5 shadow
        ↑                        ↑                  ↑          (0 offset, blur 20)
   the affordance          label (14pt)      trailing icon
   the chip names                                (16 × 16)
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | Radius 12 (`cornerMedium`). Height 32 or 28 depending on `size` — a *minimum*, not a fixed value. |
| **Fill** | Yes | `surfaceBright` by default; `inverseSurface` for the `inverse` tone. |
| **Shadow** | Yes | Elevation-5, zero offset, blur 20. Not overridable. This is what lifts the chip off the surface it floats over. |
| **Label** | **Yes** | The affordance's name, at 14pt regular. One or two words. |
| **Horizontal padding** | Yes | 16pt each side. |
| **Vertical padding** | Yes | 6pt each side — **off the 4pt scale**. See [Open Items](#open-items) item 3. |
| **Trailing icon** | No | 16 × 16, 4pt after the label, in the label's colour. |
| **Leading icon** | **Absent** | There is no leading slot. The affordance being named is on the left already. |
| **Arrow / tail** | **Absent** | The chip has no pointer. Its meaning comes entirely from proximity. |
| **Tap target** | **Absent** | The chip is not a control. |

## Sizes

| Size | Minimum height | Use for |
| --- | --- | --- |
| `default` | 32 | **The default.** Navigation-rail destinations and anything at standard density. |
| `small` | 28 | Denser layouts where 32 crowds the surrounding rhythm. |

Both sizes use the same 16 × 6 padding, the same 12 radius, the same 14pt label, and the same 16pt trailing icon. **The size axis changes one number: the minimum height.** It does not compress the text, the padding, or the glyph.

Because both heights are minimums, a chip whose content is taller than 32 (or 28) simply grows. So the two sizes only differ in appearance while the label fits inside them, which at 14pt and 6pt padding it normally does. **Pick `default` unless a specific dense layout demands otherwise**, and never mix the two in one navigation surface.

## Variants

Two tones.

| Tone | Fill | Foreground | Use for |
| --- | --- | --- | --- |
| `surface` | `surfaceBright` | `onSurface` | **The default.** A bright chip over the app's own surfaces. |
| `inverse` | `inverseSurface` | `onInverseSurface` | Higher contrast over a light surface — the "Open guide" hint over the collapsed guided action panel. |

### `inverse` — a dark chip, and it ignores `offline`

The `inverse` tone flips to a dark fill with a light foreground, for cases where a bright chip on a bright surface has no separation. Both tones compute comfortably above the text-contrast floor (see [Accessibility](#accessibility)).

**`inverse` silently ignores the `offline` modifier.** The foreground resolution checks the tone first, so `inverse` plus `offline` renders identically to `inverse` alone — no muting, no warning, no assert. An inverse chip therefore cannot express "unavailable" at all. If a destination can be offline, use the `surface` tone. See [Open Items](#open-items) item 2.

**`inverse` is also the [[Tooltip]]'s colouring.** An inverse peek label and a tooltip are both dark floating chips; what still distinguishes them is size (32/28 vs 24), type (14 vs 12), radius, elevation, and — the part that matters — whether the string is a name or an explanation. This is the single easiest pair in the system to confuse. Prefer `surface` unless contrast forces the change, precisely so that the two components stay visually distinct.

## Modifiers

Two flags cut across both tones and both sizes.

### `offline`

Renders the label and trailing icon in the muted `outline` colour, meaning "this affordance is currently unavailable." It matches the Figma `state=Offline` cells.

**The muted colour fails text contrast badly** — roughly **2.0 : 1** in light mode and **1.7 : 1** in dark, against the 4.5 : 1 floor. It does not even reach the 3 : 1 non-text floor. An offline chip is legible only to a reader with good vision on a good display, which makes it unusable as the *only* signal that a destination is unavailable.

Two rules follow:

1. **`offline` is a garnish, never the message.** The affordance itself must communicate unavailability — through its own disabled treatment per [[States]], and through its accessible name or state, which the chip has no part in.
2. **Never use `offline` with the `inverse` tone.** It is silently dropped.

See [Open Items](#open-items) item 1.

### `trailingIcon`

An optional 16 × 16 glyph after the label, 4pt away, in the label's colour. It exists to add a small qualifier to a name — a padlock for a secured destination, a sign-out arrow for one that leaves the app.

- The icon **inherits the label's colour**, including the muted offline colour. It is not independently colourable.
- It is 16 × 16, which is smaller than the icon sizes in [[Icons]] for interactive glyphs — correct here, because it is decorative.
- **It must never be the only carrier of meaning.** It has no semantics of its own and the chip has none either, so the glyph is invisible to assistive technology. If the padlock means something, the name must say it.
- **It is not a control.** A trailing icon in a chip that is not tappable looks like an affordance and is not one. Use it for qualification, never for action.

## States

The peek label has **no states of its own**. It is not focusable, hoverable, pressable, or disable-able, and it renders no state layer. [[States]] does not apply to the chip.

It does have one appearance flag — `offline` — and that flag reflects the *affordance's* state, not the chip's. The chip is a readout.

**The chip's visibility is the caller's state.** Whether the label is shown at all, and on what trigger, is decided outside the component: the [[Navigation Rail]] shows it on hover, and on keyboard focus — but only when the last input was genuinely a key press, so a focus merely *restored* after a menu closes does not surface it. That gating is the rail's, not the chip's. There is no built-in show/hide, no delay, no fade, and no dismissal. See [Placement](#placement) and [Open Items](#open-items) item 8.

No high-contrast branch. See [Open Items](#open-items) item 9.

## Behaviors

- **The chip is purely presentational.** It does not place itself, does not react to pointer events, does not observe hover, and does not participate in an overlay. It draws a chip wherever it is put in the tree. Everything else is the caller's.
- **There is no maximum width, and this is deliberate.** The implementation documents the reason: the chip is rendered in an overlay with unbounded width, so its row grows horizontally to fit whatever label it is given. There is no wrapping, no ellipsis, and no clamp. **A long label runs off the edge of the screen.** Keep labels to one or two words; the component's own showcase says as much and routes longer copy to [[Tooltip]].
- **Height is a minimum, not a fixed value**, so platform text scaling grows the chip rather than clipping it. This is the correct treatment and matches the system's rule against fixed heights around text.
- **Text scale therefore grows the chip in both directions** — taller from the minimum, and wider because there is no cap. At large text scales a two-word label can exceed the viewport. Whoever positions the chip must handle the case; the chip will not.
- **No animation.** No entry, exit, or fade. If the chip should fade in on hover, the caller animates it.
- **No arrow, tail, or connector.** The association between chip and affordance is conveyed by proximity alone — which is why the gap between them matters. See [Placement](#placement).
- **The chip does not clip its own shadow.** It is drawn transparently over whatever is behind it, so it composites correctly over scrolling content.

## Placement

The component draws; the caller positions. The reference pattern, used by the [[Navigation Rail]], is an overlay portal anchored to the affordance with a follower — the same pattern [[Tooltip]] documents and for the same reason.

Four placement rules:

- **Immediately to the right of the affordance, vertically centred, with an 8pt gap.** That is the composition the showcase demonstrates against a 52 × 52 icon footprint, and it mirrors what the [[Navigation Rail]] does — the 52 × 52 and the 8pt are the rail's slot geometry, declared there.
- **Never overlapping the affordance it names.** The chip's whole job is to sit beside the icon and be read alongside it. Covering the icon removes the thing the name is attached to.
- **Never between two affordances such that it is ambiguous which one it names.** With no arrow, proximity is the only cue; a chip equidistant from two icons names neither.
- **Clamp to the viewport, or place the chip on the opposite side.** The chip has no width cap and does not know where the screen edge is. Rightward is safe in the [[Navigation Rail]], because the rail is left-docked at every tier and the chip grows into the content region — but an affordance near the right edge of the window needs the chip on its left. Positioning logic that assumes the right side unconditionally will push labels off-screen. Note that there is no such thing as a right-hand rail: [[Navigation Rail]] forbids it outright.

The chip does not participate in dismissal, focus trapping, or barrier handling — it is not a surface in that sense. If your floating thing needs to be dismissed, focused, or interacted with, you want [[Popover]].

## Content

The chip carries a **name**, not a description.

- **One or two words.** "Home." "Notifications." "Identity monitoring." There is no width cap, so length is a discipline, not a constraint.
- **Use the destination's own name, verbatim.** The chip should match the label the destination has everywhere else in the product — in the topbar heading, in the [[Menu]], in analytics. A chip that paraphrases teaches the user a second name for one thing.
- **Never a sentence, never a full stop.** A sentence belongs in a [[Tooltip]].
- **Never an explanation, an instruction, or a benefit.** "Identity monitoring" — not "Check whether your accounts have leaked."
- **Never truncate by hand with an ellipsis.** If the name is too long for the rail, the name is wrong for the rail; shorten it at the source.
- **Sentence case, matching the destination.** Do not upper-case for emphasis — that is [[Badges]]' vocabulary and reads as a severity chip.

The chip's label duplicates, by design, the accessible name of the affordance beside it. That is the whole reason it has no semantics — see [Accessibility](#accessibility).

## Decision Tree

```
Is the floating thing a NAME, or something ABOUT the thing?
├── Something about it — an explanation, a caveat, a value ──→ use [[Tooltip]]
├── It contains a control, a link, or focusable content ─────→ use [[Popover]]
├── It is a transient system message ───────────────────────→ use [[Snackbar]]
└── It is the affordance's own name
    │
    ├── Is the affordance in a [[Navigation Rail]] or a collapsed panel handle?
    │   ├── No ──────────────────────────────────────────────→ use [[Tooltip]]
    │   │                                                       The peek label is
    │   │                                                       navigation-surface
    │   │                                                       furniture.
    │   └── Yes
    │       │
    │       ├── Is the name longer than two words? ──────────→ shorten it, or use
    │       │                                                   [[Tooltip]]. There is
    │       │                                                   NO width cap.
    │       │
    │       └── Which tone?
    │           ├── Default ─────────────────────────────────→ surface
    │           └── Bright chip has no separation from the
    │               surface behind it ───────────────────────→ inverse
    │                                                          (NEVER with offline —
    │                                                           silently ignored)
    │
    └── Which size?
        ├── Standard density ────────────────────────────────→ default (32)
        └── A specific dense layout ─────────────────────────→ small (28)
```

## Accessibility

The peek label emits **no semantics at all** — no role, no name, no live region, not even a container node. It is a decorated box with text in it, and its text *is* visible to assistive technology as raw text unless the caller excludes it.

**This is the right default, and it is also the component's sharpest trap.**

It is right because the chip repeats a name that already exists: the icon-only affordance it labels must carry that name itself, or it is broken regardless of any chip. Announcing the chip too would make a screen-reader user hear "Notifications, Notifications."

It is a trap because nothing enforces the premise. If the affordance has no accessible name, the peek label does not supply one — it supplies a *visual* name only, and the affordance stays unlabelled for everyone who cannot see it. **A peek label is never the fix for an unnamed icon button.**

| Requirement | Status | Notes |
| --- | --- | --- |
| Accessible name | **N/A for the chip** | The affordance must carry it. The chip has no `semanticLabel` parameter. |
| Chip excluded from AT | **Not handled** | The chip has no `ExcludeSemantics`. Its text is in the tree and may be read as a stray string beside the affordance's own name. |
| Text contrast (WCAG 1.4.3, 4.5 : 1) | **Passes, except `offline`** | See the table below. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Chip vs surface not measured** | The chip is separated from what it floats over by the shadow only. |
| Touch target 48 × 48 | **N/A** | Not a control. |
| Keyboard reachable | **No, by design** | Correct — it is not a tab stop. |
| Focus-triggered display | **Caller's job** | Not built in. A hover-only trigger excludes keyboard users. |
| Reduced motion | **N/A** | No animation. |
| High contrast | **Not handled** | No branch. |

**Computed contrast** — derived from the light and dark token values, not measured on a device:

| Combination | Light | Dark | Verdict |
| --- | --- | --- | --- |
| `surface` tone — `onSurface` on `surfaceBright` | 15.93 : 1 | 10.40 : 1 | Passes comfortably |
| `inverse` tone — `onInverseSurface` on `inverseSurface` | 12.13 : 1 | 11.73 : 1 | Passes comfortably |
| `surface` + `offline` — `outline` on `surfaceBright` | **2.00 : 1** | **1.72 : 1** | **Fails 4.5 : 1 and fails 3 : 1** |

Four obligations the component cannot discharge for you:

1. **Name the affordance itself.** The icon button, rail destination, or panel handle carries the accessible name. The chip is a sighted-user convenience layered on top.
2. **Show the chip on keyboard focus, not only on hover.** A hover-only trigger means a keyboard user tabbing through a rail of icons gets no names at all. The component has no trigger of its own, so this is entirely on the caller — and it is the most likely thing to be missed.
3. **Exclude the chip from the semantics tree, or confirm it is harmless.** The chip's text is not suppressed. Layered over an affordance that is correctly named, a screen reader can encounter both. Wrap it in an exclusion at the call site.
4. **Never rely on `offline` to convey unavailability.** At 2.0 : 1 it is close to invisible, and it is dropped entirely on the `inverse` tone. The affordance's own disabled state and accessible state must carry it.

## Anti-Patterns

**❌ Using a peek label to name an icon button that has no accessible name.** The chip supplies a visual name only; the button stays unlabelled for anyone who cannot see it. → Name the button, then add the chip.

**❌ Showing the chip on hover only.** A keyboard user tabbing through an icon-only rail gets no names. → Trigger on focus as well as hover.

**❌ Putting a sentence in the chip.** There is no width cap — the chip grows until it leaves the screen. → Use [[Tooltip]] for anything longer than a name.

**❌ Truncating a long name with a hand-written ellipsis.** The name is wrong for the rail, not too long for the chip. → Shorten the name at its source.

**❌ Combining `offline` with the `inverse` tone.** The flag is silently dropped and the chip renders as if online. → Use the `surface` tone when a destination can be offline.

**❌ Relying on `offline` to say "unavailable."** It computes to 2.0 : 1 light and 1.7 : 1 dark. → Put unavailability in the affordance's own disabled state and accessible state.

**❌ Putting a control, link, or anything focusable inside or beside the chip.** The chip is presentational and unfocusable; the control becomes keyboard-unreachable. → Use [[Popover]].

**❌ Making the chip itself tappable.** It has no target, no role, no name, and no focus. → The affordance beside it is the target.

**❌ Using `trailingIcon` as an action.** It looks like an affordance and is not one, and it has no semantics. → Use it to qualify a name, never to do something.

**❌ Letting `trailingIcon` carry meaning the label omits.** The glyph is invisible to assistive technology. → Say it in the name.

**❌ Using the chip outside a navigation surface.** It is styled as rail furniture — bright, shadowed, 14pt. Over arbitrary content it reads as a stray card. → Use [[Tooltip]].

**❌ Overlapping the affordance it names.** With no arrow, proximity is the only association cue, and covering the icon removes the referent. → 8pt to the side, vertically centred.

**❌ Assuming the chip goes on the right.** It has no width cap and no viewport awareness. On a right-hand rail it must go left. → Clamp or flip at the call site.

**❌ Upper-casing the label for emphasis.** Upper-case mono is [[Badges]]' vocabulary and reads as severity. → Sentence case, matching the destination.

**❌ Mixing `default` and `small` in one navigation surface.** Two chip heights in one rail reads as a bug. → Pick one.

---

## Flutter Usage

`AsmPeekLabel` in `lib/asm/components/peek_label.dart`, exported from `assemble.dart`. Used in-repo by `navigation_rail.dart` and `guided_action_panel.dart`.

### Enums

```dart
enum AsmPeekLabelSize { defaultSize, small }   // 32 / 28 minimum height
enum AsmPeekLabelTone { surface, inverse }
```

Note the enum value is `defaultSize`, not `default` — `default` is a reserved word. The default value of the `size` parameter is `AsmPeekLabelSize.defaultSize`.

### Basic usage

```dart
const AsmPeekLabel(text: 'Notifications')
```

`text` is the destination's name. There is no `semanticLabel` and no `automationIdentifier`.

### The compact size

```dart
const AsmPeekLabel(
  text: 'Home',
  size: AsmPeekLabelSize.small,
)
```

### The inverse tone

```dart
const AsmPeekLabel(
  text: 'Open guide',
  tone: AsmPeekLabelTone.inverse,
)
```

Use this only when a bright chip has no separation from the surface behind it. Do not combine it with `offline`.

### A trailing qualifier

```dart
const AsmPeekLabel(
  text: 'Secure vault',
  trailingIcon: Icons.lock_outline,
)
```

The glyph takes the label's colour and has no semantics. Everything it means must also be in `text`.

### The unavailable state

```dart
const AsmPeekLabel(
  text: 'VPN',
  trailingIcon: Icons.lock_outline,
  offline: true,
)
```

Correct only on the `surface` tone, and only alongside a genuinely disabled affordance that carries its own disabled state per [[States]].

### Positioning it — the reference pattern

The chip does not place itself. This is the pattern the [[Navigation Rail]] uses and the pattern [[Tooltip]] documents:

```dart
class _RailDestination extends StatefulWidget {
  const _RailDestination({required this.icon, required this.label, required this.onPressed});

  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  @override
  State<_RailDestination> createState() => _RailDestinationState();
}

class _RailDestinationState extends State<_RailDestination> {
  final _link = LayerLink();
  final _portal = OverlayPortalController();

  void _setVisible(bool visible) => visible ? _portal.show() : _portal.hide();

  @override
  Widget build(BuildContext context) {
    return FocusableActionDetector(
      // Focus AND hover — a hover-only trigger hides every name
      // from keyboard users.
      onShowHoverHighlight: _setVisible,
      onShowFocusHighlight: _setVisible,
      child: CompositedTransformTarget(
        link: _link,
        child: OverlayPortal(
          controller: _portal,
          overlayChildBuilder: (_) => CompositedTransformFollower(
            link: _link,
            targetAnchor: Alignment.centerRight,
            followerAnchor: Alignment.centerLeft,
            offset: const Offset(8, 0), // the 8pt gap
            child: ExcludeSemantics(
              child: AsmPeekLabel(text: widget.label),
            ),
          ),
          child: IconButton(
            icon: Icon(widget.icon),
            tooltip: null,
            onPressed: widget.onPressed,
            // The name lives HERE, not on the chip.
            ),
        ),
      ),
    );
  }
}
```

Three things in that snippet are load-bearing and easy to drop:

- `onShowFocusHighlight` as well as `onShowHoverHighlight` — otherwise the rail is nameless for keyboard users.
- `ExcludeSemantics` around the chip — otherwise the name is in the tree twice.
- The accessible name on the **button**, not the chip.

### Full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `text` | `String` | **Yes** | — ; **not asserted non-empty** |
| `size` | `AsmPeekLabelSize` | No | `AsmPeekLabelSize.defaultSize` (32 minimum) |
| `tone` | `AsmPeekLabelTone` | No | `AsmPeekLabelTone.surface` |
| `trailingIcon` | `IconData?` | No | `null` |
| `offline` | `bool` | No | `false` — **ignored when `tone` is `inverse`** |

There is **no `semanticLabel`, no `automationIdentifier`, no `maxWidth`, no `onTap`, and no override for the fill, radius, padding, or shadow.**

### Tokens

| Property | Token | Value |
| --- | --- | --- |
| Radius | `cornerMedium` / `AsmCornerRadii.r12` | 12 |
| Horizontal padding | 16 (`AsmSpacingScale.s400`) | 16 |
| Vertical padding | hardcoded `6` — **off the 4pt scale** | 6 |
| Minimum height | `defaultSize` 32 / `small` 28 | 32 / 28 |
| Shadow | elevation-5: zero offset, blur 20, in `colorScheme.shadow` | `#308E8E8E` light / `#33000000` dark |
| Label | `labelLarge` — 14pt regular, see [[Typography]] | — |
| Trailing icon | 16 × 16, gap `spacing100` | 16 / 4 |
| `surface` fill | `surfaceBright` | `#FFFFFF` / `#2D2929` |
| `surface` foreground | `onSurface` | `#252121` / `#DCDBDB` |
| `inverse` fill | `inverseSurface` | `#322D2D` / `#DCDBDB` |
| `inverse` foreground | `onInverseSurface` | `#F3F2F2` / `#222020` |
| `offline` foreground | `outline` | `#BCB6B6` / `#544C4C` |

The chip is wrapped in a transparent material so its shadow composites over whatever is behind it rather than over an opaque backing.

### Guidance

- **Trigger on focus as well as hover.** The component has no trigger; a hover-only call site makes an entire icon rail nameless for keyboard users. This is the single most likely defect.
- **Wrap the chip in `ExcludeSemantics` at the call site.** Its text is not suppressed and will otherwise appear beside the affordance's own name.
- **Put the accessible name on the affordance**, never on the chip — it has no parameter for one.
- **Constrain or clamp position yourself.** There is no `maxWidth` and the chip does not know where the viewport edge is. On a right-hand rail, flip to the left.
- **Never pass `offline: true` with `tone: AsmPeekLabelTone.inverse`.** It is silently dropped.
- **`text` is not asserted non-empty.** An empty string renders a 32 × 32 empty chip with a shadow. Guard at the call site.
- **Do not wrap the chip in `GestureDetector` or `InkWell`.** If the chip needs to be pressed, the design is wrong.
- **Do not put the chip in a fixed-height box.** 32 and 28 are minimums so the chip can grow with text scale.
- **Reach for `AsmTooltip` when the string is an explanation**, and for `AsmPopover` when the floating surface contains anything focusable.

---

## Rules

1. The chip MUST carry a **name**, never an explanation. Explanations belong in [[Tooltip]].
2. The affordance the chip names MUST carry its own accessible name. A peek label is NEVER the fix for an unnamed icon button.
3. The chip MUST be shown on keyboard focus as well as hover.
4. The chip MUST be excluded from the semantics tree at the call site; its text is not suppressed.
5. `offline` MUST NEVER be combined with `tone: inverse` — the flag is silently ignored.
6. `offline` MUST NEVER be the only signal that an affordance is unavailable. It computes to 2.0 : 1 in light mode and 1.7 : 1 in dark.
7. Labels MUST be one or two words. There is NO maximum width — a long label runs off-screen.
8. The label MUST match the destination's name everywhere else in the product, verbatim.
9. The label MUST be sentence case. NEVER upper-case it; upper-case mono is [[Badges]]' vocabulary.
10. The chip MUST NOT be truncated by hand with an ellipsis. Shorten the name at its source.
11. The chip MUST NOT be made tappable, focusable, or given a state layer.
12. Nothing focusable MUST be placed inside or beside the chip. Use [[Popover]].
13. `trailingIcon` MUST be a qualifier, never an action, and MUST NOT carry meaning the label omits — it has no semantics.
14. The chip MUST sit beside the affordance it names, 8pt away and vertically centred, and MUST NEVER overlap it or sit ambiguously between two affordances.
15. Position MUST be clamped to the viewport by the caller. The chip has no width cap and no viewport awareness.
16. The chip MUST NOT be used outside a navigation surface. Elsewhere, use [[Tooltip]].
17. `default` and `small` MUST NOT be mixed within one navigation surface.
18. The chip MUST NOT be placed in a fixed-height container. Its heights are minimums.
19. `text` MUST be guarded non-empty at the call site — the constructor does not assert it.

---

## Open Items

1. **The `offline` foreground fails text contrast in both themes.** `outline` on `surfaceBright` computes to **2.00 : 1** in light and **1.72 : 1** in dark, against the 4.5 : 1 floor in WCAG 1.4.3 — and below even the 3 : 1 non-text floor. It is drawn from the Figma `state=Offline` cells, so the design source and the implementation agree; they are simply both below the threshold. The state needs a darker muted token or a non-colour signal.
2. **`offline` is silently ignored when `tone` is `inverse`.** The foreground resolution tests the tone first, so an inverse chip cannot express unavailability at all. There is no assert, no debug warning, and no note in the parameter's documentation. Either the inverse tone needs its own muted value or the combination should assert.
3. **The 6pt vertical padding is off the 4pt spacing scale.** The implementation acknowledges this and promotes the value to a named constant rather than reading a token, because no token exists. Every other inset in the chip — the 16 horizontal, the 4 icon gap — comes from the scale. Either the scale needs a 6, or the Figma frame needs to move to 4 or 8.
4. **The implementation documents the wrong hex for the offline colour.** It cites `outline` as `#9b9292`; the light-theme token is `#BCB6B6`. A reader computing contrast from the documented value gets a different answer than the shipped one — and both fail, so the error hides rather than causes the defect.
5. **The chip has no `semanticLabel` and no `ExcludeSemantics`, so the correct behaviour is unenforceable.** The right outcome — chip visually present, absent from the semantics tree, affordance correctly named — depends entirely on the caller wrapping it. Nothing in the component makes that the default, and the in-repo call sites are the only examples. A built-in exclusion would make the correct case free and the incorrect case impossible.
6. **No `automationIdentifier`.** The chip cannot be located by an automated test, so there is no way to assert "hovering destination 3 reveals its name" without matching on text, which couples the test to localisation. [[Expanded Card]] makes the identifier required; this component does not have one at all.
7. **`text` is not asserted non-empty**, unlike [[Tooltip]]'s `message` and unlike `AsmCarouselIndicator`'s `semanticLabel`. An empty string renders a 32 × 32 shadowed blank. The assert convention is applied inconsistently across the folder.
8. **There is no trigger, delay, or dismissal, and no documented convention for them.** [[Tooltip]] has the same gap and records it. Every call site invents its own hover/focus handling, its own delay (or none), and its own fade (or none), which means two navigation surfaces in the same product can reveal their labels at different speeds. The reference pattern lives only in `navigation_rail.dart`.
9. **No high-contrast branch.** The chip's separation from the surface behind it is the elevation-5 shadow, and a forced-colours theme that suppresses shadows leaves a bright chip on a bright surface with nothing between them. The `offline` state — already at 2.0 : 1 — is not remapped either.
10. **The unbounded width is documented as deliberate but has no guard.** The reasoning is sound for the reference use: an overlay gives unbounded width so the row hugs its text. The consequence is that a long label, or a normal label at a large text scale, extends past the viewport with no wrap, no ellipsis, and no assert. The two-word discipline is a design rule with nothing enforcing it.
11. **The size axis changes one value and both values are minimums**, so `default` and `small` are visually identical for any content taller than 28. The distinction survives only while the label fits, which makes it the weakest size axis in the folder — arguably one size with a caller-supplied constraint would be more honest.
12. **`inverse` and [[Tooltip]] are the same colouring.** An inverse peek label and a tooltip are both dark floating chips over app content, differing only in height, type size, radius, and elevation. Nothing in either component's code or documentation flags the collision. Recorded from the other side as [[Tooltip]] open item 16, which also notes that the two components were not cross-referenced — this doc closes that half of it.
13. **The implementation cites a rule file that does not exist in this checkout.** `peek_label.dart` justifies its minimum-height treatment by citing a numbered accessibility rule file; only the release rule file is present. The reasoning is correct and worth keeping, but the citation cannot be followed. The same stale citations appear in `expanded_card.dart` — see [[Expanded Card]] open items.
14. **No Figma node id.** The component cites the `peek-label` frame and its `size` / `state` variant names but no node, so the 6pt vertical padding, the 8pt placement gap, and the 52 × 52 affordance footprint in the showcase cannot be re-measured against a specific frame.
15. **The 52 × 52 icon footprint the showcase pairs the chip with is owned by a different component, and the showcase does not say so.** In the story it is an illustrative box with no source; in production it is the [[Navigation Rail]] slot, which fixes 52 × 52 and the 8pt gap and is now documented there. It is deliberately larger than the 48 [[Icons]] requires, which is fine for the touch target — but it means this chip's placement gap and vertical centring are calibrated against a number another component declares and this one cannot see. If the rail's slot extent changes, the chip's geometry is wrong and nothing connects the two; [[Navigation Rail]] open item 17 records the same problem for the rail's own 60pt width.
