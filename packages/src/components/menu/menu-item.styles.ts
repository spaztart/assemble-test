import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .menu-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--md-sys-color-on-surface);
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s, color 0.15s;
    padding: 8px 12px;
    gap: var(--md-spacing-300, 12px);
    min-height: 56px;
  }

  /* ------------------------------------
     State layer
     ------------------------------------ */
  .menu-item__state-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    background: var(--md-sys-state-neutral-hover, currentColor);
  }

  .menu-item:hover .menu-item__state-layer {
    opacity: 0.08;
  }

  .menu-item:active .menu-item__state-layer {
    opacity: 0.12;
  }

  .menu-item:focus-visible .menu-item__state-layer {
    opacity: 0.10;
  }

  .menu-item:disabled .menu-item__state-layer {
    opacity: 0;
  }

  /* ------------------------------------
     Selected state
     ------------------------------------ */
  .menu-item--selected {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  .menu-item--selected .menu-item__state-layer {
    background: var(--md-sys-color-on-primary, #fff);
  }

  /* ------------------------------------
     Disabled state
     ------------------------------------ */
  .menu-item:disabled {
    cursor: default;
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
  }

  .menu-item--selected:disabled {
    background: color-mix(in oklch, var(--md-sys-color-primary) 38%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-primary) 60%, transparent);
  }

  /* ------------------------------------
     Leading / Trailing icon areas
     ------------------------------------ */
  .menu-item__leading,
  .menu-item__trailing {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    font-size: 20px;
    position: relative;
    z-index: 1;
  }

  /* ------------------------------------
     Content area
     ------------------------------------ */
  .menu-item__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
  }

  .menu-item__label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-item__supporting-text {
    display: block;
    font-size: 12px;
    line-height: 16px;
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-item--selected .menu-item__supporting-text {
    color: color-mix(in oklch, var(--md-sys-color-on-primary) 80%, transparent);
  }

  .menu-item:disabled .menu-item__supporting-text {
    color: color-mix(in oklch, var(--md-sys-color-on-surface-variant) 38%, transparent);
  }

  /* ====================================
     Density: default (56px row)
     ==================================== */
  :host([density='default']) .menu-item,
  :host(:not([density])) .menu-item {
    min-height: 56px;
    padding: 8px 12px;
  }

  /* ====================================
     Density: low (48px row)
     ==================================== */
  :host([density='low']) .menu-item {
    min-height: 48px;
    padding: 12px 12px;
  }

  /* ====================================
     Density: compact (40px row)
     ==================================== */
  :host([density='compact']) .menu-item {
    min-height: 40px;
    padding: 8px 12px;
  }

  /* ------------------------------------
     Focus ring
     ------------------------------------ */
  .menu-item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
  }
`;
