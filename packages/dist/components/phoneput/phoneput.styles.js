import { css as o } from "lit";
const r = o`
  :host {
    display: inline-block;
    width: 100%;
  }

  .phoneput {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .phoneput__label {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    line-height: var(--md-sys-typescale-body-small-line-height, 16px);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
  }

  .phoneput__row {
    display: flex;
    align-items: stretch;
    gap: 8px;
  }

  .phoneput__country {
    position: relative;
    flex-shrink: 0;
  }

  .phoneput__country-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 100%;
    min-width: 120px;
    padding: 0 12px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-border-radius-medium, 12px);
    background: transparent;
    cursor: pointer;
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    color: var(--md-sys-color-on-surface);
    transition: border-color 0.15s ease;
  }

  .phoneput__country-btn:hover {
    border-color: var(--md-sys-color-on-surface);
  }

  .phoneput__country-btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .phoneput__country-btn--open {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  .phoneput__flag {
    font-size: 20px;
    line-height: 1;
  }

  .phoneput__dial-code {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    color: var(--md-sys-color-on-surface);
  }

  .phoneput__chevron {
    font-size: 18px;
    color: var(--md-sys-color-on-surface-variant);
    margin-left: auto;
  }

  .phoneput__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 100;
    width: 360px;
    max-height: 300px;
    background: var(--md-sys-color-surface-container);
    border-radius: var(--md-border-radius-medium, 12px);
    box-shadow: var(--md-sys-elevation-3, 0 4px 12px rgba(0,0,0,0.15));
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .phoneput__search {
    padding: 12px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .phoneput__search input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-border-radius-small, 8px);
    background: var(--md-sys-color-surface);
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    color: var(--md-sys-color-on-surface);
    outline: none;
    box-sizing: border-box;
  }

  .phoneput__search input:focus {
    border-color: var(--md-sys-color-primary);
  }

  .phoneput__list {
    overflow-y: auto;
    max-height: 240px;
    padding: 4px 0;
  }

  .phoneput__option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    color: var(--md-sys-color-on-surface);
    transition: background 0.1s ease;
  }

  .phoneput__option:hover,
  .phoneput__option--highlighted {
    background: var(--md-sys-color-surface-container-high);
  }

  .phoneput__option--selected {
    background: var(--md-sys-color-secondary-container);
  }

  .phoneput__option-flag {
    font-size: 20px;
  }

  .phoneput__option-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .phoneput__option-dial {
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  .phoneput__input {
    flex: 1;
    min-width: 0;
  }

  .phoneput__input input {
    width: 100%;
    height: 100%;
    padding: 0 16px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-border-radius-medium, 12px);
    background: transparent;
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    color: var(--md-sys-color-on-surface);
    outline: none;
    min-height: 48px;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
  }

  .phoneput__input input:focus {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  .phoneput__input input::placeholder {
    color: var(--md-sys-color-on-surface-variant);
  }

  .phoneput__input--error input {
    border-color: var(--md-sys-color-error);
  }

  .phoneput__helper {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    line-height: var(--md-sys-typescale-body-small-line-height, 16px);
    color: var(--md-sys-color-on-surface-variant);
    padding-left: 16px;
  }

  .phoneput__helper--error {
    color: var(--md-sys-color-error);
  }

  :host([disabled]) .phoneput__country-btn,
  :host([disabled]) .phoneput__input input {
    opacity: 0.38;
    pointer-events: none;
  }

  /* Sizes */
  :host([size="small"]) .phoneput__country-btn {
    min-width: 110px;
    min-height: 40px;
  }
  :host([size="small"]) .phoneput__input input {
    min-height: 40px;
  }
  :host([size="large"]) .phoneput__country-btn {
    min-width: 130px;
    min-height: 56px;
  }
  :host([size="large"]) .phoneput__input input {
    min-height: 56px;
  }
`;
export {
  r as default
};
