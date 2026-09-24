import { css as n } from "lit";
const a = n`
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: var(--md-spacing-100, 4px);
    padding: 0 var(--md-spacing-400, 16px);
  }

  /* ------------------------------------
     Nav arrows (prev/next)
     ------------------------------------ */
  .pagination__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    border-radius: 50%;
    cursor: pointer;
    color: var(--md-sys-color-on-surface);
    padding: 0;
    transition: background 0.15s;
  }

  .pagination__nav-btn:hover:not(:disabled) {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .pagination__nav-btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .pagination__nav-btn:disabled {
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    cursor: default;
  }

  /* ------------------------------------
     Page pills
     ------------------------------------ */
  .pagination__page {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    padding: 0 var(--md-spacing-200, 8px);
    border: none;
    background: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    line-height: 1;
    color: var(--md-sys-color-on-surface);
    transition: background 0.15s, color 0.15s;
    box-sizing: border-box;
  }

  .pagination__page:hover:not(:disabled):not(.pagination__page--current) {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .pagination__page:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .pagination__page--current {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    cursor: default;
  }

  .pagination__page:disabled {
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    cursor: default;
  }

  /* ------------------------------------
     Ellipsis
     ------------------------------------ */
  .pagination__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    color: var(--md-sys-color-on-surface-variant);
    user-select: none;
  }
`;
export {
  a as default
};
