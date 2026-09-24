# Component: Sheets

> Role: A large surface that slides in from an edge of the screen to hold a task, a set of details, or a secondary flow — without leaving the current context. Two forms: the **bottom sheet** (enters from the bottom, for focused mobile tasks) and the **side sheet** (docks to the side, for persistent detail beside the main UI).
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A sheet holds a **task**, not a message. It MUST be dismissible without completing anything, and its chrome MUST stay put while its content scrolls — a sheet whose header scrolls away has lost the only thing telling the user where they are.
> Source: Figma `Components` → `bottom-sheet` (`4101-19411`, set `4654:7002`) and `side-sheet` (`4102-21703`, symbol `11:51`). Implementation: `pegasus_flutter/lib/asm/components/bottom_sheet.dart` (`AsmBottomSheet`, `showAsmBottomSheet`) and `side_sheet.dart` (`AsmSideSheet`).

## Overview

A sheet is the answer to "I need more room than a [[Popover]] and less interruption than a [[Modal]]." It is a large surface that arrives from an edge, holds real content — a form, a list, a settings group, a multi-step flow — and leaves when the user is done.

**The two forms are not styles of one component; they solve different problems.**

**A bottom sheet** enters from the bottom of the screen and covers part of it. It is modal: something sits behind it, dimmed, and the user finishes or dismisses before returning. It is the mobile idiom for a focused secondary task — pick a location, review a device, complete a short form. Its defining property is that it comes from where the user's thumb already is.

**A side sheet** docks to the side of the layout and can persist. It is the desktop idiom for detail *beside* content — inspect the selected row while the list stays visible, keep a filter panel open while results update. Its defining property is that the main UI is still there and still usable.

**The thing both share, and the reason they are one doc:** a fixed outer frame with an interior that scrolls. The chrome — the corners, the handle or close button, a header, a footer with actions — is pinned. Only the content region moves. This is what separates a sheet from a scrolling page: on a page, everything scrolls together and the user can lose the exit; in a sheet, the way out is always on screen.

**What a sheet is not.** It is not a place to put a message — a message with no task belongs in a [[Snackbar]] or an [[Alert Banner]]. It is not a place to put a single decision — that is a [[Modal]], and a sheet's size makes a two-button choice look like an unfinished screen. And a sheet holding content that could have been a screen is usually the wrong call: if the user will spend more than a minute in it, or needs to navigate within it, give them the screen.

## Anatomy

### Bottom sheet

```
        ╭─────────────────────────────╮ ←── radius 24, top corners only
        │           ▬▬▬▬▬             │ ←── drag handle (96 × 8)   ─┐
        │                             │                            │ chrome:
        │  ┌───────────────────────┐  │                            │ pinned
        │  │                       │  │                            │
        │  │  content slot         │  │ ←── the only scrolling     │
        │  │  (scrolls)            │  │     region                 │
        │  │                       │  │                           ─┘
        │  └───────────────────────┘  │
        ╰─────────────────────────────╯
         └──────── 384 wide ─────────┘
                  396 tall

  or, with a close button instead of a handle:

        ╭─────────────────────────────╮
        │                        ⊗    │ ←── close, inset 9 / 8 from
        │                             │     the top-right corner
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | `surface-bright`, radius 24 on the **top corners only** — the bottom edge runs off the screen. |
| **Dismiss affordance** | Yes — one of two | A drag handle **or** a close button. Never both, never neither. |
| Drag handle | Variant | A 96 × 8 pill, centred, in a padded strip at the top. Signals "swipe me down." |
| Close button | Variant | A close glyph in the top-right corner. Signals "tap to leave." |
| **Content slot** | Yes | Caller-supplied. The only region that scrolls. |
| Illustration header | Variant | A 256-tall brand-gradient band with a 32px headline — the upsell layout. |
| Back button | Variant | A back glyph mirroring the close button's inset, for multi-step flows. |
| Footer | No | Not a defined region; actions live inside the content slot. |
| Scrim | Yes | The bottom sheet is modal — see [Scrim & Dismissal](#scrim--dismissal). |

**The handle and the close button are the same decision expressed two ways.** A handle says the sheet is draggable and will follow the user's finger; a close button says it is tapped away. Picking the handle and then disabling drag, or picking close and then allowing swipe, teaches the wrong gesture.

**Radius on the top corners only** is not decoration — it is what says "this came from the bottom edge and is still attached to it." A fully-rounded bottom sheet reads as a floating card that happens to be near the bottom.

### Side sheet

```
   ┌──────────────────────┐  ╭──────────────────────╮ ←── radius 16, all corners
   │                      │  │  header (pinned)     │
   │  main UI             │  ├──────────────────────┤
   │  (still visible,     │  │                      │
   │   still usable)      │  │  content (scrolls)   │
   │                      │  │                      │
   │                      │  ├──────────────────────┤
   │                      │  │  footer (pinned)     │
   └──────────────────────┘  ╰──────────────────────╯
                              └──── 538 wide ──────┘
                              16 padding all sides
                              elevation-5 shadow
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | `surface-bright`, radius 16 on **all four** corners, 16 padding all round, `elevation-5` shadow. |
| Header | Optional | Pinned. Never scrolls. |
| **Content** | Yes | The only scrolling region. |
| Footer | Optional | Pinned. Never scrolls. Where actions belong. |
| Close affordance | **Not drawn** | See [Open Items](#open-items) — a significant gap. |
| Scrim | Ambiguous | See [Scrim & Dismissal](#scrim--dismissal). |

**All four corners rounded, plus a shadow, means the side sheet reads as a floating panel** — not as a docked rail attached to the viewport edge. That has consequences for how it is placed: it needs an inset from the screen edges, and it needs something visible behind it or the shadow and radius are wasted.

**The header/content/footer split is the side sheet's whole structure.** The reason it exists is that side sheets hold long content — a list of devices, a settings group — and the user needs the title and the actions to stay reachable while they scroll the middle.

## Sizes

| | Bottom sheet | Side sheet |
| --- | --- | --- |
| Width | 384 | 538 |
| Height | 396 | Fills the viewport |
| Corner radius | 24, top corners only | 16, all corners |
| Padding | Content-owned | 16 all sides |
| Shadow | None | `elevation-5` |
| Illustration band | 256 tall (header variant) | — |

**The bottom sheet's 396 is a fixed height, not a maximum.** It does not grow with content and does not shrink when content is short. A sheet with two rows in it is still 396 tall, with empty space below; a sheet with forty rows is still 396 tall, with the content scrolling inside. This is a deliberate constraint — a bottom sheet whose height tracked its content would jump around between openings — but it means short content looks unfinished, and the fixed value has consequences on small viewports ([Open Items](#open-items)).

**384 is a phone width.** The bottom sheet is specified at one size, for one context. There is no tablet or desktop variant.

**The side sheet's 538 is the drawn width, and it is the only one.** No compact variant, no minimum, no maximum, no responsive behaviour — see [Open Items](#open-items). A 538-wide panel on a 768-wide tablet leaves 230 for the main UI, which defeats the purpose of a side sheet.

## Variants

### Bottom sheet

Figma models the bottom sheet on two independent axes plus a boolean, which multiply out to more combinations than are shipped.

| Axis | Values | Shipped |
| --- | --- | --- |
| `type` — the dismiss affordance | `with-handle`, `with-close` | **Both** |
| `style` — the content treatment | `blank`, `header` | **`blank` only** |
| `showBack` — a back button | `false`, `true` | **Neither** |

**`blank`** is the plain surface: chrome, then an empty content slot for the caller to fill. This is the workhorse and the only shipped form.

**`header`** puts a 256-tall brand-gradient band across the top of the sheet with a 32px white headline centred in it, and the content slot below. It is the upsell / feature-introduction layout, and it is the same illustration-header pattern [[Modal]] also draws and also does not implement. Two things change in this variant beyond the band itself: the drag handle moves *on top of* the gradient and switches to a translucent dark fill so it is visible against the artwork, and the close button gains a translucent circular backing for the same reason. Neither adaptation is implemented, because the variant is not.

**`showBack`** adds a back glyph at the top-left, mirroring the close button's inset. It exists for sheets that are a step in a flow rather than a leaf. Not implemented.

### Side sheet

**There are no variants.** Figma draws one side sheet: one width, one radius, one padding, one shadow, one empty content slot. Everything about its internal structure — header, content, footer, the spacing between them — exists only in code and in the written spec, not in the design file.

## Scrim & Dismissal

### The scrim

Both sheets are drawn in Figma over the same shared `scrim` component (`3687:5230`), which is **two stacked layers**:

| Layer | Value |
| --- | --- |
| Blur | A 15px backdrop blur, tinted with `mcafee/color/extended/ghost` (`#00000030`) |
| Scrim | Solid `black` at **70%** opacity |

That is a heavy treatment — a strong blur *and* a 70% black wash. The intent is unambiguous: when a sheet is open, what is behind it is out of play and barely legible. Note that [[Modal]] uses this same component, and neither implementation matches it — see [Open Items](#open-items).

**For the side sheet, the scrim is a contradiction.** A side sheet's whole reason for existing is that the main UI stays visible and usable beside it. A 70%-black-plus-blur scrim makes the main UI neither. Either the Figma frame is showing the side sheet in a modal presentation (one valid use), or the scrim is a copy-paste from the bottom sheet's frame. Design needs to resolve this, because it determines whether a side sheet traps focus.

### Dismissal — bottom sheet

| Gesture | Behaviour |
| --- | --- |
| Tap the scrim | Dismisses. |
| Swipe down | Dismisses — **handle variant only**. |
| Tap the close button | Dismisses — close variant only. |
| Escape | Dismisses, returns focus to the trigger. |
| Complete the task | Dismisses, returning a result. |

**Swipe-to-dismiss is tied to the handle.** The handle is the affordance that promises the gesture; without it, there is nothing telling the user the sheet can be dragged, so the gesture is not enabled. This pairing is correct and is implemented.

**The sheet must be dismissible without completing anything.** A bottom sheet that can only be left by finishing its task is a [[Modal]] wearing the wrong shape — and if the task genuinely cannot be abandoned, it needs a screen with an explicit cancel.

### Dismissal — side sheet

**Undefined.** Figma draws no close button, no handle, and no dismiss gesture; the implementation provides no close callback and no Escape handling. A side sheet, once placed, is closed by whatever the surrounding app decides — which means every consumer invents it. See [Open Items](#open-items); this is the component's largest gap.

## States

**Neither sheet has interactive states.** They are containers. Content inside follows its own components and the state roles in [[States]].

The interactive parts have states of their own, inherited rather than defined here:

- **The close button** is an icon button and carries the icon button's hover, pressed, focus, and disabled treatments — including the branded focus ring.
- **The drag handle** shows no state. It does not highlight on hover or while being dragged, which means the one affordance that promises a gesture gives no feedback during it. (The same absence [[Scrollbar]]'s thumb has.)
- **The sheet itself** has an open/closed transition and nothing else. No loading state, no error state, no empty state — a sheet whose content is loading shows a [[Loaders|loader]] in the content slot, and one with nothing to show uses an [[Empty State]] there.

## Behaviors

**Chrome is pinned; content scrolls.** The single most important behaviour. The header, the handle or close button, and the footer stay fixed while only the content region moves. See [[Scrollbar]] for the thumb treatment.

**The sheet itself never scrolls.** The outer frame is not a scrollable. If content overflows, it overflows *inside* the content slot.

**One sheet at a time.** A bottom sheet over a bottom sheet leaves no way to tell which scrim belongs to which, and no way back to the first. Multi-step flows use the back button within a single sheet.

**The bottom sheet traps focus.** It is modal: focus moves into the sheet on open, cannot Tab out into the dimmed content behind, and returns to the trigger on dismissal.

**The side sheet does not trap focus** — if it is truly non-modal. Focus moves in and out freely, because the main UI is still live. If it is presented modally (see the scrim question above), it must trap.

**Text scale grows the content, not the frame.** Both sheets have fixed outer dimensions, so larger text means more scrolling inside. Nothing in the content slot may have a fixed height.

**The bottom sheet respects safe areas.** It sits above the home indicator and the on-screen keyboard, and a sheet containing a text field must lift so the field stays visible.

**Entry is a slide from the edge it belongs to.** Bottom sheets rise; side sheets come in from the side. A sheet that fades or scales in loses the spatial explanation of where it came from and where dismissing will send it.

## Content

**A sheet's content is a task, and it should be nameable.** "Add a device," "Choose a location," "Review this alert." If there is no name for what the user is doing in the sheet, it is probably a message ([[Snackbar]], [[Alert Banner]]) or a decision ([[Modal]]).

**Lead with the heading, in the sheet.** The trigger is gone once the sheet is open; the heading is the only thing that says what happened.

**Actions go in a pinned footer (side sheet) or at the end of the content (bottom sheet).** They must be reachable without scrolling to the bottom of long content — a Save button forty rows down will not be found.

**The primary action confirms; dismissal is always available separately.** Never make the close affordance double as "cancel with consequences."

**Keep it to one screenful of concepts.** The scroll is for length, not for depth. A sheet with three distinct sections in it wants [[Tabs]] or its own screen.

**No nested sheets, no nested scrolling.** If the content needs another surface, the flow needs a screen.

## Decision Tree

```
Does the user need to do something that needs real room?
├── No — it is a message
│   ├── Transient confirmation ──────────────────→ [[Snackbar]]
│   └── A standing condition on this screen ─────→ [[Alert Banner]]
│
├── No — it is one decision, two buttons ────────→ [[Modal]]
│
├── No — it is detail about one anchored element
│   ├── A plain label ───────────────────────────→ [[Tooltip]]
│   ├── Rich, with a link ───────────────────────→ [[Popover]]
│   └── A list of choices ───────────────────────→ [[Menu]]
│
└── Yes — a task, a form, a list, a flow
    │
    ├── Will the user be here more than a minute,
    │   or need to navigate within it?
    │   └── Yes ─────────────────────────────────→ a screen, not a sheet
    │
    ├── Must the main UI stay visible and usable
    │   alongside it?
    │   └── Yes ─────────────────────────────────→ Side sheet
    │
    ├── Is this a compact, focused task on a phone?
    │   └── Yes ─────────────────────────────────→ Bottom sheet
    │
    └── Is it a desktop-width task with nothing
        behind it worth keeping?
        └── Yes ─────────────────────────────────→ a screen or [[Modal]]
```

**The branch that decides between the two forms is "must the main UI stay usable?"** Not screen size, not content length. A side sheet whose main UI is scrimmed is a modal in the wrong shape; a bottom sheet next to content the user needs to see is the same mistake mirrored.

**And the branch people skip is the first "yes" one.** Sheets are attractive because they feel lightweight, so long flows end up inside them — and a flow inside a sheet has no URL, no back stack, and a 396-tall window. If it is a real task, give it a real screen.

## Accessibility

| Requirement | Bottom sheet | Side sheet |
| --- | --- | --- |
| Announced as a surface | Yes — a named dialog, labelled by its heading | Yes — a named region, labelled by its heading |
| Focus on open | Moves into the sheet | Moves in only if presented modally |
| Focus trapped | **Yes** | **No** (if non-modal) |
| Escape | Dismisses, returns focus to the trigger | Must dismiss if modal; see [Open Items](#open-items) |
| Focus return | Always to the trigger | Always to the trigger |
| Close affordance target | ≥ 48×48 | Required and missing — see [Open Items](#open-items) |
| Drag handle | Not the only way out — Escape and the scrim also dismiss | — |
| Content behind | Inert and excluded from the accessibility tree | Live and reachable (if non-modal) |
| Automation id | Required on the surface; inner buttons compose from it | Required |
| Text scale | Content scrolls; no fixed heights inside | Same |
| Keyboard scrolling | The content region takes arrow keys / Page Up-Down | Same |

**A swipe-down gesture is not an accessible dismissal.** Keyboard users cannot swipe, and neither can switch-access users. The handle variant must still respond to Escape and to a scrim tap — the gesture is an addition, never the only exit.

**The heading is the accessible name.** Without it a screen-reader user who is moved into the sheet hears the first piece of content with no indication that a new surface opened.

**"Content behind is inert" has two halves.** Making it visually dim is not enough — it must also be removed from the accessibility tree, or a screen-reader user will walk straight out of the sheet into content they cannot see the state of.

**The side sheet's non-modal focus behaviour is a feature that must be honoured properly.** If focus can leave the sheet, the sheet must be positioned in a sensible tab order relative to the main UI, and there must be a way back into it.

## Anti-Patterns

**❌ A sheet with a message and no task.** → [[Snackbar]] or [[Alert Banner]].

**❌ A sheet with one decision and two buttons.** The surface dwarfs the content. → [[Modal]].

**❌ A multi-step flow inside a sheet.** No back stack, no URL, 396 tall. → A screen.

**❌ A sheet whose header scrolls away with the content.** The user loses the title and the exit. → Pin the chrome.

**❌ Making the whole sheet scroll.** Same failure, worse. → Only the content region scrolls.

**❌ A handle with drag disabled, or a close button plus swipe.** The affordance and the gesture must agree. → Pick one and honour it.

**❌ Swipe-down as the only dismissal.** Unreachable by keyboard and switch access. → Escape and scrim tap always work.

**❌ A sheet that can only be left by completing the task.** → Always dismissible; if it truly cannot be, use a screen with an explicit cancel.

**❌ A side sheet behind a full scrim.** Its reason for existing was that the main UI stays usable. → Either drop the scrim or use a [[Modal]].

**❌ A side sheet with no way to close it.** → Give it a close affordance and Escape.

**❌ Sheet over sheet.** Two scrims, no way back. → One at a time; use the back button for steps.

**❌ Nested scrolling inside a sheet.** → One scroll region.

**❌ Content behind left in the accessibility tree.** A screen-reader user walks out of the trapped sheet. → Exclude it.

**❌ Bottom sheet content hidden behind the keyboard.** → Lift for the keyboard inset.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

Two independent widgets, exported from `assemble.dart`. **`AsmBottomSheet` is a modal surface with a route presenter; `AsmSideSheet` is a bare layout primitive with no presenter, no scrim, and no dismissal.**

```dart
import 'package:pegasus_flutter/assemble.dart';
```

### Bottom sheet — as a modal route

```dart
showAsmBottomSheet<void>(
  context: context,
  variant: AsmBottomSheetVariant.handle,
  automationIdentifier: 'add-device-sheet',
  builder: (context) => const AddDeviceForm(),
);
```

`showAsmBottomSheet` wraps Material's `showModalBottomSheet` with `isScrollControlled: true`, a transparent background (the sheet paints its own), zero elevation, and `enableDrag` tied to the handle variant. It returns the value passed to `Navigator.pop`.

### Bottom sheet — as a bare surface

```dart
AsmBottomSheet(
  variant: AsmBottomSheetVariant.close,
  onClose: _dismiss,
  automationIdentifier: 'device-details-sheet',
  child: const DeviceDetails(),
)
```

Used directly, `AsmBottomSheet` is **just the surface**: no scrim, no blur, no route, no focus trap, no Escape, no drag. It is the right choice only when something else owns the presentation — the same split [[Modal]] has, and the same footgun.

### `AsmBottomSheet` parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `AsmBottomSheetVariant` | `.handle` | `.handle` renders the 96×8 pill in a padded strip; `.close` overlays an icon button and collapses the strip to an 8pt spacer. |
| `child` | `Widget?` | `null` | The content slot. Wrapped in a `SingleChildScrollView`, so it scrolls and the chrome does not. |
| `onClose` | `VoidCallback?` | `null` | Tap handler for the close button. Passing `null` leaves the button **disabled**, not absent. |
| `height` | `double?` | `396` | Fixed sheet height. Pass `null` to let it fill its parent. |
| `backgroundColor` | `Color?` | `surfaceBright` | Escape hatch. |
| `borderRadius` | `BorderRadiusGeometry?` | 24 top corners | Escape hatch. |
| `boxShadow` | `List<BoxShadow>?` | `null` — **no shadow** | Escape hatch. |
| `automationIdentifier` | `String` | `'asm-bottom-sheet'` | Prefix. The close button composes `'<id>-close'`. |

### `showAsmBottomSheet` parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `context` | `BuildContext` | required | |
| `builder` | `WidgetBuilder` | required | Builds the content slot, not the sheet. |
| `variant` | `AsmBottomSheetVariant` | `.handle` | Also decides `enableDrag`. |
| `height` | `double?` | `396` | |
| `isDismissible` | `bool` | `true` | Whether a scrim tap dismisses. |
| `useSafeArea` | `bool` | `true` | |
| `barrierColor` | `Color?` | `null` → Material's `black54` | **Not the design's scrim** — see [Open Items](#open-items). |
| `backgroundColor`, `borderRadius` | | | Forwarded to the sheet. |
| `automationIdentifier` | `String` | `'asm-bottom-sheet'` | |

### Side sheet

```dart
Row(
  children: [
    Expanded(child: MainContent()),
    SizedBox(
      width: 538,
      child: AsmSideSheet(
        header: Text('Account', style: /* … */),
        footer: AsmButton(
          label: 'Save',
          onPressed: _save,
          automationIdentifier: 'account-sheet-save',
        ),
        children: [
          for (final device in devices) DeviceRow(device),
        ],
      ),
    ),
  ],
)
```

### `AsmSideSheet` parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `header` | `Widget?` | `null` | Pinned above the scrolling region. |
| `children` | `List<Widget>` | `const []` | The scrolling region. Items are separated by `gap`. |
| `footer` | `Widget?` | `null` | Pinned below the scrolling region. |
| `height` | `double?` | `null` | `null` fills the parent — the normal case. |
| `padding` | `EdgeInsetsGeometry?` | `EdgeInsets.all(16)` | Escape hatch. |
| `gap` | `double` | `10` | Spacing between children and between regions. **Off the spacing scale** — see [Open Items](#open-items). |
| `backgroundColor` | `Color?` | `surfaceBright` | Escape hatch. |
| `borderRadius` | `BorderRadiusGeometry?` | 16 all corners | Escape hatch. |
| `boxShadow` | `List<BoxShadow>?` | `elevation-5` | Escape hatch. |

**`AsmSideSheet` has no `onClose`, no `automationIdentifier`, and no width.** The caller supplies all three.

### Guidance

- **Use `showAsmBottomSheet`, not `AsmBottomSheet`, unless something else already owns the route.** The bare widget has no scrim, no focus trap, and no Escape — every accessibility guarantee above comes from the presenter.
- **`onClose: null` disables the close button; it does not remove it.** Pick `.handle` if you do not want a close button. (This is the same trap [[Modal]] has, and there the class doc states the opposite of what the code does.)
- **Pass a real `automationIdentifier` per instance.** The default is shared, so two sheets in one flow collide.
- **Constrain the side sheet's width yourself** — `AsmSideSheet` has none. Use the Figma 538 as a named constant, and prefer a `LayoutBuilder`-driven decision over a hard-coded one on small viewports.
- **Put the side sheet's actions in `footer`, not at the end of `children`.** That is the difference between a Save button that is always reachable and one at the bottom of a scroll.
- **Do not pass `boxShadow` to the bottom sheet.** Figma specifies none — the scrim does the separating.
- **Give the side sheet a close affordance yourself.** Nothing in the component provides one, and nothing handles Escape. Until that ships, wire both in the consuming screen: a close `AsmIconButton` in `header` and a `Shortcuts`/`Actions` pair for `DismissIntent`.
- **Leave `gap` alone**, and read [Open Items](#open-items) before treating `10` as a design value.

---

## Rules

1. A sheet MUST hold a task. A message goes to [[Snackbar]] or [[Alert Banner]]; a single decision goes to [[Modal]].
2. A sheet's chrome MUST stay pinned. Only the content region scrolls.
3. The sheet frame itself MUST NEVER scroll.
4. A bottom sheet MUST have exactly one dismiss affordance — a drag handle **or** a close button, never both and never neither.
5. Swipe-to-dismiss MUST be enabled if and only if the drag handle is shown.
6. A sheet MUST be dismissible without completing its task.
7. Escape MUST dismiss a modal sheet and MUST return focus to the trigger.
8. A scrim tap MUST dismiss a bottom sheet unless the task explicitly forbids it.
9. Swipe MUST NEVER be the only dismissal — Escape and scrim tap always work.
10. A bottom sheet MUST trap focus and MUST make the content behind it inert **and** excluded from the accessibility tree.
11. A side sheet MUST leave the main UI visible and usable. A side sheet behind a full scrim MUST be a [[Modal]] instead.
12. A side sheet MUST have a close affordance and MUST respond to Escape.
13. Every sheet MUST be announced as a named surface, labelled by its heading.
14. The heading MUST be inside the sheet — the trigger is gone once it is open.
15. Actions MUST be reachable without scrolling: a pinned footer in a side sheet, the end of short content in a bottom sheet.
16. Only ONE sheet MUST be open at a time. Multi-step flows use a back affordance within one sheet.
17. Sheets MUST NOT nest, and scrolling regions inside them MUST NOT nest.
18. Bottom sheet corners MUST be rounded on the top edge only; side sheet corners on all four.
19. Nothing inside the content slot MUST have a fixed height.
20. A bottom sheet MUST respect safe areas and MUST lift for the on-screen keyboard.
21. A flow the user will spend more than a minute in, or must navigate within, MUST be a screen.

---

## Open Items

1. **`AsmSideSheet` has no close affordance, no `onClose`, no Escape handling, and no `automationIdentifier`.** Figma draws none either — the symbol is a surface with a single empty content slot. So the component ships with no defined way to dismiss it, which means every consuming screen invents one, and the accessibility contract above (Escape, focus return, a ≥48 close target) cannot be satisfied by the component at all. This is the largest gap in either sheet. Design needs to draw the close affordance; engineering needs `onClose` and a `DismissIntent` binding.

2. **Figma draws the side sheet over a 70%-black blurred scrim, which contradicts what a side sheet is for.** The `side-sheet` container frame stacks the shared `scrim` component (`3687:5230`) behind the panel: a 15px backdrop blur tinted `#00000030` plus solid black at **70%** opacity. A side sheet exists so the main UI stays visible and usable; at 70% black plus blur it is neither. Either the frame is showing a modal presentation of the side sheet (in which case the modal variant needs its own spec, including focus trapping) or the scrim was copied from the bottom-sheet frame. This determines whether `AsmSideSheet` needs to trap focus, so it blocks the accessibility work.

3. **The scrim values are now known, and neither [[Modal]] nor `showAsmBottomSheet` matches them.** The shared `scrim` component resolves to **blur 15px + black at 70%**. `AsmModal` applies `ImageFilter.blur(sigmaX: 30, sigmaY: 30)` with `colorScheme.scrim` at **20%** — a much stronger blur and a much weaker wash. `showAsmBottomSheet` passes `barrierColor: null`, so it gets Material's `black54` (**54%**) and **no blur at all**. Three different scrims for the one design token: 70% + blur, 20% + heavy blur, 54% + none. A Figma background blur of `15px` maps to a Flutter sigma of roughly 7.5, so the modal's 30 is about 4× the specified blur. This should be one shared scrim implementation. (It also resolves the open item [[Modal]] recorded as unverifiable — the scrim node does resolve; the earlier lookup used the instance id rather than the symbol.)

4. **`AsmSideSheet.gap` defaults to `10`, which is not on the 4px spacing scale and has no design source.** The doc comment justifies it by pointing at a `gap: 10` declaration in some styling source outside this repository, but the Figma `side-sheet` symbol has a single content child and therefore no gap at all — the 10 came from somewhere outside the frame. This is the **second** un-tokened `10` found in the system ([[Popover]]'s container has the same value as its auto-layout gap, where 10 is also Figma's default for a new auto-layout frame). Nearest tokens are `spacing200` (8) and `spacing300` (12). Design should state the intended value; until then every side sheet in the system is spaced off-scale.

5. **Figma's bottom sheet has an illustration-header variant that is not implemented.** `style=header` puts a 256-tall brand-gradient band (`gradient/brand`, `#ff402a` → `#6161ff`) across the top with a centred 32px `headline/large-emphasized` white headline. `AsmBottomSheetVariant` has only `handle` and `close`, so there is no way to get it. This is the **same unimplemented upsell layout** [[Modal]]'s `gradient-header` variant represents — two components now missing the same pattern, which suggests the gradient-illustration header should be a shared piece rather than a per-component variant.

6. **The header variant also changes the chrome, in ways nothing captures.** Over the gradient, the drag handle switches from `outline-variant` (`#dcd9d9`) to `ghost` (`#00000030`) and moves to overlay the artwork at a 10px top offset, and the close button gains a translucent circular `ghost` backing. Both are legibility adaptations for chrome sitting on an image. Since the variant is unimplemented, so are they — but they are worth recording because any future illustration-header surface will need the same treatment.

7. **Figma's `showBack` boolean is not implemented.** A back glyph at the top-left, inset to mirror the close button. Its existence tells us design intends bottom sheets to be steppable, which conflicts with the "one sheet at a time" rule only if steps are new sheets — the back button is precisely the mechanism that keeps them in one sheet. Worth implementing before anyone builds a flow the wrong way.

8. **The bottom sheet's close button is the wrong size against Figma.** Figma's `icon_button` instance composes to a **52** container around a **20** glyph (4 outer padding + 12 state-layer padding + 20 icon). The implementation uses `AsmIconButtonSize.small`, which is a **40** container around a **16** glyph. Both the container and the glyph are smaller than drawn. The 40 container is also below the 48×48 touch floor `40_accessibility.md` requires, and unlike [[Modal]]'s close button — which is a Material `IconButton` and gets Material's 48 minimum for free — `AsmIconButton` at `small` has no such floor. **This is a live accessibility defect, not just a fidelity one.** The position matches Figma exactly (right 9, top 8), which makes the size mismatch look like a wrong enum value rather than a deliberate choice.

9. **The handle is built from bare literals.** `width: 96`, `height: 8`, `BorderRadius.circular(100)` — none named, none commented, and `95_figma_spacing.md` requires structural dimensions to be extracted with a sourcing comment. The values are right (Figma draws 96 × 8, radius 100) and `AsmCornerRadii.r999` would serve for the pill; the code does not say where any of it came from. The `SizedBox(height: 8)` spacer that replaces the header strip in the close variant is the same problem, and 8 is `spacing200`.

10. **The bottom sheet's fixed 396 height has no responsive guard.** It is a bare `_defaultHeight` constant applied unconditionally, with no `LayoutBuilder`. On a small phone in landscape — a ~375-tall viewport — a 396-tall sheet is taller than the screen it is presented in. There is no maximum-height clamp, no fraction-of-viewport behaviour, and Figma draws no compact variant. `90_responsiveness.md` requires adapting to the incoming constraints.

11. **Neither sheet has a responsive variant at all.** Figma specifies one bottom sheet at 384 wide (a phone width) and one side sheet at 538, with no mobile/tablet/desktop frames. A 538-wide side sheet on a 768-wide tablet leaves 230 for the main UI. The usual answer — a side sheet becomes a full-screen or bottom sheet below some width — is undefined, and would need [[Breakpoints]] to state it.

12. **`AsmSideSheet` hand-writes its `elevation-5` shadow.** `BoxShadow(color: colorScheme.shadow, blurRadius: 20)` with a comment naming the Figma effect, when `context.asmShadows.elevation5` is exactly that value. This is another instance of the systemic finding recorded in [[Popover]]: `AsmShadows` is exported and used by **zero** components. Note also that this call site does *not* re-apply an alpha, where [[Menu]] applies `0.19` and [[Modal]] applies `0.20` to the same already-transparent `#8e8e8e30` token — so the system now has three different treatments of one shadow.

13. **The side sheet's three-region contract exists only in code.** Figma's symbol has one slot named `content`; the header/children/footer split, the gap between regions, and the "only the middle scrolls" rule are all in the Dart doc comment, attributed to "the design system spec" rather than to a frame. The contract is a good one — it is the reason the component is more than a padded box — but a designer measuring `11:51` will not find it, and cannot check a build against it.

14. **Neither sheet scrolls with the brand scrollbar.** Both wrap their content in a plain `SingleChildScrollView`, and `buildAsmThemeData` sets no `scrollbarTheme`, so both render Flutter's default 8px Material thumb rather than the Assemble 6px capsule. See [[Scrollbar]], where this is recorded across six components.

15. **The bare `AsmBottomSheet` provides none of the modal contract, and nothing says so.** Used directly it has no scrim, no focus trap, no Escape, no route, and no drag — every accessibility guarantee in this doc comes from `showAsmBottomSheet`. The class doc describes layout only and never distinguishes the two uses. This is the same trap [[Modal]]'s bare constructor has, where the doc additionally claims a behaviour the code does not implement.

16. **`onClose: null` renders the close button disabled, not absent** — a disabled, focusable, unusable ✕ in the corner of the sheet. The correct way to omit it is `variant: .handle`, which the doc does not say. [[Modal]]'s class doc makes the stronger error of claiming `null` omits the button; here it is only an omission. Seventh and eighth components with doc comments that mislead about behaviour.

17. **Six escape-hatch style parameters across the two components.** `backgroundColor`, `borderRadius`, `boxShadow`, `height` on the bottom sheet; `padding`, `gap`, `backgroundColor`, `borderRadius`, `boxShadow`, `height` on the side sheet. Each lets a caller leave the design system silently, and none has a documented case for doing so. Same pattern already flagged on `AsmSwitch`, `AsmLoader`, `AsmProgressBar`, `AsmEmptyState`, `AsmModal`, `AsmCard`, and `AsmScrollbar`.

18. **No motion tokens.** Neither sheet specifies an entry or exit duration or curve; both inherit Material's route transition. Figma specifies no motion. Twelfth-plus component with undocumented motion.

19. **The bottom sheet's `enableDrag` is derived, not exposed.** `showAsmBottomSheet` sets `enableDrag: variant == .handle`, which is the correct pairing and worth keeping — but a caller who wants a handle purely as a visual grip cannot have one, and a caller who wants drag on a close-variant sheet cannot either. The coupling is right; it is undocumented that it exists.
