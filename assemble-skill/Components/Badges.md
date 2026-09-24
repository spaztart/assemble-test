# Component: Badges

> Role: A small uppercase mono chip that names the severity or state of the thing it sits on. It is an annotation, never a control, and never a count.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what each status and type mean and when to use them. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: `type` is a statement about the surface the badge is sitting on, not about how loud you want it. `primary`'s near-white fill is invisible on a light surface — choosing it there is the single most common way to ship a badge nobody can see.
> Source: Figma `Components` → `badge` (node `3900-1759`, label style `3900-1953`), plus `alert_card / status=offline` for the `offline` chip. Implementation: `pegasus_flutter/lib/asm/components/badge.dart`.

## Overview

A badge is the system's severity word. It sits beside a title or in a card header and says `CRITICAL RISK`, `MODERATE`, `DISMISSED` — one or two words, uppercase, in the mono face, in a chip 20 tall.

Its whole reason to exist is that severity must not be carried by colour alone. [[Alert Card]] paints its entire surface by severity; [[Alert Banner]] paints a fill by mode; [[Status Indicators]] paint a 6px dot by status. Under a high-contrast theme all three collapse to a single colour pair, and to a red-green colour-blind user orange and green were never distinguishable anyway. **The badge is the component that says the severity in words.** That is why [[Alert Card]] mandates it.

### Three components are called "badge" and only one of them is this

This is the naming collision to get straight before anything else.

| What people call it | What it actually is | Where it's documented |
| --- | --- | --- |
| **Badge** | An uppercase mono severity chip. Text-bearing. | **This doc** |
| **Notification badge** | A round pill holding a count — `3`, `99+`. Number-bearing. | [[Status Indicators]] |
| **Status label** | A 6px dot plus an uppercase mono word. No container. | [[Status Indicators]] |

A badge says *how bad*. A notification badge says *how many*. A status label says *what condition*. They are three components with three vocabularies and they do not substitute for each other.

### Badge vs. status label vs. tag

The badge sits in a crowded neighbourhood, and the three near-neighbours are separated by what they describe, not by how they look:

| | Describes | Container | Interactive |
| --- | --- | --- | --- |
| **Badge** | The **severity** of a thing — how urgent it is | A filled chip, square corners | Never |
| **[[Status Indicators\|Status label]]** | The **live condition** of a thing — on, offline, protected | None — bare dot + word | Never |
| **[[Tags\|Tag]]** | A **classification** — a name, a category, a filter | A filled pill, radius 6 | Only the `filter` variant's × |

The practical test: if the word answers *"how urgent is this?"* it is a badge. If it answers *"what state is this in?"* it is a status label. If it answers *"what kind of thing is this?"* it is a tag.

**Badge and status label overlap on purpose, and their vocabularies do not match.** A badge's `high` is a status label's `critical`; its `moderate` is `info`; its `low` is `positive`. There is no badge equivalent of `attention` or `muted`, and no status-label equivalent of `dismissed` or `stat`. The two enums are not translations of each other — see [Open Items](#open-items).

**What a badge never does:** take focus, respond to hover or press, animate, hold a number that isn't a `stat`, wrap onto two lines, or appear as the only place a piece of information exists.

## Anatomy

### The label badge — the canonical form

```
   ┌──────────────────────┐
   │  CRITICAL RISK       │   ← 20 tall (minimum), square corners
   └──────────────────────┘
   ├4┤                ├4┤
      ↑
   12pt McAfee Sans Mono, BOLD, UPPERCASE, line height 1.0
```

### With the secondary dot

```
   CRITICAL RISK  ●          trailing (default)
                ├2┤

   ●  CRITICAL RISK          leading
    ├2┤
      ↑
   6 × 6 solid circle in the severity colour · no fill behind the text
```

### With a leading icon

```
   ⚠   ┌──────────────────────┐
       │  CRITICAL RISK       │
   ↑   └──────────────────────┘
   └─4─┤
   12 × 12, severity-coloured — and OUTSIDE the chip's fill
```

### The stat badge

```
   ┌────────────────────────┐
   │  0042  COUNT           │   ← 14pt mono; number BOLD, label REGULAR
   └────────────────────────┘
        ├4┤
```

| Part | Required | Notes |
| --- | --- | --- |
| **Label** | **Yes** | One or two words. Rendered uppercase. Also the badge's accessible name. |
| **Chip fill** | Depends on type | `primary` and `tertiary` fill; `secondary` has none. |
| **Border** | Rarely | Only `stat` + `secondary` (1.5 severity-coloured), and every variant under high contrast (1 `outline`). |
| **Severity dot** | No | `secondary` only, and only on `high` / `moderate` / `low`. 6 × 6. |
| **Leading icon** | No | `primary` only, and only on `high` / `moderate` / `low`. 12 × 12. |
| **Number** | `stat` only | Bold, before the label. Ignored by every other status. |
| **Corner radius** | — | **None. The badge is a square-cornered rectangle.** |

Four things in that table are worth stating outright, because each one surprises people:

**The badge has square corners.** Not a pill, not rounded — a rectangle. This is the only chip-shaped component in the system without a radius: [[Tags]] use 6, the notification badge uses a full round, [[Alert Card]] uses 24 or 32. Whether that is a deliberate distinction or an omission is unresolved — see [Open Items](#open-items).

**The leading icon sits outside the chip's fill.** It is a sibling of the filled rectangle, not a child of it, so it renders on whatever surface is behind the badge with a 4 gap before the chip starts. A `primary` badge with an icon reads as a loose glyph next to a chip rather than as one unit. The implementation's own documentation describes it as inside the badge with a 2 gap; neither is what happens.

**The secondary dot is the status-indicator dot.** Same 6×6, built the same way — 2 of padding around a 2 spacer — but taking the badge's severity colour instead of a status colour. So a `secondary` badge is, structurally, a status label with a bolder 12pt face instead of 11pt. See [Open Items](#open-items).

**There is no truncation and no wrapping.** The chip sizes to its label and keeps going. A long label overflows whatever contains it rather than clipping or wrapping.

## Sizes

The badge has **one geometry** and **three label sizes**, and only two of the three are on the size axis.

| Property | Value | Notes |
| --- | --- | --- |
| Minimum height | 20 | Raw literal. Only binds for the 11pt label. |
| Padding | 4 on all sides | Figma `4pt`. A 4 spacing token exists but is not used. |
| Corner radius | — | None |
| Icon | 12 × 12, 4 from the chip | Outside the fill |
| Dot | 6 × 6, 2 from the label | Full round |
| Number → label gap | 4 | `stat` only |
| Border width | 1.5 | `stat` + `secondary` only |

The 4 padding is the one value on the [[Spacing]] 4pt scale; the 6 dot, 12 icon, 20 minimum, 1.5 border, and the 2 and 4 gaps are all bare literals in the implementation rather than token references — see [Open Items](#open-items).

All three label ramps are mono, uppercase, and line height 1.0. See [[Typography]] for the ramps themselves.

| Label size | Type ramp | Selected by | Used for |
| --- | --- | --- | --- |
| **12** | `label/mono/medium-mono-emphasized` — bold | `size` (**default**) | The standalone badge. The canonical size. |
| **11** | `label/mono/small-mono-emphasized` — bold | `size` | Badges sitting inline with 11pt mono metadata. |
| **14** | `label/mono/large-mono` — number bold, label regular | **`status: stat`** | The count-plus-label form only. |

**Every label size is bold and uppercase except the stat label.** `stat` is the one place a regular weight appears, and it is deliberate: the number is the content and the trailing word is its unit, so the weight contrast is what separates them.

**14 is not on the size axis.** It comes with `stat` and cannot be chosen or avoided — asking for the small size on a stat badge does nothing. So the size axis and the status axis are entangled, which is why there are three sizes and a two-value enum.

**The 11pt size exists for one adjacency and is used in none.** Its purpose is to match a badge to the 11pt mono timestamp and category text beside it — the exact arrangement in [[Alert Card]]'s header and collapsed tab row. Both of those render the default 12pt badge next to 11pt mono text. See [Open Items](#open-items).

**The minimum height barely does anything.** A 12pt label at line height 1.0 plus 4 and 4 is exactly 20, and the 14pt stat label is 22. Only the 11pt label falls short, at 19, and gets padded up.

## Variants

Two axes: **status** (what the badge means) and **type** (which surface it is on). Seven statuses × three types, but the grid is not full — three statuses ignore the type axis entirely.

### The status × type matrix

| Status | `primary` | `secondary` | `tertiary` |
| --- | --- | --- | --- |
| **high** | `surface` fill + `error` text | `error` text + `error` dot | `brand-orange` fill + `on-primary` text |
| **moderate** | `surface` fill + `secondary` text | `secondary` text + `secondary` dot | `secondary` fill + `on-primary` text |
| **low** | `surface` fill + `positive` text | `positive` text + `positive` dot | `positive` fill + `on-primary` text |
| **neutral** | `surface` fill + `primary` text | `primary` text, **no dot** | `primary` fill + `on-primary` text |
| **dismissed** | `outline-variant` fill + `outline` text | *(identical to primary)* | *(identical to primary)* |
| **stat** | `surface` fill + `secondary` number and label | 1.5 `secondary` border + `secondary` text | `secondary` fill + `on-primary` text |
| **offline** | `on-surface-variant` fill + `surface-container-highest` text | *(identical to primary)* | *(identical to primary)* |

**`dismissed` and `offline` collapse the type axis.** Both render one appearance regardless of the type passed. That is correct for `offline` — Figma models it only as the alert card's greyscale chip, with no emphasis variants — and it is why passing a type alongside either is a no-op rather than an error.

**`tertiary` `high` is brand orange, not error red.** Every other status uses its own severity colour as the tertiary fill; `high` swaps `error` (`#FF1C1C`) for `brand-orange` (`#E13121`). The same swap runs through [[Alert Card]], whose `high` surface is brand orange while its collapsed-tab dot is error red. So `high` has two reds across the system depending on where it lands.

### What `type` actually means

`type` is not an emphasis dial. It is a declaration about the surface underneath:

- **`primary` — for dark and coloured surfaces.** Its `surface` fill is near-white (`#FBFBFB`), which is a visible chip on a severity-painted alert card and effectively invisible on a white page. This is the type [[Alert Card]] uses.
- **`secondary` — for inline use in a text run.** No fill at all: severity-coloured text with an optional dot. Use it where a chip would be too much furniture.
- **`tertiary` — for light surfaces.** The saturated fill with light text. This is the type that reads as a badge on a white page.

Choosing wrongly does not throw and does not degrade gracefully — it produces a badge that is either invisible or shouting. **This is the same axis, with the same failure mode, as `style` on [[Status Indicators]].**

### `stat` is a different component wearing the same clothes

`stat` renders a number and a unit at 14pt — `0042 COUNT`, `12 DEVICES`. It shares the badge's chip, padding, and colour machinery, and shares nothing else: it has no severity (it is always `secondary` violet), no dot, no icon, and no size axis.

Use it for a metric displayed as a chip. **Do not use it for a count of things wanting attention** — that is the notification badge in [[Status Indicators]], which is round, sits on the trailing corner of what it counts, and caps at `99+`. And note that the number is currently not announced to a screen reader; see [Accessibility](#accessibility).

## Modifiers

Four parameters modify the badge, and **each is silently ignored outside a narrow window.** Nothing warns you.

| Modifier | Honoured when | Ignored everywhere else |
| --- | --- | --- |
| **Leading icon** | `primary` + `high` / `moderate` / `low` | `secondary`, `tertiary`, and `neutral` / `dismissed` / `stat` / `offline` |
| **Dot position** | `secondary` + `high` / `moderate` / `low` | Every other pairing — because no other pairing draws a dot |
| **Number** | `stat` | Every other status |
| **Transparent fill** | `primary` + `high` / `moderate` / `low` / `neutral` | `secondary` (no fill anyway), `tertiary`, `dismissed`, `offline`, `stat` — and under high contrast |

So the icon reaches only 3 of 21 status-and-type combinations, and the dot only 3. **Assume a modifier does nothing until you have checked this table**, and treat a badge that "isn't showing its icon" as a status/type problem rather than a rendering one.

### The transparent fill is an internal escape hatch

It drops `primary`'s near-white fill and changes nothing else — same text colour, same padding, same size. It exists for one case: a `primary` badge on a near-white surface that darkens on hover, where the invisible fill would suddenly appear as a grey rectangle. [[Alert Card]]'s collapsed tab is that case.

It is a public parameter that is deliberately absent from the component showcase. **Treat it as internal.** Reaching for it to make a `primary` badge work on a light surface is solving the wrong problem — the answer there is `tertiary`.

## Colour & Meaning

Worth stating once in full, because the badge's severity words do not match the ones the rest of the system uses for the same colours. Hex values below are the shipped light-mode values; see [[Color]] for the token layer and the dark-mode pairs.

| Status | Colour (light) | Means | Example label |
| --- | --- | --- | --- |
| `high` | `#FF1C1C` red — or `#E13121` brand orange as a `tertiary` fill | Something is wrong **now** and the user is exposed | `CRITICAL RISK` |
| `moderate` | `#6161FF` violet | A real problem, but not an emergency | `MODERATE` |
| `low` | `#00866F` green | An improvement available, not a problem | `LOW` |
| `neutral` | `#000000` black | Noteworthy, with no severity attached | `NEW`, `UPDATE` |
| `dismissed` | `#BCB6B6` on `#DCD9D9` grey | The user has already dealt with or archived this | `DISMISSED` |
| `stat` | `#6161FF` violet | Not a severity — a metric | `0042 COUNT` |
| `offline` | `#D4D0D0` on `#423F3E` dark grey | The item **cannot be evaluated** — not that it is fine | `OFFLINE` |

**`high` is the only status with two colours.** `error` red everywhere except as a `tertiary` fill, where it becomes brand orange. [[Alert Card]] carries the same split, painting a brand-orange surface while its collapsed-tab dot stays error red.

**`moderate` and `stat` are the same violet**, so a violet chip is ambiguous on sight — the word disambiguates. Another reason the label matters.

**`offline` is not a neutral state.** Grey reads as "inactive" or "fine", but it means the system could not determine the answer, which is closer to a warning. Write the label so it says so.

**`neutral` is the only status with no severity**, and the only one whose colour is a plain foreground rather than a semantic slot. Use it when a badge is a label rather than an assessment — and consider whether a [[Tags|tag]] is the better component.

### The severity words do not match the rest of the system

| Meaning | Badge | [[Status Indicators\|Status dot]] | [[Alert Card]] | [[Alert Banner]] |
| --- | --- | --- | --- | --- |
| Wrong now, user exposed | `high` | `critical` | `high` | `critical` |
| Needs attention soon | — | `attention` | — | — |
| Informational | `moderate` | `info` | `moderate` | `info` |
| Good news | `low` | `positive` | `low` | `positive` |
| De-emphasised | — | `muted` | — | — |
| Cannot be evaluated | `offline` | `offline` | `offline` | — |
| No severity | `neutral` | — | — | `neutral` |
| Already handled | `dismissed` | — | — | — |
| A metric | `stat` | — | — | `status` |

Three names for each of three severities, two statuses with no badge form, and two badge statuses with no counterpart anywhere. [[Status Indicators]] states that the status vocabulary is shared across itself, [[Alert Banner]], and [[Tags]] — the badge is a fourth vocabulary that was never reconciled with it, and the cost is paid at every call site that has to translate. See [Open Items](#open-items).

## States

**The badge has no states.** No hover, no pressed, no focus, no disabled, no selected. It is not focusable and not tappable — it opts out of the whole interaction-state model in [[States]], and correctly so, because there is nothing to interact with.

**The status is the state.** Rather than one badge with several states, there are seven statuses each with one appearance. Changing state means changing the status.

**`dismissed` is a status, not a disabled state.** It means the *item* has been dismissed or archived — a fact about the content, not about the badge's interactivity. There is no disabled badge, because there is nothing to disable.

**There is no transition between statuses.** A badge going from `high` to `low` cuts. No motion is specified.

**When a badge sits on something interactive** — a card, a list row, a collapsed tab — the parent owns the states. The badge must not highlight with its row and must not become a second tap target inside it.

### High contrast collapses the entire grid

Under an active OS contrast theme all 21 combinations render as one chip: the contrast theme's `surface` fill, `on-surface` text, and a 1 `outline` border. The severity colours come from the standard scheme and the McAfee extended palette, and honouring them would ignore the palette the user chose.

Three consequences:

- **Status conveys nothing under high contrast.** The label is the only severity signal left. This is the strongest argument for writing the severity into the word.
- **The type axis conveys nothing either.** All three types become the same outlined chip, so a `secondary` badge that had no container gains one.
- **The transparent fill is overridden.** A badge asking for no fill gets one, which is correct — an unbordered, unfilled chip would have nothing to distinguish it — but it means the modifier is not honoured there.

This matches [[Alert Card]] and [[Alert Banner]], both of which collapse the same way. It is notably **not** what [[Status Indicators]] does, which has no high-contrast branch at all.

## Behaviors

**The label is uppercased for you.** Pass sentence case. The component upper-cases for display and announces the original casing, which is the behaviour you want in both channels — but only if you did not pre-uppercase. A caller passing `'CRITICAL RISK'` gets the same visible chip and a screen reader hearing shouted text.

**The chip sizes to its content and never truncates.** No maximum width, no ellipsis, no wrap. A long label pushes past whatever contains it. Keep labels to one or two words — the constraint is real, not stylistic, because 12pt bold mono is wide per character.

**Height grows with text scale; width overflows.** The 20 is a minimum with no cap, so the chip gets taller as text scales. Horizontally there is nothing to give, so at 200% scale a badge in a tight row overflows its parent. [[Status Indicators]]' label has the same defect.

**Nothing is announced when a badge changes.** It is the resting representation of severity, not the event. A severity that changes and must be noticed is a [[Snackbar]] or an [[Alert Banner]].

**The badge never reflows what it sits in.** Adding or removing one changes the row's width, so reserve space for it in layouts where it may appear conditionally.

**An empty label is a build-time error.** It is asserted, because an empty badge is both invisible and silent — the worst possible failure, since the layout still reserves space for it.

## Content

**One or two words. Uppercase. Machine-terse.** `CRITICAL RISK`, `MODERATE`, `LOW`, `DISMISSED`, `OFFLINE`. The uppercase bold mono treatment says "this is a classification, not prose" — a sentence in that face reads as shouting.

**Write it in sentence case and let the component uppercase it.** `'Critical risk'`, not `'CRITICAL RISK'`.

**Name the severity, not the remedy and not the thing.** `CRITICAL RISK`, not `FIX NOW` and not `DATA BREACH`. The remedy is a [[Button]]; the thing is the title beside the badge.

**Match the word to the status.** A badge whose status is `low` and whose label reads `CRITICAL` is worse than no badge — under high contrast, and to a colour-blind user, the word is the only signal, so a mismatch is not a cosmetic slip.

**Do not repeat the neighbouring text.** A card titled "Petco had a data breach" with a category of `PERSONAL INFO` does not need a badge reading `BREACH`. It needs one reading `CRITICAL RISK`.

**Stat badges hold a number and its unit.** `0042 COUNT`, `12 DEVICES`. The unit is one word. No punctuation, no `+`, no percentage sign unless it is genuinely part of the unit.

**Expand abbreviations for assistive tech, not on screen.** A chip reading `VPN` should announce "Virtual Private Network". That is what the semantic-label override is for, and it is the only good reason to use it.

## Decision Tree

```
What is the chip saying?
│
├── How urgent / how bad this thing is ─────────→ BADGE
│   │
│   ├── Which status?
│   │   ├── Active risk, act now ──────────────→ high
│   │   ├── Real but not urgent ───────────────→ moderate
│   │   ├── An improvement, not a problem ─────→ low
│   │   ├── Noteworthy, no severity ───────────→ neutral
│   │   ├── The item has been dismissed
│   │   │   or archived ───────────────────────→ dismissed
│   │   └── The item cannot be evaluated ──────→ offline
│   │
│   └── Which type? — decided by the surface, not by emphasis
│       ├── A dark or severity-coloured surface
│       │   (e.g. inside an [[Alert Card]]) ───→ primary
│       ├── Inline in a run of text ───────────→ secondary
│       └── A light surface ───────────────────→ tertiary
│
├── A metric shown as a chip ("0042 COUNT") ────→ BADGE, status stat
│
├── How many things want attention ─────────────→ [[Status Indicators|notification badge]]
│   └── The count is zero ──────────────────────→ Nothing. No badge.
│
├── The live condition of a thing
│   (online, protected, at risk) ───────────────→ [[Status Indicators|status label]]
│
├── A category, a name, an attribute ───────────→ [[Tags]]
│
├── A filter the user can remove ───────────────→ [[Tags]], filter variant
│
├── A message the user must read and act on ────→ [[Alert Banner]]
│
├── A full severity-bearing incident surface ───→ [[Alert Card]]
│
└── Something the user presses ─────────────────→ [[Button]]
```

**The branch people take wrongly is "which type".** It is not an emphasis choice. `primary` on a white page is an invisible chip; `tertiary` on an alert card is a saturated rectangle fighting the surface it sits on. Pick by what is behind the badge.

**The second is badge vs. notification badge.** Both are called badges, both are small, and one holds words while the other holds a number. If it is a count, it is not this component.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announceable name** | The label, in its original casing. Required and asserted non-empty. |
| **The uppercase render is not announced** | The visible text is excluded from the accessibility tree, so a screen reader hears `Critical risk`, not `C-R-I-T-I-C-A-L`. |
| **Name override** | Available, for expanding abbreviations. Asserted non-empty when supplied. |
| **Decorative marks silenced** | The severity dot and the leading icon are always excluded. |
| **Colour is not the only signal** | **Passes — the label names the severity.** This is the component's whole purpose. |
| **Focusable** | No — correct. It is an annotation. |
| **Second tap target** | Never creates one. |
| **Text scale** | Height grows; **width overflows** at large scale. |
| **High contrast** | Every status and type collapses to one outlined chip drawn from the OS palette. |
| **Text contrast** | **Fails in four of the shipped combinations** — see below. |
| **The stat number is not announced** | Only the trailing label is. `0042 COUNT` announces "Count". |

### The dismissed badge is unreadable

`dismissed` renders `outline` text (`#BCB6B6`) on an `outline-variant` fill (`#DCD9D9`) in light mode, and `#544C4C` on `#322D2D` in dark. Computed from those shipped token values, that is roughly **1.4 : 1** in light and **1.6 : 1** in dark, against the 4.5 : 1 that WCAG 1.4.3 requires for text this size.

That is not a marginal failure. It is grey text on a barely lighter grey, at 12pt, and it is the same in both themes. `dismissed` is the status a user is most likely to encounter in a long list of resolved items — every one of them currently illegible to anyone with reduced contrast sensitivity.

### The primary type is marginal, and tertiary is the accessible one

Computed against `primary`'s own `#FBFBFB` fill in light mode:

| Combination | Foreground on fill | Computed | 4.5 : 1 |
| --- | --- | --- | --- |
| `primary` + `neutral` | `#000000` on `#FBFBFB` | ~20.3 : 1 | ✅ |
| `primary` + `moderate` | `#6161FF` on `#FBFBFB` | ~4.4 : 1 | ❌ marginal |
| `primary` + `low` | `#00866F` on `#FBFBFB` | ~4.4 : 1 | ❌ marginal |
| `primary` + `high` | `#FF1C1C` on `#FBFBFB` | ~3.7 : 1 | ❌ |
| `tertiary` + `high` | `#FFFFFF` on `#E13121` | ~4.5 : 1 | at the line |
| `tertiary` + `moderate` | `#FFFFFF` on `#6161FF` | ~4.5 : 1 | at the line |
| `tertiary` + `low` | `#FFFFFF` on `#00866F` | ~4.4 : 1 | ❌ marginal |
| `offline` | `#D4D0D0` on `#423F3E` | ~6.8 : 1 | ✅ |
| `dismissed` | `#BCB6B6` on `#DCD9D9` | ~1.4 : 1 | ❌❌ |

Two things follow. **The most severe status has the worst contrast** — `primary` + `high` is the badge that matters most and reads at ~3.7 : 1. And **`offline`, the status meaning "we don't know", is the best-contrasting variant in the set**, at nearly twice the ratio of the critical one.

These ratios are computed from the shipped light-mode token values rather than measured with a tool, and the fix is upstream in the palette rather than in the component — but the ordering is stable regardless of rounding, and `dismissed` is not a rounding question. See [Open Items](#open-items).

### Give the stat badge a name

The accessible name is the label only, so `0042 COUNT` announces "Count". A screen-reader user gets the unit and not the number — which is the entire content. **Every stat badge needs an explicit name** that includes the value: "42 threats blocked".

### Silence the badge when its parent already says it

A card that announces "Petco had a data breach. Critical risk." should not also announce "Critical risk" from its badge. Badges inside a labelled parent are a double-announcement, and the badge is the one to drop. [[Alert Card]] already handles this for its own header badge.

### What a badge does not fix

A badge makes severity legible **in words**. It does not make the surface behind it accessible, it does not satisfy non-text contrast for a dot or an icon elsewhere, and it does not announce a change. Adding a badge to a colour-only design fixes the colour-only problem and nothing else.

## Anti-Patterns

**❌ `primary` on a light surface.** Its `#FBFBFB` fill is invisible on white, so the chip reads as loose coloured text — at ~3.7 : 1 for `high`. → `tertiary` on light surfaces.

**❌ `tertiary` inside an [[Alert Card]].** A saturated fill on a saturated surface, two severity colours fighting. → `primary`.

**❌ Pre-uppercasing the label.** The component uppercases for display and announces the original casing. `'CRITICAL RISK'` gets you a screen reader shouting. → Sentence case.

**❌ `dismissed` as a disabled or greyed-out style.** It means the item was dismissed. It is also currently unreadable. → If you need de-emphasis, that is not this status.

**❌ `offline` as a placeholder or empty state.** It means the item cannot be evaluated. → [[Empty State]] or [[Skeleton Loader]].

**❌ A `stat` badge for a count of things wanting attention.** Wrong shape, wrong place, no `99+` cap. → The notification badge in [[Status Indicators]].

**❌ A `stat` badge with no accessible name.** The number — the whole content — is not announced. → Name it with the value included.

**❌ A word in a notification badge, or a number in a label badge.** → Pick the component that matches the content.

**❌ A badge and a status label on the same element.** "How urgent" and "what condition" are two questions; a user reading two chips will merge them. → Pick one.

**❌ A badge whose label contradicts its status.** Under high contrast the word is the only signal. → Match them.

**❌ Making a badge tappable, or hanging a tooltip off it.** It is not focusable, so a pointer-only affordance excludes keyboard users. → The parent row or card is the target.

**❌ Passing an icon to a `secondary` or `tertiary` badge, or a dot position to anything but `secondary`.** Silently ignored. → Check the [Modifiers](#modifiers) table.

**❌ Using the transparent fill to rescue `primary` on a light surface.** It is an internal hatch for one hover case. → `tertiary`.

**❌ A long label.** No truncation, no wrapping — it overflows its parent. → One or two words.

**❌ A badge as the only place a severity appears.** It is an annotation on something that must already say what it is. → Put the severity in the copy too.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmBadge`, from `pegasus_flutter/lib/asm/components/badge.dart`.

```dart
import 'package:pegasus_flutter/assemble.dart';
```

### Enums

```dart
enum AsmBadgeStatus { high, moderate, low, neutral, dismissed, stat, offline }

enum AsmBadgeType { primary, secondary, tertiary }

enum AsmBadgeSize { medium, small }

enum AsmBadgeDotPosition { trailing, leading }
```

**`status` defaults to `high`** — the most severe value, which is a poor default. Always pass it explicitly rather than relying on the default.

**`type` defaults to `primary`**, which is the type for dark and coloured surfaces. On a light surface this default is wrong; pass `tertiary`.

**`size` defaults to `medium` (12pt)** and is ignored by `stat`.

### Basic usage — on a dark or coloured surface

```dart
AsmBadge(
  label: 'Critical risk',
  status: AsmBadgeStatus.high,
)
```

Renders a near-white chip with `error`-red uppercase 12pt bold mono text, announced as "Critical risk".

### On a light surface

```dart
AsmBadge(
  label: 'Critical risk',
  status: AsmBadgeStatus.high,
  type: AsmBadgeType.tertiary,
)
```

### Inline in a text run

```dart
AsmBadge(
  label: 'Moderate',
  status: AsmBadgeStatus.moderate,
  type: AsmBadgeType.secondary,
)
```

No fill; violet text with a trailing 6pt violet dot. Move the dot with `dotPosition: AsmBadgeDotPosition.leading` when the badge sits to the right of other text and the dot reads better against it.

### Matching 11pt mono metadata

```dart
Row(
  children: [
    AsmBadge(
      label: 'Critical risk',
      status: AsmBadgeStatus.high,
      size: AsmBadgeSize.small,
    ),
    SizedBox(width: context.asmSpacingTokens.spacing500),
    Text(
      'PERSONAL INFO',
      style: context.asmTypographyTokens.labelSmallMono,
    ),
  ],
)
```

`AsmBadgeSize.small` drops the label to 11pt so it matches `labelSmallMono` beside it. Nothing in the repo currently does this — see [Open Items](#open-items).

### A stat badge — always with an accessible name

```dart
AsmBadge(
  label: 'Threats blocked',
  status: AsmBadgeStatus.stat,
  number: '0042',
  semanticLabel: '42 threats blocked',
)
```

The `semanticLabel` is not optional in practice: without it the badge announces "Threats blocked" and drops the number entirely.

### Expanding an abbreviation for assistive tech

```dart
AsmBadge(
  label: 'VPN',
  status: AsmBadgeStatus.moderate,
  type: AsmBadgeType.secondary,
  semanticLabel: 'Virtual Private Network',
)
```

### Silencing a badge inside a labelled parent

There is no `excludeSemantics` parameter — unlike `AsmStatusIndicator`, which has one. Wrap it:

```dart
ExcludeSemantics(
  child: AsmBadge(label: 'Critical risk', status: AsmBadgeStatus.high),
)
```

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | **Yes** | — (asserted non-empty) |
| `status` | `AsmBadgeStatus` | No | `high` |
| `type` | `AsmBadgeType` | No | `primary` |
| `size` | `AsmBadgeSize` | No | `medium` (12pt). Ignored by `stat`. |
| `dotPosition` | `AsmBadgeDotPosition` | No | `trailing`. Only read by `secondary` + `high`/`moderate`/`low`. |
| `transparentBackground` | `bool` | No | `false`. **Internal** — only read by `primary`. |
| `number` | `String?` | No | `null`. Only read by `stat`. **Not announced.** |
| `icon` | `Widget?` | No | `null`. Only read by `primary` + `high`/`moderate`/`low`. Rendered at 12, **outside the fill**. |
| `semanticLabel` | `String?` | No | `null` → the original-case `label` (asserted non-empty when set) |

### Tokens

| Element | Token |
| --- | --- |
| `high` text / dot | `colorScheme.error` |
| `high` tertiary fill | `AsmExtendedColors.of(context).brandOrange` |
| `moderate` text / dot / fill | `colorScheme.secondary` |
| `low` text / dot / fill | `AsmExtendedColors.of(context).positive` |
| `neutral` text / tertiary fill | `colorScheme.primary` |
| `primary` / `stat` fill | `colorScheme.surface` |
| `tertiary` text | `colorScheme.onPrimary` |
| `dismissed` fill / text | `colorScheme.outlineVariant` / `colorScheme.outline` |
| `offline` fill / text | `colorScheme.onSurfaceVariant` / `colorScheme.surfaceContainerHighest` |
| `stat` + `secondary` border | `colorScheme.secondary` at 1.5 |
| High contrast | `colorScheme.surface` / `onSurface` / `outline` border |
| 12pt label | `context.asmTypographyTokens.labelMediumMonoEmphasized` |
| 11pt label | `context.asmTypographyTokens.labelSmallMonoEmphasized` |
| Stat label | `context.asmTypographyTokens.labelLargeMono` |

The mono ramps come from a **hand-maintained** `extension AsmMonoTypography`, not from the generated typescale — the upstream token pipeline does not emit them. Their attribution comments are stale; see [Open Items](#open-items).

### Guidance

- **Always pass `status` explicitly.** The default is `high`.
- **Choose `type` by the surface**: `primary` on dark and severity-coloured surfaces, `tertiary` on light ones, `secondary` inline in text.
- **Pass the label in sentence case.** The widget uppercases it for display and announces the original.
- **Always pass `semanticLabel` on a `stat` badge**, including the number.
- **Never pass `transparentBackground`** unless you are inside a hover-darkening near-white surface. Reach for `tertiary` instead.
- **Check the [Modifiers](#modifiers) table before passing `icon` or `dotPosition`.** Both are silently ignored in most combinations.
- **Wrap in `ExcludeSemantics` inside an already-labelled parent.** There is no parameter for it.
- **Do not wrap in `GestureDetector`, `InkWell`, or `Tooltip`.** The badge is not focusable, so any of those creates a pointer-only affordance.
- **Do not pass a `TextStyle`, colour, or padding.** There is no hook for any of them; all three come from `status`, `type`, and `size`.
- **Give a conditionally-present badge reserved space** in its row, so appearing and disappearing does not reflow the layout.

---

## Rules

1. `type` MUST be chosen for the surface the badge sits on: `primary` on dark and severity-coloured surfaces, `tertiary` on light ones, `secondary` inline in text. It is NEVER an emphasis choice.
2. The label MUST be passed in sentence case. The component uppercases for display and announces the original casing.
3. The label MUST name the severity, never the remedy and never the thing.
4. The label MUST match the status. Under high contrast the word is the only signal.
5. Labels MUST be one or two words. There is no truncation and no wrapping — a long label overflows its parent.
6. `status` MUST be passed explicitly. The default is `high`.
7. A `stat` badge MUST carry an accessible name that includes the number — the number is not announced.
8. A badge MUST NEVER be interactive, focusable, or a second tap target inside its parent.
9. A badge inside an already-labelled parent MUST be excluded from the accessibility tree.
10. A badge MUST NEVER be the only place a piece of information appears.
11. `dismissed` means the item was dismissed or archived. It MUST NEVER be used as a disabled or de-emphasised style.
12. `offline` means the item cannot be evaluated. It MUST NEVER be used as a placeholder or loading state.
13. A badge and a [[Status Indicators|status label]] MUST NEVER annotate the same element.
14. A count MUST use the notification badge in [[Status Indicators]], never a `stat` badge.
15. A classification or filter MUST use [[Tags]], never a badge.
16. The transparent-fill flag MUST NOT be used to make `primary` work on a light surface — that is what `tertiary` is for.
17. `icon` and `dotPosition` MUST be checked against the honour table before use; both are silently ignored in most status/type combinations.
18. A badge MUST NEVER be relied on to announce a change. The event is a [[Snackbar]] or an [[Alert Banner]].
19. Colour, typography, and padding MUST NEVER be overridden. They come from `status`, `type`, and `size`.

---

## Open Items

1. **The `dismissed` badge fails text contrast by a wide margin in both themes.** `outline` text on an `outline-variant` fill computes to roughly **1.4 : 1** in light mode (`#BCB6B6` on `#DCD9D9`) and **1.6 : 1** in dark (`#544C4C` on `#322D2D`), against the 4.5 : 1 WCAG 1.4.3 requires. This is the most consequential defect in the component: `dismissed` is the status that appears most often in bulk, in lists of already-handled items, and it is currently unreadable to anyone with reduced contrast sensitivity. The token pairing is the problem, not the code — but the pairing is what the component ships.

2. **`primary` + `high` has the worst contrast of any severity combination.** Computed at roughly **3.7 : 1** (`error` `#FF1C1C` on `surface` `#FBFBFB`), below 4.5 : 1. `moderate` and `low` sit at ~4.4 : 1 and the three `tertiary` fills land at ~4.4–4.5 : 1 — every one of them at or just under the threshold. So the badge that carries the most urgent severity, in the type [[Alert Card]] actually uses, is the least legible one. These ratios are computed from the shipped light-mode token values rather than measured, and should be confirmed with a contrast tool before the palette is changed — but the ordering does not depend on the rounding.

3. **`AsmBadgeSize` is dead, and the adjacency it was built for is exactly where it is missing.** No call site anywhere in the repo passes `size`. Its own documentation says `small` exists for "badges rendered inline with 11pt mono metadata (e.g. the compact alert card)" — and both places that qualify render the default 12pt: [[Alert Card]]'s status row puts a 12pt badge beside `labelSmallMono` (11pt) timestamp and category text, and the collapsed tab does the same. So a one-point mismatch sits in the two headers the enum was added to fix. Either the call sites should pass `small` or the enum should go.

4. **The leading icon renders outside the badge's fill, and the documentation describes something else.** The icon is composed as a sibling of the filled rectangle rather than a child of it, so it sits on whatever surface is behind the badge with a 4 gap before the chip begins. The parameter's own documentation says it is "displayed before `label` with a 2pt gap" — wrong on the gap (4) and wrong on the containment. Whether the icon belongs inside the chip is a design question that Figma does not answer, because the icon appears in no `badge` frame recorded in the implementation. The parameter may be speculative.

5. **The badge has no corner radius at all.** `BoxDecoration` is constructed with a fill and an optional border and no `borderRadius`, so the chip is a square-cornered rectangle — the only chip-shaped component in the system without a radius ([[Tags]] use 6, the notification badge is fully round, [[Alert Card]] uses 24 / 32). The class documentation lists padding, font, and the colour matrix and says nothing about a radius either way, so it cannot be confirmed as intentional from the implementation alone. This needs a direct Figma read.

6. **`offline` is missing from the class's own colour matrix, and from the showcase.** The status exists in the enum, is documented in the enum's own comment, and is handled in the code — but the class documentation's `status × type` table has six rows and omits it, and the component showcase's description lists the statuses as "high / moderate / low / neutral / dismissed / stat". A reader working from either source would not know `offline` exists. It is also the best-contrasting variant in the set, at ~6.8 : 1, which makes the omission worth fixing rather than accepting.

7. **The stat badge's number is not announced.** The accessible name is the label alone, so `0042 COUNT` announces "Count" — the unit without the value. Every other text-bearing component in this system announces its content. The fix is to compose the number into the default name when `status` is `stat`, rather than requiring every caller to remember an override.

8. **There is no `excludeSemantics` parameter, though the sibling component has one.** `AsmStatusIndicator` ships `excludeSemantics` precisely because these annotations usually sit inside a labelled parent that already says the same thing. `AsmBadge` has the identical need — [[Alert Card]] embeds one in a card whose accessible name already carries the severity — and callers have to wrap it in `ExcludeSemantics` by hand. An asymmetry between two components with the same job.

9. **Four modifiers are silently ignored in most combinations.** `icon` reaches 3 of 21 status-and-type pairings, `dotPosition` reaches 3, `number` reaches 3 (one status × three types), and `transparentBackground` reaches 4. None of them asserts, warns, or documents the window at the call site. The component showcase demonstrates none of `icon`, `size`, or `transparentBackground`, so the only way to learn any of this is to read the source. Asserts pairing a modifier with its valid statuses would match the assert style used elsewhere in this codebase.

10. **The severity vocabularies across the system do not line up, and there are now five of them.** `AsmBadgeStatus` is `high / moderate / low / neutral / dismissed / stat / offline`; [[Status Indicators]]' dot is `critical / attention / info / muted / offline / positive`; its notification badge is `critical / attention / info / loader`; [[Alert Card]] is `high / moderate / low / offline`; [[Alert Banner]] is `neutral / info / critical / positive / status`. A badge's `high` is a dot's `critical`, its `moderate` is `info`, its `low` is `positive` — three different names for each of three severities, plus `attention` and `muted` with no badge form and `dismissed` and `stat` with no dot form. [[Status Indicators]] states that "the status vocabulary is shared across this component, [[Alert Banner]], and [[Tags]]", which is the intent; the badge is a fourth vocabulary that was not reconciled with it. This is a system-level naming decision, not a component fix, and it is currently paid for at every call site that has to translate between two of them.

11. **The secondary badge's dot is a hand-built copy of the status-indicator dot.** Both are 6×6, both are constructed as 2 of padding around a 2 spacer, and the badge's own comment says it matches "the Figma `status-indicator` token used by secondary badges" — but it is a local `Container` with `borderRadius: 48` rather than an `AsmStatusIndicator` or a `BoxShape.circle`. Two consequences: the next change to the dot has to be made twice, and the badge's dot takes a badge severity colour while the indicator's takes a status colour, so the two can drift apart silently. The badge's documentation also calls it "a 2pt dot inside a 6pt chip", which describes the construction — the render is a solid 6pt circle, because the padding and the child are the same colour.

12. **The token file's attribution comments for the mono ramps are crossed.** `labelMediumMono` (12pt regular) is documented as "Used by `AsmBadge`'s primary / secondary label" and `labelMediumMonoEmphasized` (12pt bold) as "Used by `AsmTable`" — but the badge uses the **emphasized** ramp, with an explicit in-code comment explaining that the regular-weight ramps "rendered the text too light". So the regular ramp is documented as the badge's and is not used by it. Minor, but these comments are how the next engineer finds a ramp's owner.

13. **The component showcase's playground offers a dot control that does nothing for `offline`.** The playground's dot-visibility check excludes `neutral`, `dismissed`, and `stat`, but not `offline` — while the widget itself excludes all four. So selecting `offline` reveals a dot-position control with no effect. A one-line divergence between the showcase's model of the component and the component.

14. **`status` defaults to the most severe value.** `AsmBadge(label: 'Something')` renders a `high` badge. A default that silently claims maximum severity is the wrong shape of default for a severity component; `neutral` would be the safe one. The same pattern is flagged on `AsmStatusIndicator`, whose `status` defaults to `critical`.

15. **The badge overflows rather than wrapping at large text scale.** The chip has a minimum height and no width constraint, and the label has no `maxLines` or overflow behaviour, so at 200% OS text scale a badge in a tight row pushes past its parent. This is the same defect flagged on [[Status Indicators]]' label, and the system's accessibility guidance asks for layout to wrap rather than clip or overflow.

16. **Raw geometry literals throughout.** `EdgeInsets.all(4)` where a 4 spacing token exists; `minHeight: 20`, the 12 icon size, the 2 icon-inner and dot gaps, the 4 icon-to-chip and number-to-label gaps, the 1.5 border width, and `BorderRadius.circular(48)` on the dot are all bare numbers with no token reference and, apart from the padding, no sourcing comment. The dot's `48` in particular is a token value in Figma (`md/border/radius/48`) being expressed as a literal where `BoxShape.circle` would say the same thing.

17. **No high-contrast parity across the severity family.** The badge collapses correctly under `MediaQuery.highContrastOf`, matching [[Alert Card]] and [[Alert Banner]]. [[Status Indicators]] has no high-contrast branch at all, so a `secondary` badge and a status label sitting in the same row respond differently to the user's contrast theme — the badge becomes an outlined `on-surface` chip while the dot beside it keeps its extended-palette colour. The pattern to copy exists in three components; the fourth has not adopted it.

18. **In-repo usage is two call sites, both inside [[Alert Card]].** `AsmBadge` appears in `alert_card.dart` (the active card's status row) and `alert_card_tab.dart` (the collapsed tab), and nowhere else outside its own showcase. Both use `primary` at the default 12pt on a severity-coloured or near-white surface. So `tertiary`, `secondary`, the dot, the icon, the size axis, `stat`, `dismissed`, and `offline` have never been exercised in a shipped screen from this repo — check `mcafee-eng/mac-safetycompanion` on `develop` before treating any of the above as settled.

19. **Figma was not re-verified in this pass, and the component registry no longer exists.** Every geometry, token, and node reference above comes from the implementation, which cites Figma `badge` (`3900-1759`), its label style (`3900-1953`), `alert_card / status=offline`, and `alert_card_list` (`7872-4161`) for the transparent-fill case. There is no independent Figma read behind them. Separately, `.claude/figma_component_registry.md` — cited by [[Status Indicators]] open item 15 — is **absent from the current checkout**, along with the `40_accessibility.md`, `80_automation_identifier.md`, `95_figma_spacing.md`, and `30_stories.md` rule files that several docs in this folder quote as authority. Only `70_release.md` remains. Either those files moved or this folder's citations have gone stale; it needs settling, because the accessibility requirements quoted in [[Status Indicators]] and elsewhere are currently unverifiable.
