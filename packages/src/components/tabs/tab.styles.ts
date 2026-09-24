import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    padding: 12px 16px;
    min-width: 48px;
    font-family: 'McAfee Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--md-sys-color-on-surface-variant);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.2s;
    outline: none;
  }

  :host([active]) {
    color: var(--md-sys-color-on-surface);
    font-weight: 700;
  }

  /* ------------------------------------
     Layout modes
     ------------------------------------ */

  /* text only (default) */
  .tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-direction: row;
  }

  /* vertical icon + label */
  :host([layout="icon-vertical"]) .tab {
    flex-direction: column;
    gap: 4px;
  }

  /* ------------------------------------
     State layer
     ------------------------------------ */
  .tab__state-layer {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    pointer-events: none;
    opacity: 0;
    background: var(--md-sys-state-neutral-hover);
    transition: opacity 0.2s;
  }

  :host(:hover) .tab__state-layer {
    opacity: 0.08;
  }

  :host(:active) .tab__state-layer {
    opacity: 0.12;
  }

  :host(:focus-visible) .tab__state-layer {
    opacity: 0.10;
  }

  /* ------------------------------------
     Indicator (active underline)
     ------------------------------------ */
  .tab__indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--md-sys-color-primary);
    transition: width 0.2s cubic-bezier(0.2, 0, 0, 1);
  }

  :host([active]) .tab__indicator {
    width: 100%;
  }

  /* ------------------------------------
     Icon
     ------------------------------------ */
  .tab__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  /* ------------------------------------
     Label
     ------------------------------------ */
  .tab__label {
    position: relative;
    z-index: 1;
  }
`;
