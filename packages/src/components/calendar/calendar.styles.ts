import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .calendar {
    font-family: 'McAfee Sans', sans-serif;
    color: var(--md-sys-color-on-surface);
  }

  .calendar--full {
    background: var(--md-sys-color-surface);
    border-radius: var(--md-border-radius-12, 12px);
    padding: var(--md-spacing-300, 12px);
    box-shadow: 0 4px 8px color-mix(in oklch, var(--md-sys-color-shadow) 15%, transparent);
  }

  .calendar--grid-only {
    padding: 0;
  }

  /* ------------------------------------
     Title
     ------------------------------------ */
  .calendar__title {
    font-size: var(--md-sys-typescale-headline-small-size, 24px);
    font-weight: 700;
    line-height: var(--md-sys-typescale-headline-small-line-height, 32px);
    padding: var(--md-spacing-300, 12px) var(--md-spacing-200, 8px);
  }

  /* ------------------------------------
     Header (nav)
     ------------------------------------ */
  .calendar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--md-spacing-200, 8px) 0;
  }

  .calendar__month-label {
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    font-weight: 700;
    line-height: var(--md-sys-typescale-body-medium-line-height, 20px);
  }

  .calendar__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: var(--md-border-radius-4, 4px);
    cursor: pointer;
    color: var(--md-sys-color-on-surface-variant);
    padding: 0;
  }

  .calendar__nav-btn:hover {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .calendar__nav-btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  /* ------------------------------------
     Grid
     ------------------------------------ */
  .calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--md-spacing-100, 4px);
    text-align: center;
  }

  .calendar__day-label {
    font-size: var(--md-sys-typescale-label-medium-size, 12px);
    line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
    padding: var(--md-spacing-200, 8px) 0;
  }

  .calendar__empty {
    display: block;
  }

  /* ------------------------------------
     Day cells
     ------------------------------------ */
  .calendar__day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    border-radius: 50%;
    cursor: pointer;
    font-family: inherit;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    line-height: 1;
    color: var(--md-sys-color-on-surface);
    padding: 0;
    margin: auto;
    transition: background 0.15s, color 0.15s;
  }

  .calendar__day:hover:not(:disabled) {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .calendar__day:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .calendar__day--today:not(.calendar__day--selected) {
    border: 1px solid var(--md-sys-color-primary);
  }

  .calendar__day--selected {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  .calendar__day--selected:hover {
    background: var(--md-sys-color-primary);
  }

  .calendar__day--in-range {
    background: color-mix(in oklch, var(--md-sys-color-secondary) 30%, transparent);
    border-radius: 0;
  }

  .calendar__day--disabled {
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    cursor: default;
    pointer-events: none;
  }

  /* ------------------------------------
     Actions
     ------------------------------------ */
  .calendar__actions {
    display: flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
    padding-top: var(--md-spacing-300, 12px);
    border-top: 1px solid var(--md-sys-color-outline-variant);
    margin-top: var(--md-spacing-300, 12px);
  }

  .calendar__actions-spacer {
    flex: 1;
  }

  .calendar__action-btn {
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    font-size: var(--md-sys-typescale-label-medium-size, 12px);
    line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
    border: none;
    border-radius: 999px;
    padding: var(--md-spacing-200, 8px) var(--md-spacing-300, 12px);
    cursor: pointer;
    transition: background 0.15s;
  }

  .calendar__action-btn--text {
    background: none;
    color: var(--md-sys-color-on-surface);
  }

  .calendar__action-btn--text:hover {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .calendar__action-btn--filled {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  .calendar__action-btn--filled:hover {
    background: color-mix(in oklch, var(--md-sys-color-primary) 88%, var(--md-sys-color-on-primary));
  }

  .calendar__action-btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
`;
