import { css as o } from "lit";
const r = o`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    border-radius: var(--md-spacing-200, 8px);
  }

  .checkbox:focus-visible {
    outline: 2px solid var(--md-sys-color-secondary);
    outline-offset: 2px;
    border-radius: var(--md-spacing-200, 8px);
  }

  .checkbox--disabled {
    cursor: default;
    opacity: 0.38;
  }

  /* ------------------------------------
     State layer
     ------------------------------------ */
  .checkbox__state-layer {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    left: -11px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: background 0.15s;
  }

  .checkbox:not(.checkbox--disabled):hover .checkbox__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-secondary) 8%, transparent);
  }

  .checkbox:not(.checkbox--disabled):active .checkbox__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-secondary) 12%, transparent);
  }

  .checkbox--error:not(.checkbox--disabled):hover .checkbox__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-error) 8%, transparent);
  }

  .checkbox--error:not(.checkbox--disabled):active .checkbox__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-error) 12%, transparent);
  }

  /* ------------------------------------
     Box
     ------------------------------------ */
  .checkbox__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 2px solid var(--md-sys-color-on-surface);
    box-sizing: border-box;
    position: relative;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
  }

  .checkbox--checked .checkbox__box,
  .checkbox--indeterminate .checkbox__box {
    background: var(--md-sys-color-secondary);
    border-color: var(--md-sys-color-secondary);
  }

  .checkbox--error .checkbox__box {
    border-color: var(--md-sys-color-error);
  }

  .checkbox--error.checkbox--checked .checkbox__box,
  .checkbox--error.checkbox--indeterminate .checkbox__box {
    background: var(--md-sys-color-error);
    border-color: var(--md-sys-color-error);
  }

  /* ------------------------------------
     Check / Indeterminate icon
     ------------------------------------ */
  .checkbox__icon {
    width: 18px;
    height: 18px;
    color: var(--md-sys-color-on-secondary, #fff);
    display: block;
  }

  /* ------------------------------------
     Label
     ------------------------------------ */
  .checkbox__label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: var(--md-sys-color-on-surface);
    user-select: none;
  }
`;
export {
  r as default
};
