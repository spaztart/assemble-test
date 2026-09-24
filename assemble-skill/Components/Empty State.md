# Component: Empty State

> Role: What a surface shows when it has nothing to show.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: An empty state MUST say why it is empty and what to do next. "No data" tells the user nothing they couldn't already see.
> Source: Figma `Components` → `empty` (node `6513-35704`), variants `type = for_card | for_page` × `size = Default | mobile | desktop`. Implementation: `pegasus_flutter/lib/asm/components/empty_state.dart`.

## Overview

A blank region is ambiguous in a way that costs the user real time: it might be loading, it might be broken, or it might genuinely have nothing in it. An empty state removes that ambiguity by saying which.

**Emptiness has three causes, and they need three different messages.**

- **Nothing yet** — the feature works, the user hasn't used it. This is an onboarding moment: explain the value, offer the first action.
- **Nothing left** — the user cleared everything. This is a success: say so. "No threats found" is good news and should read like it.
- **Nothing matched** — a filter or search excluded everything. The data exists; the query is too narrow. Offer to widen it.

Conflating these produces the most common failure: a triumphant "All clear!" when the user's search simply had a typo, or a bleak "No data" when the user has genuinely finished everything.

**An empty state is not an error and not a wait.** A failed request is an [[Alert Banner]] — something went wrong and may be retryable. A pending request is a [[Loaders|spinner]] or a [[Skeleton Loader]] — content is coming. An empty state is the answer: the request succeeded, and the answer is none.

**Two scales.** A **card** empty state fills a region inside a populated screen — one panel of several has nothing in it. A **page** empty state is the whole screen, and can afford a larger illustration and a fuller explanation.

**The action is the point.** An empty state that only describes the emptiness leaves the user where they started. The one that offers the next step — add a device, clear the filter, run a scan — converts a dead end into a path.

## Anatomy

```
   CARD — inside a panel that has nothing in it

         ┌─────────┐
         │   ⊘     │        ← icon in a circular badge
         └─────────┘
        No devices yet      ← heading, small + emphasized
     Add a device to start   ← description, smaller + subtle
       protecting it.
        ┌──────────────┐
        │  Add device  │     ← action
        └──────────────┘


   PAGE — the whole screen

              ⊘             ← icon, larger, no badge

        You're offline       ← title, larger

    Check your connection    ← description
     and we'll try again.

        ┌──────────────┐
        │    Retry     │
        └──────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Heading** | Yes | Announced as a heading. Says what is empty and why. |
| Icon | Optional but expected | Circular badge in the card form; plain and larger on the page. Decorative — silent to assistive tech. |
| Description | Optional | One or two lines. What to do, or why this is fine. |
| Action | Optional | Usually a [[Button]]. The next step. |

**Everything is centred**, in both forms, with generous space around it. That centring is what makes an empty state read as an intentional message rather than as content that failed to lay out.

**The heading is a heading, structurally.** Assistive tech announces it as one, so a screen-reader user landing in the region hears the state's name at heading level rather than as loose text.

**The icon carries no information.** It is decorative and silent by design — which means whatever it depicts must also be said in the text.

### Geometry

| Property | Card | Page (mobile) | Page (desktop) |
| --- | --- | --- | --- |
| Icon glyph | 24 | 48 | 64 |
| Icon badge | circle, glyph + 8 all round (40 for a 24 glyph) | none | none |
| Badge fill | `surface-container-low` | — | — |
| Icon colour | `on-surface-variant` | `on-surface-variant` | `on-surface-variant` |
| Heading | body medium emphasized | title medium emphasized | title large |
| Heading colour | `on-surface-variant` | `on-surface-variant` | `on-surface-variant` |
| Description | body small | body medium | body large |
| Description colour | `on-background` | `on-surface-variant` | `on-surface-variant` |
| Gap, heading → description | 4 | 4 | 4 |
| Gap, icon → text and text → action | 16 | 16 | 16 |
| Outer padding | 16 all sides | 16 | 16 |

**The badge grows from the glyph rather than being a fixed circle.** It is the glyph plus 8 on every side, so at 200% text scale the circle expands with the icon instead of clipping it. That's the correct way to build a badge and worth copying.

**The page form has a breakpoint at 600.** Below it, the compact mobile treatment; at or above it, the roomier desktop one — icon, heading, and description all step up together. The card form does not reflow at all, which is right: it is sized by whatever panel contains it.

**Note the description colour differs between forms** — the card uses `on-background`, the page uses `on-surface-variant`. See [Open Items](#open-items).

## Variants

| Variant | Use when |
| --- | --- |
| **Card** (default) | A region inside a populated screen is empty — one panel, one list, one table. |
| **Page** | The entire screen has nothing. Offline, no account, nothing set up yet. |

**Pick by what is empty, not by how bad it is.** An empty page is not more serious than an empty card; it is simply larger. A dramatic full-page treatment for one empty panel implies the whole app failed.

**The page form has two sizes and picks between them itself** from the width it is given. There is no manual size choice — which is correct, because the component is often inside a panel narrower than the window.

## Behaviors

**An empty state is static.** No motion, no state layers, nothing focusable. The only interactive thing in it is the action the consumer supplies, which brings its own focus and keyboard behaviour.

**It replaces the content region, not the whole screen.** A screen with a populated sidebar and an empty detail pane shows the card form in the pane. Blanking the whole screen loses the user's context.

**Reaching an empty state is not announced.** Nothing tells a screen-reader user that a list they were just reading now has nothing in it. If a filter change or a bulk delete empties a region, the announcement is the consumer's job — see [Accessibility](#accessibility).

**The icon can be swapped for any widget** — an illustration, a brand mark, an animated graphic. It stays decorative and silent either way.

**Every dimension has an override**: glyph size, icon colour, badge colour, padding. These are escape hatches, and each one is a way to break dark mode or drift from the design.

**Text wraps; nothing is fixed-height.** Both forms stay legible at 200% text scale, and the page form additionally reflows between its two variants.

## Decision Tree

```
Does the surface have content to show?
├── yes ─────────────────────────────────────────→ show it
└── no
    │
    ├── Is content still on its way?
    │   ├── layout known ────────────────────────→ [[Skeleton Loader]]
    │   └── layout unknown ──────────────────────→ [[Loaders]]
    │
    ├── Did the request FAIL?
    │   └── yes → [[Alert Banner]] (in-page, retryable) or
    │             [[Modal]] (blocking) — an error is not an
    │             empty state
    │
    └── The request succeeded and the answer is "none":
        │
        ├── WHY is it empty? (this determines the copy)
        │   ├── nothing yet ──→ onboarding tone; action = create
        │   │                   the first thing
        │   ├── nothing left ─→ success tone; action optional
        │   │                   ("No threats found")
        │   └── nothing matched → the data exists, the query is
        │                        too narrow; action = clear the
        │                        filter or the search
        │
        └── WHAT is empty? (this determines the form)
            ├── one region inside a populated screen ──→ CARD
            └── the whole screen ──────────────────────→ PAGE
                (which auto-selects mobile vs desktop)
```

**"Nothing matched" is the case most often got wrong.** It looks like emptiness and is actually a query problem, and the action that fixes it — clear the filter — is not the action that fixes "nothing yet".

**Don't reach for an empty state when a single sentence would do.** A settings panel with one unset option doesn't need an icon and a heading; it needs the option, unset. The empty state is for a region whose entire purpose is to list things and has nothing to list.

**A chart with nothing to show needs an empty state, and will not tell you so.** [[Data Arc Chart]] and [[Data Linear Chart]] both require a non-empty segment list but place no constraint on the values, and both stop drawing when the values sum to zero — producing a blank ring or an empty strip with a legend of zeros rather than an error. Check the sum at the call site and swap in an empty state, in the "nothing left" tone if zero is the good answer ("No threats found") and the "nothing yet" tone if the data has not arrived.

## Content

**The heading names what is empty.** "No devices yet", not "Empty" and not "No data". A user who can see the blank space already knows it's empty; the heading's job is to say *what*.

**The description says what to do, or why the emptiness is fine.**

- Nothing yet → what this region will hold and how to fill it. *"Add a device to start protecting it."*
- Nothing left → confirm it's good. *"You're all caught up."*
- Nothing matched → point at the query. *"No results for 'saftey'. Try a different search."*

**Match the tone to the cause.** "All clear!" for a successful scan is right; the same words for a failed search are actively misleading.

**The action is a verb.** "Add device", "Clear filters", "Run a scan" — not "OK", not "Continue", and never nothing at all when there is an obvious next step.

**One action, or at most two.** An empty state is not a menu. If there are three ways forward, the region isn't empty — it's a choice, which is a different component.

**Don't apologise and don't blame.** "Sorry, we couldn't find anything" implies failure where there was none. State the fact.

**Keep the description to a line or two.** It is centred text; a paragraph of centred prose is hard to read and signals that something went wrong.

**Say what the icon shows.** It's decorative and silent, so a magnifying glass over "No results" means nothing to a screen-reader user unless the heading says "No results".

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Heading role** | Yes — the title is announced as a heading. |
| **Decorative icon silenced** | Yes — excluded from semantics. |
| **Heading override** | Yes — for a title too terse to stand alone. |
| **Not focusable** | Correct — only the action takes focus. |
| **Theme-aware** | Yes — every default resolves from tokens. |
| **200% text scale** | Yes — no fixed heights; the badge grows with the glyph. |
| **Responsive** | Page form reflows at 600. |
| **Colour not the sole signal** | Yes — the message is text. |
| **Arrival announced** | **No** — the consumer must do it. |

**Nothing announces that a region became empty.** A user who filters a list down to nothing gets no feedback: the rows vanish and the empty state renders silently. This is the component's one real accessibility gap, and it is the consumer's to close — put a live region on the container so the transition is announced.

**Override the announced heading when the visible one is terse.** "All clear" out of context could be anything; announcing "No security threats found" is more useful. The visible text stays short.

**The description is not announced as anything in particular.** It follows the heading as plain text, which is fine — but it means a screen-reader user navigating by heading hears the title and must read on for the instruction.

**The action is announced as whatever it is.** If it's a [[Button]] it brings the full button contract — focus ring, keyboard activation, automation identifier. The empty state adds nothing and takes nothing away.

**Contrast is worth checking on the card form.** Its description resolves to a deliberately subtle token against a card surface; small subtle text on a raised surface is the combination most likely to fail a contrast check.

## Anti-Patterns

**❌ "No data".** Says nothing the blank space didn't. → Name what's empty.

**❌ An empty state with no next step when one exists.** → Add the action.

**❌ The same copy for "nothing yet" and "nothing matched".** One needs onboarding, the other needs the filter cleared. → Write all three cases separately.

**❌ A success tone on a failed search.** "All clear!" for a typo'd query. → Match tone to cause.

**❌ An empty state for a failed request.** → [[Alert Banner]].

**❌ An empty state while content is loading.** → [[Skeleton Loader]] or [[Loaders]].

**❌ A page empty state for one empty panel.** Implies the whole app failed. → Card form in the panel.

**❌ Blanking the whole screen when only the detail pane is empty.** Loses the user's context. → Fill the pane.

**❌ Relying on the icon to carry meaning.** It is silent to assistive tech. → Say it in the heading.

**❌ Three or more actions.** → One, or at most two.

**❌ A paragraph of centred description.** → One or two lines.

**❌ Apologising for a normal state.** → State the fact.

**❌ No announcement when a region becomes empty.** → Live region on the container.

**❌ Hardcoded icon or badge colours.** Breaks dark mode. → Let them resolve from tokens.

**❌ An empty state where a single unset field would do.** → Just show the field.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmEmptyState`, from `pegasus_flutter/lib/asm/components/empty_state.dart`.

Every parameter is optional. It is not interactive and takes no `automationIdentifier` — the action supplies its own.

### Enum

```dart
enum AsmEmptyStateType { card, page }
// default: card
```

### The card form — an empty region

```dart
const AsmEmptyState(
  icon: Icons.devices_outlined,
  title: 'No devices yet',
  description: 'Add a device to start protecting it.',
  action: AsmButton(
    label: 'Add device',
    onPressed: _addDevice,
    automationIdentifier: 'empty-devices-add',
  ),
);
```

### The page form — the whole screen

```dart
const AsmEmptyState(
  type: AsmEmptyStateType.page,
  icon: Icons.wifi_off_outlined,
  title: "You're offline",
  description: "Check your connection and we'll try again.",
  action: AsmButton(
    label: 'Retry',
    onPressed: _retry,
    automationIdentifier: 'offline-retry',
  ),
);
```

The mobile / desktop variant is chosen from the width the widget is given — 600 is the breakpoint, exposed as `AsmEmptyState.pageDesktopBreakpoint`. Nothing to pass.

### The filtered-to-nothing case

```dart
AsmEmptyState(
  icon: Icons.search_off_outlined,
  title: 'No results for "$query"',
  // Points at the query, not at the absence of data.
  description: 'Try a different search or clear your filters.',
  action: AsmButton(
    label: 'Clear filters',
    variant: AsmButtonVariant.text,
    onPressed: _clearFilters,
    automationIdentifier: 'no-results-clear-filters',
  ),
);
```

### Announcing that a region emptied

The component does not do this. Put it on the container:

```dart
Semantics(
  liveRegion: true,
  child: results.isEmpty
      ? const AsmEmptyState(
          icon: Icons.search_off_outlined,
          title: 'No results',
          description: 'Try a different search.',
        )
      : _ResultsList(results: results),
);
```

### A terse title with a fuller announcement

```dart
const AsmEmptyState(
  icon: Icons.verified_user_outlined,
  title: 'All clear',
  // "All clear" alone is ambiguous out of context.
  semanticTitle: 'No security threats found',
  description: "We didn't find any threats on this device.",
);
```

### An illustration instead of an icon

```dart
AsmEmptyState(
  type: AsmEmptyStateType.page,
  iconWidget: Image.asset('assets/empty_inbox.png', width: 120),
  title: 'Nothing in your inbox',
);
```

`iconWidget` takes precedence over `icon` and stays decorative — so the heading still has to carry the meaning.

### Text only

```dart
const AsmEmptyState(
  showIcon: false,
  title: 'No notifications yet',
);
```

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `type` | `AsmEmptyStateType` | No | `card` |
| `icon` | `IconData?` | No | none |
| `iconWidget` | `Widget?` | No | none — wins over `icon` |
| `showIcon` | `bool` | No | `true` |
| `title` | `String` | No | `'No data'` |
| `description` | `String?` | No | none |
| `action` | `Widget?` | No | none |
| `iconSize` | `double?` | No | 24 card / 48 mobile / 64 desktop |
| `iconColor` | `Color?` | No | `onSurfaceVariant` |
| `iconBackgroundColor` | `Color?` | No | `surfaceContainerLow` (card only) |
| `padding` | `EdgeInsets?` | No | 16 all sides |
| `semanticTitle` | `String?` | No | inherits `title` |

### Guidance

- **Always pass a `title`.** The default is `'No data'`, which is the anti-pattern shipped as a default — see [Open Items](#open-items).
- **Put a live region on the container** so emptying is announced.
- **Use `semanticTitle` when the visible title is terse.**
- **Don't pass `iconColor` or `iconBackgroundColor`.** They bypass the token layer and break dark mode and high contrast.
- **Don't pass `iconSize`** unless you have a Figma value that differs — the defaults are the design.
- **Use `padding` to fit the container**, not to change the look. It is the one override with a legitimate layout reason.
- **`iconWidget` for illustrations**, and remember it stays silent.
- **Give the page form real width** — it needs 600 to reach the desktop variant, and inside a narrow pane it will render the mobile one.
- **Card form inside a panel, page form for a screen.**

---

## Rules

1. An empty state MUST name what is empty — never just "No data".
2. The three causes — nothing yet, nothing left, nothing matched — MUST have distinct copy.
3. The tone MUST match the cause; success language MUST NOT be used for a failed query.
4. An empty state MUST offer the next step when one exists.
5. An empty state MUST NOT be used for a failed request — that is an [[Alert Banner]].
6. An empty state MUST NOT be used while content is loading — that is a [[Skeleton Loader]] or [[Loaders]].
7. The card form MUST be used for a region; the page form only for a whole screen.
8. Only the empty region MUST be replaced, never the surrounding screen.
9. The heading MUST carry the meaning the icon depicts — the icon is silent.
10. An empty state MUST offer at most two actions.
11. The description MUST be one or two lines.
12. An empty state MUST NOT apologise for a normal state.
13. The container MUST announce the transition to empty via a live region.
14. Icon and badge colours MUST resolve from tokens — never pass an override.
15. Padding MUST be adjusted only to fit the container, never for appearance.
16. A terse visible title MUST be paired with a fuller announced title.

---

## Open Items

1. **The default title is `'No data'`** — the exact string this doc's central rule forbids. A component whose default violates its own guidance will ship that violation wherever the parameter is forgotten, and the assert only catches the empty string. `title` should be required.
2. **The card and page forms use different description colours** — the card resolves `on-background` from the extended colours, the page uses `on-surface-variant`. Nothing in the source explains the divergence, and it means the same sentence renders in two tones depending on the form. One of them is wrong.
3. **The card's heading and description use `on-surface-variant` and a subtle extended token, not `on-surface`.** Small, deliberately de-emphasised text on a raised card surface is the combination most likely to fail WCAG 1.4.3, and no contrast measurement is recorded anywhere. Worth verifying in the high-contrast themes specifically, per `40_accessibility.md`'s open contrast-theme row.
4. **Nothing announces the arrival of an empty state.** Every consumer must remember a live region on the container, and none of them will. The same structural gap as [[Skeleton Loader]] — a component that is accessible in isolation but whose *transition* is invisible, with the fix living outside the component.
5. **Four token-escape-hatch parameters**: `iconSize`, `iconColor`, `iconBackgroundColor`, `padding`. Three of them bypass the token layer outright. This is now the fifth component with colour overrides in its public surface — after [[Switch]], [[Loaders]], and [[Progress Bar]] — and the pattern is consistent enough to be a system-level decision that was never made deliberately.
6. **The icon glyph sizes (24 / 48 / 64) are inline literals.** No icon-size token scale exists, so every component invents its own — the same gap recorded in [[Checkbox]], [[Radio]], [[Switch]], and the loaders.
7. **Figma's card variant has a `size` property set to `Default`**, which implies other card sizes exist or were planned. Only one card size ships, and nothing records whether `Default` is the only value.
8. **The `showIcon` flag is redundant.** Passing no icon and no icon widget already yields the text-only form; `showIcon: false` with an icon supplied is the only case it covers, and that combination has no use. Two ways to express one state.
9. **There is no compound "empty + filter" form.** The most common empty state in a data-heavy product is a table filtered to nothing, where the right treatment keeps the filter controls visible above the message. Consumers assemble that by hand — the same missing-container pattern as [[Switch]]'s settings row, [[Progress Bar]]'s labelled row, and [[Skeleton Loader]]'s group.
10. **No illustration slot beyond `iconWidget`.** Real empty states in consumer products usually carry an illustration, not a glyph, and `iconWidget` inherits the icon's 16px gap and centred column without any layout accommodation for something taller than 64.
11. **The action slot is an untyped widget.** Nothing constrains it to a [[Button]], so an empty state with a whole form in its action slot compiles. The description mentions a `Wrap` of buttons as acceptable, which quietly permits the three-action case the design does not support.
12. **The page breakpoint of 600 is correctly named and documented**; it is the only breakpoint in the component and the card form has none. That is defensible, but it means a card empty state in a very wide panel keeps a 24px glyph and small text — the icon does not scale with the region at all.
