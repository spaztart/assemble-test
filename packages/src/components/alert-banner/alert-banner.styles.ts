import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .banner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 44px;
    padding: var(--md-spacing-300, 12px);
    border-radius: var(--md-border-radius-8, 8px);
    box-sizing: border-box;
    gap: var(--md-spacing-300, 12px);
  }

  .banner__leading {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--md-spacing-200, 8px);
    flex: 1;
    min-width: 0;
  }

  .banner__trailing {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* ------------------------------------
     Icon
     ------------------------------------ */
  .banner__icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  /* ------------------------------------
     Title
     ------------------------------------ */
  .banner__title {
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    line-height: var(--md-sys-typescale-body-medium-line-height, 20px);
  }

  /* ------------------------------------
     Action link
     ------------------------------------ */
  .banner__action {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    line-height: var(--md-sys-typescale-body-medium-line-height, 20px);
    text-decoration: underline;
    cursor: pointer;
    color: inherit;
    white-space: nowrap;
  }

  .banner__action:hover {
    text-decoration-thickness: 2px;
  }

  .banner__action:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: var(--md-border-radius-4, 4px);
  }

  /* ------------------------------------
     Close button
     ------------------------------------ */
  .banner__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: inherit;
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .banner__close:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: var(--md-border-radius-4, 4px);
  }

  /* ====================================
     Mode: neutral
     ==================================== */
  .banner--neutral {
    background: transparent;
    border: 1px solid var(--md-sys-color-on-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
  }

  /* ====================================
     Mode: info
     ==================================== */
  .banner--info {
    background: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }

  /* ====================================
     Mode: critical
     ==================================== */
  .banner--critical {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-secondary);
  }

  /* ====================================
     Mode: positive
     ==================================== */
  .banner--positive {
    background: var(--mcafee-color-extended-positive);
    color: var(--md-sys-color-on-secondary);
  }

  /* ====================================
     Mode: status
     ==================================== */
  .banner--status {
    background: var(--mcafee-color-extended-attention);
    color: var(--md-sys-color-on-secondary);
  }
`;
