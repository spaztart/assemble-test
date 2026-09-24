import { css as o } from "lit";
const n = o`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s, color 0.2s;
  }

  /* ------------------------------------
     Content layer
     ------------------------------------ */
  .icon-button__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  /* ------------------------------------
     State layer
     ------------------------------------ */
  .icon-button__state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .icon-button:hover .icon-button__state-layer {
    opacity: 0.08;
  }

  .icon-button:active .icon-button__state-layer {
    opacity: 0.12;
  }

  .icon-button:focus-visible .icon-button__state-layer {
    opacity: 0.10;
  }

  .icon-button:disabled .icon-button__state-layer {
    opacity: 0;
  }

  /* ------------------------------------
     Icon
     ------------------------------------ */
  .icon-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: inherit;
  }

  /* ====================================
     Sizes
     ==================================== */

  /* huge */
  .icon-button--huge {
    width: 66px;
    height: 66px;
    font-size: 28px;
  }

  /* spacious */
  .icon-button--spacious {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  /* default */
  .icon-button--default {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  /* compact */
  .icon-button--compact {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  /* ====================================
     Variant: standard
     ==================================== */
  .icon-button--standard {
    background: transparent;
    color: var(--md-sys-color-on-surface-variant);
  }
  .icon-button--standard .icon-button__state-layer {
    background: var(--md-sys-state-neutral-hover, var(--md-sys-color-on-surface-variant));
  }
  .icon-button--standard:hover {
    color: var(--md-sys-color-on-surface);
  }

  /* standard selected */
  .icon-button--standard.icon-button--selected {
    color: var(--md-sys-color-primary);
  }

  /* ====================================
     Variant: filled
     ==================================== */
  .icon-button--filled {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .icon-button--filled .icon-button__state-layer {
    background: var(--md-sys-state-primary-hover, var(--md-sys-color-on-primary));
  }

  /* filled selected */
  .icon-button--filled.icon-button--selected {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  /* ====================================
     Variant: tonal
     ==================================== */
  .icon-button--tonal {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
  }
  .icon-button--tonal .icon-button__state-layer {
    background: var(--md-sys-state-neutral-hover, var(--md-sys-color-on-surface));
  }

  /* tonal selected */
  .icon-button--tonal.icon-button--selected {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  /* ====================================
     Variant: outline
     ==================================== */
  .icon-button--outline {
    background: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
  }
  .icon-button--outline .icon-button__state-layer {
    background: var(--md-sys-state-neutral-hover, var(--md-sys-color-on-surface));
  }

  /* outline selected */
  .icon-button--outline.icon-button--selected {
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    border-color: transparent;
  }

  /* ====================================
     Destructive
     ==================================== */
  .icon-button--filled.icon-button--destructive {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }
  .icon-button--filled.icon-button--destructive .icon-button__state-layer {
    background: var(--md-sys-state-error-hover, var(--md-sys-color-on-error));
  }

  .icon-button--tonal.icon-button--destructive {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .icon-button--tonal.icon-button--destructive .icon-button__state-layer {
    background: var(--md-sys-state-error-hover, var(--md-sys-color-on-error-container));
  }

  .icon-button--standard.icon-button--destructive,
  .icon-button--outline.icon-button--destructive {
    color: var(--md-sys-color-error);
  }
  .icon-button--standard.icon-button--destructive .icon-button__state-layer,
  .icon-button--outline.icon-button--destructive .icon-button__state-layer {
    background: var(--md-sys-state-error-hover, var(--md-sys-color-error));
  }

  /* ====================================
     Disabled
     ==================================== */
  .icon-button:disabled {
    cursor: default;
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    border-color: color-mix(in oklch, var(--md-sys-color-outline) 38%, transparent);
  }

  /* ====================================
     Focus ring
     ==================================== */
  .icon-button:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
`;
export {
  n as default
};
