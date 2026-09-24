# Component: Date Picker

> Role: The family of surfaces for choosing a date or a date range — a typed field, a month grid, and month / year lists.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the family means and when to use each member. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: Whichever surface you show, the user MUST be able to type the date. A grid-only picker makes a known date — a birthdate, an expiry — take a dozen taps.
> Source: Figma `Components` → `Date Picker` (node `6526-37584`), the `Docked input date picker [desktop]` frame with `Type = Day | Month | Year` × `Background = Canvas | Base`. Implementation: `pegasus_flutter/lib/asm/components/calendar.dart`, `date_input.dart`, `year_month_picker.dart`.

## Overview

Choosing a date is two different tasks wearing one name, and the family exists because neither surface serves both.

**When the user already knows the date, typing is faster.** A birthdate, a card expiry, an invoice date — the user has the number in their head, and a grid makes them navigate to it. Nine taps to reach 1987.

**When the date is relational, the grid is the only option.** "The Friday after next", "the last day of the month", "some weekday in the next two weeks" — the user doesn't know the number, they know a relationship, and only a calendar shows it.

Most real date entry is a mix, which is why the shipped surfaces are all **field-plus-grid**: type if you know it, open the grid if you don't. **A grid-only date picker is almost always wrong**, and a field-only one is wrong the moment the date is relational.

**The family has three tiers.** A bare **field** that drops a picker beneath it, for a date inside a form. A **card** that wraps the same thing in chrome and a confirm row, for when picking the date is the screen's whole job. And the **lists** — a flat month list and a scrollable year list — which the grid opens when the target is far from today.

**A range is not two dates.** Picking a start and an end is one interaction with its own rules (the end can't precede the start, the span gets highlighted, the second tap closes it), which is why range is a mode of the picker rather than two pickers side by side.

## Anatomy

The **card** form — chrome around a body:

```
   ┌──────────────────────────────────────────────┐
   │ Select date                          ← label │
   │                                              │
   │ Mon, Aug 19                       ┌────┐     │
   │ ↑ headline (the current choice)   │ ✎  │     │  ← edit affordance
   │                                   └────┘     │
   ├──────────────────────────────────────────────┤  ← edge-to-edge divider
   │                                              │
   │   ‹ Aug ▾ ›              ‹ 2026 ▾ ›          │  ← month / year chips
   │                                              │
   │   S   M   T   W   T   F   S                  │
   │              1   2   3   4                   │
   │   5   6   7   8   9  10  11                  │
   │  12  13  14  15  16  17  18                  │
   │  19 (20) 21  22  23  24  25                  │  ← selected day
   │  26  27  28  29  30  31                      │
   │                                              │
   │                       Cancel        OK       │  ← action row
   └──────────────────────────────────────────────┘
```

The **field** form — no chrome, the picker just drops beneath:

```
   DATE
   ┌───────────────────────────────────┬───────┐
   │ 08/19/2026                        │  ⧉    │  ← trigger
   └───────────────────────────────────┴───────┘
   MM/DD/YYYY                                      ← supporting text
   ┌───────────────────────────────────────────┐
   │  ‹ Aug ▾ ›            ‹ 2026 ▾ ›          │
   │  … the grid, or a month list, or a year   │
   │    list, depending on what was tapped     │
   └───────────────────────────────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Body** — a grid, a field, or a list | Yes | The one thing the surface is for. |
| **Month / year chips** | Grid only | Tapping a chip swaps the grid for that list. |
| **Step arrows** | Grid only | `‹ ›` either side of each chip. |
| Label | Card only | Small text above the headline. |
| Headline | Card only | The current selection, large. Falls back to the label when nothing is picked. |
| Edit affordance | Card only | Opens the picker. |
| Divider | Card only | A hairline rule, edge to edge — see [[Divider]]. |
| Action row | Optional | `Cancel / OK`, or `Clear / Cancel / OK`. |
| Supporting text | Field only | Shows the expected format. |

**The headline shows the choice, not the prompt.** Before anything is picked it reads "Select date"; after, it reads the date. That's what makes the card's confirm row meaningful — the user can see what they're about to confirm.

**The chips are the escape hatch from month-at-a-time navigation.** Stepping to 1987 with the `‹` arrow is thirty-nine years of tapping; the year chip opens a scrollable list. **Only one list can be open at a time** — with the month list showing, the year chip greys out, because picking a year mid-month-pick has no coherent meaning.

**The action row is what separates staged from immediate.** With no action row, tapping a day commits it. With `Cancel / OK`, tapping a day only stages it and `OK` commits — the same submit-versus-immediate boundary as [[Checkbox]] versus [[Switch]]. `Clear` is a third option only when clearing is meaningful, i.e. when the field is genuinely optional.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Card radius | 28 | **off-scale** — no `r28` |
| Card padding | 16 sides; 12 under the header, 8 under the body | `md/spacing/400`, `300`, `200` |
| Divider | 1, `outline-variant` | `md/border/width/100` |
| Inline picker radius | 16 | `md/border/radius/16` |
| Inline picker padding | 12 all sides | `md/spacing/300` |
| Day cell | 40 × 40 | — |
| Selected-day fill | `primary`, full circle | |
| Today marker | 1 ring, `on-surface` | `md/border/width/100` |
| Range span fill | `secondary`, solid | |
| Chip radius / padding | 8 / 4 | `md/border/radius/8`, `md/spacing/100` |
| Step arrow | 32 × 32, 18 glyph | — |
| List row | 56 tall, radius 8 | |
| Selected list row fill | `neutral.pressed` | `md/sys/state/neutral/pressed` |
| Surface | canvas `background` | `md/sys/color/background` |
| Card width (Figma) | 360 | |

**The card surface is the app canvas, not a surface tone.** The Figma frame fills with `background` (`#EEEDED` light / `#181616` dark) — the slot Material 3 dropped from its colour scheme, which Assemble keeps as an extended colour. So the card is the same tone as the page behind it, separated by shape rather than contrast.

**28 is off the radius scale** and is the only such value in the family; it is named in code with a comment rather than rounded to 24 or 32.

**The step arrows are 32 × 32.** Deliberately denser than the 48 minimum, because two chips and four arrows have to fit a 360-wide card. It is still under the touch floor — see [Accessibility](#accessibility).

## Variants

Three tiers, distinguished by how much chrome they carry and how much of the screen the date decision owns.

| Tier | Surface | Use when |
| --- | --- | --- |
| **Field** | A text field with the picker dropping beneath it | The date is one field among several in a form. |
| **Card** | Label, headline, edit affordance, divider, action row | Choosing the date is the screen's or the sheet's whole job. |
| **Grid alone** | Just the month grid | You're placing it inside chrome you already own. |
| **Lists** | A flat month list; a scrollable year list | Standalone month or year selection, or as the grid's chip target. |
| **Modal** | The platform's own date dialog, themed | You want the OS-conventional dialog rather than an inline surface. |

And two orthogonal modes:

| Mode | Meaning |
| --- | --- |
| **Single** | One date. |
| **Range** | A start and an end. The grid shows **two consecutive months** so a span crossing a month boundary is visible at once. |

**The Figma frame is `[desktop]` and 360 wide.** There is no mobile variant drawn and none implemented — see [Open Items](#open-items).

**Figma draws each type against two backgrounds** (`Canvas` and `Base`), for a picker sitting on the page versus on a raised surface. Only the canvas treatment ships.

## Behaviors

### Typing

**The field masks as you type.** Digits and slashes only; the separators insert themselves after the month and the day; input stops at ten characters. The user types `08192026` and sees `08/19/2026`.

**The format is `MM/DD/YYYY`, and it is fixed.** Not a locale, not a parameter — the mask, the placeholder, the supporting text, and the parser all assume US month-first ordering. For a product shipped outside the US this is a real defect, not a stylistic choice; see [Open Items](#open-items).

**Invalid and out-of-range input is silently swallowed.** A partly-typed date, an impossible date, a date outside the allowed bounds — none of these produce an error, a message, or any visible response. The change simply doesn't propagate. The field looks like it accepted `13/45/1800`. **This is the family's most consequential behavioural gap**: the user gets no signal that what they typed didn't take.

### Picking

**Tapping a day either commits or stages, depending on the action row.** No action row → commits immediately. `Cancel / OK` → stages, and `OK` commits. `Cancel` discards the staged pick and leaves the previous value untouched.

**Month and year lists always commit on selection**, regardless of the action row — they change which month is *displayed*, which isn't a value the user needs to confirm.

**Range selection has three tap rules.** The first tap sets the start. The second sets the end and closes the range. A tap that lands before the current start, or a tap after a range is already complete, starts over from that date. A range with only a start shows a single circle and no span fill.

**An out-of-order range resolves to nothing.** If the end precedes the start the range is treated as absent — again silently.

**Days outside the allowed bounds render dimmed and don't respond.**

**Today gets a ring, the selection gets a fill.** Both can be true at once, in which case the fill wins and the ring is dropped — so "today is selected" and "today is not selected" look different, which is correct.

### Opening and closing

**The field and the card both open their picker on tap** — of the field itself or of the trailing trigger. Tapping the trigger again closes it.

**Choosing from a list rolls back to the grid.** The list is a way to navigate the grid, not a destination.

**`OK` and `Cancel` both close the surface**; `Clear` does not — it empties the value and leaves the picker open, since the user presumably still intends to pick something.

## Decision Tree

```
Does the user need to choose a date?
├── no ──────────────────────────────────────────────→ nothing
└── yes
    │
    ├── Is the date usually KNOWN to the user?
    │   (birthdate, expiry, an invoice date)
    │   └── the FIELD must be primary. A grid alone is a dozen taps
    │       for a number they already have.
    │
    ├── Is the date usually RELATIONAL?
    │   ("next Friday", "end of month", "sometime next week")
    │   └── the GRID must be reachable in one tap.
    │
    ├── In practice: ship BOTH. Which tier?
    │   │
    │   ├── One field among several in a form
    │   │   └── FIELD tier — no card chrome, picker drops beneath
    │   │
    │   ├── The whole point of the screen, sheet, or dialog
    │   │   └── CARD tier — headline + confirm row
    │   │       (host it in a [[Sheets|sheet]] or [[Modal|modal]])
    │   │
    │   ├── Inside chrome you already own
    │   │   └── GRID alone
    │   │
    │   └── Only a month, or only a year, is being chosen
    │       └── the MONTH or YEAR LIST on its own
    │
    ├── One date, or a span?
    │   ├── one ─────────────────────────────────────→ single mode
    │   └── a span ──────────────────────────────────→ range mode
    │       (never two single pickers side by side — the
    │        end-after-start rule and the span highlight
    │        only exist in range mode)
    │
    ├── Must the choice be confirmed before it takes effect?
    │   ├── yes → action row: Cancel / OK
    │   └── no  → no action row; commit on tap
    │
    └── Is the date optional?
        └── yes → add Clear to the action row
```

**A date is not a [[Menu|dropdown]].** A list of twelve months is a menu-shaped problem; a list of dates is not — the grid exists because dates have a two-dimensional structure (weeks × weekdays) that a list destroys.

**Choosing among a handful of *named* dates is a different component.** "Today / Tomorrow / This weekend" is a [[Radio]] group or a [[Menu]], not a calendar. Reach for a date picker when the answer is an arbitrary date, not one of a few.

**Don't put a card-tier picker inline in a long form.** It's a 550-tall surface with its own confirm row; two of them in one form gives the user two competing submit buttons. Use the field tier inline, and the card tier in a [[Sheets|sheet]] or [[Modal|modal]].

## Content

- **Label the field with what the date *is*, not with "Date".** "Expiry date", "Travel from" — the user is filling a form and needs to know which date this is.
- **Always show the expected format** as supporting text under the field. `MM/DD/YYYY` is not guessable, and it's the only signal the user gets about ordering.
- **The card's label is a prompt; the headline is the answer.** "Select date" over "Mon, Aug 19".
- **Name the endpoints in a range.** "Travel from" / "Travel to" beats two fields labelled "Date".
- **Don't relabel `OK`.** Match the platform convention — the confirm action in a date card is `OK`, not "Apply" or "Choose".
- **Say what the bounds are, outside the picker.** Dimmed days communicate "not this one" but never "why". If the allowed window is meaningful — "bookings open 30 days out" — that belongs in supporting text.
- **Never put a date format hint inside the placeholder alone.** The placeholder disappears the moment the user types.

## Accessibility

| Requirement | Grid | Month / year lists | Field |
| --- | --- | --- | --- |
| **Tab-reachable** | **No** | Yes | Yes |
| **Keyboard activation** | **No** | Yes | Yes |
| **Arrow-key navigation** | **No** | — | — |
| **Branded focus ring** | **No** | Yes | Yes |
| **Screen-reader role** | Container only | `button` per row | Field role |
| **Selected state announced** | **No** | Yes | — |
| **Per-item automation id** | **No** | Yes | Yes |
| **Disabled announced** | Yes | Yes | Yes |
| **Touch target ≥ 48** | **No** — 40 cells, 32 arrows | Yes — 56 rows | Yes |

**The day grid is not keyboard-accessible.** Days are tap-only: no focus, no focus ring, no key binding, no per-day semantics, no announced selection. A keyboard or screen-reader user can reach the card, the chips, the arrows, the field, and the action row — and then cannot choose a day. **This is the single most serious gap anywhere in the documented set**, because it makes the primary interaction of the primary surface unreachable. The workaround is the typed field, which is exactly why the field must always be present.

**The month and year lists are done properly** — focus ring, keyboard activation, per-row identifier, announced selection. The contrast between the two is the clearest evidence that the grid's gaps are an oversight rather than a decision.

**Two touch targets are under the floor.** Day cells are 40 and step arrows are 32, against a 48 minimum. The arrows are a documented density decision; the cells are not documented at all.

**The week starts on Sunday, always.** Not locale-derived. In most of Europe and much of Asia the calendar is drawn with the wrong first column — the days land under the wrong weekday headers, which is a correctness bug rather than a preference.

**The weekday headers are localised; the headline's weekday names are not.** The `S M T W T F S` row comes from platform localisation, but the headline's "Mon, Aug 19" and the month chips' "Aug" are hardcoded English. Same surface, two different conventions.

**Month navigation is not announced.** Stepping from August to September changes the entire grid with no live announcement, so a screen-reader user has no way to know which month they're in without re-reading the chip.

**Range endpoints and span are conveyed by colour and shape alone.** No text, no semantics — nothing tells a screen-reader user that a day is the start of a range, inside it, or the end.

**The card's announcement includes the selection; the field-tier card's does not.** The grid card announces "Select date, Mon Aug 19"; the typed-input card announces only "Select date".

**In a range's two fields, only the first can be given a label override.** The second is announced from its placeholder — "End date" — which is serviceable but not equivalent, and it carries no visible field label at all.

## Anti-Patterns

**❌ A grid with no way to type the date.** A dozen taps for a number the user already knows. → Always ship the field.

**❌ A field with no way to open the grid.** Relational dates become arithmetic. → Always ship the trigger.

**❌ Relying on the grid for keyboard or screen-reader users.** It is unreachable. → The typed field is the only accessible path today.

**❌ Silently swallowing invalid input.** The user believes `13/45/1800` was accepted. → Show an error; see [[Text Fields]].

**❌ Two single pickers instead of range mode.** No end-after-start rule, no span highlight, no cross-month view. → Range mode.

**❌ A card-tier picker inline in a form.** Two competing confirm rows. → Field tier inline; card tier in a [[Sheets|sheet]] or [[Modal|modal]].

**❌ Assuming `MM/DD/YYYY` reads as a date everywhere.** `03/04` is two different days depending on where the user is. → Say the format explicitly, and treat the ordering as a known gap.

**❌ Dimmed days as the only explanation of the allowed window.** → Say why in supporting text.

**❌ A format hint that lives only in the placeholder.** It vanishes on first keystroke. → Supporting text.

**❌ Labelling a date field "Date".** → Name what the date is.

**❌ A `Clear` action on a required date.** Offers an invalid state. → Omit it.

**❌ Relabelling `OK`.** → Match the platform convention.

**❌ A calendar for a choice among a few named dates.** → [[Radio]] or [[Menu]].

**❌ Leaving the picker open after `OK`.** → Confirm closes.

**❌ A grid or card at a width narrower than 360.** The design is drawn for desktop and does not reflow. → Give it the width, or host it in a full-width surface.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The family spans three files: `calendar.dart`, `date_input.dart`, `year_month_picker.dart`.

### The widgets

| Widget | Tier | What it is |
| --- | --- | --- |
| `AsmCalendar` | Card or grid | The month grid, with optional card chrome and action row. |
| `AsmDateInput` | Card | A typed `MM/DD/YYYY` field in card chrome; expands to an inline grid. |
| `AsmDateRangeInput` | Card | Two typed fields in card chrome. |
| `AsmDateField` | Field | A bare field that drops a grid / month list / year list beneath it. |
| `AsmYearPicker` | List | Scrollable years, 1–4 columns. |
| `AsmMonthPicker` | List | The twelve months, one column. |
| `AsmDatePicker.show` | Modal | Themed wrapper over Flutter's `showDatePicker`. |
| `AsmDateRangePicker.show` | Modal | Themed wrapper over `showDateRangePicker`. |
| `asmDatePickerTheme(context)` | — | The theme, if you call Flutter's pickers yourself. |

### Enums

```dart
enum AsmCalendarMode   { single, range }
enum AsmCalendarActions { none, cancelOk, clearCancelOk }
enum AsmCalendarChrome  { full, gridOnly }
enum AsmDateFieldPicker { none, day, month, year }
```

### The field tier — a date inside a form

```dart
AsmDateField(
  automationIdentifier: 'expiry-date',
  firstDate: DateTime(2026),
  lastDate: DateTime(2036),
  label: 'EXPIRY DATE',
  // Always show the format — MM/DD/YYYY is not guessable.
  supportingText: 'MM/DD/YYYY',
  value: _expiry,
  onChanged: (d) => setState(() => _expiry = d),
);
```

Commits on tap by default. Pass `actions: AsmCalendarActions.cancelOk` to require a confirm, and `initialPicker` to open on the month or year list instead of the grid.

### The card tier — the screen's whole job

```dart
AsmCalendar(
  automationIdentifier: 'booking-date',
  firstDate: DateTime.now(),
  lastDate: DateTime.now().add(const Duration(days: 90)),
  initialDate: _selected,
  title: 'Select date',
  actions: AsmCalendarActions.cancelOk,
  onChanged: (d) => _staged = d,   // staged only — OK commits
  onConfirm: (d) {
    setState(() => _selected = d);
    Navigator.of(context).pop();
  },
  onCancel: () => Navigator.of(context).pop(),
);
```

With `actions: cancelOk`, `onChanged` fires on every tap but the value is not final until `onConfirm`.

### A range

```dart
AsmCalendar(
  automationIdentifier: 'trip-dates',
  mode: AsmCalendarMode.range,
  firstDate: DateTime.now(),
  lastDate: DateTime.now().add(const Duration(days: 365)),
  title: 'Depart - Return dates',
  onRangeChanged: (r) => setState(() => _trip = r),
);
```

`onRangeChanged` fires only when both endpoints exist. **In range mode `onConfirm` receives `null`** — it reports the single-date selection, which range mode never sets. Read the range from `onRangeChanged`.

### The grid inside your own chrome

```dart
AsmCalendar(
  automationIdentifier: 'inline-grid',
  chrome: AsmCalendarChrome.gridOnly,
  firstDate: DateTime(2020),
  lastDate: DateTime(2030),
  onChanged: (d) => setState(() => _date = d),
);
```

`gridOnly` drops the header, divider, and card fill but still honours `actions`.

### A typed field in card chrome

```dart
AsmDateInput(
  automationIdentifier: 'invoice-date',
  firstDate: DateTime(2020),
  lastDate: DateTime(2030),
  label: 'Select date',
  headline: 'Enter date',
  value: _invoiceDate,
  onChanged: (d) => setState(() => _invoiceDate = d),
  onConfirm: (d) => Navigator.of(context).pop(d),
  onCancel: () => Navigator.of(context).pop(),
);
```

Tapping the field or the trailing trigger expands an inline grid beneath it. Supply `onPickerRequested` to take that over — e.g. to launch `AsmDatePicker.show` instead.

### The lists on their own

```dart
AsmYearPicker(
  automationIdentifier: 'renewal-year',
  firstYear: 2020,
  lastYear: 2035,
  selectedYear: _year,
  columns: 3,          // 1 = the dropdown list; 3 = the standalone card
  onChanged: (y) => setState(() => _year = y),
);

AsmMonthPicker(
  automationIdentifier: 'statement-month',
  selectedMonth: _month,
  onChanged: (m) => setState(() => _month = m),
);
```

The year list scrolls the selection into view on first paint. Both take a `maxHeight` — match it to the surface you're in.

### The modal form

```dart
final picked = await AsmDatePicker.show(
  context: context,
  initialDate: DateTime.now(),
  firstDate: DateTime(2000),
  lastDate: DateTime(2100),
  automationIdentifier: 'flight-depart-picker',
);
```

This is Flutter's own dialog with the Assemble theme applied — so its day grid **is** keyboard-navigable, unlike the inline grid. If keyboard access to the grid matters, this is currently the only surface that has it.

### Disabling

Every member disables by passing a null handler — `onChanged: null` on the field and card tiers, `onRangeChanged: null` in range mode. That greys and un-focuses the body, the trigger, and the action row together.

### Parameter reference — `AsmCalendar`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `firstDate` / `lastDate` | `DateTime` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `mode` | `AsmCalendarMode` | No | `single` |
| `initialDate` | `DateTime?` | No | today |
| `initialRange` | `DateTimeRange?` | No | none |
| `onChanged` | `ValueChanged<DateTime>?` | No | null → read-only |
| `onRangeChanged` | `ValueChanged<DateTimeRange>?` | No | null → read-only |
| `onConfirm` / `onCancel` / `onClear` | callbacks | No | null |
| `actions` | `AsmCalendarActions` | No | `none` |
| `chrome` | `AsmCalendarChrome` | No | `full` |
| `title` | `String` | No | `'Select date'` |
| `confirmLabel` / `cancelLabel` / `clearLabel` | `String` | No | `'OK'` / `'Cancel'` / `'Clear'` |
| `semanticLabel` | `String?` | No | title + selection |

### Parameter reference — `AsmDateField`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `firstDate` / `lastDate` | `DateTime` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `label` | `String` | No | `'DATE'` |
| `placeholder` | `String` | No | `'MM/DD/YYYY'` |
| `supportingText` | `String` | No | `'MM/DD/YYYY'` |
| `value` | `DateTime?` | No | none |
| `onChanged` | `ValueChanged<DateTime?>?` | No | null → disabled |
| `initialPicker` | `AsmDateFieldPicker` | No | `day` |
| `actions` | `AsmCalendarActions` | No | `none` |
| `onConfirm` / `onCancel` | callbacks | No | null |
| `semanticLabel` | `String?` | No | inherits the label |

`AsmDateInput` and `AsmDateRangeInput` take the same shape plus `headline`, `showClearButton`, and `onPickerRequested`; the range variant swaps `placeholder` for `startPlaceholder` / `endPlaceholder` and its value type for `DateTimeRange?`.

### Guidance

- **`automationIdentifier` is required and is used as a prefix.** Every inner control composes from it — `-field`, `-trigger`, `-inline`, `-day`, `-year`, `-month`, `-clear`, `-cancel`, `-confirm`, `-edit` — so one id per instance gives automation the whole surface.
- **Do not rely on the inline grid for keyboard access.** Ship the typed field, and use `AsmDatePicker.show` where a keyboard-navigable grid is required.
- **Validate and surface errors yourself.** `onChanged` fires only for a valid, in-range date; nothing tells you the user typed something rejected. Watch the controller if you need to show an error.
- **In range mode read `onRangeChanged`, not `onConfirm`.**
- **Give the surface at least 360 logical pixels.** Nothing in the family reflows.
- **Set `maxHeight` on a list to match its container** so it scrolls rather than overflowing.
- **`columns: 1`** gives the year list its dropdown form; **`columns: 3`** gives the standalone card.
- **Wrap the card tier in a [[Sheets|sheet]] or [[Modal|modal]]**, not inline in a form.
- **Pass `chrome: gridOnly`** whenever the parent already draws a surface — otherwise you get a card inside a card.

---

## Rules

1. Every date surface MUST let the user type the date.
2. Every date field MUST expose a way to open the grid.
3. The typed format MUST be shown as supporting text, not only as a placeholder.
4. A date field MUST be labelled with what the date is, never just "Date".
5. Invalid or out-of-range input MUST be surfaced to the user — the component does not do it.
6. A span MUST use range mode, never two single pickers.
7. In range mode the span MUST be read from the range callback, not the confirm callback.
8. A staged choice MUST have an action row; an immediate one MUST NOT.
9. `Clear` MUST appear only when the date is genuinely optional.
10. The confirm action MUST close the surface.
11. The confirm action MUST be labelled `OK`.
12. The card tier MUST be hosted in a [[Sheets|sheet]] or [[Modal|modal]], never inline in a form.
13. A picker inside a parent surface MUST use the grid-only chrome.
14. Every instance MUST carry its own automation identifier — inner controls compose from it.
15. The allowed date window MUST be explained in text where it is not obvious; dimmed days are not an explanation.
16. Keyboard and screen-reader users MUST be given a path that does not require the inline grid.
17. Every surface MUST be given at least 360 logical pixels of width.

---

## Open Items

1. **The day grid is keyboard- and screen-reader-inaccessible.** Days are bare tap targets: no focus node, no focus ring, no key binding, no per-day semantics, no `selected` state, no automation identifier. The primary interaction of the primary surface cannot be performed without a pointer. This violates every row of `40_accessibility.md`'s keyboard contract and is **the most serious defect recorded in any component doc so far.**
2. **The class documentation describes the accessibility the implementation removed.** `AsmCalendar`'s doc comment promises a "Tab-reachable day grid via `CalendarDatePicker`'s built-in focus" and that "arrow keys move focus between days" — but both grids were rewritten as a custom `Wrap` of `InkResponse` to get the Figma chip header, and the focus behaviour went with `CalendarDatePicker`. The comment now describes a widget that is no longer there. Same class of stale-comment defect as [[Switch]], [[Radio]], [[Alert Banner]], and [[Skeleton Loader]], but here it conceals a genuine accessibility regression rather than a wrong number.
3. **`MM/DD/YYYY` is hardcoded through the entire family** — the mask, the placeholder defaults, the supporting-text default, and the parser. A user in the UK or Germany who types their date the way they write it gets it silently misread as a different day, or silently rejected. For a product shipped globally this is a correctness bug, and there is no parameter to change it.
4. **The week starts on Sunday unconditionally.** The first-column offset is computed arithmetically rather than from the platform's first-day-of-week, so in most of Europe and much of Asia every day sits under the wrong weekday header. The weekday header row itself *is* localised, which makes the mismatch worse — the labels are right and the grid under them is wrong.
5. **Weekday and month names are hardcoded English** in the headline and the chips, with a comment stating that the internationalisation package is not a project dependency. So one surface mixes localised weekday initials with unlocalised month abbreviations.
6. **Invalid input is discarded with no feedback of any kind.** No error state, no message, no callback. The field visibly contains `13/45/1800` while the app's value is stale. Consumers cannot even detect it without watching the controller themselves. An `onInvalid` callback, or an error state routed through [[Text Fields]], is missing.
7. **The card's edit affordance does nothing.** The full-chrome grid card renders an edit icon button wired to an empty handler — it is focusable, announced as "Edit date", and has no effect. Either it should switch the card to the typed-input form (which is what the Figma frames imply) or it should not be there.
8. **The custom grid and the shared picker theme disagree on two colours.** The theme sets the today ring to `primary` and the range span to `secondary` at 30% alpha; the custom grid paints the ring `on-surface` and the span solid `secondary`. So the inline grid and the modal picker — both shipped, both Assemble — render the same states differently.
9. **Nothing in the family is responsive.** No `LayoutBuilder`, no breakpoint, no reflow; the Figma frame is explicitly `[desktop]` at 360 wide and there is no mobile variant drawn or built. `90_responsiveness.md` requires the Figma `mobile` / `desktop` variants to be reproduced. A date picker is one of the most mobile-critical surfaces there is.
10. **Figma's `Background = Base` variant is not implemented.** Each type is drawn against both `Canvas` and `Base`; only the canvas fill ships, so a picker placed on a raised surface has no correct treatment.
11. **Day cells are 40 and step arrows are 32**, against the 48 touch minimum. The arrows carry a comment justifying the density against the 360-wide card; the cells carry no justification at all. Adding [[Switch]]'s 52 × 40 and 26 × 20, four of the documented components now ship targets under the floor with no shared decision recorded anywhere.
12. **The card radius of 28 has no token**, and is the only off-scale radius in the family. It is correctly named and commented in two places — which is also the problem: the same constant is declared independently in `calendar.dart` and `date_input.dart` and can drift.
13. **Month changes are never announced.** Stepping the month replaces the entire grid with no live region, so a screen-reader user has no feedback that anything happened.
14. **Range state is conveyed by colour and shape alone.** Nothing announces "start of range", "in range", or "end of range" — a direct WCAG 1.4.1 problem, and the same colour-only pattern flagged in [[Progress Bar]].
15. **The list rows announce as `button`.** They are a single-selection set with an announced `selected` state, which is [[Radio]]'s role, not a button's. A screen-reader user hears twelve buttons rather than a twelve-option group.
16. **The range card's second field has no label.** Only the first field receives the `semanticLabel`, and the end field carries no visible field label either — it is identified solely by its placeholder, which disappears on first keystroke.
17. **The field tier's trigger is a *share* icon.** `AsmDateField` renders the platform share glyph to open a date picker, labelled "Open date picker". The card tier correctly uses a calendar glyph. One of the two is wrong and it is not the card.
18. **The doc comment claims `Escape` clears focus in the field.** No key handling for `Escape` exists anywhere in the family.
19. **Two raw sub-pixel literals sit in the range grid** to close hairline gaps between adjacent span cells. They are a rendering workaround with no token and no named constant, in a file that otherwise names its constants carefully.
20. **The list row height, the calendar's list cap, and the two list default caps are four unrelated numbers** — 56, 280, 320, 480 — only one of which carries a comment explaining where it came from.
21. **There is no combined form.** The Figma frames imply one surface that can be *either* typed or picked; the code splits that into `AsmDateInput` (typed, expands to a grid) and `AsmCalendar` (picked, with an edit affordance that does nothing). A consumer wanting the documented "type or pick, one card" behaviour has to choose the half that's closer and live with it.
