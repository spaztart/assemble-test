import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--md-spacing-600, 24px);
    gap: var(--md-spacing-300, 12px);
  }

  .empty-state__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--md-sys-color-surface-container);
    flex-shrink: 0;
  }

  .empty-state__icon {
    color: var(--md-sys-color-on-surface-variant);
  }

  .empty-state__title {
    margin: 0;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--md-sys-color-on-surface);
  }

  .empty-state__description {
    margin: 0;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.43;
    color: var(--md-sys-color-on-surface-variant);
    max-width: 380px;
  }

  ::slotted([slot="action"]) {
    margin-top: var(--md-spacing-200, 8px);
  }
`;
