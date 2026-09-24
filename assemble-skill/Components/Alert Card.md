# Component: Alert Card

> Role: The homepage's primary surface for security risks, updates, and protection opportunities. It presents one alert at a time from a set, with the rest collapsed behind it. It is not a page-level status message and not a transient notification.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what each severity and layout means and when to use them, and apply to any surface built on this design system. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: Many alerts MUST be many items inside **one** alert card. NEVER stack several alert cards on a surface.
> Source: Figma `Components` → `alert_card` / `alert_card_tab` / `alert_card_list` / `resolved_card` (node `3851-704`). Implementation: `pegasus_flutter/lib/asm/components/alert_card.dart` and `alert_card_tab.dart`.

## Overview

The Alert Card is the largest, highest-visibility component on the McAfee homepage, across desktop, tablet, and mobile. It surfaces security risks, important updates, and opportunities to get more out of protection — a centralized entry point for actionable guidance and personalized awareness.

**It is one component that owns a set of alerts, not one card per alert.** This is the distinction most often got wrong. The card takes a list; with one entry it renders a single standalone card, and with several it renders a deck where one alert is active at full size and the rest collapse into 80-tall tabs above and below it. The user moves between alerts by activating a tab, an arrow, a pagination dot, or a swipe. Rendering several alert cards side by side or one under another destroys the whole model: the tab stack, the top-to-bottom keyboard order, the single-announcement screen-reader contract, and the "one alert has your attention right now" hierarchy all belong to the single component.

The card is **severity-bearing**. Its entire surface is painted by the alert's severity, so an alert card is never a neutral container — reaching for it to hold arbitrary content means reaching for the wrong component.

Three axes:

- **Severity** — `high`, `moderate`, `low`, plus a non-severity `offline` state. Carries the surface color.
- **Layout** — `expanded`, `medium`, `compact`. Carries width, radius, shadow, and headline size, and decides whether a multi-alert set reads as a vertical deck or a horizontal carousel.
- **Resolved** — a modifier that flips the card into a celebration surface after the user has acted.

## Anatomy

### The active card

```
┌──────────────────────────────────────────────────────────────┐
│ [MODERATE]  TODAY 4:54 PM · SCAMS            ( ⏰ ) ( ✕ )     │ ← status row
│                                              ├─4─┤            │
│                        ┆ 16 ┆                                 │
│  Stay private on WiFi.                                        │ ← title
│                        ┆  8 ┆                                 │
│  Public networks often leave personal data exposed.           │ ← body
│                                                               │
│                        ┆ 16 ┆                                 │
│  ( Resolve )  ( Learn more ↗ )                                │ ← action area
└──────────────────────────────────────────────────────────────┘
 ├─20─┤                                                  ├─20─┤
  ↑          ↑                    ↑              ↑
severity   timestamp          category      dismiss / snooze
 badge
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | Solid severity fill. 24 radius (32 at `compact`), drop shadow, 20 padding on all sides. |
| **Title** | **Yes** | The alert headline. The only required text. Also the card's accessible name. |
| **Severity badge** | No | An uppercase severity word at the top-left — a [[Badges\|badge]], `primary` type. Omit it and the card conveys severity by fill alone. |
| **Timestamp** | No | Uppercase mono. Either a pre-formatted string or a date the card formats. Not shown at `compact`. |
| **Category** | No | Uppercase mono, separated from the timestamp by a `·`. Not shown at `compact`. |
| **Dismiss / snooze actions** | No | Icon-only controls in the top-right of the status row, in every layout. |
| **Leading icon** | No | Used only by the resolved modifier on the standard card body. |
| **Action area** | No | Row of in-card action buttons. Its 72 min height is **reserved even when empty**. |
| **Focus ring** | — | Drawn on the active card and each collapsed tab, keyboard only. See [States](#states). |

The title / body block sits in the flexible region between the status row and the action area, and is **vertically centered in whatever slack is left** on a standalone card. That makes its resting position content-dependent by design: a copy-rich card with buttons leaves a small region so the block sits high; a sparse card with no timestamp and no buttons leaves a large region so it reads as centered. The deck's active card top-aligns the block instead, so a promoted alert reads top-down as it flips forward.

### The collapsed tab

```
┌──────────────────────────────────────────────────────────────┐
│ ●  Petco had a data breach       [CRITICAL RISK]  PERSONAL INFO│   80 tall
└──────────────────────────────────────────────────────────────┘
 ↑    ↑                                  ↑              ↑
dot  title (1 line, truncates)      severity badge   category
     ├─8─┤                                    ├──20──┤
├──24──┤                                                ├──24──┤
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | 80 tall, near-white surface, 20 shadow blur. Rounded only on the side facing the canvas; square where it tucks under the active card. |
| **Severity dot** | Yes | 8 wide. Carries severity when the badge is omitted. |
| **Title** | **Yes** | One line, truncates with an ellipsis. Inherited from the alert. |
| **Severity badge** | No | A [[Badges\|badge]], shown at `expanded` only. |
| **Category** | No | Shown at `expanded` only. Uppercase mono. |

A collapsed tab shows **only the category**, never the timestamp. The timestamp stays on the active card. This keeps the collapsed row terse and is intentional.

### The deck (expanded / medium, multiple alerts)

```
   ┌──────────────────────────────────────────────────┐
   │ ●  Petco had a data breach       [CRITICAL RISK] │ ← collapsed tab (above)
   ├──────────────────────────────────────────────────┤ ┈ 24 tucked under ┈
   │ [MODERATE]  TODAY 4:54 PM · SCAMS      ( ⏰ )( ✕ )│
   │                                                  │
   │  Stay private on WiFi.                           │ ← active card
   │  Public networks often leave data exposed.        │
   │                                                  │
   │  ( Resolve )  ( Learn more ↗ )                   │
   ├──────────────────────────────────────────────────┤ ┈ 24 tucked under ┈
   │ ●  Large purchase detected       [CRITICAL RISK] │ ← collapsed tab (below)
   ├──────────────────────────────────────────────────┤
   │ ●  Your MacOS is out of date               [LOW] │
   └──────────────────────────────────────────────────┘
                                        ( ↑ )  ( ↓ )   ← navigation arrows
```

Tabs are the full width of the card and each tucks 24 under its neighbour on the side facing the active card. Tabs above the active card round their top corners; tabs below round their bottom corners.

### The carousel (compact, multiple alerts)

```
┌──┬────────────────────────────────────┬──┐
│● │ [MODERATE]                         │ ●│  ← peek tabs, 32 wide each
│  │                                    │  │
│  │  Stay private on WiFi.             │  │
│  │  Public networks often leave...    │  │
│  │                                    │  │
│  │  ( Resolve )                       │  │
└──┴────────────────────────────────────┴──┘
              ○  ○  ●  ○  ○                    ← dot pagination
```

The peek tabs are narrow near-white "binder" strips carrying only a 10 dot in the neighbouring alert's severity color. **Their width is reserved on both sides at every index**, so the active card keeps a constant width — at the first or last alert the strip is simply empty rather than letting the card grow into it.

## Layouts

The layout is this component's size axis. Three layouts, selected from available width unless overridden.

| Layout | Width band | Auto-selected at | Corner radius | Shadow | Title style | Status row content |
| --- | --- | --- | --- | --- | --- | --- |
| **expanded** | 480–640 | ≥ 480 | 24 | 4 blur (elevation-1) | display/small-emphasized (36) | badge + `TIME · CATEGORY` |
| **medium** | 375–479 | 375–479 | 24 | 4 blur (elevation-1) | headline/medium-emphasized (28) | badge + `TIME · CATEGORY` |
| **compact** | 240–374 | < 375 | 32 | 20 blur (elevation-5) | headline/medium-emphasized (28) | badge alone |

Notes on the bands:

- **The Figma frames sit inside the bands, not at their edges.** `expanded` is drawn at 561 within its 480–640 band; `compact` is drawn at a single fixed 320. The band below 320 exists so the card still flexes in tight split-views and embeds; it caps at 374 so it can never collide with `medium`'s 375 floor.
- **Only `compact` changes the corner and the shadow.** It steps up to a 32 radius and a much softer 20-blur shadow, because on a phone the card is nearly full-bleed and needs a rounder, less hard-edged silhouette. See [[Elevation]].
- **Only `expanded` gets the 36 display headline.** `medium` and `compact` share the 28 headline. See [[Typography]].
- **`compact` drops the timestamp and category from the status row**, keeping the badge alone. The information is not relocated — it is not shown.
- **The layout also decides the multi-alert presentation** — see [Multi-Alert Presentation](#multi-alert-presentation). This is the consequential difference, not the radius.

Choosing a layout:

1. **Let it resolve from width.** The automatic thresholds match [[Breakpoints]] and are correct for the homepage, where the card sits in a content area whose width is already being negotiated by the [[Navigation Rail]] and the side panel.
2. **Override only to force a presentation** — most often pinning `compact` to demonstrate or test the carousel on a wide canvas.
3. **Never override to get a size you like.** An overridden `compact` on a desktop canvas still clamps the card to 374 wide and still renders a swipe carousel with no navigation arrows.

**Height is a floor, not a fixed size.** The card rests at a 320 minimum and grows past it to hug taller content. See [Behaviors](#behaviors).

## Variants

Severity is the variant axis. Four values; three are severities and one is not.

| Severity | Surface | Foreground | Collapsed-tab dot | Use for |
| --- | --- | --- | --- | --- |
| **high** | `mcafee.extended.brand-orange` | `on-inverse-surface` | critical (error red) | An active risk needing action now — a breach, a fraudulent charge |
| **moderate** | `gradient.surface.moderate.stop-1` (#6161FF) | `on-inverse-surface` | info (#6161FF) | A real but non-urgent exposure — an unprotected network, a weak setting |
| **low** | `mcafee.extended.positive` | `on-inverse-surface` | positive (green) | An opportunity to improve protection, not a problem |
| **offline** | `surface-container-highest` (#d4d0d0) | `on-surface-variant` | offline | The alert **cannot be evaluated** |

All three real severities render light-on-dark. `offline` is the only one that flips to a dark-on-light treatment. See [[Color]].

### offline is not a fourth severity

`offline` means *we don't know*. It is the state for an alert whose protection product is offline or unauthenticated, so its risk cannot be assessed. It paints a greyscale surface with no severity color at all, precisely so it cannot be mistaken for "low risk".

Do not use it as a disabled state, a placeholder, or a neutral styling option. If there is genuinely nothing to report, the surface has no alert and belongs to [[Empty State]]. If content is still loading, use [[Skeleton Loader]].

### Severity is never carried by color alone

The surface fill is the loudest severity signal, but it is not the only one required. The severity [[Badges|badge]] names the severity in words, and the copy states the risk. Both matter:

- Under an OS high-contrast theme **every severity collapses to the same surface fill** — see [High contrast](#high-contrast). Colour stops distinguishing severities entirely, and the badge label plus the copy become the only signal.
- `high` and `low` are orange and green respectively, which is the classic red/green confusion pair for the most common forms of colour vision deficiency.

So: include the badge label, and write copy that states the risk. A card whose only severity signal is its fill fails both cases.

### The high severity is orange, not red

`high` paints brand orange. Its collapsed-tab dot, however, is the `critical` (error red) status color. So the same alert reads orange on the active card and red on the tab dot. This is what ships; it is flagged in [Open Items](#open-items) because the implementation's own comments claim the two match.

## Resolved

`resolved` is a modifier on any severity, not a fifth severity. It converts the card into a celebration surface after the user has acted — the Figma `resolved_card` treatment.

| Severity | Resolved surface | Resolved foreground |
| --- | --- | --- |
| high | `error-container` (#ffbbbb) | `on-error-container` (#991111) |
| moderate | `secondary-container` (#bdb3ff) | `on-secondary-container` (#42287f) |
| low | `positive-container` (#b8ffe9) | `on-positive-container` (#1f3d37) |
| offline | *not modeled* — keeps the greyscale offline surface | `on-surface-variant` |

What resolved changes:

- The surface flips to the matching container pair — a pale tint of the severity rather than its full-strength fill.
- A **leading check icon** appears at the top-left, overridable with the alert's own leading icon.
- The **badge, timestamp, category, and status row are suppressed** entirely. So are the dismiss / snooze actions and the in-card action buttons.
- The card becomes **icon + headline + body only**.

Rules:

- **Resolved is terminal.** It reports a completed outcome. It carries no actions, because there is nothing left to do.
- **Keep it brief and specific.** "Nice work, issue resolved!" plus one line of substance. It is a moment, not a report.
- **Never use resolved as a success-styled container** for unrelated content. Its whole meaning is "the alert you were just looking at is closed".
- **`offline` has no resolved design.** An unevaluable alert cannot be resolved. Do not combine them.

## Multi-Alert Presentation

The number of alerts and the layout together decide what the component renders. This is the most important behavior in the component and the least obvious from a static spec.

| Alerts | Layout | Presentation |
| --- | --- | --- |
| 1 | any | A single standalone card. No tabs, no arrows, no pagination, no transition. |
| 2+ | expanded / medium | A **vertical stacked deck** — one active card, the rest as collapsed tabs above and below. |
| 2+ | compact | A **horizontal carousel** — one card, a peek tab on each side, dot pagination below. |

### The vertical deck

Alerts keep their order. Every alert before the active one is a tab above it; every alert after it is a tab below it. Promoting an alert re-partitions the stack rather than reordering it, so the set always reads in a stable sequence.

Four ways to change the active alert:

| Control | Available in | Behavior |
| --- | --- | --- |
| **Collapsed tab** | vertical deck | Activating a tab promotes that alert. |
| **Navigation arrows** | vertical deck | Up = previous, down = next. Right-aligned, 16 below the deck. Each disables at its end of the set. |
| **Peek tab** | carousel | Promotes the adjacent alert. |
| **Dot pagination** | carousel | Jumps directly to any index. |
| **Horizontal swipe** | carousel | A flick pages ±1. A slow drag does nothing. |

Navigation arrows appear automatically whenever there is more than one alert, and only in the vertical deck. Dot pagination appears only in the carousel. **Neither presentation has both**, and the vertical deck has no positional indicator other than the visible tabs themselves.

### Transitions

- **Deck** — the promoted card flips forward: it rotates in from a tilt about its horizontal axis and settles flat, easing out. It reads as dealing a card off the top of the stack. Default duration 350ms.
- **Carousel** — the incoming card slides in from the side it was activated from, travelling exactly one peek-tab width, so the near-white strip visually *becomes* the new card as it covers the outgoing one. Same easing and duration.

Both transitions are paint-only. Neither reflows the layout, so nothing shifts under the pointer mid-animation.

### Promotion moves attention, deliberately

When the user promotes an alert by activating a tab or a peek tab, **keyboard focus moves onto the newly promoted card**. That is what makes a screen reader read the new alert exactly once, through natural focus movement rather than a live region. When the user promotes an alert with a navigation arrow or a pagination dot, focus **stays on the control** so it can be pressed repeatedly, and the new alert is announced once instead.

That split is intentional and load-bearing. See [Accessibility](#accessibility).

## States

The card follows the state model in [[States]]. Only the divergences matter:

| Surface | Hover | Pressed | Focus | Disabled |
| --- | --- | --- | --- | --- |
| **Active card** | None — not activatable | None | **Branded ring**, keyboard only | Does not apply |
| **Collapsed tab** | State layer + pointer cursor | State layer | **Branded ring**, matching its asymmetric corners | Inert when not activatable: no focus, no ring, no cursor |
| **Peek tab** | State layer + pointer cursor | State layer | Framework default highlight — **not** the branded ring | Does not apply |
| **Pagination dot** | **None** | **None** | **None** — not focusable | Does not apply |
| **Navigation arrows** | Follows the icon-only control model | " | " | Disabled at each end of the set |

Three things to take from that table:

**The active card is a focus stop with no activation.** It is already the promoted alert, so Tab lands on it and paints the ring, but Enter and Space do nothing. Its own interactive children — the in-card buttons and the corner actions — remain individually focusable after it.

**The peek tab and the pagination dot diverge from [[States]].** The peek tab shows the framework's default focus highlight instead of the branded ring, and the pagination dot has no hover, pressed, or focus treatment and is not reachable by keyboard at all. Both are flagged in [Open Items](#open-items).

**There is no disabled alert card.** An alert that cannot be acted on is either an `offline` alert or not an alert.

### The focus ring is keyboard-only, and that is hard

The ring appears for Tab and directional navigation and never after a mouse click. Getting there is not a matter of reading the framework's focus-highlight mode: on desktop a mouse click is classified in the *same* highlight bucket as a Tab press, so the highlight mode alone cannot distinguish them. The component therefore tracks the real input source across the whole deck — any pointer-down inside it means pointer mode, any key press anywhere returns it to keyboard mode.

The deck-wide scope is what makes it correct. Clicking a collapsed tab promotes a card by moving focus onto it *programmatically*, so the promoted card never sees a pointer event of its own; only a deck-level input-source flag catches that case. **Do not reimplement this per surface** — a local version leaks a spurious ring on every click that promotes a card.

### High contrast

Under an active OS contrast theme every severity collapses to a single pair: the contrast theme's own surface fill, its `onSurface` text and icons, an outline border added so the card stays bounded against the canvas, and an outlined badge. The per-severity brand and extended tokens are not remapped by the high-contrast system-colour pass, so honoring them would ignore the user's chosen palette and can fall below required contrast.

The consequence: **under high contrast, colour conveys no severity at all.** The badge label and the copy carry it. This is the same treatment as [[Alert Banner]] and [[Snackbar]].

## Behaviors

**Height is a floor, not a cap.** The active card rests at a 320 minimum — Figma's symbols range from a 256 minimum to a 320 maximum, and the resting minimum is pinned at 320 so a short card fills the full frame rather than sitting at the smaller bound. Above that the card **grows to hug its content**, which is what keeps a wrapped headline from clipping or colliding with the action area at up to 200% text scale.

**Give the card unbounded vertical space.** Growth only happens if there is room to grow into. Place the card in a scrollable region, never in a fixed-height slot. A fixed-height parent silently reintroduces the clipping the floor was designed to prevent.

**The deck tracks the active card's real height.** The active card is measured after layout, and the tabs below it and the deck's overall height re-flow around the measurement. A taller active card pushes the lower tabs down instead of being overlapped by them.

**Collapsed tabs are always 80 tall.** They do not grow with text scale, and the title truncates to one line. Keep tab titles short — an alert whose title only fits when expanded will be an ellipsis in the deck.

**The action area is always reserved.** Its 72 min height is held even when there are no buttons, so the centered title / body block above it stays the same size whether or not the card has actions. This is why two cards with the same copy but different button counts still agree visually.

**The status row meta wraps.** The badge, timestamp, and category flow as a wrapping group so they never collide with the corner actions or overflow at large text scale. In-card buttons wrap onto a second row for the same reason.

**Timestamps are formatted for you.** An alert can carry either a pre-formatted detail string or a date. Given a date, the card renders `Today 4:54 PM` on the current calendar day and `Sep 25 4:54 PM` on any other, uppercased, with locale-correct month abbreviations and clock format. **Pass the date, not a string** — a hand-formatted string will drift from every other card in the app and will not localize. The two are mutually exclusive; supplying both is a defect.

**Overriding the card body replaces everything.** An alert can supply its own content for the entire active area. Doing so drops the status row, the badge, the timestamp, the actions, the action area, and the severity foreground color — only the surface fill and the padding survive. It is an escape hatch for one-off compositions and it forfeits every guarantee in this document.

**Dismiss and snooze are re-styled and re-ordered.** The corner actions are always rendered as low-emphasis icon-only controls at a single size, 4 apart, regardless of how they were configured. In the horizontal cluster their order is **reversed**, so the first action supplied sits nearest the corner — this puts close at the outer edge, per the Figma mobile annotation. Supply them in reading order (close first) and let the component place them.

## Content

**Title** — the alert headline, and the card's accessible name. It appears at 36 or 28 on the active card and truncated to one line at 14 on the collapsed tab, so it has to work at both. Keep it to a short sentence: "Petco had a data breach", "Large purchase detected". Sentence case. State the fact, not the instruction — the buttons carry the instruction.

**Body** — one or two sentences saying what the risk is and, implicitly, why it matters. "I found samj@email.com in a data breach." Optional, but a card with a bare title rarely gives the user enough to decide.

**Severity badge** — the severity in words: "Critical risk", "Moderate", "Low", "Offline". Rendered uppercase automatically, so write it in sentence case. This is the non-colour severity signal and should be present on any card whose severity matters. See [[Badges]] for the full content rules; the card supplies the label and picks the status and type itself.

**Category** — a short noun phrase naming the protection area: "Personal info", "Finances", "Scams", "Devices". Rendered uppercase automatically. Do not pre-uppercase it, and do not use it as a second headline.

**Timestamp** — supply the date and let the card format it. Never write "2 hours ago" into a static string; it goes stale the moment it renders.

**Action labels** — verb phrases naming the action, per [[Button]]. "Resolve", "Learn more". Two is the practical maximum: a primary action and one secondary.

**Resolved copy** — congratulatory and specific. "Nice work, issue resolved!" plus one line of substance.

Do not repeat information across slots. Badge, category, timestamp, title, and body each say something the others do not.

## Placement

On the McAfee homepage the Alert Card sits in the content area between two fixed elements:

- **[[Navigation Rail]]** — always docked to the left of the app, at every tier, and 60pt wide. At the smallest tier it is hidden until the user opens it as an overlay drawer, and the content region this card sits in reclaims those 60pt.
- **Guided Journey panel** — docked to the right, and able to expand or collapse like a side sheet.

The card and the Guided Journey panel are **linked**: selecting an action on the Alert Card updates the panel to reflect that action. Treat the pair as one flow — the card raises the alert and the panel carries the work.

Consequences for the card:

- **Its available width is negotiated, not fixed.** Expanding the side panel narrows the content area, which can move the card across a layout threshold and change its presentation from deck to carousel. Never assume a layout; never hardcode a width. See [[Breakpoints]] and [[Grid]].
- **One alert card region per homepage.** The card is the centralized entry point for actionable guidance. A second one competes with it for exactly the attention it exists to hold.

Two things about this pairing are unsettled — the panel's official name, and the mechanics of the sync (whether it auto-opens, swaps content, or highlights a step). Both are in [Open Items](#open-items). Until they are settled, do not depend on a particular sync behavior.

## Decision Tree

```
Is this a security risk / update / opportunity on the McAfee homepage
that the user can act on?
│
├── No — it's a transient confirmation of something
│   that just happened ───────────────────────────→ [[Snackbar]]
│
├── No — it's a persistent page-level or section-level
│   message about the page, not about a risk ─────→ [[Alert Banner]]
│
├── No — it requires a decision before the user can
│   continue ─────────────────────────────────────→ [[Modal]]
│
├── No — there is nothing to report at all ───────→ [[Empty State]]
│
├── No — the content is still loading ────────────→ [[Skeleton Loader]]
│
├── No — it's just a status word or a label ──────→ [[Status Indicators]] / [[Tags]]
│
├── No — the user is switching between peer views
│   of the same content ──────────────────────────→ [[Tabs]]
│
└── Yes — use an Alert Card
    │
    ├── How many alerts?
    │   ├── One  ──────────→ a single standalone card
    │   └── Several ───────→ ONE card holding all of them.
    │                        NEVER several cards.
    │
    ├── Has the user already resolved it? ─────────→ set resolved
    │                                                 (drops all actions)
    │
    └── Which severity?
        ├── Active risk, act now ──────────────────→ high
        ├── Real but not urgent ───────────────────→ moderate
        ├── An improvement, not a problem ─────────→ low
        └── Cannot be evaluated (product offline
            or unauthenticated) ───────────────────→ offline

Then let the layout resolve from width:
├── ≥ 480  → expanded  (36 headline, vertical deck)
├── 375–479 → medium   (28 headline, vertical deck)
└── < 375  → compact   (28 headline, swipe carousel, badge-only status row)
```

The tabs in an Alert Card deck are **not** [[Tabs]]. They select which alert is featured within one component; [[Tabs]] switch between peer views of a page's content. If the user is choosing a *view*, the Alert Card's stack is the wrong affordance.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announceable name** | The card's title, plus its body when present. Required, because the title is required. |
| **Alert announced once** | On promotion via a tab, focus moves to the new card and the screen reader reads it through natural focus. Via an arrow, dot, or swipe, it is announced once explicitly. |
| **Keyboard reachable** | The active card is a focus stop; every collapsed tab, corner action, in-card button, and navigation arrow is focusable. |
| **Keyboard activation** | Enter, Space, and Numpad Enter activate a collapsed tab. |
| **Visible focus** | Branded ring on the active card and each collapsed tab, keyboard only. |
| **Reading order** | Strict top-to-bottom through the deck, and bottom-to-top with Shift+Tab. |
| **Tab role** | Each collapsed tab and each peek tab is announced as a button. |
| **Decorative marks silenced** | Severity dots, the resolved check icon, and pagination glyphs are hidden from assistive tech. |
| **Automation identifiers** | Required on the card; every internal control derives one from it. Each tab gets a unique one. |
| **Text scale** | Content grows to 200% without clipping, given unbounded vertical space. |
| **High contrast** | Every severity honors the OS contrast palette, with an added outline border. |

### The deck must not be one semantic region

The whole deck **must never** be wrapped in a single semantic container or live region. Doing so has three failure modes, all observed:

1. A screen reader draws one outline around the entire deck instead of around each tab and the active card, so the user cannot tell the pieces apart.
2. Entering the region announces the whole thing at once — dominated by the visually featured active card — instead of letting the user land on and read the first tab.
3. A live region re-announces the active card on **every rebuild**, which during the flip transition means every animation frame.

Announcement is handled by focus movement and a single explicit announcement per promotion. That mechanism only works if nothing above it is competing.

### Reading order is imposed, not inherited

The deck is a stack of heavily overlapping cards inserted out of visual order — tabs above ascending, tabs below descending, the active card last. Default traversal tie-breaks such overlaps by insertion order, which sent Tab from a tab to a far tab instead of to its visual neighbour. The component imposes an explicit order keyed on each alert's index, restoring strict top-to-bottom movement. **Do not insert your own traversal group or focus order into the deck** — it will fight this and reintroduce the jump.

### Known accessibility gaps

Two of them, both in [Open Items](#open-items):

- **Pagination dots are not keyboard reachable**, and their hit cell is under the 48×48 minimum from [[Icons]]. Keyboard and switch-control users must reach the carousel's alerts by peek tab instead. These dots are this component's own private re-implementation, not the shared indicator — see [[Carousel]], which compares the two and explains why the shared one is worse.
- **Every screen-reader string in this component is untranslated.** Page counts, "Show previous alert", severity words, and the "Today" timestamp prefix fall back to English in every non-English locale.

**What you do not need to do:** wrap anything in your own semantics, set a button role on a tab, manage focus during promotion, or announce the new alert yourself. All of it is wired. Adding another semantics ancestor recreates failure mode 1 above.

## Anti-Patterns

**❌ Several alert cards on one surface.** The most damaging misuse. It breaks the tab stack, the top-to-bottom keyboard order, and the one-announcement contract, and it destroys the "one alert has your attention" hierarchy. → One card, many alerts.

**❌ Placing the card in a fixed-height slot.** The 320 height is a floor and the card must be able to grow past it. In a fixed-height parent, a wrapped headline at 200% text scale clips or collides with the action area. → Put it in a scrollable region.

**❌ Using `offline` as a disabled or placeholder state.** It means "this alert cannot be evaluated", not "nothing here" or "not yet loaded". → [[Empty State]] or [[Skeleton Loader]].

**❌ Relying on the surface fill alone to convey severity.** Under high contrast all severities share one fill, and orange/green is the classic confusion pair. → Include the severity badge and state the risk in the copy.

**❌ Hand-formatting the timestamp.** A pre-formatted string skips localization and drifts from every other card. → Pass the date.

**❌ Long tab titles.** The collapsed tab is 80 tall with a one-line title that truncates. → Keep titles short enough to read collapsed.

**❌ Overriding the layout to get a size.** A forced `compact` on a desktop canvas clamps to 374 and renders a swipe carousel with no navigation arrows. → Let the layout resolve from width.

**❌ Giving a resolved card actions.** Resolved is terminal and suppresses the entire action area, so buttons set on it silently disappear. → Report the outcome and stop.

**❌ Combining `offline` with resolved.** An unevaluable alert cannot be resolved, and the combination has no design. → Pick one.

**❌ Using the body override to build a general-purpose card.** It drops the status row, actions, badge, severity foreground, and the growth guarantees. → Use it only for a genuine one-off, and never as a styling shortcut. For a plain surface, use [[Cards]] directly — it is what this component is built on.

**❌ Reimplementing the keyboard-only focus ring locally.** A per-surface version cannot see that a click on a tab moved focus programmatically, so it leaks a ring on every mouse promotion. → Leave it alone.

**❌ Adding your own semantics wrapper or focus traversal group.** The first regroups the deck into one unreadable region; the second breaks top-to-bottom Tab order. → Both are already handled.

**❌ Repeating the same information in the badge, category, and title.** "CRITICAL RISK · CRITICAL · Critical risk detected" is three slots saying one thing. → Give each slot distinct content.

**❌ Expecting pagination dots in the vertical deck, or navigation arrows in the carousel.** Each presentation has exactly one of the two. → Don't design around the one that isn't there.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmAlertCard`, from `pegasus_flutter/lib/asm/components/alert_card.dart`. Each alert is an `AsmAlertCardItem`. The collapsed tab, `AsmAlertCardTab` from `alert_card_tab.dart`, is exported and usable directly but is normally built for you by the deck.

### Enums

```dart
enum AsmAlertCardSeverity { high, moderate, low, offline }

enum AsmAlertCardLayout { expanded, medium, compact }

enum AsmAlertCardTabPosition { above, below }
```

**`layout` defaults to `null`, which is the correct value** — it resolves from available width. Pass an explicit layout only to force a presentation.

**`height` defaults to `320` and is a minimum, not a fixed height.** Lowering it lowers the floor; it does not cap the card.

### Basic usage — a single alert

```dart
AsmAlertCard(
  items: [
    AsmAlertCardItem(
      severity: AsmAlertCardSeverity.high,
      title: 'Petco had a data breach',
      body: 'I found samj@email.com in a data breach.',
      time: AsmAlertCardItem.timeAgo(hour: 16, minute: 54),
      category: 'Personal info',
      tabBadgeLabel: 'Critical risk',
      leading: const Icon(Icons.badge_outlined),
    ),
  ],
  actions: [
    AsmIconButton(
      icon: const Icon(Icons.close),
      tooltip: 'Dismiss',
      variant: AsmIconButtonVariant.tonal,
      size: AsmIconButtonSize.medium,
      onPressed: _dismiss,
      automationIdentifier: 'breach-alert-dismiss',
    ),
  ],
  automationIdentifier: 'breach-alert-card',
);
```

`items` and `automationIdentifier` are **required**. `automationIdentifier` is asserted non-empty, and `items` is asserted non-empty.

Note that `tabBadgeLabel` names the tab but drives the badge on the **active card as well** — the name is misleading. See [Open Items](#open-items).

### A deck of alerts

Pass every alert to one widget. This is the whole point of the component.

```dart
AsmAlertCard(
  initialIndex: 2,
  items: [
    AsmAlertCardItem(
      severity: AsmAlertCardSeverity.high,
      title: 'Petco had a data breach',
      body: 'I found samj@email.com in a data breach.',
      time: AsmAlertCardItem.timeAgo(hour: 16, minute: 54),
      category: 'Personal info',
      tabBadgeLabel: 'Critical risk',
      leading: const Icon(Icons.badge_outlined),
    ),
    AsmAlertCardItem(
      severity: AsmAlertCardSeverity.moderate,
      title: 'Stay private on WiFi.',
      body: 'Public networks often leave personal data exposed to anyone '
          'on the same connection.',
      category: 'Scams',
      tabBadgeLabel: 'Moderate',
      leading: const Icon(Icons.wifi_tethering),
    ),
    AsmAlertCardItem(
      severity: AsmAlertCardSeverity.low,
      title: 'Your MacOS is out of date',
      category: 'Devices',
      tabBadgeLabel: 'Low',
      leading: const Icon(Icons.laptop_mac),
    ),
  ],
  onActiveChanged: _handleActiveAlertChanged,
  automationIdentifier: 'home-alert-card-deck',
);
```

`onActiveChanged` fires with the new index on every promotion, in multi-alert mode only. This is the hook that keeps the Guided Journey panel in sync — see [Placement](#placement).

### In-card action buttons

```dart
AsmAlertCardItem(
  severity: AsmAlertCardSeverity.high,
  title: 'Petco had a data breach',
  body: 'I found samj@email.com in a data breach.',
  time: AsmAlertCardItem.timeAgo(hour: 16, minute: 54),
  category: 'Personal info',
  tabBadgeLabel: 'Critical risk',
  buttons: [
    AsmButton(
      label: 'Resolve',
      variant: AsmButtonVariant.strictBlack,
      size: AsmButtonSize.medium,
      onPressed: _resolve,
      automationIdentifier: 'breach-alert-resolve',
    ),
    AsmButton(
      label: 'Learn more',
      endIcon: const Icon(Icons.open_in_new),
      variant: AsmButtonVariant.ghost,
      size: AsmButtonSize.medium,
      onPressed: _learnMore,
      automationIdentifier: 'breach-alert-learn-more',
    ),
  ],
);
```

`buttons` are full `AsmButton`s you style yourself — typically a `strictBlack` primary plus a `ghost` secondary, matching the design's black-and-ghost pills. They are legitimate `strictBlack` / `ghost` uses because the card surface is a fixed severity colour, not a themed one. See [[Button]].

`buttons` are **distinct from `actions`**: `buttons` are the in-card action row, `actions` are the icon-only dismiss / snooze controls in the corner. `buttons` are ignored on a `resolved` card and when `activeContent` is set.

### The compact carousel

```dart
AsmAlertCard(
  layout: AsmAlertCardLayout.compact,
  initialIndex: 2,
  items: _alerts,
  actions: _dismissAndSnooze,
  automationIdentifier: 'home-alert-card-carousel',
);
```

Forcing `compact` is for showcase and test only — in the app the layout resolves from width.

### Resolved

```dart
AsmAlertCard(
  items: const [
    AsmAlertCardItem(
      severity: AsmAlertCardSeverity.high,
      title: 'Nice work, issue resolved!',
      body: 'You responded faster than 79% of others',
      resolved: true,
    ),
  ],
  automationIdentifier: 'breach-alert-card-resolved',
);
```

Pass no `actions` and no `buttons` — a resolved card suppresses both. Note that a resolved item with no `time` can be `const`; `AsmAlertCardItem.timeAgo` calls `DateTime.now()`, so any item using it cannot.

### Timestamps

```dart
// "TODAY 4:54 PM"
time: AsmAlertCardItem.timeAgo(hour: 16, minute: 54),

// "SEP 25 4:54 PM"
time: AsmAlertCardItem.timeAgo(days: 9, hour: 16, minute: 54),
```

`timeAgo` is a convenience for building a `DateTime` relative to now — useful for stories and placeholders. In production pass the real `DateTime` from your data.

`detail` accepts a pre-formatted string instead and takes precedence, but an assertion forbids setting both. **Prefer `time`** so formatting and localization stay consistent. `AsmAlertCardItem.effectiveDetail` exposes the resolved string, but it has no `BuildContext` and so falls back to English "Today" — the card does the locale-aware formatting internally.

### Stable tab identifiers

```dart
AsmAlertCardItem(
  severity: AsmAlertCardSeverity.high,
  title: 'Petco had a data breach',
  tabAutomationIdentifier: 'alert-tab-breach-9241',  // keyed on the alert's id
);
```

Without `tabAutomationIdentifier`, each tab gets `'<card-id>-tab-<index>'`. That default **moves when the list is reordered**, which it does on every promotion of a different alert's position in your data. Supply your own, keyed on the alert's identity, whenever automation targets individual tabs.

### `AsmAlertCard` parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `items` | `List<AsmAlertCardItem>` | **Yes** | — (asserted non-empty) |
| `automationIdentifier` | `String` | **Yes** | — (asserted non-empty) |
| `initialIndex` | `int` | No | `0` (clamped into range) |
| `onActiveChanged` | `ValueChanged<int>?` | No | `null` |
| `actions` | `List<AsmIconButton>` | No | `const []` |
| `showNavigationArrows` | `bool?` | No | `null` (auto: shown when `items.length > 1`) |
| `showPagination` | `bool?` | No | `null` — **currently ignored**, see [Open Items](#open-items) |
| `layout` | `AsmAlertCardLayout?` | No | `null` (resolved from width) |
| `height` | `double` | No | `320` — a **minimum** |
| `flipDuration` | `Duration` | No | `350ms` |

### `AsmAlertCardItem` parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `severity` | `AsmAlertCardSeverity` | **Yes** | — |
| `title` | `String` | **Yes** | — |
| `body` | `String?` | No | `null` |
| `detail` | `String?` | No | `null` (mutually exclusive with `time`) |
| `time` | `DateTime?` | No | `null` (mutually exclusive with `detail`) |
| `category` | `String?` | No | `null` |
| `tabBadgeLabel` | `String?` | No | `null` |
| `leading` | `Widget?` | No | `null` (resolved cards default to a check icon) |
| `activeContent` | `Widget?` | No | `null` |
| `buttons` | `List<AsmButton>` | No | `const []` |
| `resolved` | `bool` | No | `false` |
| `tabAutomationIdentifier` | `String?` | No | `null` (`'<card-id>-tab-<index>'`) |

### `AsmAlertCardTab` parameter reference

Only needed when composing a collapsed row outside a deck.

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `detail` | `String?` | No | `null` |
| `severity` | `AsmAlertCardSeverity` | No | `high` |
| `badgeLabel` | `String?` | No | `null` |
| `position` | `AsmAlertCardTabPosition` | No | `below` |
| `onTap` | `VoidCallback?` | No | `null` (inert when both callbacks are null) |
| `onActivate` | `void Function(bool byKeyboard)?` | No | `null` |
| `layout` | `AsmAlertCardLayout` | No | `expanded` |
| `automationIdentifier` | `String` | No | `'asm-alert-card-tab'` — **not unique**, override it |

A tab with both callbacks null is fully inert: not focusable, no ring, no automation hook, no pointer cursor.

### Guidance

- **One `AsmAlertCard` per surface, holding every alert.** Never a `Column` of `AsmAlertCard`s.
- **Put the card inside a scrollable.** `height` is a floor; a fixed-height parent defeats it.
- **Leave `layout` null** unless you are forcing a presentation for a story or a test.
- **Pass `time`, not `detail`.**
- **Supply `actions` in reading order (close first)** — the horizontal cluster reverses them so the first lands nearest the corner, and it overrides their `variant` and `size` regardless of what you set.
- **Give every alert a `tabBadgeLabel`** whose severity matters; it is the non-colour severity signal, and it is uppercased for you, so write it in sentence case.
- **Supply `tabAutomationIdentifier`** when automation targets individual tabs.
- **Never wrap the card in `Semantics`, a `FocusTraversalGroup`, or a `FocusTraversalOrder`.** Each breaks a documented accessibility guarantee.
- **Never wrap it in `GestureDetector`** — the carousel owns horizontal drags and the tabs own taps.
- **Never use `activeContent` as a styling shortcut.** It forfeits the status row, actions, severity foreground, and growth behavior.
- **Do not set `showPagination`** expecting it to do anything.
- The severity fill, foreground, radius, shadow, padding, and type are all resolved internally from tokens — pass no `TextStyle`, no colour, and no padding.

---

## Rules

1. Several alerts MUST be several items in ONE alert card. NEVER stack multiple alert cards on a surface.
2. The alert card MUST be given unbounded vertical space. Its height is a floor, NEVER a fixed size.
3. Every alert MUST have a non-empty title. It is the card's accessible name.
4. Severity MUST NEVER be conveyed by the surface fill alone — the [[Badges|badge]] label and the copy MUST also carry it, because high contrast collapses every fill to one colour.
5. `offline` means the alert CANNOT be evaluated. It MUST NEVER be used as a disabled, empty, or loading state.
6. `offline` MUST NEVER be combined with resolved.
7. A resolved card is terminal: it MUST carry no actions and no in-card buttons.
8. Timestamps MUST be passed as a date, NEVER as a hand-formatted string.
9. `detail` and a date are mutually exclusive; supplying both is a defect.
10. Collapsed tab titles MUST be short enough to read on one truncated line at 80 tall.
11. Layout MUST be allowed to resolve from available width. Override it ONLY to force a presentation for a story or a test.
12. The vertical deck has navigation arrows and NO pagination dots; the carousel has pagination dots and NO navigation arrows. NEVER design around the one that is absent.
13. The deck MUST NEVER be wrapped in a semantic container or a live region — it regroups the whole deck into one unreadable node and re-announces on every animation frame.
14. NEVER add a focus traversal group or focus order inside the deck. Top-to-bottom order is already imposed against the overlapping stack.
15. The focus ring is keyboard-only and MUST NEVER be reimplemented per surface; the input source is tracked deck-wide.
16. Corner actions MUST be supplied in reading order (close first). The component reverses them and overrides their variant and size.
17. The body override MUST be reserved for genuine one-offs — it forfeits the status row, actions, severity foreground, and text-scale growth.
18. Every alert card MUST carry a stable automation identifier, and every tab targeted by automation MUST carry its own.
19. NEVER hardcode the card's fill, foreground, radius, shadow, padding, or type. All come from the layout and severity specs and the token layer.
20. Content MUST NOT be duplicated across badge, category, title, and body.
21. The card MUST remain legible and un-clipped at 200% text scale.

---

## Open Items

1. **`showPagination` is dead.** The parameter is declared, documented, and stored, but never read anywhere in the implementation. Dot pagination renders unconditionally in the compact carousel and not at all in the vertical deck. Either wire the parameter up or remove it — as it stands, a call site that sets it gets silent no-op behavior. Related: the dots it would control are a private re-implementation of `AsmCarouselIndicator` with different geometry, different colours, and per-dot buttons the shared component lacks — see [[Carousel]] open items.
2. **The vertical deck has no positional indicator.** Pagination exists only in the carousel. In a deck of eight alerts the user has the visible tabs and nothing else telling them where in the set they are. Whether that is intended, or whether the deck should also show a count, is unspecified.
3. **The "flourish" is unimplemented.** The animation controller runs for the flip duration **plus a fixed 2000ms lag**, and the class documentation promises "a fading flourish gradient". Nothing consumes the trailing slice: both the deck and the carousel clamp their progress to the flip fraction, so 2000ms of every promotion is a controller running with no visual effect. The widgetbook stories go further and describe per-severity gradients and coral / blue "flourish glows" that the surface code does not paint — it paints solid fills only. Either the flourish was removed and its scaffolding left behind, or it was never built.
4. **Figma and code disagree on the active card's headline size.** `AsmAlertCardItem.title`'s own documentation says the active card renders at 32pt. The implementation uses 36 (`display/small-emphasized`) at `expanded` and 28 (`headline/medium-emphasized`) at `medium` and `compact`. 32 appears nowhere.
5. **Resolved `medium` uses the wrong headline.** The resolved body selects the 36 display headline for every layout except `compact`, so a resolved `medium` card renders at 36 while a non-resolved `medium` card renders at 28. One of the two is wrong.
6. **The high severity's surface and its tab dot disagree.** `high` paints brand orange; its collapsed-tab dot is the `critical` (error red) status colour. The tab implementation's comment states the dot "must read the same colour as the severity badge text and the active card surface for the matching severity" and claims high matches the "brand card" — brand orange and error red are not the same colour. Either the dot should be orange or the comment's premise is wrong.
7. **Pagination dots are not keyboard reachable and are under the touch-target minimum.** Each dot is a plain gesture target with a semantic button label but no focus node, so keyboard and switch-control users cannot reach them at all; the carousel is only navigable by peek tab for those users. The hit cell is 12×32, well under the 48×48 minimum in [[Icons]].
8. **Peek tabs do not paint the branded focus ring.** Every other interactive surface in this component uses the branded ring; the compact peek tabs fall back to the framework's default highlight. This is the same class of defect the branded ring was introduced to fix and it diverges from [[States]].
9. **The compact carousel has no focus stop for the active card.** The vertical deck's active card is a focus stop that a screen reader reads on promotion; the carousel has none, so promotion there always falls back to an explicit announcement. The two presentations therefore have different reading behavior for the same action.
10. **Every screen-reader string in this component is untranslated.** `pageOfCount`, `goToPage`, `showPreviousAlert`, `showNextAlert`, `severityCritical` / `severityModerate` / `severityLow` / `severityOffline`, and `relativeTimeToday` are all listed in the localization backlog. In any non-English locale the alert card's page counts, peek-tab labels, severity words, and timestamp prefix are announced in English.
11. **`tabBadgeLabel` is misnamed.** It drives the severity badge on the **active card** as well as on the collapsed tab. A reader who wants a badge on a single standalone card — where there are no tabs at all — has no reason to look for a field named for tabs.
12. **`AsmAlertCardTab.automationIdentifier` defaults to a shared, non-unique value.** It defaults to `'asm-alert-card-tab'`, so several directly-composed tabs collide on one identifier. The deck overrides it per index, so the default only bites direct users — but the default should not be a colliding one.
13. **The `detail` / `time` assertion message contradicts itself.** It states "detail takes precedence when both are set" inside an assertion that forbids setting both. One of the two claims must go.
14. **The collapsed tab supports a timestamp the deck never passes.** `AsmAlertCardTab.detail` is documented with the example "TODAY 13:10PM FINANCES", but the deck composes a tab's detail from the category alone and drops the timestamp deliberately. The widget's own documentation therefore describes a composition the design forbids.
15. **The automatic layout selection has no lower bound.** Any width below 375 resolves to `compact`, but `compact` imposes a 240 minimum width — so below 240 the card is forced to overflow rather than degrade. Either the band should extend lower or the behavior below 240 should be specified.
16. **The resting height is pinned at Figma's maximum.** Figma's `expanded` and `medium` symbols range from a 256 minimum to a 320 maximum, sizing to content. The implementation pins the resting minimum at 320 — Figma's *max* — so a sparse card that Figma would draw at 256 renders at 320. Deliberate, per the code comment, but it means the Figma symbol cannot be used to verify a short card's height.
17. **Off-scale and raw literal values.** The action area's 10 padding is off the 4px [[Spacing]] scale, as is the collapsed tab's 19→20 snapped badge gap (documented as a snap, so the Figma value itself is off-scale). The navigation-arrow gap uses a raw `4` where a 4px token exists. The severity dot sizes (8 on the collapsed tab, 10 on the peek tab, 6 on a pagination dot) and the tab's inner 48 content height are all raw literals.
18. **Collapsed tab padding is deliberately off its Figma spec.** Figma specifies 24 horizontal / 16 vertical centred in the tab's full 80. Because each tab tucks 24 under its neighbour, the implementation biases the vertical padding ±12 so the title is optically centred in the *visible* strip. The reasoning is sound and documented, but Figma's redlines and the shipped values now disagree and Figma does not record why.
19. **Corner actions are silently re-styled and re-ordered.** The component overrides the caller's variant and size and reverses the order of the horizontal cluster. Both are per the Figma annotation, but neither is discoverable from the parameter's type — a caller who configures a filled, large dismiss button gets a low-emphasis one at a different size, in a different position.
20. **`activeContent` has no guardrails.** It replaces the entire card body, silently dropping the severity foreground colour, the status row, the badge, the corner actions, the reserved action area, and the text-scale growth guarantee, while keeping the severity surface fill. Nothing warns the caller. It should either be narrowed or documented in Figma as a sanctioned escape hatch with its own rules.
21. **Resolved is not modeled for `offline` in Figma.** The implementation falls back to the greyscale offline surface with `on-surface-variant` content, which is an invention rather than a spec. The combination should either be designed or made impossible.
22. **The resolved layout can overlap.** The resolved body stacks the leading icon at the top-left and the message at the centre-left in the same layer. Nothing prevents a tall message from running under the icon at large text scale.
23. **The Guided Journey panel's name and sync mechanics are both unconfirmed.** The draft flags the name itself as needing confirmation, and this folder's own checklist calls the component "guided action panel" — two names for what appears to be one thing. How the pair syncs is also unspecified: whether selecting an alert action auto-opens the panel, swaps its content, or highlights a step. Until both are settled, no doc can state the contract between the two components.
24. **One component this doc depends on still has no page in this folder.** The guided journey / action panel defines where the alert card sits and is linked to it, but has no doc, so neither the decision tree nor [Placement](#placement) can route to it. The other fixed element — the navigation rail, which defines the card's left boundary — is now documented in [[Navigation Rail]], and that doc raises one finding this card's layout inherits: the rail's 60pt is *derived* from its slot geometry rather than declared, while [[Grid]] treats 60 as the fixed region every content width is computed from, with nothing tying the two together ([[Navigation Rail]] open item 17). If the rail's slot extent ever changes, this card's content region changes with it and no assertion will catch it. The general-purpose card is likewise now documented in [[Cards]], which is the surface this component is built on and which raises two findings this card inherits: the `surface` fill is only 1.17 : 1 against the app canvas, so the card's boundary depends entirely on its shadow, and that shadow is rendered at half the token's blur ([[Cards]] open items). The severity badge — the load-bearing dependency, since it is this card's required non-colour severity signal — is now documented in [[Badges]]. That doc raises two findings this card inherits: the badge it renders is `primary` at 12pt beside 11pt mono metadata, one point out of step with the row it sits in ([[Badges]] open item 3), and `primary` + `high`, the exact combination this card uses, computes to roughly 3.7 : 1 text contrast ([[Badges]] open item 2).
25. **Figma was not re-verified in this pass.** Every geometry, token, and node reference above is drawn from the implementation, which cites Figma extensively and inline: `alert_card` (`3851-704`), the redesign frame (`5849:2563`), the action cluster (`2424:2029`), the compact frame (`2424:1945`), the contents frame (`2582:3033`), the footer (`12105:2791`), the action area (`9912:11914`), `alert_card_list` (`7872-4161`), and `resolved_card` (`4231-16054`). The component registry lists only `3851-704` for this component. The values here are therefore Figma-*as-recorded-in-code*, not Figma-as-measured, and items 4, 5, 6, 14, 16, and 18 are exactly the kind of drift that a direct Figma pass would settle.
