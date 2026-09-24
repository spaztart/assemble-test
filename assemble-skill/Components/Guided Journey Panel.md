# Component: Guided Journey Panel

> Role: A self-contained guided-action surface that pairs contextual wayfinding with multi-step flows — AI agents, remediation walkthroughs, or "what should I do next" prompts. Responsive: docks as a side sheet on desktop, transforms to a bottom sheet on mobile.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A guide panel MUST remain accessible throughout a flow — NEVER auto-dismiss mid-task. On desktop it can collapse to a thin rail; on mobile it must be manually closed.
> Source: Figma `Components` → `guided_action_panel` (layouts: `desktop`, `mobile`, `collapse`). Implementation: `pegasus_flutter/lib/asm/components/guided_action_panel.dart`.

## Overview

The guided journey panel is the system's answer to "an AI agent or multi-step remediation flow needs a persistent home while the user works." It is a dedicated surface that combines a wayfinder header (title + context subtitle) with a free-form content slot for whatever the flow demands — messages, CTAs, forms, status updates, password-change cards.

**It is not a generic sheet.** While it shares sheet-like properties (docked, dismissible, responsive layout), it is purpose-built for **guided experiences**: the wayfinder tells the user where they are in a journey, and the body walks them through it. A sheet is for tasks the user initiated; a guide panel is for tasks the system is helping them complete.

The defining characteristic: **it adapts to viewport width, not user preference.** On desktop breakpoints (compact and above) it docks as a side panel with optional collapse-to-rail; on mobile it becomes a bottom sheet. The user never picks — the layout responds to available space.

**Guided journey panel vs. [[Sheets]].** A side sheet is manually invoked, manually dismissed, and structurally neutral — it holds whatever the caller puts in it. A guide panel is **journey-aware**: the wayfinder header is always present, the body defaults to an AI loader when empty, and the surface is designed to persist through multi-step flows where dismissing mid-task would lose progress. If the user opened it, use a sheet. If the system surfaced a flow and needs to narrate it, use the guide panel.

**Guided journey panel vs. [[Modal]].** A modal demands an answer before continuing; a guide panel advises while the user works. Modals are interruptive and blocking; guide panels are persistent and non-modal (on desktop) or lightly modal (on mobile, where they dim the background but don't trap focus).

## Anatomy

### Desktop layout

```
╭────────────────────────────────────────────────╮
│  ┌──────────────────────────────────────────┐  │ ← wayfinder (pinned)
│  │  Title line                              │  │   includes optional
│  │  Subtitle / context                      │  │   collapse chevron (>)
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │  Content slot (scrollable or fixed)     │  │ ← body: caller-supplied,
│  │                                          │  │   or AI loader if null
│  │  • Messages                              │  │
│  │  • CTAs                                  │  │
│  │  • Forms / cards                         │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│                                           ↑    │ ← scroll-up button
╰────────────────────────────────────────────────╯   (optional)
 └───────────── 300–480 wide ────────────────┘
                16 padding
                16 radius, soft shadow
```

**Collapsed rail (desktop only):**

```
╭──╮
│< │ ← expand chevron + peek label on hover
│  │
│  │
│G │
│U │ ← rotated "GUIDE" label
│I │
│D │
│E │
│  │
╰──╯
64 wide
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | `surface-bright`, 16 radius (all corners), soft shadow (20 blur). Width: 300–480, fills parent. |
| **Wayfinder** | **Yes** | Pinned header. Always visible. Title + subtitle, with optional collapse chevron when `collapsible`. |
| **Content slot** | Yes | Caller-supplied body. Scrollable when `scrollableBody` is set, otherwise fixed-height. Defaults to AI loader if `null`. |
| Scroll-up button | Optional | Small tonal icon button, bottom-right, when `showScrollUp` is true. |
| Collapse chevron | Conditional | Trailing `>` in wayfinder when `collapsible` is true. Slides panel down to 64px rail. |
| Collapsed rail | Conditional | Thin 64px vertical surface: expand chevron + rotated "GUIDE" label. Peek label appears on hover. |

### Mobile layout

```
        ╭─────────────────────────────╮ ← 24 radius, top corners only
        │  🅜  McAfee       ⊗          │ ← header: wordmark + close
        ├─────────────────────────────┤
        │  ┌───────────────────────┐  │
        │  │  Wayfinder            │  │ ← wayfinder (pinned)
        │  └───────────────────────┘  │
        ├─────────────────────────────┤
        │  ┌───────────────────────┐  │
        │  │                       │  │
        │  │  Content (scrollable) │  │ ← body: scrolls or fixed
        │  │                       │  │
        │  └───────────────────────┘  │
        ╰─────────────────────────────╯
         └────── 300–988 wide ────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | `surface`, 24 radius (top corners only), 10 blur shadow. Docks to bottom of viewport. |
| **Header row** | **Yes** | McAfee wordmark (centred) + close button (top-right). Fixed to top of panel. |
| **Wayfinder** | **Yes** | Below header. Pinned. No collapse chevron (mobile has no rail). |
| **Content slot** | Yes | Scrollable or fixed. Defaults to AI loader when `null`. |
| Close button | **Yes** | Small icon button, top-right. Always present (no collapse interaction on mobile). |

**The header row is mobile-only.** On desktop the panel has no internal chrome beyond the wayfinder — dismissal is handled by the surrounding layout (e.g., a navigation action that hides the panel). On mobile the close button is built-in because the panel is lightly modal and the user must be able to leave.

## Layout variants

Two layouts, chosen by breakpoint (not user preference):

| Layout | Use on | Width | Radius | Dismissal | Collapse |
| --- | --- | --- | --- | --- | --- |
| **desktop** | Compact breakpoint and above | 300–480, fills to parent | 16, all corners | Caller-managed (or collapse) | Optional — slides to 64px rail |
| **mobile** | Below compact breakpoint | 300–988, fills to parent | 24, top corners only | Built-in close button | Not supported |

**Desktop** is the side-docked panel. It has no internal close button — the surrounding layout decides when to hide it (e.g., user navigates away, completes the flow, or collapses it). Optionally `collapsible`: the wayfinder grows a trailing `>` chevron; tapping it slides the panel down to a thin 64px rail with an expand chevron and rotated "GUIDE" label.

**Mobile** is the bottom-docked sheet. It has a built-in header (McAfee wordmark + close button) and is lightly modal — a scrim dims the background, though focus is not trapped. No collapse interaction: the panel is either open (full height) or closed (dismissed).

**Responsive behavior is automatic.** The layout parameter is set by the caller based on the current breakpoint, not passed through as a user-toggleable option. At compact and above, use `desktop`. Below compact, use `mobile`.

## Collapse (desktop only)

When `collapsible` is true on the desktop layout, the panel can collapse to a thin 64px vertical rail:

**Collapsed state:**
- Panel slides down to 64px width (animated, 250ms, eased)
- Wayfinder and body fade out as the rail fades in
- Rail shows: expand chevron (top) + rotated "GUIDE" label (bottom)
- Hovering or keyboard-focusing the expand chevron surfaces a dark peek label "Open guide" to its left
- Tapping the chevron expands the panel back to full width

**When to collapse:**
- User taps the collapse chevron (`>`) in the wayfinder
- Caller programmatically triggers via `AsmGuidedActionPanelController.collapse()`

**When to expand:**
- User taps the expand chevron (`<`) on the rail
- User hovers/focuses the rail and taps the peek label
- Caller programmatically triggers via `controller.expand()`

Collapse is **not** auto-dismiss. The rail stays visible and the panel's state (scroll position, in-flight content) is preserved. Expanding returns to exactly where the user was.

**Mobile has no collapse.** The mobile layout is either fully open or dismissed via the close button.

## States

The panel itself is a container — its interactive states come from its internal controls (wayfinder chevron, scroll-up button, close button, collapsed rail expand chevron). Each of those follows [[States]] with their own state roles.

| Interactive element | State role | Notes |
| --- | --- | --- |
| Collapse chevron (wayfinder) | `neutral` | Tonal icon button; see [[Button]] and icon button states |
| Scroll-up button | `neutral` | Tonal icon button; disabled if `onScrollUpPressed` is `null` |
| Expand chevron (rail) | `neutral` | Tonal rounded icon button; surfaces peek label on hover/focus |
| Close button (mobile) | `neutral` | Tonal icon button; disabled if `onClosePressed` is `null` |

**The peek label** (dark chip beside the rail's expand chevron) is not interactive — it mirrors the chevron's semantic label and is excluded from the accessibility tree. It appears on hover or keyboard focus of the expand chevron, using an `OverlayPortal` so it escapes the rail's clip boundary.

**Reduced motion.** Collapse/expand animations respect the OS "reduce motion" setting via `MediaQuery.maybeDisableAnimationsOf`. When enabled, transitions snap instantly instead of animating.

## Behaviors

**Width is constrained, not fixed.** Desktop: 300–480, fills parent up to the max. Mobile: 300–988, fills parent up to the max. The panel adapts to the layout it's given, but always respects the bounds.

**Height is caller-controlled.** The panel has no intrinsic height — it takes what its parent gives it. On desktop, typically `Expanded` or `SizedBox(height: ...)` in a column. On mobile, typically `Flexible` so it fills available viewport height below the app bar.

**Content scrolling.** When `scrollableBody` is true, the panel wraps the content slot in a `SingleChildScrollView` so overflow scrolls instead of clipping. When false (default), the caller is responsible for overflow — either the content is fixed-height, or the content itself is scrollable (a `ListView`, etc.). Never set `scrollableBody: true` when the content is already a scrollable widget — nested scrollables throw.

**Wayfinder is always pinned.** It never scrolls off-screen. On desktop, the wayfinder + scroll-up affordance frame the body. On mobile, the header + wayfinder frame the body. Only the content slot scrolls.

**Default body is an AI loader.** When `child` is `null`, the panel falls back to an inline AI loader ("On it! Just a moment…"). This matches the Figma default and signals that the system is working. Replace `child` with real content as soon as the flow begins.

**Collapse animation is a clip-reveal, not a child swap.** The expanded panel stays laid out at full width while the outer box animates down to 64px, clipping it from the left. The rail cross-fades in underneath. This keeps the body's scroll position and in-flight state intact — expanding returns to exactly where the user was. The alternative (swapping children) would remount the body and lose scroll position.

**Controller lifecycle.** When a `controller` is provided, it attaches to the panel on mount and detaches on unmount. Calling `controller.collapse()` / `expand()` / `toggle()` on an unmounted panel (or a mobile/non-collapsible panel) is a no-op. One controller per panel — reusing a controller across multiple mounted panels leaves it driving only the most recent one.

**Text scaling.** The wayfinder's title and subtitle, the rotated rail label, and the peek label all scale with OS text size. The panel grows to accommodate, not clip.

## Content

**The wayfinder carries the "where am I" signal.** Its title names the current step or topic ("Fix your password", "Set up 2FA", "Review devices"), and the subtitle provides context ("Step 2 of 3", "Last updated 5 minutes ago"). Keep titles short and action-oriented — this is a guide, not documentation.

**The body slot is for the "what do I do" content.** Messages, CTAs, forms, status rows — anything the flow needs. Typical patterns:
- **AI conversation:** Scrolling list of messages + input field
- **Remediation steps:** Vertical stack of status cards with CTAs ("Change password", "Enable 2FA")
- **Approval flow:** Content summary + approve/deny buttons
- **Loading state:** Use the default (null body → AI loader)

**Keep it focused.** A guide panel is for one flow at a time. If the user needs to switch between multiple guides, use navigation that swaps the panel's content, not multiple stacked panels.

**Never nest scrollables without bounds.** If the body is a `ListView` or its own `SingleChildScrollView`, leave `scrollableBody: false` (the default). Only set `scrollableBody: true` for fixed-height content that can overflow — a tall column of cards, a long form, etc.

## Decision Tree

```
Does the user need guided help through a multi-step flow?
├── NO
│   ├── Just showing detail beside main content?
│   │   └── YES ────────────────────────────────→ [[Sheets|Side sheet]]
│   ├── User initiated a focused task?
│   │   └── YES ────────────────────────────────→ [[Sheets|Bottom sheet]]
│   ├── One-time message or confirmation?
│   │   └── YES ────────────────────────────────→ [[Modal]] or [[Snackbar]]
│   └── Persistent navigation or status?
│       └── YES ────────────────────────────────→ [[Navigation Rail]]
│
└── YES — guiding through a flow
    │
    ├── Is this an AI agent conversation?
    │   └── YES ─────→ Guided Journey Panel (desktop: collapsible optional,
    │                  mobile: bottom-docked with close)
    │
    ├── Is this a remediation walkthrough (password, 2FA, device review)?
    │   └── YES ─────→ Guided Journey Panel
    │
    ├── Is this a "what should I do next" prompt (onboarding, tour)?
    │   └── YES ─────→ Guided Journey Panel
    │
    └── Does the flow need to persist while the user works elsewhere?
        └── YES ─────→ Guided Journey Panel (desktop: make it collapsible
                       so it can get out of the way without losing state)

Then choose layout by breakpoint (not user choice):
├── Compact and above ──────────→ desktop (side-docked, 300–480 wide)
└── Below compact ──────────────→ mobile (bottom-docked, 300–988 wide)

If desktop, decide collapse:
├── Flow is long / user needs screen space ───→ collapsible: true
└── Flow is brief / always wants attention ───→ collapsible: false
```

**Key distinction:** If the user opened it (tapped "View details", "Edit settings"), use a sheet. If the system surfaced it ("You have an issue to resolve", "Let me walk you through this"), use the guide panel.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Container role** | Entire panel is `Semantics(container: true)` so wayfinder + body read as one region. |
| **Wayfinder header** | The wayfinder announces `header: true` for its title, so screen readers recognize it as the panel's heading. |
| **Keyboard navigation** | All interactive elements (collapse/expand/scroll-up/close buttons) are real icon buttons with full keyboard support. |
| **Focus indicators** | All buttons render the branded 2px `primary` focus ring on keyboard focus. |
| **Touch targets** | All buttons meet the 48×48 minimum (small icon buttons are 48×48 exactly). |
| **Announced actions** | Every button requires a `semanticLabel` (or inherits a localized default): "Collapse guide", "Expand guide", "Scroll to top", "Close". |
| **Panel summary override** | Optional `semanticLabel` on the panel itself overrides the default reading (wayfinder + body). Use for concise summaries. |
| **Peek label excluded** | The dark "Open guide" chip beside the rail's expand chevron is `ExcludeSemantics` — it mirrors the button's label and would double-announce. |
| **Automation identifiers** | Required `automationIdentifier` prefix composes per-button IDs: `{prefix}-scroll-up`, `{prefix}-close`, `{prefix}-collapse`, `{prefix}-expand`. |
| **Color not the only signal** | Collapse/expand states are communicated via chevron direction and the presence/absence of content, not color alone. |
| **Contrast** | All text and icons meet WCAG AA against their backgrounds in both themes. |

**Assertions enforce non-empty labels.** The implementation asserts that `scrollUpSemanticLabel`, `closeSemanticLabel`, `collapseSemanticLabel`, `expandSemanticLabel`, `collapsedLabel`, and `expandPeekLabel` are all non-empty strings. Passing an empty string throws a debug-mode assertion failure.

**Do not wrap the panel in your own `Semantics`.** The container semantics and wayfinder header are already wired. Adding another wrapper can produce a nameless region or interfere with the tree structure.

## Anti-Patterns

**❌ Auto-dismissing mid-flow.** Closing the panel because the user tapped outside or navigated away loses their place in a multi-step journey. → Make dismissal explicit (close button, "Done" CTA, or collapse-to-rail).

**❌ Using it for a simple message.** A guide panel holding one line of text and an "OK" button is over-engineered. → Use a [[Snackbar]] or [[Alert Banner]].

**❌ Using it for user-initiated detail.** If the user tapped "View details" or "Edit settings", they expect a sheet. The wayfinder's "I'm guiding you" framing feels wrong. → Use a [[Sheets|side sheet]] or [[Sheets|bottom sheet]].

**❌ Multiple stacked guide panels.** Two guides competing for attention is chaos. → One guide at a time. If the user needs to switch flows, navigate to a different guide content, don't stack panels.

**❌ Nesting scrollables incorrectly.** Setting `scrollableBody: true` when `child` is already a `ListView` or `SingleChildScrollView` throws. → Only set `scrollableBody` for fixed-height content that can overflow.

**❌ Hardcoding layout by platform.** Assuming "iOS → mobile, desktop → desktop" misses tablet and foldable cases. → Choose layout by breakpoint, not device.

**❌ Collapsible mobile panel.** Mobile has no collapse interaction — setting `collapsible: true` on `mobile` layout does nothing. → Reserve collapse for desktop.

**❌ No wayfinder.** The wayfinder is required — it's the "where am I" signal. Passing a blank wayfinder or omitting it breaks the component's contract. → Always provide a meaningful title + subtitle.

**❌ Scrolling the wayfinder.** Putting the wayfinder inside the scrollable body loses the user's context when they scroll down. → The wayfinder is pinned by design; never move it into the content slot.

**❌ Removing the close button on mobile.** Mobile is lightly modal — the user must be able to leave. → Always wire `onClosePressed`.

**❌ Swapping the collapse animation.** Using `AnimatedCrossFade` or `AnimatedSize` remounts the body, losing scroll position and in-flight state. → The implementation's clip-reveal preserves state; don't replace it.

**❌ Reusing one controller across multiple mounted panels.** The controller attaches to the most recent panel and leaves prior ones undriven. → One controller per panel.

**❌ Adding your own container decoration over the panel.** The panel paints its own fill, radius, and shadow. Wrapping it in another `DecoratedBox` either hides the panel's surface or creates a double border. → Use the panel as-is.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmGuidedActionPanel`, from `pegasus_flutter/lib/asm/components/guided_action_panel.dart`.

### Enums

```dart
enum AsmGuidedActionPanelLayout { desktop, mobile }
```

**`layout` defaults to `desktop`.** Always pass it explicitly based on the current breakpoint.

### Basic usage — desktop, non-collapsible

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(
    title: 'Fix your password',
    subtitle: 'Step 1 of 3',
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      const Text('Your password was found in a data breach...'),
      const SizedBox(height: 16),
      AsmButton(
        label: 'Change password now',
        variant: AsmButtonVariant.filled,
        size: AsmButtonSize.medium,
        onPressed: _changePassword,
        automationIdentifier: 'change-password-button',
      ),
    ],
  ),
  automationIdentifier: 'password-guide-panel',
);
```

`wayfinder` and `automationIdentifier` are **required**. `layout` defaults to `desktop` but should be passed explicitly.

### With collapsible desktop panel

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(
    title: 'AI Assistant',
    subtitle: 'Ask me anything',
  ),
  collapsible: true,
  initiallyCollapsed: false,
  onCollapsedChanged: (collapsed) {
    print('Panel is now ${collapsed ? 'collapsed' : 'expanded'}');
  },
  child: _buildChatInterface(),
  automationIdentifier: 'ai-assistant-panel',
);
```

When `collapsible: true`, the wayfinder grows a trailing `>` chevron. Tapping it slides the panel down to the 64px rail. Set `initiallyCollapsed: true` to start in the rail state.

### Programmatic collapse control

```dart
class _MyScreenState extends State<MyScreen> {
  final _panelController = AsmGuidedActionPanelController();

  void _onCtaTap() {
    // Expand the guide when the user taps a "Get help" CTA
    _panelController.expand();
  }

  @override
  Widget build(BuildContext context) {
    return AsmGuidedActionPanel(
      controller: _panelController,
      collapsible: true,
      layout: AsmGuidedActionPanelLayout.desktop,
      wayfinder: const AsmWayfinder(title: 'Help', subtitle: 'Remediation guide'),
      child: _buildGuideContent(),
      automationIdentifier: 'help-panel',
    );
  }
}
```

Use `AsmGuidedActionPanelController` when you need to collapse/expand from outside the panel — e.g., a CTA that opens the guide, a deep-link that must expand it. Controller methods:
- `controller.expand()` — expands the panel, animated
- `controller.collapse()` — collapses to rail, animated
- `controller.toggle()` — toggles between expanded/collapsed
- `controller.isCollapsed` — read the current state

All are no-ops if the panel is not `collapsible` or is `mobile`.

### Mobile layout

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.mobile,
  wayfinder: const AsmWayfinder(
    title: 'Secure your account',
    subtitle: 'Review these steps',
  ),
  onClosePressed: () => Navigator.pop(context),
  child: _buildMobileGuideContent(),
  automationIdentifier: 'mobile-guide-panel',
);
```

Mobile adds a header row (McAfee wordmark + close button). Wire `onClosePressed` to dismiss the panel (typically `Navigator.pop`). Passing `null` renders the close button as disabled.

### Scrollable body

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(title: 'Settings', subtitle: 'Configure your account'),
  scrollableBody: true,  // Panel scrolls tall content
  child: Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      _buildSettingTile('Privacy'),
      _buildSettingTile('Security'),
      _buildSettingTile('Notifications'),
      _buildSettingTile('Billing'),
      // ... many more tiles
    ],
  ),
  automationIdentifier: 'settings-guide-panel',
);
```

Set `scrollableBody: true` when the content can be taller than the panel's height and is not already scrollable. The panel wraps `child` in a `SingleChildScrollView`.

**Leave it `false` (default) when `child` is already a scrollable widget:**

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(title: 'Messages', subtitle: 'AI chat'),
  scrollableBody: false,  // child is already a ListView
  child: ListView.builder(
    itemCount: messages.length,
    itemBuilder: (context, i) => _buildMessage(messages[i]),
  ),
  automationIdentifier: 'messages-guide-panel',
);
```

### With scroll-up button

```dart
class _MyPanelState extends State<MyPanel> {
  final _scrollController = ScrollController();

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AsmGuidedActionPanel(
      layout: AsmGuidedActionPanelLayout.desktop,
      wayfinder: const AsmWayfinder(title: 'Guide', subtitle: 'Help'),
      showScrollUp: true,
      onScrollUpPressed: _scrollToTop,
      child: SingleChildScrollView(
        controller: _scrollController,
        child: _buildLongContent(),
      ),
      automationIdentifier: 'scrollable-guide-panel',
    );
  }
}
```

When `showScrollUp` is true (default), a small tonal icon button appears bottom-right. Wire `onScrollUpPressed` to scroll the content back to the top. If `onScrollUpPressed` is `null`, the button still renders but is disabled.

### Loading state (default body)

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(title: 'Loading...', subtitle: 'Preparing your guide'),
  child: null,  // Falls back to AI loader: "On it! Just a moment…"
  automationIdentifier: 'loading-guide-panel',
);
```

When `child` is `null`, the panel renders an inline `AsmAiLoader` as the Figma default. Replace with real content once the flow starts.

### Custom semantic labels

```dart
AsmGuidedActionPanel(
  layout: AsmGuidedActionPanelLayout.desktop,
  wayfinder: const AsmWayfinder(title: 'Setup', subtitle: 'Getting started'),
  collapsible: true,
  collapseSemanticLabel: 'Hide setup guide',
  expandSemanticLabel: 'Show setup guide',
  collapsedLabel: 'SETUP',
  expandPeekLabel: 'Open setup guide',
  scrollUpSemanticLabel: 'Back to top',
  semanticLabel: 'Setup guide panel',
  child: _buildSetupContent(),
  automationIdentifier: 'setup-panel',
);
```

Override the default announced labels for collapse/expand, the rail label, the peek chip, scroll-up, and the panel itself. Pass `null` to inherit localized defaults where available.

### Full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `wayfinder` | `AsmWayfinder` | **Yes** | — |
| `automationIdentifier` | `String` | No | `'asm-guided-action-panel'` |
| `child` | `Widget?` | No | `null` (AI loader) |
| `layout` | `AsmGuidedActionPanelLayout` | No | `desktop` |
| `scrollableBody` | `bool` | No | `false` |
| `showScrollUp` | `bool` | No | `true` |
| `onScrollUpPressed` | `VoidCallback?` | No | `null` (disabled) |
| `scrollUpSemanticLabel` | `String?` | No | `null` (localized default) |
| `onClosePressed` | `VoidCallback?` | No | `null` (disabled) |
| `closeSemanticLabel` | `String?` | No | `null` (localized default) |
| `collapsible` | `bool` | No | `false` |
| `controller` | `AsmGuidedActionPanelController?` | No | `null` |
| `initiallyCollapsed` | `bool` | No | `false` |
| `onCollapsedChanged` | `ValueChanged<bool>?` | No | `null` |
| `collapseSemanticLabel` | `String` | No | `'Collapse guide'` |
| `expandSemanticLabel` | `String` | No | `'Expand guide'` |
| `collapsedLabel` | `String` | No | `'GUIDE'` |
| `expandPeekLabel` | `String` | No | `'Open guide'` |
| `semanticLabel` | `String?` | No | `null` |

### Guidance

- **Always pass `layout` explicitly** based on the current breakpoint (use `AsmBreakpointQuery` or `MediaQuery` to determine it). Default is `desktop` but it should not be relied on.
- **`collapsible` only works on `desktop`** — setting it on `mobile` is a no-op.
- **`scrollableBody: true` wraps `child` in `SingleChildScrollView`** — only use it when `child` is **not already scrollable**. Nested scrollables throw.
- **`onScrollUpPressed` must control an actual scroll controller** wired to the content. The button doesn't know about the content's scroll position.
- **Wire `onClosePressed` on mobile** — it's the only dismissal affordance. Passing `null` disables the button but leaves it visible.
- **One `controller` per panel** — reusing a controller across multiple mounted panels leaves it driving only the last one.
- **Never wrap the panel in your own `Semantics` or `DecoratedBox`** — it paints its own surface and announces its own structure.
- **Never nest the wayfinder inside `child`** — it's pinned by design and must stay outside the scrollable region.
- **Collapse/expand animations respect reduced motion** — `MediaQuery.maybeDisableAnimationsOf` is checked; when enabled, transitions snap instantly.
- **The rail's peek label requires an overlay** — it uses `OverlayPortal` so it escapes the rail's clip boundary. Don't remove or reimplement it.
- **`automationIdentifier` is a prefix** — internal buttons compose their own IDs by appending `-scroll-up`, `-close`, `-collapse`, `-expand`. Keep it unique per panel instance.

---

## Rules

1. A guide panel MUST have a wayfinder — it is the "where am I" signal and NEVER optional.
2. The wayfinder MUST stay pinned — NEVER put it inside the scrollable body.
3. On mobile, `onClosePressed` MUST be wired — it is the only dismissal affordance.
4. `scrollableBody: true` MUST NEVER be set when `child` is already scrollable — nested scroll views throw.
5. Choose layout by breakpoint, NEVER by platform. Compact and above → `desktop`. Below compact → `mobile`.
6. `collapsible` is desktop-only — setting it on `mobile` is silently ignored.
7. Collapse is NOT dismissal — the rail stays visible and state is preserved. NEVER use collapse to close the panel.
8. One controller per panel — NEVER reuse a controller across multiple mounted panels.
9. Auto-dismiss MUST NOT happen mid-flow — the user must explicitly close or collapse.
10. `child: null` is the loading state — NEVER leave it null permanently; replace with real content when ready.
11. All semantic labels MUST be non-empty strings — assertions enforce this in debug mode.
12. NEVER wrap the panel in your own semantics, decoration, or padding — it manages its own surface and structure.
13. The header row is mobile-only — NEVER add your own header to desktop.
14. NEVER hardcode sizes, colors, or animation durations — all come from tokens or component constants.
15. The peek label is excluded from assistive tech — NEVER make it interactive or rely on it for semantics.

---

## Open Items

1. **Desktop has no built-in close affordance.** The panel assumes the surrounding layout manages dismissal (navigation, "Done" CTA, or collapse). If a standalone close button is needed, the caller must add it inside `child`. Whether the component should offer an optional close button on desktop is unspecified.

2. **Mobile close button cannot be disabled by omission.** Passing `onClosePressed: null` disables the button (announces as disabled, no cursor, removed from tab order) but it still renders. If the panel must be non-dismissible on mobile, there's no way to hide the button. Whether forced-modal mobile panels are a real requirement is unclear.

3. **Scroll-up button has no "back to top" detection.** It renders unconditionally when `showScrollUp: true`, even when the content is already at the top or is too short to scroll. The caller must manage visibility if conditional rendering is wanted.

4. **No built-in progress indicator.** Multi-step flows often show "Step 2 of 5" — that lives in the wayfinder's subtitle, but there's no progress bar, stepper, or dots. Whether a visual progress affordance should be built in is unspecified.

5. **Rail width 64 is off-scale.** `collapsedWidth = 64` is a named constant, not a token. No token exists for "thin rail width" — same gap as in [[Navigation Rail]].

6. **Collapse animation duration 250ms is a literal.** `collapseAnimationDuration` is a named constant. No motion tokens exist in the system — same gap flagged in [[Accordion]], [[Expanded Card]], [[Navigation Rail]].

7. **Mobile header placeholder size 52 is off-scale.** `_mobileHeaderPlaceholderSize = 52` balances the close button to centre the wordmark, but 52 is not on the spacing scale. The close button is 48 (icon button small), so the mismatch is deliberate — whether 48 or another on-scale value would work is unclear.

8. **Rail horizontal padding 6 is off-scale.** `_CollapsedRail._horizontalPadding = 6` is below the spacing scale's 4px floor. The rail is 64 wide; with 6px insets, the expand chevron (48×48) has 8px headroom per side. Whether 8px (spacing200) padding would work is unverified.

9. **Desktop max width 480 does not align with column-grid math.** `_desktopMaxWidth = 480` is a round number unrelated to the 12-column grid documented in [[Grid]]. Whether it should snap to a column count (e.g., 5 columns + gutters) is unclear.

10. **Mobile max width 988 is unexplained.** `_mobileMaxWidth = 988` appears arbitrary — not a breakpoint threshold, not a token, not grid-derived. Figma specifies it but no rationale is given.

11. **No min-height constraint.** The panel takes whatever height its parent gives it. On desktop, if the parent is unbounded or very short, the wayfinder and scroll-up button can collide. Whether a min-height should be enforced is unspecified.

12. **Collapse is opt-in but the chevron is not optional.** When `collapsible: true`, the wayfinder always gains a collapse chevron — there's no "show the chevron but disable the interaction" mode. If the flow needs to prevent collapse conditionally, the caller must swap `collapsible` dynamically, which remounts the wayfinder.

13. **No keyboard shortcut for collapse/expand.** Users can Tab to the chevron and activate with Enter/Space, but there's no global shortcut (e.g., Cmd+\\ to toggle the rail). Whether a shortcut is wanted is unspecified.

14. **Peek label appears on both hover and keyboard focus**, which is correct — but it uses `Focus(canRequestFocus: false)` to detect the button's focus without adding a second tab stop. This pattern (focus detection without focus participation) is uncommon in the codebase and may be worth documenting as a reusable snippet.

15. **Shadow blur radius 20 (desktop) and 10 (mobile) are literals.** No shadow/blur tokens exist — same gap as [[Card]], [[Modal]], [[Sheets]]. These values are repeated across multiple components and should be promoted to elevation tokens.

16. **Mobile surface uses `surface`, desktop uses `surface-bright`.** This is intentional per Figma (mobile is a bottom sheet, desktop is a bright card), but the divergence is easy to miss. Whether both should use the same role for consistency is unclear.

17. **`initiallyCollapsed` is seeded once**, at first build. Changing it later does not re-collapse/expand — it's an initial value, not a controlled one. Use `controller` if you need to drive state from outside.

18. **Controller methods on non-collapsible/mobile panels are silent no-ops.** `controller.collapse()` on a `mobile` or non-`collapsible` panel does nothing and does not throw. Whether this should log a warning or assert in debug mode is unclear.

19. **Wayfinder's `copyWith` is used to inject the collapse chevron** — the panel doesn't own the wayfinder, so it copies it and adds `onCollapse` / `collapseTooltip`. This is a composition boundary: the caller passes a wayfinder, the panel decorates it. Whether the wayfinder should expose a `collapsible` flag of its own (and own the chevron) is unresolved.

20. **Figma has no focus state for the rail expand chevron.** The component set covers hover, pressed, and default, but not keyboard focus. Focus is implemented in code (branded 2px ring) and cannot be verified against design.

21. **No A/B test or analytics hooks.** Multi-step flows often instrument drop-off per step — the panel has no built-in way to surface "user reached step X" or "user collapsed/expanded N times". Callers must wire this themselves via `onCollapsedChanged` and body content callbacks.

22. **Desktop scroll-up button is small tonal, but no size rationale is given.** Small (48×48) keeps it compact, tonal keeps it low-emphasis — but whether it should match the wayfinder's own collapse chevron (also small tonal) or differ is unexplained.

23. **AI loader fallback is hardcoded.** When `child` is `null`, the panel always renders `AsmAiLoader()` with its default text ("On it! Just a moment…"). No parameter exists to customize the fallback. If a different loading state is wanted, the caller must pass an explicit `child`.

24. **No "panel opened/closed" lifecycle callbacks.** The panel is a passive surface — it doesn't open/close itself, so it has no `onOpened` / `onClosed` hooks. The surrounding layout manages its visibility. Whether mount/unmount callbacks are wanted is unclear.

25. **Wayfinder is required but not asserted.** The doc says it's required, but the parameter is not marked `required` and there's no runtime assertion. Passing a wayfinder with an empty title would produce a blank header. Whether the panel should assert a non-empty wayfinder title is unresolved.
