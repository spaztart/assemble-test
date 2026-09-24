---
layout: ../layouts/MarkdownLayout.astro
title: Foundations - Design System
description: Core design principles and foundational elements
---

# Foundations

![Foundations cover](/covers/foundations.svg)

Foundations are the visual elements needed to create engaging layouts and end-to-end user experiences. They include color, typography, spacing, and other core design elements.

## Color

Judicious use of color can enhance communication, evoke your brand, provide visual continuity, communicate status and feedback, and help people understand information.

The system defines colors that look good on various backgrounds and appearance modes, and can automatically adapt to vibrancy and accessibility settings.

### Color tokens

All color tokens are available in OKLCH color space for modern browsers:

- `--md-sys-color-primary` - Primary brand color
- `--md-sys-color-secondary` - Secondary accent color
- `--md-sys-color-surface` - Surface background color
- `--md-sys-color-error` - Error state color

## Typography

Typography helps create clear hierarchies, organize information, and guide users through your interface.

### Type scale

The design system provides a comprehensive type scale:

- Display (large, medium, small)
- Headline (large, medium, small)
- Title (large, medium, small)
- Body (large, medium, small)
- Label (large, medium, small)

### Usage example

```css
.headline {
  font-family: var(--md-ref-typescale-brand);
  font-size: var(--md-sys-typescale-headline-large-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
}
```

## Spacing

Consistent spacing creates rhythm and improves readability. Use the spacing scale for margins, padding, and gaps.

### Spacing scale

- `--md-sys-space-100` - 4px
- `--md-sys-space-200` - 8px
- `--md-sys-space-300` - 12px
- `--md-sys-space-400` - 16px
- `--md-sys-space-500` - 20px
- `--md-sys-space-600` - 24px

## State layers

State layers provide visual feedback for interactive elements:

- Hover: 8% opacity
- Focus: 10% opacity
- Pressed: 10% opacity
- Dragged: 16% opacity
