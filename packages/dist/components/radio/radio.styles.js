import { css as o } from "lit";
const e = o`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .radio {
    display: inline-flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    border-radius: var(--md-spacing-200, 8px);
  }

  .radio:focus-visible {
    outline: 2px solid var(--md-sys-color-secondary);
    outline-offset: 2px;
  }

  .radio--disabled {
    cursor: default;
    opacity: 0.38;
  }

  /* State layer */
  .radio__state-layer {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    transition: background 0.15s;
  }

  .radio:not(.radio--disabled):hover .radio__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-secondary) 8%, transparent);
  }

  .radio:not(.radio--disabled):active .radio__state-layer {
    background: color-mix(in oklch, var(--md-sys-color-secondary) 12%, transparent);
  }

  /* Circle */
  .radio__circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--md-sys-color-on-surface);
    box-sizing: border-box;
    flex-shrink: 0;
    transition: border-color 0.15s;
  }

  .radio--selected .radio__circle {
    border-color: var(--md-sys-color-secondary);
  }

  .radio__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--md-sys-color-secondary);
  }

  /* Label */
  .radio__label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: var(--md-sys-color-on-surface);
    user-select: none;
  }
`;
export {
  e as default
};
