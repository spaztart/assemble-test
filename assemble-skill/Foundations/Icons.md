# Foundation: Icons

> Role: Defines the icon system — icon set, sizing, style axes, color, and usage rules.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define which icons to use, at what size, in what color, and when, and apply to any surface built on this design system. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: Icons are supplementary — NEVER use an icon as the sole means of conveying meaning.

## Icon Set

Assemble uses **Material Symbols (Outlined)** as its single icon set — aligned with the Material 3 language. Icons are referenced by name (e.g. `download`, `arrow_forward`, `shield`), never as bespoke assets.

Material Symbols is the **only** icon set. Never mix icon libraries, add a third-party icon pack, or introduce a one-off SVG. If a metaphor seems missing, choose the closest well-understood glyph in the library rather than drawing a new one — a consistent metric grid and optical alignment across the whole UI is worth more than an exact metaphor.

Brand marks, product logos, and illustrations are **not** icons and are out of scope for this foundation — they are assets, not library glyphs, and do not follow these rules.

## Style Axes

Material Symbols is a variable font with four axes. Assemble holds three constant and varies only size.

| Axis | Assemble setting | Notes |
| --- | --- | --- |
| Weight | **Default (400)** | Do not vary. This is the axis most likely to drift — hold it constant. |
| Fill | Unfilled by default; filled reserved for selected state | See [Outlined vs Filled](#outlined-vs-filled) |
| Grade | Default | Optical-correction axis, not a styling lever. |
| Optical size | Follows the rendered icon size | Not set independently. |

Only fill is expressive. Weight, grade, and optical size are correction axes — leave them at their defaults unless there is a specific optical problem to solve.

## Icon Sizes

Icon size aligns to the type scale and component proportions.

| Size label | Value | Usage |
| --- | --- | --- |
| Small | 16 | Button icons, input affordances, inline icons |
| Default | 20 | Standalone icons, dropdown/list items |
| Medium | 24 | Navigation, card headers, toolbar actions |
| Large | 40 | Feature icons, empty-state accents |
| XLarge | 48 | Hero icons, large empty states |

Guidance:

- Match icon size to the **type size it sits beside**, so optical weight reads as balanced — see the type steps in [[Typography]].
- Keep one icon size per component instance. A row of actions should not mix 16 and 20.
- Size the **glyph**, not the touch target. Pad around the icon to reach the minimum target (rule 6) rather than enlarging the glyph.
- Do not invent sizes outside this set to fine-tune a layout. If nothing fits, the surrounding layout is usually the problem.

## Icon–Component Pairing

| Component | Icon Size | Position |
| --- | --- | --- |
| button (small) | 16 | Leading or trailing |
| button (medium) | 16 | Leading or trailing |
| button (large) | 20 | Leading or trailing |
| input / text field | 20 | Leading or trailing |
| chip | 16 | Leading |
| badge | 16 | Leading |
| alert / banner | 24 | Leading |
| toast / snackbar | 20 | Leading |
| navbar item | 24 | Leading / top |
| sidebar item | 20 | Leading |
| dropdown item | 20 | Leading |
| avatar (icon) | 24 | Centered |

## Color

Icons inherit color from their context. Always drive color with a semantic token — never a raw value. See [[Color]].

| Context | Token |
| --- | --- |
| Default on surface | md.sys.color.on-surface |
| Secondary / muted | md.sys.color.on-surface-variant |
| Accent / interactive | md.sys.color.primary |
| Destructive / error | md.sys.color.error |
| Success | mcafee.color.extended.positive |
| Warning / attention | mcafee.color.extended.attention |
| On filled containers | the matching `on-*` token (e.g. on-primary) |

Additional constraints:

- Prefer inheriting color from the surrounding context where the component already establishes the right token; set it explicitly only when the icon must differ.
- An icon paired with text shares that text's color token, so the two read as one unit.
- Status icons use the extended status tokens rather than approximating with a palette color.
- **Never** encode meaning in color alone — a status icon must be distinguishable by glyph too.
- Disabled icons follow their component's disabled treatment, not a custom gray.
- Icons must meet the **3:1** contrast minimum for non-text content against their background.

## Outlined vs Filled

Use **outlined** as the default. Reserve **filled** for selected or active states (e.g. an active nav item, a favorited item) to signal state change.

The pairing is the same glyph in both states, so the shape stays recognizable while fill carries the state:

- ❌ Do not mix filled and outlined within one icon group for visual variety.
- ❌ Do not use filled as emphasis on something that has no selected state.

## Icon Categories

| Category | Purpose | Examples |
| --- | --- | --- |
| action | User actions | add, edit, delete, content_copy, download, share |
| navigation | Wayfinding | arrow_forward, arrow_back, menu, home, close |
| status | State indicators | check_circle, error, warning, info |
| content | Content types | folder, image, description, link |
| communication | Messaging | mail, notifications, chat |
| security | Brand / product | shield, lock, visibility, verified_user |

## Choosing an Icon

1. **Does Material Symbols already have it?** Search the catalog by concept, not by the exact word in the label.
2. **Is this icon already used elsewhere for this concept?** Reuse it. **One concept, one glyph, product-wide** — a shield always means protection, a gear always means settings.
3. **Does the glyph read at the size it will render?** Detailed glyphs lose legibility at 16. Pick a simpler glyph for dense contexts.
4. **Does it need a label?** If the meaning isn't unambiguous on its own, pair it with text. Per rule 3, an icon is never the sole carrier of meaning.

Do not rotate, flip, restyle, or redraw a glyph's geometry to invent a new meaning.

## Accessibility

- Every icon that conveys meaning needs an accessible label — either its own, or the visible text of the control it sits in.
- Purely decorative icons are hidden from assistive technology rather than labeled.
- Icon-only controls need **both** an accessible label and a tooltip — the glyph is not a name.
- Interactive icons need a minimum **48×48** touch target, achieved with padding, not by enlarging the glyph. (44×44 is the accessibility-standard floor; this system requires 48, matching the platform guidance and the repository's own accessibility rule. Write 48 everywhere.)
- Icons must meet the 3:1 contrast minimum for non-text content.
- Never rely on color alone to distinguish one icon's meaning from another's.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The Material icon font ships with Flutter, so no additional icon package or asset pipeline is required.

Flutter renders icons with the framework's `Icon` widget and `IconData` — there is **no** `AsmIcon` widget. Icons are supplied to `Asm*` widgets through typed `IconData` slots, and two dedicated widgets from `pegasus_flutter` cover common patterns.

**Passing icons to components** — most `Asm*` widgets expose icon slots such as `startIcon` / `endIcon` (`AsmButton`), `leadingIcon` (`AsmTag`, `AsmTable`, `AsmAccordion`), or `icon`:

```dart
AsmButton(
  label: 'Download',
  startIcon: Icon(Icons.download),
  onPressed: _download,
);
```

**AsmIconButton** — the icon-only interactive control. `AsmIconButtonSize { large, medium, small, xsmall }` sets both the container and glyph size (large / medium → 20px glyph, small / xsmall → 16px). Provide a semantic label since there is no text.

**AsmIconContainer** — a non-interactive 60×60 presentation tile wrapping a 24px icon, with `style` (standard / error / accent / neutral / gradient), `shape` (roundedSquare / circle), and an optional `indicator` (notification count or status dot). Wrap it in a tappable widget to make it actionable.

**Standalone icons** — use the `Icon` widget directly:

```dart
Icon(
  Icons.shield_outlined,
  size: 20,
  color: Theme.of(context).colorScheme.onSurface,
)
```

**Sizing** — set size via the host component or `Icon(size:)`, using the values from [Icon Sizes](#icon-sizes).

**Color** — icons inherit from the surrounding `IconTheme` / `colorScheme`. Material roles resolve through `Theme.of(context).colorScheme.*`; extended status and brand roles through `context.asmExtendedColors.*`. Pass `color:` from those rather than a raw value — never `Color(0xFF…)`.

**Fill state** — express selected state either by choosing the filled `IconData` constant (`Icons.favorite` vs `Icons.favorite_border`) or via the `Icon` widget's `fill` parameter where the icon font supports it.

**Accessibility** — decorative icons inside `Asm*` buttons are auto-wrapped in `ExcludeSemantics` (the label conveys meaning); standalone meaningful icons need a `semanticLabel` or a wrapping `Semantics(label: …)`. Icon-only controls use `AsmIconButton` with both a semantic label and a `tooltip`.

---

## Rules

1. Every meaningful icon MUST have an accessible label — its own, or the visible text of its control.
2. Decorative icons MUST be hidden from assistive technology.
3. NEVER use an icon as the only way to convey meaning — pair it with text.
4. Icon color MUST follow the same semantic token as its parent text or container.
5. Icon-only controls MUST have both an accessible label AND a tooltip.
6. Interactive icons MUST meet a minimum 48×48 touch target.
7. Icons MUST come from Material Symbols only — never mix icon sets.
8. Use outlined by default; filled ONLY for active/selected states.
9. Loading states replace the icon with a spinner of the same size.
10. Set icon size via the host component or an explicit size value — never by constraining the glyph's box.
11. Use the default weight (400); treat weight, grade, and optical size as optical-correction axes, not styling axes.
12. One concept, one glyph, across the entire product. Never modify or restyle a library glyph.
13. NEVER hardcode a color value on an icon.
