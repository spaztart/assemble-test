# Component: Accordion

> Role: Progressive disclosure for a vertical list of collapsible sections. Reveals content in place; never navigates.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: NEVER hide content a user needs to complete their task. An accordion is for secondary detail, not for shortening a page.
> Source: Figma `Components` → `Accordion` (node `9900-5191`). Implementation: `pegasus_flutter/lib/asm/components/accordion.dart`.

## Overview

An accordion is a stack of rows, each with a header the user activates to reveal content beneath it. It trades immediate visibility for a shorter page.

**That trade is the whole decision.** Collapsed content is content most users will never see — clicking to reveal is a real cost, and most people don't pay it. So an accordion is correct when the content is genuinely secondary (an FAQ answer, an advanced setting, supporting detail) and wrong when it is something the user came to do.

The canonical correct use is an FAQ: many short sections, the user wants one, scanning headers is faster than scrolling prose.

**An accordion reveals; it does not navigate.** The content appears in place, below the header, and the page grows. If activating a row takes the user elsewhere, that's a list of links.

## Anatomy

```
┌──────────────────────────────────────────────────┐
│  ◇   Section title                          ⌄    │  ← header (interactive)
└──────────────────────────────────────────────────┘
   ↑         ↑                                 ↑
 leading   title                            chevron
  icon    (required)                     (rotates when open)
 (optional)

┌──────────────────────────────────────────────────┐
│  ◇   Section title                          ⌃    │  ← expanded: chevron flipped
├──────────────────────────────────────────────────┤
│                                                  │
│   Revealed content                               │  ← body
│                                                  │
└──────────────────────────────────────────────────┘
      ↑ whole row tinted while open, framed by a border
```

| Part | Required | Notes |
| --- | --- | --- |
| **Header** | Yes | The entire row is the interactive target — not just the chevron. |
| **Title** | **Yes** | Non-empty, always visible. 18px bold. |
| **Chevron** | Yes | Always present, always trailing. Rotates 180° when open. Decorative. |
| **Leading icon** | No | Before the title. Decorative. |
| **Body** | Yes | Revealed content. Only in the DOM of the layout when open. |
| **Container** | — | 12px radius. Border and tint appear conditionally — see [Behaviors](#behaviors). |

**The whole header is the target, not the chevron.** A user who clicks the title expects it to open. Never make the chevron the only hit area.

**The chevron is always present**, in both states, and is the only universal signal that a row is expandable. Its rotation is what communicates open vs. closed. Never remove it, and never substitute a plus/minus without changing it in both states.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Header padding | 16 all sides | `md.spacing.400` |
| Body padding | 16 all sides | `md.spacing.400` |
| Icon-to-title gap | 8 | `md.spacing.200` |
| Title-to-chevron gap | 8 | `md.spacing.200` |
| Corner radius | 12 | `md.border.radius.*` |
| Border width | 1 | `md.border.size.100` |
| Gap between rows | 8 | `md.spacing.200` |
| Icon size | 24 | — see [Open Items](#open-items) |
| Title style | 18 bold | `title.medium` emphasized |
| Body style | 16 regular | `body.large` |

The header has no fixed height — it's padding plus the title's line box, which puts a single-line row at roughly 59px. That comfortably clears the 48×48 touch minimum and grows rather than clips as text scales.

## Types

Two types, differing **only in background fill**. Both use the same border, radius, spacing, and behavior.

| Type | Fill | Use on |
| --- | --- | --- |
| **white** | `surface-bright` | Tinted or gray page backgrounds — the row reads as a raised card |
| **gray** | `surface` | White page backgrounds — the row reads as a recessed card |

The choice is driven entirely by what's behind it: pick the type that **contrasts** with the page background. `white` on a white page has no edge to define it, and `gray` on a gray page is equally invisible. This is the only decision the type axis carries.

All rows in one accordion share a type.

## States

Accordions follow [[States]], with the header as the interactive element. The state role is `neutral`.

| State | Border | Fill |
| --- | --- | --- |
| Closed, idle | **None** | Type's base fill |
| Hover | `outline-variant`, 1px | Base fill |
| Pressed | `outline-variant`, 1px | Base fill |
| Focus | Base (no change) | Base fill, plus [focus ring](#the-focus-ring) |
| **Expanded** | `outline-variant`, 1px | Base fill + neutral tint |
| Disabled | None | Base fill, title at 38% |

Two things here diverge from the usual pattern and are worth stating plainly:

**A closed idle row has no border.** The frame is a state signal, not a container edge — it appears on hover, press, and expansion. This is deliberate per the design. The border footprint is nonetheless always reserved, so toggling it never reflows the row.

**Expanded is a state, and it tints the whole row** — header and body together — so an open row reads as one continuous card rather than a header with something stuck beneath it. The border frames the whole row for the same reason.

### The focus ring

The header takes the branded focus ring from [[States]] — 2px `primary`, keyboard-only, following the row's 12px radius. Note that focus does **not** add the `outline-variant` border, so a focused-but-not-hovered closed row shows the ring against an unframed row. That's correct: the ring is the focus signal, and the border is a hover/press/open signal.

### Disabled

A row is disabled by removing its expansion handler. The title drops to 38%, the row leaves the tab order, is announced as disabled, and shows no border on hover.

**Prefer not rendering a row over disabling it.** A disabled accordion row is unusual and rarely what's wanted — if the section has no content, omit it. If the content exists but is gated, an enabled row explaining why is more useful than a dead one.

Hover and press are cleared if a row becomes disabled mid-interaction, so a row disabled while the cursor sits on it drops its border rather than keeping a stale frame.

## Behaviors

**Rows are independent by default.** Any number can be open at once. **Single-open mode** — opening one closes the others — is opt-in.

Choose single-open when the content is long enough that two open rows make the page hard to scan, or when the sections are alternatives. Choose multi-open when a user might reasonably want to compare two sections, which is most of the time. **When in doubt, allow multiple** — closing something the user opened deliberately is worse than a long page.

**The expansion is animated, 200ms, eased.** The row grows to fit its content; the chevron rotates over the same interval. This matters: an instant jump makes the page feel like it navigated rather than expanded.

**The accordion does not own its scroll position.** Opening a row below the fold grows the page without scrolling to it. If a row's content is tall enough that this is disorienting, the surrounding layout is responsible for scrolling it into view.

**Content is not rendered while closed.** A closed row has no body in the layout, so nothing inside a closed row can be measured, focused, or announced.

**Height is content-driven.** No fixed heights anywhere — rows grow with text scale rather than clipping.

**Rows can start open.** Opening the first row by default is a reasonable way to show the user what the pattern does, particularly in an FAQ. Don't open all of them; that defeats the component.

## Content

**Titles must stand alone.** A user scanning only headers should be able to find what they want. "Billing" is weaker than "How do I change my payment method?" — in an FAQ, the question *is* the title.

- Non-empty, always. Enforced.
- Front-load the distinguishing word. Rows are scanned vertically, and the first word does most of the work.
- Keep titles parallel in structure across rows.
- Titles wrap rather than truncate. If a title needs two lines, that's fine; if every title needs two lines, they're too long.

**Bodies should be short.** An accordion body holding several paragraphs, its own headings, and a form is a page pretending to be a row. If the content is that substantial, it belongs on a page, in a [[Modal]], or in a [[Sheets|sheet]].

**Never nest an accordion inside an accordion.** Two levels of collapse means the user must guess twice about where something is. Flatten the hierarchy or move the second level to its own surface.

## Decision Tree

```
Does activating the row REVEAL content in place, or GO somewhere?
├── GO somewhere ────────────────────────────→ a list of links, not an accordion
└── REVEAL in place
    │
    ├── Is the content needed to complete the current task?
    │   └── yes ───────────────────────────────→ show it. Do not collapse it.
    │
    ├── Is there exactly one collapsible section?
    │   └── yes ──→ a single show/hide toggle is simpler than an accordion.
    │               If it needs to sit on its own card with a header row and
    │               a titled panel, that is [[Expanded Card]].
    │
    ├── Is the content long-form, or does it need focus?
    │   └── yes ──→ a page, a [[Modal]], or a [[Sheets|sheet]]
    │
    ├── Is the content a set of choices?
    │   └── yes ──→ [[Tabs]] (parallel views) or a [[Menu]] (pick one)
    │
    └── Many short, secondary, independently-interesting sections?
        └── ACCORDION
            │
            ├── Pick the type by page background:
            │   ├── page is tinted / gray ──→ white
            │   └── page is white ──────────→ gray
            │
            └── Pick the open behavior:
                ├── sections are alternatives, or content is long → single-open
                └── user may want to compare sections ────────────→ multi-open
```

**Accordion vs. [[Tabs]]:** tabs show one of several *peer views* and keep the page height fixed; an accordion reveals *supporting detail* and grows the page. If the sections are equal-weight alternatives the user switches between, use tabs.

**Accordion vs. [[Expanded Card]]:** both disclose in place and both rotate an arrow to say so. The accordion is a *list* of sections, self-managing its open state, on a bare row with no card. The expanded card is a *single* card — a header row above one titled panel — with its open state owned entirely by the caller, and it is the right choice when the disclosure needs a card of its own and a summary line the user reads before deciding to open it. If you find yourself putting one accordion item inside a card, you want the expanded card.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announceable name** | The visible title. Required, non-empty. |
| **Button role** | Each header is announced as a button. |
| **Open/closed announced** | Expansion state is exposed, so screen readers say "collapsed" / "expanded". |
| **Keyboard activation** | Enter, Space, Numpad Enter toggle the row. |
| **Tab-reachable** | Each header is a tab stop. Disabled rows are skipped. |
| **Visible focus** | Branded 2px `primary` ring, keyboard-only. |
| **Touch target** | ~59px header, above the 48×48 floor; grows with text scale. |
| **Disabled announced** | Announced as disabled and removed from the tab order. |
| **Decorative icons silenced** | Chevron and leading icon are hidden from assistive tech. |
| **Automation identifier** | Required per row. |

**Open/closed state is the accessibility requirement most often missed.** A header announced as a button with no expansion state leaves a screen-reader user unable to tell whether activating it will open or close. It's handled here — don't defeat it by adding your own semantics wrapper.

**The chevron is silenced deliberately.** Its meaning is already carried by the announced expansion state, so announcing it would duplicate that in a less useful form.

**Tab order is one stop per header, not per row.** Content inside an open row joins the tab order after that row's header and before the next one — which is the correct order, and another reason not to put complex interactive content inside a row.

**Automation identifiers must be unique per row.** When rows are generated from data, compose the identifier from a stable per-row field (a title slug, an ID) so it survives reordering. A shared constant across rows makes individual rows impossible to target. See [[Button]] for the three-string-slots distinction between visible title, announced label, and automation identifier.

## Anti-Patterns

**❌ Hiding task-critical content.** The most damaging misuse — most users never open a collapsed row. → If they need it, show it.

**❌ Using an accordion to shorten a long page.** The page is still long; the content is now also hidden. → Cut content, or split it across pages.

**❌ Only the chevron is clickable.** → The whole header is the target.

**❌ Removing the chevron.** It's the only affordance indicating the row expands. → Keep it in both states.

**❌ Nesting accordions.** → Flatten, or move the inner level to its own surface.

**❌ A single-row accordion.** The pattern implies a set. → Use a plain show/hide toggle.

**❌ All rows open by default.** → Open at most one.

**❌ Complex interactive content inside a row.** Forms and tables inside a collapsed row create tab-order and measurement problems. → Use a page, [[Modal]], or [[Sheets|sheet]].

**❌ Vague titles.** "More", "Details", "Other" don't survive scanning. → Make the title say what's inside.

**❌ Matching the type to the page background.** `white` on white, or `gray` on gray, leaves the row with no visible edge. → Contrast with the background.

**❌ Mixing types within one accordion.** → All rows share a type.

**❌ Using an accordion where the content navigates.** → A list of links.

**❌ A shared automation identifier across generated rows.** → Compose from a stable per-row field.

**❌ Disabling rows routinely.** → Omit the row, or leave it enabled and explain inside.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. Two widgets from `pegasus_flutter/lib/asm/components/accordion.dart`:

- **`AsmAccordion`** — a managed group. Handles open/closed bookkeeping. **Use this by default.**
- **`AsmAccordionItem`** — a single controlled row. Reach for it only when you need to own the open state yourself.

```dart
enum AsmAccordionType { white, gray }
```

### Basic usage — the managed group

```dart
AsmAccordion(
  type: AsmAccordionType.gray,
  singleOpen: true,
  initialOpenIndices: const {0},
  items: [
    AsmAccordionItemData(
      title: 'How do I change my payment method?',
      content: const Text('Open Settings, then Billing…'),
      automationIdentifier: 'faq-change-payment-accordion',
    ),
    AsmAccordionItemData(
      title: 'When am I billed?',
      content: const Text('On the same day each month…'),
      automationIdentifier: 'faq-billing-date-accordion',
    ),
  ],
);
```

`AsmAccordion` owns which rows are open, so nothing needs to be held in your own state.

### With leading icons

```dart
AsmAccordion(
  type: AsmAccordionType.white,
  items: [
    AsmAccordionItemData(
      title: 'Device protection',
      leadingIcon: Icons.shield_outlined,
      content: const Text('…'),
      automationIdentifier: 'settings-device-protection-accordion',
    ),
  ],
);
```

`leadingIcon` is an `IconData`, not a widget — the size and color are applied for you.

### Generated rows

```dart
AsmAccordion(
  type: AsmAccordionType.gray,
  items: faqs
      .map((faq) => AsmAccordionItemData(
            title: faq.question,
            content: Text(faq.answer),
            automationIdentifier: 'faq-${faq.slug}-accordion',
          ))
      .toList(),
);
```

Note the identifier composes from `faq.slug` — a stable per-row field. A shared constant here would make individual rows untargetable.

### A single controlled row

Use `AsmAccordionItem` directly only when the open state must live in your own state — for example, when opening a row is driven by something outside the accordion:

```dart
class _MyPanelState extends State<MyPanel> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    return AsmAccordionItem(
      title: 'Advanced settings',
      type: AsmAccordionType.gray,
      expanded: _open,
      onExpansionChanged: (open) => setState(() => _open = open),
      automationIdentifier: 'advanced-settings-accordion',
      child: const Text('…'),
    );
  }
}
```

**`AsmAccordionItem` is fully controlled** — it does not track its own open state. Passing a constant `expanded` with a no-op handler produces a row that appears interactive and does nothing.

### Disabling a row

```dart
AsmAccordionItem(
  title: 'Unavailable section',
  expanded: false,
  onExpansionChanged: null, // null = disabled
  automationIdentifier: 'unavailable-accordion',
  child: const SizedBox.shrink(),
);
```

`onExpansionChanged: null` is how a row is disabled. Note this is only reachable through `AsmAccordionItem` — `AsmAccordion` wires a handler for every row, so a managed group cannot contain a disabled row.

### `AsmAccordion` parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `items` | `List<AsmAccordionItemData>` | **Yes** | — |
| `type` | `AsmAccordionType` | No | `white` |
| `singleOpen` | `bool` | No | `false` |
| `initialOpenIndices` | `Set<int>` | No | `{}` |
| `spacing` | `double?` | No | `null` → 8 |

### `AsmAccordionItemData` parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `content` | `Widget` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `leadingIcon` | `IconData?` | No | `null` |
| `semanticLabel` | `String?` | No | `null` (inherits `title`) |

### `AsmAccordionItem` parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `title` | `String` | **Yes** | — |
| `expanded` | `bool` | **Yes** | — |
| `onExpansionChanged` | `ValueChanged<bool>?` | **Yes** | — (`null` = disabled) |
| `child` | `Widget` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `leadingIcon` | `IconData?` | No | `null` |
| `type` | `AsmAccordionType` | No | `white` |
| `semanticLabel` | `String?` | No | `null` (inherits `title`) |

### Guidance

- **Prefer `AsmAccordion`.** Hand-managing a set of `AsmAccordionItem`s reimplements the bookkeeping it already does, including single-open.
- **`initialOpenIndices` is seeded once**, at first build. Changing it later does not reopen rows — it is an initial value, not a controlled one. Use `AsmAccordionItem` if you need to drive open state from outside.
- **Out-of-range indices in `initialOpenIndices` are dropped silently**, so a stale index won't throw.
- **With `singleOpen: true`, only the lowest index in `initialOpenIndices` is honored** — the rest are discarded without warning.
- **Never set `size:` or `color:` on `leadingIcon`** — it's `IconData`, so there's nothing to override.
- **Never wrap a row in your own `Semantics`** — the button role, expansion state, and identifier are wired. A second wrapper can produce a nameless tap target.
- **Never wrap a row in `GestureDetector`** to add behavior; it creates a competing tap target.
- **Don't put a `Column` of unbounded height in `content`** — it's laid out inside an animated size box, so give tall content its own bounded scroll region or, better, move it off the accordion.
- `AsmAccordion` takes no `automationIdentifier` of its own — identifiers live on the items.

---

## Rules

1. NEVER collapse content the user needs to complete their task.
2. An accordion REVEALS in place. A row that navigates MUST be a link instead.
3. The ENTIRE header is the interactive target — never the chevron alone.
4. The chevron MUST be present in both states and MUST rotate to signal open/closed.
5. Titles MUST be non-empty and MUST make sense when scanned without their content.
6. Pick the type that CONTRASTS with the page background — `white` on tinted, `gray` on white.
7. All rows in one accordion MUST share a type.
8. NEVER nest an accordion inside an accordion.
9. Open AT MOST one row by default.
10. NEVER use an accordion for a single section — use a show/hide toggle.
11. Long-form or focus-demanding content MUST go on a page, in a [[Modal]], or in a [[Sheets|sheet]] — NEVER in a row.
12. Multi-open is the default; single-open MUST be chosen ONLY when sections are alternatives or content is long.
13. Every row MUST carry a stable, UNIQUE automation identifier composed from a per-row field.
14. NEVER add a semantics or gesture wrapper around a row.
15. Expansion state MUST be announced to assistive technology.
16. A row that cannot be opened SHOULD be omitted rather than disabled; NEVER disable a row without a visible reason.
17. NEVER hardcode padding, radius, or color — all come from tokens.

---

## Open Items

1. **Icon size 24 is a hardcoded literal.** Both the chevron and the leading icon are sized with a raw `24` rather than a token. No icon-size token exists in the system, which is the underlying gap — the same one flagged in [[Icons]]. Until it exists, every component repeats the literal.
2. **The expanded tint reuses the `focus` state token.** An open row is tinted with `md.sys.state.neutral.focus`, matching Figma's `state=selected` variant. Using the *focus* token to express *selection* means a future change to focus opacity would silently change how open rows look. [[States]] treats selected as a separate axis; there is no `selected` state token to use instead. Either one should be added, or this should be documented as a deliberate alias.
3. **No `selected` state role exists** for the case above, and none of the four documented roles (`primary`, `secondary`, `neutral`, `error`) covers selection. Related to the missing `critical` role noted in [[States]].
4. **The closed idle row has no border**, which is a divergence from how most container components read. It's intentional per design, but it means a closed accordion has no visible edge at all beyond its fill — and with a type that doesn't contrast with the page, no visible presence. Worth confirming the design intends rows to be invisible-until-hovered on a matching background.
5. **`AsmAccordion` cannot express a disabled row.** It wires a handler for every item, so disabling is only reachable via `AsmAccordionItem`. If disabled rows are a real requirement, `AsmAccordionItemData` needs an `enabled` flag.
6. **`initialOpenIndices` silently discards input** in two cases: out-of-range indices, and every index but the lowest when `singleOpen` is true. Silent is defensible for the stale-index case and questionable for the second — a caller passing `{0, 2}` with `singleOpen` gets row 0 and no indication that row 2 was dropped.
7. **Border width uses a raw `1`.** `Border.all` is constructed without a width argument, taking Flutter's default of 1.0 rather than `md.border.size.100`. Same drift as the `outline` variant in [[Button]].
8. **Animation duration 200ms is a literal**, repeated in two places (the size animation and the chevron rotation). No motion tokens exist in the system — a broader gap than this component. [[Expanded Card]] repeats the same literal for the same reveal, so the number now appears in three places across two components. The gap is now documented from five components in total: both charts write their own durations, and [[Navigation Rail]] writes two more (a fill crossfade and a press scale) with an explicit in-source note to replace them when a motion token lands ([[Navigation Rail]] open item 24). It has stopped being a component-level finding and should be promoted to a Foundations one.
9. **Figma has no `focus` variant.** As with [[Button]], the component set covers default, hover, pressed, selected, and disabled. Focus is implemented only in code and can't be verified against design.
10. **No scroll-into-view behavior.** Opening a row near the bottom of a scroll region grows the page without revealing the content. Whether the component should handle this or the layout should is unspecified.
11. **The header has no explicit minimum height.** It clears 48px through padding plus line height (~59px), so the touch target is satisfied in practice — but nothing enforces it. A future change to header padding or title style could drop it below the floor without any test catching it.
12. **Neither the size animation nor the chevron rotation checks for reduced motion.** Both run unconditionally. `MediaQuery.maybeDisableAnimationsOf` is available and *is* honoured by [[Data Arc Chart]] and [[Data Linear Chart]], so the pattern exists in the system and this component does not use it. [[Expanded Card]], which was built from this component, has the identical gap and the identical 200ms literal — so the fix belongs in both files at once.
