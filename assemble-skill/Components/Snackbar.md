# Component: Snackbar

> Role: A brief, transient message that confirms something happened, surfaced above app content and dismissed by time rather than by the user. Optionally carries one action — almost always an undo or a retry.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A snackbar MUST NEVER be the only place a piece of information appears. It disappears on a timer, it is never focused, and a user who looked away has lost it — so nothing consequential and nothing actionable-only may live here.
> Source: Figma `Components` → `snackbar` (`4101-18884`, set `2891:2082`, variants `2891:2112` and `2891:2118`). Implementation: `pegasus_flutter/lib/asm/components/snackbar.dart` (`AsmSnackbar`, `AsmSnackbar.show`, `showAsmSnackbar`).

## Overview

A snackbar is the system saying "done" and then getting out of the way. It appears near the bottom of the screen after an action completes, states what happened in one line, and vanishes on its own. It does not block anything, it does not take focus, and it never asks a question.

**The defining property is that it is time-limited and unfocused.** Everything else follows from that. A snackbar is not a place to put an error the user must fix, a choice the user must make, or a state the user needs to refer back to — all of those outlive the four seconds it is on screen.

**It carries at most one action, and that action is a reversal.** "Undo," "Retry," "View." The action is an *offer*, not a requirement: the snackbar's timer will expire whether or not the user takes it, and the app must still be in a sensible state afterward. An action the user *must* take belongs in an [[Alert Banner]] or a [[Modal]].

**Snackbar vs. Alert Banner is the decision that matters,** and the split is duration, not severity:

| | Snackbar | [[Alert Banner]] |
| --- | --- | --- |
| Lifetime | Seconds, then gone | Until the condition clears or the user dismisses it |
| Anchored to | Nothing — floats above content | A screen or a region |
| Severity | None. One appearance. | Neutral / info / critical, colour-coded |
| Focus | Never takes it | Reachable, persistent |
| Carries | A statement about the past | A condition in the present |

"Profile saved" is a snackbar. "Your subscription expires in three days" is a banner. The test: **if the user comes back to this screen in a minute and the message should still be true and still visible, it is not a snackbar.**

**A note on the surface.** The snackbar is the one component in the system painted on `primary` — pure black in light mode, pure white in dark — with `on-primary` text. That inversion is deliberate: it separates the snackbar from every other surface without needing a border or a heavy shadow, and it makes the snackbar unmistakably not part of the page.

## Anatomy

```
   ╭──────────────────────────────────────────────────────╮
   │  Snackbar supporting text                            │   ← text only
   ╰──────────────────────────────────────────────────────╯
     └16┘                                            └16┘
     radius 4 · fill `primary` · elevation-1 · py 8


   ╭──────────────────────────────────────────────────────╮
   │  Snackbar supporting text          ( Action )        │   ← text + action
   ╰──────────────────────────────────────────────────────╯
                              └── 48 ──┘└─ pill, radius 100
                                          bold mono 12, underlined


   ╭──────────────────────────────────────────────────────╮
   │  Snackbar supporting text        ( Action )    ✕      │   ← + close
   ╰──────────────────────────────────────────────────────╯
                                                (not drawn in Figma)
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | `primary` fill, radius **4** — the tightest radius in the system, and the visual signal that this is chrome rather than content. `elevation-1` shadow. |
| **Message** | Yes | `body/mono/medium` — 14pt **mono**, `on-primary`. Left-aligned, takes the remaining width. |
| Action | Optional | A single control in a full pill (radius 100), 12pt **bold mono**, underlined, `on-primary`. Separated from the message by a **48** gap. |
| Close affordance | Optional | A ✕ at the trailing edge. **Declared as a Figma property but never drawn** — see [Open Items](#open-items). |
| Leading icon | **No** | The snackbar carries no icon. Severity is not a snackbar concept. |
| Title | **No** | One line of body text. No heading. |
| Second action | **No** | One action, maximum. |

**The message is set in mono, not the system face.** That is unusual — mono is elsewhere reserved for metadata, timestamps, and numerics — and it is another piece of the "this is chrome, not content" signal. It also means the message is *wider* per character than body text elsewhere, which is a reason to keep it short beyond the obvious ones.

**The action is underlined, always.** Not on hover, not on focus — always. On a black surface with white text and white action text, colour cannot distinguish the two, so the underline is the only affordance (WCAG 1.4.1). Removing it makes the action invisible.

**The 48 gap between message and action is not decorative.** It is the largest gap on the spacing scale, and it exists so a user reaching for "Undo" cannot mis-tap the message region, and so the eye does not read the action as the last word of the sentence.

## Sizes

| Property | Value |
| --- | --- |
| Min width | **240** |
| Max width | **480** |
| Horizontal padding | 16 (both sides) |
| Vertical padding | 8 |
| Corner radius | 4 |
| Height — text only | ~36 (content-driven) |
| Height — text + action | 52 |
| Message ↔ action gap | 48 |
| Action pill padding | 12 horizontal, 10 vertical |
| Shadow | `elevation-1` — 0 0, blur 4, spread 0, `shadow` |

**There is one size.** No compact, no large, no responsive variant. The 240–480 range is the whole story: the snackbar grows with its message up to 480 and then stops.

**480 is the cap, and it is low on purpose.** A snackbar wider than that reads as a bar across the screen rather than a transient object, and a message long enough to need more room is not a snackbar message. The implementation does not use this number — see [Open Items](#open-items).

**The height difference between the two variants is entirely the action pill.** Text-only is padding + one line of 14pt mono (8 + 19.6 + 8 ≈ 36). With an action, the 36-tall pill sets the height (8 + 36 + 8 = 52). Nothing about that is a fixed height — a message that wraps grows the surface.

## Variants

Figma models the snackbar on three properties:

| Property | Values in the file | Shipped in code |
| --- | --- | --- |
| `Configuration` | `Text only`, `Text & action` | **Both** |
| `# of lines` | `One line` | **Wrapping is implemented; no second variant to match** |
| `Show close affordance` | `False` | **`true` is implemented; never drawn** |

**Two of the three properties have exactly one value.** The design file declares a `# of lines` axis and a `Show close affordance` boolean and then ships no `Two line` and no `True` — the axes are stubs. This is the reverse of the usual gap in this system: **the implementation is ahead of the design**, supporting a close button and multi-line wrapping that were declared and then never drawn. Neither is specified, so neither is verifiable. See [Open Items](#open-items).

**Treat `Text only` as the default and `Text & action` as the exception.** Most snackbars are a confirmation with nothing to do about it. Adding an action puts the snackbar on a clock the user has to beat, which is the source of its worst accessibility problem ([Timing](#timing)).

## States

**The snackbar surface has no states.** It appears, it sits, it leaves. It is not hoverable, not focusable, not pressable, and there is no error or loading form of it.

The **action** has the full interactive state set:

| State | Treatment |
| --- | --- |
| Enabled | `on-primary` text, underlined, pill has no fill |
| Hover | `state/primary/hover` overlay fills the pill; pointer cursor |
| Pressed | `state/primary/pressed` overlay fills the pill |
| Focused | Branded focus ring around the pill |
| Disabled | Text at 38% opacity, not focusable, no overlay |

**The state overlays are drawn from the `primary` state ramp, not the surface ramp.** The snackbar's surface *is* `primary`, so a hover tint pulled from the usual `on-surface` ramp would be invisible on it. This is the same inversion the surface colour requires, applied to interaction.

**The close affordance, where implemented, carries the same states** — hover and pressed overlays in a circle rather than a pill, and the same focus ring.

**A disabled action in a snackbar is almost always a mistake.** The snackbar has four seconds; there is no scenario in which the right thing to show is an offer the user cannot accept. If the action is not available, do not render it.

## Timing

Timing is the snackbar's whole behaviour and its largest risk, so it gets its own section.

| Aspect | Value |
| --- | --- |
| Default on-screen duration | **4 seconds** |
| Extended when an action is present | **Not automatic** — the caller must pass a longer duration |
| Dismissal by the user | Only via the close affordance, where present |
| Paused on hover / focus | **No** |
| Extended under a reduced-motion or timing preference | **No** |
| Queueing | One at a time; a second snackbar replaces or waits |

**Four seconds is enough to read a confirmation and not enough to act on one.** A sighted mouse user needs roughly a second to notice the snackbar, a second to read it, and a second to travel to the action — which leaves nothing. A keyboard user has to Tab to the action from wherever focus currently is. A screen-reader user hears the message announced, then has to navigate to a control that may already be gone. This is why:

**A snackbar with an action MUST be given a longer duration — or none at all.** Material's own guidance and WCAG 2.2.1 (Timing Adjustable) point the same way: content that disappears on a timer must be extendable, pausable, or long enough not to matter. A four-second window on an actionable control satisfies none of the three. The practical rule for this system: **an actionable snackbar gets at least ten seconds, and a close affordance so the user can end it early.** A snackbar carrying an action the user genuinely needs should not be a snackbar at all.

**The timer does not pause on hover or on focus.** A user reading the message can watch it disappear mid-sentence. Nothing in the component addresses this; see [Open Items](#open-items).

**Never chain snackbars.** Two in a row means the first was not read. If an operation produces several confirmations, confirm the operation, not the steps.

## Behaviors

**It appears near the bottom of the screen, above app content.** It does not push layout, does not reflow anything, and floats over whatever is beneath it — including a [[Sheets|bottom sheet]] or a [[Modal]], which is usually a sign the message is in the wrong place.

**It never takes focus.** Focus stays exactly where the user left it. This is correct — stealing focus for a transient message is worse than the message being missed — and it is precisely why the action is hard to reach.

**It is announced politely, once, when it mounts.** A polite live region, so it does not interrupt whatever a screen reader is currently saying. The consequence is that the announcement may arrive several seconds after the snackbar did.

**One at a time.** A new snackbar replaces or queues behind the current one; two are never stacked.

**Long messages wrap.** The surface grows vertically; the action stays at the trailing edge and the surface no longer matches any drawn variant.

**It does not survive navigation.** A snackbar shown as the user leaves a screen is a snackbar the user will not see. Confirm before navigating, or confirm on the destination.

**Motion is a slide up and a fade out**, inherited from the platform. No duration or curve is specified anywhere in the system — see [Open Items](#open-items).

## Content

**One sentence, past tense, no period.** "Profile saved." → *Profile saved*. "Connection lost." → *Connection lost*. The snackbar is reporting, not conversing.

**Name the object.** "Saved" is not enough when three things on screen are saveable. "Profile saved" is.

**Never put a reason or a remedy in a snackbar.** "Couldn't save — check your connection and try again" is two pieces of information the user needs after the snackbar is gone. That is an [[Alert Banner]].

**The action label is one word, imperative, and describes the reversal.** *Undo*, *Retry*, *View*. Not "OK," not "Dismiss" (that is what the close affordance is for), and not a label that only makes sense together with the message.

**Do not use a snackbar for anything the user must acknowledge.** If the message would need an "OK," it needs a [[Modal]].

**Keep it inside the width.** The message is set in mono, so it consumes more width per character than body text elsewhere. At 480 max width and 14pt mono, that is roughly 40–45 characters before wrapping. Write to that, not to the wrap.

## Decision Tree

```
Does the user need to know something?
│
├── They need to act on it, or fix it
│   ├── It blocks everything until resolved ──────→ [[Modal]]
│   └── It is a condition on this screen ─────────→ [[Alert Banner]]
│
├── They need to refer back to it ────────────────→ [[Alert Banner]]
│
├── It is the status of one specific thing ───────→ [[Status Indicators]]
│
├── It is progress on something running ──────────→ [[Progress Bar]] or [[Loaders]]
│
├── It is a rating or comment prompt ─────────────→ [[Feedback]]
│
└── It is "that worked" / "that didn't", and
    nothing depends on them seeing it
    │
    ├── Is there a one-tap reversal worth offering?
    │   ├── Yes ──────────────────────────────────→ Snackbar + action
    │   │                                            (extend the duration)
    │   └── No ───────────────────────────────────→ Snackbar, text only
    │
    └── Would the user be stuck if they missed it?
        └── Yes ──────────────────────────────────→ NOT a snackbar
                                                     → [[Alert Banner]]
```

**The branch that gets skipped is the last one.** "Would the user be stuck if they missed it?" is the only question that matters, because a snackbar is *designed* to be missable. Every misuse of this component — errors in snackbars, required actions in snackbars, information the user has to remember in snackbars — is a failure to ask it.

## Accessibility

| Requirement | Behaviour |
| --- | --- |
| Announced | A polite live region; the message is read when the snackbar mounts |
| Focus | **Never taken.** Focus stays where the user left it |
| Action reachable | Tab-reachable, in the standard traversal order |
| Action activation | Enter / Space / NumpadEnter |
| Action role | An **action**, so it is announced as a button — see [Open Items](#open-items) |
| Focus ring | Branded ring on both the action and the close affordance |
| Touch target | ≥ 48×48 on both controls — **not met**, see [Open Items](#open-items) |
| Colour is not the only signal | The action is permanently underlined |
| Contrast | `primary` / `on-primary` — pure black-on-white or white-on-black in both modes |
| High contrast themes | Correct by construction — see below |
| Text scale | The message wraps and the surface grows; no fixed height |
| Timing | **The weak point.** See [Timing](#timing) |
| Automation id | Required on the surface; the action and close compose from it |

**A polite live region is the right choice and it has a cost.** Polite means the announcement waits for the screen reader to finish what it is saying. On a busy screen that can be several seconds — by which time a four-second snackbar has gone, action and all. This is the accessibility argument for the extended duration in [Timing](#timing), not a nicety.

**The snackbar is one of the few components that is high-contrast-correct without a special case.** Everything it paints comes from `primary` / `on-primary` / the `primary` state ramp — all standard scheme slots, all remapped by the OS contrast-theme pipeline. Components that reach for extended severity colours ([[Alert Banner]] is the clear case) have to collapse to a scheme-slot pair under high contrast; the snackbar has nothing to collapse.

**Never rely on the announcement being heard.** A message that must reach the user is not a snackbar. This is the accessibility restatement of the banner rule at the top of this doc, and it is the single most important thing on this page.

## Anti-Patterns

**❌ An error the user must fix, in a snackbar.** It disappears, taking the remedy with it. → [[Alert Banner]].

**❌ A required action in a snackbar.** The user will miss it. → [[Modal]] or [[Alert Banner]].

**❌ An actionable snackbar at the default four seconds.** Nobody can reach the action, least of all a keyboard or screen-reader user. → Extend the duration and add a close affordance.

**❌ Two actions.** → One, and it is a reversal.

**❌ "OK" or "Dismiss" as the action.** The snackbar dismisses itself; an acknowledgement means it should have been a [[Modal]].

**❌ A title, an icon, or severity colour.** Those are [[Alert Banner]] properties. A snackbar has one appearance.

**❌ Two snackbars in a row.** → Confirm the operation, not each step.

**❌ A snackbar shown as the user navigates away.** → Confirm on the destination.

**❌ A paragraph in a snackbar.** At 480 max width in mono it wraps into a block that no longer reads as transient. → One sentence.

**❌ A snackbar over a [[Modal]] or a [[Sheets|sheet]].** The message belongs inside the surface the user is looking at.

**❌ Relying on the snackbar as the record of what happened.** → Reflect the change in the UI itself; the snackbar only narrates it.

**❌ Using a snackbar because the message did not fit anywhere else.** That is a layout problem, not a snackbar.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

`AsmSnackbar` is **the content widget only** — it paints its own surface and acts as its own live region, but it does not position itself, time itself, or dismiss itself. Presentation is `ScaffoldMessenger`'s job, and two helpers wire it up.

```dart
import 'package:pegasus_flutter/assemble.dart';
```

### Showing one

```dart
AsmSnackbar.show(
  context,
  message: 'Profile saved',
  automationIdentifier: 'profile-saved-snackbar',
);
```

`AsmSnackbar.show` calls `ScaffoldMessenger.of(context).showSnackBar` with a floating `SnackBar` whose background is transparent and whose elevation is zero, so the Assemble surface shows through instead of Material's chrome. It returns the `ScaffoldFeatureController`, so a caller can `await controller.closed` or dismiss it programmatically.

`showAsmSnackbar(context, message: …)` is a free-function alias for the same thing, mirroring `showDialog` / `showModalBottomSheet` / `showAsmBottomSheet`. Identical behaviour; pick whichever reads better at the call site.

### With an action — and a duration that makes it reachable

```dart
final messenger = ScaffoldMessenger.of(context);
AsmSnackbar.show(
  context,
  message: 'Connection lost',
  actionLabel: 'Retry',
  onActionPressed: _retry,
  onClosePressed: messenger.hideCurrentSnackBar,
  duration: const Duration(seconds: 10),
  automationIdentifier: 'connection-lost-snackbar',
);
```

**The `duration:` line is not optional in practice.** `defaultDuration` is 4 seconds; leaving it at the default with an action attached ships a control nobody can reach. Pair the longer duration with `onClosePressed` so a user who has read the message can end it early.

### Parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `message` | `String` | required | Asserted non-empty. Wraps when it exceeds the width. |
| `actionLabel` | `String?` | `null` | `null` omits the action. Asserted non-empty when provided. |
| `onActionPressed` | `VoidCallback?` | `null` | Ignored when `actionLabel` is `null`. Passing `null` **with** a label renders the action **disabled**, not absent. |
| `onClosePressed` | `VoidCallback?` | `null` | `null` **omits** the close button entirely — unlike [[Sheets]] and [[Modal]], where `null` disables it. |
| `closeSemanticLabel` | `String` | `'Dismiss'` | Spoken label for the close button. |
| `semanticLabel` | `String?` | `null` | Overrides the announced text when `message` is too terse out of context. `null` inherits `message`. |
| `automationIdentifier` | `String` | `'asm-snackbar'` | Prefix. Action composes `'<id>-action'`, close composes `'<id>-close'`. |
| `duration` | `Duration` | `AsmSnackbar.defaultDuration` (4s) | On `show` / `showAsmSnackbar` only — the widget itself has no timer. |

### Tokens

| Element | Token |
| --- | --- |
| Surface fill | `colorScheme.primary` |
| Message + action + close colour | `colorScheme.onPrimary` |
| Message style | `context.asmTypographyTokens.bodyMonoMedium` |
| Corner radius | `AsmCornerRadii.r4` |
| Action pill radius | `AsmCornerRadii.r999` |
| Horizontal padding | `spacing.spacing400` (16) |
| Message vertical padding | `spacing.spacing300` (12) with a trailing control, `spacing200` (8) without |
| Message ↔ action gap | `AsmSpacingScale.s1200` (48) |
| Min height | `AsmSpacingScale.s1200` (48) with a trailing control, `s900` (36) without |
| Hover / pressed overlay | `AsmStateColors.of(context).primary.hover` / `.pressed` |
| Disabled action | `onPrimary` at `alpha: 0.38` |
| Shadow | Hand-written `BoxShadow(color: colorScheme.shadow, blurRadius: 4)` — see [Open Items](#open-items) |

### Guidance

- **Always pass a real `automationIdentifier`.** The `'asm-snackbar'` default is shared, so two snackbars in one flow collide on it and on their composed `-action` / `-close` ids.
- **`onClosePressed: null` omits the close button; `onActionPressed: null` with a label disables the action.** The two nullable handlers behave differently. Omit the action by omitting `actionLabel`.
- **A common `onClosePressed` is `ScaffoldMessenger.of(context).hideCurrentSnackBar`** — capture the messenger before the async gap rather than reading `context` inside the callback.
- **Use `semanticLabel` when the message only makes sense in context.** "Saved" announced on its own tells a screen-reader user nothing; `semanticLabel: 'Profile saved'` fixes it without lengthening the visible text.
- **Do not wrap `AsmSnackbar` in your own `SnackBar` unless you need custom positioning.** `show` already sets `backgroundColor: Colors.transparent`, `elevation: 0`, and `SnackBarBehavior.floating`; re-doing it by hand is where Material's grey chrome leaks back in.
- **Constrain the width yourself if you need Figma fidelity.** The shipped max width is not the specified one — see [Open Items](#open-items).
- **The widget alone has no timer, no position, and no dismissal.** Rendering `AsmSnackbar` directly in a tree gives a static black bar. That is occasionally what you want in a documentation page; it is never what you want in a product.

---

## Rules

1. A snackbar MUST NEVER be the only place information appears.
2. A snackbar MUST NEVER carry an error the user has to fix, a choice the user has to make, or anything the user must acknowledge.
3. A snackbar MUST carry at most ONE action, and that action MUST be a reversal or a retry.
4. A snackbar with an action MUST be given a duration long enough to reach it — at minimum ten seconds — and SHOULD also expose a close affordance.
5. The app MUST remain in a correct state whether or not the action is taken.
6. The action MUST be permanently underlined. Colour MUST NEVER be its only affordance.
7. The action MUST be announced as a button, MUST be Tab-reachable, and MUST activate on Enter and Space.
8. A snackbar MUST NEVER take focus.
9. A snackbar MUST be announced as a **polite** live region — never assertive.
10. A snackbar MUST NEVER show a title, an icon, or severity colour. Those are [[Alert Banner]] properties.
11. Only ONE snackbar MUST be on screen at a time. Snackbars MUST NEVER be chained.
12. The message MUST be one sentence, past tense, naming the object it refers to.
13. The message MUST NOT contain a reason or a remedy.
14. A snackbar MUST NOT be shown as the user navigates away from the screen.
15. A snackbar MUST NOT appear over a [[Modal]] or a [[Sheets|sheet]].
16. Interactive targets in a snackbar MUST be at least 48×48.
17. Nothing in the snackbar MUST have a fixed height — the message wraps and the surface grows.
18. A disabled action MUST NOT be rendered. If the action is unavailable, omit it.
19. Every snackbar MUST carry a per-instance `automationIdentifier`; the action and close MUST compose from it.
20. If the user would be stuck having missed the message, it MUST NOT be a snackbar.

---

## Open Items

1. **The shipped width constraints do not match Figma, and the comment above them claims they do.** The code declares `_minWidth = 300` and `_maxWidth = 988` under the comment *"Width constraints per Figma `snackbar` spec."* The Figma set specifies `min-w-[240px]` and `max-w-[480px]`. The maximum is **more than double** the designed cap — a long message renders as a 988-wide bar across a desktop window, which is exactly the "reads as a bar, not a transient object" failure the 480 cap exists to prevent. The minimum is 60 over. Neither number appears anywhere in the design file; 988 looks like a value from an earlier frame. Either the frame is stale or the implementation is — this needs a decision before anyone treats either number as authoritative.

2. **Figma declares a `Show close affordance` property and never draws `True`.** The component set has three properties; `Show close affordance` has exactly one value (`False`) and `# of lines` has exactly one value (`One line`). So the close button — which the implementation ships, positions, styles, and gives a semantic label — has **no design source at all**. Its size, its inset, its spacing relative to the action, and whether it even belongs beside an action are all engineering decisions. Same for multi-line: the axis was declared, no `Two line` variant exists, and the implementation's wrapping behaviour is unspecified. This is the inverse of the usual gap in this system, where design draws variants nobody implements ([[Modal]]'s gradient header, [[Sheets]]'s illustration header). Here **the implementation is ahead of the file.**

3. **The close button's touch target is 40×40, and the code comment says so.** `_SnackbarCloseButton` uses a 24pt glyph with 8pt padding and the comment reads *"keeps the hit area at 40×40 … without forcing the snackbar height to grow."* `40_accessibility.md` requires 48×48. The tradeoff is stated honestly — a 48 target would push the surface past its 52 height — but it is a live WCAG 2.5.8 failure on a control whose entire purpose is to give the user a way to dismiss a timed message early. The fix is a hit region that extends beyond the visual bounds rather than a bigger glyph; it does not require the surface to grow. **This is the fifth component found below the touch floor**, after [[Switch]], [[Date Picker]], [[Menu]]'s compact density, and [[Sheets]]'s close button — enough of a pattern to be a system-level item rather than five separate bugs.

4. **The action is announced as a link, but it is a button.** The implementation sets `Semantics(link: true, button: false)`. Figma models it as an instance of `Inverse-button` — a **text button** component whose description reads *"Text buttons are low-emphasis buttons… used for the lowest priority actions."* Semantically the design is right: "Undo" and "Retry" perform an action, they do not navigate. A screen-reader user hearing "Undo, link" expects to go somewhere. The underline is what led to the link role, but the underline here is a contrast affordance (white on black, no colour to distinguish), not a hyperlink signal. The component registry note *"Action link = mono/**bold** in a rounded-100 pill; not `AsmLink`"* correctly says it is not an `AsmLink` and then the code announces it as one anyway.

5. **The action sits 12pt further from the message than Figma draws, and 12pt further from the right edge.** `_SnackbarAction` wraps its pill in `Padding(horizontal: spacing300)` **outside** the pill, on top of the 48 gap and inside the surface's 16 padding — so the rendered gap is 60 and the right inset is 28. The Figma instance is 68 wide at x=267 inside a 351-wide symbol: message ends at 219, so the gap is exactly **48**, and the right inset is exactly **16**. The pill's own 12 padding is already accounted for in the 68. The code comment justifies the extra padding as *"outer `cta` wrapper has `px-[12]`, inner `state-layer` has `px-[12] py-[10]`"* — but the measured 68 (12 + ~44 text + 12) leaves no room for a second 12 per side, and pulling `2891:2114` directly shows one padded layer, not two. The extra padding also means the interactive pill is correctly sized while the layout around it is not.

6. **The surface renders 4pt shorter than Figma when an action is present.** Figma's `Text & action` symbol is **52** tall (8 + 36 pill + 8). The implementation clamps to `AsmSpacingScale.s1200` = **48** and lets `IntrinsicHeight` decide above that; the content measures ~43.6, so 48 is what renders. The text-only variant is correct (36 vs Figma's ~35.6). 52 is not on the 4pt spacing scale in a way `AsmSpacingScale` reaches directly, which is presumably why 48 was chosen — but the result is a snackbar that is visibly shorter than the design and an action pill that has 6 rather than 8 clearance.

7. **The doc comment claims "10 px right padding"; the code applies 16 to both sides.** `EdgeInsets.symmetric(horizontal: spacing400)`. Figma also specifies 16 both sides, so the **code is right and its own documentation is wrong**. Ninth component with a doc comment that misdescribes its behaviour, after [[Alert Banner]], [[Switch]], [[Radio]], [[Skeleton Loader]], [[Date Picker]], [[Menu]], [[Modal]], [[Scrollbar]], and [[Sheets]] — this is now frequent enough that the class doc comments should not be trusted as a source when writing these docs.

8. **Figma inverts the two variants' cross-axis alignment relative to the implementation.** The file gives `Text & action` `items-center` and `Text only` `items-start`; the code uses `start` when a trailing control is present and `center` when it is not — exactly reversed. It then re-creates the centring with `_trailingTopInset = 4`, a named constant whose comment says it was *"picked so the row … visually aligns with the first line of [message]."* A magic 4pt offset replacing the alignment the design specifies. For single-line content the visual result is close, and top-alignment is arguably better for a wrapped message — but since multi-line is undesigned, there is nothing to check that against.

9. **The action's text style is hand-written because the token for it does not exist.** `_SnackbarAction` builds a raw `TextStyle(fontFamily: AsmFontFamilies.mono, fontWeight: FontWeight.w700, fontSize: 12, height: 1.3, letterSpacing: 0.06)`. The nearest shipped token is `labelMediumMonoEmphasized` — also 12pt bold mono, but with `height: 1.0` and no letter spacing, so it is not the same style. Figma calls the style `body/mono/small` and then overrides the weight to Bold in the text node, meaning **the design file has no bold-mono-12 body style either** — it is a local override. The system is missing `body/mono/small-emphasized` at both ends. Note also that the mono ramps live in a hand-maintained `extension AsmMonoTypography` because the upstream typescale generator does not emit them.

10. **The shadow is hand-written when the exact token exists — and the blur value here resolves a conflict recorded elsewhere.** The snackbar builds `BoxShadow(color: colorScheme.shadow, blurRadius: 4)`. `context.asmShadows.elevation1` is precisely that. More usefully, this frame settles the three-way blur disagreement first recorded in [[Popover]]: Figma's `elevation-1` variable is `radius: 4`, and Figma's own style export of the very same node renders that shadow at a blur of `2`. **The style export halves Figma's blur radius; Flutter's `blurRadius` maps to the Figma radius directly.** So the snackbar's `4` is correct, and `AsmCard`'s `blurRadius: 2` — written with a comment explaining that it halved the value it read — is confirmed to be **half the intended blur**. That makes this a concrete bug in `AsmCard` rather than an ambiguity. Note too that the snackbar applies **no** alpha to `colorScheme.shadow`, where [[Menu]] applies `0.19` and [[Modal]] applies `0.20` to the same already-transparent `#8e8e8e30` token — the snackbar's treatment is the correct one, and it is a fourth distinct handling of one shadow. `AsmShadows` still has **zero** usages repo-wide.

11. **Nothing pauses or extends the timer.** No pause on hover, no pause on focus, no extension when a screen reader is active, and no response to an OS "longer timeouts" preference. `defaultDuration` is 4 seconds unconditionally, including when an action is present — the class doc *suggests* passing a longer duration in that case but nothing enforces or defaults it. Under WCAG 2.2.1 a timed, actionable control needs to be pausable, extendable, or long enough to be exempt, and none of the three holds. The lowest-cost fix is to derive the default from the presence of an action.

12. **No motion tokens.** Entry and exit are Material's `SnackBar` transition; Figma specifies no duration or curve. Thirteenth-plus component with undocumented motion.

13. **`_minWidth`, `_maxWidth`, `_trailingTopInset`, `_padding`, `blurRadius: 4`, `fontSize: 12`, and the close glyph's `size: 24` are all bare or locally-named numbers.** Four are extracted into named constants with comments, which is what `95_figma_spacing.md` asks for — but two of those comments cite a Figma spec that says something else, and the raw `4`, `12`, and `24` inside `build()` are not extracted at all. The 24 glyph and the 4 blur both have token equivalents.

14. **No positioning specification.** Figma's component description says snackbars *"appear temporarily, towards the bottom of the screen"* and nothing more — no offset, no margin, no behaviour relative to a bottom navigation bar, a [[Sheets|bottom sheet]], or the safe area. `AsmSnackbar.show` passes `SnackBarBehavior.floating` and inherits Material's margins. So where a McAfee snackbar actually sits is a Flutter default, not a design decision.

15. **Not used anywhere in the repo outside its widgetbook story.** `AsmSnackbar` appears in `asm_snackbar_stories.dart`, in a token story, and in three doc comments elsewhere; there is no in-repo product call site. The real consumer is `mcafee-eng/mac-safetycompanion`, so the width, duration, and touch-target items above are worth checking against actual usage there before anyone changes the defaults.
