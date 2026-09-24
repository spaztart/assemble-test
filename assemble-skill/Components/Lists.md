# Component: Lists

> Role: Interactive feature rows for dashboards, settings panels, and selection lists. Always tappable (or read-only); carries a title, optional supporting text, optional leading icon, and optional trailing affordance. Two surface treatments: flat row and card-framed.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A list row MUST have a non-empty title. NEVER hide interactive controls inside a tappable row — the row itself is the primary action; secondary affordances live beside it.
> Source: Figma `Components` → `list-item-feature` (node `2469-1235`) and `list-feature-card` (node `2502-1304`). Implementation: `pegasus_flutter/lib/asm/components/list_item_feature.dart` (`AsmListItemFeature`) and `list_feature_card.dart` (`AsmListFeatureCard`).

## Overview

A list row is the system's answer to "the user needs to scan a set of options, settings, or destinations and pick one." It is a horizontal strip with a title, supporting detail, and visual affordances — an icon, a status badge, a chevron — that communicate what tapping it will do.

**Two surface treatments exist, not two components.** The content structure — title, overline, supporting text, leading icon, trailing chevron or control — is identical. What changes is the framing:

- **Flat row** (`AsmListItemFeature`) — full-bleed, no card chrome, typically divider-separated. Use in dense settings lists, accordion bodies, or any context where the rows stack tightly.
- **Card-framed** (`AsmListFeatureCard`) — the same row placed on an elevated card surface with shadow, radius, and inset padding. Use in dashboards, feature grids, or selection lists where each option needs visual weight.

The distinction is surface-only. A row that works flat works framed, and vice versa. Choose based on context density and whether the list needs elevation.

**List row vs. [[Menu]].** A menu is ephemeral — it appears, the user picks, it vanishes. A list row is persistent — it stays visible in a scrolling surface. If the choices disappear after selection, use a menu. If they stay on screen, use list rows.

**List row vs. [[Button]].** A button triggers an action inline; a list row navigates to a destination or expands detail. If activating the control does something here and closes, it's a button. If it takes the user somewhere or reveals content, it's a row.

**List row vs. [[Accordion]].** Both can expand, but an accordion *is* the pattern — a stack of collapsible sections, self-managing its open state. A list row with an expanded slot is a single disclosure control, caller-managed. If the pattern is "many sections, user opens one," use an accordion. If the pattern is "one row expands as part of a form or settings panel," use a list row.

## Anatomy

### Flat row

```
┌─────────────────────────────────────────────────────────┐
│  ◯  ┆gap┆ OVERLINE (uppercase mono, optional)         │
│           Title line (bold, required)                   │
│           Supporting text (optional)              ›     │
│                                                  chevron│
└─────────────────────────────────────────────────────────┘
 ↑            ↑                                       ↑
leading      text block                          trailing
icon      (title always present,              (chevron or
(optional) overline/supporting optional)      custom widget)

Padding: 12 horizontal, 24 vertical (from edge to content)
Min row height: 76 (with padding, meets 48×48 touch target)
Radius: 16 (for hover/focus/selected fill)
```

### Card-framed row

```
╭─────────────────────────────────────────────────────────╮
│  ◯  ┆gap┆ STATUS LABEL                                 │
│           Feature title                                 │
│           Description line here              ›          │
│                                                         │
╰─────────────────────────────────────────────────────────╯
 └───────────────── card surface ─────────────────────┘
    Elevated with shadow (or outlined for informational)
    Padding: 20 top/left/bottom, 16 right
    Radius: 16
```

| Part | Required | Notes |
| --- | --- | --- |
| **Title** | **Yes** | Bold (emphasized). Single line, ellipsizes if too long. Always visible. |
| Overline | No | Uppercase mono. Category or status label. Rendered above title. |
| Supporting text | No | Secondary line below title. Wraps if long. |
| Leading icon | No | Typically `AsmIconContainer`. Can be avatar, image, or omitted for text-only rows. |
| Trailing | Contextual | Chevron (default for interactive), custom widget, or `AsmSwitch`. See [Trailing affordances](#trailing-affordances). |
| Title-trailing slot | No | Decorative badge/tag beside the title on the same line (e.g., "Sign in" tag beside "Secure VPN"). |
| Bottom badge | No | Badge/tag below the supporting text, left-aligned with text (not full-width). |
| Right content | No | Right-aligned metric or count between text and trailing (e.g., "+42 devices"). |
| Supporting link | No | Inline interactive link at end of supporting sentence (e.g., "Learn more"). Makes row a content group. |
| Expanded slot | No | Collapsible content revealed below the row. Animates in/out; chevron rotates 90°. |
| Focus ring | — | Branded 2px `primary`, keyboard-only. Wraps entire row. |
| Hover fill | — | `surfaceContainerHigh` with 8% neutral overlay. |
| Selected fill | — | Persistent `surfaceContainerHigh` (card-framed only). |

### Card surface types

Card-framed rows support four surface treatments (flat rows have none — they're bare):

| Type | Fill | Stroke | Shadow | Use for |
| --- | --- | --- | --- | --- |
| **interactive** | `surface` | None | 10 blur | Default tappable card |
| **gradientBorder** | `surface` | 1px brand gradient | 10 blur | Highlighted tappable card |
| **informational** | `surface` | 1px `outline` | None | Read-only info card |
| **blank** | `surface` | 1.4px dashed `secondary` | None | Empty "add/create" affordance |

**Interactive and gradientBorder** are both tappable — the gradient stroke just draws attention. **Informational** is read-only — no chevron, no tap, announced as a static region. **Blank** is the "+" add card, tappable with a dashed outline.

## Trailing affordances

The trailing slot defaults to a chevron for interactive rows, but can hold:

**1. Default chevron (right-pointing)** — signals navigation. Rotates 90° downward when row is expandable and expanded.

**2. Custom widget** — overflow menu button, count badge, anything. **Must be a genuinely separate control** if interactive — it sits beside the primary row as its own focus node, not inside the row's tap target. Use for secondary actions (overflow menus, popup anchors).

**3. AsmSwitch** — turns the whole row into a single toggle control. Tapping the row or flipping the switch does the same thing. The switch is excluded from tab order (row owns activation) and announced as the row's on/off state, not a separate control. Use for settings rows ("Enable 2FA" → toggle).

**4. None** — `showTrailingIcon: false` hides the trailing slot entirely. Use for read-only presentation rows that don't advertise navigation.

**Never put a button or link in titleTrailing or bottomBadge.** Those slots are decorative and silenced from assistive tech — a control placed there would be visible but unreachable by keyboard and invisible to screen readers. Use the `trailing` slot or `supportingLink` for genuinely interactive affordances.

## Kinds

Two interaction models:

| Kind | Use for | Behavior |
| --- | --- | --- |
| **interactive** | Tappable rows — settings, dashboard cards, destinations | Full button contract: hover, focus ring, Enter/Space activation, chevron. Announced as `link` (default) or `button`. |
| **readOnly** | Informational rows — descriptions, static summaries | No hover, no focus, no chevron. Announced as a region. |

**Default is `interactive`.** Only use `readOnly` when the row exists purely to surface information and has no action. A disabled interactive row (gray, not focusable) is different from a read-only row — disable means "temporarily unavailable", read-only means "not an action at all."

## States

Interactive rows follow [[States]]:

| State | Border | Fill | Additional |
| --- | --- | --- | --- |
| **Enabled, idle** | None | Transparent | — |
| **Hover** | None | `surfaceContainerHigh` + 8% neutral overlay | Pointer cursor |
| **Focus** | None | `surfaceContainerHigh` | Branded focus ring (2px `primary`, outside) |
| **Pressed** | None | `surfaceContainerHigh` + 8% neutral overlay | — |
| **Expanded** | None | `surfaceContainerHigh` | Chevron rotated 90° down |
| **Selected** | None | Persistent `surfaceContainerHigh` | No shadow (cards only) |
| **Disabled** | None | Transparent, 38% opacity | Not focusable, not announced |

**Selected is card-only.** Flat rows don't have a selected state — they live in scrolling lists where selection is typically shown with a checkmark in `semanticChecked`, not a persistent fill. Card-framed rows in a grid can use `selected: true` to mark the chosen card.

**Expanded state tints the whole row** — not just the header, but the entire surface including the expanded content. This matches [[Accordion]] and signals that the row is open.

### Focus ring

Keyboard-only, 2px `primary`, follows the row's 16px radius. Drawn outside the row so it causes no layout shift. Appears on Tab and directional navigation, never after a plain mouse click.

The ring wraps the **entire row** when the trailing is an independent control (overflow menu, popup anchor) — so the highlight spans the full card. When the trailing is a switch or chevron (part of the single row control), the ring wraps just the interactive surface.

### Disabled

Pass `onPressed: null` to disable an interactive row. The entire row drops to 38%, leaves the tab order, and is announced as disabled. **Prefer omitting a row over disabling it.** A disabled row with no explanation is a dead end.

## Behaviors

**Width is parent-driven.** Rows stretch to fill their container (default `width: double.infinity`). Pass an explicit `width` to constrain them (e.g., in a fixed-rail layout or preview).

**Height is content-driven, with a floor.** The row's vertical padding + title line box must meet the 48×48 minimum interactive target. At default padding (12 vertical) the inner content floors at 28px, so 28 + 24 = 52 > 48. Caller-supplied padding smaller than this raises the inner floor automatically to keep the row above 48px total.

**Title is a single line, ellipsizes.** Never wraps. If a title doesn't fit, it's too long — shorten the title or widen the layout.

**Supporting text wraps.** Multiple lines are fine. Row height grows to fit.

**Overline is always uppercase.** The text is transformed automatically; no need to pass pre-uppercased strings.

**Text scaling.** All text scales with OS text size up to 200%. Row height grows rather than clipping.

**Expandable rows animate 200ms, eased.** The expanded slot slides in below the row; the chevron rotates from right-pointing to down-pointing over the same duration. Content is not rendered while collapsed — a closed row has no expanded body in the layout.

**Icons are decorative.** Leading icon, unread dot, badge notification, default chevron — all excluded from assistive tech. The title and supporting text carry the meaning; icons reinforce it visually.

**Scroll-into-view on keyboard focus.** When a row gains focus via Tab or directional navigation and is off-screen, it scrolls into view automatically. Prevents invisible focus.

## Content

**Titles must stand alone.** A user scanning only titles should be able to find what they want. "Billing" is weaker than "Change payment method." Front-load the distinguishing word — rows are scanned vertically, and the first word does most of the work.

- Non-empty, always. Enforced.
- Single line. If a title needs two lines, it's a paragraph, not a title.
- Action-oriented for navigation rows: "View all devices", "Change password", not "Devices" or "Password".
- Keep titles parallel in structure across rows: all nouns, or all verb phrases.

**Supporting text is for detail.** One to two sentences. If the supporting text is long enough to need its own headings or paragraphs, it belongs in a [[Modal]], a [[Sheets|sheet]], or a page, not a list row.

**Overlines are for categories, not decoration.** "SECURITY", "ACCOUNT", "DEVICES" — use sparingly. Too many overlines make the list noisy.

**Supporting link is for inline affordances.** "Learn more", "See details" — appended to the end of the supporting sentence. Use when the description needs a link but the whole row navigates elsewhere. Do not combine `supportingLink` with a whole-row `onPressed` — that creates two competing tap targets.

## Content states

Three content-level states (separate from interaction states):

| State | Visual signal | Use for |
| --- | --- | --- |
| **defaultState** | Plain row | Normal rows |
| **unread** | Small dot inline with title | Unread notification, new content |
| **badge** | Count pill in leading icon's notification slot | Row promotes a destination with N unread items |

**Unread** appends a 6px dot after the title. **Badge** replaces the leading icon's notification slot with a count pill (e.g., "3" on a bell icon). Both are decorative — announce the unread/count state textually via the title or `semanticLabel`, not through the dot color alone.

## Decision Tree

```
What is the user doing?
├── Picking one choice from an ephemeral list?
│   └── YES ────────────────────────────────────────→ [[Menu]]
├── Triggering an action inline (no navigation)?
│   └── YES ────────────────────────────────────────→ [[Button]]
├── Scanning a stack of collapsible sections?
│   └── YES ────────────────────────────────────────→ [[Accordion]]
│
└── Scanning a persistent list of settings / features / destinations
    │
    ├── Does the row navigate or reveal detail?
    │   ├── NO — purely informational ─────────────→ kind: readOnly
    │   └── YES — interactive
    │
    ├── Does the list need elevation / visual weight?
    │   ├── NO — dense settings, tight accordion body ──→ flat row
    │   └── YES — dashboard, feature grid, selection list
    │       │
    │       ├── Read-only info card? ──────────────→ card, type: informational
    │       ├── Highlighted tappable card? ────────→ card, type: gradientBorder
    │       ├── Empty "add/create" affordance? ────→ card, type: blank
    │       └── Default tappable card ─────────────→ card, type: interactive
    │
    ├── Does the row need a secondary action (overflow menu)?
    │   └── YES → pass an interactive widget to `trailing`,
    │               it keeps its own focus + semantics
    │
    ├── Is the row a settings toggle (enable/disable)?
    │   └── YES → pass AsmSwitch to `trailing`,
    │               row becomes a single combined toggle
    │
    ├── Does the row expand inline content?
    │   └── YES → pass `expandedSlot`, control `expanded` flag,
    │               chevron rotates to indicate state
    │
    └── Does the supporting text need an inline link?
        └── YES → use `supportingLink`, do NOT wire `onPressed`
                  (row becomes a content group)
```

**Key distinction:** If the row is in a grid or needs to read as a card, use the card-framed variant. If it's in a dense scrolling list (settings panel, accordion body, drawer menu), use the flat row.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announceable name** | The visible title. Required, non-empty. Composed `overline + title + supportingText` announced by default. |
| **Role** | Interactive rows: announced as `link` (default) or `button` (caller-selectable). Read-only rows: static region. |
| **Keyboard activation** | Enter, Space, NumpadEnter trigger `onPressed`. |
| **Tab-reachable** | Interactive rows only. Disabled/read-only rows skip tab order. |
| **Visible focus** | Branded 2px `primary` ring, keyboard-only. |
| **Touch target** | ≥48×48 at minimum padding; grows with content. |
| **Disabled announced** | Disabled rows announced as disabled, removed from tab order. |
| **Decorative icons silenced** | Leading icon, chevron, unread dot, badges are `ExcludeSemantics`. |
| **Trailing switch merged** | When trailing is `AsmSwitch`, row is announced as a single toggle (on/off state), not link + switch. |
| **Independent trailing kept separate** | When trailing is an interactive control (menu button, popup anchor), it keeps its own focus + semantics beside the row. |
| **Supporting link kept separate** | Inline link at end of supporting text is a genuinely separate, focusable `link` node. |
| **Expansion state announced** | Expandable rows report "collapsed" / "expanded". |
| **Automation identifier** | Required per row. Compose from stable field when rows are generated. |
| **Scroll into view** | Rows gaining keyboard focus scroll into view automatically if off-screen. |

**The "one tap node" rule is enforced.** A list row is either:
1. A single tappable control (row + chevron or row + merged switch)
2. A read-only region (informational rows)
3. A content group (row with `supportingLink` and/or independent trailing control)

Never put an interactive widget in `titleTrailing` or `bottomBadge` — those slots are decorative and excluded from the accessibility tree. Use `trailing` or `supportingLink` for real controls.

**Toggle-row semantics (AsmSwitch trailing).** When the trailing is a switch, the row is announced as a single toggle element carrying the title and the on/off state. This matches the native settings-row pattern (iOS/Android). The switch itself is excluded from semantics and tab order — the row owns activation. Tapping the row or flipping the switch does the same thing.

**Supporting-link rows are content groups.** A row with `supportingLink` (and optionally an independent trailing switch) is NOT collapsed to one tap node. The leading/text read as content, and each interactive control (link, switch) keeps its own focus + semantics. This is the "Learn more" + toggle pattern from native settings.

## Anti-Patterns

**❌ Empty title.** The title is required and asserted non-empty. → Always provide a meaningful title.

**❌ Two-line title.** Titles never wrap. → Shorten the title or widen the layout.

**❌ Interactive control in titleTrailing or bottomBadge.** Those slots are decorative and silenced. A button placed there is visible but unreachable by keyboard and invisible to screen readers. → Use `trailing` or `supportingLink`.

**❌ supportingLink + whole-row onPressed.** Creates two competing tap targets (the row and the link). → Use `supportingLink` on a non-navigable row (e.g., settings row with trailing switch), or drop the link and keep the whole-row tap.

**❌ Trailing button + whole-row onPressed.** Two tap nodes — the row and the button — compete for the same gesture. → Card-framed rows support `trailingAction` (button-only card, row is read-only). Flat rows don't support this pattern; use a genuinely separate trailing button.

**❌ Mixing surface treatments in one list.** Some rows flat, some card-framed in the same list looks broken. → All rows in a list share a treatment.

**❌ Vague titles.** "More", "Details", "Settings" don't survive scanning. → Make the title say what's inside.

**❌ Using a list row where a button belongs.** If activating the control does something inline and closes, it's a button. → Use [[Button]].

**❌ Using a list row where a menu item belongs.** If the choices appear, the user picks, and they vanish, it's a menu. → Use [[Menu]].

**❌ Disabling rows routinely.** → Omit the row, or leave it enabled and explain inside.

**❌ Hardcoding padding, radius, or color.** → All come from tokens.

**❌ Wrapping in your own Semantics or GestureDetector.** → Already handled; a second wrapper creates a nameless tap target.

**❌ Selected state on flat rows.** Flat rows don't have a selected fill — use `semanticChecked` instead. → Only use `selected` on card-framed rows.

**❌ Informational card with a chevron.** Informational means read-only — no chevron, no tap. → Use `interactive` or `gradientBorder` for tappable cards.

**❌ Gradient-border card everywhere.** The gradient stroke draws attention — use it once or twice per screen, not for every card. → Reserve it for primary actions or highlighted cards.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. Two widgets from `pegasus_flutter/lib/asm/components/`:

- **`AsmListItemFeature`** — flat row, from `list_item_feature.dart`
- **`AsmListFeatureCard`** — card-framed row, from `list_feature_card.dart`

### Enums

```dart
// Flat row
enum AsmListItemFeatureKind { interactive, readOnly }
enum AsmListItemFeatureSemanticRole { link, button }
enum AsmListItemFeatureState { defaultState, unread, badge }

// Card-framed row
enum AsmListFeatureCardType { interactive, gradientBorder, informational, blank }
enum AsmListFeatureCardBackground { surface, neutral, tertiary, primary, secondary }
enum AsmListFeatureCardBadgePlacement { beside, bottom }
```

### Basic usage — flat row

```dart
AsmListItemFeature(
  title: 'Change payment method',
  supportingText: 'Update your billing information',
  leading: AsmIconContainer(icon: Icons.payment),
  onPressed: _navigateToPayment,
  automationIdentifier: 'payment-settings-row',
);
```

`title` and `automationIdentifier` are **required**. `kind` defaults to `interactive`.

### Flat row with overline

```dart
AsmListItemFeature(
  overline: 'Account',
  title: 'Profile settings',
  supportingText: 'Manage your personal information',
  leading: AsmIconContainer(icon: Icons.person),
  onPressed: _navigateToProfile,
  automationIdentifier: 'profile-row',
);
```

`overline` is automatically uppercased.

### Flat row with switch (settings toggle)

```dart
AsmListItemFeature(
  title: 'Enable two-factor authentication',
  supportingText: 'Add an extra layer of security',
  leading: AsmIconContainer(icon: Icons.security),
  trailing: AsmSwitch(
    value: _twoFactorEnabled,
    onChanged: (value) => setState(() => _twoFactorEnabled = value),
  ),
  // Optional: wire the row to toggle the switch too
  onPressed: () => setState(() => _twoFactorEnabled = !_twoFactorEnabled),
  automationIdentifier: '2fa-toggle-row',
);
```

The row becomes a single combined toggle. Tapping the row or flipping the switch does the same thing.

### Flat row with supporting link

```dart
AsmListItemFeature(
  title: 'Suspicious activity alerts',
  supportingText: 'Get notified when we detect unusual behavior',
  supportingLink: AsmListItemFeatureSupportingLink(
    label: 'Learn more',
    onPressed: _openHelpArticle,
    automationIdentifier: 'alerts-learn-more-link',
  ),
  leading: AsmIconContainer(icon: Icons.warning),
  trailing: AsmSwitch(
    value: _alertsEnabled,
    onChanged: (value) => setState(() => _alertsEnabled = value),
  ),
  // No onPressed — the link and switch are the two controls
  automationIdentifier: 'alerts-row',
);
```

Row with `supportingLink` CANNOT have `onPressed` — that would create two competing tap targets.

### Flat row with expandable content

```dart
class _MySettingsState extends State<MySettings> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return AsmListItemFeature(
      title: 'Advanced settings',
      supportingText: 'Configure technical options',
      leading: AsmIconContainer(icon: Icons.tune),
      expandedSlot: _buildAdvancedSettings(),
      expanded: _expanded,
      onPressed: () => setState(() => _expanded = !_expanded),
      automationIdentifier: 'advanced-settings-row',
    );
  }
}
```

The chevron rotates 90° down when expanded. Content animates in/out.

### Card-framed row — default interactive

```dart
AsmListFeatureCard(
  title: 'Secure VPN',
  supportingText: 'Browse privately and securely',
  leading: AsmIconContainer(icon: Icons.vpn_key),
  onPressed: _navigateToVPN,
  automationIdentifier: 'vpn-card',
);
```

Elevated with shadow, chevron, full button contract.

### Card-framed row — gradient border (highlighted)

```dart
AsmListFeatureCard(
  type: AsmListFeatureCardType.gradientBorder,
  title: 'Identity protection',
  supportingText: 'Monitor your personal information',
  leading: AsmIconContainer(icon: Icons.shield),
  onPressed: _navigateToIdentity,
  automationIdentifier: 'identity-card',
);
```

Same as interactive, but with a 1px brand-gradient stroke to draw attention.

### Card-framed row — informational (read-only)

```dart
AsmListFeatureCard(
  type: AsmListFeatureCardType.informational,
  title: 'Current plan',
  supportingText: 'Premium — renews Jan 15, 2027',
  leading: AsmIconContainer(icon: Icons.card_membership),
  automationIdentifier: 'plan-info-card',
);
```

Read-only, no chevron, no tap, 1px outline border instead of shadow.

### Card-framed row — blank (add affordance)

```dart
AsmListFeatureCard(
  type: AsmListFeatureCardType.blank,
  title: 'Add a device',
  supportingText: 'Protect another device',
  leading: AsmIconContainer(icon: Icons.add_circle_outline),
  onPressed: _addDevice,
  automationIdentifier: 'add-device-card',
);
```

Dashed 1.4px stroke, tappable.

### Card with coloured background

```dart
AsmListFeatureCard(
  background: AsmListFeatureCardBackground.tertiary,
  title: 'Premium feature',
  supportingText: 'Upgrade to unlock',
  titleColor: Theme.of(context).colorScheme.onTertiaryContainer,
  supportingTextColor: Theme.of(context).colorScheme.onTertiaryContainer,
  leading: AsmIconContainer(icon: Icons.star),
  onPressed: _upgrade,
  automationIdentifier: 'premium-card',
);
```

**Always override text colors when using a coloured background.** Pass the appropriate `onX` token.

### Card with button-only layout

```dart
AsmListFeatureCard(
  type: AsmListFeatureCardType.informational,  // Card is read-only
  title: 'Software update available',
  supportingText: 'Version 2.4.0 is ready to install',
  leading: AsmIconContainer(icon: Icons.system_update),
  trailingAction: AsmButton(
    label: 'Update now',
    variant: AsmButtonVariant.filled,
    size: AsmButtonSize.small,
    onPressed: _startUpdate,
    automationIdentifier: 'update-button',
  ),
  // No onPressed — the button is the single action
  automationIdentifier: 'update-card',
);
```

The button is the only tap target. Card surface is read-only.

### Card with badge beside title

```dart
AsmListFeatureCard(
  title: 'Secure VPN',
  supportingText: 'Browse privately',
  titleTrailing: AsmTag(
    label: 'Sign in',
    size: AsmTagSize.small,
  ),
  badgePlacement: AsmListFeatureCardBadgePlacement.beside,  // default
  leading: AsmIconContainer(icon: Icons.vpn_key),
  onPressed: _navigateToVPN,
  automationIdentifier: 'vpn-card',
);
```

Badge sits inline beside the title.

### Card with badge below content

```dart
AsmListFeatureCard(
  title: 'Password manager',
  supportingText: 'Store and autofill passwords',
  titleTrailing: AsmTag(
    label: 'Beta',
    size: AsmTagSize.small,
  ),
  badgePlacement: AsmListFeatureCardBadgePlacement.bottom,
  leading: AsmIconContainer(icon: Icons.lock),
  onPressed: _navigateToPasswordManager,
  automationIdentifier: 'password-manager-card',
);
```

Badge sits below the supporting text, left-aligned.

### Unread state

```dart
AsmListItemFeature(
  title: 'Security alert',
  supportingText: 'Suspicious login attempt detected',
  state: AsmListItemFeatureState.unread,
  leading: AsmIconContainer(icon: Icons.warning),
  onPressed: _viewAlert,
  automationIdentifier: 'alert-row',
);
```

Small dot appears inline with title.

### Badge state (count on icon)

```dart
AsmListItemFeature(
  title: 'Notifications',
  supportingText: 'You have unread messages',
  state: AsmListItemFeatureState.badge,
  leading: AsmIconContainer(
    icon: Icons.notifications,
    notificationBadge: AsmNotificationBadge(count: 3),
  ),
  onPressed: _viewNotifications,
  automationIdentifier: 'notifications-row',
);
```

Count pill replaces the icon's notification slot.

### Read-only row

```dart
AsmListItemFeature(
  kind: AsmListItemFeatureKind.readOnly,
  title: 'Device information',
  supportingText: 'This section contains details about your device',
  leading: AsmIconContainer(icon: Icons.info),
  automationIdentifier: 'device-info-row',
);
```

No hover, no focus, no chevron. Announced as a static region.

### Row announced as button (not link)

```dart
AsmListItemFeature(
  title: 'Scan for threats',
  supportingText: 'Run a full device scan',
  semanticRole: AsmListItemFeatureSemanticRole.button,
  leading: AsmIconContainer(icon: Icons.security_update),
  onPressed: _startScan,
  automationIdentifier: 'scan-button-row',
);
```

Announced as "button" instead of "link" (for in-place actions, not navigation).

### Full parameter reference — flat row

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `automationIdentifier` | `String` | No | `'asm-list-item-feature'` |
| `overline` | `String?` | No | `null` |
| `overlineWidget` | `Widget?` | No | `null` |
| `supportingText` | `String?` | No | `null` |
| `supportingLink` | `AsmListItemFeatureSupportingLink?` | No | `null` |
| `titleTrailing` | `Widget?` | No | `null` (decorative slot) |
| `bottomBadge` | `Widget?` | No | `null` (decorative slot) |
| `leading` | `Widget?` | No | `null` |
| `trailing` | `Widget?` | No | `null` (defaults to chevron) |
| `showTrailingIcon` | `bool` | No | `true` |
| `rightContent` | `Widget?` | No | `null` |
| `expandedSlot` | `Widget?` | No | `null` |
| `expanded` | `bool` | No | `false` |
| `semanticExpanded` | `bool?` | No | `null` |
| `semanticValue` | `String?` | No | `null` |
| `semanticChecked` | `bool?` | No | `null` |
| `semanticInMutuallyExclusiveGroup` | `bool` | No | `false` |
| `onPressed` | `VoidCallback?` | No | `null` (disabled) |
| `kind` | `AsmListItemFeatureKind` | No | `interactive` |
| `semanticRole` | `AsmListItemFeatureSemanticRole` | No | `link` |
| `state` | `AsmListItemFeatureState` | No | `defaultState` |
| `unreadColor` | `Color?` | No | `null` (`secondary`) |
| `semanticLabel` | `String?` | No | `null` |
| `width` | `double?` | No | `null` (full-width) |
| `contentPadding` | `EdgeInsets?` | No | `null` (12 all sides) |
| `titleColor` | `Color?` | No | `null` (`onSurface`) |
| `titleStyle` | `TextStyle?` | No | `null` (`labelLargeEmphasized`) |
| `supportingTextColor` | `Color?` | No | `null` (`onSurfaceVariant`) |
| `overlineColor` | `Color?` | No | `null` (`onSurface`) |

### Full parameter reference — card-framed row

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `statusLabel` | `String?` | No | `null` |
| `statusOverline` | `Widget?` | No | `null` |
| `supportingText` | `String?` | No | `null` |
| `titleTrailing` | `Widget?` | No | `null` |
| `badgePlacement` | `AsmListFeatureCardBadgePlacement` | No | `beside` |
| `leading` | `Widget?` | No | `null` |
| `trailing` | `Widget?` | No | `null` |
| `showChevron` | `bool` | No | `true` |
| `rightContent` | `Widget?` | No | `null` |
| `trailingAction` | `Widget?` | No | `null` (button-only mode) |
| `onPressed` | `VoidCallback?` | No | `null` (disabled) |
| `type` | `AsmListFeatureCardType` | No | `interactive` |
| `background` | `AsmListFeatureCardBackground` | No | `surface` |
| `titleColor` | `Color?` | No | `null` (`onSurface`) |
| `supportingTextColor` | `Color?` | No | `null` (`onSurfaceVariant`) |
| `selected` | `bool` | No | `false` |
| `semanticLabel` | `String?` | No | `null` |
| `width` | `double?` | No | `null` (full-width) |

### Guidance

- **Always pass `automationIdentifier` explicitly** — defaults exist but you should compose unique IDs from stable fields when rows are generated.
- **Card `automationIdentifier` is required** — it's asserted non-empty.
- **Never combine `supportingLink` with `onPressed`** on flat rows — that creates two competing tap targets.
- **Never combine `trailingAction` with `onPressed` or `trailing`** on cards — button-only mode means the card surface is read-only.
- **Always override text colors when using coloured `background`** on cards — pass the appropriate `onX` token via `titleColor` / `supportingTextColor`.
- **`overline` is auto-uppercased** — pass normal-case strings, not pre-uppercased ones.
- **`titleTrailing` and `bottomBadge` are decorative** — do NOT put interactive controls there. Use `trailing` or `supportingLink`.
- **Trailing AsmSwitch is merged** — the row owns activation, the switch is excluded from tab order and semantics.
- **Independent trailing (menu button, popup anchor) stays separate** — it keeps its own focus + semantics beside the row.
- **`semanticRole` only applies to interactive rows** — read-only rows are always announced as regions.
- **`selected` only applies to card `interactive` and `gradientBorder` types** — informational and blank cards ignore it.
- **Expansion animations respect reduced motion** — `AnimatedRotation` and `AnimatedSize` check `MediaQuery.maybeDisableAnimationsOf`.
- **Never wrap rows in your own Semantics, GestureDetector, or Padding** — all handled internally.
- **Card shadow is dropped under high-contrast themes** — a 2px `primary` border appears instead.
- **Gradient-border cards use the same stroke as `AsmCardVariant.outlined`** — the shared `GradientBoxBorder` painter.
- **Blank card dashed stroke is 1.4px** — between `w100` (1) and `w200` (2), no exact token exists.

---

## Rules

1. A list row MUST have a non-empty title. The title is **required** and asserted non-empty.
2. NEVER put interactive controls in `titleTrailing` or `bottomBadge` — those slots are decorative and silenced. Use `trailing` or `supportingLink`.
3. NEVER combine `supportingLink` with `onPressed` on flat rows — that creates two competing tap targets.
4. NEVER combine `trailingAction` with `onPressed` or `trailing` on cards — button-only mode means the card surface is read-only.
5. All rows in one list MUST share a surface treatment — all flat or all card-framed, never mixed.
6. Titles MUST be a single line and NEVER wrap. Shorten the title or widen the layout.
7. `overline` is automatically uppercased — NEVER pass pre-uppercased strings.
8. A trailing `AsmSwitch` turns the row into a single combined toggle — the row owns activation, the switch is excluded from semantics and tab order.
9. An independent trailing (menu button, popup anchor) MUST keep its own focus + semantics beside the row — it is NOT swallowed by the row's single tap node.
10. Card `automationIdentifier` is **required** — it MUST be non-empty.
11. When rows are generated from data, compose a **unique** `automationIdentifier` per row from a stable field.
12. NEVER wrap rows in your own `Semantics`, `GestureDetector`, or `Padding` — all handled internally.
13. Read-only rows (`kind: readOnly`) NEVER show a chevron, even if `showTrailingIcon` is true.
14. `selected` state is card-only — flat rows MUST use `semanticChecked` instead.
15. Informational cards (`type: informational`) are read-only — NEVER wire `onPressed`.
16. Gradient-border cards (`type: gradientBorder`) MUST be used sparingly — reserve for primary/highlighted actions, not every card.
17. When using coloured card `background`, ALWAYS override `titleColor` and `supportingTextColor` with appropriate `onX` tokens.
18. Expandable rows MUST control their own `expanded` state — the component does NOT manage it.
19. Expanded content is NOT rendered while collapsed — do not rely on measuring closed rows.
20. NEVER hardcode padding, radius, color, or animation duration — all come from tokens or component constants.
21. Every row MUST meet the 48×48 minimum touch target, including at 200% text scale.

---

## Open Items

1. **Flat row default `automationIdentifier` is shared.** `'asm-list-item-feature'` is the default, so every flat row without an explicit override shares one ID. This makes individual rows untargetable in lists. Whether it should be required (like the card variant) or assert uniqueness is unresolved.

2. **Card shadow blur 10 is a literal.** `_shadowBlur = 10` is a named constant. No shadow/blur token exists — same gap as [[Modal]], [[Sheets]], [[Popover]], [[Cards]]. This value is repeated across multiple components and should be promoted to elevation tokens.

3. **Blank card dashed stroke width 1.4 is off-scale.** `_blankBorderWidth = 1.4` sits between `w100` (1) and `w200` (2) with no exact token. The Figma spec is captured as a named constant.

4. **Blank card dash geometry 4/4 is off-scale.** `_blankDashOn = 4` and `_blankDashOff = 4` are below the spacing scale's 4px floor and are not layout spacing (stroke-dash pattern). No token exists.

5. **Card content padding asymmetric: 20/16/20/20.** Figma `list-feature-card` insets 20 top/left/bottom, 16 right (`spacing500` / `spacing400` / `spacing500` / `spacing500`). The asymmetry (16 right vs. 20 left) is deliberate per Figma but unexplained. Whether it should be symmetric is unclear.

6. **Flat row default padding 12 is off-scale.** `spacing300 = 12` is on the scale, but the default symmetric 12/12 vertical/horizontal is unusual (most components use different H/V insets). Whether it should match the card's 20/16/20/20 asymmetry is unclear.

7. **Row min height 76 is derived, not specified.** The 76 figure (stated in the flat row doc comment) is padding + line box, not a Figma-specified constraint. Whether rows should enforce an explicit min-height (vs. deriving it from padding + content) is unspecified.

8. **Inner content min height 28 is a magic number.** The calculation `max(28.0, kMinInteractiveDimension - contentPadding.vertical)` uses a raw 28 to ensure the row meets 48px total. The 28 is reverse-engineered from default padding (12 vertical → 24 total → 48 - 24 = 24 inner, rounded up to 28 for line box headroom). Whether 28 should be a named constant or derived from a type size + padding formula is unclear.

9. **Expansion animation duration 200ms is a literal.** `AnimatedSize(duration: Duration(milliseconds: 200))` is hardcoded in two places (flat row, card row). No motion token exists — same gap as [[Accordion]], [[Expanded Card]], [[Navigation Rail]], [[Guided Journey Panel]].

10. **Chevron rotation animation duration 200ms is a literal.** `AnimatedRotation(duration: Duration(milliseconds: 200))` is a separate literal. Both row expansions and chevron rotations should share one motion token when it exists.

11. **Hover animation duration 120ms is a literal.** `AnimatedContainer(duration: Duration(milliseconds: 120))` for the background fill transition is a third distinct literal. Whether hover and expansion durations should match or differ is unspecified.

12. **Unread dot size 6 is a literal.** `Container(width: 6, height: 6)` for the unread state dot is a raw value, not a token. No "indicator dot size" token exists.

13. **Unread dot gap 8 is `spacing200`.** The gap between title and dot uses `spacing200` (8), which is on-scale — but the dot itself (6) is not. Whether the dot should be 8 to match the gap is unclear.

14. **Chevron size 24 is a literal.** `Icon(Icons.chevron_right, size: 24)` is hardcoded. No icon-size token exists — same gap as [[Accordion]], [[Button]], [[Navigation Rail]].

15. **Content-to-trailing gap always `spacing300` (12).** The text→trailing gap is fixed regardless of row size or card vs. flat. Whether it should scale with padding is unclear.

16. **Overline-to-title gap 4 is a literal.** `const SizedBox(height: 4)` between overline and title is hardcoded, not from the spacing scale (scale starts at 4, so it's at the floor but not explicitly tokened). Whether it should be `spacing100` (4) is unverified.

17. **Title-to-supporting gap is `spacing100` (4).** The gap scales with the system; whether 4 is correct for every row or should scale with content density is unspecified.

18. **Focus ring offset is implicit.** The ring is drawn "outside the container" via `AsmFocusIndicator`, but the exact offset (transparent inset) is component-internal and not documented. Same pattern as [[Button]].

19. **Keyboard-only focus detection uses `PointerKeyboardFocusMixin`.** The mixin tracks whether focus arrived from pointer or keyboard and suppresses the ring on pointer clicks. This is centralized (not per-component), but the approach isn't documented in [[States]].

20. **Scroll-into-view on focus uses `RenderObject.showOnScreen`.** Each row scrolls itself into view when it gains keyboard focus via a post-frame callback. This is duplicated per component ([[Menu]] has the same pattern) rather than centralized in a focus-management utility.

21. **GlobalKey pins subtree identity across reparents.** `_ringedRowKey`, `_interactiveKey`, and `_rowKey` are used to keep elements stable when `AsmFocusIndicator` swaps its child or when expandable rows toggle between bare node and Column. This is a framework workaround (reparenting drops focus nodes), not documented as a reusable pattern.

22. **Windows Narrator announces toggles as "check box, on/off".** Flutter maps toggle nodes to the legacy checkbox control type, so every switch row (and standalone `AsmSwitch`) is announced as "check box" on Windows. This is a platform limitation of the UIA bridge, noted in the doc but not something the component can override.

23. **`semanticValue` is a Windows-only workaround.** Used to speak the open/closed state on rows where the `expanded` flag alone is not announced through UIA (same workaround [[Accordion]] applies). Whether this should be centralized in a "Windows-aware semantics" helper is unresolved.

24. **Read-only rows have no automation identifier forwarded.** `kind: readOnly` rows announce as static regions and are not given a `Semantics(identifier:)`, so they're not reliably targetable by UI automation. Whether read-only rows need test hooks is unclear.

25. **Card `selected` state drops shadow but keeps border.** A selected `gradientBorder` card has no shadow but still draws the gradient stroke. Whether the stroke should also be dropped (or changed to a solid highlight) is unspecified.

26. **High-contrast card border is always 2px `primary`.** Under an OS contrast theme, every card type (including blank's dashed stroke) is replaced with a solid 2px `primary` outline, so the dashed "add" affordance becomes solid. Whether the dashed pattern should be preserved in HC (with higher contrast) is unresolved.

27. **Card gradient stroke uses `gradientBrandStop1` → `gradientBrandStop2`.** Same gradient as `AsmCardVariant.outlined`. Whether gradient-border cards should have a distinct gradient (or a different width) is unspecified.

28. **Button-only card layout (`trailingAction`) is card-only.** Flat rows don't support this pattern — a trailing button on a flat row is always a separate control (keeps its own focus). Whether flat rows should also support button-only mode is unclear.

29. **Card `background` is an enum, not a `Color`.** Deliberate (rule 20 — tokens only), but it means callers cannot pass a custom fill. If a use case needs a fill not in the enum (e.g., `errorContainer`), it has no path. Whether the enum should expand or allow a `Color` override is unresolved.

30. **Card `titleColor` / `supportingTextColor` are nullable `Color`, not enum.** Unlike `background`, text overrides accept raw colors. This is inconsistent with the "tokens only" rule but necessary because pairing an on-colour token (`onTertiaryContainer`) with a fill (`tertiaryContainer`) requires the ColorScheme reference at the call site. Whether text overrides should also be enum-based is unclear.
