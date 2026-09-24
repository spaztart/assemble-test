# Component: Modal

> Role: A centred surface over a blurred, dimmed app that interrupts the user to get one decision or deliver one critical message.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A modal takes the user's attention by force, so it MUST be worth the interruption — one decision, stated in the heading, with the consequence named. NEVER use one for information the user could have read in place.
> Source: Figma `Components` → `modal` (node `4102-21777`, symbol set `2829:218`), variants `type = text-dialog | blank | gradient-blank | gradient-content | gradient-header` × `style = default | promo`. Implementation: `pegasus_flutter/lib/asm/components/modal.dart`.

## Overview

A modal is the most expensive component in the system. It stops the user mid-task, blurs everything they were looking at, and refuses to let them continue until they respond. That cost buys exactly one thing: certainty that the user saw it.

**Spend it only on a decision or a consequence.** The two legitimate reasons to interrupt:

- **A decision that cannot be deferred** — "Delete this device? Its protection history will be lost." The user must answer before the app can proceed, and the answer is destructive or irreversible.
- **A message that must not be missed** — a subscription lapsing today, a breach affecting this account. Critical, and the user acting on the wrong assumption has real cost.

Everything else is cheaper elsewhere. Confirmation of something that already worked is a [[Snackbar]]. A persistent condition on a screen is an [[Alert Banner]]. Explanatory detail on demand is a [[Popover]] or a [[Tooltip]]. A list of choices is a [[Menu]].

**A modal asks; it does not narrate.** The heading is the question or the fact, in plain language, and the buttons are the possible answers. A modal whose heading is a topic ("Device settings") and whose only button is "OK" has interrupted the user to tell them something they will forget.

**The blur is functional, not decorative.** Blurring the app behind the surface removes the competing content from the user's attention, which is the whole point of the interruption. It also signals that the app is still there and will come back — unlike a full-screen replacement, which reads as navigation.

**Modal, sheet, popover — three answers to "a surface over content."** A modal is centred and blocking, for a decision. A [[Sheets|sheet]] slides from an edge and is for a task with several steps or a list too long for a dialog. A [[Popover]] is anchored, non-blocking, and for detail about a specific thing. Choosing by appearance rather than by blocking behaviour is the most common structural mistake.

## Anatomy

```
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← blurred app content,
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     dimmed by a scrim
  ░░░░░┌───────────────────────────────┐░░░░░
  ░░░░░│                          ┌───┐│░░░░░
  ░░░░░│  Delete this device?     │ ✕ ││░░░░░  ← heading + close
  ░░░░░│                          └───┘│░░░░░
  ░░░░░│  Its protection history will  │░░░░░  ← body: the consequence
  ░░░░░│  be lost. This can't be       │░░░░░
  ░░░░░│  undone.                      │░░░░░
  ░░░░░│                               │░░░░░
  ░░░░░│              ┌──────┐┌──────┐ │░░░░░  ← actions, right-aligned
  ░░░░░│              │Cancel││Delete│ │░░░░░
  ░░░░░│              └──────┘└──────┘ │░░░░░
  ░░░░░└───────────────────────────────┘░░░░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ↑                               ↑
        └──── 24 content padding ───────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Scrim + blur** | Yes | Dims and blurs everything behind. Tapping it dismisses. |
| **Surface** | Yes | Centred, radius 28, drop shadow, clipped. Height follows its content. |
| **Heading** | Yes in practice | The decision or the fact. Announced when the dialog opens. |
| Body | Usually | The consequence, or the detail that makes the decision possible. |
| Actions | Yes for a decision | Right-aligned [[Button]]s. Omit only for a pure acknowledgement. |
| Close (✕) | Optional | Top-right. Present by default. |
| Illustration band | Variant only | A gradient header image above the copy, for promotional modals. |

**The content is a slot, not a fixed layout.** The surface supplies the chrome — radius, shadow, padding, close button, blur, dismissal, dialog semantics — and the caller supplies whatever goes inside it. The heading/body/actions arrangement above is the standard filling of that slot, not the only one.

**The close button overlaps the content.** It is positioned over the top-right corner rather than reserving a row, so the heading must leave room for it. In the standard layout the heading is inset on its right side for exactly this reason.

**Actions are right-aligned and horizontal.** Two is the normal maximum. A modal needing three actions is a modal asking more than one question.

## Sizes

The modal is **content-sized, not viewport-sized**. It grows to fit what is inside it and stops.

| Figma variant | Symbol size | Notes |
| --- | --- | --- |
| `text-dialog`, `blank`, `gradient-blank`, `gradient-content` | 444 × 318 | The standard dialog footprint. |
| `gradient-header` | 434 × 520 | Taller and slightly narrower — the illustration band adds height. |

The standard text layout's content is **396 wide**, which with 24 padding on each side is exactly Figma's 444.

**Two caps apply.** The surface never exceeds the viewport less 24 on every side, so a long modal shrinks rather than running off-screen. Past that its content must scroll — and a modal whose content needs scrolling is usually a [[Sheets|sheet]].

**Radius 28.** Figma names this `Corner/Extra-large`. Note that the radius scale has no 28 entry — see [Open Items](#open-items).

## Variants

Figma models two axes: `type` (what fills the surface) and `style` (`default` or `promo`).

| Figma variant | What it is | Shipped |
| --- | --- | --- |
| `text-dialog` | Heading + body + actions on a solid surface | Yes |
| `blank` | Empty slot on a solid surface — caller supplies everything | Yes |
| `gradient-blank` | Empty slot on a full-surface brand gradient | Yes |
| `gradient-content` | Heading + body + actions on a full-surface brand gradient | Yes |
| `gradient-header` | A gradient illustration band across the top, copy on solid below | **No** |

### Text dialog

The default and the one to reach for. Heading, body, and up to two actions. This is the variant that matches the component's purpose: a decision with a stated consequence.

### Blank

The surface with an empty slot. Use it when the decision needs something the standard layout cannot express — a form field, a list, a diagram. You still get the chrome, dismissal, and dialog semantics; you own the layout inside.

The temptation here is to grow the modal into a page. Resist it: if the slot fills with more than one interaction, the interaction belongs on a screen or in a [[Sheets|sheet]].

### Gradient (promo)

The whole surface becomes the brand gradient and the foregrounds flip to white. This is the **promotional** register — an upsell, a feature announcement — not the decision register.

Two things follow. First, a destructive confirmation must never be on a gradient; the brand surface reads as celebratory and undercuts the warning. Second, a promotional modal is by definition an interruption the user did not ask for, so it needs a genuinely easy way out: the close button is not optional here.

### Gradient header

An illustration band across the top with a large headline inside it, and the copy and actions on the solid surface below. This is the upsell layout in Figma and it is **not implemented** — passing a gradient fills the entire surface instead. See [Open Items](#open-items).

## Dismissal

A modal must be escapable four ways. All four are required, because a modal the user cannot leave is the worst failure this component has.

| Gesture | Behaviour |
| --- | --- |
| Close button | Dismisses. Present by default; omit only when there is a mandatory choice. |
| Tap the scrim | Dismisses. |
| Escape | Dismisses. |
| An action button | The caller dismisses as part of handling the action. |

**Dismissing is always the safe outcome.** Escape, the scrim, and the ✕ all mean "I am not answering" — never "yes". A modal where the easy exit performs the destructive action is a trap.

**Omit the exits only for a genuinely mandatory choice**, and then omit *all* of them. A modal with no close button but a dismissible scrim teaches the user that the ✕ was hidden for show. See [Open Items](#open-items) for a gap here.

**The action that closes the modal is the caller's job.** The component does not assume that pressing a button ends the interaction, because a form modal may want to stay open on a validation failure.

## States

The surface has no interactive states of its own — it is a container. Its parts follow their own components: [[Button]] for the actions, and the close affordance behaves as an icon button.

Two things about the surface are worth stating:

- **The scrim is a state of the app behind, not of the modal.** While a modal is open, everything behind it is inert: not tappable, not focusable, not reachable by keyboard. See [[Color]] for the scrim role and [[Elevation]] for the shadow.
- **The gradient variant re-colours its foregrounds.** Text and the close glyph flip to white, because the brand gradient is dark enough that the normal on-surface colour would fail contrast. Any content the caller supplies to a gradient modal must be re-coloured the same way — the surface cannot do it for arbitrary children.

## Behaviors

**Entry and exit fade.** 250ms, both directions. The surface does not scale, slide, or bounce; a modal that animates in from a direction reads as navigation.

**The app behind blurs and dims simultaneously.** The blur is what makes the surface legible over arbitrary content; the dim is what makes it read as inactive.

**Focus moves into the modal and is trapped there.** Tab cycles among the modal's own controls and cannot reach the app behind. On dismissal, focus returns to whatever opened the modal.

**Height follows content; width is fixed by the layout.** The standard text layout has a fixed content width, so long body copy makes the modal taller, not wider.

**Text scale.** Content grows; the surface grows with it until it hits the viewport cap. Nothing clips, because nothing inside has a fixed height. At large scales a text dialog can reach the cap, at which point its content must scroll.

**Theme changes while open.** A modal open when the app switches between light and dark re-themes in place rather than staying frozen at the theme it opened with.

**One modal at a time.** A modal opened over a modal leaves the user with two blurs, two scrims, and no idea which question they are answering. If a decision leads to another decision, replace the content of the first.

## Content

**The heading is the question or the fact.** "Delete this device?" — not "Confirm deletion" and not "Warning". A user who reads only the heading should know what is being asked.

**The body names the consequence.** This is the sentence the modal exists for. "Its protection history will be lost. This can't be undone." State what is lost, and say plainly when something is irreversible.

**Button labels are the answers, not "OK" and "Cancel".** The confirming button restates the verb from the heading: "Delete", "Turn off", "Cancel subscription". "OK" forces the user to re-read the heading to find out what they are agreeing to, and it is the label most often clicked without reading.

**The dismissing label is genuinely neutral.** "Cancel" or "Keep device" — never a label that could be read as the destructive option. In a modal about cancelling a subscription, "Cancel" is ambiguous in the worst possible way; use "Keep my plan".

**One question per modal.** Two decisions in one surface produce an answer that means neither.

**A promotional modal states the offer and the price of declining, honestly.** The dismissing action is labelled "Not now", not "I don't want to be protected".

## Decision Tree

```
Must the user respond before anything else can happen?
├── No
│   ├── Something succeeded / a brief undoable event ──→ [[Snackbar]]
│   ├── A persistent condition on this screen ─────────→ [[Alert Banner]]
│   ├── Detail about one specific element ─────────────→ [[Popover]]
│   ├── A label for an icon or a terse control ────────→ [[Tooltip]]
│   └── A list of values or actions ───────────────────→ [[Menu]]
│
└── Yes — it blocks
    │
    ├── Is it one decision, statable in a heading + a sentence?
    │   ├── Yes ──────────────────────────────────────→ Modal
    │   └── No — multi-step, or a long list, or a form → [[Sheets]]
    │
    └── Is it a promotion the user did not ask for?
        └── Modal, gradient variant, close button mandatory

Which variant?
├── A decision with a consequence ────────→ text dialog
├── A decision needing custom content ────→ blank
├── An upsell or announcement ────────────→ gradient (promo)
└── An upsell with an illustration ───────→ gradient header (not implemented)
```

The most valuable route here is the first one. Most modals in most products should have been a [[Snackbar]] or an [[Alert Banner]]; the question "must the user respond before anything else can happen?" is what separates them, and the answer is usually no.

## Accessibility

| Requirement | Rule |
| --- | --- |
| Role | Announced as a dialog, so assistive tech enters dialog reading mode. |
| Announced on open | The heading is announced as the dialog's name when it appears. A modal that opens silently is a modal a screen-reader user does not know exists. |
| Route scope | The modal is its own scope; content behind it is not reachable. |
| Focus trap | Tab cycles within the modal only. |
| Focus return | On dismissal, focus goes back to the trigger. |
| Escape | Dismisses, always. |
| Parts announced separately | Heading, body, and each button are distinct nodes. |
| Close button | Announced with a localised label, not as an unnamed glyph. |
| Touch target | The close affordance is ≥ 48×48. |
| Automation id | Required on the surface; the close button composes from it. |

**"Announced on open" is the requirement most often missed and the one that matters most.** Without it the platform knows a route boundary exists but never reads the title, so the modal is silent until the user happens to tab into it — they are answering a question they were never asked. This means **every modal needs its heading passed as its accessible name**, not just rendered as text inside it.

**Each part must be its own node.** Left alone, a surface containing text and buttons collapses into one node — and because the buttons contribute a button role, the whole thing announces as a *single button* whose label has swallowed the heading and body. The result is a screen reader that reads the button labels and never the question. The parts are therefore split explicitly.

**Nothing behind the modal is reachable.** Not by Tab, not by swipe, not by pointer. A modal that blocks the pointer but not the keyboard is not modal.

## Anti-Patterns

**❌ A modal to confirm something that already succeeded.** The user has already moved on. → [[Snackbar]].

**❌ A modal to report a persistent condition.** It will be dismissed and forgotten while the condition remains. → [[Alert Banner]] on the surface the condition affects.

**❌ "OK" / "Cancel" on a destructive action.** The labels do not say what happens, so the user must re-read the heading — and usually does not. → Label the verb: "Delete", "Turn off".

**❌ A heading that is a topic.** "Device settings" asks nothing. → Ask the question: "Remove this device?"

**❌ A consequence left unstated.** "Are you sure?" tells the user nothing they can use. → Say what is lost and whether it is reversible.

**❌ Escape or the scrim performing the destructive action.** Dismissal must always mean "no". → Dismissal is always the safe path.

**❌ A modal with no way out.** Genuinely unrecoverable. → Always ship at least one exit; remove them all only for a truly mandatory choice.

**❌ A modal over a modal.** Two scrims, two questions, one confused user. → Replace the first modal's content.

**❌ A destructive confirmation on the gradient surface.** The brand gradient reads as celebratory. → Solid surface for decisions; gradient for promotion.

**❌ A form, a wizard, or a long list in a modal.** It will outgrow the surface and hit the viewport cap. → [[Sheets]].

**❌ Rendering the surface without opening it as a dialog.** You get the visuals and none of the scrim, focus trap, dismissal, or route semantics. → Present it properly; render it bare only to preview a layout.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmModal`, from `pegasus_flutter/lib/asm/components/modal.dart`.

Three entry points:

- `AsmModal.showStandard(...)` — heading, body, actions. Use this by default.
- `AsmModal.show(...)` — the same chrome with a caller-supplied `child`.
- `const AsmModal(...)` — the bare surface, **no scrim, no blur, no focus trap, no route**. For previewing a layout only.

### Standard text dialog

```dart
AsmModal.showStandard<bool>(
  context: context,
  header: 'Delete this device?',
  body: "Its protection history will be lost. This can't be undone.",
  primaryAction: AsmButton(
    label: 'Delete',
    onPressed: () => Navigator.of(context).pop(true),
    automationIdentifier: 'delete-device-confirm',
  ),
  secondaryAction: AsmButton(
    label: 'Cancel',
    variant: AsmButtonVariant.outlined,
    onPressed: () => Navigator.of(context).pop(false),
    automationIdentifier: 'delete-device-cancel',
  ),
  automationIdentifier: 'delete-device-modal',
);
```

`header` is passed straight through as `semanticLabel`, so the standard variant is announced on open for free. The close button's id is `'delete-device-modal-close'`.

**Actions render in the order `primaryAction` then `secondaryAction`, left to right** in a right-aligned row — so "Delete" sits to the *left* of "Cancel" above. Flag noted in [Open Items](#open-items); pass them deliberately.

### Custom content

```dart
AsmModal.show<void>(
  context: context,
  semanticLabel: 'Rename device',
  automationIdentifier: 'rename-device-modal',
  child: SizedBox(
    width: 396,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          // Leave room for the close button.
          padding: const EdgeInsets.only(right: 32),
          child: Text(
            'Rename device',
            style: context.asmTypographyTokens.headlineMediumEmphasized,
          ),
        ),
        SizedBox(height: AsmSpacingScale.s400),
        AsmTextField(
          label: 'Device name',
          automationIdentifier: 'rename-device-field',
        ),
        SizedBox(height: AsmSpacingScale.s800),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            AsmButton(
              label: 'Cancel',
              variant: AsmButtonVariant.outlined,
              onPressed: () => Navigator.of(context).pop(),
              automationIdentifier: 'rename-device-cancel',
            ),
            SizedBox(width: AsmSpacingScale.s300),
            AsmButton(
              label: 'Save',
              onPressed: _save,
              automationIdentifier: 'rename-device-save',
            ),
          ],
        ),
      ],
    ),
  ),
);
```

**`semanticLabel` is not optional in practice.** Omit it and the dialog opens silently — the route is never named, so nothing is announced. Always pass the heading.

### Promotional (gradient)

```dart
AsmModal.show<void>(
  context: context,
  gradient: context.asmExtendedColors.brandGradient,
  semanticLabel: 'Upgrade to Premium',
  automationIdentifier: 'upgrade-modal',
  child: SizedBox(
    width: 396,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Upgrade to Premium',
          style: context.asmTypographyTokens.headlineMediumEmphasized
              .copyWith(color: context.asmExtendedColors.white),
        ),
        SizedBox(height: AsmSpacingScale.s400),
        Text(
          'Protect every device on your plan.',
          style: context.asmTypographyTokens.bodyLarge
              .copyWith(color: context.asmExtendedColors.white),
        ),
      ],
    ),
  ),
);
```

Passing `gradient` fills the whole surface and flips the close glyph to white. **It does not re-colour your `child`** — do that yourself, as above. `showStandard` does handle it for you.

### A mandatory choice

```dart
AsmModal.showStandard<void>(
  context: context,
  header: 'Accept the updated terms?',
  body: 'You need to accept the updated terms to keep using protection.',
  showCloseButton: false,
  primaryAction: AsmButton(
    label: 'Accept',
    onPressed: _accept,
    automationIdentifier: 'terms-accept',
  ),
  secondaryAction: AsmButton(
    label: 'Sign out',
    variant: AsmButtonVariant.outlined,
    onPressed: _signOut,
    automationIdentifier: 'terms-sign-out',
  ),
  automationIdentifier: 'terms-modal',
);
```

`showCloseButton: false` removes the ✕. Note that **the scrim and Escape still dismiss** — see [Open Items](#open-items); `showStandard` does not expose `barrierDismissible`, and `show`'s flag does not actually block the scrim tap. Both exits still lead to a dismissal, so the caller must handle "dismissed without answering" as its own outcome.

### Parameter reference — `AsmModal` (the surface)

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `child` | `Widget` | Yes | — |
| `onClose` | `VoidCallback?` | No | `null` |
| `showCloseButton` | `bool` | No | `true` |
| `gradient` | `Gradient?` | No | `null` |
| `contentPadding` | `EdgeInsets` | No | `EdgeInsets.all(24)` |
| `semanticLabel` | `String?` | No | `null` |
| `automationIdentifier` | `String` | No | `'asm-modal'` |

### Parameter reference — `AsmModal.show<T>`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `context` | `BuildContext` | Yes | — |
| `child` | `Widget` | Yes | — |
| `showCloseButton` | `bool` | No | `true` |
| `barrierDismissible` | `bool` | No | `true` (see Open Items) |
| `gradient` | `Gradient?` | No | `null` |
| `contentPadding` | `EdgeInsets` | No | `EdgeInsets.all(24)` |
| `semanticLabel` | `String?` | No | `null` |
| `automationIdentifier` | `String` | No | `'asm-modal'` |

`onClose` is supplied for you and pops the route.

### Parameter reference — `AsmModal.showStandard<T>`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `context` | `BuildContext` | Yes | — |
| `header` | `String` | Yes | — |
| `body` | `String` | Yes | — |
| `primaryAction` | `Widget?` | No | `null` |
| `secondaryAction` | `Widget?` | No | `null` |
| `showCloseButton` | `bool` | No | `true` |
| `gradient` | `Gradient?` | No | `null` |
| `automationIdentifier` | `String` | No | `'asm-modal'` |

`semanticLabel` is set to `header` automatically. `contentPadding` and `barrierDismissible` are not exposed.

### Guidance

- **Always pass `semanticLabel`** when using `show`. It is the only thing that makes the dialog announce itself on open. `showStandard` does it from `header`.
- **Always pass a real `automationIdentifier`.** The default `'asm-modal'` collides across every modal in the app, and the close button inherits the collision.
- **Return a value through the route.** `show<T>` is a `Future<T?>`; pop with the answer and `await` it, rather than threading callbacks.
- **`showStandard` puts `primaryAction` first (leftmost).** Decide deliberately which button you want where; do not assume the confirming action lands on the right.
- **Re-colour your own children on a gradient.** Only `showStandard` flips text to white.
- **Leave room for the close button.** It is positioned over the top-right of your content, not above it. The standard layout insets its heading 32 on the right.
- **Do not render `const AsmModal(...)` as a page element.** It sets route-scoping semantics that only make sense inside a dialog route, and it has no scrim, blur, or focus trap.
- **Do not nest `show` calls.** Replace the content instead.
- **Handle "dismissed" as a distinct outcome.** The future completes with `null` on scrim tap, Escape, or ✕ — treat that as "no answer", never as a default yes.

---

## Rules

1. A modal MUST be reserved for a blocking decision or a message that must not be missed. NEVER use one for confirmation of success ([[Snackbar]]) or a persistent condition ([[Alert Banner]]).
2. The heading MUST state the question or the fact. NEVER a topic.
3. The body MUST name the consequence, and MUST say plainly when an action is irreversible.
4. Action labels MUST restate the verb. NEVER "OK" for a destructive action.
5. The dismissing label MUST be unambiguous — NEVER a label that could be read as confirming.
6. Dismissal — scrim, Escape, and ✕ — MUST always be the safe outcome. NEVER the destructive one.
7. A modal MUST have at least one exit. Exits are removed only for a genuinely mandatory choice, and then ALL of them are removed together.
8. A modal MUST ask exactly one question.
9. Escape MUST dismiss. The scrim MUST dismiss. Both MUST return focus to the trigger.
10. Focus MUST be trapped inside the modal; content behind MUST be unreachable by pointer and keyboard alike.
11. The modal MUST be announced as a dialog, and its heading MUST be announced when it opens.
12. The heading, the body, and each action MUST be separate nodes to assistive tech — NEVER one merged node.
13. The surface MUST be content-sized and MUST NOT exceed the viewport less 24 on each side.
14. Destructive confirmations MUST use the solid surface. The gradient variant is for promotion only.
15. Content on the gradient surface MUST be re-coloured for contrast.
16. Actions MUST be right-aligned, horizontal, and at most two.
17. A modal MUST NEVER open over another modal.
18. Forms, wizards, and long lists MUST go to [[Sheets]], not a modal.
19. Every modal MUST carry a caller-supplied automation identifier; the library default is NEVER acceptable in an app.

---

## Open Items

1. **`barrierDismissible: false` does not work.** The dialog is opened with a fully transparent barrier, and the scrim is drawn by the component's own full-screen layer — which wraps an unconditional tap handler that calls `onClose`. So the flag reaches the route (where it now governs nothing visible) while the outside tap dismisses regardless. A caller building a mandatory-choice modal will pass `barrierDismissible: false`, see the ✕ disappear with `showCloseButton: false`, and still have a modal that any stray tap dismisses. This is the most consequential defect in the component.

2. **`showStandard` does not expose `barrierDismissible` at all**, so even the non-functional flag is unreachable from the variant most callers use.

3. **The class doc's disabled-state claim is wrong.** It states "passing `onClose: null` omits the close button." It does not — `showCloseButton` controls omission. With `onClose: null` and `showCloseButton: true` (the default), the ✕ renders in its **disabled** state: visible, greyed, inert. On the bare surface, which is the only place `onClose` is caller-supplied, that is the default configuration. Stale doc comments are now recorded in six components ([[Alert Banner]], [[Switch]], [[Radio]], [[Skeleton Loader]], [[Date Picker]], and here).

4. **The gradient-header variant is not implemented.** Figma's `gradient-header` (`4649:2662`, 434 × 520) puts a 434 × 274 illustration band with a large headline across the top and the copy plus actions on solid surface below. The implementation's `gradient` parameter fills the *entire* surface, so this layout cannot be produced — and it is the upsell layout, i.e. the one design is most likely to ask for. It is also the only variant with a different width (434 vs 444).

5. **Figma's heading is one type step larger than the code's.** The `text-dialog` header resolves to `headline/large-emphasized` (32px, line-height 1.25 — the frame's 40px header box is exactly 32 × 1.25). The implementation uses `headlineMediumEmphasized` (28px, 1.3). A token for the Figma value exists (`headlineLargeEmphasized`) and is not used.

6. **Three spacing values in the standard layout disagree with Figma.**

   | Gap | Figma | Code |
   | --- | --- | --- |
   | Heading → body | 24 (header box ends at 40, body starts at 64) | 16 |
   | Body → actions | bottom-aligned in a fixed 270-tall slot | fixed 32 |
   | Between the two buttons | 8 | 12 |

   All three are bare literals rather than spacing tokens, which `95_figma_spacing.md` forbids. The body→actions difference is structural, not just a number: Figma's dialog is a fixed 318 tall with the buttons pinned to the bottom of the slot; the implementation is intrinsic-height with a fixed gap, so a one-line body produces a much shorter modal than the frame.

7. **Radius 28 is off the token scale.** Figma names it `Corner/Extra-large` = 28, but `AsmCornerRadii` jumps 24 → 32 with no 28, so the implementation hardcodes `BorderRadius.circular(28)`. This is the same missing token that forces [[Date Picker]]'s card to hardcode 28 in two separate files. **A named `r28` is missing upstream and two components are already working around it.**

8. **The standard layout's content width is a bare `SizedBox(width: 396)`.** No named constant, no sourcing comment — `95_figma_spacing.md` requires structural dimensions to be extracted and explained. The value is right (396 + 2×24 = Figma's 444); the code does not say so.

9. **The viewport cap branches on `MediaQuery.size`, which `90_responsiveness.md` prohibits.** `maxWidth: MediaQuery.of(context).size.width - 48` ignores the parent and would be wrong in a split view or an embedded window; the rule asks for `LayoutBuilder`. The `48` is also a bare literal (it is 24 per side — a spacing token exists). And there is no responsive behaviour beyond the cap: no mobile/desktop variants, no breakpoint constants, and Figma does not draw any either, so it is unclear whether the modal is meant to adapt at all.

10. **The blur sigma is an untokened literal.** `ImageFilter.blur(sigmaX: 30, sigmaY: 30)` with the scrim at `alpha: 0.20`. Figma's frame contains a `scrim` instance (`4102:23039`) whose values could not be resolved through the MCP, so neither number has a verified design source. Confirming this matters because the blur strength is what makes white-on-light content legible.

11. **The shadow is hand-written, and it re-applies alpha to a colour that already has it.** `colorScheme.shadow.withValues(alpha: 0.20)` — the Figma `md/sys/color/shadow` token is `#8e8e8e30`, which already carries 0.19 alpha. The named Figma effect is `elevation-5` (drop shadow, radius 20, spread 0, offset 0,0), and `assemble_tokens` ships exactly that as `AsmShadows.elevation5` (`context.asmShadows.elevation5`) — the modal does not use it, and neither does any other component: a grep of `lib/` finds **zero** usages of `AsmShadows`. Note also that the modal applies `0.20` where [[Menu]] applies `0.19` for the same `elevation-5` effect, and [[Elevation]] names the three shadows `subtle`/`light`/`heavy` while the token class names them `elevation1`/`elevation5`/`special`. See [[Popover]] for the full tally of hand-written shadows and their disagreements.

12. **`showStandard` renders `primaryAction` to the left of `secondaryAction`.** The row is right-aligned and iterates primary → secondary, so the confirming button ends up left of the dismissing one. Figma's `button container` holds two same-size instances with no readable ordering, so which is intended cannot be determined from the frame — but the platform convention on both macOS and Windows places the confirming action rightmost, and this is the opposite. Worth resolving with design, because it is the single most-clicked pair of buttons in the system.

13. **The close button's geometry differs from Figma's on three counts.** Figma draws a 52 × 52 `icon_button` instance inset ~13 from the right and 11 from the top. The implementation uses a plain Material `IconButton` with a 24 glyph and 8 padding, positioned 20/20. The glyph size is explained in the code — there is no `AsmIconButton` size that matches the design's close glyph — but the container size and inset are unexplained, and `20` is a bare literal where a spacing token exists. (The tap target itself clears the 48 floor: Material's `IconButton` keeps a 48 × 48 minimum, which the padding override does not remove.)

14. **The close button is a Material `IconButton`, not an `AsmIconButton`**, so it carries Material's focus and hover treatment rather than the branded focus ring `40_accessibility.md` requires. The class doc acknowledges this ("handled by the standard Material `IconButton`") — that is a documented deviation, not an oversight, but it means the one control present in every modal is the one control that does not use the system's focus indicator.

15. **Figma draws no focus state anywhere in the modal frame.** Consistent with every other component in this set: Figma does not draw focus. Only [[Divider]] and [[Progress Bar]] are cases where that absence is correct.

16. **The bare surface sets route semantics it cannot honour.** `const AsmModal(...)` sets `scopesRoute: true` and, with a `semanticLabel`, `namesRoute: true` — both of which describe a route boundary that does not exist when the widget is rendered inline. There is nothing to stop a caller doing this, and the class doc invites it ("render it directly in a tree to preview the layout").

17. **Nothing receives initial focus when the modal opens.** The route establishes a focus scope, so Tab will find the modal's controls, but focus starts nowhere in particular. A keyboard user must Tab at least once to discover what is focusable, and there is no `autofocus` on the primary action.

18. **Nothing prevents modal-over-modal.** The rule against it is documented here and nowhere enforced; `show` can be called from inside an open modal and will stack a second scrim and blur over the first.

19. **`contentPadding` is a token-escape-hatch parameter.** It takes an arbitrary `EdgeInsets`, defaulting to a hardcoded `EdgeInsets.all(24)` rather than a spacing token (Figma's `md/spacing/600` = 24 maps to `spacing600`). Escape-hatch parameters now recorded in six components ([[Switch]], [[Loaders]], [[Progress Bar]], [[Empty State]], and here).

20. **No motion tokens.** The 250ms fade is hardcoded. Now recorded in ten components.

21. **Long content cannot scroll.** The surface is capped at the viewport less 48 but its child is not scrollable, so content exceeding the cap overflows rather than scrolling. At 200% text scale a modest text dialog can reach that cap. `40_accessibility.md`'s text-scaling row is not satisfiable for a long body.
