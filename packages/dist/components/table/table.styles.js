import { css as o } from "lit";
const r = o`
  :host {
    display: block;
  }

  .table-wrapper {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 12px;
    overflow: hidden;
  }

  .table-headline {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    padding: var(--md-spacing-400, 16px);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: 'McAfee Sans', system-ui, sans-serif;
  }

  .table__header-cell {
    padding: 12px var(--md-spacing-400, 16px);
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .table__row {
    transition: background 0.15s;
  }

  .table__row:hover {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 4%, transparent);
  }

  .table__row:not(:last-child) .table__cell {
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .table__cell {
    padding: 12px var(--md-spacing-400, 16px);
    font-size: 14px;
    line-height: 1.43;
    color: var(--md-sys-color-on-surface);
    vertical-align: middle;
  }

  .table__cell-icon {
    font-size: 20px;
    vertical-align: middle;
    margin-right: 8px;
    color: var(--md-sys-color-on-surface-variant);
  }
`;
export {
  r as default
};
