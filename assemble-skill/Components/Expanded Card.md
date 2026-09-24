# Component: Expanded Card

> Role: A card whose header is a disclosure control and whose lower panel has two slots — a summary that is always visible, and a reveal that opens beneath it. The reveal holds either a set of single-select option rows or a subtree the caller composes.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe the two-slot model, when to reach for it, and what the reveal may hold. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: If there is nothing to reveal, this is not a disclosure. The component enforces it — no reveal content means no chevron, no toggle, and a header that announces as a static region. An arrow that rotates over an empty slot is a control that lies about having content.
> Source: Figma `Components` → `blank_card` / `expanded_card`, nodes `13003-4581` (collapsed) and `13003-4387` (expanded), with `expanded_slot` for the option rows. Implementation: `pegasus_flutter/lib/asm/components/expanded_card.dart`.

## Overview

The expanded card is a [[Cards]] surface containing a header row and a filled panel. The header is a disclosure control. The panel always shows a titled summary of what the card controls; when the header is opened, the panel grows downward to reveal the choices.

The reference case is a VPN card: the header says which server you are connected to and how fast it is, the panel's summary explains what a virtual location does, and the reveal is the list of countries you can pick.

**The distinction most often got wrong is expanded card versus [[Accordion]].** Both are disclosures with a rotating chevron and a 200ms growth animation, and they even share the same Windows screen-reader workaround. They differ in what they are *for*:

| | Expanded Card | [[Accordion]] |
| --- | --- | --- |
| Is a card | Yes — its own surface | No — a row in a list of rows |
| Summary visible when closed | **Yes** — the panel's first slot | No — only the header |
| Reveal holds | Single-select options, or a custom subtree | Arbitrary content |
| Belongs in a set | No — it is a standalone control | **Yes** — accordions come in groups |
| Purpose | Change one setting | Read one section of many |

**Use an accordion to read; use an expanded card to choose.** An expanded card in a stack of expanded cards is a design smell — that is a list, and the rows want to be accordion items or list rows.

**The second distinction is the two slots.** The panel is *always rendered*. Closing the card does not hide the panel; it hides only the panel's lower half. This is the component's central idea and the thing most likely to be misread from a static mock: the collapsed card is not "just a header," it is a header plus a titled summary. If you want the whole panel gone when closed, this is the wrong component.

**The third distinction is options versus custom content.** The reveal has two mutually exclusive fillings. The built-in option rows are a single-select group with full radio semantics, spacing, and automation ids handled for you. The custom-content slot is an escape hatch for a reveal that is not a choice — and it hands the entire accessibility contract back to the caller. Passing both is an error and asserts. See [The reveal](#the-reveal).

## Anatomy

```
╭──────────────────────────────────────────────────────────────╮
│ ┆20┆                                                  ┆20┆   │  ← AsmCard: radius 24,
│   ┌────────────────────────────────────────────────────┐     │     padding 20
│   │ ┆12┆                                        ┆12┆   │     │
│   │  ┌────┐  OVERLINE                    +0000     ⌄   │     │  ← header row (a disclosure)
│   │  │icon│  Line text                   sub line      │     │     radius 16
│   │  └────┘  Supporting line text                      │     │
│   │ ┆12┆                                        ┆12┆   │     │
│   └────────────────────────────────────────────────────┘     │
│                            ┆20┆                              │
│   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     │
│   ┃ ┆20┆                                        ┆20┆   ┃     │  ← panel: surfaceContainerLow,
│   ┃   ◇ ┆8┆ Virtual location                          ┃     │     radius 24, padding 20
│   ┃                    ┆16┆                            ┃     │
│   ┃   When VPN is on, your real location is hidden.    ┃     │  ← SLOT ONE — always visible
│   ┃ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┆20┆ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┃     │
│   ┃   ┌──────────────────────────────────────────┐     ┃     │  ← SLOT TWO — revealed only
│   ┃   │ ┆20┆  Fastest location          ✓  ┆20┆  │     ┃     │     while expanded
│   ┃   │ ┆20┆  Germany                      ┆20┆  │     ┃     │
│   ┃   │ ┆20┆  Japan                        ┆20┆  │     ┃     │
│   ┃   └──────────────────────────────────────────┘     ┃     │
│   ┃ ┆20┆                                        ┆20┆   ┃     │
│   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛     │
│ ┆20┆                                                  ┆20┆   │
╰──────────────────────────────────────────────────────────────╯
```

| Part | Required | Notes |
| --- | --- | --- |
| **Card surface** | Yes | An [[Cards]] `surface` card — radius 24, padding 20, elevation-1. |
| **Header row** | Yes | A list feature row. The disclosure control: it owns the tap, the focus, the chevron, and the expanded announcement. Inset 12 inside its own hover fill. |
| **Header title** | **Yes** | Asserted non-empty. |
| **Header overline** | No | A short kicker above the title. |
| **Header supporting text** | No | One line below the title. |
| **Header leading** | No | Typically an icon container. |
| **Header right content** | No | A caller-composed metric — the reference usage is a value with a sub-line. |
| **Chevron** | Only when there is something to reveal | Rotates on open. Absent entirely when the reveal is empty. |
| **Gap to panel** | Yes | 20pt. |
| **Panel** | **Yes — always rendered** | `surfaceContainerLow` fill, radius 24, padding 20. No shadow. |
| **Section icon** | No | 24 × 24, 8pt before the title. Decorative — excluded from the semantics tree. |
| **Section title** | **Yes** | Asserted non-empty. Names the panel for screen readers. Not a tab stop. |
| **Section description** | No | One or more lines, 16pt below the title. Not a tab stop. |
| **Reveal** | No | 20pt below the summary. Either option rows or a custom subtree — never both. |
| **Option row** | No | A list feature row per option, radius 16, inset 20 × 12, with a 24pt check when selected. |

## The two slots

The panel's summary slot is **not** gated on the open state. Only the reveal is.

- **Collapsed:** card surface → header (no chevron rotation) → panel with its section title and description.
- **Expanded:** the same, plus the reveal growing downward from beneath the description.

The collapsed branch of the reveal is a full-width, zero-height box, so the panel's width never depends on the open state — the card does not jump horizontally when it opens.

Two consequences worth designing around:

- **The collapsed card is not small.** It is a card, a header, and a titled panel. A page of collapsed expanded cards is tall. If you need a compact closed state, use [[Accordion]].
- **The summary must be worth reading when closed.** It is permanently visible, so it cannot be a restatement of the header. The header says *what is currently true*; the summary says *what this section governs*.

## The reveal

Exactly one of two fillings, and supplying both is an error the component asserts on.

### Built-in option rows — a single-select group

The default and the case the component is designed for. Each option is a row with a label; the selected one is emphasized and gains a check glyph. The rows announce as members of a mutually exclusive group with a checked state — radio semantics, without a radio glyph.

- **Exactly one option should be selected.** The component does not enforce this. Zero selected rows and several selected rows both render, and several selected rows each announce as the checked member of a single group, which is incoherent. **The caller owns the invariant.** See [Open Items](#open-items) item 1.
- **Selection is the caller's state.** Each option carries its own callback; the component does not track which is chosen. Set the flag and rebuild.
- **Option labels are asserted non-empty**, and each row gets an automation id composed from the card's id and a slug of the label.
- **Two to five options.** Below two there is no choice; above five the reveal is a list and wants [[Menu]] or a picker instead.

Why not [[Radio]]? Because these rows are not a form field — there is no group label, no validation, and no submit. They are an immediate-effect choice inside a settings surface, and the shape they take here is a row with a check. If the choice belongs to a form, use [[Radio]].

### Custom content — the escape hatch

A caller-composed subtree in place of the option rows. Use it when the reveal is not a choice: a read-only detail row, a status summary, a single action.

**It hands the accessibility contract back to you in full.** The component wraps it in nothing, names it nothing, and asserts nothing about it. Specifically:

- Every control inside it needs its own accessible name, its own focus handling, and its own `automationIdentifier`. The card's id does not prefix anything in here.
- Anything decorative inside it needs to be excluded from the semantics tree yourself.
- Nothing stops you putting a nested card, a scrolling list, or another disclosure in here. All three are mistakes — see [Anti-Patterns](#anti-patterns).

**Never use the escape hatch to rebuild the option rows by hand.** You will lose the mutually-exclusive-group announcement, the checked state, the emphasized selected label, the 20 × 12 insets, and the composed automation ids.

## States

The card has three header states, and the component picks between them from what you pass rather than from a flag. This is the most carefully-reasoned part of the component and worth getting right.

| Reveal content | Toggle handler | Header renders as | Chevron | Announced as |
| --- | --- | --- | --- | --- |
| **None** | anything | **Read-only** — no hover, no tap | Absent | A static region |
| Present | **Absent** | **Disabled** — dimmed per [[States]] | Absent | A disabled control |
| Present | Present | **Interactive** | Present, rotates | A button with an expanded state |

The distinction between the first two rows is the point. A card with nothing to reveal is a *static summary*, not a broken control — so it renders read-only rather than disabled, because dimming it to the disabled opacity and announcing it as a control would tell the user something is temporarily unavailable when in fact nothing was ever there. The genuine disabled look is reserved for a real disclosure whose toggle has been switched off.

**When the reveal is empty, the open/closed inputs are ignored entirely.** You cannot force a chevron onto a card with nothing behind it.

Everything else follows [[States]] through the header row and the option rows — hover, focus, and press are the list feature row's, not this component's. The card surface itself has no states; see [[Cards]].

The panel's section title and description are deliberately **not tab stops**. They are read with reading commands, and making them focusable would cause screen-reader item navigation to skip them.

## Behaviors

- **The card fills its parent's width by default.** An explicit width is available and is asserted positive. Because the default is an infinite width, the card **cannot be placed in an unbounded horizontal context** — a plain row, or a horizontally scrolling list — without an explicit width or an intervening constraint.
- **The reveal animates over 200ms with an ease-in-out curve, growing from the top.** The panel's summary stays put and the content below it moves.
- **There is no reduced-motion branch.** The 200ms growth runs regardless of the platform's reduced-motion setting. [[Accordion]] has the same gap; the charts in this system do not. See [Open Items](#open-items) item 4.
- **The card does not scroll and must not be made to.** Its height is its content's. Put it inside the page's scroll view.
- **Text scale grows everything.** The header row, the summary, and each option row are all sized by their text. Nothing is clipped and nothing is capped, which is correct — and it means a card that fits at default scale can be very tall at large scale. Never put it in a fixed-height box.
- **The chevron does not animate independently of the reveal.** Rotation and growth share the same duration, so they cannot desynchronise.
- **Opening one card does not close another.** There is no group behaviour and no accordion-style exclusivity. If two of these are on a page and only one should be open, the caller coordinates it — and should probably be using [[Accordion]] instead.
- **The header's 12pt inset sits inside its hover fill**, so the fill spans the card's inner width while the content keeps its cushion. Do not zero it to "avoid double padding" — that paints the fill flush against the leading icon and the chevron.

## Content

The card has four text slots above the reveal, and each has a different job. Filling them with variations on the same sentence is the most common failure.

| Slot | Says | Example |
| --- | --- | --- |
| **Overline** | The category or current state, short and upper-case-free | `CONNECTED` |
| **Header title** | The specific thing, right now | `Frankfurt, Germany` |
| **Header supporting text** | One qualifying detail | `42 ms · 128-bit tunnel` |
| **Header right content** | A metric, caller-composed | `+0000` with a sub-line |
| **Section title** | What the panel *governs* — a noun phrase | `Virtual location` |
| **Section description** | Why it matters, in one or two sentences | `When VPN is on, your real location is hidden. Others will see a virtual location instead.` |
| **Option labels** | The choices, as nouns | `Fastest location`, `Germany`, `Japan` |

Rules:

- **The section title must not restate the header title.** The header is the current value; the section is the setting. `Frankfurt, Germany` / `Virtual location` — not `Frankfurt, Germany` / `Your location`.
- **The section description is permanently visible.** Write it as steady-state explanatory copy, not as a hint that appears on open. Two sentences at most.
- **Option labels are nouns, not commands.** `Germany`, not `Connect to Germany`. The row is a choice, not a button.
- **No empty strings.** Every optional text slot asserts non-empty — pass null to omit, never `''`.
- **The overline is not a [[Badges]] chip.** If the card needs a severity signal, use a badge in the header's right content; do not upper-case the overline to fake one.

## Decision Tree

```
Is the content behind the disclosure worth revealing at all?
├── No — there is nothing to reveal ─────────→ NOT this component.
│                                              A plain [[Cards]] card, or a
│                                              read-only list feature row.
│
└── Yes
    │
    ├── Do several of these sit in a stack, and does the user
    │   read them rather than choose within them?
    │   └── Yes ─────────────────────────────→ use [[Accordion]]
    │
    ├── Is the choice part of a form, with a group label,
    │   validation, or a submit?
    │   └── Yes ─────────────────────────────→ use [[Radio]] in a form
    │
    ├── Is it a binary on/off?
    │   └── Yes ─────────────────────────────→ use [[Switch]] on a plain card
    │
    ├── Are there more than five choices?
    │   └── Yes ─────────────────────────────→ use [[Menu]] or a picker
    │
    ├── Does the closed state need to be compact?
    │   └── Yes ─────────────────────────────→ use [[Accordion]]. This card's
    │                                          panel is ALWAYS visible.
    │
    └── A standalone setting, 2–5 choices, with a summary
        worth reading when closed
        │
        └── What fills the reveal?
            ├── A single-select set of choices ──→ options (the built-in rows)
            ├── A detail row, a status, an action ─→ expandedContent
            └── Both ──────────────────────────────→ ERROR. Asserts.
```

## Accessibility

This is one of the better-instrumented components in the folder. The header is a named disclosure button that reports its own expanded state; the option rows announce as checked members of a mutually exclusive group; the decorative section icon is excluded; and the always-visible summary is deliberately kept out of the tab order so that item-by-item navigation does not skip past it.

| Requirement | Status | Notes |
| --- | --- | --- |
| Accessible name (header) | **Met** | Composed from the visible header text; overridable. Asserted non-empty. |
| Role (header) | **Met** | Announces as a button, not a link — an in-place disclosure is an action, not navigation. |
| Expanded state announced | **Met**, with a platform workaround | See below. |
| Read-only vs disabled distinguished | **Met** | A card with nothing to reveal is a static region, not a dimmed control. |
| Option rows in a group | **Met** | Each announces as the checked or unchecked member of a mutually exclusive group, on its own single tap node. |
| Exactly one option selected | **Not enforced** | Caller's invariant. Several selected rows all announce as checked. |
| Decorative icon excluded | **Met** | The section icon is suppressed; the section title names it. |
| Summary reachable | **Met by design** | Read with reading commands, not focus. Deliberately not a tab stop. |
| Text contrast (WCAG 1.4.3) | **Passes** | See the table below. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Panel edge fails** | The panel is **1.12 : 1** against the card. See below. |
| Touch target 48 × 48 | **Delegated** | Header and option rows are list feature rows; their target is that component's. |
| `automationIdentifier` | **Required** | The only component in this folder that makes it mandatory. |
| Reduced motion | **Not handled** | The 200ms reveal is unconditional. |
| High contrast | **Not handled** | No branch. |

**The Windows announcement workaround.** The expanded flag alone is not spoken through the Windows screen-reader bridge, so on Windows only (not web) the state is additionally exposed as the row's value. The two localised strings used for this read backwards on purpose — each names the state the toggle *leads to*, matching the platform's own expansion row — so the expression that looks inverted is the one that produces the right words. [[Accordion]] carries the identical workaround with the same reasoning. **Do not "fix" the apparent inversion.**

**Computed contrast** — derived from the light and dark token values:

| Pair | Light | Dark | Verdict |
| --- | --- | --- | --- |
| Panel fill vs card fill | **1.12 : 1** | **1.13 : 1** | **Fails 3 : 1.** The panel's boundary is almost invisible. |
| Section title on panel | 14.26 : 1 | 11.73 : 1 | Passes |
| Section description on panel | 9.34 : 1 | 8.11 : 1 | Passes |
| Selected check glyph on panel | 4.03 : 1 | 8.53 : 1 | Passes 3 : 1 for a graphic |

Three obligations the component cannot discharge for you:

1. **Keep exactly one option selected.** Nothing checks it. Zero selected rows leaves the group with no checked member; two leaves it with two, which is a contradiction the screen reader will faithfully report.
2. **If you use the custom-content slot, you own its accessibility entirely.** Names, focus order, automation ids, and decorative exclusions are all yours. The component contributes nothing inside that subtree.
3. **Do not rely on the panel's fill to delineate it.** At 1.12 : 1 the panel reads as a boundary only because of the 20pt gap above it and the 24pt radius. On a low-contrast display it is one continuous surface. The section title is what tells a user the panel is a distinct region, so it must always be present — which is why it is required and asserted.

## Anti-Patterns

**❌ Passing both `options` and custom content.** They fill the same region; supplying both is ambiguous. It asserts. → Pick one.

**❌ Rebuilding the option rows inside the custom-content slot.** You lose the mutually-exclusive-group announcement, the checked state, the emphasized selected label, the insets, and the composed automation ids. → Use `options`.

**❌ Leaving zero or several options selected.** Nothing enforces the invariant, and several checked rows in one exclusive group is incoherent to a screen reader. → Exactly one.

**❌ Expecting a chevron on a card with nothing to reveal.** The component removes it deliberately. → If there is nothing behind it, use a plain card.

**❌ Stacking several expanded cards on a page.** Each has an always-visible panel, so the page is enormous, and there is no group exclusivity. → Use [[Accordion]].

**❌ Using it because you want a compact collapsed row.** The panel is always rendered; the closed card is a card plus a header plus a titled panel. → Use [[Accordion]].

**❌ Restating the header title in the section title.** The header is the current value; the section is the setting. → `Frankfurt, Germany` / `Virtual location`.

**❌ Writing the section description as an on-open hint.** It is permanently visible. → Steady-state copy, two sentences at most.

**❌ Nesting a [[Cards]] card inside the panel or the custom-content slot.** The card and the panel are already two surfaces; a third gives you three radii and 60pt of accumulated inset. → Plain layout.

**❌ Putting another disclosure inside the reveal.** Two chevrons in one card is unnavigable. → Flatten it.

**❌ Putting a scrolling list inside the reveal.** A scroll region inside a growing region traps the gesture and breaks the 200ms animation. → Cap the option count, or route to [[Menu]].

**❌ Zeroing the header's content inset to avoid "double padding."** The inset lives inside the hover fill and is the cushion between the fill edge and the content. Zeroing it paints the fill flush against the icon and chevron. → Leave it at 12.

**❌ Option labels written as commands.** `Connect to Germany` on a row that is a choice, not a button. → Nouns.

**❌ Passing `''` to an optional text slot.** Every one of them asserts non-empty. → Pass null to omit.

**❌ Placing the card in an unbounded horizontal context.** Its default width is infinite. → Give it a bounded parent or an explicit width.

**❌ Putting the card in a fixed-height box.** Its height follows its content, which follows text scale. → Let it size itself.

**❌ "Fixing" the apparently-inverted Windows state strings.** They are correct: each names the state the toggle leads to. → Leave them.

---

## Flutter Usage

`AsmExpandedCard` and `AsmExpandedCardOption` in `lib/asm/components/expanded_card.dart`, exported from `assemble.dart`. The newest component in the set; it has no in-repo consumers beyond its own widgetbook story.

No enums of its own. It composes `AsmCard`, `AsmListItemFeature`, and — through the header — `AsmListItemFeatureKind` and `AsmListItemFeatureSemanticRole`.

### Basic usage — the single-select case

```dart
class _LocationCard extends StatefulWidget {
  const _LocationCard();
  @override
  State<_LocationCard> createState() => _LocationCardState();
}

class _LocationCardState extends State<_LocationCard> {
  bool _expanded = false;
  String _selected = 'Fastest location';

  static const _locations = <String>['Fastest location', 'Germany', 'Japan'];

  @override
  Widget build(BuildContext context) {
    return AsmExpandedCard(
      overline: 'CONNECTED',
      title: 'Frankfurt, Germany',
      supportingText: '42 ms · 128-bit tunnel',
      leading: const AsmIconContainer(icon: Icon(Icons.public)),
      sectionIcon: const Icon(Icons.vpn_lock),
      sectionTitle: 'Virtual location',
      sectionDescription:
          'When VPN is on, your real location is hidden. Others will see a '
          'virtual location instead.',
      expanded: _expanded,
      onExpansionChanged: (next) => setState(() => _expanded = next),
      automationIdentifier: 'vpn-location-card',
      options: [
        for (final location in _locations)
          AsmExpandedCardOption(
            label: location,
            selected: _selected == location,
            onPressed: () => setState(() => _selected = location),
          ),
      ],
    );
  }
}
```

`automationIdentifier` is **required**. It composes the header's id and each option row's id, so it must be stable and unique on the page.

Note that exactly one `selected: true` comes out of the comparison. That is the caller maintaining the invariant — nothing in the component does it.

### The custom-content escape hatch

```dart
AsmExpandedCard(
  overline: 'CONNECTED',
  title: 'Frankfurt, Germany',
  leading: const AsmIconContainer(icon: Icon(Icons.public)),
  sectionIcon: const Icon(Icons.vpn_lock),
  sectionTitle: 'Virtual location',
  sectionDescription:
      'When VPN is on, your real location is hidden. Others will see a '
      'virtual location instead.',
  expanded: _expanded,
  onExpansionChanged: (next) => setState(() => _expanded = next),
  automationIdentifier: 'vpn-location-card',
  expandedContent: Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      const AsmListItemFeature(
        overline: 'CONNECTED',
        title: 'Frankfurt, Germany',
        supportingText: '42 ms · 128-bit tunnel',
        leading: AsmIconContainer(icon: Icon(Icons.public)),
        kind: AsmListItemFeatureKind.readOnly,
      ),
      SizedBox(height: context.asmSpacingTokens.spacing300),
      AsmButton(
        label: 'Change location',
        onPressed: _openPicker,
        automationIdentifier: 'vpn-location-card-change-location-button',
      ),
    ],
  ),
)
```

Note the button carries its own `automationIdentifier`. The card's id does not prefix anything inside this slot.

### A static summary — no reveal

```dart
AsmExpandedCard(
  title: 'Protection is on',
  supportingText: 'Last scanned 4 minutes ago',
  leading: const AsmIconContainer(icon: Icon(Icons.shield_outlined)),
  sectionTitle: 'Real-time scanning',
  sectionDescription: 'Files are checked as they are opened or downloaded.',
  expanded: false,
  onExpansionChanged: null,
  automationIdentifier: 'realtime-scanning-card',
)
```

With no `options` and no custom content, the header renders read-only: no chevron, no hover, no tap, announced as a static region. The `expanded` and `onExpansionChanged` values are ignored. **This is a valid configuration, not a mistake** — but if you find yourself building it often, a plain [[Cards]] card is simpler.

### A disclosure with its toggle turned off

```dart
AsmExpandedCard(
  title: 'Frankfurt, Germany',
  sectionTitle: 'Virtual location',
  expanded: false,
  onExpansionChanged: null,        // ← disabled, not read-only
  automationIdentifier: 'vpn-location-card',
  options: [
    AsmExpandedCardOption(label: 'Germany', onPressed: () {}),
    AsmExpandedCardOption(label: 'Japan', onPressed: () {}),
  ],
)
```

Reveal content present, handler null: the header renders **disabled** — dimmed per [[States]], no chevron. This is the deliberate contrast with the previous snippet.

### Full parameter reference — `AsmExpandedCard`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — ; asserted non-empty |
| `sectionTitle` | `String` | **Yes** | — ; asserted non-empty |
| `expanded` | `bool` | **Yes** | — ; ignored when there is nothing to reveal |
| `onExpansionChanged` | `ValueChanged<bool>?` | **Yes** (nullable) | — ; `null` disables the toggle |
| `automationIdentifier` | `String` | **Yes** | — ; asserted non-empty. Prefixes the header and option ids. |
| `overline` | `String?` | No | `null` ; asserted non-empty if given |
| `supportingText` | `String?` | No | `null` ; asserted non-empty if given |
| `sectionDescription` | `String?` | No | `null` ; asserted non-empty if given |
| `sectionIcon` | `Widget?` | No | `null` ; forced to 24pt, decorative |
| `leading` | `Widget?` | No | `null` |
| `rightContent` | `Widget?` | No | `null` |
| `options` | `List<AsmExpandedCardOption>` | No | `const []` |
| `expandedContent` | `Widget?` | No | `null` ; **mutually exclusive with `options`** |
| `semanticLabel` | `String?` | No | `null` → the visible header text ; asserted non-empty if given |
| `width` | `double?` | No | `null` → fills the parent ; asserted positive if given |

### Full parameter reference — `AsmExpandedCardOption`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | **Yes** | — ; asserted non-empty |
| `onPressed` | `VoidCallback` | **Yes** | — |
| `selected` | `bool` | No | `false` |
| `semanticLabel` | `String?` | No | `null` → `label` ; asserted non-empty if given |
| `automationIdentifier` | `String?` | No | `null` → composed as `'<card id>-option-<slug of label>'` |

### Tokens

| Property | Token | Value |
| --- | --- | --- |
| Card | `AsmCard` `surface` | radius 24, padding 20, elevation-1 |
| Header inset | `spacing300` | 12 |
| Header → panel gap | `spacing500` | 20 |
| Header / option row radius | `AsmCornerRadii.r16` (from the list feature row) | 16 |
| Panel fill | `colorScheme.surfaceContainerLow` | `#F3F2F2` / `#222020` |
| Panel radius | `AsmCornerRadii.r24` | 24 |
| Panel padding | `spacing500` | 20 |
| Section icon | 24, `colorScheme.onSurface` | 24 |
| Icon → title gap | `spacing200` | 8 |
| Section title | `titleMediumEmphasized` on `onSurface` | — |
| Title → description gap | `spacing400` | 16 |
| Section description | `bodyMedium` on `onSurfaceVariant` | — |
| Summary → reveal gap | `spacing500` | 20 |
| Option label | `titleSmallEmphasized` when selected, `titleSmall` otherwise | — |
| Option row inset | `spacing500` × `spacing300` | 20 × 12 |
| Selected check | `Icons.check`, 24, `colorScheme.secondary` | — |
| Reveal animation | 200ms, ease-in-out, grows from the top | — |

### Guidance

- **`automationIdentifier` is required and prefixes children.** Make it unique on the page — two cards sharing an id give two header rows and two option rows the same id.
- **Maintain exactly one `selected: true`.** Nothing asserts it.
- **Never pass both `options` and `expandedContent`.** It asserts at build time, not construction time, because an emptiness check is not a compile-time constant.
- **Slug collisions are real.** An option id is composed from a slug of the label that keeps only ASCII letters and digits. A label with none — a CJK or Cyrillic country name — slugs to a fixed fallback, so two such rows in one card get **identical ids**. Pass an explicit `automationIdentifier` on any option whose label is not ASCII. See [Open Items](#open-items) item 2.
- **Give the card a bounded parent** or an explicit `width`. The default is an infinite width.
- **Do not zero the header's content padding.** The 12pt inset lives inside the hover fill.
- **Pass `null`, never `''`,** to omit an optional text slot.
- **Everything inside `expandedContent` needs its own `automationIdentifier` and accessible name.** The card contributes nothing in there.
- **Do not put a scroll view or a second disclosure inside the reveal.**
- The widgetbook playground for this component is built from raw Flutter form controls rather than widgetbook knobs, so its state does not appear in the knob panel — the same inconsistency as [[Cards]].

---

## Rules

1. `options` and `expandedContent` MUST NEVER both be supplied. They fill the same region and the combination asserts.
2. Exactly one option MUST be selected. The component does NOT enforce it.
3. The option rows MUST NOT be rebuilt by hand inside `expandedContent` — that discards the group announcement, the checked state, the insets, and the composed ids.
4. `automationIdentifier` is required and MUST be unique on the page, because it prefixes the header and every option row.
5. Any option whose label contains no ASCII letters or digits MUST be given an explicit `automationIdentifier` — the composed slug collides.
6. A card with nothing to reveal MUST NOT be given a chevron. The component removes it, and that behaviour MUST NOT be worked around.
7. The section title MUST NOT restate the header title. The header is the current value; the section is the setting.
8. The section description MUST read as steady-state copy — it is permanently visible, not an on-open hint. Two sentences at most.
9. Option labels MUST be nouns, never commands.
10. Optional text slots MUST be omitted with `null`, NEVER with `''`. Each asserts non-empty.
11. The reveal MUST hold between two and five options. Above five, use [[Menu]] or a picker.
12. A [[Cards]] card MUST NEVER be nested inside the panel or the custom-content slot.
13. A second disclosure MUST NEVER be placed inside the reveal.
14. A scroll view MUST NEVER be placed inside the reveal.
15. Everything inside `expandedContent` MUST carry its own accessible name and `automationIdentifier`.
16. The header's content inset MUST stay at 12. It lives inside the hover fill and is the cushion between the fill edge and the content.
17. The card MUST have a bounded parent or an explicit `width` — the default width is infinite.
18. The card MUST NOT be placed in a fixed-height container.
19. Several of these MUST NOT be stacked on a page. Use [[Accordion]].
20. The Windows state strings MUST NOT be "corrected" — each names the state the toggle leads to, which is what produces the right announcement.

---

## Open Items

1. **Nothing enforces the single-select invariant.** `options` accepts any number of rows with `selected: true`, including none, and each selected row announces as the checked member of a mutually exclusive group. Two checked members of one exclusive group is a contradiction that assistive technology will report faithfully. The component asserts on six separate string emptiness conditions and on the two-slot exclusivity, so the assert convention is clearly established here — this is the one invariant it omits, and it is the most consequential.
2. **The option automation-id slug collides on non-ASCII labels.** The slug keeps only ASCII lowercase letters and digits, collapses everything else to a dash, and falls back to a fixed literal when nothing survives. So two options labelled in a non-Latin script produce **identical** ids, directly contradicting the implementation's own stated purpose for the slug — that rows in a list never collide on a shared default. Accented Latin degrades too. The reference usage is **VPN country names**, which is exactly the data most likely to be non-ASCII once localised. Either the slug should fall back to the row index or the id should be required per option.
3. **No high-contrast branch.** The panel is distinguished from the card by a **1.12 : 1** fill difference, which is under the 3 : 1 floor in WCAG 1.4.11 in both themes. In a forced-colours theme that collapses the surface ramp, the panel disappears entirely and the card becomes one undifferentiated block. The selected check glyph reads from `secondary`, which is also not remapped. Same defect class as [[Status Indicators]] open item 9.
4. **No reduced-motion branch.** The 200ms reveal animation runs unconditionally. [[Accordion]] has the identical gap — same duration, same curve, same missing check — while the arc chart in this same package *does* branch on the platform setting. So the capability exists in the codebase and the two disclosure components are the ones that skipped it.
5. **The component has no consumers.** It ships public, exported, story-covered, and used by nothing in the repository. It is the newest component in the set, so this may simply be a matter of timing — but it means the two-slot model, the read-only/disabled distinction, and the slug composition have never been exercised against real product data, including the country names in item 2.
6. **The Figma frame is named `blank_card` / `expanded_card`** while the widget is `AsmExpandedCard` and the doc name is Expanded Card. `blank_card` names the collapsed state and reads as a placeholder rather than a component state, which makes the design source hard to search. The `expanded_slot` frame that defines the option rows has a third naming convention again.
7. **The option rows' 16pt radius is inherited, not set.** The implementation's documentation states the rows have a 16pt radius; the value is actually set by the list feature row it delegates to. It happens to be correct today, and it will silently change if that component's radius does. A documented value should be read from the same place it is painted.
8. **The implementation cites two rule files that do not exist in this checkout.** The reasoning for keeping the summary out of the tab order, and the reasoning for reporting the option row's semantics on the tap node rather than a wrapping node, both cite numbered rule documents; only the release rule file is present. Both arguments are correct and worth preserving, but neither citation can be followed. The same stale citations appear in `peek_label.dart` — see [[Peek Label]] open item 13.
9. **The `expandedContent` slot is unbounded and unvalidated.** Nothing prevents a nested card, a nested disclosure, or a scroll view inside it, all three of which break the component. It also receives no `Semantics` wrapper, no automation-id prefix, and no decorative exclusion, so the escape hatch's accessibility contract is entirely conventional. The one worked example — in the widgetbook story — is correct, and it is the only place the convention is recorded.
10. **`expanded` and `onExpansionChanged` are required but ignored in one valid configuration.** With no reveal content, both are read and discarded. A required parameter that is sometimes a no-op is a confusing API surface: a caller has to pass a state value and a handler for a card that will never toggle. Either the no-reveal case wants a separate constructor or the two parameters want to be optional.
11. **The two-slot exclusivity is asserted at build time, not construction time**, because the emptiness check is not a compile-time constant. The implementation explains this clearly. The consequence is that the error surfaces on the first frame rather than at the call site, and only in a debug build — a release build renders the custom content and silently drops the options.
12. **The widgetbook playground uses raw Flutter form controls instead of widgetbook knobs**, so the card's state is invisible in the knob panel and cannot be deep-linked. [[Cards]] has the same problem; every other component's playground uses knobs.
13. **The card is 1.12 : 1 against its own panel and the panel carries no shadow or border**, so the only things making the panel legible as a distinct region are the 20pt gap above it and the 24pt radius. Both are geometry that survives a contrast theme, which is why the card holds together at all — but neither is a documented decision. If the gap is ever tightened for density, the panel stops reading as a panel.
14. **No `Semantics(container: true)` around the card as a whole.** The header is a named button and the option rows are named group members, but there is no node grouping them, so a screen-reader user moving item by item passes from the header of one card into the panel of the same card with no boundary announced. [[Cards]] has the same gap at the surface level — see [[Cards]] open item 12 — and this component is where it would matter most, because a page could hold several of these.
