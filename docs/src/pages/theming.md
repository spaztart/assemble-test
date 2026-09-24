---
layout: ../layouts/MarkdownLayout.astro
title: Theming - Design System
description: Understanding the Assemble theming system based on Material 3
---

# Theming

Assemble's theming system is built on the Material 3 design system. It provides a comprehensive set of design tokens that adapt across six theme variants, ensuring consistent visual experiences across Android, iOS, and macOS products.

![Theming cover](/covers/theming.png)


## Theme variants

The design system supports two theme modes:

| Theme | Description |
|---|---|
| **Light** | Default light appearance for standard viewing conditions |
| **Dark** | Default dark appearance for low-light environments |

Each variant is defined as a complete token set in the repository under `/tokens/modes/assemble/`:

```
tokens/modes/assemble/
├── light.json
├── dark.json
└── contrast.json
```


## How theming works

Tokens are structured in two layers:

1. **Material reference tokens** (`md.ref.palette.*`) — The base color palette containing tonal values from 0–100 for each color role (primary, secondary, tertiary, error, neutral, brand)
2. **Mode-specific semantic tokens** (`md.sys.color.*`) — Map palette values to semantic roles (surface, on-surface, primary-container, etc.) based on the active theme

When a theme is applied, the semantic tokens resolve to different palette stops. For example, `md.sys.color.primary` maps to `palette.primary40` in light mode but `palette.primary80` in dark mode.

### Extended tokens

Beyond the standard Material 3 color roles, Assemble includes McAfee-specific extensions:

- **Brand colors** — McAfee red, brand primary, and container variants
- **Extended semantic colors** — Positive (green), warning/attention (amber), and McAfee accent
- **Surface gradients** — High, moderate, and low energy gradient sets with three stops each
- **Glass effects** — Radial glass-blur gradient tokens
- **Action gradients** — Interactive element gradient stops
- **Border gradients** — Decorative gradient borders
- **Shadow tokens** — Elevation-based shadow definitions


### Web (CSS)

Apply themes using the `data-theme` attribute on the root element:

```html
<html data-theme="dark">
  <!-- Your content -->
</html>
```

Available values: `light`, `dark`

All CSS custom properties update automatically when the theme changes:

```css
/* These resolve to the active theme's values */
color: var(--md-sys-color-on-surface);
background: var(--md-sys-color-surface);
```

### Flutter (Android & iOS)

In Flutter, theming is managed through `McApp`, which applies the correct token set based on the platform's current appearance:

```dart
McApp(
  // Theme is resolved automatically from the platform setting
  home: McScaffold(
    body: Container(
      color: Theme.of(context).colorScheme.surface,
      child: Text(
        'Themed content',
        style: context.typographyTokens.bodyLarge,
      ),
    ),
  ),
)
```

Access theme-aware colors in any widget:

```dart
// M3 semantic colors
Theme.of(context).colorScheme.primary
Theme.of(context).colorScheme.surface
Theme.of(context).colorScheme.onSurface

// McAfee extended colors
context.extendedColors.mcafeeRed
context.extendedColors.positive
context.extendedColors.warning

// Brand colors
context.brandColors.primary
```


## Platform behavior

### Android

Android uses the system-level dark mode toggle to switch between light and dark base themes.

The Pegasus `McApp` widget detects these settings automatically and applies the corresponding token set.

### iOS

iOS follows the same light/dark mode system toggle.

`McApp` reads the `MediaQuery` accessibility flags and selects the appropriate theme variant.

### macOS

McAfee products on macOS integrate with the native macOS appearance settings:

- **Appearance** — Follows the system light/dark mode setting (System Preferences → Appearance)

macOS products use the system accessibility API to detect these preferences and map them to the corresponding Assemble theme variant. This ensures McAfee desktop products feel native without requiring manual theme selection.


## Color space

All color tokens use the **OKLCH** color space for web and are stored as hex values in the token source files for maximum compatibility. OKLCH provides perceptually uniform color manipulation, meaning contrast ratios remain consistent across the palette.

```css
/* Web tokens use OKLCH */
--md-sys-color-primary: oklch(0.5163 0.1991 27.95);

/* Fallback hex values are also available */
--md-sys-color-primary-hex: #c00017;
```


## Token reference

For the complete list of available tokens:

- **Color tokens** — See [Foundations](/foundations) for the full color role reference
- **Typography tokens** — Display, headline, title, body, and label scales
- **Spacing tokens** — 4px–48px+ scale with CSS custom properties
- **Elevation tokens** — Shadow definitions for each elevation level
- **State layer tokens** — Hover (8%), focus (10%), pressed (10%), dragged (16%) opacity values
