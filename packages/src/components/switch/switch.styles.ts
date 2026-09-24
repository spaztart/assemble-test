import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  .switch {
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .switch:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: 999px;
  }

  /* Track */
  .switch__track {
    position: relative;
    border-radius: 999px;
    transition: background 0.15s;
    display: flex;
    align-items: center;
  }

  /* Handle */
  .switch__handle {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.15s ease, width 0.15s, height 0.15s;
    background: var(--md-sys-color-on-surface);
  }

  .switch--on .switch__handle {
    background: var(--md-sys-color-on-primary);
  }

  /* Icon inside handle */
  .switch__icon {
    color: var(--md-sys-color-surface);
    font-size: inherit;
  }

  .switch--on .switch__icon {
    color: var(--md-sys-color-on-primary-container);
  }

  /* ====================================
     Track colors
     ==================================== */
  .switch__track {
    background: transparent;
    border: 2px solid var(--md-sys-color-on-surface);
  }

  .switch--on.switch--secondary .switch__track {
    background: var(--md-sys-color-secondary);
    border-color: var(--md-sys-color-secondary);
  }

  .switch--on.switch--primary .switch__track {
    background: var(--md-sys-color-primary);
    border-color: var(--md-sys-color-primary);
  }

  /* ====================================
     Sizes
     ==================================== */

  /* Large (default M3) */
  .switch--large .switch__track {
    width: 52px;
    height: 32px;
  }

  .switch--large .switch__handle {
    width: 16px;
    height: 16px;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  .switch--large.switch--on .switch__handle {
    width: 24px;
    height: 24px;
    left: 24px;
  }

  .switch--large .switch__icon {
    font-size: 16px;
  }

  /* Medium */
  .switch--medium .switch__track {
    width: 44px;
    height: 28px;
  }

  .switch--medium .switch__handle {
    width: 14px;
    height: 14px;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  .switch--medium.switch--on .switch__handle {
    width: 20px;
    height: 20px;
    left: 20px;
  }

  .switch--medium .switch__icon {
    font-size: 14px;
  }

  /* Small */
  .switch--small .switch__track {
    width: 36px;
    height: 22px;
  }

  .switch--small .switch__handle {
    width: 12px;
    height: 12px;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
  }

  .switch--small.switch--on .switch__handle {
    width: 16px;
    height: 16px;
    left: 17px;
  }

  .switch--small .switch__icon {
    font-size: 12px;
  }

  /* ====================================
     Loader
     ==================================== */
  .switch__loader {
    width: 60%;
    height: 60%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
