import { css as t } from "lit";
const n = t`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    border-radius: 999px;
    text-decoration: none;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s, color 0.2s;
  }

  /* ------------------------------------
     Content layer
     ------------------------------------ */
  .button__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    gap: var(--md-spacing-200, 8px);
  }

  /* ------------------------------------
     State layer
     ------------------------------------ */
  .button__state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .button:hover .button__state-layer {
    opacity: 0.08;
  }

  .button:active .button__state-layer {
    opacity: 0.12;
  }

  .button:focus-visible .button__state-layer {
    opacity: 0.10;
  }

  .button:disabled .button__state-layer {
    opacity: 0;
  }

  /* ------------------------------------
     Icon slots
     ------------------------------------ */
  .button__start-icon,
  .button__end-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: inherit;
  }

  /* ------------------------------------
     Label
     ------------------------------------ */
  .button__label {
    display: inline-flex;
    align-items: center;
  }

  /* ====================================
     Sizes
     ==================================== */

  /* huge */
  .button--huge {
    padding: var(--md-spacing-400, 16px) var(--md-spacing-600, 24px);
    min-height: 66px;
    font-size: 14px;
    line-height: 20px;
  }
  .button--huge .button__content {
    gap: var(--md-spacing-300, 12px);
  }
  .button--huge .button__start-icon,
  .button--huge .button__end-icon {
    font-size: 20px;
  }

  /* spacious */
  .button--spacious {
    padding: var(--md-spacing-300, 12px) var(--md-spacing-400, 16px);
    min-height: 56px;
    font-size: 14px;
    line-height: 20px;
  }
  .button--spacious .button__start-icon,
  .button--spacious .button__end-icon {
    font-size: 20px;
  }

  /* default */
  .button--default {
    padding: var(--md-spacing-300, 12px) var(--md-spacing-400, 16px);
    min-height: 48px;
    font-size: 14px;
    line-height: 20px;
  }
  .button--default .button__start-icon,
  .button--default .button__end-icon {
    font-size: 16px;
  }

  /* compact */
  .button--compact {
    padding: var(--md-spacing-200, 8px) var(--md-spacing-300, 12px);
    font-size: 12px;
    line-height: 16px;
  }
  .button--compact .button__start-icon,
  .button--compact .button__end-icon {
    font-size: 16px;
  }

  /* ====================================
     Variant: filled
     ==================================== */
  .button--filled {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .button--filled .button__state-layer {
    background: var(--md-sys-state-primary-hover);
  }

  /* ====================================
     Variant: tonal
     ==================================== */
  .button--tonal {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
  }
  .button--tonal .button__state-layer {
    background: var(--md-sys-state-neutral-hover);
  }
  .button--tonal:active .button__state-layer {
    background: var(--md-sys-state-primary-pressed);
  }

  /* ====================================
     Variant: text
     ==================================== */
  .button--text {
    background: transparent;
    color: var(--md-sys-color-on-surface);
  }
  .button--text .button__state-layer {
    background: var(--md-sys-state-neutral-hover);
  }

  /* ====================================
     Variant: outline
     ==================================== */
  .button--outline {
    background: transparent;
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
  }
  .button--outline .button__state-layer {
    background: var(--md-sys-state-neutral-hover);
  }

  /* ====================================
     Destructive
     ==================================== */
  .button--filled.button--destructive {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }
  .button--filled.button--destructive .button__state-layer {
    background: var(--md-sys-state-error-hover);
  }

  .button--tonal.button--destructive {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .button--tonal.button--destructive .button__state-layer {
    background: var(--md-sys-state-error-hover);
  }

  .button--text.button--destructive {
    color: var(--md-sys-color-error);
  }
  .button--text.button--destructive .button__state-layer {
    background: var(--md-sys-state-error-hover);
  }

  /* ====================================
     Disabled
     ==================================== */
  .button:disabled {
    cursor: default;
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    border-color: color-mix(in oklch, var(--md-sys-color-outline) 38%, transparent);
  }

  /* ====================================
     Focus ring
     ==================================== */
  .button:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
`;
export {
  n as default
};
