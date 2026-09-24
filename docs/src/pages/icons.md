---
layout: ../layouts/MarkdownLayout.astro
title: Icons - Design System
description: Icon usage, sizing, and integration guidelines for the Assemble design system
---

# Icons

Assemble uses Material Symbols as its icon set. Material Symbols provides thousands of icons in a consistent style that aligns with the Material 3 design language.


## Icon gallery

A selection of commonly used icons from the system. All icons render via the Material Symbols Outlined font.

<div class="icon-gallery">
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">home</span><span class="icon-name">home</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">search</span><span class="icon-name">search</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">settings</span><span class="icon-name">settings</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">person</span><span class="icon-name">person</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">favorite</span><span class="icon-name">favorite</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">check_circle</span><span class="icon-name">check_circle</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">delete</span><span class="icon-name">delete</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">edit</span><span class="icon-name">edit</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">visibility</span><span class="icon-name">visibility</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">lock</span><span class="icon-name">lock</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">notifications</span><span class="icon-name">notifications</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">shield</span><span class="icon-name">shield</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">warning</span><span class="icon-name">warning</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">info</span><span class="icon-name">info</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">error</span><span class="icon-name">error</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">close</span><span class="icon-name">close</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">menu</span><span class="icon-name">menu</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">add</span><span class="icon-name">add</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">content_copy</span><span class="icon-name">content_copy</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">download</span><span class="icon-name">download</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">share</span><span class="icon-name">share</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">dark_mode</span><span class="icon-name">dark_mode</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">light_mode</span><span class="icon-name">light_mode</span></div>
  <div class="icon-tile"><span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span><span class="icon-name">arrow_forward</span></div>
</div>

```html
<span class="material-symbols-outlined">search</span>
<span class="material-symbols-outlined">shield</span>
```


## Sizing

Icons follow standard sizes that align with component proportions:

<div class="icon-size-demo">
  <div class="icon-size-item">
    <div class="icon-size-preview" style="font-size:16px;">
      <span class="material-symbols-outlined" aria-hidden="true">shield</span>
    </div>
    <div class="icon-size-info">
      <span class="icon-size-label">Small</span>
      <code>16px</code>
    </div>
  </div>
  <div class="icon-size-item">
    <div class="icon-size-preview" style="font-size:20px;">
      <span class="material-symbols-outlined" aria-hidden="true">shield</span>
    </div>
    <div class="icon-size-info">
      <span class="icon-size-label">Default</span>
      <code>20px</code>
    </div>
  </div>
  <div class="icon-size-item">
    <div class="icon-size-preview" style="font-size:24px;">
      <span class="material-symbols-outlined" aria-hidden="true">shield</span>
    </div>
    <div class="icon-size-info">
      <span class="icon-size-label">Medium</span>
      <code>24px</code>
    </div>
  </div>
  <div class="icon-size-item">
    <div class="icon-size-preview" style="font-size:40px;">
      <span class="material-symbols-outlined" aria-hidden="true">shield</span>
    </div>
    <div class="icon-size-info">
      <span class="icon-size-label">Large</span>
      <code>40px</code>
    </div>
  </div>
  <div class="icon-size-item">
    <div class="icon-size-preview" style="font-size:48px;">
      <span class="material-symbols-outlined" aria-hidden="true">shield</span>
    </div>
    <div class="icon-size-info">
      <span class="icon-size-label">XLarge</span>
      <code>48px</code>
    </div>
  </div>
</div>


## Color

Icons inherit their color from the parent element's `color` property. Use semantic tokens to match the surrounding context:

<div class="icon-color-demo">
  <div class="icon-color-item" style="color:var(--md-sys-color-on-surface);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">on-surface</span>
  </div>
  <div class="icon-color-item" style="color:var(--md-sys-color-on-surface-variant);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">on-surface-variant</span>
  </div>
  <div class="icon-color-item" style="color:var(--md-sys-color-primary);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">primary</span>
  </div>
  <div class="icon-color-item" style="color:var(--md-sys-color-error);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">error</span>
  </div>
  <div class="icon-color-item" style="color:var(--mcafee-color-extended-positive);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">positive</span>
  </div>
  <div class="icon-color-item" style="color:var(--mcafee-color-extended-attention);">
    <span class="material-symbols-outlined" style="font-size:28px;" aria-hidden="true">shield</span>
    <span class="icon-color-label">attention</span>
  </div>
</div>


## Outlined vs Filled

Use the outlined variant as the default. Reserve filled icons for selected or active states to create visual differentiation.

<div class="icon-fill-demo">
  <div class="icon-fill-group">
    <p class="icon-fill-label">Outlined (default)</p>
    <div class="icon-fill-row">
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">favorite</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">bookmark</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">star</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">notifications</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">visibility</span>
    </div>
  </div>
  <div class="icon-fill-group">
    <p class="icon-fill-label">Filled (active/selected)</p>
    <div class="icon-fill-row">
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">favorite</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">bookmark</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">star</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">notifications</span>
      <span class="material-symbols-outlined" style="font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;" aria-hidden="true">visibility</span>
    </div>
  </div>
</div>

```css
/* Outlined (default) */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Filled (active state) */
.icon-filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```


## Accessibility

Icons must be accessible to all users:

<div class="icon-a11y-demo">
  <div class="a11y-example">
    <div class="a11y-example-label">Decorative — icon accompanies text</div>
    <button class="a11y-button">
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">delete</span>
      Delete
    </button>
    <code class="a11y-code">aria-hidden="true"</code>
  </div>
  <div class="a11y-example">
    <div class="a11y-example-label">Standalone — icon is the only content</div>
    <button class="a11y-button a11y-button--icon" aria-label="Delete item">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">delete</span>
    </button>
    <code class="a11y-code">aria-label="Delete item"</code>
  </div>
</div>

```html
<!-- Decorative: label provides meaning -->
<button>
  <span class="material-symbols-outlined" aria-hidden="true">delete</span>
  Delete
</button>

<!-- Standalone: icon needs a label -->
<button aria-label="Delete item">
  <span class="material-symbols-outlined" aria-hidden="true">delete</span>
</button>
```


## Flutter usage

```dart
AsmIcon(
  Icons.check_circle,
  size: AsmIconSize.medium,
)
```


## Icon font setup

Include the Material Symbols font in your project:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
```


<style>
  /* Icon gallery */
  .icon-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
    gap: 4px;
    margin: 24px 0 32px;
    border-radius: 12px;
    overflow: hidden;
  }
  .icon-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: var(--md-sys-color-surface);
    border: 1px solid var(--md-sys-color-outline-variant);
    transition: background 0.15s;
  }
  .icon-tile:hover {
    background: var(--md-sys-color-surface-container-high);
  }
  .icon-tile .material-symbols-outlined {
    font-size: 24px;
    color: var(--md-sys-color-on-surface);
  }
  .icon-name {
    font-size: 10px;
    font-family: 'McAfee Sans Mono', monospace;
    color: var(--md-sys-color-on-surface-variant);
    text-align: center;
    word-break: break-all;
  }

  /* Icon size demo */
  .icon-size-demo {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    margin: 24px 0 32px;
    padding: 32px 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
    flex-wrap: wrap;
  }
  .icon-size-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .icon-size-preview {
    color: var(--md-sys-color-on-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }
  .icon-size-preview .material-symbols-outlined {
    font-size: inherit;
  }
  .icon-size-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .icon-size-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }
  .icon-size-info code {
    font-size: 11px;
    font-family: 'McAfee Sans Mono', monospace;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Icon color demo */
  .icon-color-demo {
    display: flex;
    gap: 16px;
    margin: 16px 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
    flex-wrap: wrap;
  }
  .icon-color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 72px;
  }
  .icon-color-label {
    font-size: 10px;
    font-family: 'McAfee Sans Mono', monospace;
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Outlined vs Filled */
  .icon-fill-demo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 16px 0 32px;
  }
  .icon-fill-group {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    padding: 20px 24px;
    background: var(--md-sys-color-surface);
  }
  .icon-fill-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    margin: 0 0 12px;
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }
  .icon-fill-row {
    display: flex;
    gap: 16px;
    color: var(--md-sys-color-on-surface);
  }

  /* Accessibility demo */
  .icon-a11y-demo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 16px 0 32px;
  }
  .a11y-example {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    padding: 20px 24px;
    background: var(--md-sys-color-surface);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .a11y-example-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }
  .a11y-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline);
    background: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    cursor: pointer;
    width: fit-content;
  }
  .a11y-button--icon {
    padding: 8px;
    border-radius: 50%;
  }
  .a11y-code {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 4px 8px;
    border-radius: 4px;
    width: fit-content;
  }

  @media (max-width: 768px) {
    .icon-gallery {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    }
    .icon-fill-demo,
    .icon-a11y-demo {
      grid-template-columns: 1fr;
    }
  }
</style>
