import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 6px;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    box-sizing: border-box;
  }

  /* Standard */
  .tag--standard {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Critical */
  .tag--critical {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }

  /* Filter */
  .tag--filter {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
    gap: 4px;
  }

  /* Icon */
  .tag__icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Close button */
  .tag__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
  }

  .tag__close:hover,
  .tag__close:focus-visible {
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
  }

  .tag__close:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }

  .tag__close-icon {
    font-size: 12px;
  }
`;
