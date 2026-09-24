# Component: Tooltip

> Role: A small dark bubble that names or briefly describes the element the pointer is resting on. It carries one short string and nothing else — no heading, no link, no action.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A tooltip MUST NEVER be the only place information appears. It is invisible until hovered, unreachable without a pointer on many touch surfaces, and gone the moment the pointer leaves — anything the user actually needs MUST be on the surface itself.
> Source: Figma `Components` → `tooltip` (set `12:1464`, in container `4066-9878`; types `12:1465` Single line, `12:1467` Multi line, `11549:7228` Contextual). Implementation: `pegasus_flutter/lib/asm/components/tooltip.dart`.

## Overview

A tooltip answers "what is this?" for an element that could not say so itself. Its canonical use is the icon-only control: a toolbar of glyphs is unreadable to anyone who has not learned the icon set, and a tooltip supplies the missing word without spending layout on it.

**The distinction most often got wrong is tooltip versus label.** A tooltip is a *substitute* for a label only when there is genuinely no room for one — and "no room" means an icon-only control in a dense bar, not a form that would look tidier without its field labels. If the information is needed to complete a task, it is a label, supporting text, or body copy. If it is needed to *identify a control the user is already pointing at*, it is a tooltip.

**The second distinction is tooltip versus [[Popover]].** The dividing line is interactivity, not size. A tooltip holds one string, cannot be focused, cannot be scrolled, and contains nothing the user can press. A popover holds structured content and typically an action or a link. **Anything interactive inside a floating surface makes it a popover** — because a tooltip vanishes when the pointer leaves, so a link inside one is a link the user cannot travel to.

**The third distinction is tooltip versus [[Peek Label]].** Both are small floating strings attached to an icon-only affordance, and they are separate components. The peek label is a *bright* chip with a shadow, at 14pt, sized for [[Navigation Rail]] destinations; the tooltip is a *dark* bubble at 12pt, for arbitrary controls. The peek label reads as part of the navigation surface; the tooltip reads as an annotation floating over the app. Use the peek label in the [[Navigation Rail]] and the tooltip everywhere else — and use the tooltip, not the peek label, for anything longer than a couple of words, because the peek label has no maximum width and will not wrap.

## Anatomy

One dark bubble containing one string. There is no header, no icon, and — in the two plain types — no tail.

```
┌──────────────────────┐
│  Supporting text     │   single line — shrinks to fit
└──────────────────────┘

┌────────────────────┐
│  Supporting text    │  multi line — fixed 200 wide,
│  that wraps across  │  wraps as needed
│  several lines      │
└────────────────────┘

  ┌──────────────────────────────┐
 ◄│  Supporting text          ✕  │   contextual — bold text,
  └──────────────────────────────┘   a tail, and a close ✕
  ↑                            ↑
 tail (points at the anchor)  dismiss
```

| Part | Required | Notes |
| --- | --- | --- |
| Bubble | Yes | Inverse surface fill, radius 4, minimum height 24. No border, no shadow. |
| Message | Yes | One short string. 12pt on the inverse foreground. Never empty. |
| Tail | `contextual` only | 16×16 triangle on the leading edge, pointing at the anchor. The plain types have none. |
| Close affordance | `contextual` only | 16×16 ✕. **Interactive** — which is what separates this type from the other two. |

The bubble has no room for a second line of hierarchy. A tooltip that needs a title and a body is a [[Popover]].

## Sizes

| Measurement | `single line` | `multi line` | `contextual` |
| --- | --- | --- | --- |
| Width | Hugs the text | **Fixed 200** | **Fixed 235** |
| Minimum height | 24 | 24 | 32 |
| Horizontal padding | 8 | 8 | 8 |
| Vertical padding | 4 | 4 | 8 |
| Corner radius | 4 | 4 | 4 |
| Gap, text to ✕ | — | — | 10 |
| Text | 12pt / 400 / line-height 1.3 | same | **12pt / 700** |
| Wraps | No | Yes | No |

Sources: Figma `md/spacing/200` (8), `md/spacing/100` (4), `md/border/radius/4` (4), `body/small` and `body/small-emphasized`, and the symbol bounds for the two fixed widths.

**The 200 and the 235 are hardcoded in the design.** Neither resolves to a token — there is no 200 or 235 on the [[Spacing]] scale — and the 10 gap in the contextual type is off-scale too, sitting between 8 and 12. Figma's own note on the multi-line type says "width can be variable based on content", which contradicts the fixed 200 the symbol actually carries. See [Open Items](#open-items).

**Height is a minimum, not a fixed value.** The bubble grows to fit its text, which is what makes it survive an enlarged OS text scale instead of clipping.

## Variants

| Type | Interactive | Width | Weight | Tail | Use for |
| --- | --- | --- | --- | --- | --- |
| `single line` | No | Hugs text | Regular | No | The default. Naming an icon-only control. |
| `multi line` | No | 200, wraps | Regular | No | A short explanation that will not fit on one line. |
| `contextual` | **Yes — a ✕** | 235 | **Bold** | Yes | A persistent annotation the user dismisses. **Not implemented — see [Open Items](#open-items).** |

### `single line` — the one to reach for

Shrinks to its content, does not wrap, and stays on one line however long the string is. That is the constraint that makes it correct for its job: it cannot hold a sentence, so it will not be used for one. If the string does not fit on a line, that is the signal to shorten it, not to switch types.

### `multi line` — a fixed 200-wide block

Wraps its text inside a fixed width, which makes it the type for a phrase rather than a word. Two cautions:

- **A 200-wide bubble is 3–4 words per line.** Six lines of wrapped text in a bubble that disappears on pointer-out is not a readable explanation; it is a [[Popover]] or body copy on the page.
- **It is 200 wide even when the message is two words**, so a short message in this type is a mostly-empty bubble. Use `single line` for anything that fits on one.

### `contextual` — a different component wearing the same skin

This type has a tail, bold text, and a close button, and none of those are cosmetic differences. **A close button makes it dismissible, which makes it persistent, which makes it not a tooltip.** A hover-triggered bubble needs no dismiss affordance — moving the pointer is the dismissal. So `contextual` is really a small persistent callout: it is shown by the app rather than by the pointer, it stays until the user closes it, and its ✕ must be reachable by keyboard.

It is also **the only type with a tail**, which is what a persistent surface needs and a hover-triggered one does not — the pointer is already pointing at the anchor.

Treat it as a distinct component that happens to share the bubble. If you need what it does, check whether an [[Alert Banner]] (persistent, in-flow, dismissible) or a [[Popover]] (anchored, focusable, dismissible) is the honest answer, because those exist and this type does not.

## States

Follows [[States]], and diverges by having almost none. The tooltip has **no hover, no focus, no pressed, and no disabled state** — it is not a control, it is an annotation, and it is only on screen at all because something else is being hovered.

| State | Treatment |
| --- | --- |
| Hidden | The default. No space is reserved for it. |
| Shown | Fades in. No entrance movement, no scale. |
| `contextual`'s ✕ | The one interactive element in the component. It needs the full control treatment — hover, focus ring, keyboard activation. Not drawn in Figma. |

**The bubble itself must never react to the pointer.** A tooltip that highlights on hover promises something to press. The one thing hovering the bubble may do is keep it open, which is a timing behaviour rather than a visual state — see [Timing](#timing).

## Placement

The tooltip is positioned relative to the element that triggered it, and placement is the trigger's responsibility, not something the bubble knows about.

| Requirement | Rule |
| --- | --- |
| Preferred side | Below the anchor. Tooltips read as annotations hanging off the thing they describe. |
| Flip | When there is no room below, flip above. |
| Shift | When centring on the anchor would overflow the frame, shift along the axis back inside. |
| Never covers its anchor | The user is pointing at the anchor. Covering it hides the thing being explained and, on touch, puts the bubble under the finger. |
| Offset from the anchor | A clear gap, so the bubble reads as separate from the control rather than as part of it. |
| Follows the anchor, or closes | If the anchor scrolls or the layout reflows, the bubble moves with it or disappears. It must never be left pointing at nothing. |
| Frame inset | A minimum margin from every frame edge is preserved. |

**Only the `contextual` type has a tail, and its tail is drawn on the leading edge** — that type opens to the *side* of its anchor, not below it. The plain types have no tail, so nothing in the bubble indicates which element it belongs to except proximity. That is why the gap and the "never covers its anchor" rule matter more here than they would with a tailed surface: proximity is the *only* association the user gets.

## Timing

Timing is the whole difference between a helpful tooltip and one that fights the user.

| Moment | Behaviour |
| --- | --- |
| Pointer arrives | A brief delay before showing. Not instant — a pointer crossing a toolbar would flash a bubble over every glyph on the way. |
| Pointer leaves | A brief delay before hiding, so moving between adjacent controls does not strobe. |
| Pointer enters the bubble | The bubble stays open. It must not vanish out from under the pointer. |
| Long press (touch) | Shows the bubble, which auto-hides after a couple of seconds. |
| Tap elsewhere | Hides. |
| Escape | Hides. A user who has opened a bubble needs a way to close it that does not require finding the pointer. |
| Reduced motion | The fade goes away; the bubble appears and disappears. Nothing depends on the animation. |

**The show delay is the setting most often got wrong in both directions.** Instant tooltips make a toolbar unusable — every pass of the mouse detonates a bubble. Slow ones never appear, because the user has already moved on. A short, consistent delay across the whole app is the requirement; a tooltip that appears at a different speed depending on which control it is attached to reads as a bug.

**On touch, a tooltip is nearly unreachable.** There is no hover, so the only trigger is a long press — a gesture most users will never attempt on an unlabelled icon, because nothing suggests it is available. This is the mechanism behind the banner rule: **on a touch device, information that lives only in a tooltip is information nobody has.**

## Behaviors

**The bubble never blocks.** The app behind it stays live and scrollable. Nothing is inert, nothing is trapped, and it does not take focus.

**One at a time.** Showing a tooltip dismisses any other. Two bubbles on screen simultaneously means one of them is stale.

**Text scale.** The bubble grows with the text because its height is a minimum. The fixed widths do not grow, so a `multi line` bubble at a large text scale is a tall narrow column — the type that degrades worst under scaling.

**No truncation.** `single line` never wraps and never ellipsizes, so an over-long message produces an over-long bubble that will run into the frame edge. Shorten the message; there is no graceful failure mode.

**It is not a mechanism for hiding complexity.** A screen that needs a tooltip on every control is a screen with a labelling problem. Tooltips are a supplement to a design that already works.

## Content

- **One short phrase — ideally one to three words.** "Delete", "Copy link", "Last scanned 3 days ago".
- **Name the action for an icon-only control**, in the same words the equivalent [[Button]] would use. "Delete", not "Trash can".
- **No punctuation on a fragment.** "Save changes", not "Save changes.".
- **Sentence case.** Not caps, not title case.
- **Never repeat visible text.** A tooltip on a button that already says "Save" is noise the user has to wait for.
- **Never put a keyboard shortcut in the tooltip and nowhere else.** It is fine as an addition to the name; it is not a place to publish the app's shortcuts.
- **Never explain a whole feature.** If it takes a paragraph, it belongs on the page.
- **Never hold a value the user needs to compare, copy, or read twice.** A number that only exists on hover cannot be checked against anything.
- **Never say "click here" or describe the pointer.** Name the outcome.

## Decision Tree

```
Does the floating content contain anything the user can press,
focus, scroll, or select?
├── yes ──────────────────────────────────→ use a [[Popover]]
│                                            (a tooltip disappears on
│                                             pointer-out, so a link in
│                                             one is unreachable)
└── no — it is one short read-only string
    │
    ├── Is the information needed to complete
    │   the task? ─────────────────────────→ put it on the surface:
    │                                        a label, supporting text
    │                                        (see [[Text Fields]]), or
    │                                        body copy
    │
    ├── Is it a message the user must read
    │   and act on? ───────────────────────→ use an [[Alert Banner]]
    │
    ├── Is it confirmation that something
    │   just happened? ────────────────────→ use a [[Snackbar]]
    │
    ├── Is it the name of a destination in a
    │   [[Navigation Rail]]? ──────────────→ use [[Peek Label]]
    │
    └── It names or briefly describes the
        control being pointed at
        ├── Fits on one line? ─────────────→ `single line`
        └── Needs a phrase that wraps? ────→ `multi line`
            (and reconsider — a wrapping
             tooltip is often page copy)

Do you need a bubble that persists until dismissed?
└── That is not a tooltip. ────────────────→ [[Alert Banner]] or [[Popover]]
```

## Accessibility

| Requirement | Rule |
| --- | --- |
| The message reaches assistive tech | Announced as the tooltip of the element it is attached to — as part of that control, not as loose floating text. |
| A tooltip is not a name | An icon-only control needs an accessible name of its own. The tooltip may supply it, but only where the two are wired together deliberately; a bubble with no relationship to the control names nothing. |
| Never the only source | Anything essential must be available without a pointer. This is the accessibility requirement, not a style preference. |
| Keyboard-triggerable | A keyboard user who focuses a control should be able to see the same information the mouse user gets on hover. |
| Dismissible | Escape hides it, without moving focus. |
| Does not obscure the anchor | Nor the content adjacent to it. |
| Persists on hover | The pointer must be able to enter the bubble without it vanishing. |
| Not focusable | The bubble is not in the tab order. `contextual`'s ✕ is the one exception, and it must be reachable. |
| Never carries the only copy of a value | It cannot be selected, copied, magnified, or read twice. |
| Touch | Only a long press produces it, and nothing advertises that. Do not rely on it on touch surfaces at all. |

**A tooltip is a supplement, and the ways it fails are structural.** It cannot be reached without a pointer or a deliberate keyboard affordance. It cannot be magnified independently. It cannot be re-read after it closes. It cannot be selected or copied. A user with a screen magnifier may have the bubble render outside their viewport entirely. None of these are fixable in the component — they are properties of a thing that only exists while being pointed at, which is why the content rules above are so restrictive.

**`contextual`'s ✕ is a 16×16 target**, far under the 48×48 floor, and Figma draws no focus or hover treatment for it. It is the same defect the [[Tags]] remove affordance has, in a type that is not implemented yet — which makes it the cheapest one in the system to fix, because nothing has shipped against it.

**Contrast:**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Message on the bubble, light theme | ~12.1:1 | Passes AAA |
| Message on the bubble, dark theme | ~11.7:1 | Passes AAA |
| Bubble against the page, light theme | ~13.1:1 | Passes |
| Bubble against the page, dark theme | ~11.7:1 | Passes |

Contrast is the one thing this component gets unambiguously right in both themes. The inverse-surface pairing is the highest-contrast combination in the system, and it is why the bubble reads instantly as an overlay rather than as part of the page.

## Anti-Patterns

**❌ Essential information in a tooltip.** Invisible until hovered, unreachable on touch, gone on pointer-out. → Put it on the surface.

**❌ A link or button inside the bubble.** The bubble disappears when the pointer leaves, so the user cannot travel to it. → [[Popover]].

**❌ A tooltip on a control that already has a visible label.** The user waits for a bubble that repeats what they just read. → Omit it.

**❌ A paragraph in a tooltip.** Six wrapped lines in a 200-wide bubble that vanishes is not an explanation. → Body copy, or a [[Popover]].

**❌ A tooltip instead of a field label.** The field is unnamed to anyone not hovering it, and unnamed to assistive tech. → A label — see [[Text Fields]].

**❌ Instant show on hover.** Crossing a toolbar detonates a bubble over every glyph. → A short, consistent delay.

**❌ A bubble that vanishes when the pointer moves onto it.** The user cannot read the thing they moved toward. → Keep it open while hovered.

**❌ A tooltip covering its own anchor.** The user loses the element they were asking about, and on touch the bubble is under their finger. → Flip and shift instead.

**❌ Relying on a tooltip on a touch surface.** Long press is undiscoverable on an unlabelled icon. → Label the control.

**❌ A value only available on hover.** It cannot be compared, copied, or re-read. → Put it in the layout.

**❌ Two tooltips at once.** One of them is stale. → Show one; dismiss the other.

**❌ A dismissible tooltip.** A close button means it persists, and a persistent bubble is not a tooltip. → [[Alert Banner]] or [[Popover]].

**❌ Using a tooltip as an error message.** It is transient, pointer-dependent, and unannounced as an error. → Error text on the field, or an [[Alert Banner]].

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. **There are two separate things here and they do not connect to each other:**

| Piece | Where | What it gives you |
| --- | --- | --- |
| `AsmTooltip` | `asm/components/tooltip.dart` (exported) | The Assemble-styled bubble, and *only* the bubble. No trigger, no timing, no placement, no overlay, no semantics. You position it yourself. |
| `Tooltip` | Flutter's Material library | The full trigger / timing / placement / semantics machinery — with Material's default grey styling, because no theme overrides it. |

**Every non-story tooltip in the repository uses Flutter's `Tooltip`, not `AsmTooltip`.** `AsmButton`, `AsmIconButton`'s bar variants, the system app bar, and both topbars all take a `tooltip` string and pass it to Material. `AsmTooltip` has no consumers outside its own Widgetbook story. So the bubble that actually appears in a McAfee product today is Material's, not the one documented above — see [Open Items](#open-items).

### Enums

```dart
enum AsmTooltipType { singleLine, multiLine }   // default: singleLine
```

Figma's third type, `Contextual`, has no counterpart.

### Attaching a tooltip to a control

The components that support tooltips take a string, not a widget:

```dart
AsmButton(
  label: 'Save',
  tooltip: 'Save changes to this device',
  automationIdentifier: 'save-button',
  onPressed: _save,
)
```

```dart
AsmIconButton(
  icon: const Icon(Icons.close),
  tooltip: 'Close',
  semanticLabel: 'Close',
  automationIdentifier: 'close-icon-button',
  onPressed: _close,
)
```

This is the path to use. It gets the trigger, the delays, the placement, the flip-and-shift, and the platform semantics — all from Material.

### Rendering the styled bubble directly

```dart
const AsmTooltip(message: 'Save changes')
```

```dart
const AsmTooltip(
  message: 'Runs a full scan of every drive on this device.',
  type: AsmTooltipType.multiLine,
)
```

`message` is required and asserted non-empty. `AsmTooltip` is purely presentational: it renders a bubble wherever you put it in the tree. Making it behave like a tooltip is entirely on the caller — an `OverlayPortal` plus a `CompositedTransformFollower` for placement (the pattern `AsmPeekLabel` documents — see [[Peek Label]]), a `MouseRegion` for the trigger, timers for the delays, and a `Semantics(tooltip:)` on the anchor so the message is announced. **That is the whole reason nothing uses it.**

### Parameters

`AsmTooltip`:

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `message` | `String` | **Yes** | — (asserted non-empty) |
| `type` | `AsmTooltipType` | No | `singleLine` |

There is no `automationIdentifier` — correct for a non-interactive presentational widget.

### What Material's defaults actually give you

Because no `tooltipTheme` is set on the Assemble theme, every `Tooltip` in the app renders with Flutter's built-in values:

| Property | Material default | Assemble spec |
| --- | --- | --- |
| Fill | Grey at 90% opacity | `inverseSurface` |
| Foreground | White (light theme) | `inverseOnSurface` |
| Radius | 4 | 4 ✓ |
| Font size | 12 on desktop, **14 on mobile** | 12 |
| Padding | 8 / 4 on desktop, **16 / 4 on mobile** | 8 / 4 |
| Minimum height | 24 on desktop, **32 on mobile** | 24 |
| Show delay on hover | **None — instant** | A short delay |
| Hide delay after touch | ~1.5s | Unspecified |
| Hide delay after pointer-out | ~0.1s | Unspecified |
| Touch trigger | Long press | Long press ✓ |
| Vertical offset | 24 | Unspecified |
| Preferred side | Below, flips above | Below ✓ |
| Frame margin | **Zero** — may touch the frame edge | A minimum inset |
| Keyboard trigger | **None** | Required |
| Escape to dismiss | **None** | Required |

The radius, the touch trigger, and the preferred side happen to match. Nothing else does, and three of the mismatches — instant hover, no keyboard trigger, no Escape — are accessibility gaps rather than styling ones.

### Guidance

- **Use the `tooltip` parameter on the component, not `AsmTooltip`.** It is the only path that produces a working tooltip.
- **A `tooltip` is not a `semanticLabel`.** On `AsmIconButton` set both: the tooltip is the visible bubble, the semantic label is the announced name. Relying on the tooltip alone for the name is platform-dependent.
- **Never wrap `AsmTooltip` in a gesture detector to fake a trigger.** You get no delays, no flip-and-shift, no dismissal, and no announcement.
- **Do not put anything interactive inside `AsmTooltip`.** It accepts a `String`, which forecloses this — keep it that way.
- **`multiLine` is 200 wide regardless of the message.** A two-word message in this type is a mostly-empty bubble.
- **`AsmTooltip` renders nothing but the bubble.** It does not clip to the screen, does not know where its anchor is, and will happily draw off the edge of the frame.

---

## Rules

1. A tooltip MUST NEVER be the only place information appears.
2. A tooltip MUST hold one short read-only string. It MUST NEVER contain a link, a button, a scrollable region, or anything focusable.
3. A floating surface containing anything interactive is a [[Popover]], NEVER a tooltip.
4. A tooltip MUST NEVER substitute for a field label, and MUST NEVER carry text needed to complete a task.
5. A tooltip MUST NEVER repeat text already visible on the control.
6. A tooltip MUST NEVER carry the only copy of a value the user needs to read, compare, or copy.
7. The message MUST be a short phrase in sentence case, with no terminal punctuation on a fragment.
8. An icon-only control's tooltip MUST name the action in the same words a labelled button would use.
9. Showing MUST be delayed briefly after the pointer arrives, and the delay MUST be the same everywhere in the app.
10. The bubble MUST stay open while the pointer is inside it.
11. Escape MUST dismiss it, without moving focus.
12. A keyboard user MUST be able to obtain the same information a hovering pointer gets.
13. The bubble MUST NEVER cover its anchor, and MUST flip and shift to stay inside the frame.
14. The bubble MUST follow its anchor when the layout moves, or close.
15. Only one tooltip MUST be on screen at a time.
16. The bubble MUST NEVER be focusable and MUST NEVER respond to the pointer as though it were a control.
17. The bubble's height MUST be a minimum, never a fixed value — it MUST grow with the text scale rather than clip.
18. An interactive tooltip MUST NEVER be shipped without keyboard reachability and a focus indicator on its control. A dismissible bubble is NOT a tooltip.
19. A tooltip MUST NEVER be relied on for anything on a touch surface.
20. A tooltip MUST NEVER be used to report an error.

---

## Open Items

1. **The Assemble tooltip is not the tooltip that ships.** `AsmTooltip` has no consumers outside its own Widgetbook story. Every real tooltip in the repository — `AsmButton`, `AsmIconButton`, the system app bar (three call sites), both topbars, and four legacy chip components — uses Flutter's Material `Tooltip`. So the bubble a McAfee user sees is grey-at-90%-opacity with platform-dependent padding and font size, not the inverse-surface Assemble bubble. This is the single largest design-system divergence found in any component: the documented component is not in service anywhere.
2. **There is no `tooltipTheme` on the Assemble theme.** `buildAsmThemeData` sets the colour scheme and the text theme and nothing else, so every Material `Tooltip` falls through to Flutter's defaults. A `TooltipThemeData` carrying the fill, foreground, radius, padding, minimum height, and the show/hide delays would fix item 1 for every existing call site at once, without touching a single component — and would make `AsmTooltip` redundant, which is arguably the right outcome. This is the same class of gap as the missing global `scrollbarTheme` documented in [[Scrollbar]].
3. **Material's default hover delay is zero.** With no theme, a tooltip appears the instant the pointer touches the control, so dragging the mouse across the system app bar flashes a bubble over every icon. This is the most visible consequence of item 2.
4. **Material's `Tooltip` has no keyboard trigger and no Escape dismissal.** Neither string appears anywhere in the widget's source. A keyboard user who tabs to an icon-only control gets nothing, and a user who has produced a bubble by long press cannot dismiss it from the keyboard. Both are accessibility requirements the platform widget does not meet, so they cannot be fixed by theming — they need a wrapper.
5. **Figma's `Contextual` type is not implemented.** The set has three types; `AsmTooltipType` has two. The missing one is the only type with a tail, the only one with bold text, and the only one with a close button — so it is not a styling variant, it is a small persistent callout that happens to share the bubble. It should either be built as its own component or removed from the set. Nothing else in the system has an unimplemented type that changes the component's interaction model.
6. **`Contextual`'s ✕ is a 16×16 target with no states drawn.** No hover, no focus, no pressed treatment in Figma. It joins the [[Tags]] remove affordance and the [[Popover]] link as sub-floor targets — with the difference that this one has not shipped, so fixing it costs nothing.
7. **`Contextual` is documented in Figma as "Plain tooltip - Single-line"** — the same description as the `Single line` type, on a symbol that has a tail, bold text, a close button, and a different width and height. The description is a copy-paste and gives no guidance on when the type is for.
8. **`multi line`'s fixed width contradicts its own Figma description.** The symbol is 200 wide; the description says "Width can be variable based on content". The implementation follows the symbol, hardcoding 200 as a named constant with a comment pointing at the node — which is the right way to encode an untokenised value, and the value itself is still unresolved.
9. **Three off-scale values in one small component.** The 200 `multi line` width, the 235 `contextual` width, and the 10 gap between the contextual text and its ✕. The 10 joins the stray 10s already recorded in [[Popover]], [[Sheets]], and [[Text Fields]].
10. **Figma's documentation link for this component points at Material 3.** The `tooltip` set's documentation URL is `m3.material.io/components/tooltips/overview` — an external, non-McAfee source, unlike every other component in the file, which links to the Widgetbook pages site. It suggests the tooltip was adopted from Material rather than designed, which is consistent with item 1.
11. **The registry points at the container, not the component.** The registry lists Tooltip as `4066-9878`, which is the wrapping container frame; the component set is `12:1464` inside it. Harmless for lookup, wrong for anyone pulling variant data.
12. **`AsmTooltip` supplies no semantics at all.** It is a `Text` inside a decorated box, so the message is announced as ordinary text with no relationship to any control. Its own Widgetbook story documents this and tells the reader to wrap their trigger in `Semantics(tooltip:)` themselves — an unusual case of a story carrying the accessibility contract because the widget cannot.
13. **Figma draws no shown/hidden transition, delay, or animation.** As with every other component in the file, there are no motion tokens and no timing spec, so the show and hide delays — the settings that most determine whether a tooltip is usable — have no design source at all. Material's values are what ship by default.
14. **The bubble has no maximum width in the `single line` type.** It hugs its text and never wraps, so a long message produces a bubble wider than the frame. Neither source bounds it, and the implementation explicitly sets the overflow to visible.
15. **`AsmTooltip` has no tests.** It appears in no test file. It joins `AsmTag` as the second component with zero test coverage — mitigated here only by the fact that nothing uses it.
16. **The tooltip and the peek label overlap, and the split between them is a convention rather than a constraint.** Both are small floating labels for icon-only affordances; they differ in fill (inverse vs bright), size (24 vs 32/28 minimum), type ramp (12 vs 14), and elevation (none vs `elevation-5`). Nothing in either component enforces the division — the tooltip is not restricted to non-navigation contexts and the peek label is not restricted to rails. The only guidance in code is a line in the peek label's story telling the reader to reach for `AsmTooltip` when the copy is longer than a nav-item name, which is a width workaround rather than a semantic rule. **Documented from the other side in [[Peek Label]]**; the two docs now cross-reference, but the components still do not, and a reader who only has the dartdocs has nothing to choose on.
17. **Nothing enforces one-at-a-time across the two mechanisms.** Material dismisses other Material tooltips when one opens. An `AsmTooltip` placed in an overlay by a caller knows nothing about that, so a screen mixing both could show two bubbles at once.
