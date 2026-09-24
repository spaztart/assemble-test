---
layout: ../layouts/MarkdownLayout.astro
title: States - Design System
description: Interactive states, state layers, and visual feedback guidelines
---

# States

States communicate the status of UI elements to the user. They provide visual feedback for interactions and help users understand what is actionable, focused, or disabled.


## State layers

State layers are semi-transparent overlays applied to interactive elements. The layer uses the element's content color at a defined opacity. Hover over the elements below to see each state in action.

<div class="state-demo-grid">
  <div class="state-demo-item">
    <div class="state-target state-enabled">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">star</span>
      Enabled
    </div>
    <span class="state-label">0% overlay</span>
  </div>
  <div class="state-demo-item">
    <div class="state-target state-hover-demo">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">star</span>
      Hover
    </div>
    <span class="state-label">8% overlay</span>
  </div>
  <div class="state-demo-item">
    <div class="state-target state-focus-demo">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">star</span>
      Focus
    </div>
    <span class="state-label">10% overlay</span>
  </div>
  <div class="state-demo-item">
    <div class="state-target state-pressed-demo">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">star</span>
      Pressed
    </div>
    <span class="state-label">10% overlay</span>
  </div>
  <div class="state-demo-item">
    <div class="state-target state-dragged-demo">
      <span class="material-symbols-outlined" style="font-size:20px;" aria-hidden="true">star</span>
      Dragged
    </div>
    <span class="state-label">16% overlay</span>
  </div>
</div>

<div class="state-live-area">
  <p style="font-size:13px;color:var(--md-sys-color-on-surface-variant);margin-bottom:12px;font-weight:500;">Try it — hover, focus (tab), and click:</p>
  <div style="display:flex;gap:12px;flex-wrap:wrap;">
    <button class="state-interactive">
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">favorite</span>
      Interactive button
    </button>
    <button class="state-interactive state-interactive--tonal">
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">bookmark</span>
      Tonal variant
    </button>
    <button class="state-interactive state-interactive--outline">
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">share</span>
      Outlined variant
    </button>
  </div>
</div>

```css
.interactive-element::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.interactive-element:hover::before { opacity: 0.08; }
.interactive-element:focus-visible::before { opacity: 0.1; }
.interactive-element:active::before { opacity: 0.1; }
```


## Disabled state

Disabled elements use reduced opacity to indicate they are not interactive.

<div class="disabled-demo">
  <div class="disabled-demo-row">
    <button class="state-interactive">
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">send</span>
      Enabled
    </button>
    <span class="material-symbols-outlined" style="font-size:20px;color:var(--md-sys-color-outline);" aria-hidden="true">arrow_forward</span>
    <button class="state-interactive" disabled>
      <span class="material-symbols-outlined" style="font-size:18px;" aria-hidden="true">send</span>
      Disabled
    </button>
  </div>
</div>

- **Container** — 12% opacity of `on-surface`
- **Content** — 38% opacity of `on-surface`
- Disabled elements do not receive focus, hover, or pressed states

```css
.button:disabled {
  background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
  color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
  cursor: not-allowed;
}
```


## Focus indicators

Focus indicators ensure keyboard users can track the active element. Press <kbd>Tab</kbd> to move through the elements below:

<div class="focus-demo">
  <button class="focus-target">Button</button>
  <a href="javascript:void(0)" class="focus-target">Link</a>
  <input type="text" class="focus-target" placeholder="Text input" />
</div>

```css
.interactive:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
```

Focus indicators appear only for keyboard interactions (`focus-visible`), not mouse clicks.


## Selected state

Selected elements indicate an active choice within a group.

<div class="selected-demo">
  <div class="selected-chip" aria-selected="false">
    <span class="material-symbols-outlined" style="font-size:16px;" aria-hidden="true">light_mode</span> Light
  </div>
  <div class="selected-chip selected" aria-selected="true">
    <span class="material-symbols-outlined" style="font-size:16px;" aria-hidden="true">check</span> Dark
  </div>
  <div class="selected-chip" aria-selected="false">
    <span class="material-symbols-outlined" style="font-size:16px;" aria-hidden="true">contrast</span> Auto
  </div>
</div>

```css
.chip[aria-selected="true"] {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
```


## Error state

Error states signal validation failures. The example below shows an invalid text field:

<div class="error-demo">
  <div class="error-field-group">
    <label class="error-label">Email address</label>
    <div class="error-field">
      <span class="material-symbols-outlined" style="font-size:18px;color:var(--md-sys-color-error);" aria-hidden="true">error</span>
      <input type="text" class="error-input" value="invalid-email" aria-invalid="true" />
    </div>
    <span class="error-helper">
      <span class="material-symbols-outlined" style="font-size:14px;" aria-hidden="true">error</span>
      Enter a valid email address
    </span>
  </div>
</div>


## Flutter usage

States are handled by Flutter's built-in `MaterialState` system. Assemble components apply state layers automatically:

```dart
McButton(
  label: 'Submit',
  onPressed: isValid ? () => handleSubmit() : null, // null = disabled
)
```


## State combinations

States can combine. When they do, opacities are applied additively:

<div class="combo-table">
  <div class="combo-row combo-header">
    <span>Combination</span>
    <span>Opacity</span>
    <span>Preview</span>
  </div>
  <div class="combo-row">
    <span>Hover + Focus</span>
    <span>18%</span>
    <div class="combo-preview" style="--combo-opacity:0.18;"></div>
  </div>
  <div class="combo-row">
    <span>Hover + Selected</span>
    <span>8% on container</span>
    <div class="combo-preview combo-preview--selected" style="--combo-opacity:0.08;"></div>
  </div>
  <div class="combo-row">
    <span>Disabled</span>
    <span>38% content</span>
    <div class="combo-preview combo-preview--disabled"></div>
  </div>
</div>

The highest-priority state takes visual precedence. Disabled always overrides other states.


<style>
  /* State demo grid */
  .state-demo-grid {
    display: flex;
    gap: 12px;
    margin: 24px 0;
    flex-wrap: wrap;
  }
  .state-demo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .state-target {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 12px;
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    min-width: 110px;
    justify-content: center;
  }
  .state-target::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  .state-hover-demo::before { opacity: 0.08; }
  .state-focus-demo { outline: 2px solid var(--md-sys-color-primary); outline-offset: 2px; }
  .state-focus-demo::before { opacity: 0.1; }
  .state-pressed-demo::before { opacity: 0.1; }
  .state-pressed-demo { transform: scale(0.98); }
  .state-dragged-demo::before { opacity: 0.16; }
  .state-dragged-demo { box-shadow: var(--md-sys-elevation-level1); }
  .state-label {
    font-size: 11px;
    color: var(--md-sys-color-on-surface-variant);
    font-family: 'McAfee Sans Mono', monospace;
  }

  /* Interactive state area */
  .state-live-area {
    margin: 0 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .state-interactive {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border-radius: 999px;
    border: none;
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.1s;
    overflow: hidden;
  }
  .state-interactive::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
  }
  .state-interactive:hover::before { opacity: 0.08; }
  .state-interactive:focus-visible { outline: 2px solid var(--md-sys-color-primary); outline-offset: 2px; }
  .state-interactive:focus-visible::before { opacity: 0.1; }
  .state-interactive:active { transform: scale(0.97); }
  .state-interactive:active::before { opacity: 0.1; }
  .state-interactive:disabled {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    cursor: not-allowed;
    transform: none;
  }
  .state-interactive:disabled::before { display: none; }
  .state-interactive--tonal {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  .state-interactive--outline {
    background: transparent;
    color: var(--md-sys-color-primary);
    border: 1px solid var(--md-sys-color-outline);
  }

  /* Disabled demo */
  .disabled-demo {
    margin: 16px 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .disabled-demo-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* Focus demo */
  .focus-demo {
    display: flex;
    gap: 12px;
    margin: 16px 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
    flex-wrap: wrap;
  }
  .focus-target {
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline);
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
  }
  .focus-target:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
  input.focus-target {
    min-width: 160px;
  }

  /* Selected demo */
  .selected-demo {
    display: flex;
    gap: 8px;
    margin: 16px 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .selected-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    border: 1px solid var(--md-sys-color-outline);
    color: var(--md-sys-color-on-surface);
    background: var(--md-sys-color-surface);
  }
  .selected-chip.selected {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border-color: transparent;
  }

  /* Error demo */
  .error-demo {
    margin: 16px 0 32px;
    padding: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    background: var(--md-sys-color-surface);
  }
  .error-field-group {
    max-width: 320px;
  }
  .error-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--md-sys-color-error);
    margin-bottom: 6px;
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }
  .error-field {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 2px solid var(--md-sys-color-error);
    border-radius: 8px;
    background: var(--md-sys-color-surface);
  }
  .error-input {
    border: none;
    background: none;
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    outline: none;
    width: 100%;
  }
  .error-helper {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    font-size: 12px;
    color: var(--md-sys-color-error);
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }

  /* Combo table */
  .combo-table {
    margin: 16px 0 32px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    overflow: hidden;
  }
  .combo-row {
    display: grid;
    grid-template-columns: 1fr 1fr 80px;
    padding: 12px 20px;
    align-items: center;
    font-size: 14px;
    color: var(--md-sys-color-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
  .combo-row:last-child { border-bottom: none; }
  .combo-header {
    background: var(--md-sys-color-surface-container);
    font-weight: 600;
    font-size: 13px;
  }
  .combo-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--md-sys-color-surface-container);
    position: relative;
    overflow: hidden;
  }
  .combo-preview::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--md-sys-color-on-surface);
    opacity: var(--combo-opacity, 0);
    border-radius: inherit;
  }
  .combo-preview--selected {
    background: var(--md-sys-color-secondary-container);
  }
  .combo-preview--disabled {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
  }

  @media (max-width: 768px) {
    .state-demo-grid {
      gap: 8px;
    }
    .state-target {
      min-width: 90px;
      padding: 10px 14px;
      font-size: 12px;
    }
  }
</style>
