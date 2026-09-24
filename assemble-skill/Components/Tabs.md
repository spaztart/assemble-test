# Component: Tabs

> Role: A horizontal strip of mutually exclusive views over the *same* subject. Switching tabs swaps the panel below without leaving the page, changing the subject, or committing anything.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The selected tab MUST be unmistakable at a glance. Design gives it three simultaneous signals — a heavier weight, a larger size, and a bar under it — and the shipped component delivers only two of the three. NEVER remove another one (do not hide the indicator, do not colour-match the selected label to the rest).
> Source: Figma `Components` → `Tabs` (`4072-11828`, set `2955:17575`), `Tabs — Horizontal` (`4212-8299`, set `2949:15945`), `Tabs — Vertical` (`4213-10276`, set `2949:15946`), `Tabs — Item Icon` (`4213-10991`, set `2949:16124`), `Tabs — Item Text` (`4213-11690`). Implementation: `pegasus_flutter/lib/asm/components/tabs.dart`.

## Overview

Tabs divide one subject into parallel views. "Device → Overview / Activity / Settings" is tabs. "Device → next device" is not; that is navigation. The subject stays fixed and the panel beneath changes.

**The distinction most often got wrong is tabs versus navigation.** They look identical — a row of labels with the active one marked — and the difference is what the row is scoped to. Tabs live *inside* a page and swap a region of it; navigation moves between pages. The test: if switching the row's items changes the page title, breadcrumb, or back-button destination, it is navigation, and it belongs in the [[Navigation Rail]] or a topbar, not here.

**The second distinction is tabs versus a filter.** Tabs partition content into named views the user is expected to move between and back from. A filter narrows one list. If items can be in more than one bucket, or if "all" is a meaningful selection, it is a filter — use [[Tags|filter chips]] or a [[Menu]], not tabs.

Three properties are non-negotiable and follow from what tabs mean:

- **Exactly one tab is selected, always.** There is no empty state and no way for the user to deselect. Selection can only move.
- **Selection is instant and free.** Switching tabs never submits, never validates, never warns. If moving away can lose work, tabs are the wrong container — use a [[Modal]] or a wizard.
- **The set is stable.** Tabs do not appear and disappear as the user works. A tab whose content is conditionally empty stays visible and shows an [[Empty State]] inside its panel.

## Anatomy

The strip is a row of items over a shared baseline. Each item is a fixed-height stack: a content surface on top, then a gap, then a slot that holds the baseline and — when selected — the indicator bar.

```
┌──────────────┬──────────────┬──────────────┐
│              │              │              │  ← item surface (hover / pressed / focus fill)
│  ⌾  Overview │   Activity   │   Settings ● │
│              │              │              │
│              │              │              │
├ ─ ─ ─ ─ ─ ─ ─┼ ─ ─ ─ ─ ─ ─ ─┼ ─ ─ ─ ─ ─ ─ ─┤  ← gap (4)
│▀▀▀▀▀▀▀▀▀▀▀▀▀▀│              │              │  ← indicator slot (6): bar on the selected item
└══════════════╧══════════════╧══════════════┘  ← baseline runs the full width
   ↑        ↑          ↑                  ↑
 icon     label    unselected item      badge
```

| Part | Required | Notes |
| --- | --- | --- |
| Strip | Yes | Owns selection and keyboard movement. Must contain at least two items — one tab is not a choice. |
| Item surface | Yes | The interactive area. Carries the state fill and the focus ring. |
| Label | For three of four compositions | One or two words. See [Content](#content). |
| Icon | For three of four compositions | 24×24. Decorative — it never carries meaning the label does not. |
| Badge | No | A 6px `error` dot meaning "there is something new in here". Carries no count. |
| Indicator bar | Yes, on the selected item only | Rounded on its upper corners, `primary`, sits over the baseline. |
| Baseline | Yes | A hairline in `outline-variant` under every item, selected or not. Separates the strip from the panel. |

### Four compositions

The composition is a property of the **strip**, not of the item — every item in one strip uses the same layout. Mixing an icon-only tab into a text strip is not expressible and should not be attempted by faking it.

```
text                  iconLabelHorizontal      iconLabelVertical      icon
┌────────────┐        ┌────────────────┐       ┌──────────────┐       ┌──────┐
│  Overview  │        │  ⌾  Overview   │       │      ⌾       │       │  ⌾   │
│            │        │                │       │   Overview   │       │      │
└────────────┘        └────────────────┘       └──────────────┘       └──────┘
```

## Sizes

There is one size. The strip is **64** tall in every composition, and that height is fixed — it does not grow with the label, the icon, or the text scale.

| Measurement | Value | Source |
| --- | --- | --- |
| Strip height | 64 | Figma `h-[64px]`; code composes it as 48 + 16 on the [[Spacing]] scale |
| Content surface height | 54 | 64 − indicator slot (6) − gap (4) |
| Indicator slot | 6 | Figma `h-[6px]` |
| Indicator bar thickness | **3** in Figma, **6** in code | Conflict — see [Open Items](#open-items) |
| Baseline thickness | **1** in Figma, **2** in code | Conflict — see [Open Items](#open-items) |
| Gap above the indicator slot | 4 | Code; Figma has no equivalent gap because it positions the indicator absolutely |
| Icon | 24 × 24 | Figma `size-[24px]` |
| Badge | 6 × 6 | Figma: a 2px spacer with 2px padding on all sides |
| Horizontal padding, per item | 16 in Figma, **all four compositions** | Figma state layer `px-[16px]` |
| Gap between icon and label (horizontal) | **4** in Figma, **8** in code | Conflict |
| Gap between icon and label (vertical) | **2** in Figma, **4** in code | Conflict |
| Vertical inset (vertical composition) | 10 top, 8 bottom in Figma; none in code | Conflict |
| Focus ring | 2 stroke, radius 12 | Figma `border-2 primary rounded-[12px]` |

The fixed 64 is the component's central constraint. It means the strip has no room to absorb a longer label or a larger text scale, which is why the [Content](#content) rules are strict rather than advisory.

## Variants

The strip has one axis; the item has four. Figma models the item states as a variant matrix, and every cell is drawn.

| Axis | Values | Drawn in Figma | Implemented |
| --- | --- | --- | --- |
| Composition | `text`, `iconLabel_horizontal`, `iconLabel_vertical`, `icon` | Yes — four strip symbols and three item sets | Yes |
| Selected | false, true | Yes | Yes |
| State | Enabled, Hovered, Focused, Pressed | Yes — all four, for both selected values | Partly — the focus fill is missing |
| Show badge | false, true | Yes | Yes |
| Show focus indicator | false, true | Yes | Yes |
| Icon content | `Default`, `slot` | Yes, on the icon-only item (16 symbols) | **No** — see [Open Items](#open-items) |
| Disabled | — | **Not drawn at all** | Yes, code-only |

Two things follow from that table and are easy to miss.

**Figma draws focus.** This is unusual in this system — most components leave focus undrawn — and here Figma is more complete than the code: it gives a focused tab both a ring *and* a background fill, and it makes the ring an explicit, designed-away-able variant property rather than an implementation detail.

**Figma does not draw disabled.** The disabled treatment is an implementation invention (a uniform opacity knockdown), and it applies to the *entire strip* — there is no per-tab disable in either source. That is the correct model: a tab strip where individual tabs are dead is a signal that the content should not have been split this way.

### `icon` — the composition that needs a second label

An icon-only tab has no visible text. Nothing about the glyph tells a screen-reader user, or a user who does not recognise the icon, what the tab contains. An icon-only strip therefore has two obligations: every item supplies an explicit announced name, and the icons must be conventional enough that a sighted user does not have to guess. If either is in doubt, use `iconLabelVertical` — it costs nothing but 24 of the 54 available pixels and removes the ambiguity entirely.

### `iconLabelVertical` — the widest composition

Stacking the icon over the label makes each item taller in content but the strip is still 64, so the vertical composition has the least headroom of the four. It is also the only composition where the badge overlaps the icon rather than sitting beside the label.

## States

Follows [[States]]. Divergences and specifics:

| State | Treatment |
| --- | --- |
| Enabled, unselected | Label in `on-surface-variant`, icon matches. No fill. |
| Enabled, selected | Label in `primary`, heavier and larger. Indicator bar in `primary`. No fill. |
| Hover | Neutral hover fill across the whole surface. In Figma the unselected label also darkens to `on-surface`; the implementation does not do this. |
| Focus | Branded ring at radius 12, **plus** a neutral fill in Figma. The implementation paints the ring only. |
| Pressed | A neutral fill, plus a ripple in Figma that the implementation does not have. |
| Disabled | Whole strip only. Every foreground, the indicator, the baseline, and the badge drop to the disabled opacity; no hover, no focus, no pointer cursor. Not drawn in Figma. |

**Selection is not a state layer.** A selected tab has no fill of its own — it is marked by weight, size, and the bar. This matters because it means selection and hover compose: a selected tab still takes the hover fill, and a user hovering the tab they are already on gets feedback that the tab is live rather than inert.

**The state fill is rectangular and full-bleed.** It fills the item's surface edge to edge with no radius, so adjacent hovered tabs meet flush. The only rounded thing on the item is the focus ring.

## Behaviors

**Width.** Design intends the strip to fill its container and divide the space evenly between items — every tab the same width regardless of label length. The implementation instead sizes each item to its content and packs them from the leading edge. Both models are defensible; they are not the same model, and the difference is visible the moment labels differ in length. Treat the even-division model as the design intent and the intrinsic model as what ships today.

**Overflow is unsolved.** There is no scrolling, no wrapping, and no overflow menu in either source. A strip with more items than fit will run out of room, and nothing in the component recovers from that. The practical consequence: **decide the number of tabs at design time and keep it small** — four or five in a wide region, two or three in a narrow one. A strip that might need to scroll is a strip that should have been a [[Menu]] or a navigation surface. [[Navigation Rail]] is worth reading here for contrast: it faces the same problem with a fixed slot size, computes how many fit, and folds the remainder into an overflow [[Menu]] rather than clipping — the recovery this component lacks.

**Text scale.** The strip's height is fixed and the labels sit in a row with no room to wrap, so at large text scales labels are clipped rather than reflowed. This is the component's sharpest accessibility limit; it is why one- and two-word labels are a rule and not a preference.

**Selection is controlled by the caller.** The strip does not remember which tab is active — it renders the index it is given and reports the index the user asked for. Nothing happens until the caller updates that value. This is deliberate: tab state usually belongs to a route, a saved preference, or a parent's state, and a component that owned it would fight all three.

**Panels are the caller's problem.** The component is the strip and only the strip. It does not render, animate, or lazily build the content below it. Whatever swaps in must therefore preserve the user's scroll position and any in-progress input per tab, because the component will not do it.

**The badge is a boolean.** It means "new activity in here" and nothing more. It carries no number, and there is no variant that does. If the user needs a count, the count belongs in the panel or in a [[Status Indicators]] badge somewhere with room for a numeral — never squeezed into a tab.

## Content

Tab labels are the tightest copy in the system, because the strip cannot grow and cannot wrap.

- **One or two words.** Not a sentence, not a phrase with a preposition. "Activity", not "Recent activity on this device".
- **Nouns, parallel in form.** "Overview / Activity / Settings", not "Overview / See activity / Configure". A tab names a view; it does not describe an action.
- **No counts, no dates, no dynamic values.** A label that changes width as data changes will break a fixed-height, fixed-set strip. Counts go in the panel.
- **Never truncate.** If a label does not fit, the label is wrong — shorten it. Ellipsis in a tab means the user cannot read their own options.
- **Distinct in the first word.** Users scan the leading edge. "Account settings" and "Account activity" read as the same tab twice.
- **Sentence case.** Tabs are not shouted; the selected tab is already emphasised by weight and size.

The announced name may differ from the visible label when the label is too terse to stand alone out of context, and it **must** be supplied when there is no visible label at all.

## Decision Tree

```
Does the row move between pages, or change what the subject is?
├── yes ────────────────────────────→ this is navigation — use the
│                                     [[Navigation Rail]] (or a topbar),
│                                     not tabs
└── no — it swaps a region of one page
    │
    ├── Can more than one option be active at once?
    │   └── yes ─────────────────────→ use [[Tags|filter chips]] or a
    │                                  multi-select [[Menu]]
    │
    ├── Is the set long, growing, or unknown at design time?
    │   └── yes ─────────────────────→ use a [[Menu]] — tabs cannot overflow
    │
    ├── Do the sections need to be readable together, or expanded in place?
    │   └── yes ─────────────────────→ use an [[Accordion]]
    │
    ├── Is one section a detour the user returns from?
    │   └── yes ─────────────────────→ use a [[Sheets|sheet]] or [[Modal]]
    │
    └── Two to five parallel views of one subject, one visible at a time
        │
        ├── Are the labels short and self-explanatory? ──→ text
        ├── Do icons meaningfully speed up recognition? ─→ iconLabelHorizontal
        ├── Is horizontal space tight but height fine? ──→ iconLabelVertical
        └── Are the icons universally understood AND is
            an announced name supplied for every tab? ───→ icon
```

Route away first. The two most common misuses are a strip that is really navigation and a strip that is really a filter, and neither is fixed by choosing a different composition.

## Selection & Keyboard

Tabs have a keyboard contract distinct from a row of buttons, and it is the part most often implemented wrong.

| Key | Behavior |
| --- | --- |
| Tab | Enters the strip **once**, landing on the selected tab. Tab again leaves the strip entirely. |
| Left / Right arrow | Moves focus between tabs within the strip. Wraps at both ends. |
| Home / End | Moves focus to the first / last tab. |
| Enter / Space | Selects the focused tab. |

**One tab stop for the whole strip.** The strip is a single stop in the page's tab order, not one stop per tab. A five-tab strip that costs five Tab presses to get past is a keyboard trap in everything but name. Movement inside the strip is by arrow key.

**Focus and selection are separate.** Arrowing moves focus without changing the selected tab; the user then commits with Enter or Space. This is the manual-activation model, and it is the right one here because switching a tab swaps a panel — arrowing through five tabs should not load five panels.

**One divergence to know about:** after the user activates a tab with the keyboard, the implementation drops focus out of the strip rather than leaving it on the newly selected tab. The user must press Tab again to get back in. This is a deliberate choice in the code, made so no focus ring lingers after a mouse-adjacent interaction, and it costs keyboard users their place. Expect it; do not copy it into a new control.

## Accessibility

| Requirement | Rule |
| --- | --- |
| Strip is one tab stop | Tab enters and leaves; arrows move within. |
| Every tab has a name | The visible label, or an explicit announced name when there is none. An icon-only tab with no announced name is an unnamed control. |
| Selected state announced | Each tab reports whether it is the selected one — not just "button". |
| Disabled state announced | When the strip is disabled, every tab reports as disabled and none accepts focus. |
| Focus visible | Branded 2px ring at radius 12. Never rely on a colour change alone. |
| Enter / Space activate | Both, plus the numeric-keypad Enter. |
| Decorative glyphs silenced | The icon and the badge announce nothing; the icon repeats the label and the badge's meaning must be conveyed in the panel. |
| Touch target | The surface is 54 tall, which clears the 48 floor. Width is not guaranteed — a short label in a narrow composition can fall under 48 wide. |
| Automation id | Required per item, composed from a stable per-tab value so each tab is independently targetable. |
| Colour is not the only signal | Selection is weight + size + bar, not hue. |

**Non-text contrast, light theme:**

| Element | Pair | Ratio | Verdict |
| --- | --- | --- | --- |
| Selected indicator bar | `primary` on `surface` | ~20:1 | Passes |
| Badge dot | `error` on `surface` | ~3.7:1 | Passes 1.4.11 (3:1) |
| Baseline | `outline-variant` on `surface` | ~1.4:1 | Fails 3:1 — but it is a boundary, not a state indicator; see [[Divider]] |

The baseline is the one figure to be careful about. It is decorative separation, so 1.4.11 does not strictly bite — but it also means the *unselected* half of the strip has almost no visible structure. Do not lean on the baseline to communicate that a strip exists.

**The badge is the accessibility weak point of the component.** It is a 6px dot whose entire meaning is carried by hue, it is silenced for assistive tech, and there is no text alternative anywhere in the component. A badge is therefore only ever a *redundant* hint — the same "there is something new" must be discoverable in the panel, in a [[Status Indicators]] row, or in an [[Alert Banner]]. A user who cannot see the dot must not be worse off.

## Anti-Patterns

**❌ A single tab.** A strip of one is not a choice; it is a heading with extra chrome. → Use a heading.

**❌ Eight tabs.** The component cannot overflow, so they will collide or clip. → Regroup into two to five, or use a [[Menu]].

**❌ Tabs that navigate.** If the back button should return the user to the previous tab, it is routing. → Use a navigation surface.

**❌ A form split across tabs with one submit button.** The user cannot see what they have not filled in, and validation errors point at panels they cannot see. → Use one scrolling form, or a wizard with explicit steps.

**❌ Losing typed input when a tab changes.** The component does not preserve panel state; if you rebuild the panel from scratch, the user's work is gone. → Hoist the panel's state above the strip.

**❌ A dynamic label like "Alerts (12)".** The count changes the label's width in a strip that cannot reflow. → Use the badge, and put the number in the panel.

**❌ An icon-only strip with no announced names.** Nothing is announced; every tab is an unnamed button. → Supply a name per item, or use `iconLabelVertical`.

**❌ Truncating a label with an ellipsis.** → Shorten the label.

**❌ Hiding the indicator bar because "the bold label is enough".** Weight alone is the weakest of the three selection signals and the first to disappear under a contrast theme. → Keep the bar.

**❌ Disabling one tab in an otherwise live strip.** Not supported, and it means the content was split wrong. → Remove the tab, or show an [[Empty State]] in its panel.

**❌ Two tab strips on one surface.** Nested tabs make "which level am I changing?" unanswerable. → Use tabs at one level and an [[Accordion]] or a [[Menu]] at the other.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmTabs`, from `pegasus_flutter/lib/asm/components/tabs.dart`. Items are `AsmTabItem` — a plain immutable data class, not a widget.

`AsmTabs` is **fully controlled**: it renders `selectedIndex` and reports the requested index through `onChanged`. It never holds selection itself.

### Enums

```dart
enum AsmTabType { text, iconLabelHorizontal, iconLabelVertical, icon }
// default: iconLabelHorizontal
```

The default is `iconLabelHorizontal`, **not** `text` — the first value declared. A strip written without `type:` will try to render icons and will throw if the items do not supply them. Pass `type:` explicitly.

### Basic usage

```dart
class _DeviceTabs extends StatefulWidget {
  const _DeviceTabs();
  @override
  State<_DeviceTabs> createState() => _DeviceTabsState();
}

class _DeviceTabsState extends State<_DeviceTabs> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        AsmTabs(
          type: AsmTabType.text,
          items: const [
            AsmTabItem(
              label: 'Overview',
              automationIdentifier: 'device-tab-overview',
            ),
            AsmTabItem(
              label: 'Activity',
              automationIdentifier: 'device-tab-activity',
            ),
            AsmTabItem(
              label: 'Settings',
              automationIdentifier: 'device-tab-settings',
            ),
          ],
          selectedIndex: _index,
          onChanged: (i) => setState(() => _index = i),
        ),
        Expanded(child: _panels[_index]),
      ],
    );
  }
}
```

### Icon and label

```dart
AsmTabs(
  type: AsmTabType.iconLabelHorizontal,
  items: const [
    AsmTabItem(
      label: 'Devices',
      icon: Icons.devices_outlined,
      automationIdentifier: 'home-tab-devices',
    ),
    AsmTabItem(
      label: 'Alerts',
      icon: Icons.notifications_outlined,
      showBadge: true,
      automationIdentifier: 'home-tab-alerts',
    ),
  ],
  selectedIndex: _index,
  onChanged: (i) => setState(() => _index = i),
)
```

### Icon only — the announced name is mandatory

`semanticLabel` is *documented* as required for `AsmTabType.icon`, but nothing enforces it: the assertion only rejects the empty string, and the glyph is excluded from semantics. Omitting it produces an unnamed button, silently. Always pass it.

```dart
AsmTabs(
  type: AsmTabType.icon,
  items: const [
    AsmTabItem(
      icon: Icons.grid_view_outlined,
      semanticLabel: 'Grid view',
      automationIdentifier: 'library-tab-grid',
    ),
    AsmTabItem(
      icon: Icons.view_list_outlined,
      semanticLabel: 'List view',
      automationIdentifier: 'library-tab-list',
    ),
  ],
  selectedIndex: _index,
  onChanged: (i) => setState(() => _index = i),
)
```

### Disabled strip

Omit `onChanged` (or pass `null`). This disables the whole strip — there is no per-item disable.

```dart
AsmTabs(
  type: AsmTabType.text,
  items: const [
    AsmTabItem(label: 'Overview', automationIdentifier: 'tab-overview'),
    AsmTabItem(label: 'Activity', automationIdentifier: 'tab-activity'),
  ],
  selectedIndex: 0,
)
```

### `AsmTabs` parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `items` | `List<AsmTabItem>` | Yes | — (asserted non-empty) |
| `selectedIndex` | `int` | Yes | — (asserted in range) |
| `onChanged` | `ValueChanged<int>?` | No | `null` → whole strip disabled |
| `type` | `AsmTabType` | No | `iconLabelHorizontal` |
| `showFocusIndicator` | `bool` | No | `true` |

### `AsmTabItem` parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `automationIdentifier` | `String` | Yes | — (asserted non-empty) |
| `label` | `String?` | Per `type` | `null` (asserted non-empty when given) |
| `icon` | `IconData?` | Per `type` | `null` |
| `showBadge` | `bool` | No | `false` |
| `semanticLabel` | `String?` | No | `null` (asserted non-empty when given) |

`AsmTabItem` is `@immutable` and takes no `key`. The same item list is valid for every `type`; the type decides which fields are read. `label` is ignored by `icon`, and `icon` is ignored by `text`.

### Guidance

- **Always pass `type:`.** The default renders icons and will throw on a text-only item list.
- **Always pass `semanticLabel` for `AsmTabType.icon`.** Nothing asserts it and the failure is silent.
- **Compose `automationIdentifier` from a stable per-tab value**, not from the list index — the id must survive re-ordering.
- **Give the strip its own bounded width.** It builds a min-width row of intrinsic-width items with no scroll view; put it in a `Row`/`Column` that cannot overflow, and keep the item count low.
- **Do not wrap items in `Expanded`** to force even widths — items are not widgets, and the strip's row is not exposed. Achieving the design's even-division layout requires a change to the component.
- **Do not add your own `Semantics` around `AsmTabs`.** Each item already emits exactly one tap node carrying its label and identifier; a second wrapper produces a competing nameless node.
- **`showFocusIndicator: false` only when an ancestor paints its own focus chrome.** Turning it off otherwise removes the only focus affordance the component has — there is no focus fill to fall back on.
- **Replacing `items` with a same-length list keeps the existing focus nodes.** Changing the length recreates them, which drops focus. Avoid churning the list length while the strip is focused.
- **Hoist panel state above the strip.** `AsmTabs` renders no panel and preserves nothing.

---

## Rules

1. A tab strip MUST have at least two items. NEVER ship a strip of one.
2. Tabs MUST swap a region of the current page. NEVER use them to move between pages or change the subject.
3. Exactly one tab MUST be selected at all times. There is NEVER an empty selection.
4. Switching tabs MUST be instant and non-committal. NEVER put a form that can lose work behind a tab change.
5. The tab set MUST be fixed. NEVER add, remove, or reorder tabs while the user is working in the strip.
6. Tab count MUST be decided so the strip fits. The component has NO overflow, scroll, or wrap behaviour.
7. Labels MUST be one or two parallel nouns in sentence case. NEVER a sentence, NEVER a count, NEVER a dynamic value.
8. A label MUST NEVER be truncated. Shorten the copy instead.
9. The selected tab MUST carry the indicator bar. NEVER hide it and rely on weight alone.
10. Selection MUST NEVER be signalled by colour alone.
11. The whole strip MUST be a single tab stop, with arrow keys moving within it and Home / End jumping to the ends.
12. Focus MUST move without changing selection; Enter or Space commits.
13. Every tab MUST have an announced name. An icon-only tab MUST supply one explicitly.
14. Every tab MUST announce its selected state and, when the strip is disabled, its disabled state.
15. Focus MUST be visible as the branded ring. NEVER disable it without an ancestor that paints its own.
16. Every item MUST carry a stable, unique automation identifier composed from a per-tab value, NEVER from the index.
17. The badge MUST be redundant — the same "something is new" MUST be available as text or announced content elsewhere.
18. Individual tabs MUST NEVER be disabled. Disable the strip, or restructure the content.
19. Panel state MUST live above the strip. The component preserves nothing.
20. Tab strips MUST NEVER be nested.

---

## Open Items

1. **`title/small` means two different sizes.** Figma's `title/small` style is **14px / 400**; the generated `titleSmall` token in code is **16.0 / 400**. The component uses that token for the unselected label, so unselected tabs render at 16 where design draws 14. `titleSmallEmphasized` (16 / 700) matches Figma correctly. The consequence is not cosmetic: Figma's selected tab is both **bolder and two points larger** than its neighbours, and the shipped strip flattens that to a weight change only — one of the three selection signals is silently gone. Either the token generation is wrong or the Figma style is; this needs resolving upstream, and it should be checked across the whole ramp rather than patched here.
2. **The indicator bar is twice its designed thickness.** Figma draws a 6px slot containing a **3px** bar. The code fills the entire 6px slot. The bar is also rounded with a literal `3` where Figma specifies a 100px (pill) radius — there is no `r100` token, though `r999` exists.
3. **The baseline is twice its designed thickness, and drawn in the wrong place.** Figma puts a **1px** `border-b` on the *strip*; the code paints a **2px** `outline-variant` band inside *each item's* indicator slot. Neither `AsmBorderWidths.w100` nor `w200` is used — both `6` and `2` are inline literals in the build method, contrary to the repository's tokens rule.
4. **Every gap in the component is double the designed value.** Figma's Tab Contents gap is **4** for the text, horizontal, and icon compositions and **2** for the vertical one; the code uses **8** and **4** respectively. Four separate gaps, all 2×.
5. **Two compositions have the wrong horizontal padding.** Figma's state layer is `px-[16px]` in every composition. The code uses **24** for `text` and **20** for `icon`, and 16 only for the two icon-plus-label compositions.
6. **The vertical composition's insets are missing.** Figma gives its Tab Contents `pt-[10px] pb-[8px]`; the code has neither and simply centres the stack in the fixed surface height. `10` is not on the 4px [[Spacing]] scale — the third off-scale `10` found so far, after [[Popover]] and [[Sheets]].
7. **Layout model diverges.** Figma's strip is a fixed-width container whose items each take an equal share (`flex-[1_0_0]`); the code builds a min-width row of intrinsic-width items packed from the leading edge. Tabs are therefore unevenly wide and do not fill their container. There is no width-driven layout at all — no responsive branch and no `mobile`/`desktop` variant in Figma to reproduce — so the strip cannot adapt to the space it is given, and it will overflow rather than scroll.
8. **The tab and tab-list accessibility roles exist in the pinned Flutter SDK and are unused.** `SemanticsRole.tab`, `.tabBar`, and `.tabPanel` are all available and framework-validated (the framework itself asserts that a tab bar is non-empty and that its children are tabs). The strip currently declares only a semantics container with no role and no name, and items announce as buttons with a selected flag. Another component in the library has already adopted a semantics role, so both the API and the precedent are in place; adopting these is internal-only and non-breaking.
9. **An icon-only tab can ship nameless.** The item's documentation states the announced name is required for `AsmTabType.icon`; the assertion only rejects the empty string, the glyph is excluded from semantics, and the semantics collapse is gated on the name being non-null. Passing `null` yields an unnamed button with no diagnostic. This is the same class of unenforced-contract defect as the count on the numeric status badge in [[Status Indicators]].
10. **Keyboard activation drops focus out of the strip.** The implementation unfocuses every item before reporting the selection, with a comment explaining that it prevents a lingering focus ring. The tab-list keyboard pattern keeps focus on the tab that was just activated; as shipped, a keyboard user loses their place on every switch and must re-enter the strip.
11. **The focus fill is missing.** Figma gives a focused tab a background fill in addition to the ring — the neutral focus fill when unselected, the neutral pressed fill when selected. The implementation paints no fill on focus at all. Combined with item 12, the neutral focus token is never used by this component.
12. **Figma's own state-to-fill mapping is internally scrambled.** Unselected + focused uses `neutral/focus`; unselected + pressed uses `neutral/hover`; selected + focused uses `neutral/pressed`; selected + pressed uses `neutral/hover`. So the *pressed* token is applied to a *focused* state, the *hover* token is applied to *pressed*, and hover and pressed are visually identical. The implementation uses the tokens as named instead. One of the two is wrong and it is probably the file.
13. **The unselected hover/focus label colour is not implemented.** Figma darkens the unselected label from `on-surface-variant` to `on-surface` on hover, focus, and press. The code keeps `on-surface-variant` in every unselected state.
14. **The pressed ripple is not implemented.** Figma's pressed state includes a large elliptical ripple that overflows the item. The component has no motion at all — consistent with the system-wide absence of motion tokens, and worth deciding once globally rather than per component.
15. **Figma's icon `slot` axis is not expressible.** The icon-only item set carries a 16-symbol matrix whose extra axis is `icon: Default | slot` — an arbitrary-content slot for something that is not a glyph (an avatar, a brand mark). The item takes icon *data* only, so a slotted tab cannot be built.
16. **The badge re-implements a component instead of composing it.** In Figma the badge is an instance of the `status-indicator` symbol — an `error` fill with a 2px spacer inside 2px padding at the 48 radius, exactly the construction documented in [[Status Indicators]]. The code builds a local 6px circle with a bare `6` literal. The measured size agrees; the composition does not, so a future change to the indicator will not reach the tab badge.
17. **The vertical badge sits in a different place in each source.** Figma positions it at 18 from the left edge of the 24px icon box, flush with its top. The code offsets it with bare literals (`right: -4`, `top: -2`), which puts its leading edge around 22 and lifts it above the icon box. Neither number is derived from a token.
18. **A stale design-to-code mapping points at legacy code.** The focus-indicator node in the text-item set resolves to `lib/components/switch.dart` — the read-only legacy widget tree — rather than the current focus-indicator implementation under `lib/asm/components/`. The mapping needs repointing.
19. **Labels have no room to wrap and no room to grow.** The strip's height is fixed at 64 and each label sits in a row with no flexible wrapper, so at large text scales labels clip rather than reflow. Nothing in the component guards this, and there is no designed behaviour for it in Figma either.
20. **Disabled is entirely undesigned.** Figma draws Enabled, Hovered, Focused, and Pressed for both selected values and never draws a disabled tab. The implementation invents one from the Material disabled convention, applying it to every foreground plus the baseline and the badge. It looks reasonable; it is not sourced.
21. **Touch-target width is not guaranteed.** The 54 surface height clears the 48 floor comfortably, but width is intrinsic — a two- or three-character label in the narrowest composition can produce an item under 48 wide. Nothing enforces a minimum.
22. **Nothing in the repository consumes the component.** `AsmTabs` appears only in its own file, its widgetbook story, and one semantics regression test. Every usage claim in this doc is therefore derived from the two sources, not from a real integration.
23. **Dead code in the arrow-key handler.** The wrap-around branch guarding a negative index can never execute, because the modulo of a positive divisor is never negative in this language. Harmless, but it suggests the wrap behaviour was never exercised in a test.
