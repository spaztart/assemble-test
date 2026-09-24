---
layout: ../layouts/MarkdownLayout.astro
title: Tokens - Design System
description: Design token architecture, naming conventions, and usage across platforms
---

# Tokens

Design tokens are the single source of truth for visual styling across all platforms. They store color, typography, spacing, and other design decisions as named values that can be consumed by any codebase.


## Token architecture

Assemble tokens follow a two-layer structure based on Material 3. Reference tokens define raw values; system tokens map those values to semantic roles.

<div class="token-arch">
  <div class="token-arch-layer">
    <div class="token-arch-header">Reference tokens</div>
    <div class="token-arch-desc">Raw palette values — not used directly in components</div>
    <div class="token-arch-items">
      <div class="token-chip token-chip--ref" style="background:var(--md-ref-palette-primary0);color:#fff;">primary0</div>
      <div class="token-chip token-chip--ref" style="background:var(--md-ref-palette-primary40);color:#fff;">primary40</div>
      <div class="token-chip token-chip--ref" style="background:var(--md-ref-palette-primary80);color:#000;">primary80</div>
      <div class="token-chip token-chip--ref" style="background:var(--md-ref-palette-primary100);color:#000;border:1px solid var(--md-sys-color-outline-variant);">primary100</div>
    </div>
  </div>
  <div class="token-arch-arrow">
    <span class="material-symbols-outlined" style="font-size:24px;color:var(--md-sys-color-outline);" aria-hidden="true">arrow_downward</span>
    <span style="font-size:11px;color:var(--md-sys-color-on-surface-variant);font-family:'McAfee Sans Mono',monospace;">maps to</span>
  </div>
  <div class="token-arch-layer">
    <div class="token-arch-header">System tokens</div>
    <div class="token-arch-desc">Semantic roles — use these in your code</div>
    <div class="token-arch-items">
      <div class="token-chip token-chip--sys" style="background:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);">primary</div>
      <div class="token-chip token-chip--sys" style="background:var(--md-sys-color-on-primary);color:var(--md-sys-color-primary);">on-primary</div>
      <div class="token-chip token-chip--sys" style="background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);">primary-container</div>
    </div>
  </div>
</div>

This indirection allows the same component code to work across all themes without modification.


## Token categories

<div class="token-categories">
  <div class="token-cat-card">
    <div class="token-cat-icon" style="background:var(--md-sys-color-primary);">
      <span class="material-symbols-outlined" style="color:var(--md-sys-color-on-primary);font-size:20px;" aria-hidden="true">palette</span>
    </div>
    <div class="token-cat-info">
      <span class="token-cat-title">Color</span>
      <code>md.sys.color.*</code>
      <span class="token-cat-examples">primary, surface, error, on-surface</span>
    </div>
  </div>
  <div class="token-cat-card">
    <div class="token-cat-icon" style="background:var(--md-sys-color-secondary);">
      <span class="material-symbols-outlined" style="color:var(--md-sys-color-on-secondary);font-size:20px;" aria-hidden="true">text_fields</span>
    </div>
    <div class="token-cat-info">
      <span class="token-cat-title">Typography</span>
      <code>md.sys.typescale.*</code>
      <span class="token-cat-examples">body-large-fontSize, title-medium-fontWeight</span>
    </div>
  </div>
  <div class="token-cat-card">
    <div class="token-cat-icon" style="background:var(--md-sys-color-tertiary);">
      <span class="material-symbols-outlined" style="color:var(--md-sys-color-on-tertiary);font-size:20px;" aria-hidden="true">rounded_corner</span>
    </div>
    <div class="token-cat-info">
      <span class="token-cat-title">Shape</span>
      <code>md.border.radius.*</code>
      <span class="token-cat-examples">4, 8, 12, 16, 999</span>
    </div>
  </div>
  <div class="token-cat-card">
    <div class="token-cat-icon" style="background:var(--md-sys-color-surface-container-highest);">
      <span class="material-symbols-outlined" style="color:var(--md-sys-color-on-surface);font-size:20px;" aria-hidden="true">layers</span>
    </div>
    <div class="token-cat-info">
      <span class="token-cat-title">Elevation</span>
      <code>md.sys.elevation.*</code>
      <span class="token-cat-examples">level1, level5</span>
    </div>
  </div>
</div>


## Live token preview

These swatches render with the actual CSS custom properties from the token build. Toggle the theme to see values change live.

<div class="token-preview-grid">
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-surface);border:1px solid var(--md-sys-color-outline-variant);"></div>
    <code>surface</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-surface-container);"></div>
    <code>surface-container</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-primary);"></div>
    <code>primary</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-secondary);"></div>
    <code>secondary</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-tertiary);"></div>
    <code>tertiary</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-error);"></div>
    <code>error</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--mcafee-color-extended-brand);"></div>
    <code>brand</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--mcafee-color-extended-positive);"></div>
    <code>positive</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--mcafee-color-extended-attention);"></div>
    <code>attention</code>
  </div>
  <div class="token-preview-item">
    <div class="token-preview-swatch" style="background:var(--md-sys-color-outline);"></div>
    <code>outline</code>
  </div>
</div>


## Shape tokens

Border radius tokens provide consistent rounding across components.

<div class="shape-demo">
  <div class="shape-item" style="border-radius:var(--md-border-radius-4);">
    <code>4</code>
  </div>
  <div class="shape-item" style="border-radius:var(--md-border-radius-8);">
    <code>8</code>
  </div>
  <div class="shape-item" style="border-radius:var(--md-border-radius-12);">
    <code>12</code>
  </div>
  <div class="shape-item" style="border-radius:var(--md-border-radius-16);">
    <code>16</code>
  </div>
  <div class="shape-item" style="border-radius:var(--md-border-radius-24);">
    <code>24</code>
  </div>
  <div class="shape-item shape-item--pill" style="border-radius:var(--md-border-radius-999);">
    <code>999</code>
  </div>
</div>


## Source files

Token definitions live in the `/tokens/` directory at the repository root:

```
tokens/
├── $metadata.json
├── $themes.json
├── utilities.json
├── material/
│   ├── assemble.json
│   ├── default.json
│   └── rga.json
└── modes/
    ├── assemble/
    │   ├── light.json
    │   └── dark.json
    ├── default/
    └── rga/
```


## Naming convention

Token names follow a structured pattern:

<div class="naming-demo">
  <div class="naming-segments">
    <div class="naming-segment naming-segment--domain">
      <span class="naming-value">md</span>
      <span class="naming-label">domain</span>
    </div>
    <span class="naming-dot">.</span>
    <div class="naming-segment naming-segment--tier">
      <span class="naming-value">sys</span>
      <span class="naming-label">tier</span>
    </div>
    <span class="naming-dot">.</span>
    <div class="naming-segment naming-segment--category">
      <span class="naming-value">color</span>
      <span class="naming-label">category</span>
    </div>
    <span class="naming-dot">.</span>
    <div class="naming-segment naming-segment--variant">
      <span class="naming-value">primary</span>
      <span class="naming-label">variant</span>
    </div>
  </div>
</div>

| Segment | Values | Purpose |
|---|---|---|
| **domain** | `md` | Material Design namespace |
| **tier** | `ref`, `sys` | Reference (raw) or System (semantic) |
| **category** | `color`, `typescale`, `shape` | Design property type |
| **variant** | `primary`, `body-large-fontSize` | Specific role or property |


## Web usage

Tokens are delivered as CSS custom properties:

```css
.card {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-border-radius-12);
}
```


## Flutter usage

```dart
// Color tokens
Theme.of(context).colorScheme.primary

// Typography tokens
context.typographyTokens.bodyLarge

// Extended tokens
context.extendedColors.mcafeeRed
```


## Token build pipeline

Tokens are authored in JSON and transformed into platform-specific outputs:

<div class="pipeline-demo">
  <div class="pipeline-step">
    <span class="material-symbols-outlined" style="font-size:24px;" aria-hidden="true">data_object</span>
    <span class="pipeline-label">JSON source</span>
    <code>/tokens/</code>
  </div>
  <span class="material-symbols-outlined" style="font-size:20px;color:var(--md-sys-color-outline);" aria-hidden="true">arrow_forward</span>
  <div class="pipeline-step">
    <span class="material-symbols-outlined" style="font-size:24px;" aria-hidden="true">build</span>
    <span class="pipeline-label">Transform</span>
    <code>build-tokens.js</code>
  </div>
  <span class="material-symbols-outlined" style="font-size:20px;color:var(--md-sys-color-outline);" aria-hidden="true">arrow_forward</span>
  <div class="pipeline-step">
    <span class="material-symbols-outlined" style="font-size:24px;" aria-hidden="true">code</span>
    <span class="pipeline-label">CSS / Dart</span>
    <code>tokens.css</code>
  </div>
</div>

```bash
npm run asm-tokens
```


<style>
  /* Token architecture diagram */
  .token-arch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin: 24px 0 32px;
  }
  .token-arch-layer {
    width: 100%;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    padding: 20px 24px;
    background: var(--md-sys-color-surface);
  }
  .token-arch-header {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    margin-bottom: 4px;
  }
  .token-arch-desc {
    font-size: 13px;
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: 12px;
  }
  .token-arch-items {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .token-chip {
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 12px;
    font-weight: 500;
  }
  .token-arch-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 0;
  }

  /* Token categories */
  .token-categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 24px 0 32px;
  }
  .token-cat-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .token-cat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .token-cat-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .token-cat-title {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }
  .token-cat-info code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    background: none;
    padding: 0;
  }
  .token-cat-examples {
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Token preview grid */
  .token-preview-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin: 24px 0 32px;
  }
  .token-preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .token-preview-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
  }
  .token-preview-item code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 10px;
    color: var(--md-sys-color-on-surface-variant);
    background: none;
    padding: 0;
    text-align: center;
  }

  /* Shape demo */
  .shape-demo {
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 16px 0 32px;
    padding: 32px 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
    flex-wrap: wrap;
  }
  .shape-item {
    width: 64px;
    height: 64px;
    background: var(--md-sys-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shape-item code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 12px;
    color: var(--md-sys-color-on-primary);
    background: none;
    padding: 0;
  }
  .shape-item--pill {
    width: 96px;
    height: 48px;
  }

  /* Naming convention */
  .naming-demo {
    margin: 16px 0 24px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .naming-segments {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .naming-segment {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .naming-value {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 18px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 8px;
    color: #fff;
  }
  .naming-segment--domain .naming-value { background: var(--md-sys-color-primary); }
  .naming-segment--tier .naming-value { background: var(--md-sys-color-secondary); }
  .naming-segment--category .naming-value { background: var(--md-sys-color-tertiary); }
  .naming-segment--variant .naming-value { background: var(--md-sys-color-on-surface); }
  .naming-label {
    font-size: 11px;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    color: var(--md-sys-color-on-surface-variant);
    font-weight: 500;
  }
  .naming-dot {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 24px;
    color: var(--md-sys-color-outline);
    font-weight: 700;
    align-self: flex-start;
    line-height: 36px;
  }

  /* Pipeline demo */
  .pipeline-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 16px 0 24px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
    flex-wrap: wrap;
  }
  .pipeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--md-sys-color-on-surface);
  }
  .pipeline-label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
  }
  .pipeline-step code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 2px 8px;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .token-categories {
      grid-template-columns: 1fr;
    }
    .token-preview-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
