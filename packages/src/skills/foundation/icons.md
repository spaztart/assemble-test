# Foundation: Icons

> Role: Defines the icon system — icon set, sizing, variable-font axes, color, and usage rules.
> Rule: Icons are supplementary — NEVER use an icon as the sole means of conveying meaning.

## Icon Set

Assemble uses **Material Symbols (Outlined)** as its single icon set — a variable font aligned with the Material 3 language. Icons are referenced by name (e.g. `download`, `arrow_forward`, `shield`), never as bespoke SVGs.

- **Web:** the `<asm-icon>` component, or a raw `<span class="material-symbols-outlined">name</span>`
- **Flutter:** the framework's `Icon(IconData …)` widget, or an `IconData` passed to an `Asm*` component slot (see [Flutter Usage](#flutter-usage))

## `asm-icon` Component (web)

```html
<asm-icon name="download"></asm-icon>
```

The icon is a `1em` square that inherits `font-size` and `color` from its parent, so it scales and colors with surrounding text automatically.

### Variable-font axes (CSS custom properties)

| Property                   | Range        | Default | Purpose                                  |
| -------------------------- | ------------ | ------- | ---------------------------------------- |
| `--asm-icon-fill`          | `0` or `1`   | `0`     | Outlined (0) vs filled (1)               |
| `--asm-icon-weight`        | `100`–`700`  | `400`   | Stroke weight; match adjacent text weight|
| `--asm-icon-grade`         | `-25`–`200`  | `0`     | Fine emphasis / optical correction       |
| `--asm-icon-optical-size`  | `20`–`48`    | `24`    | Optical size for the rendered px size    |

## Icon Sizes

Sizing is driven by `font-size` and aligns to the type scale and component proportions.

| Size label | Value | Usage                                               |
| ---------- | ----- | --------------------------------------------------- |
| Small      | 16px  | Button icons, input affordances, inline icons       |
| Default    | 20px  | Standalone icons, dropdown/list items               |
| Medium     | 24px  | Navigation, card headers, toolbar actions           |
| Large      | 40px  | Feature icons, empty-state accents                  |
| XLarge     | 48px  | Hero icons, large empty states                      |

## Icon–Component Pairing

| Component        | Icon Size | Position           |
| ---------------- | --------- | ------------------ |
| button (small)   | 16px      | Leading or trailing|
| button (medium)  | 16px      | Leading or trailing|
| button (large)   | 20px      | Leading or trailing|
| input / text field| 20px     | Leading or trailing|
| chip             | 16px      | Leading            |
| badge            | 16px      | Leading            |
| alert / banner   | 24px      | Leading            |
| toast / snackbar | 20px      | Leading            |
| navbar item      | 24px      | Leading / top      |
| sidebar item     | 20px      | Leading            |
| dropdown item    | 20px      | Leading            |
| avatar (icon)    | 24px      | Centered           |

## Color

Icons inherit `color` from their parent. Always drive color with a semantic token — never a raw value.

| Context                 | Token                                   |
| ----------------------- | --------------------------------------- |
| Default on surface      | md.sys.color.on-surface                 |
| Secondary / muted       | md.sys.color.on-surface-variant         |
| Accent / interactive    | md.sys.color.primary                    |
| Destructive / error     | md.sys.color.error                      |
| Success                 | mcafee.color.extended.positive          |
| Warning / attention     | mcafee.color.extended.attention         |
| On filled containers    | the matching `on-*` token (e.g. on-primary) |

## Outlined vs Filled

Use **outlined** (`--asm-icon-fill: 0`) as the default. Reserve **filled** (`--asm-icon-fill: 1`) for selected or active states (e.g. an active nav item, a favorited item) to signal state change.

## Icon Categories

| Category      | Purpose            | Examples                                   |
| ------------- | ------------------ | ------------------------------------------ |
| action        | User actions       | add, edit, delete, content_copy, download, share |
| navigation    | Wayfinding         | arrow_forward, arrow_back, menu, home, close |
| status        | State indicators   | check_circle, error, warning, info         |
| content       | Content types      | folder, image, description, link           |
| communication | Messaging          | mail, notifications, chat                  |
| security      | Brand / product    | shield, lock, visibility, verified_user    |

## Flutter Usage

Flutter renders icons with the framework's `Icon` widget and `IconData` (Material `Icons.*` / Material Symbols) — there is **no** separate `AsmIcon` widget. Icons are supplied to `Asm*` widgets through typed `IconData` slots, and two dedicated widgets from `pegasus_flutter` cover common patterns.

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

**Sizing & color** — set size via the host component or `Icon(size:)`; icons inherit color from the surrounding `IconTheme` / `colorScheme`, so pass `color:` from `Theme.of(context).colorScheme.*` rather than a raw value.

**Accessibility** — decorative icons inside `Asm*` buttons are auto-wrapped in `ExcludeSemantics` (the label conveys meaning); standalone icons need a `semanticLabel`.

## Rules

1. Every meaningful icon MUST have an accessible label (`aria-label` on the control, or visible text).
2. Decorative icons MUST be `aria-hidden="true"` (this is `asm-icon`'s default rendering).
3. NEVER use an icon as the only way to convey meaning — pair it with text.
4. Icon color MUST follow the same semantic token as its parent text or container.
5. Icon-only buttons MUST have both an `aria-label` AND a tooltip.
6. Interactive icons MUST meet a minimum 44×44px touch target on mobile.
7. Icons MUST come from Material Symbols only — never mix icon sets.
8. Use outlined by default; filled ONLY for active/selected states.
9. Loading states replace the icon with a spinner of the same size.
10. Set icon size via `font-size` (or the paired component size) — never hardcode width/height on the glyph.
