import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
  }

  .feedback {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .feedback__label {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    line-height: var(--md-sys-typescale-body-medium-line-height, 20px);
    color: var(--md-sys-color-on-surface);
  }

  .feedback__buttons {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .feedback__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 8px;
    transition: background 0.15s ease, color 0.15s ease;
    background: transparent;
    color: var(--md-sys-color-on-surface-variant);
  }

  .feedback__btn:hover {
    background: var(--md-sys-color-surface-container-high);
  }

  .feedback__btn--selected {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .feedback__btn--selected:hover {
    background: var(--md-sys-color-secondary-container);
  }

  .feedback__btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .feedback__btn asm-icon {
    font-size: 20px;
  }
`;
