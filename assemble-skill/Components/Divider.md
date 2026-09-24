# Component: Divider

> Role: A thin line that separates content within a region. Decorative structure only — it carries no meaning of its own.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A divider is NEVER the only signal that two regions differ. Separate with [[Spacing]] first; add a divider only when spacing alone is ambiguous.
> Source: Figma `Components` → `Divider` (node `8-265`). Implementation: `pegasus_flutter/lib/asm/components/divider.dart`.

## Overview

A divider is a 1px horizontal line in a low-contrast outline color. It marks a boundary between two blocks of content.

**The distinction most often got wrong is divider versus spacing.** Spacing groups content; a divider asserts a boundary. Reaching for a divider between every item in a list produces a ruled ledger, which is heavier than the content usually warrants and makes the real structural boundaries indistinguishable from the incidental ones.

The order to try is: **spacing → heading → divider.** If increasing the gap makes the grouping clear, stop there. If the reader needs a name for the group, add a heading. Add a divider only when neither resolves the ambiguity — typically when two same-weight blocks sit adjacent with no room to separate them.

A divider is **decorative**. It has no label, no interaction, no states, and conveys nothing to a screen reader. Everything it communicates is visual, which is why it can never be the sole carrier of structure.

## Anatomy

```
   Content above
                      ← space above (from `height`, or from layout)
   ─────────────────   ← the line: 1px, outline-variant
                      ← space below
   Content below


   With indents:

   Content above
   ┆        ┆                         ┆     ┆
   ┆  ──────────────────────────────  ┆
   ┆        ┆                         ┆     ┆
    indent                          endIndent
```

| Part | Required | Notes |
| --- | --- | --- |
| **Line** | Yes | 1px by default, `outline-variant`. The whole component. |
| **Vertical extent** | — | Total height the divider claims. Defaults to the line thickness — no extra space. |
| **Indents** | No | Space before the leading edge and after the trailing edge. |

**By default the divider claims no space beyond the line itself.** Its total vertical extent equals its thickness, so a divider dropped between two widgets sits flush against both. The breathing room around it comes from the surrounding layout unless you ask the divider to reserve it.

That default is the right one — it keeps spacing decisions in one place ([[Spacing]]) rather than splitting them between the layout and the divider. But it means a divider added without adjusting the layout will look cramped.

### Geometry

| Property | Default | Token |
| --- | --- | --- |
| Thickness | 1 | `md.border.size.100` |
| Vertical extent | Equal to thickness | — |
| Color | `outline-variant` | |
| Indents | None | Should come from the [[Spacing]] scale |

`outline-variant` is the lower-contrast of the two outline roles — deliberately quiet. A divider is not meant to be read; it is meant to be noticed peripherally. It resolves correctly in both light and dark themes.

## Behaviors

**A divider is always horizontal and always full-width** within its parent, minus any indents. There is no vertical variant — see [Open Items](#open-items).

**It has no states.** No hover, no focus, no press, no disabled. A divider is not interactive, and wrapping it in a tap handler creates a control with no accessible name.

**Thickness, extent, indents, and color are all overridable**, and each override should be justified. The defaults are correct for the ordinary case:

- **Thickness** — override only to a step on the border-width scale, never a raw number. A thicker divider reads as a stronger boundary; use it for a genuine section break, not decoration.
- **Color** — overriding is almost always wrong. It bypasses the theme, so a hardcoded line color will be invisible or harsh in the other mode. The legitimate case is a divider on a colored surface where `outline-variant` doesn't have contrast.
- **Indents** — the common use is a list where dividers should align with the text rather than the container edge, so the divider starts where the label starts and skips the leading icon.

**Indents must come from the [[Spacing]] scale.** An indent chosen to visually align with a leading icon is a hardcoded number that breaks when the icon size changes. Derive it from the same tokens the row's padding uses.

**No motion.** A divider appears and disappears with the content around it.

## Decision Tree

```
Do two adjacent blocks of content need to read as separate?
├── no ─────────────────────────────────────────→ no divider
└── yes
    │
    ├── Would MORE SPACE make it clear?
    │   └── yes ───────────────────────────────→ [[Spacing]], no divider
    │
    ├── Does the second block need a NAME?
    │   └── yes ───────────────────────────────→ heading (+ spacing), no divider
    │
    ├── Is one block a distinct surface, not just a section?
    │   └── yes ───────────────────────────────→ a card or [[Accordion]] — a
    │                                              bounded container, not a line
    │
    └── Same weight, adjacent, no room to space apart
        └── DIVIDER
            │
            ├── Aligning with text, not the container edge?
            │   └── yes → set indents from the [[Spacing]] scale
            │
            ├── Need room around the line?
            │   └── yes → prefer layout spacing; set the divider's
            │             extent only when the layout can't provide it
            │
            └── A major section break, not a row separator?
                └── yes → a thicker step from the border-width scale
```

**Divider versus a bounded container** is the second boundary worth checking. If the content on one side is a distinct thing — a group with its own background, its own padding, its own affordances — a line between them under-describes it. Use a container.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Announced as a separator** | Exposed with the separator role, no label. |
| **Not announced as content** | It has no text; nothing is read. |
| **Not focusable** | No tab stop. |
| **Theme-aware contrast** | `outline-variant` resolves per theme. |
| **Structure conveyed non-visually** | **Not met by the divider** — see below. |

**A divider conveys nothing to a screen reader beyond "separator".** It has no name, so a user navigating by voice hears an unnamed boundary with no indication of what changed. That's acceptable *if* the real structure exists elsewhere — headings, grouped labels, list semantics. It is not acceptable if the divider is the only thing marking the boundary.

This is the reason for the banner rule. A screen full of dividers and no headings is a screen with no structure for a non-visual user, however clear it looks.

**A divider is not a heading.** If a divider introduces a new section, that section needs a heading, and the heading is what carries the structure. The divider is a visual reinforcement of a boundary the semantics already declare.

**Never wrap a divider in something interactive.** A tappable divider is a control with no accessible name and no visible affordance.

## Anti-Patterns

**❌ A divider between every item in a list.** Produces a ruled table and flattens the real boundaries. → Spacing between items; a divider only at genuine section breaks.

**❌ A divider where more spacing would do.** → [[Spacing]] first.

**❌ A divider as the only signal that a new section started.** Invisible to assistive tech. → Add a heading; keep the divider as reinforcement.

**❌ A divider standing in for a container.** A distinct surface needs bounds, background, and padding. → A card or [[Accordion]].

**❌ A hardcoded color.** Bypasses the theme — harsh in one mode, invisible in the other. → Let it default to `outline-variant`.

**❌ A raw thickness number.** → A step from the border-width scale.

**❌ Indents chosen by eye to line up with an icon.** They break when the icon changes. → Derive from the same [[Spacing]] tokens as the row's padding.

**❌ A divider immediately below a heading.** The heading already opened the section; a line under it reads as an underline. → Space below the heading.

**❌ Two dividers with only spacing between them.** → One divider, or none.

**❌ A divider wrapped in a tap handler.** → Dividers are decorative and never interactive.

**❌ A divider as the top or bottom edge of a region.** That's a container's border. → Give the container a border.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmDivider`, from `pegasus_flutter/lib/asm/components/divider.dart`.

`AsmDivider` is a thin wrapper over Flutter's `Divider` that applies the Assemble default thickness and color. Every parameter is optional.

### Basic usage

```dart
const AsmDivider();
```

1px, `outline-variant`, full width, claiming no vertical space beyond the line. This is the case you want almost always.

### With spacing around it

```dart
Column(
  children: [
    const SectionA(),
    const SizedBox(height: AsmSpacingScale.s400),
    const AsmDivider(),
    const SizedBox(height: AsmSpacingScale.s400),
    const SectionB(),
  ],
);
```

Prefer providing space in the layout, so the gap is visible in the same place as every other gap. The alternative is `height`, which folds the space into the divider:

```dart
// Same result, but the spacing is now invisible to anyone reading the Column.
const AsmDivider(height: AsmSpacingScale.s800);
```

`height` is the divider's **total vertical extent including the line**, not the space on each side. It defaults to the resolved thickness.

### Indented to align with text

```dart
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (context, i) => AsmDivider(
    // Aligns the line with the label, skipping the leading icon.
    // Derived from the row's own geometry, not a literal that happens to fit.
    indent: AsmSpacingScale.s400 // row's leading padding
        + kListRowIconSize        // the icon column
        + AsmSpacingScale.s400,   // gap between icon and label
  ),
  itemBuilder: (context, i) => ListRow(item: items[i]),
);
```

Derive the indent from the same tokens the row uses for its leading-icon column. A literal that happens to line up today will not line up after an icon-size change.

Note that `ListView.separated` puts a divider between *every* row — that's the ruled-list anti-pattern above. It's correct for a dense data list where each row is a discrete record; it's wrong for a settings list where spacing and headings do the grouping.

### Thicker, for a major section break

```dart
const AsmDivider(thickness: AsmBorderWidths.w200);
```

Always a named step from `AsmBorderWidths`, never a number.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `thickness` | `double?` | No | `AsmBorderWidths.w100` (1) |
| `height` | `double?` | No | Equal to the resolved thickness |
| `indent` | `double?` | No | `null` (none) |
| `endIndent` | `double?` | No | `null` (none) |
| `color` | `Color?` | No | `colorScheme.outlineVariant` |

There is no `variant`, `size`, `automationIdentifier`, or orientation parameter.

### Guidance

- **Prefer `const AsmDivider()` with no arguments.** Every override needs a reason.
- **`thickness` takes an `AsmBorderWidths` value**, never a literal. The class doc says this explicitly.
- **Prefer layout spacing over `height`.** A `height` on the divider hides a spacing decision inside a component.
- **`indent` and `endIndent` must come from [[Spacing]] tokens.**
- **Don't pass `color`.** It defaults to a theme-aware role; a literal breaks dark mode. If a colored surface needs a different line, that's a token question, not a call-site one.
- **Don't wrap it in `GestureDetector` or `InkWell`.**
- **`VerticalDivider` is not part of Assemble.** If you need a vertical rule, see [Open Items](#open-items) — reaching for Flutter's `VerticalDivider` directly bypasses the token defaults.
- No `automationIdentifier` — it's decorative, so nothing needs to target it.

---

## Rules

1. Separate content with [[Spacing]] FIRST. Add a divider only when spacing and headings are insufficient.
2. A divider MUST NEVER be the only signal that a new section began — a heading MUST carry the structure.
3. NEVER put a divider between every item in a list unless each row is a discrete record.
4. NEVER hardcode the divider color. It MUST resolve from the theme.
5. Thickness MUST come from the border-width scale, NEVER a raw number.
6. Indents MUST come from the [[Spacing]] scale, NEVER a value chosen by eye.
7. Separation MUST come from layout spacing, NEVER from padding baked into the divider itself.
8. NEVER wrap a divider in a tap handler. It is decorative and non-interactive.
9. NEVER use a divider as a container's edge — that is a border.
10. NEVER place a divider directly beneath a heading.

---

## Open Items

1. **There is no vertical divider.** `AsmDivider` is horizontal only, and Flutter's `VerticalDivider` has no Assemble wrapper — so any vertical rule (between toolbar groups, beside a side panel, separating inline metadata) is built with a raw `Container` or an unwrapped `VerticalDivider`, both of which miss the token defaults. Whether Figma defines a vertical form is unconfirmed; the registry lists one `Divider` node.
2. **The default vertical extent may surprise callers.** Flutter's own `Divider` defaults `height` to 16, reserving space around the line; `AsmDivider` overrides it to the line thickness, so a divider claims no extra room. That's the better default for a token-driven system, but it means a developer who has used Flutter's `Divider` will find the Assemble one visually tighter, and nothing in the doc comment calls out the divergence from Flutter's default.
3. **`height` is a misleading name for the parameter's meaning.** It's the divider's total extent including the line, not the space around it, so `height: 8` on a 1px divider gives 3.5px above and below rather than 8. Inherited from Flutter, so not fixable here, but it's a reliable source of off-by-a-few spacing.
4. **`color` is exposed with no guidance on when overriding is legitimate.** The doc comment states the default but not that overriding breaks theme response. Given that a raw color is a tokens-only violation, the parameter arguably shouldn't be public.
5. **`indent` / `endIndent` are raw doubles with no token guidance**, unlike `thickness`, whose doc comment explicitly directs callers to `AsmBorderWidths`. The same steer toward the [[Spacing]] scale is missing.
6. **`outline-variant` versus `outline` is not documented as a decision.** The divider uses the lower-contrast role; [[Color]] should state which of the two outline roles applies to separators versus component borders, since [[Button]] and [[Accordion]] draw borders in different roles again.
7. **No Figma states, which is correct here** — a divider has none — but worth noting that this is the one component where the absence of a `focus` variant in Figma is not a gap.
8. **No inset variants are named.** Material defines `Divider`, `InsetDivider`, and `MiddleDivider` as distinct list treatments; Assemble expresses all three through raw indent values, so there's no shared vocabulary for "the indented one used in lists". A named inset step would stop every consumer picking their own.
