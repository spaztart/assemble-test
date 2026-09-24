import { css as e } from "lit";
const t = e`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  /* ====================================
     Page variant
     ==================================== */
  .toggle-group--page {
    display: inline-flex;
    border-radius: 999px;
    background: var(--md-sys-color-surface-bright, var(--md-sys-color-surface));
    box-shadow: var(--md-sys-elevation-level1);
    overflow: hidden;
  }

  /* Section variant */
  .toggle-group--section {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  /* ====================================
     Toggle item
     ==================================== */
  .toggle-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--md-spacing-200, 8px);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-weight: 600;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    transition: background 0.2s, color 0.2s;
    user-select: none;
  }

  .toggle-item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
    border-radius: inherit;
  }

  /* State layer */
  .toggle-item__state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    transition: background 0.15s;
  }

  .toggle-item:hover .toggle-item__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-primary) 8%, transparent);
  }

  .toggle-item:active .toggle-item__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-primary) 12%, transparent);
  }

  /* Label */
  .toggle-item__label {
    position: relative;
    z-index: 1;
  }

  /* Icon */
  .toggle-item__icon {
    position: relative;
    z-index: 1;
    font-size: inherit;
  }

  /* ====================================
     Page variant items
     ==================================== */
  .toggle-group--page .toggle-item {
    border-radius: 999px;
    color: var(--md-sys-color-on-surface);
  }

  .toggle-group--page .toggle-item--selected {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  /* Page sizes */
  .toggle-group--xsmall .toggle-item {
    height: 40px;
    padding: 0 16px;
    font-size: 12px;
  }
  .toggle-group--xsmall .toggle-item__icon { font-size: 16px; }

  .toggle-group--small .toggle-item {
    height: 56px;
    padding: 0 20px;
    font-size: 14px;
  }
  .toggle-group--small .toggle-item__icon { font-size: 16px; }

  .toggle-group--medium .toggle-item {
    height: 64px;
    padding: 0 24px;
    font-size: 14px;
  }
  .toggle-group--medium .toggle-item__icon { font-size: 20px; }

  .toggle-group--large .toggle-item {
    height: 74px;
    padding: 0 28px;
    font-size: 14px;
  }
  .toggle-group--large .toggle-item__icon { font-size: 20px; }

  /* ====================================
     Section variant items
     ==================================== */
  .toggle-group--section .toggle-item {
    height: 32px;
    padding: 0 var(--md-spacing-200, 8px);
    border-radius: 999px;
    font-size: 14px;
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
  }

  .toggle-group--section .toggle-item--selected {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-weight: 700;
  }
`;
export {
  t as default
};
