import { css as e } from "lit";
const r = e`
  :host {
    display: block;
  }

  /* ── Drawer surface ── */
  .nav-drawer {
    display: flex;
    flex-direction: column;
    background: var(--md-sys-color-surface-bright);
    border-radius: 0 var(--md-border-radius-16, 16px) var(--md-border-radius-16, 16px) 0;
    box-shadow: var(--md-sys-elevation-level5, 0px 0px 20px 0px var(--md-sys-color-shadow));
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    width: var(--asm-nav-drawer-width, 320px);
  }

  /* ── Header (brand area) ── */
  .nav-drawer__header {
    display: flex;
    align-items: center;
    padding: var(--md-spacing-500, 20px) var(--md-spacing-500, 20px) var(--md-spacing-400, 16px);
    flex-shrink: 0;
  }

  /* ── Scrollable body ── */
  .nav-drawer__body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 var(--md-spacing-200, 8px);
  }

  /* ── Pinned footer ── */
  .nav-drawer__footer {
    flex-shrink: 0;
    padding: var(--md-spacing-200, 8px);
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  /* ── Section ── */
  .nav-section {
    display: flex;
    flex-direction: column;
  }

  /* ── Category header ── */
  .nav-category-header {
    width: 100%;
    padding: var(--md-spacing-800, 32px) var(--md-spacing-500, 20px) var(--md-spacing-400, 16px);
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    box-sizing: border-box;
    font-family: 'McAfee Sans Mono', monospace;
    font-size: var(--md-sys-typescale-label-large-size, 14px);
    font-weight: 700;
    letter-spacing: var(--md-sys-typescale-label-large-letter-spacing, 0.1px);
    line-height: var(--md-sys-typescale-label-large-line-height, 20px);
    text-transform: uppercase;
    color: var(--md-sys-color-on-surface-variant);
  }

  /* ── Nav list item ── */
  .nav-list-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
    padding: var(--md-spacing-500, 20px) var(--md-spacing-400, 16px);
    border-radius: var(--md-border-radius-8, 8px);
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
    font: inherit;
    width: 100%;
    box-sizing: border-box;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
    color: var(--md-sys-color-on-surface);
  }

  .nav-list-item::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-state-neutral-hover);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .nav-list-item:hover::after {
    opacity: 0.08;
  }

  .nav-list-item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .nav-list-item:focus-visible::after {
    opacity: 0.1;
  }

  .nav-list-item:active::after {
    opacity: 0.12;
  }

  .nav-list-item--disabled {
    opacity: 0.38;
    pointer-events: none;
    cursor: default;
  }

  .nav-list-item__leading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface);
  }

  .nav-list-item__label {
    flex: 1;
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    font-weight: var(--md-sys-typescale-body-large-weight, 400);
    line-height: var(--md-sys-typescale-body-large-line-height, 24px);
    letter-spacing: var(--md-sys-typescale-body-large-letter-spacing, 0.5px);
    color: var(--md-sys-color-on-surface);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-list-item__trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface);
  }
`;
export {
  r as default
};
