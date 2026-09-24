# Component: Menu

> Role: A list of rows on a floating surface, anchored to the thing that opened it. Either a **value picker** (choose from a set, the field keeps the answer) or an **action list** (do one thing, the menu goes away).
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A menu hides its options until opened, so NEVER use one when the user needs to compare the options to choose between them, or when there are only two or three of them.
> Source: Figma `Components` → `menu`, `menu_density_low`, `menu_density_compact`, `menu_item*` (nodes `3741-2793` sizes, `3738-1849` examples, `3709-1131` item blocks). Implementation: `pegasus_flutter/lib/asm/components/menu.dart`.

## Overview

A menu is a **temporary surface that covers other content**. That is its cost, and every rule below follows from it: the surface must be small, it must be dismissible in one gesture, and it must return the user exactly where they were.

**Two jobs, one surface.** The floating panel is the same in both cases, but the semantics are not:

- **Value picker** — the menu presents a set of choices; picking one changes a value that stays visible after the menu closes. The trigger is a field, and the field displays the answer. Closing without picking changes nothing.
- **Action list** — the menu presents things to *do*. Picking one performs it immediately and the menu is gone. The trigger is a button, and nothing about the trigger changes afterwards.

Conflating them produces the two most common failures: an action list anchored to a field (so the user expects the field to now say "Delete"), and a value picker anchored to a button (so there is nowhere for the chosen value to live).

**The choice to use a menu at all is a choice to hide information.** A menu is right when the options are numerous, or familiar, or secondary. It is wrong when the user must weigh the options against each other — because they cannot see them and the answer at the same time. Three visible [[Radio]] buttons beat a three-option menu every time.

**Single-select and multi-select are different components in practice.** A single-select menu closes on pick — one gesture, one answer. A multi-select menu must stay open across several picks, which means it needs a separate way to close, and it needs the accumulated answer visible on the trigger while the menu is still covering the screen. That second requirement is why multi-select triggers grow: the chosen values render as removable [[Tags|chips]] inside the field.

**A menu is not a dialog.** It has no title, no scrim, no confirm button, and it never asks a question the user must answer before continuing. If the interaction needs any of those, it is a [[Modal]] or a [[Sheets|sheet]].

## Anatomy

```
  VALUE PICKER — anchored to a field

  ┌──────────────────────────────────────┐
  │ LABEL                                │  ← the trigger: a field
  │  Selected value                  ⌄   │     showing the current answer
  └──────────────────────────────────────┘
                ↕ gap
  ┌──────────────────────────────────────┐  ← surface: 1px border,
  │ ┄┄ 6 inset ┄┄                        │     radius 8, drop shadow
  │ ┌──────────────────────────────────┐ │
  │ │ ◇ ┆12┆ Row label            ┆ ⌃ │ │  ← row (see densities)
  │ ├──────────────────────────────────┤ │
  │ │ ◇ ┆12┆ Row label            ┆ ⌃ │ │
  │ │        supporting text           │ │
  │ ├──────────────────────────────────┤ │
  │ │███ Selected row █████████████████│ │  ← selected fill, full-bleed
  │ ├──────────────────────────────────┤ │
  │ │ ◇ ┆12┆ Row label            ┆ ⌃ │ │  ┆
  │ └──────────────────────────────────┘ │  ┆ scrollbar appears past
  │ ┄┄ 6 inset ┄┄                        │  ┆ the visible-row cap
  └──────────────────────────────────────┘
   ↑12┆                              ┆12↑
   horizontal padding is on the row, not the surface


  ACTION LIST — anchored to a button

  ┌────┐
  │ ⋯  │  ← the trigger: an icon button, unchanged by the pick
  └────┘
  ┌────────────────────────┐
  │  Send feedback         │
  │  Report a problem      │
  └────────────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Surface** | Yes | Bright fill, 1px border, radius 8, drop shadow, 6px inset above and below the rows. Clipped, so rows never bleed past the corners. |
| **Row label** | Yes | One line. Truncates with an ellipsis; never wraps. |
| Leading slot | Optional | A 24px icon, or the check glyph in multi-select. |
| Supporting text | Optional | A second line under the label, smaller and subtler. One line, also truncated. |
| Trailing slot | Optional | A 24px icon — a chevron when the row opens a sub-flow. |
| Scrollbar | Automatic | Appears only when the rows exceed the height cap. See [[Scrollbar]]. |
| **Trigger** | Yes | A [[Text Fields|field]] for a value picker, a [[Button]] or icon button for an action list. Never absent — a menu with no anchor has nothing to return focus to. |

**The row owns the padding, not the surface.** 12px horizontal on each row, 12px between slots. This is what makes a selected row's fill run the full width of the surface — a selection that stopped short of the edges would read as a chip, not as a state.

**The rows are one line each.** Both the label and the supporting text truncate. A menu is not a place for prose; if a row needs two lines of explanation, the choice belongs on a screen, not a surface.

## Sizes

Three densities. They differ only in row height and vertical padding — horizontal padding, gaps, and type are identical.

| Density | Row height | Vertical padding | Height cap (4 rows + insets) | Figma frame |
| --- | --- | --- | --- | --- |
| **Default** | 56 | 8 | 236 | `menu` / `menu_item` |
| **Low** | 48 | 12 | 204 | `menu_density_low` / `menu_item_density_low` |
| **Compact** | 40 | 8 | 172 | `menu_density_compact` / `menu_item_density_compact` |

Row height is a **minimum**, not a fixed height. A row with supporting text grows: at low density the content is 24 (label) + 20 (supporting) + 12 + 12 padding = **68**, not 48. Figma's `menu_density_low` recipe draws exactly this — four 68px rows, 284 tall.

**How to choose.**

- **Default (56)** — the standard. Use it unless you have a reason not to. Comfortable, and the only density that clears the 48px touch-target floor with room to spare.
- **Low (48)** — for menus with many rows, and for multi-select, where the check glyph already makes the row read as denser. Exactly at the touch floor.
- **Compact (40)** — desktop-pointer contexts only: overflow menus, toolbar menus, confirmation menus. **Below the 48px touch-target minimum.** Never use it on a surface that ships to touch.

**Width comes from the trigger, not the menu.** A value picker's surface matches its field's width exactly, so the two read as one control. An action list sizes to its content unless told otherwise.

**Height is capped at four rows.** Past that the surface scrolls rather than growing. Four is the point at which a menu stops feeling like a short list and starts feeling like a page — and a menu that grows past the viewport has no way to be dismissed by tapping outside it. See the caveat in [Open Items](#open-items): the four-row cap is computed from the row *minimum*, so menus with supporting text show three.

## Variants

| Variant | Trigger | Selection | Closes on |
| --- | --- | --- | --- |
| **Bare surface** | You supply it | You supply it | You supply it |
| **Single-select dropdown** | A field | One value | Picking, Escape, outside tap, Tab |
| **Multi-select dropdown** | A field that grows chips | A set of values | Escape, outside tap, Tab — **not** picking |
| **Popup** | Any widget | None (rows are actions) | Picking, Escape, outside tap, Tab |

### Bare surface

Just the styled panel — no anchoring, no open/close, no selection. Reach for it only when you own the positioning logic already. Everything the wired-up variants do for you (dismissal, focus return, keyboard, scroll-into-view) you now owe the user yourself.

### Single-select dropdown

The field is **read-only and displays the chosen value**. The user cannot type into it; the menu is the only way to change it. Opening it pre-highlights the current value and scrolls it into view, so a menu opened on the fortieth option does not start at the top.

This is the variant most often reached for when a [[Radio]] group was correct. The test: would showing all the options at once make the choice easier? If yes, use radios.

### Multi-select dropdown

Rows carry a leading check glyph. Picking toggles and **leaves the menu open**. Chosen values appear as removable [[Tags|filter chips]] inside the field, which grows vertically as they wrap to new rows — and the open menu follows the field's bottom edge down as it grows.

Two consequences worth stating plainly:

- **The field is no longer a fixed-height control.** Any layout that assumed a fixed field height will break as chips accumulate. Give it room to grow.
- **There are two ways to deselect** — untick the row, or dismiss the chip. Both must work, and both must be reachable without a pointer.

### Popup

An action list attached to an arbitrary trigger. The menu prefers a side, and **flips to the opposite side when there is not room** — below becomes above, right becomes left — then shifts horizontally to stay inside the frame, and shrinks rather than bleeding off-screen. It can never cover its own trigger, which matters because the trigger is usually a small overflow button the user is about to click again.

Use it for overflow menus ("Send feedback", "Report a problem") and for two-option confirmations. Do not use it to hold a form.

## States

Rows follow [[States]]. Divergences and specifics:

| State | Row treatment |
| --- | --- |
| Enabled | Transparent fill, standard foreground. |
| Hovered | Neutral hover layer over the row, full-bleed. |
| Focused | Neutral **focus layer** — not the branded focus ring the rest of the system uses. See [Open Items](#open-items). |
| Selected | Full-bleed accent fill, foregrounds flip to the on-accent colour. Icons in the slots re-tint; non-icon widgets do not. |
| Selected (neutral style) | A softer container fill that keeps the normal foregrounds. For persistent selections that should read as a highlight rather than an accent. |
| Disabled | All foregrounds drop to the disabled opacity. Not focusable, not pointer-reactive, no hover. |
| Keyboard-highlighted | A separate, *fourth* fill marking where the arrow keys are. Distinct in purpose from `selected`. |

**`selected` and `disabled` are independent.** A disabled row can still show as selected — correct when a value was chosen and has since become unavailable, because hiding the selection would misrepresent the current state.

**The two selected styles exist for one reason.** The accent fill is right when the selection *is* the answer (a value picker). The neutral fill is right when the selection is context the user already knows — a current navigation destination, for instance — where a strong accent would compete with the actual content.

**The keyboard highlight is not the selection.** Arrow keys move a highlight; Enter commits it. A menu that painted the highlight in the selected style would tell the user they had already chosen. Keep them visually distinct — and see [Open Items](#open-items), because in the current implementation the keyboard highlight and the neutral selected fill are the same colour.

## Behaviors

**Opening.** The menu appears anchored to the trigger with a small gap. A value picker's menu opens below and is exactly as wide as the field. An action list's menu opens on its preferred side and flips if there is no room.

**Dismissal — four ways, all required.**

| Gesture | Result |
| --- | --- |
| Pick a row | Single-select and action lists close. Multi-select stays open. |
| Escape | Closes. Focus returns to the trigger. |
| Tap outside | Closes. **The tap also reaches whatever was underneath** — so clicking a second trigger closes this menu and opens that one in one click. |
| Tab / Shift-Tab | Closes, focus returns to the trigger, then traversal advances one stop. |

That third row is the subtle one. A dismissal that swallowed the tap would make the user click twice to move between two adjacent dropdowns, which is why the outside-tap layer is deliberately non-blocking.

The Tab behaviour is equally deliberate: without it, Tab would strand the user on a row of a menu that the *next* Tab silently skips. Closing and advancing keeps the tab order honest.

**Keyboard.**

| Key | On the trigger | In the open menu |
| --- | --- | --- |
| Enter / Space | Opens | Commits the highlighted row (see [Open Items](#open-items) for a gap on Space in single-select) |
| Arrow Down / Up | Opens | Moves the highlight, wrapping, skipping disabled rows |
| Escape | — | Closes, focus returns |
| Tab / Shift-Tab | Moves on normally | Closes, returns focus, then advances |

**The highlight wraps and skips.** Down from the last row goes to the first. Disabled rows are stepped over rather than landed on and rejected — a highlight that stopped on a dead row would read as broken.

**The highlight scrolls itself into view.** When the list is longer than the height cap, moving the highlight scrolls the newly-highlighted row into the surface, revealing it at the bottom edge when moving down and the top edge when moving up. That asymmetry is what makes arrow-key movement in a long list feel like a native picker instead of like jumping.

**Scrolling.** The surface scrolls only when its rows exceed the cap. See [[Scrollbar]] for the thumb treatment.

**The menu tracks its trigger.** If an ancestor scrolls or transforms while the menu is open, the menu moves with it. It does not close on scroll.

**Overflow.** Row labels and supporting text truncate to one line each. Long labels are a content problem, not a layout problem — fix the copy.

**Text scale.** Rows grow taller as text scales, because row height is a minimum rather than a fixed height. The height cap does not scale, so a menu at 200% text scale shows fewer rows and scrolls sooner. That is the correct trade: readable rows in a scrolling list beat clipped rows in a static one.

## Content

**Row labels are verbs for actions and nouns for values.** "Delete device" in an action list; "United States" in a value picker. A value picker whose rows read as commands ("Set to daily") tells the user the menu will *do* something rather than *record* something.

**Labels are parallel and unprefixed.** In a menu of countries, every row is a country. Do not mix "United States" with "Choose United States", and do not repeat the field's label in every row — the field already said it.

**Supporting text explains, it does not extend.** It is for disambiguation ("Standard — scans new files only"), not for a second half of the label. If the label only makes sense with the supporting text attached, the label is wrong.

**Keep labels short enough not to truncate.** They truncate to one line, so a label that ellipsises is a label that failed. The width is set by the field, which you also control — but shorter copy is the better fix.

**A menu needs no title.** The trigger is the title. A row that reads "Select an option…" is not an option; it is a placeholder, and it belongs in the field, not the list.

## Decision Tree

```
Does the user need to see all the options to make the choice?
├── Yes, and there are 2–5 of them ─────→ [[Radio]] (single) or [[Checkbox]] (multi)
├── Yes, and they are top-level views ──→ [[Tabs]]
└── No — hiding them is acceptable
    │
    ├── Is the trigger a field that should keep the answer?
    │   ├── One value ────────────────────→ Menu: single-select dropdown
    │   └── Several values ───────────────→ Menu: multi-select dropdown
    │                                       (chips are [[Tags]])
    │
    ├── Is the trigger a button, and the rows things to DO?
    │   ├── 2–6 secondary actions ────────→ Menu: popup (action list)
    │   ├── One destructive confirmation ─→ [[Modal]] — a menu cannot
    │   │                                    carry the consequence
    │   └── Rich content, not a list ─────→ [[Popover]]
    │
    └── Is it just explanatory text on hover/focus?
        └── ────────────────────────────→ [[Tooltip]]

Which density?
├── Touch surface ────────────────→ default (56) or low (48)
├── Many rows, or multi-select ───→ low (48)
└── Desktop pointer only ─────────→ compact (40) — under the touch floor

Which selected style?
├── The selection IS the answer ──────────→ accent (default)
└── The selection is known context ──────→ neutral
```

Two routes deserve emphasis. **A confirmation is not a menu** — a menu row can be hit by accident and has no room to state a consequence, so anything irreversible goes to a [[Modal]]. And **a menu is a list of rows** — the moment the floating surface needs a heading, a paragraph, and a button, it is a [[Popover]].

## Accessibility

| Requirement | Rule |
| --- | --- |
| Trigger role | Announced as a **collapsed button** carrying its label, its current value, and its expanded/collapsed state. Never as a read-only text field. |
| Trigger reachable | One tab stop. The field inside it must not own a second one. |
| Open by keyboard | Enter, Space, or either arrow key. |
| Row role | Announced with the row's name, its selected state, and its enabled state. |
| Escape | Always closes and always returns focus to the trigger. |
| Focus return | After any dismissal, focus is on the trigger — never lost to the page root. |
| Touch target | Rows ≥ 48×48. The compact density does not meet this. |
| Decorative glyphs | The chevron and the check glyph carry no information the text does not. |
| Automation id | Required on the trigger; each row composes from it so rows are individually targetable. |

**The trigger's semantics are hand-written for a reason.** A value picker's trigger is visually a read-only field, and left alone, assistive tech announces it as "read only" or "disabled" — which is exactly backwards, since it is the one control on the surface the user must activate. The trigger therefore presents itself as a single collapsed button: label, current value, expanded state. If you build your own anchor, you owe the user the same treatment.

**The visible label and the announced value are different strings.** The label says what the control is for ("Region"); the value says what is currently chosen ("United States"). Both are announced. A trigger that announced only one of them is unusable — either the user does not know what they are setting, or does not know what it is set to.

**Multi-select announces the whole set.** The trigger's announced value is every chosen label, joined. A user who has ticked four filters hears four filters, not "4 selected" — the count without the names is not an answer.

**Where this component currently falls short** — record these when you build on it, because the requirements above are the contract and the implementation does not fully meet it:

- **Moving the arrow-key highlight does not move focus**, so a screen reader announces nothing as the user arrows through the options. The highlight is visual only. This is the single largest gap in the component.
- **The open menu is not announced as a list.** There is no container telling the user how many options there are or which position they are on.
- **Rows announce as buttons, not as options in a list.** A single-select menu is semantically a set of mutually exclusive choices — the same shape as a [[Radio]] group — and a multi-select menu is a set of independent ones, like [[Checkbox]] items. Neither is conveyed.
- **Rows have no branded focus ring**, though Figma draws one.

## Anti-Patterns

**❌ A menu with three options.** The menu costs a click and hides the choices to save space it did not need. → Three [[Radio]] buttons, visible.

**❌ A destructive action in a menu row.** Menu rows are small, adjacent, and easy to mis-hit, and a row has nowhere to state what will be lost. → Put the action in a [[Modal]] that names the consequence, or make the row *open* that modal rather than perform the deletion.

**❌ An action list anchored to a field.** The field implies it will hold the result; an action produces no result to hold. → Anchor action lists to buttons.

**❌ A value picker anchored to a button.** The chosen value has nowhere to live, so the user cannot see what they picked. → Anchor value pickers to fields.

**❌ Compact density on a touch surface.** A 40px row is under the touch-target minimum; users will hit the neighbouring row. → Default or low density, always, wherever a finger is possible.

**❌ Closing a multi-select menu on the first pick.** The user came to pick several. → Keep it open; let Escape, an outside tap, or Tab close it.

**❌ A menu that scrolls the whole viewport.** A surface taller than the frame cannot be dismissed by tapping outside it, because there is no outside. → Respect the height cap and let the surface scroll internally.

**❌ Repeating the field's label in every row.** "Region: United States", "Region: Canada". → The field already said "Region".

**❌ A "Select an option…" first row.** It is not an option and picking it is meaningless. → Use the field's placeholder.

**❌ Building your own anchor and stopping at the visuals.** A hand-rolled trigger that looks right but announces as a read-only field, or loses focus on close, is worse than no menu. → Use the wired-up variants unless you can meet the whole accessibility contract.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. Everything lives in `pegasus_flutter/lib/asm/components/menu.dart`: `AsmMenuItem` (the row), `AsmMenu` (the surface plus three wired-up recipes), and `AsmMenuOption<T>` (an option in a dropdown).

### Enums

```dart
enum AsmMenuItemDensity { defaultDensity, low, compact }
// default on AsmMenuItem and AsmMenu.dropdown: defaultDensity (56)
// default on AsmMenu.multiDropdown:            low (48)

enum AsmMenuItemSelectedStyle { primary, neutral }
// default: primary — full-bleed colorScheme.primary with onPrimary foregrounds
// neutral — surfaceContainerHighest, keeps onSurface foregrounds

enum AsmMenuAnchor { below, above, rightStart }
// default: below. Only AsmMenu.popup reads this.
```

Note `multiDropdown` defaults to `low` while `dropdown` defaults to `defaultDensity` — the two dropdowns are not visually interchangeable out of the box.

### Single-select dropdown

The common case:

```dart
AsmMenu.dropdown<String>(
  label: 'Region',
  options: const [
    AsmMenuOption(value: 'us', label: 'United States'),
    AsmMenuOption(value: 'ca', label: 'Canada'),
    AsmMenuOption(value: 'mx', label: 'Mexico'),
  ],
  selected: _region,
  onSelected: (value) => setState(() => _region = value),
  automationIdentifier: 'region-dropdown',
);
```

The field is read-only and its text is driven by `selected`. Rows compose their automation ids as `'region-dropdown-option-us'` unless the option supplies its own.

### Multi-select dropdown

```dart
AsmMenu.multiDropdown<String>(
  label: 'Filters',
  options: const [
    AsmMenuOption(value: 'high', label: 'High risk'),
    AsmMenuOption(value: 'med', label: 'Medium risk'),
    AsmMenuOption(value: 'low', label: 'Low risk'),
  ],
  selected: _filters,
  onSelectionChanged: (next) => setState(() => _filters = next),
  automationIdentifier: 'risk-filters',
);
```

`selected` is a `Set<T>`; `onSelectionChanged` hands back a fresh set. Chosen values render as `AsmTag` filter chips inside the field — see [[Tags]] — with ids `'risk-filters-chip-high'`. **The field grows vertically as chips wrap**, so do not place it in a fixed-height box.

Use `chipLabelBuilder` when the chip should read shorter than the row:

```dart
AsmMenu.multiDropdown<String>(
  label: 'Filters',
  options: _options,
  selected: _filters,
  onSelectionChanged: (next) => setState(() => _filters = next),
  chipLabelBuilder: (value) => value.toUpperCase(),
  automationIdentifier: 'risk-filters',
);
```

### Popup (action list)

```dart
AsmMenu.popup(
  anchorBuilder: (context, open, toggle) => AsmIconButton(
    icon: const Icon(Icons.more_horiz),
    onPressed: toggle,
    automationIdentifier: 'overflow-button',
  ),
  items: [
    AsmMenuItem(
      label: 'Send feedback',
      density: AsmMenuItemDensity.compact,
      onPressed: _sendFeedback,
      automationIdentifier: 'overflow-send-feedback',
    ),
    AsmMenuItem(
      label: 'Report a problem',
      density: AsmMenuItemDensity.compact,
      onPressed: _report,
      automationIdentifier: 'overflow-report',
    ),
  ],
);
```

`anchorBuilder` receives `open` so the trigger can render a pressed affordance, and `toggle` to open and close. Each item's `onPressed` fires and the menu closes. Pass `anchor: AsmMenuAnchor.rightStart` for a menu that must escape sideways — the [[Navigation Rail]]'s overflow slot is the motivating case, and it works precisely because the rail is left-docked at every tier, so there is always a viewport of room to the right.

`compact` is shown here because overflow menus are desktop-pointer surfaces. On anything touch-reachable, drop the `density:` line and take the 56px default.

### Bare surface

```dart
AsmMenu(
  maxHeight: 236,
  items: [
    AsmMenuItem(
      label: 'Standard',
      supportingText: 'Scans new files only',
      onPressed: () => _select('standard'),
      automationIdentifier: 'scan-mode-standard',
    ),
    AsmMenuItem(
      label: 'Deep',
      supportingText: 'Scans everything',
      selected: true,
      onPressed: () => _select('deep'),
      automationIdentifier: 'scan-mode-deep',
    ),
  ],
);
```

No anchoring, no dismissal, no keyboard handling, no focus return — you own all of it. `maxHeight` is what turns the scrollbar on; without it the surface grows unbounded.

### A row on its own

```dart
AsmMenuItem(
  label: 'Devices',
  leading: const Icon(Icons.devices),
  trailing: const Icon(Icons.chevron_right),
  density: AsmMenuItemDensity.low,
  onPressed: _openDevices,
  automationIdentifier: 'nav-devices',
);
```

`onPressed: null` renders and announces the row as disabled. Pass `semanticLabel` when several rows share a terse label — but note that supplying it collapses the row's inner semantics, which is what makes focus forwarding kick in.

### Parameter reference — `AsmMenuItem`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | Yes | — |
| `onPressed` | `VoidCallback?` | Yes (nullable) | — (`null` = disabled) |
| `automationIdentifier` | `String` | Yes | — |
| `supportingText` | `String?` | No | `null` |
| `leading` | `Widget?` | No | `null` |
| `trailing` | `Widget?` | No | `null` |
| `density` | `AsmMenuItemDensity` | No | `defaultDensity` |
| `selected` | `bool` | No | `false` |
| `selectedStyle` | `AsmMenuItemSelectedStyle` | No | `primary` |
| `semanticLabel` | `String?` | No | `null` |

### Parameter reference — `AsmMenu.dropdown<T>` / `AsmMenu.multiDropdown<T>`

| Parameter | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `options` | `List<AsmMenuOption<T>>` | Yes | — | |
| `selected` | `T?` / `Set<T>` | Yes | — | single / multi |
| `onSelected` / `onSelectionChanged` | `ValueChanged<T>` / `ValueChanged<Set<T>>` | Yes | — | |
| `automationIdentifier` | `String` | Yes | — | prefix for rows and chips |
| `label` | `String?` | No | `null` | also the announced label |
| `placeholder` | `String?` | No | `null` | ignored once chips are present |
| `supportingText` | `String?` | No | `null` | |
| `errorText` | `String?` | No | `null` | replaces `supportingText` |
| `variant` | `AsmTextFieldVariant` | No | `outlined` | see [[Text Fields]] |
| `enabled` | `bool` | No | `true` | |
| `density` | `AsmMenuItemDensity` | No | `defaultDensity` / **`low`** | |
| `maxHeight` | `double?` | No | four rows + 12 | |
| `chipLabelBuilder` | `String Function(T)?` | No | `null` | multi only |

### Parameter reference — `AsmMenu` / `AsmMenu.popup` / `AsmMenuOption<T>`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `AsmMenu.items` | `List<Widget>` | Yes | — |
| `AsmMenu.maxHeight` | `double?` | No | `null` (unbounded) |
| `AsmMenu.width` | `double?` | No | `null` (intrinsic) |
| `popup.anchorBuilder` | `Widget Function(BuildContext, bool, VoidCallback)` | Yes | — |
| `popup.items` | `List<AsmMenuItem>` | Yes | — |
| `popup.anchor` | `AsmMenuAnchor` | No | `below` |
| `popup.maxHeight` | `double?` | No | `null` |
| `popup.width` | `double?` | No | `null` |
| `AsmMenuOption.value` | `T` | Yes | — |
| `AsmMenuOption.label` | `String` | Yes | — |
| `AsmMenuOption.supportingText` | `String?` | No | `null` |
| `AsmMenuOption.leading` | `Widget?` | No | `null` — replaced by the check glyph in multi |
| `AsmMenuOption.trailing` | `Widget?` | No | `null` |
| `AsmMenuOption.enabled` | `bool` | No | `true` |
| `AsmMenuOption.automationIdentifier` | `String?` | No | `'$dropdownId-option-$value'` |

### Guidance

- **Prefer the wired-up recipes.** `dropdown`, `multiDropdown`, and `popup` implement dismissal, focus return, Escape, arrow navigation, scroll-into-view, and the hand-written trigger semantics. A bare `AsmMenu` gives you none of it.
- **Set `maxHeight` on a bare `AsmMenu`.** It is the only thing that bounds the surface and enables the scrollbar. The dropdowns default it for you.
- **Do not put an `AsmCheckbox` in `leading` for multi-select** — `multiDropdown` already renders a cosmetic 18px check glyph. A real checkbox brings its own 48×48 hit target and circular state layer, which fight the row's own full-bleed hover and focus fills.
- **`AsmMenuOption.leading` is ignored by `multiDropdown`.** The check glyph occupies that slot. Use `trailing` if you need a per-row glyph there.
- **Compose `automationIdentifier` from a stable field, not the index.** Row and chip ids fall back to `'$parentId-option-$value'`, so a `value` that is a human-stable string gives you usable hooks for free; an opaque id does not. Override per-option when it is not.
- **Set `selectedStyle: neutral` for persistent selections**, e.g. a current navigation destination. Leave it `primary` for value pickers.
- **`selected` is not the same as the keyboard highlight.** Do not drive `selected` from your own highlight tracking on a bare surface — the wired-up variants keep the two separate for you.
- **Give a `multiDropdown` room to grow.** It is not a fixed-height field once chips appear.
- **The menu re-applies the anchor's theme inside the overlay** because the root overlay sits above any injected `Theme`. If you build your own overlay-based anchor, do the same or the menu will render in the wrong theme under Widgetbook's theme addon.
- **Tear the overlay down directly in `dispose()`**, not through a close path that calls `setState` — by then the element is defunct.

---

## Rules

1. A menu MUST hide its options behind a trigger; NEVER use one when the user needs to see the options to choose between them.
2. With 2–5 mutually exclusive options that should all be visible, a [[Radio]] group MUST be used instead; with 2–5 independent ones, [[Checkbox]] MUST be.
3. A value picker MUST be anchored to a field that displays the chosen value. NEVER anchor one to a button.
4. An action list MUST be anchored to a button. NEVER anchor one to a field.
5. A single-select menu MUST close when a row is picked. A multi-select menu MUST NOT.
6. Multi-select MUST show the accumulated selection on the trigger while the menu is open, and each chosen value MUST be removable from the trigger as well as from the row.
7. Escape MUST close the menu and MUST return focus to the trigger. This holds for every variant.
8. A tap outside MUST close the menu and MUST NOT consume the tap, so clicking a second trigger closes one menu and opens the other in a single click.
9. Tab MUST close the menu, return focus to the trigger, and then advance traversal one stop — NEVER leave the user on a row of a menu the next Tab will skip.
10. The trigger MUST be announced as a collapsed button carrying its label, its current value, and its expanded state — NEVER as a read-only text field.
11. Rows MUST be ≥ 48×48. Compact density (40) is desktop-pointer only and MUST NEVER ship to a touch surface.
12. The arrow-key highlight MUST be visually distinct from the selected state, MUST wrap, and MUST skip disabled rows.
13. Moving the highlight MUST scroll the highlighted row into view.
14. The surface MUST cap its height and scroll internally; it MUST NEVER exceed the frame, because a surface with no outside cannot be dismissed by tapping outside.
15. Row labels MUST be one line and MUST NOT repeat the trigger's label.
16. Destructive actions MUST NOT be menu rows. Route them to a [[Modal]] that names the consequence.
17. A menu MUST NOT carry a title, a heading, or a form. If it needs one, it is a [[Popover]], [[Modal]], or [[Sheets|sheet]].
18. A bare surface MUST NOT be shipped without dismissal, focus return, and keyboard handling supplied by the caller.

---

## Open Items

1. **Arrow-key navigation is invisible to assistive tech.** Moving the highlight sets state and repaints; it does not move focus and emits no announcement. Focus stays on an invisible menu-level node (deliberately marked skip-traversal) for the entire time the menu is open, so a screen-reader user arrowing through ten options hears nothing at all. The rows *are* individually focusable — each one wraps a `FocusableActionDetector` — but nothing ever requests focus on them, and Tab closes the menu rather than entering it. Net effect: `AsmMenuItem`'s focus state layer is unreachable in every wired-up variant. This is the same class of defect as the [[Date Picker]] day grid, though less severe, because the trigger's semantics do announce the current value.

2. **The open menu has no group semantics.** No container announces "list, 4 items" or the highlighted row's position. Rows announce as `button` with a `selected` flag — but a single-select menu is semantically a radio group and a multi-select menu is a set of checkboxes, and neither role is conveyed. Flutter's `RadioGroup<T>` / `RadioClient<T>` would give the single-select variant both the group semantics and native arrow traversal; the component predates it. Same underlying gap noted in [[Radio]].

3. **Figma draws a focus indicator for menu rows; the code does not use one.** `menu_item_density_low` contains a `Focus indicator` instance inset 3px on every side (`I3738:2020;…;3714:1349`), hidden in the default variant. The implementation instead paints a neutral focus *state layer* across the row and imports no `AsmFocusIndicator`. This is the first component in this set where Figma explicitly draws focus and the code diverges — the usual finding has been the reverse. `40_accessibility.md` requires the branded ring.

4. **Compact density is 40px — eight under the 48 touch-target floor.** Documented above as desktop-only, but nothing in the API enforces it, and the popup examples in Figma (`recipe_4`, the icon-button overflow menu) use compact. Touch-target shortfalls now recorded in five components: [[Switch]], [[Date Picker]], and here.

5. **The "four visible rows" cap is computed from the row minimum, so it is wrong whenever supporting text is present.** The cap is `rowHeight × 4 + 12`, but a row with supporting text at low density is 68 tall, not 48 — so the 204 cap shows exactly three rows. Figma's `menu_density_low` recipe (`3738:2308`) is 284 tall: four 68px rows plus the insets. Code and Figma disagree by a whole row on the variant most likely to carry supporting text.

6. **The keyboard highlight and the `neutral` selected style are the same colour.** Both paint `surfaceContainerHighest`. In a menu using `selectedStyle: neutral`, a keyboard-highlighted row and the currently-selected row are indistinguishable — which contradicts the rule (stated in the class doc and in [[States]]) that the highlight must not read as a selection.

7. **Space does not commit in a single-select open menu.** The trigger binds Enter, Space, and both arrows to open. The open menu binds Enter and NumpadEnter to commit — but not Space. `AsmMenu.popup` and `multiDropdown` both bind Space. So the one variant a user is most likely to drive from the keyboard is the one where Space silently does nothing, and `40_accessibility.md` requires Enter/Space/NumpadEnter throughout.

8. **First Arrow Up in a popup lands on the second-to-last row, not the last.** The popup opens with the highlight at the `-1` sentinel and the class doc promises "the first Arrow Down lands on the first enabled item and Arrow Up on the last." Dart's `%` is Euclidean, so `(-1 + -1) % 4` is `2`, not `3` — the highlight lands one row short, and the `if (next < 0) next += length` guard immediately below is dead code. The dropdowns are unaffected because they open with the highlight on a real index.

9. **Figma's surface border uses `outline`; the code uses `outlineVariant`.** The `menu` frame's variable defs give `md/sys/color/outline` (`#bbb6b6`) for the 1px border. The implementation reads `colorScheme.outlineVariant`. One of the two is wrong and the difference is visible.

10. **The shadow is hand-written when a token for it exists.** Figma defines `elevation-5` (drop shadow, `md/sys/color/shadow`, radius 20, spread 0, offset 0,0). `assemble_tokens` ships exactly that value as `AsmShadows.elevation5`, reachable as `context.asmShadows.elevation5` — but the menu builds its own `BoxShadow(color: colorScheme.shadow.withValues(alpha: 0.19), blurRadius: 20)` instead, re-applying alpha to `#8e8e8e30`, which already carries its own. A grep of `lib/` finds **zero** usages of `AsmShadows` anywhere: sixteen components hand-write their shadows, and they disagree with each other (see [[Popover]] for the full tally). [[Elevation]] rule 2 prohibits hand-authoring shadow geometry, and it names the shadows `subtle`/`light`/`heavy` where the token class calls them `elevation1`/`elevation5`/`special` — so a reader holding the Figma name `elevation-5` has no direct route to either.

11. **Figma and code disagree on the gap between trigger and surface.** Every field-anchored Figma recipe (`3738:1832`, `3738:2001`, `3738:2306`) places the menu 8px below the field; the button-anchored ones (`3741:3008`, `3741:3344`) place it at 0. The implementation uses 4 everywhere — the single-select follower offsets `Offset(0, 4)`, the multi-select `Offset(0, height + 4)`, and the popup delegate uses `spacing100`. No variant matches Figma.

12. **Figma's multi-select row uses the full 48×48 checkbox component; the code deliberately does not.** `menu_item_density_low` in `3738:2020` embeds a `check` instance at 48×48. The implementation substitutes a cosmetic 18px `_MenuCheckGlyph` (named constants: box 18, radius 4, border 2, glyph 14 — identical to `AsmCheckbox`'s own) with a documented rationale: a real `AsmCheckbox` brings its own hit target and circular state layer that fight the row's full-bleed fills. The reasoning is sound and the divergence is intentional, but Figma has not been updated to match, so a designer measuring the frame will keep specifying the wrong glyph.

13. **Figma never draws the wrapped multi-select field.** `3795:2809` shows three 142px filter chips at 6px intervals inside a 153px content area — they simply overflow the frame. The implementation wraps them with an 8px gap on both axes and grows the field vertically. So the only drawn state of the chips field is one that cannot occur, the chip gap differs (6 vs 8), and the grown/wrapped field — the state that actually breaks consumer layouts — has no design reference at all.

14. **Figma's frame names contradict their contents.** `3738:2020` is named `menu_density_compact` but contains `menu_item_density_low` (48px) rows; `3741:2868` and `3741:3368` are named `menu` but contain `menu_item_density_compact` (40px) rows. The code's three-density model is self-consistent and matches the row-level names — it is the surface-level frame names that drift. Anyone reading the Figma layer tree to pick a density will pick the wrong one.

15. **The registry's cited node IDs for two of the three Menu sections do not resolve.** `3741-2793` (sizes) and `3709-1131` (item blocks) both return "node not found" through the MCP, though the registry marks all three sections Verified. Only `3738-1849` (examples) resolves. Every geometry figure in this doc is therefore sourced from `3738-1849` and the Dart implementation; the size and item-block frames could not be independently checked. `_kMenuVisibleRowsDefault`'s cited source (`3795:2906`) was also not verified.

16. **The chips field paints its floating label over `scaffoldBackgroundColor`.** The label notch fills itself with the scaffold's colour to punch through the border. Any `multiDropdown` placed on a card, sheet, or [[Modal]] whose surface differs from the scaffold will show a mismatched rectangle behind the label. The plain `AsmTextField` branch does not have this problem — only the chips-present branch, which is hand-rolled.

17. **The chips field hardcodes a `2` border width.** `showFocused || hasError ? 2 : AsmBorderWidths.w100` — the focused/error width should be `AsmBorderWidths.w200`. A token exists and is not used, in the same expression that correctly uses `w100`.

18. **The chips field uses Mono type styles.** `labelMediumMono` for the floating label and `bodyMonoSmall` for supporting and error text. Whether the field label is meant to be monospaced is a question for [[Text Fields]], but the two branches of the same widget must agree, and it is not obvious that they do.

19. **No `automationIdentifier` on the popup or the bare surface.** `AsmMenu.popup` takes no id — its items carry their own, and its anchor is the caller's widget, so nothing identifies the surface itself. `AsmMenu` likewise. Consistent with the surface being non-interactive, but it means a test cannot assert "the menu is open" except by finding a row.

20. **No responsiveness anywhere in the file.** No `LayoutBuilder`, no breakpoint constants. The popup delegate does clamp to the frame and flip sides, which is genuine adaptive placement — but row heights, densities, and the height cap are fixed regardless of available width, and `90_responsiveness.md` asks for the Figma mobile/desktop variants to be reproduced. There are no mobile/desktop menu variants in Figma to reproduce, so this may be correct by omission; it is untested either way.

21. **No motion tokens.** The scroll-into-view animation is 100ms `easeOut`, hardcoded. The system-wide absence of motion tokens is now recorded in nine components.

22. **`AsmMenu.popup` is the closest shipped thing to a [[Popover]].** The registry lists Figma `6136-5862` (`Popover — container`) and `6136-5866` (`Popover — examples`) with no implementation, naming the menu popup as the candidate. The popup's placement delegate — preferred side, flip when short of room, horizontal shift, clamp to frame minus 8 — is exactly the placement logic a popover needs, and should be extracted rather than reimplemented. See [[Popover]].
