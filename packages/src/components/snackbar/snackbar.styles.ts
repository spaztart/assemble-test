import { css } from 'lit';

export default css`
  @font-face {
    font-family: 'McAfee Sans Mono';
    src: url('/fonts/McAfeeSansMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'McAfee Sans Mono';
    src: url('/fonts/McAfeeSansMono-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :host {
    display: block;
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    pointer-events: none;
  }

  .snackbar {
    display: flex;
    align-items: center;
    min-width: 300px;
    max-width: 988px;
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border-radius: 4px;
    padding: 8px 8px 8px 16px;
    gap: var(--md-spacing-200, 8px);
    font-family: 'McAfee Sans Mono', monospace;
    pointer-events: auto;
    box-shadow: var(--md-sys-elevation-level5);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .snackbar--open {
    opacity: 1;
    transform: translateY(0);
  }

  .snackbar__message {
    flex: 1;
    font-size: 14px;
    line-height: 1.43;
  }

  .snackbar__leading-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .snackbar__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .snackbar__action {
    background: none;
    border: none;
    color: var(--md-sys-color-on-primary);
    font-family: 'McAfee Sans Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .snackbar__action:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .snackbar__close {
    background: none;
    border: none;
    color: var(--md-sys-color-on-primary);
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .snackbar__close:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .snackbar__close asm-icon {
    font-size: 20px;
  }
`;
