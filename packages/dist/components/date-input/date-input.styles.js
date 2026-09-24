import { css as r } from "lit";
const a = r`
  :host {
    display: block;
    position: relative;
  }

  .date-input {
    font-family: 'McAfee Sans', sans-serif;
    position: relative;
  }

  /* ------------------------------------
     Label
     ------------------------------------ */
  .date-input__label {
    display: block;
    font-size: var(--md-sys-typescale-label-medium-size, 12px);
    line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: var(--md-spacing-100, 4px);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ------------------------------------
     Field
     ------------------------------------ */
  .date-input__field {
    display: flex;
    align-items: center;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: var(--md-border-radius-8, 8px);
    padding: var(--md-spacing-200, 8px) var(--md-spacing-300, 12px);
    background: var(--md-sys-color-surface);
    transition: border-color 0.15s;
    gap: var(--md-spacing-200, 8px);
  }

  .date-input__field--focused {
    border-color: var(--md-sys-color-primary);
    outline: 1px solid var(--md-sys-color-primary);
  }

  .date-input__field--error {
    border-color: var(--md-sys-color-error);
  }

  .date-input__field--error.date-input__field--focused {
    outline-color: var(--md-sys-color-error);
  }

  .date-input__field--disabled {
    opacity: 0.38;
    pointer-events: none;
  }

  /* ------------------------------------
     Input
     ------------------------------------ */
  .date-input__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    line-height: var(--md-sys-typescale-body-large-line-height, 24px);
    color: var(--md-sys-color-on-surface);
    padding: 0;
    min-width: 0;
  }

  .date-input__input::placeholder {
    color: var(--md-sys-color-on-surface-variant);
  }

  /* ------------------------------------
     Calendar toggle
     ------------------------------------ */
  .date-input__calendar-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant);
    font-size: 20px;
  }

  .date-input__calendar-toggle:hover {
    color: var(--md-sys-color-on-surface);
  }

  .date-input__calendar-toggle:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: var(--md-border-radius-4, 4px);
  }

  /* ------------------------------------
     Range layout
     ------------------------------------ */
  .date-input__range {
    display: flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
  }

  .date-input__range .date-input__field {
    flex: 1;
  }

  .date-input__range-separator {
    color: var(--md-sys-color-on-surface-variant);
    font-size: 16px;
    flex-shrink: 0;
  }

  /* ------------------------------------
     Supporting / Error text
     ------------------------------------ */
  .date-input__supporting {
    display: block;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    line-height: var(--md-sys-typescale-body-small-line-height, 16px);
    color: var(--md-sys-color-on-surface-variant);
    margin-top: var(--md-spacing-100, 4px);
  }

  .date-input__error {
    display: block;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    line-height: var(--md-sys-typescale-body-small-line-height, 16px);
    color: var(--md-sys-color-error);
    margin-top: var(--md-spacing-100, 4px);
  }

  /* ------------------------------------
     Inline Picker
     ------------------------------------ */
  .date-input__picker {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    margin-top: var(--md-spacing-100, 4px);
    background: var(--md-sys-color-surface);
    border-radius: var(--md-border-radius-16, 16px);
    box-shadow: 0 4px 16px color-mix(in oklch, var(--md-sys-color-shadow) 20%, transparent);
    padding: var(--md-spacing-300, 12px);
  }
`;
export {
  a as default
};
