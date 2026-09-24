# Component: Popover

> Role: A small surface anchored to a specific element, holding rich content — a heading, a block of detail, and usually a link or action — without blocking the rest of the app.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A popover contains focusable content, so it MUST open on activation and NEVER on hover — a hover-opened surface with a link inside cannot be reached by keyboard, and vanishes when the pointer travels toward it.
> Source: Figma `Components` → `popover` (container `6136-5862`, symbol `6136:5806`; examples `6136-5866`, instance `6136:5807`). **No implementation ships.** The closest shipped placement logic is the private popup inside `pegasus_flutter/lib/asm/components/menu.dart`.

## Overview

A popover is a floating surface tied to one element on screen. It answers "tell me more about *this*" — and it does it without taking the app hostage.

Three properties define it, and each one separates it from a neighbour:

- **It is anchored.** It appears next to the thing it describes, and the reader understands the relationship from position alone. This is what makes it different from a [[Modal]], which is centred and belongs to the whole screen.
- **It holds rich content.** A heading, a block of structured detail, and typically an action or a link out. This is what makes it different from a [[Tooltip]], which holds one short string and nothing else.
- **It does not block.** No scrim, no blur, nothing inert behind it. The user can dismiss it and carry on. This is what makes it different from a [[Modal]] and from a [[Sheets|sheet]].

**The distinction people get wrong is popover versus tooltip.** They look similar — a small floating box near a control — and the difference is not size or shape, it is *whether the content can be interacted with*. A tooltip is a label; it appears on hover, it is never focusable, and nothing inside it can be clicked. A popover contains things the user must reach: a link, a toggle, a value they might copy. The moment a floating surface contains something clickable, it is a popover, and it inherits an entirely different set of obligations — it opens on click, it is keyboard-reachable, it traps nothing but returns focus, and it stays open while the pointer is elsewhere.

The consequence is a hard rule: **a popover never opens on hover.** A hover-triggered surface containing a link is unusable in two directions at once. A keyboard user cannot hover, so they can never open it. A pointer user who moves toward the link crosses a gap and the surface disappears. There is no correct amount of hover-delay engineering that fixes this; the trigger has to be an activation.

**The other frequent mistake is using a popover as a menu.** A floating surface holding a vertical list of choices is a [[Menu]] — it has row semantics, keyboard traversal between rows, and a selection model. A popover's content is prose and structure, not a list of options. If every child is a row that does something when clicked, build a menu.

## Anatomy

```
   ┌──────────┐
   │  ▣  ●    │←── anchor (a control, an icon, a status dot)
   └──────────┘ ┆gap┆
                ┌────────────────────────────────┐
                │ ┌────────────────────────────┐ │
                │ │  Turn off VPN              │ │←── heading
                │ │                            │ │
                │ │  ┌──────────────────────┐  │ │
                │ │  │ STATUS:   Connected  │  │ │←── detail block
                │ │  │ LOCATION: 🇺🇸 US      │  │ │
                │ │  └──────────────────────┘  │ │
                │ │                            │ │
                │ │  Change location           │ │←── action / link out
                │ └────────────────────────────┘ │
                └────────────────────────────────┘
                 ↑└──── 16 padding, all sides ──┘↑
                 └── surface: radius 12, subtle shadow
```

| Part | Required | Notes |
| --- | --- | --- |
| **Anchor** | Yes | The element the popover belongs to. It stays visible and is never covered. |
| **Surface** | Yes | Radius 12, `surface-bright` fill, subtle shadow, 16 padding on all four sides. No border. |
| **Content slot** | Yes | Everything inside is caller-supplied. The surface contributes chrome only. |
| Heading | In practice | Names what the popover is about, in the anchor's language. |
| Detail block | Usually | The structured content — label/value pairs, a short paragraph. |
| Action or link | Usually | One way to act on what was just read. |
| Tail / arrow | **No** | The design has none — see below. |
| Close button | **No** | Not drawn. Dismissal is by outside-tap or Escape. |

**There is no tail.** The design does not draw an arrow, caret, or notch pointing at the anchor. The association is carried entirely by **proximity and alignment**: the surface sits a few pixels from the anchor's edge and aligns to it. That makes tight, correct placement a functional requirement rather than a polish item — a popover that drifts 40px away from its anchor, or that gets nudged past a neighbouring control, has lost the only signal that says what it belongs to.

**There is no close button.** Nothing in the design provides an explicit ✕, so the two dismissal gestures below carry the whole burden and both must work.

**The surface is a slot.** Like a [[Modal]], it supplies radius, fill, shadow, padding, placement, and dismissal, and the caller supplies the content. The heading / detail / action arrangement above is the standard filling of the slot, not a fixed layout.

## Sizes

There is one size. The popover is **fixed-width and content-height**.

| Dimension | Value | Notes |
| --- | --- | --- |
| Surface width | 224 | Fixed. Content wraps within it; the surface does not grow. |
| Content width | 192 | 224 less 16 padding on each side. |
| Padding | 16 | All four sides. |
| Corner radius | 12 | |
| Height | Content-driven | The example content produces 148; an empty slot produces 78. |

**Fixed width is the point, not a limitation.** 224 is narrow — roughly 30 characters of body text per line. That constraint is what keeps a popover a popover: content that does not fit comfortably in 224 is content that belongs in a [[Sheets|sheet]] or on a screen. Do not scale the surface up to accommodate more; cut the content down.

**Height must stay short.** The design's own example is 148 tall. A popover that grows past a few hundred pixels stops reading as an annotation of its anchor and starts competing with the page — and because it is fixed-width, growth is always vertical.

**It never scrolls.** A scrollbar inside a popover means the content lost. See the [decision tree](#decision-tree).

## Placement

The popover is positioned relative to its anchor, and the placement logic is part of the component, not the caller's problem.

**The design's only example is side-anchored.** The popover opens to the **right** of its anchor and is **top-aligned** with it — the arrangement the [[Navigation Rail]] needs, where a downward-opening surface would cover the next destination, and which is safe only because that rail is left-docked at every tier.

The full placement contract:

| Requirement | Rule |
| --- | --- |
| Preferred side | A declared side (right of / below / above the anchor), chosen by the caller from the surrounding layout. |
| Gap | A small, consistent gap between the anchor edge and the surface. |
| Cross-axis alignment | Aligned to the anchor's leading edge — top-aligned when opening sideways, left-aligned when opening down. |
| Flip | When there is not room on the preferred side, flip to the opposite side. |
| Shift | When aligned to an edge would overflow, shift along the cross axis back into the frame. |
| Clamp | Never allowed to bleed off-screen; a minimum inset from every frame edge is preserved. |
| Never covers its anchor | The anchor stays fully visible in every resolved position. |

The last row is the one that fails silently. If the popover can cover its own anchor, the user loses the element they were asking about — and with no tail, they lose the only clue about what the surface refers to.

**Flip and shift are not optional.** A popover anchored to the last item in a list, or to a control near the window edge, will hit the frame boundary in normal use. A placement that only works in the middle of the screen is not shipped placement.

**Placement recomputes when the anchor moves.** Scrolling, resizing, and layout changes all move the anchor; the surface follows or closes. A popover left behind at a stale position, pointing at nothing, is worse than no popover.

## Dismissal

Two gestures, both required. There is no close button, so these are the only exits.

| Gesture | Behaviour |
| --- | --- |
| Tap outside the surface | Dismisses. The tap must also reach whatever it landed on — dismissing should not swallow the click. |
| Escape | Dismisses, and returns focus to the anchor. |

Two more behaviours follow from "it does not block":

- **Activating the anchor again closes it.** The anchor is a toggle, and it reports its open/closed state.
- **The app behind stays live.** Content behind the popover is scrollable, tappable, and focusable. A popover that makes the page inert is a [[Modal]] with the wrong geometry.

**A tap on an action inside the popover does not close it automatically.** Whether an action dismisses is the action's decision — a link that navigates away should close; a toggle whose result is displayed inside the popover should not.

## States

The surface has no interactive states. It is a container, and it never shows hover, pressed, or selected treatments of its own — content inside follows its own components and the state roles in [[States]].

Two related states do belong to the component:

- **The anchor is stateful while the popover is open.** It reports itself as expanded, and it should read as active rather than reverting to rest — otherwise a keyboard user tabbing back to the anchor has no indication that a surface is open beside it.
- **Focus inside the surface is ordinary focus.** Every interactive child shows the branded focus ring from [[States]]. Nothing about being in a popover changes that, and nothing about the surface suppresses it.

## Behaviors

**Opens on activation only** — click, tap, Enter, Space, or NumpadEnter on the anchor. Never on hover, never on focus alone (a surface that opens because focus arrived pops open while the user is merely tabbing past).

**One popover at a time.** Opening a second closes the first. Two anchored surfaces on screen at once leaves the user guessing which anchor each belongs to, and there is no tail to tell them.

**Focus is not trapped, but it does move sensibly.** Tab from the anchor moves into the popover's content, and Tab out of the last child closes it and continues in the page. Escape returns to the anchor. This is the opposite of a [[Modal]]'s trap, and it is what "non-blocking" means in keyboard terms.

**It follows its anchor.** If the anchor scrolls, the surface tracks it or closes — it never detaches.

**It floats above everything.** The surface is drawn above app content and clipped by nothing, including the scroll container the anchor lives in. See [[Elevation]] for the shadow.

**Text scale grows it downward.** Width is fixed, so larger text means more lines and a taller surface. Nothing inside may have a fixed height, or content clips at large scales. At the extreme, a popover that grows past the viewport is a sign the content was too long to begin with.

**No entrance choreography beyond a fade.** A popover that slides, scales, or springs draws attention away from the anchor it is supposed to be explaining.

## Content

**The heading names the subject in the anchor's words.** "Turn off VPN" next to the VPN destination — the user should be able to match the heading to the thing they clicked without reading further.

**The body is structured, not prose-heavy.** 192px of width does not support paragraphs. The design's example uses label/value pairs in a bordered block — a shape that fits the width and scans instantly. Prefer that to sentences.

**Labels in a value block are terse and uppercase; values carry the weight.** "STATUS: **Connected**". The label is scaffolding; the value is what the user came for, and it is the emphasised element.

**One action, and it is a link out.** The popover is a summary; the action takes the user to where the real work happens. "Change location", not "Save". A popover with a form in it is a [[Modal]] or a [[Sheets|sheet]].

**No truncation with an ellipsis.** If a value does not fit in 192, shorten the value or move the content out. An ellipsis in a popover hides exactly the detail the popover exists to show.

**Never put a warning or a consequence here.** A popover is dismissed by tapping anywhere, so it cannot be relied on to have been read. Anything the user must acknowledge goes to a [[Modal]]; anything about the state of a screen goes to an [[Alert Banner]].

## Decision Tree

```
Is the content tied to one specific element on screen?
├── No — it is about the screen or the whole app
│   ├── Must be acknowledged before continuing ──→ [[Modal]]
│   ├── A persistent condition on this screen ───→ [[Alert Banner]]
│   └── A brief confirmation of something done ──→ [[Snackbar]]
│
└── Yes — it is about this element
    │
    ├── Is anything inside it interactive?
    │   ├── No — one short label, hover-revealed ──→ [[Tooltip]]
    │   └── Yes — a link, a control, a value ─────→ continue
    │
    ├── Is the content a list of choices?
    │   └── Yes ──────────────────────────────────→ [[Menu]]
    │
    ├── Does it fit in 224 wide and stay short?
    │   ├── No — a form, a long list, many steps ─→ [[Sheets]]
    │   └── Yes ──────────────────────────────────→ continue
    │
    ├── Must the user respond before continuing?
    │   └── Yes ──────────────────────────────────→ [[Modal]]
    │
    ├── Is the element inside a list or section that could
    │   just expand in place?
    │   └── Yes ──────────────────────────────────→ [[Accordion]]
    │
    └── Otherwise ────────────────────────────────→ Popover
```

Two routes carry most of the value. **Interactive content rules out a tooltip** — that single question settles the comparison people spend the most time on. And **"would expanding in place work?"** is the question nobody asks: an [[Accordion]] keeps content in the document flow, needs no placement logic, and cannot be accidentally dismissed. A popover is the right answer only when the content genuinely must float — because the anchor is a compact control with no room beneath it, or because expanding would push the rest of the layout around.

## Accessibility

| Requirement | Rule |
| --- | --- |
| Trigger | Activation only — click / tap / Enter / Space / NumpadEnter. Never hover, never focus alone. |
| Anchor role | Announced as a button that reports an expanded / collapsed state. |
| Anchor target | ≥ 48×48. |
| Surface announced | The surface is a named group or dialog, labelled by its heading, so a screen reader user knows what they have entered. |
| Reachable | Tab from the anchor moves into the content; every interactive child is focusable and shows the branded focus ring. |
| Not trapped | Tab out of the last child closes the popover and continues in the page. |
| Escape | Dismisses and returns focus to the anchor. |
| Focus return | Dismissal by any route returns focus to the anchor, never to the top of the page. |
| Interactive children | Each meets its own contract, including a ≥ 48×48 target. |
| Automation id | Required on the surface; interactive children compose from it. |
| Text scale | No fixed heights; content wraps and the surface grows. |

**"Never hover" is an accessibility requirement, not a style preference.** A keyboard-only user, a switch-access user, and a screen-reader user all have no hover. A popover that opens on hover is unreachable for all three, and every link inside it is unreachable with it.

**The surface must announce itself.** Without a label on the surface, a screen reader user who tabs from the anchor into the content hears the heading text as a stray string with no indication that they have moved into a new surface — and no indication of how to get out. The heading is the label.

**Focus must return to the anchor, always.** The anchor is small and often icon-only, and after dismissal it is the only landmark the user has. Focus dumped back at the document root means re-traversing the whole page.

**The touch target obligation extends into the content.** A link rendered at 12px is ~16 tall. It needs padding to reach 48, and the fixed 224 width makes that easy to overlook — see [Open Items](#open-items).

## Anti-Patterns

**❌ Opening on hover.** Keyboard users can never open it; pointer users lose it on the way to the link. → Open on activation.

**❌ Using a popover for a plain label.** The chrome, placement, and dismissal machinery is wasted, and the surface swallows focus for no reason. → [[Tooltip]].

**❌ Using a popover for a list of options.** No row semantics, no arrow-key traversal, no selection model. → [[Menu]].

**❌ Putting a form in it.** 192px of width cannot hold labelled fields, and the surface dismisses on any outside tap — including the one that moves between fields. → [[Sheets]] or [[Modal]].

**❌ Letting it scroll.** A scrollbar in a 224-wide box means the content never belonged here. → Cut the content or move it out.

**❌ Widening the surface to fit content.** The fixed width is what keeps the component distinct. → Cut the content.

**❌ Covering the anchor.** The user loses the element they asked about, and with no tail there is nothing left to indicate what the surface refers to. → Flip and shift; never overlap.

**❌ Two popovers open at once.** With no tails, neither surface can be matched to its anchor. → One at a time.

**❌ Leaving the anchor looking untouched while open.** A keyboard user tabbing back has no idea a surface is open. → The anchor reports expanded and reads as active.

**❌ Trapping focus inside it.** It does not block, so it must not behave as though it does. → Tab out closes it and continues.

**❌ Putting a warning, a consequence, or anything that must be acknowledged in it.** It is dismissed by tapping anywhere; you cannot know it was read. → [[Modal]] for acknowledgement, [[Alert Banner]] for a standing condition.

**❌ Truncating a value with an ellipsis.** It hides the detail the popover exists to show. → Shorten the value or move the content out.

**❌ A stale popover after the anchor scrolls away.** It now points at nothing. → Follow or close.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

**There is no popover widget.** Nothing named `AsmPopover` exists, nothing is exported from `assemble.dart`, and the Figma component has no code counterpart. Everything below describes what exists today and what to do until a component ships — no API is documented here because none exists to document.

### What exists

| Piece | Where | What it gives you |
| --- | --- | --- |
| `AsmMenu.popup` | `menu.dart` (public) | Full anchored placement — but its content is `List<AsmMenuItem>`, so it can only render menu rows. |
| `_PopupMenuLayoutDelegate` | `menu.dart` (**private**) | The placement algorithm a popover needs: preferred side, flip when short of room, cross-axis shift, clamp to the frame less `spacing200`. Not reachable from outside the file. |
| `_DismissibleBarrier` | `menu.dart` (**private**) | Outside-tap dismissal via `TapRegion(behavior: HitTestBehavior.deferToChild)` — dismisses without consuming the tap, which is exactly the required behaviour. |
| `AsmPeekLabel` | `peek_label.dart` (public) | The sanctioned shape for a *presentational* floating surface: it renders the chip and explicitly leaves positioning to the caller via `OverlayPortal` + `CompositedTransformFollower`. See [[Peek Label]]. |
| `AsmCard` | `card.dart` (public) | The surface itself, if you build one: rounded fill plus shadow, with `padding` and `borderRadius` overridable. See [[Cards]] — and note its shadow defect, open item 10 below. |
| `AsmTooltip` | `tooltip.dart` (public) | Presentational only, same as above. Not a popover and must not be pressed into service as one — nothing inside it is focusable. |
| `AsmShadows.elevation1` | `assemble_tokens` | The `elevation-1` shadow the Figma surface uses, as a token: `BoxShadow(offset: Offset.zero, blurRadius: 4, color: 0x308E8E8E)`. |

### Tokens for the surface

Every value in the Figma surface has a token except the width:

| Property | Value | Token |
| --- | --- | --- |
| Fill | `surface-bright` | `Theme.of(context).colorScheme.surfaceBright` |
| Corner radius | 12 | `AsmCornerRadii.r12` / `context.asmSpacingTokens.cornerMedium` |
| Padding | 16 | `context.asmSpacingTokens.spacing400` |
| Shadow | `elevation-1` | `context.asmShadows.elevation1` |
| Anchor gap | 4 | `context.asmSpacingTokens.spacing100` |
| Frame inset | 8 | `context.asmSpacingTokens.spacing200` |
| Width | 224 | **No token** — must be a named `static const double` with a sourcing comment. |

### Interim composition

Until a component ships, this is the composition that satisfies the contract above. It is **not a sanctioned component** — it is what a feature must hand-roll today, reproduced here so that hand-rolled versions at least agree with each other.

```dart
class VpnPopoverAnchor extends StatefulWidget {
  const VpnPopoverAnchor({super.key, required this.child});

  final Widget child;

  @override
  State<VpnPopoverAnchor> createState() => _VpnPopoverAnchorState();
}

class _VpnPopoverAnchorState extends State<VpnPopoverAnchor> {
  /// Fixed surface width from the Figma `popover` symbol (`6136:5806`,
  /// 224 wide). There is no spacing token at 224 — the scale stops at 48.
  static const double _surfaceWidth = 224;

  final _controller = OverlayPortalController();
  final _link = LayerLink();
  final _anchorFocus = FocusNode(debugLabel: 'vpn popover anchor');

  bool get _open => _controller.isShowing;

  void _toggle() => _open ? _close() : _controller.show();

  void _close() {
    _controller.hide();
    _anchorFocus.requestFocus();
  }

  @override
  void dispose() {
    _anchorFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final spacing = context.asmSpacingTokens;

    return CompositedTransformTarget(
      link: _link,
      child: OverlayPortal(
        controller: _controller,
        overlayChildBuilder: (_) => TapRegion(
          behavior: HitTestBehavior.deferToChild,
          onTapOutside: (_) => _close(),
          child: CompositedTransformFollower(
            link: _link,
            // Right-of, top-aligned — the Figma example's placement.
            targetAnchor: Alignment.topRight,
            followerAnchor: Alignment.topLeft,
            offset: Offset(spacing.spacing100, 0),
            child: Shortcuts(
              shortcuts: const <ShortcutActivator, Intent>{
                SingleActivator(LogicalKeyboardKey.escape): DismissIntent(),
              },
              child: Actions(
                actions: <Type, Action<Intent>>{
                  DismissIntent: CallbackAction<DismissIntent>(
                    onInvoke: (_) {
                      _close();
                      return null;
                    },
                  ),
                },
                child: Semantics(
                  container: true,
                  explicitChildNodes: true,
                  label: 'Turn off VPN',
                  identifier: 'vpn-popover',
                  child: _surface(context),
                ),
              ),
            ),
          ),
        ),
        child: Semantics(
          button: true,
          expanded: _open,
          identifier: 'vpn-popover-anchor',
          child: Focus(
            focusNode: _anchorFocus,
            child: GestureDetector(onTap: _toggle, child: widget.child),
          ),
        ),
      ),
    );
  }

  Widget _surface(BuildContext context) {
    final spacing = context.asmSpacingTokens;
    final colorScheme = Theme.of(context).colorScheme;

    return Material(
      type: MaterialType.transparency,
      child: Container(
        width: _surfaceWidth,
        padding: EdgeInsets.all(spacing.spacing400),
        decoration: BoxDecoration(
          color: colorScheme.surfaceBright,
          borderRadius: BorderRadius.circular(spacing.cornerMedium),
          boxShadow: [context.asmShadows.elevation1],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Turn off VPN',
              style: context.asmTypographyTokens.labelLarge
                  .copyWith(color: colorScheme.onSurfaceVariant),
            ),
            SizedBox(height: spacing.spacing200),
            // …detail block…
            SizedBox(height: spacing.spacing200),
            AsmLink(
              label: 'Change location',
              size: AsmLinkSize.small,
              onPressed: _changeLocation,
              automationIdentifier: 'vpn-popover-change-location',
            ),
          ],
        ),
      ),
    );
  }
}
```

### What this composition still does not do

Every item here is a reason the component needs to ship rather than be copied:

- **No flip, shift, or clamp.** `CompositedTransformFollower` places the surface and lets it run off-screen. Near a window edge it simply leaves the frame. The algorithm that fixes this is `_PopupMenuLayoutDelegate`, and it is private.
- **No "never cover the anchor" guarantee** — same cause.
- **`AsmLink` at `small` is ~16 tall**, well under the 48 floor. It needs padding to reach a legal target, and nothing in the composition supplies it.
- **No global "one at a time" coordination.** Two anchors can be open simultaneously.
- **Nothing closes it when the anchor scrolls out of view.**

### Guidance

- **Do not hand-roll a popover per feature.** Every copy diverges on gap, radius, shadow, and dismissal, and every copy re-omits flip/shift/clamp. If you need one, say so — the placement logic already exists and needs extracting, not rewriting.
- **Do not use `AsmTooltip` or `AsmPeekLabel` as a popover surface.** Both are presentational and neither is focusable; putting a link inside either produces content a keyboard user cannot reach. See [[Tooltip]] and [[Peek Label]] — the peek label has no semantics at all, so its content is not merely unfocusable but unannounced.
- **Do not use `AsmMenu.popup` for rich content.** Its items are `AsmMenuItem` rows; forcing prose into a row label loses the semantics and the layout.
- **Use `context.asmShadows.elevation1`,** not a hand-written `BoxShadow`. Note that no shipped component does this yet — see [Open Items](#open-items).
- **Name the 224.** `95_figma_spacing.md` rejects a bare `width: 224`; it needs a `static const double` citing the Figma node.
- **Give the anchor an expanded state.** `Semantics(button: true, expanded: _open)` is the whole cost, and without it the open surface is invisible to assistive tech.
- **Compose child automation ids from the surface's id** so two popovers on one screen do not collide.

---

## Rules

1. A popover MUST be anchored to a specific element and MUST NEVER cover that element in any resolved position.
2. A popover MUST open on activation — click, tap, Enter, Space, NumpadEnter. NEVER on hover, and NEVER on focus alone.
3. A floating surface containing anything interactive is a popover, NEVER a [[Tooltip]].
4. A floating surface whose content is a list of choices is a [[Menu]], NEVER a popover.
5. A popover MUST NOT block. Content behind it stays scrollable, tappable, and focusable.
6. Outside-tap MUST dismiss, and MUST NOT consume the tap.
7. Escape MUST dismiss and MUST return focus to the anchor. Every dismissal route returns focus to the anchor.
8. Focus MUST NOT be trapped. Tab out of the last child closes the popover and continues in the page.
9. The surface MUST be announced as a named group, labelled by its heading.
10. The anchor MUST report an expanded state while the popover is open, and MUST read as active.
11. The anchor MUST be ≥ 48×48, and so MUST every interactive child inside the surface.
12. Placement MUST flip when there is no room on the preferred side, MUST shift back into the frame when it would overflow, and MUST NEVER bleed off-screen.
13. The surface MUST follow its anchor, or close. It MUST NEVER be left at a stale position.
14. Only ONE popover MUST be open at a time.
15. The surface width MUST stay fixed at 224. NEVER widen it to fit content.
16. A popover MUST NEVER scroll. Content that does not fit goes to [[Sheets]] or a screen.
17. A popover MUST NEVER contain a form, a wizard, or a multi-step task.
18. A popover MUST NEVER carry a warning, a consequence, or anything requiring acknowledgement — it is dismissed by any outside tap and cannot be assumed read.
19. Values MUST NOT be truncated with an ellipsis inside a popover.
20. Nothing inside the surface MUST have a fixed height; content wraps and the surface grows with text scale.

---

## Open Items

1. **The component does not exist in code.** Figma ships `popover` (`6136:5806`) with an example (`6136:5807`); the registry lists both as "Candidate" with "(none yet)" for the implementation. Nothing named `AsmPopover` exists and nothing is exported. This is the largest gap in the component set, because the *demand* is already visible: the Figma example anchors a popover to a [[Navigation Rail]] destination, and the rail's overflow slot currently opens `AsmMenu.popup` instead — the only anchored-surface tool available. Features needing a popover today will hand-roll one, and the hand-rolled versions will diverge on gap, radius, shadow, dismissal, and placement.

2. **The placement algorithm the popover needs is already written and private.** `_PopupMenuLayoutDelegate` in `menu.dart` does preferred-side placement, flip-on-no-room, horizontal shift, and clamp-to-frame-less-`spacing200`, and it is documented as never covering its own anchor. It is a private class in a component file. It should be extracted to a shared placement primitive that both `AsmMenu.popup` and a future popover consume, not reimplemented. Same for `_DismissibleBarrier`, whose `deferToChild` `TapRegion` is precisely the non-consuming outside-tap dismissal a popover requires. See [[Menu]], which records the same finding from the other side.

3. **Figma's anchor gap is 6.5, off the spacing scale.** In the example frame the navigation rail occupies x 185–245 — a 60pt span, matching the width [[Grid]] reserves and [[Navigation Rail]] derives — and the popover starts at x 251.5, a 6.5px gap. The scale has 4 (`spacing100`) and 8 (`spacing200`) and nothing between. `95_figma_spacing.md` requires an exact token match and treats an off-scale value of this size as a frame to flag rather than a number to snap. The shipped popup delegate uses 4.

4. **Figma's auto-layout gap on the surface is 10, which has no token.** The `popover` symbol's item spacing is 10 — off the 4px scale entirely, and 10 happens to be Figma's default gap for a new auto-layout frame, which suggests it was never set deliberately. The example instance's real internal gaps are 8 and 8 (heading → detail block → link), which *are* on-scale. Design should either confirm 8 or state what 10 is.

5. **The component contains an empty text layer.** Node `6136:5805` sits inside the symbol at (16, 57.5) with **width 0**, height 20, styled `label/large` on `on-surface`. It carries a zero-width space as its content and is present in the instance too. It is a leftover, and it is the node whose position produces the symbol's odd 78px default height.

6. **The heading's colour inverts the visual hierarchy.** In the example the heading "Turn off VPN" is `label/large` (14/400) in `on-surface-variant` (#423f3e), while the values below it are `body/medium-emphasized` (14/700) in `on-surface` (#252121) — same size, but the heading is lighter *and* less contrasty than the body. The heading is also not marked as a heading. So the most prominent text in a popover is a status value and the least prominent is its title. Confirm with design whether the heading is meant to be a heading at all, or whether it is a caption above the real content.

7. **The symbol's own placeholder uses `on-surface` while the instance overrides to `on-surface-variant`.** A single-instance override is not evidence of intent; the component's default and its only example disagree on the heading colour.

8. **The detail block's border is 0.5px, and there is no border token below 1.** `AsmBorderWidths` runs `w0, w100 (1), w200 (2), w300 (3), w400 (4)`. Figma's inner data container (`6136:5833`) is `0.5px solid outline-variant`. Either the token is missing upstream or the frame should be 1 — but it cannot be built as drawn. (Note this border belongs to the example's *content*, not to the popover surface, which has no stroke.)

9. **`context.asmShadows` exists and no component uses it.** `AsmShadows` exposes `elevation1` (blur 4), `elevation5` (blur 20), and `special` (blur 48, offset 0,2) with per-brightness colours, and it is wired to a `BuildContext` extension. A grep across `lib/` finds **zero** usages: every component hand-writes `BoxShadow(color: colorScheme.shadow, blurRadius: N)` instead. [[Elevation]] rule 2 says never hand-author shadow geometry; the token that would satisfy it is shipped and ignored. A popover, whose Figma effect is `elevation-1`, is the natural place to start using it.

10. **And the hand-written shadows disagree with each other and with the token.** `AsmElevationLight.level1` is `blurRadius: 4`. `card.dart` writes `blurRadius: 2` for the same `elevation-1` effect, with a comment claiming the design source's `4px` blur maps to Flutter `2` — while `peek_label.dart` writes `blurRadius: 20` for `elevation-5`, whose Figma radius is also 20, i.e. **not** halved. One of the two conversions is wrong, [[Elevation]]'s table (4 / 20 / 25) agrees with the un-halved reading, and the generated token agrees with [[Elevation]]. So `AsmCard`'s shadow is half the intended blur. **Recorded from the other side in [[Cards]]**, where it matters more than it does here: the `surface` variant's fill is only 1.17 : 1 against the app canvas, so the halved shadow is the *only* thing separating the card from the background — and `AsmCard` is the base of six other components, [[Alert Card]], [[Popover]]'s eventual surface, [[Expanded Card]], the feature banner, the guided action panel, and the list feature card, all of which inherit it. There are now **three** hand-written renderings of the same three-shadow scale across four surfaces: `AsmCard` halves the blur, `AsmNavigationRail` writes the un-halved 20 and is correct, and `AsmNavDrawer` writes the un-halved 20 but re-applies 19% alpha to a shadow colour [[Elevation]] describes as already sitting at roughly 19%, landing at about a fifth of the intended strength — on the one surface at the small tier whose only separation from the content beneath it is that shadow ([[Navigation Rail]] open item 16). Both navigation files also name an "elevation-5" that [[Elevation]] is explicit does not exist.

11. **The shadow naming diverges three ways.** Figma calls the effects `elevation-1` and `elevation-5`; the token class calls them `elevation1` / `elevation5` / `special`; [[Elevation]] calls them `subtle` / `light` / `heavy` and states there are exactly three with no "level 1 through 5" to interpolate. A reader given the Figma name `elevation-1` has no direct route to either the foundation doc's name or the token accessor.

12. **Figma draws exactly one placement and one state.** The `popover` set has **no variant axes at all** — no side variants, no size variants, no state variants. There is no `focus` drawn (consistent with every other component in this set), no open/closed or entering state, no close button, and no tail or arrow anywhere. So flip, shift, above/below placement, and the anchor's expanded appearance are all undrawn and would have to be specified by engineering. The example's right-of/top-aligned placement is the only placement that exists in design.

13. **No tail means placement tolerance is very low, and nothing in design says what it is.** With no arrow, the anchor association depends entirely on proximity. Design should state the maximum acceptable gap and what happens when flip moves the surface to the anchor's other side.

14. **Figma's own example ships a 16-tall tap target.** The "Change location" link is `link/small` (12px, bold, underlined) at 192 × 16. That is a third of the 48×48 floor `40_accessibility.md` requires. Because the surface is only 224 wide and 16 padding is already spent, adding the padding needed to reach 48 will visibly change the layout — design and engineering need to agree on how before a component ships.

15. **`link/small` has no matching type token.** Figma's link style is 12/700/1.3/0.5 — which is exactly `bodySmallEmphasized` in the token set. But the shipped link widget picks its style from `bodyLarge` / `bodyMedium` / `bodySmall` by size and then applies `fontWeight: FontWeight.w600` on top, so its small size renders 12/**w600**, not the 12/w700 the Figma popover draws. Neither the weight nor the accessor lines up.

16. **The example's mono labels use a type ramp the upstream typescale does not emit.** "STATUS:" / "LOCATION:" are `body/mono/small`, which lives in a hand-written extension (`typography.dart`) rather than the generated tokens, with a comment saying the upstream typescale has not emitted the mono ramps yet. [[Menu]] records the same gap for its chips field.

17. **No responsiveness is drawn or specified.** One fixed 224 width, no mobile/tablet/desktop variants. On a narrow phone in portrait, 224 plus a gap plus frame insets is a large fraction of the screen, and there is no guidance on whether the popover should become a bottom [[Sheets|sheet]] at small widths — which is the usual answer and which [[Breakpoints]] would need to define.
