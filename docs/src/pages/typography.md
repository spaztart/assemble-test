---
layout: ../layouts/MarkdownLayout.astro
title: Typography - Design System
description: Type scale, font families, and typographic guidelines for the Assemble design system
---

# Typography

Typography establishes hierarchy, improves readability, and reinforces brand identity. Assemble's type system is built on Material 3's type scale and uses McAfee Sans as the primary brand typeface.


## Font families

<div class="font-showcase">
  <div class="font-card">
    <div class="font-sample" style="font-family:'McAfee Sans',system-ui,sans-serif;font-size:32px;font-weight:700;color:var(--md-sys-color-on-surface);">McAfee Sans</div>
    <div class="font-alphabet" style="font-family:'McAfee Sans',system-ui,sans-serif;color:var(--md-sys-color-on-surface-variant);">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</div>
    <div class="font-numbers" style="font-family:'McAfee Sans',system-ui,sans-serif;color:var(--md-sys-color-on-surface-variant);">0123456789 !@#$%&*()+-</div>
    <code class="font-token">--md-ref-type-font-system</code>
  </div>
  <div class="font-card">
    <div class="font-sample" style="font-family:'McAfee Sans Mono',monospace;font-size:28px;font-weight:400;color:var(--md-sys-color-on-surface);">McAfee Sans Mono</div>
    <div class="font-alphabet" style="font-family:'McAfee Sans Mono',monospace;color:var(--md-sys-color-on-surface-variant);">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</div>
    <div class="font-numbers" style="font-family:'McAfee Sans Mono',monospace;color:var(--md-sys-color-on-surface-variant);">0123456789 !@#$%&*()+-</div>
    <code class="font-token">--md-ref-type-font-mono</code>
  </div>
</div>


## Type scale

The type scale defines styles across five categories. Each preview below renders using the actual design tokens.

### Display

<div class="type-scale-group">
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-display-large-fontFamily);font-size:var(--md-sys-typescale-display-large-fontSize);font-weight:var(--md-sys-typescale-display-large-fontWeight);line-height:var(--md-sys-typescale-display-large-lineHeight);letter-spacing:var(--md-sys-typescale-display-large-letterSpacing);color:var(--md-sys-color-on-surface);">Display Large</div>
    <div class="type-meta"><code>display-large</code> · 57px · Regular</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-display-medium-fontFamily);font-size:var(--md-sys-typescale-display-medium-fontSize);font-weight:var(--md-sys-typescale-display-medium-fontWeight);line-height:var(--md-sys-typescale-display-medium-lineHeight);letter-spacing:var(--md-sys-typescale-display-medium-letterSpacing);color:var(--md-sys-color-on-surface);">Display Medium</div>
    <div class="type-meta"><code>display-medium</code> · 45px · Regular</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-display-small-fontFamily);font-size:var(--md-sys-typescale-display-small-fontSize);font-weight:var(--md-sys-typescale-display-small-fontWeight);line-height:var(--md-sys-typescale-display-small-lineHeight);letter-spacing:var(--md-sys-typescale-display-small-letterSpacing);color:var(--md-sys-color-on-surface);">Display Small</div>
    <div class="type-meta"><code>display-small</code> · 36px · Regular</div>
  </div>
</div>

### Headline

<div class="type-scale-group">
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-headline-large-fontFamily);font-size:var(--md-sys-typescale-headline-large-fontSize);font-weight:var(--md-sys-typescale-headline-large-fontWeight);line-height:var(--md-sys-typescale-headline-large-lineHeight);letter-spacing:var(--md-sys-typescale-headline-large-letterSpacing);color:var(--md-sys-color-on-surface);">Headline Large</div>
    <div class="type-meta"><code>headline-large</code> · 32px</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-headline-medium-fontFamily);font-size:var(--md-sys-typescale-headline-medium-fontSize);font-weight:var(--md-sys-typescale-headline-medium-fontWeight);line-height:var(--md-sys-typescale-headline-medium-lineHeight);letter-spacing:var(--md-sys-typescale-headline-medium-letterSpacing);color:var(--md-sys-color-on-surface);">Headline Medium</div>
    <div class="type-meta"><code>headline-medium</code> · 28px</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-headline-small-fontFamily);font-size:var(--md-sys-typescale-headline-small-fontSize);font-weight:var(--md-sys-typescale-headline-small-fontWeight);line-height:var(--md-sys-typescale-headline-small-lineHeight);letter-spacing:var(--md-sys-typescale-headline-small-letterSpacing);color:var(--md-sys-color-on-surface);">Headline Small</div>
    <div class="type-meta"><code>headline-small</code> · 24px</div>
  </div>
</div>

### Title

<div class="type-scale-group">
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-title-large-fontFamily);font-size:var(--md-sys-typescale-title-large-fontSize);font-weight:var(--md-sys-typescale-title-large-fontWeight);line-height:var(--md-sys-typescale-title-large-lineHeight);letter-spacing:var(--md-sys-typescale-title-large-letterSpacing);color:var(--md-sys-color-on-surface);">Title Large</div>
    <div class="type-meta"><code>title-large</code> · 22px</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-title-medium-fontFamily);font-size:var(--md-sys-typescale-title-medium-fontSize);font-weight:var(--md-sys-typescale-title-medium-fontWeight);line-height:var(--md-sys-typescale-title-medium-lineHeight);letter-spacing:var(--md-sys-typescale-title-medium-letterSpacing);color:var(--md-sys-color-on-surface);">Title Medium</div>
    <div class="type-meta"><code>title-medium</code> · 16px · Medium</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-title-small-fontFamily);font-size:var(--md-sys-typescale-title-small-fontSize);font-weight:var(--md-sys-typescale-title-small-fontWeight);line-height:var(--md-sys-typescale-title-small-lineHeight);letter-spacing:var(--md-sys-typescale-title-small-letterSpacing);color:var(--md-sys-color-on-surface);">Title Small</div>
    <div class="type-meta"><code>title-small</code> · 14px · Medium</div>
  </div>
</div>

### Body

<div class="type-scale-group">
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-body-large-fontFamily);font-size:var(--md-sys-typescale-body-large-fontSize);font-weight:var(--md-sys-typescale-body-large-fontWeight);line-height:var(--md-sys-typescale-body-large-lineHeight);letter-spacing:var(--md-sys-typescale-body-large-letterSpacing);color:var(--md-sys-color-on-surface);">Body Large — The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.</div>
    <div class="type-meta"><code>body-large</code> · 16px · Regular</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-body-medium-fontFamily);font-size:var(--md-sys-typescale-body-medium-fontSize);font-weight:var(--md-sys-typescale-body-medium-fontWeight);line-height:var(--md-sys-typescale-body-medium-lineHeight);letter-spacing:var(--md-sys-typescale-body-medium-letterSpacing);color:var(--md-sys-color-on-surface);">Body Medium — The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.</div>
    <div class="type-meta"><code>body-medium</code> · 14px · Regular</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-body-small-fontFamily);font-size:var(--md-sys-typescale-body-small-fontSize);font-weight:var(--md-sys-typescale-body-small-fontWeight);line-height:var(--md-sys-typescale-body-small-lineHeight);letter-spacing:var(--md-sys-typescale-body-small-letterSpacing);color:var(--md-sys-color-on-surface);">Body Small — The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.</div>
    <div class="type-meta"><code>body-small</code> · 12px · Regular</div>
  </div>
</div>

### Label

<div class="type-scale-group">
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-label-large-fontFamily);font-size:var(--md-sys-typescale-label-large-fontSize);font-weight:var(--md-sys-typescale-label-large-fontWeight);line-height:var(--md-sys-typescale-label-large-lineHeight);letter-spacing:var(--md-sys-typescale-label-large-letterSpacing);color:var(--md-sys-color-on-surface);">Label Large — Buttons and navigation</div>
    <div class="type-meta"><code>label-large</code> · 14px · Medium</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-label-medium-fontFamily);font-size:var(--md-sys-typescale-label-medium-fontSize);font-weight:var(--md-sys-typescale-label-medium-fontWeight);line-height:var(--md-sys-typescale-label-medium-lineHeight);letter-spacing:var(--md-sys-typescale-label-medium-letterSpacing);color:var(--md-sys-color-on-surface);">Label Medium — Captions and tags</div>
    <div class="type-meta"><code>label-medium</code> · 12px · Medium</div>
  </div>
  <div class="type-specimen">
    <div class="type-sample" style="font-family:var(--md-sys-typescale-label-small-fontFamily);font-size:var(--md-sys-typescale-label-small-fontSize);font-weight:var(--md-sys-typescale-label-small-fontWeight);line-height:var(--md-sys-typescale-label-small-lineHeight);letter-spacing:var(--md-sys-typescale-label-small-letterSpacing);color:var(--md-sys-color-on-surface);">Label Small — Fine print and hints</div>
    <div class="type-meta"><code>label-small</code> · 11px · Medium</div>
  </div>
</div>


## Using type tokens

Each type style is available as a set of CSS custom properties:

```css
.card-title {
  font-family: var(--md-sys-typescale-title-medium-fontFamily);
  font-size: var(--md-sys-typescale-title-medium-fontSize);
  font-weight: var(--md-sys-typescale-title-medium-fontWeight);
  line-height: var(--md-sys-typescale-title-medium-lineHeight);
  letter-spacing: var(--md-sys-typescale-title-medium-letterSpacing);
}
```

### Flutter usage

```dart
Text(
  'Section title',
  style: context.typographyTokens.titleMedium,
)
```


## Weight scale

McAfee Sans provides these weight variants:

<div class="weight-showcase">
  <div class="weight-sample" style="font-family:'McAfee Sans',system-ui,sans-serif;font-weight:300;font-size:28px;color:var(--md-sys-color-on-surface);">
    Light — 300
  </div>
  <div class="weight-sample" style="font-family:'McAfee Sans',system-ui,sans-serif;font-weight:400;font-size:28px;color:var(--md-sys-color-on-surface);">
    Regular — 400
  </div>
  <div class="weight-sample" style="font-family:'McAfee Sans',system-ui,sans-serif;font-weight:700;font-size:28px;color:var(--md-sys-color-on-surface);">
    Bold — 700
  </div>
</div>


## Best practices

- **Limit type styles per page** — Use 2–3 styles from the scale to maintain a clean hierarchy.
- **Use semantic tokens** — Reference type tokens instead of hardcoding sizes. This ensures consistency when the scale evolves.
- **Line length** — Keep body text between 50–75 characters per line for optimal readability.
- **Contrast** — Pair type with proper color roles. Use `--md-sys-color-on-surface` for primary text and `--md-sys-color-on-surface-variant` for secondary text.


<style>
  /* Font showcase */
  .font-showcase {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0 32px;
  }
  .font-card {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    padding: 28px 24px 20px;
    background: var(--md-sys-color-surface);
  }
  .font-alphabet {
    font-size: 14px;
    line-height: 1.8;
    margin-top: 12px;
    letter-spacing: 0.5px;
    word-break: break-all;
  }
  .font-numbers {
    font-size: 14px;
    margin-top: 4px;
    letter-spacing: 0.5px;
  }
  .font-token {
    display: inline-block;
    margin-top: 12px;
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 3px 8px;
    border-radius: 4px;
  }

  /* Type scale specimens */
  .type-scale-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 16px 0 32px;
    border-radius: 12px;
    overflow: hidden;
  }
  .type-specimen {
    padding: 20px 24px;
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .type-specimen:first-child {
    border-radius: 12px 12px 0 0;
  }
  .type-specimen:last-child {
    border-radius: 0 0 12px 12px;
  }
  .type-specimen:only-child {
    border-radius: 12px;
  }
  .type-specimen + .type-specimen {
    border-top: none;
  }
  .type-sample {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .type-meta {
    font-size: 12px;
    color: var(--md-sys-color-on-surface-variant);
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }
  .type-meta code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    background: var(--md-sys-color-surface-container);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Weight showcase */
  .weight-showcase {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 16px 0 32px;
    border-radius: 12px;
    overflow: hidden;
  }
  .weight-sample {
    padding: 20px 24px;
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
  }
  .weight-sample:first-child {
    border-radius: 12px 12px 0 0;
  }
  .weight-sample:last-child {
    border-radius: 0 0 12px 12px;
  }
  .weight-sample + .weight-sample {
    border-top: none;
  }

  @media (max-width: 768px) {
    .type-sample {
      white-space: normal;
    }
  }
</style>
