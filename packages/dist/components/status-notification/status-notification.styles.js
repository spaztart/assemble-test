import { css as o } from "lit";
const i = o`
  :host {
    display: inline-flex;
  }

  .status-notification {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  /* Status colors */
  .status-notification--critical {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }

  .status-notification--attention {
    background: #f59e0b;
    color: #000;
  }

  .status-notification--info {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  .status-notification--loader {
    background: var(--md-sys-color-surface-container);
  }

  /* Count */
  .status-notification__count {
    white-space: nowrap;
  }

  /* Loader spinner */
  .status-notification__loader {
    width: 10px;
    height: 10px;
    border: 1.5px solid var(--md-sys-color-outline);
    border-top-color: var(--md-sys-color-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
export {
  i as default
};
