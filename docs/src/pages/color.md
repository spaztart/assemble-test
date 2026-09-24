---
layout: ../layouts/MarkdownLayout.astro
title: Color - Design System
description: Color system, palettes, and usage guidelines for the Assemble design system
---

# Color

Color brings meaning, hierarchy, and personality to interfaces. Assemble's color system is built on Material 3 color roles and extended with McAfee brand colors to create consistent, accessible experiences.


## Color roles

Material 3 organizes color into semantic roles rather than fixed values. Each role has a specific purpose in the UI.

<div class="color-role-grid">
  <div class="color-role-pair">
    <div class="color-swatch color-swatch--lg" style="background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);">
      <span class="swatch-label">Primary</span>
      <code class="swatch-token">--md-sys-color-primary</code>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-on-primary);color:var(--md-sys-color-primary);">
      <span class="swatch-label">On Primary</span>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);">
      <span class="swatch-label">Primary Container</span>
    </div>
  </div>
  <div class="color-role-pair">
    <div class="color-swatch color-swatch--lg" style="background:var(--md-sys-color-secondary);color:var(--md-sys-color-on-secondary);">
      <span class="swatch-label">Secondary</span>
      <code class="swatch-token">--md-sys-color-secondary</code>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-on-secondary);color:var(--md-sys-color-secondary);">
      <span class="swatch-label">On Secondary</span>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);">
      <span class="swatch-label">Secondary Container</span>
    </div>
  </div>
  <div class="color-role-pair">
    <div class="color-swatch color-swatch--lg" style="background:var(--md-sys-color-tertiary);color:var(--md-sys-color-on-tertiary);">
      <span class="swatch-label">Tertiary</span>
      <code class="swatch-token">--md-sys-color-tertiary</code>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-on-tertiary);color:var(--md-sys-color-tertiary);">
      <span class="swatch-label">On Tertiary</span>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);">
      <span class="swatch-label">Tertiary Container</span>
    </div>
  </div>
  <div class="color-role-pair">
    <div class="color-swatch color-swatch--lg" style="background:var(--md-sys-color-error);color:var(--md-sys-color-on-error);">
      <span class="swatch-label">Error</span>
      <code class="swatch-token">--md-sys-color-error</code>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-on-error);color:var(--md-sys-color-error);">
      <span class="swatch-label">On Error</span>
    </div>
    <div class="color-swatch" style="background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);">
      <span class="swatch-label">Error Container</span>
    </div>
  </div>
</div>


## Surface hierarchy

Surfaces use container tokens to create depth without relying on elevation shadows. Toggle your theme to see how each surface adapts.

<div class="surface-stack">
  <div class="surface-swatch" style="background:var(--md-sys-color-surface-container-lowest);">
    <span class="swatch-label" style="color:var(--md-sys-color-on-surface);">Surface Container Lowest</span>
    <code class="swatch-token" style="color:var(--md-sys-color-on-surface-variant);">--md-sys-color-surface-container-lowest</code>
  </div>
  <div class="surface-swatch" style="background:var(--md-sys-color-surface-container-low);">
    <span class="swatch-label" style="color:var(--md-sys-color-on-surface);">Surface Container Low</span>
    <code class="swatch-token" style="color:var(--md-sys-color-on-surface-variant);">--md-sys-color-surface-container-low</code>
  </div>
  <div class="surface-swatch" style="background:var(--md-sys-color-surface-container);">
    <span class="swatch-label" style="color:var(--md-sys-color-on-surface);">Surface Container</span>
    <code class="swatch-token" style="color:var(--md-sys-color-on-surface-variant);">--md-sys-color-surface-container</code>
  </div>
  <div class="surface-swatch" style="background:var(--md-sys-color-surface-container-high);">
    <span class="swatch-label" style="color:var(--md-sys-color-on-surface);">Surface Container High</span>
    <code class="swatch-token" style="color:var(--md-sys-color-on-surface-variant);">--md-sys-color-surface-container-high</code>
  </div>
  <div class="surface-swatch" style="background:var(--md-sys-color-surface-container-highest);">
    <span class="swatch-label" style="color:var(--md-sys-color-on-surface);">Surface Container Highest</span>
    <code class="swatch-token" style="color:var(--md-sys-color-on-surface-variant);">--md-sys-color-surface-container-highest</code>
  </div>
</div>

```css
.card {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
}
```


## Brand colors

Beyond the standard Material 3 palette, Assemble includes McAfee-specific color extensions.

<div class="color-role-grid color-role-grid--brand">
  <div class="color-swatch color-swatch--lg" style="background:var(--mcafee-color-extended-brand);color:var(--mcafee-color-extended-on-brand);">
    <span class="swatch-label">McAfee Red</span>
    <code class="swatch-token">--mcafee-color-extended-brand</code>
  </div>
  <div class="color-swatch color-swatch--lg" style="background:var(--mcafee-color-extended-brand-orange);color:var(--mcafee-color-extended-on-brand);">
    <span class="swatch-label">Brand Orange</span>
    <code class="swatch-token">--mcafee-color-extended-brand-orange</code>
  </div>
  <div class="color-swatch color-swatch--lg" style="background:var(--mcafee-color-extended-positive);color:var(--mcafee-color-extended-on-positive);">
    <span class="swatch-label">Positive</span>
    <code class="swatch-token">--mcafee-color-extended-positive</code>
  </div>
  <div class="color-swatch color-swatch--lg" style="background:var(--mcafee-color-extended-attention);color:var(--mcafee-color-extended-on-attention);">
    <span class="swatch-label">Attention</span>
    <code class="swatch-token">--mcafee-color-extended-attention</code>
  </div>
  <div class="color-swatch color-swatch--lg" style="background:var(--mcafee-color-extended-brand-subtle);color:var(--mcafee-color-extended-on-brand-subtle);">
    <span class="swatch-label">Brand Subtle</span>
    <code class="swatch-token">--mcafee-color-extended-brand-subtle</code>
  </div>
</div>


## Gradients

Assemble provides gradient tokens for expressive surfaces and interactive elements.

<div class="gradient-showcase">
  <div class="gradient-swatch" style="background:linear-gradient(135deg, var(--mcafee-color-extended-gradient-surface-high-stop-1), var(--mcafee-color-extended-gradient-surface-high-stop-2));">
    <span class="swatch-label" style="color:#fff;">High Energy</span>
  </div>
  <div class="gradient-swatch" style="background:linear-gradient(135deg, var(--mcafee-color-extended-gradient-surface-moderate-stop-1), var(--mcafee-color-extended-gradient-surface-moderate-stop-2));">
    <span class="swatch-label" style="color:#fff;">Moderate Energy</span>
  </div>
  <div class="gradient-swatch" style="background:linear-gradient(135deg, var(--mcafee-color-extended-gradient-surface-low-stop-1), var(--mcafee-color-extended-gradient-surface-low-stop-2));">
    <span class="swatch-label" style="color:#fff;">Low Energy</span>
  </div>
  <div class="gradient-swatch" style="background:linear-gradient(135deg, var(--mcafee-color-extended-gradient-brand-stop-1), var(--mcafee-color-extended-gradient-brand-stop-2));">
    <span class="swatch-label" style="color:#fff;">Brand Gradient</span>
  </div>
</div>

```css
.cta-button {
  background: linear-gradient(
    135deg,
    var(--mcafee-color-extended-gradient-brand-stop-1),
    var(--mcafee-color-extended-gradient-brand-stop-2)
  );
}
```


## Color space

All web tokens are defined in the **OKLCH** color space, providing perceptually uniform color manipulation. Contrast ratios and perceived lightness stay consistent across the palette.

<div class="colorspace-demo">
  <div class="colorspace-bar">
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary0);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary10);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary20);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary30);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary40);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary50);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary60);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary70);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary80);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary90);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary95);"></div>
    <div class="colorspace-stop" style="background:var(--md-ref-palette-primary100);"></div>
  </div>
  <div class="colorspace-labels">
    <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span><span>90</span><span>95</span><span>100</span>
  </div>
  <p style="text-align:center;margin-top:8px;font-size:13px;color:var(--md-sys-color-on-surface-variant);">Primary tonal palette — 0 (darkest) to 100 (lightest)</p>
</div>

```css
/* OKLCH token */
--md-sys-color-primary: oklch(0.5163 0.1991 27.95);
```


## Dark mode

Colors adapt automatically between light and dark themes. The semantic token names stay the same — only the underlying palette values shift. Use the theme toggle in the top bar to see these swatches update live.

<div class="theme-compare">
  <div class="theme-compare-card" style="background:var(--md-sys-color-surface);border:1px solid var(--md-sys-color-outline-variant);border-radius:12px;padding:20px;">
    <div style="font-family:'McAfee Sans',system-ui,sans-serif;font-size:18px;font-weight:600;color:var(--md-sys-color-on-surface);margin-bottom:8px;">Card title</div>
    <div style="font-size:14px;color:var(--md-sys-color-on-surface-variant);margin-bottom:16px;">This card uses semantic tokens and adapts to the current theme automatically.</div>
    <div style="display:flex;gap:8px;">
      <div style="padding:8px 20px;border-radius:999px;background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font-size:13px;font-weight:500;">Primary</div>
      <div style="padding:8px 20px;border-radius:999px;background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);font-size:13px;font-weight:500;">Secondary</div>
    </div>
  </div>
</div>

Apply themes using the `data-theme` attribute:

```html
<html data-theme="dark">
```

See [Theming](/theming) for full details on theme switching.


## Flutter usage

Access color tokens in Flutter through the theme context:

```dart
// M3 semantic colors
Theme.of(context).colorScheme.primary
Theme.of(context).colorScheme.surface
Theme.of(context).colorScheme.onSurface

// McAfee extended colors
context.extendedColors.mcafeeRed
context.extendedColors.positive
context.extendedColors.warning
```


## Accessibility

All color pairings in the system meet WCAG 2.1 contrast requirements:

<div class="a11y-demo">
  <div class="a11y-pair">
    <div class="a11y-sample" style="background:var(--md-sys-color-surface);color:var(--md-sys-color-on-surface);border:1px solid var(--md-sys-color-outline-variant);">
      <span style="font-size:16px;font-weight:500;">Aa</span>
      <span style="font-size:11px;">on-surface / surface</span>
    </div>
    <span class="a11y-badge">AA ✓</span>
  </div>
  <div class="a11y-pair">
    <div class="a11y-sample" style="background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);">
      <span style="font-size:16px;font-weight:500;">Aa</span>
      <span style="font-size:11px;">on-primary / primary</span>
    </div>
    <span class="a11y-badge">AA ✓</span>
  </div>
  <div class="a11y-pair">
    <div class="a11y-sample" style="background:var(--md-sys-color-error);color:var(--md-sys-color-on-error);">
      <span style="font-size:16px;font-weight:500;">Aa</span>
      <span style="font-size:11px;">on-error / error</span>
    </div>
    <span class="a11y-badge">AA ✓</span>
  </div>
  <div class="a11y-pair">
    <div class="a11y-sample" style="background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);">
      <span style="font-size:16px;font-weight:500;">Aa</span>
      <span style="font-size:11px;">on-secondary-ctr / secondary-ctr</span>
    </div>
    <span class="a11y-badge">AA ✓</span>
  </div>
</div>

Never rely on color alone to convey meaning. Pair color with text labels, icons, or patterns so information remains accessible to all users.


<style>
  /* Color role grid */
  .color-role-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 24px 0 32px;
  }
  .color-role-grid--brand {
    grid-template-columns: repeat(3, 1fr);
  }
  .color-role-pair {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
  }
  .color-swatch {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 48px;
    justify-content: center;
  }
  .color-swatch--lg {
    min-height: 80px;
    padding: 20px 24px;
  }
  .color-role-grid--brand .color-swatch--lg {
    border-radius: 12px;
  }
  .swatch-label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
  }
  .swatch-token {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    opacity: 0.8;
    background: none;
    padding: 0;
    color: inherit;
  }

  /* Surface stack */
  .surface-stack {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 24px 0 32px;
    border-radius: 12px;
    overflow: hidden;
  }
  .surface-swatch {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .surface-swatch .swatch-label {
    font-size: 14px;
    font-weight: 500;
  }
  .surface-swatch .swatch-token {
    font-size: 11px;
  }

  /* Gradient showcase */
  .gradient-showcase {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 24px 0 32px;
  }
  .gradient-swatch {
    border-radius: 12px;
    padding: 32px 24px;
    display: flex;
    align-items: flex-end;
    min-height: 100px;
  }
  .gradient-swatch .swatch-label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-weight: 600;
    font-size: 14px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  /* Colorspace tonal bar */
  .colorspace-demo {
    margin: 24px 0 32px;
  }
  .colorspace-bar {
    display: flex;
    border-radius: 12px;
    overflow: hidden;
    height: 48px;
  }
  .colorspace-stop {
    flex: 1;
  }
  .colorspace-labels {
    display: flex;
    justify-content: space-between;
    padding: 6px 4px 0;
    font-size: 11px;
    font-family: 'McAfee Sans Mono', monospace;
    color: var(--md-sys-color-on-surface-variant);
  }
  .colorspace-labels span {
    flex: 1;
    text-align: center;
  }

  /* Theme compare card */
  .theme-compare {
    margin: 24px 0 32px;
  }

  /* Accessibility demo */
  .a11y-demo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 24px 0 32px;
  }
  .a11y-pair {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .a11y-sample {
    flex: 1;
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .a11y-badge {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: var(--mcafee-color-extended-positive);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .color-role-grid,
    .color-role-grid--brand,
    .gradient-showcase,
    .a11y-demo {
      grid-template-columns: 1fr;
    }
  }
</style>
