# Component: Status Indicators

> Role: The smallest possible statement of state. A coloured dot that says what condition something is in, optionally with a short uppercase label, and a numeric badge that says how many things need attention.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A status indicator MUST NEVER convey meaning by colour alone. A bare 6px dot differing only in hue is unreadable to a colour-blind user and unreadable to anyone at a glance — pair it with a label, an adjacent text state, or do not use it.
> Source: Figma `Components` → `status-indicator` (`4101-18217`, set `1:77`), `status-label` (`4101-18603`, set `2404:758`), and `status-notifications` (`4101-16713`, set `2540:4757`). Implementation: `pegasus_flutter/lib/asm/components/status_indicator.dart` (`AsmStatusIndicator`) and `status_notification.dart` (`AsmStatusNotification`).

## Overview

These are the system's atoms of state. They carry no interaction, no layout, and almost no content — a dot, sometimes a word, sometimes a number. They exist to be embedded in something bigger: a list row, a navigation destination, a device tile, a card tab.

**Three forms, two of which are the same component.**

| Form | What it says | Figma | Code |
| --- | --- | --- | --- |
| **Status dot** | "This thing is in this condition" | `status-indicator` | `AsmStatusIndicator` |
| **Status label** | The same, with the condition named | `status-label` | `AsmStatusIndicator(label: …)` |
| **Notification badge** | "This many things want you" | `status-notifications` | `AsmStatusNotification` |

The dot and the label are one component with the label optional — which is right, because the label is the accessible form of the dot and the dot should rarely appear without it.

**The notification badge is a different thing that happens to look similar.** A dot says *what state*; a notification badge says *how many*. A notification badge with no number is meaningless; a dot with a number would be a notification badge. They do not substitute for each other, and they should not appear together on the same element.

**And a third component is also called a badge, and it is not in this doc.** [[Badges]] (`AsmBadge`) is an uppercase mono chip carrying a *severity word* — `CRITICAL RISK`, `DISMISSED`. So the word "badge" covers three components: the numeric notification badge and the dot-plus-word status label live here, and the severity chip lives in [[Badges]]. The test is what the chip contains — **a number is a notification badge, a severity word is a [[Badges|badge]], a condition word beside a bare dot is a status label.** Note that the status label and the `secondary` [[Badges|badge]] are near-identical in construction: both are a 6px dot plus an uppercase mono word, differing only in the type ramp and in whether the word names a condition or a severity.

**What none of these do:** they are not interactive, they do not animate (except the badge's loading form), they take no focus, and they never appear alone as the sole carrier of important information. Every one of them is an annotation on something else.

**The scale is the point and the problem.** A 6×6 dot is small enough to sit inside a list row without disturbing it. It is also small enough that its colour is the only thing distinguishing it, at a size where hue discrimination is at its worst. That tension runs through the whole of this doc — see [Colour & Meaning](#colour--meaning) and [Accessibility](#accessibility).

## Anatomy

### Status dot

```
        ●        ← 6 × 6, solid fill, fully round
                   status colour, no border, no icon

        ○        ← `offline` only: a 1px ring, no fill
```

### Status label

```
        ●  STATUS-LABEL
        └4┘
              ← 11pt mono, BOLD, UPPERCASE
                4pt gap · dot optically centred on the caps
```

### Notification badge

```
       ╭────╮        ╭──────╮        ╭─────╮
       │ 3  │        │ 99+  │        │  ◠  │
       ╰────╯        ╰──────╯        ╰─────╯
        18×18       grows to 34      loader
        radius 999 · px 4 · 12pt mono bold, uppercase
```

| Part | Required | Notes |
| --- | --- | --- |
| **Dot** | Yes (dot / label) | 6×6, fully round. Solid fill for every status except `offline`, which is a 1px ring. |
| Label | Optional | `label/mono/small-mono-emphasized` — 11pt mono, **bold**, **uppercase**, line height 1.0. 4pt from the dot. |
| **Badge pill** | Yes (badge) | 18×18 at rest, radius 999, 4pt horizontal padding. Grows to 34 for wider counts, then clips. |
| Count | Yes (badge) | 12pt mono **bold**, uppercase, `inverse-on-surface`. `99+` above 99. |
| Loader | Badge variant | An 18×18 arc in `secondary` on a transparent pill. |
| Icon | **No** | Neither form carries an icon. See [Open Items](#open-items). |
| Border | Only `offline` | Every other status is a solid fill. |

**The dot is drawn as 2pt of padding around a 2pt spacer** — that is how the Figma symbol is built, and it is why 6 is the number: `2 + 2 + 2`. There is no inner element to see; the whole dot is the container's fill.

**The label is bold, uppercase, and mono.** All three at once, at 11pt. That is a deliberately un-prose treatment — it reads as a machine state (`ONLINE`, `AT RISK`, `PROTECTED`), not as a sentence. It also means the label is wide per character, so labels must be one or two short words.

**The dot's vertical alignment against the label is not naive centring.** Mono faces reserve line-box space above the caps for ascenders the uppercase label never uses, so box-centring the text puts the caps visibly below the dot. The label's line-box padding has to be distributed evenly for the caps' optical centre to land on the dot.

**The badge's count is uppercase mono bold — the same family as the label, one step up in size.** That consistency is what makes a badge and a label read as members of one family despite doing different jobs.

## Sizes

| Property | Status dot | Status label | Badge |
| --- | --- | --- | --- |
| Size | 6 × 6 | 6 dot + 4 gap + label | 18 × 18 at rest |
| Max size | — | Label width | 34 × 34 |
| Padding | 2 (internal, structural) | 0 | 4 horizontal |
| Corner radius | Full | — | Full (999) |
| Label / count type | — | 11pt mono bold | 12pt mono bold |
| Border width | 1 (`offline` only) | — | None |

**There is one dot size.** 6 is not a default among options — it is the size. A larger dot is a different component (an icon, a [[Tags|tag]], a bordered container).

**The badge grows on one axis and clips on the other.** It starts at 18×18, widens as the count widens, and stops at 34. Above that the content is clipped, which is why counts above 99 render as `99+` rather than being allowed to overflow. 34 is not on the 4pt spacing scale.

## Variants

### Status dot — the matrix

Figma models the dot on **7 statuses × 2 styles = 14 symbols**, all of which exist in the file.

| Status | `style=neutral` | `style=inverse` | Shipped |
| --- | --- | --- | --- |
| `critical` | `error` — solid | `error-container` — solid | ✅ |
| `attention` | `attention` — solid | `attention-container` — solid | ✅ |
| `info` | `secondary` — solid | `secondary-container` — solid | ✅ |
| `positive` | `positive` — solid | `positive-container` — solid | ✅ |
| `muted` | `outline` — solid | `outline-variant` — solid | ⚠️ — see [Open Items](#open-items) |
| `offline` | `outline` — 1px ring | `outline-variant` — 1px ring | ✅ |
| `inverse` | `inverse-on-surface` — 1px ring | `surface-bright` — 1px ring | ❌ **not implemented** |

**`style` is not a decoration — it is which surface the dot is sitting on.** `neutral` uses the saturated status colours, which are legible on a light surface. `inverse` uses the lighter `-container` colours, which are legible on a dark one. Choosing the wrong style makes the dot nearly invisible, which is the whole failure mode this axis exists to prevent.

**`inverse` is both a style and a status, and they are unrelated.** `status=inverse` is a near-white hollow ring — the seventh status, for a dot that needs to read as "present but unremarkable" against a coloured or dark surface. It is not implemented and has no name in code. Do not confuse it with `style=inverse`.

### Status label — the matrix

Figma models the label on **6 statuses × 3 label styles**, of which **16 of 18 exist**:

| Status | `neutral` label | `colored` label | `inverse` label |
| --- | --- | --- | --- |
| `critical` | `on-surface-variant` | `error` | `inverse-on-surface` |
| `attention` | `on-surface-variant` | `attention` | `inverse-on-surface` |
| `info` | `on-surface-variant` | `secondary` | `inverse-on-surface` |
| `positive` | `on-surface-variant` | `positive` | `inverse-on-surface` |
| `muted` | `on-surface-variant` | **absent** | `inverse-on-surface` |
| `offline` | `on-surface-variant` | **absent** | `inverse-on-surface` |

**`muted` and `offline` have no coloured label, deliberately.** Both are absence-of-state statuses; tinting their labels grey-on-grey would say nothing that the dot does not already say. Both fall back to the neutral label colour.

**`colored` is a label style, not a dot style.** In every `colored` combination the dot keeps its `neutral` fill and only the text takes the status colour. This is worth stating because the two axes have the same value names on two different components.

**Note that `status=inverse` has no label form.** The seventh dot status appears only on the bare dot.

### Notification badge

Four statuses, no style axis:

| Status | Fill | Content |
| --- | --- | --- |
| `critical` | `error` | The count |
| `attention` | `attention` | The count |
| `info` | `secondary` | The count |
| `loader` | Transparent | An arc in `secondary` |

**There is no `positive` badge, and there should not be.** A badge means "attend to this." Nothing positive needs a count on it.

**`loader` is not a status — it is the absence of a count.** It occupies the badge's footprint while the number is in flight, so the layout does not jump when the number arrives. It is not a general-purpose spinner; for that, see [[Loaders]].

## Colour & Meaning

The status vocabulary is shared across this component, [[Alert Banner]], and [[Tags]], and it is worth stating once in full because the distinction between the two urgent statuses is the one people get wrong.

**It is not shared with [[Badges]], though it should be.** The severity chip uses `high` / `moderate` / `low` where this component uses `critical` / `info` / `positive` for the same three colours, has no `attention` or `muted` at all, and adds `dismissed` and `stat` with no counterpart here. Translating between the two is currently a call-site problem — see [[Badges]] open item 10.

| Status | Colour | Means | Example |
| --- | --- | --- | --- |
| `critical` | `#FF1C1C` red | Something is wrong **now** and the user is exposed | Protection off, breach found |
| `attention` | `#FF6136` orange | Something needs the user **soon**, but nothing is broken | Scan overdue, subscription expiring |
| `info` | `#6161FF` violet | Neutral information worth noticing | Update available, new feature |
| `positive` | `#00866F` green | Confirmed good | Protected, up to date |
| `muted` | `#BBB6B6` grey | Known, and deliberately not important | Ignored item, disabled feature |
| `offline` | ring, grey | State is **unknown**, not bad | Device not reporting |
| `inverse` | ring, near-white | Present, unremarkable, on a dark surface | *(unimplemented)* |

**`critical` and `attention` are four hue-degrees apart at 6 pixels.** `#FF1C1C` and `#FF6136` are both saturated red-orange. Side by side in a legend they are distinguishable; in isolation in a list row, they are not — not for a user with normal colour vision, and certainly not for the ~8% of men with a red-green deficiency. **This is the single strongest argument for never shipping a bare dot.** The label is not an enhancement to the dot; it is what makes the dot mean anything.

**`muted` and `offline` say different things and look nearly identical.** Both grey, one filled and one hollow, at 6px. "Deliberately unimportant" and "we don't know" are different facts and a user will not tell them apart. If the distinction matters, label them.

**`offline` is the only status with a shape, and that is the pattern to extend.** A hollow ring versus a filled circle is a non-colour signal, and it is the one place this component satisfies WCAG 1.4.1 on its own. Every other status relies on hue. See [Open Items](#open-items).

## States

**These components have no interactive states.** No hover, no pressed, no focus, no disabled. They are not focusable and not tappable.

**The status *is* the state.** That is the whole design: rather than one indicator with six states, there are six statuses each with one appearance. Changing state means changing the status, which changes the fill.

**There is no transition between statuses.** A dot going from `positive` to `critical` cuts. No motion is specified anywhere — see [Open Items](#open-items).

**The badge's `loader` form is the only motion in the family**, and it is a loading treatment rather than a state.

**When these sit on something interactive** — a navigation destination, a card tab, a list row — the *parent* owns the states. The dot does not highlight when its row is hovered, and it must not be a second tap target inside its parent.

## Behaviors

**Always embedded, never standalone.** A dot annotates a thing. A badge annotates a destination or a count-bearing element. Neither is a layout element on its own.

**The badge sits on the ending edge of what it counts** — the trailing corner of an icon, a tile, or a navigation item, overlapping it. It is not inline in a text run.

**The dot leads its label**, always to the left in a left-to-right layout, with the caps optically centred on it.

**Neither reflows anything.** The dot is fixed at 6; the badge grows within 18–34 and clips beyond. Adding or removing one must not shift the layout around it — which for the badge means reserving its footprint, and is why `loader` exists.

**The count is truncated, not wrapped.** Above 99 the badge shows `99+`. There is no two-line badge.

**Text scale grows the label and the count but not the dot or the pill.** The dot is a graphic, so it stays 6. The badge pill is capped at 34, so a scaled numeral clips — see [Open Items](#open-items).

**Nothing here is announced as a live region.** A status that *changes* and needs to be noticed is a [[Snackbar]] or an [[Alert Banner]] event; the dot is the resting representation, not the announcement.

## Content

**Labels are one or two words, uppercase, machine-terse.** `PROTECTED`, `AT RISK`, `OFFLINE`, `SCAN DUE`. The uppercase mono treatment does the work of saying "this is a state, not prose" — a sentence in that style reads as shouting.

**Label the state, not the remedy.** `AT RISK`, not `TURN ON PROTECTION`. The remedy is a [[Button]] or an [[Alert Banner]].

**Write the label to the width you have.** 11pt bold mono is wide; ten characters is roughly 66pt before the dot and gap. A label that has to truncate is worse than no label, because a truncated state name can read as a different state.

**Notification badges hold a count and nothing else.** No `!`, no `NEW`, no letters. A word in one means you wanted a [[Tags|tag]], a status label, or a severity [[Badges|badge]] instead.

**Do not put `0` in a badge.** Zero things needing attention means no badge.

**Say what the count counts, in the accessible name.** "3" announced alone tells a screen-reader user nothing; "3 unread alerts" tells them everything.

## Decision Tree

```
What are you annotating?
│
├── A count of things wanting attention
│   ├── The count is known ───────────────────────→ Notification badge
│   ├── The count is loading ─────────────────────→ Badge, loader form
│   └── The count is zero ────────────────────────→ Nothing. No badge.
│
├── The condition of one thing
│   ├── There is room for a word ─────────────────→ Status label (dot + label)
│   ├── There is genuinely no room, AND the
│   │   condition is named in adjacent text ──────→ Bare status dot
│   └── There is no room and nothing names it ────→ Find room. Not a bare dot.
│
├── How urgent something is, in a word ──────────→ [[Badges]]
│   (a severity, not a condition — "CRITICAL RISK")
│
├── A category, a filter, or an attribute ────────→ [[Tags]]
│
├── A condition the user must act on ─────────────→ [[Alert Banner]]
│
├── Something that just happened ─────────────────→ [[Snackbar]]
│
└── Something in progress
    ├── With a known proportion ──────────────────→ [[Progress Bar]]
    ├── Indeterminate, blocking ───────────────────→ [[Loaders]]
    └── Content arriving in place ─────────────────→ [[Skeleton Loader]]
```

**The branch to take seriously is "there is no room and nothing names it."** That is the branch every bare dot in the wild came down, and the answer is not "ship the dot anyway." A dot whose meaning appears nowhere on screen is decoration that looks like information.

**Status label vs. [[Tags]] is the other frequent confusion.** A status label is a dot plus an uppercase word with no container — it describes the *condition* of the row it sits in. A tag is a filled or outlined pill — it describes a *category or attribute*, and it can be interactive. If the user could click it to filter, it is a tag.

## Accessibility

| Requirement | Status dot | Status label | Badge |
| --- | --- | --- | --- |
| Announced | The status name — English-only, see [Open Items](#open-items) | The visible label | The count, or "Loading…" |
| Meaningful name | Requires the caller to supply one | The label itself | **Requires the caller** — "3" alone is not a name |
| Colour is not the only signal | **Fails** except `offline` | Passes — the label names it | Passes — the number is the content |
| Non-text contrast (3:1) | **Fails for `muted` and `offline`** | Same | Passes |
| Focusable | No — correct | No | No |
| Second tap target inside a parent | Must not create one | Must not create one | Must not create one |
| Silenceable when decorative | Yes | Yes | Yes |
| Text scale | N/A — a 6pt graphic | Label scales; may overflow | **Clips at the 34 cap** |
| High contrast themes | Partial — see below | Partial | Partial |

**The colour-only failure is the headline.** Five of the seven statuses are solid dots differing only in hue at 6×6. WCAG 1.4.1 requires that colour not be the sole means of conveying information, and `40_accessibility.md` says it directly: *"add icons to status indicators — the visual must still convey meaning if color is removed."* The component provides no icon and no shape variation except `offline`'s ring. **The mitigation is the label, and it is not optional in practice.** A bare dot is acceptable only when adjacent text already names the state.

**Two statuses fail non-text contrast outright.** WCAG 1.4.11 requires 3:1 for a graphical object that conveys information. Against a white surface:

| Status | Colour | Contrast on white |
| --- | --- | --- |
| `positive` | `#00866F` | 4.5 : 1 ✅ |
| `info` | `#6161FF` | 4.5 : 1 ✅ |
| `critical` | `#FF1C1C` | 3.9 : 1 ✅ |
| `attention` | `#FF6136` | **3.0 : 1** — exactly at the line |
| `muted` | `#BBB6B6` | **2.0 : 1** ❌ |
| `offline` ring | `#BBB6B6` | **2.0 : 1** ❌ |
| `offline` ring, `inverse` | `#D4D0D0` | **1.6 : 1** ❌ |

A grey dot on a white surface is invisible to a low-vision user, and a 1px grey ring is worse. These are the two statuses that mean "unknown" and "not important" — arguably the least costly to miss — but the failure is real and the label is again the only thing carrying the information.

**Give the badge a meaningful name.** The number is not a name. "3" announced on a navigation destination could be a count, a position, or a version. "3 unread alerts" is what a screen-reader user needs, and it has to be supplied by the caller.

**Silence the indicator when the parent already says it.** A list row announcing "Living room TV, at risk" should not also announce "Critical" from its dot. Every one of these components can be removed from the accessibility tree, and inside a labelled parent that is usually the right call — see rule 5 in `80_automation_identifier.md` on not emitting competing semantics nodes.

**High contrast is partial.** The statuses drawing from standard scheme slots (`error`, `secondary`, `outline`, `outline-variant`, `inverse-on-surface`, `surface-bright`) are remapped by the OS contrast pipeline. `attention` and `positive` come from the McAfee extended palette, which is **not** remapped — so under a Windows contrast theme those two dots render palette colours that ignore the user's choice. [[Alert Banner]] and [[Snackbar]] both collapse to scheme-slot pairs under high contrast for exactly this reason; these components do not. See [Open Items](#open-items).

## Anti-Patterns

**❌ A bare dot with nothing naming its state.** Decoration that looks like information. → Add the label, or name the state in adjacent text.

**❌ Relying on red-vs-orange to distinguish critical from attention.** Four hue-degrees at 6 pixels. → Label them.

**❌ A grey dot as the carrier of something that matters.** 2:1 contrast; a low-vision user cannot see it. → Label it.

**❌ A badge showing `0`.** → No badge.

**❌ A word in a notification badge.** → [[Tags]], a status label, or a severity [[Badges|badge]] — whichever matches what the word says.

**❌ A status label and a severity [[Badges|badge]] on the same element.** "What condition" and "how urgent" are two questions, and two uppercase mono words side by side will be read as one. → Pick one.

**❌ A dot and a badge on the same element.** Two different questions, one answer expected. → Pick one.

**❌ Making a dot bigger to make it more visible.** → 6 is the size. If it needs to be seen, it needs a label or an icon.

**❌ Making a status indicator tappable.** → The parent row or destination is the target.

**❌ A dot announced on top of a parent that already names the state.** Double announcement. → Silence the dot.

**❌ Using `style=neutral` on a dark surface, or `style=inverse` on a light one.** The dot vanishes. → The style axis exists to be chosen.

**❌ A status label written as a sentence.** Uppercase bold mono prose reads as shouting. → One or two words.

**❌ A badge as a general-purpose spinner.** The `loader` form is a placeholder for a count. → [[Loaders]].

**❌ Expecting a status change to be noticed.** Nothing is announced when a dot changes colour. → [[Snackbar]] or [[Alert Banner]] for the event.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

Two widgets. `AsmStatusIndicator` covers **both** Figma's `status-indicator` and `status-label` — the label is an optional parameter rather than a separate component, and the two files' `style` / `label-style` axes are collapsed into one enum.

```dart
import 'package:pegasus_flutter/assemble.dart';
```

### Status label — the normal case

```dart
AsmStatusIndicator(
  status: AsmStatusIndicatorStatus.critical,
  label: 'At risk',
)
```

Renders a 6pt `error` dot, a 4pt gap, and `AT RISK` in 11pt bold mono `on-surface-variant`. The label is upper-cased for display.

### Bare dot, named for assistive tech

```dart
AsmStatusIndicator(
  status: AsmStatusIndicatorStatus.positive,
  semanticLabel: 'Protected',
)
```

### Decorative dot inside an already-labelled row

```dart
AsmStatusIndicator(
  status: AsmStatusIndicatorStatus.offline,
  excludeSemantics: true,
)
```

### `AsmStatusIndicator` parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `status` | `AsmStatusIndicatorStatus` | `.critical` | `critical`, `attention`, `info`, `muted`, `offline`, `positive`. No `inverse` — see [Open Items](#open-items). |
| `style` | `AsmStatusIndicatorStyle` | `.neutral` | `neutral`, `colored`, `inverse`. `colored` tints the **label**, not the dot. |
| `label` | `String?` | `null` | Upper-cased for display. Asserted non-empty when provided. |
| `size` | `double` | `6` | Escape hatch. Does not scale the gap or the label. |
| `semanticLabel` | `String?` | `null` | Announced text. See [Open Items](#open-items) for what `null` actually does. |
| `excludeSemantics` | `bool` | `false` | Removes the indicator from the semantics tree entirely. |

**`style: .colored` on `muted` or `offline` silently falls back to the neutral label colour** — correctly, because Figma ships no coloured label for either.

### Notification badge

```dart
AsmStatusNotification(
  status: AsmStatusNotificationStatus.critical,
  count: 3,
  semanticLabel: '3 unread alerts',
)
```

```dart
AsmStatusNotification(
  status: AsmStatusNotificationStatus.loader,
)
```

### `AsmStatusNotification` parameters

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `status` | `AsmStatusNotificationStatus` | `.critical` | `critical`, `attention`, `info`, `loader`. |
| `count` | `int?` | `null` | Asserted non-negative. Rendered `99+` above 99. **Not asserted against `status`** — see [Open Items](#open-items). |
| `semanticLabel` | `String?` | `null` | Falls back to the numeral, or `'Loading…'`. |
| `excludeSemantics` | `bool` | `false` | Use when the parent already announces the count. |

### Tokens

| Element | Token |
| --- | --- |
| `critical` dot / badge | `colorScheme.error` — inverse: `errorContainer` |
| `attention` | `context.asmExtendedColors.attention` — inverse: `attentionContainer` |
| `info` | `colorScheme.secondary` — inverse: `secondaryContainer` |
| `positive` | `asmExtendedColors.positive` — inverse: `positiveContainer` |
| `muted` | `colorScheme.outline` |
| `offline` ring | `colorScheme.outline` — inverse: `outlineVariant` |
| Neutral label | `colorScheme.onSurfaceVariant` |
| Inverse label | `colorScheme.onInverseSurface` |
| Label style | `context.asmTypographyTokens.labelSmallMonoEmphasized` |
| Dot ↔ label gap | `spacing.spacing100` (4) |
| Badge radius | `AsmCornerRadii.r999` |
| Badge numeral colour | `colorScheme.onInverseSurface` |
| Badge loader stroke | `AsmBorderWidths.w200` (2) |

Note that the mono ramps come from a **hand-maintained** `extension AsmMonoTypography`, not from the generated typescale — the upstream token pipeline does not emit them.

### Guidance

- **Pass a `label` unless adjacent text already names the state.** This is the difference between an accessible component and a coloured pixel.
- **Pass `semanticLabel` on every bare dot.** The default announcement is a hardcoded English status name — fine in a demo, not in a shipped product.
- **Pass `semanticLabel` on every badge.** "3" is not a name.
- **Use `excludeSemantics: true` inside anything that already announces the state.** `AsmAlertCardTab` and `AsmNavigationRail` — the only two in-repo consumers — both embed the dot inside a labelled parent; double-announcing is the failure mode `80_automation_identifier.md` rule 5 describes. But note the cost when the parent's label does **not** cover the dot: [[Navigation Rail]] paints an `info` dot on its overflow slot unconditionally, whether or not any hidden destination has anything to report, and excludes it — so it is a permanent visual signal that means nothing and is inaudible ([[Navigation Rail]] open item 9). Excluding a dot is correct only when the parent already says what the dot says.
- **Choose `style` by the surface you are on**, not by preference. `inverse` for dark and coloured surfaces, `neutral` for light.
- **Leave `size` alone.** Changing it scales the dot and nothing else — the 4pt gap and the 11pt label stay put, so the optical alignment the component works hard for breaks.
- **Do not use these for anything the user must act on.** They are annotations. [[Alert Banner]] is the actionable form.
- **Do not place a badge and a dot on the same element.**

---

## Rules

1. A status indicator MUST NEVER convey meaning by colour alone. Pair the dot with a label or with adjacent text that names the state.
2. A bare dot MUST carry an accessible name.
3. A badge MUST carry an accessible name that says what it counts. The number alone is not a name.
4. `critical` and `attention` MUST NEVER be distinguished by colour alone — they are four hue-degrees apart at 6 pixels.
5. `muted` and `offline` MUST be labelled when the difference matters — grey filled and grey hollow are not distinguishable at 6pt.
6. The dot MUST be 6 × 6. A larger indicator is a different component.
7. `style` MUST be chosen for the surface: `neutral` on light, `inverse` on dark or coloured.
8. A badge MUST NEVER render `0`.
9. A badge MUST contain a number and nothing else.
10. A badge and a dot MUST NEVER annotate the same element.
11. These components MUST NEVER be interactive and MUST NEVER create a second tap target inside their parent.
12. An indicator inside an already-labelled parent MUST be excluded from the accessibility tree.
13. A status label MUST be one or two words, uppercase, naming the state — never the remedy, never a sentence.
14. Adding or removing a badge MUST NOT shift the surrounding layout. Reserve the footprint; use the `loader` form while a count is in flight.
15. A status change MUST NOT be relied on to be noticed. The event goes to a [[Snackbar]] or an [[Alert Banner]].
16. `loader` MUST NOT be used as a general-purpose spinner — that is [[Loaders]].
17. An indicator MUST NEVER be the only place a piece of information appears.

---

## Open Items

1. **`muted` uses the wrong colour in the `inverse` style, and the doc comment documents the bug.** Figma's `status-indicator` gives `muted + inverse` a fill of `outline-variant` (`#D4D0D0`), matching every other status's neutral→inverse lightening. `_fillColor` returns `scheme.outline` for `muted` unconditionally, ignoring `style` — the only status that does. The class doc comment then states *"muted: `md.sys.color.outline`"* in **both** the neutral and inverse spec lists, so the comment agrees with the code and both disagree with the file. The consequence is a `muted` dot on a dark surface rendering at `#BBB6B6` instead of `#D4D0D0` — darker, on a dark surface, at 6 pixels. A one-line fix, and note `offline` in the same file already handles the neutral/inverse ring pair correctly, so the pattern was known.

2. **Figma ships a seventh status, `inverse`, and code has no name for it.** `status=inverse` is a 1px near-white ring — `inverse-on-surface` under `style=neutral`, `surface-bright` under `style=inverse` — and it exists in both style variants (`1:94`, `3507:3503`). `AsmStatusIndicatorStatus` has six values and no equivalent. There is no `status-label` form of it in the file either, so its purpose is undocumented: presumably a "present but unremarkable" dot for coloured or dark surfaces, where even `muted` grey would read as a state. Design needs to say what it means before it is implemented; right now it is an unnamed symbol.

3. **The badge's numeral uses the wrong typography — wrong family, wrong weight, wrong size — and the doc comment asserts the wrong one confidently.** Figma specifies `label/mono/medium-mono-emphasized`: **12pt McAfee Sans Mono, weight 700, line height 1.0, letter spacing 0**. The implementation uses `typography.labelSmall`, and its doc comment states *"Numeral typography: `label/small` (McAfee Sans 11/400, lh 1.4, ls 0.5)"* — the **system** face at **11pt** at **regular** weight. So the badge count renders in the wrong typeface, a point smaller, and un-bolded, with the wrong line height and letter spacing. The correct token already ships as `labelMediumMonoEmphasized`. This is the most consequential fidelity defect in the pair, because the count is the badge's entire content, and a 400-weight numeral at 11pt inside an 18pt circle is markedly less legible than a 700-weight one at 12pt. It also breaks the family relationship with the status label, which *does* use the mono-emphasized ramp.

4. **`count` is documented as required for the numeric statuses and asserted only for non-negativity.** `AsmStatusNotification(status: .critical)` with no count compiles, passes both asserts, and renders an empty red circle. The doc comment says *"Required for the numeric statuses… pass `null` when [status] is loader"* — a contract with nothing enforcing it. The fix is an assert pairing `count == null` with `status == loader`, matching the assert style used everywhere else in this codebase.

5. **The class doc claims the original label casing is used for the announcement. It is not.** `AsmStatusIndicator`'s `label` field doc says *"The string is upper-cased for display; the original casing is used for the semantic announcement."* The build method upper-cases the string into the `Text`, and when `semanticLabel` is `null` it passes `label: null` to `Semantics` — so the child `Text`'s own semantics are what get announced, which is the **upper-cased** string. Screen readers handle all-caps inconsistently: some read it as a word, some spell it out letter by letter, some change intonation. Preserving the original casing requires actually passing it (`label: semanticLabel ?? label`), which is presumably what the comment was written against. **Tenth component with a doc comment that misdescribes behaviour**, after [[Alert Banner]], [[Switch]], [[Radio]], [[Skeleton Loader]], [[Date Picker]], [[Menu]], [[Modal]], [[Scrollbar]], [[Sheets]], and [[Snackbar]] — at this count the class doc comments are not a trustworthy source and this needs a sweep of its own.

6. **The default announcements are hardcoded English.** `_defaultLabelFor` returns the literal strings `'Critical'`, `'Attention'`, `'Info'`, `'Muted'`, `'Offline'`, `'Positive'`; the badge's loader returns `'Loading…'`. No `MaterialLocalizations`, no delegate, no override path short of passing `semanticLabel` at every call site. A Spanish-locale user hears English status names. `label!.toUpperCase()` is likewise locale-insensitive — in Turkish, `i` upper-cases to `I` rather than `İ`. The rest of the system has the same gap (`AsmSnackbar`'s `'Dismiss'`, `AsmBottomSheet`'s `'Close'`), so this is a system-level localisation item rather than a bug in these two files.

7. **Two statuses fail WCAG 1.4.11 non-text contrast, and one sits exactly on the line.** Measured against a white surface: `muted` `#BBB6B6` at **2.0 : 1**, `offline`'s `#BBB6B6` ring at **2.0 : 1**, `offline` inverse's `#D4D0D0` ring at **1.6 : 1** — all below the required 3 : 1 for a graphical object that conveys information. `attention` `#FF6136` computes to **3.0 : 1**, which rounds onto the threshold rather than clearly over it. These are token values, so the fix is upstream in Figma, not in the component — but it should be raised, because "unknown state" and "deliberately unimportant" are precisely the states a low-vision user will silently miss.

8. **The whole family relies on hue, with `offline`'s ring as the sole exception.** `40_accessibility.md` names this component explicitly — *"add icons to status indicators"* — and no status has an icon. Five of seven are solid dots differing only in colour. The design has the mechanism already (`offline` is hollow), so the shape axis exists and was used once. Extending it — a check for `positive`, a bar or exclamation for `critical`, a hollow-plus-fill distinction — would let a bare dot mean something without a label. Until then, the label is doing all the accessibility work and the "optional" in "optional label" is misleading.

9. **`attention` and `positive` are not remapped under OS high-contrast themes.** Both come from `AsmExtendedColors`, which the Windows contrast pipeline does not rewrite (it only rewrites standard `ColorScheme` slots). So under an active contrast theme those two dots render palette colours that ignore the user's choice, while the other four track it. [[Alert Banner]] solves this by collapsing every severity to one scheme-slot pair under `MediaQuery.highContrastOf` and adding an outline so the modes still read as distinct; [[Snackbar]] is correct by construction because it only touches scheme slots. Neither status component has a high-contrast branch. The `AsmAlertBanner` code comment describing this problem names it precisely, so the pattern to copy already exists in-repo — and it has since been copied into [[Alert Card]] and [[Badges]], which now makes four components with the branch and four without — [[Data Arc Chart]] and [[Data Linear Chart]] have the same defect in a worse form, since their categorical colour ramps draw one and two stops respectively from outside the scheme, so a contrast theme shifts some bands of a chart and leaves the others. The practical cost: a `secondary` [[Badges|badge]] and a status label in the same row respond differently to the user's contrast theme, the badge collapsing to an outlined `on-surface` chip while the dot beside it keeps its extended-palette colour.

10. **The badge clips at large text scale.** The pill is capped at `maxHeight: 34` with a numeral in a scaling text style. At 200% OS text scale an 11pt numeral becomes 22pt with a 1.4 line height — 30.8pt of line box in a 34pt box, before padding — and at higher scales the digits are clipped by the constraint. Figma matches with `overflow-clip`, so the design has the same problem. `40_accessibility.md` requires layout to wrap rather than clip. The status label has the milder version: `labelSmallMonoEmphasized` scales inside a `Row` with no `Flexible`, so a long label at 200% overflows its parent rather than wrapping.

11. **Bare geometry literals.** `size = 6` as a constructor default with no sourcing comment; `Border.all(width: 1)` where `AsmBorderWidths.w100` exists; `EdgeInsets.symmetric(horizontal: 4)` in the badge where `spacing100` exists; `CircularProgressIndicator` sized by `_minSize` rather than its own named constant. `_minSize`/`_maxSize`/`_spinnerStroke` **are** extracted with comments, which is what `95_figma_spacing.md` asks — but three raw numbers sit beside them. Note also that Figma builds the 6pt dot as `p-[2px]` around a 2pt spacer and gives it `rounded-[md/border/radius/48]`; the implementation uses `BoxShape.circle`, which is the better expression of the same thing but means the `r48` token in the file has no code counterpart.

12. **Figma's badge `min` and `size` disagree with each other.** The `status-notifications` symbol carries `size-[18px]` **and** `min-w-[16px] min-h-[16px]` for the numeric statuses, and `min-w-[8px] min-h-[8px]` for `loader`. A fixed 18 with a 16 minimum is contradictory — the minimum can never bind. The implementation resolves it by using 18 as the minimum, which is the sensible reading, but the file should be cleaned up so the next implementer does not read the 16.

13. **The `loader` form is an animated indeterminate spinner where Figma draws a static arc.** The file's `loader` variant contains an 18×18 SVG ellipse — one arc, no animation, no duration. The implementation uses Material's `CircularProgressIndicator`, which spins indefinitely. The upgrade is almost certainly correct (a static arc reads as broken), but it means the motion is entirely undesigned: no duration, no curve, and no `MediaQuery.disableAnimations` check for users who have asked for reduced motion. Fourteenth-plus component with undocumented motion, and the first where the motion exists in code but not in the file at all.

14. **The `size` parameter is an escape hatch that breaks the component's own alignment work.** Increasing `size` scales the dot but leaves the 4pt gap and the 11pt label fixed, so the optical centring the `leadingDistribution: even` code comment goes to some length to achieve no longer holds. Nothing documents that `size` is for the bare-dot case only. Same escape-hatch pattern already flagged on `AsmSwitch`, `AsmLoader`, `AsmProgressBar`, `AsmEmptyState`, `AsmModal`, `AsmCard`, `AsmScrollbar`, and both [[Sheets]].

15. **The component registry is wrong about `status-label`.** `.claude/figma_component_registry.md` lists `Status Label | 4101-18603 | — (none yet) | Candidate (may map to tag.dart / status_indicator.dart)`. It **is** implemented — `AsmStatusIndicator(label: …)` is Figma's `status-label`, including the 4pt gap, the 11pt mono-bold-uppercase treatment, the three label styles, and the deliberate absence of a coloured label for `muted` and `offline`. The registry should point at `status_indicator.dart` rather than leaving the frame marked unimplemented, or the next engineer will build it twice.

16. **Figma's `status-label` container carries a `rounded-[8px]` radius and `overflow-clip` on a frame with no fill and no border.** A dead property — nothing can be seen to be clipped or rounded. The implementation correctly ignores it. Worth removing from the file so it does not get read as a spec for a container that does not exist.

17. **`muted + inverse` in the `status-label` frame is drawn with a raster/SVG dot rather than a `status-indicator` instance.** Every other combination composes the real symbol; that one cell (`3507:2273`) contains a 6×6 image. It renders the same, so nothing downstream breaks, but it means that cell is not tracking the symbol and will silently diverge the next time the dot changes.

18. **No in-repo product usage of either component beyond two internal consumers.** `AsmStatusIndicator` appears in `alert_card_tab.dart` and twice in `navigation_rail.dart`; `AsmStatusNotification` appears only in its widgetbook story. So the badge's typography defect above has never been seen in a shipped McAfee screen from this repo — check `mcafee-eng/mac-safetycompanion` on `develop` before deciding how urgent it is.
