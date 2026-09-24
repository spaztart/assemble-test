import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 12px;
    min-height: 76px;
    border-radius: 16px;
    box-sizing: border-box;
    cursor: pointer;
    transition: background 0.12s ease;
    position: relative;
  }

  .list-item:hover {
    background: var(--md-sys-color-surface-container-high);
  }

  .list-item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .list-item:active {
    background: var(--md-sys-color-surface-container-highest);
  }

  /* Read-only */
  :host([kind="read-only"]) .list-item {
    cursor: default;
  }

  :host([kind="read-only"]) .list-item:hover {
    background: transparent;
  }

  /* Disabled */
  :host([disabled]) .list-item {
    opacity: 0.38;
    pointer-events: none;
  }

  /* Expanded state */
  .list-item--expanded {
    background: var(--md-sys-color-surface-container-high);
  }

  /* Leading slot */
  .list-item__leading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .list-item__leading ::slotted(*) {
    width: 40px;
    height: 40px;
  }

  /* Content */
  .list-item__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .list-item__overline {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: var(--md-sys-typescale-label-small-size, 11px);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--md-sys-color-on-surface);
  }

  .list-item__title-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .list-item__title {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-title-small-size, 14px);
    font-weight: 600;
    line-height: var(--md-sys-typescale-title-small-line-height, 20px);
    color: var(--md-sys-color-on-surface);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item__unread-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md-sys-color-secondary);
    flex-shrink: 0;
  }

  .list-item__status {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .list-item__supporting {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-body-small-size, 12px);
    font-weight: 400;
    line-height: var(--md-sys-typescale-body-small-line-height, 16px);
    color: var(--md-sys-color-on-surface-variant);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Right content */
  .list-item__right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* Trailing */
  .list-item__trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface);
  }

  .list-item__trailing asm-icon {
    font-size: 24px;
    transition: transform 0.2s ease;
  }

  .list-item__trailing--expanded asm-icon {
    transform: rotate(90deg);
  }

  :host([kind="read-only"]) .list-item__trailing {
    display: none;
  }

  /* Expanded slot */
  .list-item__expanded {
    overflow: hidden;
    transition: max-height 0.2s ease, opacity 0.2s ease;
    max-height: 0;
    opacity: 0;
  }

  .list-item__expanded--open {
    max-height: none;
    opacity: 1;
    margin-top: 12px;
  }

  .list-item__expanded-inner {
    background: var(--md-sys-color-surface-container);
    border-radius: 16px;
    padding: 16px;
  }

  /* Badge positioning on leading */
  .list-item__leading {
    position: relative;
  }

  .list-item__badge-slot {
    position: absolute;
    top: -8px;
    right: -6px;
  }
`;
