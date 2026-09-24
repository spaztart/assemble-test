import { css as e } from "lit";
const t = e`
  :host {
    display: block;
    width: 100%;
  }

  .topbar {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 16px;
    gap: 8px;
  }

  /* Tiles */
  .topbar__tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 8px;
    background: var(--md-sys-color-surface-container);
    cursor: pointer;
    color: var(--md-sys-color-on-surface);
    padding: 0;
    flex-shrink: 0;
    transition: background 0.15s ease;
    position: relative;
  }

  .topbar__tile:hover {
    background: var(--md-sys-color-surface-container-high);
  }

  .topbar__tile:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .topbar__tile asm-icon {
    font-size: 24px;
  }

  .topbar__badge {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md-sys-color-error);
  }

  /* Center area */
  .topbar__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .topbar__title {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-title-medium-size, 16px);
    font-weight: 600;
    line-height: var(--md-sys-typescale-title-medium-line-height, 24px);
    color: var(--md-sys-color-on-surface);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topbar__brand {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topbar__brand svg {
    height: 24px;
    width: auto;
  }

  /* Progress variant */
  .topbar__progress {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  /* Desktop variant */
  .topbar-desktop {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 12px;
    transition: background 0.15s ease;
  }

  .topbar-desktop:hover {
    background: var(--md-sys-color-surface-container-low);
  }

  .topbar-desktop:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .topbar-desktop__back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    color: var(--md-sys-color-on-surface);
  }

  .topbar-desktop__back asm-icon {
    font-size: 20px;
  }

  .topbar-desktop__icon-tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    flex-shrink: 0;
  }

  .topbar-desktop__icon-tile asm-icon {
    font-size: 20px;
  }

  .topbar-desktop__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .topbar-desktop__title {
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-headline-small-size, 24px);
    font-weight: 700;
    line-height: var(--md-sys-typescale-headline-small-line-height, 32px);
    color: var(--md-sys-color-on-surface);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topbar-desktop__subtitle {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: var(--md-sys-typescale-label-small-size, 11px);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Back-only variant */
  .topbar-desktop--back-only {
    display: inline-flex;
  }

  .topbar-desktop--back-only .topbar-desktop__back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    cursor: pointer;
    padding: 0;
  }

  .topbar-desktop--back-only .topbar-desktop__back-btn:hover {
    background: var(--md-sys-color-secondary-container);
    opacity: 0.85;
  }

  .topbar-desktop--back-only .topbar-desktop__back-btn:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
`;
export {
  t as default
};
