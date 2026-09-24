# Component: Alert Banner

> Role: A compact, dismissable message anchored to a region. Communicates a persistent condition; never confirms an action.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: An alert banner is for a condition that PERSISTS. If the message should disappear on its own, use a [[Snackbar]].
> Source: Figma `Components` → `alert_banner` (node `7902-2234`). Implementation: `pegasus_flutter/lib/asm/components/alert_banner.dart`.

## Overview

An alert banner is a single-line-first strip carrying a short message, an optional action, and an optional dismiss control. It sits anchored to the top or bottom of a region and stays there.

**Persistence is the defining property.** A banner does not time out. It remains until the condition resolves or the user dismisses it — which makes it right for "Trial ends in 11 days" and wrong for "Changes saved."

Three components occupy adjacent ground, and picking the wrong one is the most common error:

| Use | When |
| --- | --- |
| **Alert banner** | A persistent condition affecting a region. Short message, at most one action. |
| **[[Snackbar]]** | Transient confirmation of something that just happened. Self-dismisses. |
| **[[Alert Card]]** | Severity-driven incident UI with rich content, multiple actions, or detail. |

If the message needs more than a sentence and one link, it has outgrown this component.

## Anatomy

```
┌────────────────────────────────────────────────────────────────┐
│  ◇  Trial ends in 11 days              View plans      ✕       │
└────────────────────────────────────────────────────────────────┘
    ↑         ↑                              ↑             ↑
  icon      title                        action link    close
 (18px)   (required)                     (optional)   (optional, 20px)
```

| Part | Required | Notes |
| --- | --- | --- |
| **Leading icon** | Yes | 18px. Signals severity alongside color. Defaults to a bell-with-exclamation. |
| **Title** | **Yes** | Non-empty. 14px bold. Wraps; never truncates. |
| **Action link** | No | Underlined text link. At most one. |
| **Close button** | No | 20px ✕. Omitted entirely when no dismiss handler is given. |
| **Container** | — | 8px radius, 12px padding, 44px minimum height. |

**The icon is always present**, and that is an accessibility requirement rather than a decorative choice: it carries severity so that color is not the only signal. Never remove it.

**The action is a link, not a button.** It is underlined at rest, and the underline thickens on hover. This is deliberate — a banner action is low-emphasis by design, and a [[Button]] inside a 44px strip would dominate the message it's meant to support.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Minimum height | 44 | — see [Open Items](#open-items) |
| Padding | 12 all sides | `md.spacing.300` |
| Corner radius | 8 | `md.border.radius.*` |
| Icon-to-title gap | 8 | `md.spacing.200` |
| Gap before trailing cluster | 12 | `md.spacing.300` |
| Gap between link and close | 16 | `md.spacing.400` |
| Leading icon | 18 | — |
| Close glyph | 20 | — |
| Title style | 14 bold | `body.medium` emphasized |

The 44px minimum is the single-line case: a 19.6px line box plus 12px top and bottom padding. A wrapping title grows the banner past it; nothing shrinks below it.

## Modes

Five modes. The mode carries severity.

| Mode | Fill | Content | Meaning |
| --- | --- | --- | --- |
| **neutral** | Transparent + 1px `on-surface-variant` border | `on-surface-variant` | Informational, lowest emphasis. **Default.** |
| **info** | `secondary` | `on-secondary` | Noteworthy information |
| **critical** | `error` | `on-secondary` | Something is wrong and needs attention |
| **positive** | `extended.positive` | `on-secondary` | Something succeeded or is healthy |
| **status** | `extended.attention` | `on-secondary` | A warning or in-between condition |

**`neutral` is the only outlined mode** — it has no fill at all, just a border, so it reads as the quietest of the five and inherits whatever surface it sits on. The other four are solid fills with no border.

**`neutral` is the default, and usually the right choice.** A page where every banner is `critical` has no severity signal left. Reserve `critical` for conditions that genuinely block or endanger, and treat `status` as the warning tier below it.

**Severity must never rest on color alone.** Each mode should pair with an icon that matches its meaning and copy that states the condition. A `critical` banner whose title reads "Notice" and whose icon is the default bell is red and nothing else — which is invisible to a color-blind user and to anyone under a high-contrast theme, where all five modes collapse to one appearance.

### High contrast collapses every mode

Under an active OS contrast theme, all five modes render identically: a `surface` fill, `on-surface` content, and an `outline` border. The severity fills are tuned for the standard palette and are not remapped by the high-contrast system, so using them would ignore the user's chosen contrast theme and can fall below required contrast.

The consequence is worth stating plainly: **under high contrast, mode conveys nothing.** Icon and copy are the only severity signals left, which is the strongest argument for making both of them carry the meaning on their own.

## States

The banner container is not interactive. Its two controls each follow [[States]].

**Action link:** hover thickens its underline from 1px to 2px; keyboard focus draws the branded ring with a 4px radius; disabled drops it to 38% of the content color. The link uses no state layer — its feedback is the underline and the ring.

**Close button:** keyboard focus draws the branded ring. It has no hover tint.

Both controls are disabled by removing their handler, and a disabled control is announced as disabled and left out of the tab order.

**A banner with an action label but no handler renders a disabled link.** That's rarely intended — if the action isn't available, omit the label.

## Behaviors

**The banner is responsive, and the arrangement changes with the title length.** This is the component's one genuinely surprising behavior:

**Single-line title** — the action link stays pinned right, beside the close button:

```
┌──────────────────────────────────────────────────────────┐
│  ◇  Trial ends in 11 days           View plans     ✕     │
└──────────────────────────────────────────────────────────┘
```

**Wrapping title** — the link flows inline after the text, a small gap past the last word, baseline-aligned so it reads as part of the same sentence. The close button stays anchored top-right:

```
┌──────────────────────────────────────────────────────────┐
│  ◇  Your subscription expires in 11 days and some    ✕    │
│     features will stop working  View plans                │
└──────────────────────────────────────────────────────────┘
```

The switch is decided by measuring whether the title fits on one line in the space the pinned arrangement would leave it. So it depends on the title, the action label's width, whether a close button is present, the text scale, and the banner's own width — not on a breakpoint. A title that fits at one width will reflow at another.

Two consequences for authors:

- **Don't design around one arrangement.** The same banner will render both ways depending on its container. See [[Breakpoints]] — the banner responds to its own width, not the window's.
- **Keep the action label short.** A long label eats the title's budget and pushes it into the wrapped arrangement sooner.

**Titles wrap; they never truncate.** The banner grows. Long messages are legible, just tall — which is the correct failure mode, but also a signal the message is too long for a banner.

**The banner does not dismiss itself and does not manage its own visibility.** Providing a close handler renders the ✕; actually removing the banner is the caller's job. A ✕ that visibly does nothing is worse than no ✕.

**Only one action is supported.** If the condition needs two, it belongs in an [[Alert Card]] or a [[Modal]].

**No entry or exit animation** is built in. Appearance and removal are instant unless the surrounding layout animates them.

## Content

**The title states the condition, not the fact that there is one.** "Trial ends in 11 days" beats "Notice about your trial" — the useful information is the condition itself.

- Non-empty, always. Enforced.
- One sentence. If it needs two, use an [[Alert Card]].
- No terminal period — it's a fragment, and in the wrapped arrangement it runs directly into the action link.
- State the condition, not the severity: the mode and icon already carry that. "Payment failed", not "Error: there was a problem".

**The action label is a verb phrase** naming what it does: "View plans", "Retry", "Update payment". Never "Click here" or "Learn more" with no object. Keep it to one or two words — it competes with the title for width.

**The close button's announced label defaults to "Dismiss"** and should be overridden for localization.

## Decision Tree

```
Should the message disappear on its own?
├── yes ─────────────────────────────────────→ [[Snackbar]]
└── no — it persists until the condition clears
    │
    ├── Does it need more than one sentence, or more than one action?
    │   └── yes ────────────────────────────→ [[Alert Card]]
    │
    ├── Must the user respond before continuing?
    │   └── yes ────────────────────────────→ [[Modal]]
    │
    ├── Is it about one specific field in a form?
    │   └── yes ────────────────────────────→ the field's own error state ([[Text Fields]])
    │
    └── A short persistent condition affecting a region?
        └── ALERT BANNER
            │
            └── Pick the mode by severity:
                ├── informational, low emphasis ────→ neutral (default)
                ├── noteworthy information ─────────→ info
                ├── a warning / in-between state ───→ status
                ├── something succeeded ────────────→ positive
                └── something is wrong ─────────────→ critical
```

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announced on appearance** | The container is a polite live region, so a newly mounted banner is read out. |
| **Title is announced** | Exposed as its own semantics node, separate from the controls. |
| **Link role** | The action is announced as a link, not a button. |
| **Button role** | The close control is announced as a button with its dismiss label. |
| **Keyboard activation** | Enter, Space, Numpad Enter on both controls. |
| **Tab-reachable** | Both controls are tab stops in visual order. |
| **Visible focus** | Branded ring on each control, keyboard-only. |
| **Underline on the link** | Always visible, so color is not the sole affordance. |
| **Touch target** | The close button's hit area spans the banner's vertical padding to clear the floor. |
| **High contrast** | Every mode collapses to one contrast-correct pair. |
| **Automation identifier** | A prefix on the banner; controls compose `-action` and `-close`. |

**The live region is the reason this component works for screen-reader users.** A banner that appears in response to something — a failed payment, an expiring trial — is announced without the user having to go looking for it. Don't defeat this by rendering the banner mounted-but-invisible and revealing it later; the announcement fires on mount.

**The title is deliberately kept as a separate semantics node.** Collapsing it into the container's label caused a real, platform-specific bug: Windows Narrator navigates directly to focusable children and never announces the group name, so the banner's text went completely unread (macOS VoiceOver read the merged group, which is why it only reproduced on Windows). If you wrap a banner in your own semantics, you can reintroduce exactly this failure.

**Severity is never carried by color alone**, per [[States]] and WCAG 1.4.1 — the icon and copy must carry it too. Under high contrast this is not a nicety; it is the only remaining signal.

**Automation identifiers compose from the banner's prefix.** Pass a per-instance prefix and the controls derive `-action` and `-close` from it, so two banners on one screen don't collide. See [[Button]] for the three-string-slots distinction.

## Anti-Patterns

**❌ Using a banner for transient confirmation.** "Saved" doesn't need to persist. → [[Snackbar]].

**❌ Everything is `critical`.** Severity inflation leaves no signal. → `neutral` by default; reserve `critical`.

**❌ Relying on the mode's color to carry severity.** Invisible to color-blind users and erased entirely under high contrast. → Match the icon and copy to the severity.

**❌ Removing the leading icon.** It's the non-color severity signal. → Always keep it.

**❌ A ✕ that doesn't remove the banner.** Providing the handler renders the control; the caller must actually dismiss. → Wire dismissal, or omit the handler.

**❌ More than one action.** → An [[Alert Card]] or [[Modal]].

**❌ A [[Button]] instead of the action link.** → The link is the API and the correct emphasis.

**❌ A paragraph as the title.** It will wrap and grow, legibly and wrongly. → One sentence, or an [[Alert Card]].

**❌ A long action label.** It eats the title's width and forces the wrapped arrangement early. → One or two words.

**❌ A terminal period on the title.** In the wrapped arrangement it collides with the link. → No period.

**❌ An action label with no handler.** Renders a disabled link. → Omit the label instead.

**❌ Wrapping the banner in your own semantics.** Reintroduces the Windows Narrator bug where the title goes unread. → Leave the semantics alone.

**❌ Field-specific validation in a banner.** → The field's own error state; see [[Text Fields]].

**❌ Stacking multiple banners.** Two banners in a region means neither is read. → One at a time, most severe first.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmAlertBanner`, from `pegasus_flutter/lib/asm/components/alert_banner.dart`.

```dart
enum AsmAlertBannerMode { neutral, info, critical, positive, status }
```

`AsmAlertBanner` is stateless and does not manage its own visibility — the caller owns whether it is in the tree.

### Basic usage

```dart
AsmAlertBanner(
  title: 'Trial ends in 11 days',
  mode: AsmAlertBannerMode.status,
  icon: Icons.schedule,
  actionLabel: 'View plans',
  onActionPressed: _openPlans,
  automationIdentifier: 'trial-expiry-banner',
);
```

Only `title` is required. `mode` defaults to `neutral` and `icon` to `Icons.notification_important`.

### Dismissable

```dart
class _MyScreenState extends State<MyScreen> {
  bool _showBanner = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_showBanner)
          AsmAlertBanner(
            title: 'Payment method expires this month',
            mode: AsmAlertBannerMode.critical,
            icon: Icons.credit_card_off,
            actionLabel: 'Update',
            onActionPressed: _updatePayment,
            onClosePressed: () => setState(() => _showBanner = false),
            automationIdentifier: 'payment-expiry-banner',
          ),
        // …
      ],
    );
  }
}
```

**`onClosePressed` renders the ✕ but does not remove the banner** — the handler must do that. Passing `null` omits the close button entirely.

### Message only

```dart
AsmAlertBanner(
  title: 'Scanning 1,204 files',
  mode: AsmAlertBannerMode.info,
  icon: Icons.search,
  automationIdentifier: 'scan-progress-banner',
);
```

Both the action and the close button are optional; a banner can be message-only.

### Overriding the announced text

```dart
AsmAlertBanner(
  title: '3 issues',
  semanticLabel: '3 security issues found on this device',
  mode: AsmAlertBannerMode.critical,
  icon: Icons.warning_amber,
  actionLabel: 'Review',
  onActionPressed: _review,
  automationIdentifier: 'device-issues-banner',
);
```

`semanticLabel` changes only the announced text; the visible title is unchanged.

### Localizing the dismiss label

```dart
AsmAlertBanner(
  title: 'Backup paused',
  onClosePressed: _dismiss,
  closeSemanticLabel: AppLocalizations.of(context).dismiss,
  automationIdentifier: 'backup-paused-banner',
);
```

`closeSemanticLabel` defaults to the literal string `'Dismiss'`, which is not localized. Override it in any localized app.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `mode` | `AsmAlertBannerMode` | No | `neutral` |
| `icon` | `IconData` | No | `Icons.notification_important` |
| `actionLabel` | `String?` | No | `null` (no link) |
| `onActionPressed` | `VoidCallback?` | No | `null` (link disabled if label given) |
| `onClosePressed` | `VoidCallback?` | No | `null` (no close button) |
| `closeSemanticLabel` | `String` | No | `'Dismiss'` |
| `semanticLabel` | `String?` | No | `null` (inherits `title`) |
| `automationIdentifier` | `String` | No | `'asm-alert-banner'` |

### Guidance

- **Pass a per-instance `automationIdentifier`.** The default `'asm-alert-banner'` is shared, so two banners on one screen collide. The controls derive `-action` and `-close` from what you pass.
- **Override `closeSemanticLabel`** in localized apps — the default is a hardcoded English string.
- **Match the `icon` to the `mode`.** The default bell is generic; a `critical` banner with the default icon leans entirely on color.
- **The caller owns visibility.** Wire `onClosePressed` to actually remove the banner from the tree.
- **Don't give the banner a fixed height.** It grows when the title wraps; a fixed height clips it, and at 200% text scale it clips badly.
- **Don't wrap the banner in `Semantics`** — the live region and explicit child nodes are deliberate, and overriding them can silence the title on Windows.
- **Don't wrap it in `ExcludeSemantics` or `MergeSemantics`** for the same reason.
- **Give it a bounded width.** The arrangement is measured from incoming constraints, so an unbounded width forces the pinned arrangement regardless of title length.
- Omit `actionLabel` rather than passing it with a null handler.

---

## Rules

1. An alert banner is for a PERSISTENT condition. Transient messages MUST use a [[Snackbar]].
2. The title MUST be non-empty and MUST be one sentence.
3. The leading icon MUST always be present — it is the non-color severity signal.
4. Severity MUST NEVER be conveyed by color alone. Icon and copy MUST carry it.
5. `neutral` is the default. `critical` MUST be reserved for conditions that genuinely block or endanger.
6. AT MOST one action, and it MUST be the link — never a [[Button]].
7. Action labels MUST be short verb phrases; long labels force the wrapped arrangement.
8. Titles MUST NOT end in a period — they collide with the inline link when wrapped.
9. A close button MUST actually dismiss the banner. NEVER render a ✕ that does nothing.
10. NEVER stack banners in one region. One at a time, most severe first.
11. NEVER give a banner a fixed height — it grows when the title wraps.
12. NEVER wrap a banner in your own semantics — it silences the title on Windows.
13. Field-level validation MUST appear on the field. NEVER surface it in a banner.
14. Every banner MUST carry a per-instance automation identifier prefix.
15. `closeSemanticLabel` MUST be localized in any localized app.
16. Content needing rich detail or multiple actions MUST use an [[Alert Card]] instead.

---

## Open Items

1. **Every colored mode uses `on-secondary` for content.** `info`, `critical`, `positive`, and `status` all draw their content in `on-secondary`, regardless of what they're filled with. Purpose-built pairs exist in the token set — `on-error` for the error fill and `on-positive` for the positive fill — and are not used. It happens to work if all four fills are similarly dark, but it is not a contrast guarantee: a change to any one fill breaks its pairing silently. Each mode should use the `on-*` token matching its fill.
2. **Icon sizes 18 and 20 are hardcoded literals**, and neither is on the [[Spacing]] scale or any icon-size token — the same missing-token gap flagged in [[Icons]]. Note also that [[Button]] uses 20 and 16 for its icons, so alert banner's 18 is a fifth distinct icon size in the system.
3. **Two stale comments in the implementation contradict the code.** The vertical-padding comment reads "pairs with the 24px icon to hit the 48px single-line height" and the measurement code comments "24px icon + the gap", but the icon is 18px and the minimum height is 44px. The comments appear to describe an earlier revision. Worth correcting, since they misstate both the icon size and the touch-target claim.
4. **The 44px minimum height is below the 48×48 touch-target floor.** The banner container itself isn't interactive, so this isn't a direct violation, and the close button's hit area is expanded vertically to compensate. But the floor in the Flutter accessibility rules is 48 and this component's own comment claims 48 while the constant is 44. The action link's touch height is not obviously expanded the same way — worth verifying it clears 48 in the single-line case.
5. **The border width uses Flutter's default rather than a token.** `neutral` mode and the high-contrast border both construct `Border.all` without a width, taking 1.0 implicitly instead of `md.border.size.100`. Same drift as [[Button]]'s outline variant and [[Accordion]]'s row border.
6. **`closeSemanticLabel` defaults to a hardcoded English string.** `'Dismiss'` ships as a Dart literal, so an app that forgets to override it announces English under every locale. A localized default, or making the parameter required, would prevent this.
7. **The default `automationIdentifier` is shared.** `'asm-alert-banner'` means two un-customized banners on one screen produce colliding identifiers for their action and close controls. Documented as optional-with-default, presumably to keep the rollout non-breaking, but the collision is real.
8. **The action link is built locally rather than using the shared link component.** It's intentional — the banner spec calls for emphasized body type and a forced per-mode color override — but it means link hover, focus, and disabled behavior are implemented twice in the system and can drift. If the shared link gains a behavior, this one won't inherit it.
9. **No motion.** The banner appears and disappears instantly; there are no entry/exit animations and no motion tokens exist system-wide. For a live-region component that appears in response to an event, an entry transition is worth considering.
10. **Figma has no `focus` variant**, as with [[Button]] and [[Accordion]] — focus is code-only and can't be verified against design.
11. **`mode` and Figma's variant naming should be confirmed.** The Dart enum is `neutral / info / critical / positive / status`; whether the Figma component set uses the same five names, or `warning` where the code says `status`, is unverified. `status` is an unusually vague name for a warning tier.
