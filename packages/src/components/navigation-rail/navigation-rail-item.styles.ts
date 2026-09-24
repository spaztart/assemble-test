import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
  }

  .rail-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    padding: 4px 0;
    border-radius: var(--md-border-radius-12, 12px);
    box-sizing: border-box;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    border: none;
    background: none;
    font: inherit;
  }

  .rail-item::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-state-neutral-hover);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .rail-item:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .rail-item:hover:not(.rail-item--disabled)::after {
    opacity: 0.08;
  }

  .rail-item:focus-visible:not(.rail-item--disabled)::after {
    opacity: 0.1;
  }

  .rail-item:active:not(.rail-item--disabled)::after {
    opacity: 0.12;
  }

  /* Active gradient state (toggle "on" items with status) */
  .rail-item--active:not(.rail-item--brand-filled) {
    background: linear-gradient(
      60deg,
      color-mix(in oklch, var(--mcafee-color-extended-gradient-brand-stop-1) 12%, transparent) 37.13%,
      color-mix(in oklch, var(--mcafee-color-extended-gradient-brand-stop-2) 12%, transparent) 88.98%
    );
  }

  /* Brand-filled state (selected nav destination, no toggle) */
  .rail-item--brand-filled {
    background: var(--mcafee-color-extended-brand-orange, #e87722);
  }

  .rail-item--brand-filled .rail-item__icon {
    color: var(--mcafee-color-extended-white, #fff);
  }

  .rail-item--disabled {
    opacity: 0.38;
    pointer-events: none;
    cursor: default;
  }

  .rail-item--loading {
    pointer-events: none;
    cursor: default;
  }

  .rail-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--md-sys-color-on-surface);
    font-size: 20px;
  }

  .rail-item__status {
    position: absolute;
    top: 4px;
    right: 4px;
    pointer-events: none;
  }

  /* ── Peek label: right (vertical rail) ── */
  .rail-item__peek {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .rail-item__peek--right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(4px);
  }

  .rail-item__peek--right.rail-item__peek--visible {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  /* ── Peek label: top (horizontal rail) ── */
  .rail-item__peek--top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
  }

  .rail-item__peek--top.rail-item__peek--visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;
