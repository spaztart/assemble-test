import { css as e } from "lit";
const t = e`
  :host {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    box-sizing: border-box;
  }

  .rail {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--md-spacing-100, 4px);
    border-radius: var(--md-border-radius-16, 16px);
    background: var(--md-sys-color-surface-bright);
    box-shadow: var(--md-sys-elevation-level5, 0px 0px 20px 0px var(--md-sys-color-shadow));
    height: var(--asm-rail-height, 100%);
    box-sizing: border-box;
    overflow: visible;
  }

  :host([orientation="horizontal"]) .rail {
    flex-direction: row;
    height: auto;
    width: var(--asm-rail-width, auto);
  }

  .rail__top,
  .rail__middle,
  .rail__bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md-spacing-100, 4px);
  }

  :host([orientation="horizontal"]) .rail__top,
  :host([orientation="horizontal"]) .rail__middle,
  :host([orientation="horizontal"]) .rail__bottom {
    flex-direction: row;
  }

  /* ── Slot (52×52 interactive icon cell) ── */
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

  .rail-item:hover::after {
    opacity: 0.08;
  }

  .rail-item:focus-visible::after {
    opacity: 0.1;
  }

  .rail-item:active::after {
    opacity: 0.12;
  }

  .rail-item--active {
    background: linear-gradient(
      60deg,
      color-mix(in oklch, var(--mcafee-color-extended-gradient-brand-stop-1) 12%, transparent) 37.13%,
      color-mix(in oklch, var(--mcafee-color-extended-gradient-brand-stop-2) 12%, transparent) 88.98%
    );
  }

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

  .rail-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--md-sys-color-on-surface);
    font-size: 20px;
  }

  /* ── Status dot overlay ── */
  .rail-item__status {
    position: absolute;
    top: 4px;
    right: 4px;
    pointer-events: none;
  }

  /* ── Brand slot ── */
  .rail-brand {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    padding: 4px 0;
    border-radius: var(--md-border-radius-12, 12px);
    box-sizing: border-box;
    outline: none;
    border: none;
  }

  .rail-brand--decorative {
    background: var(--mcafee-color-extended-brand-orange, #e87722);
    cursor: default;
  }

  .rail-brand--interactive {
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .rail-brand--interactive::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-state-neutral-hover);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .rail-brand--interactive:hover::after {
    opacity: 0.08;
  }

  .rail-brand--interactive:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .rail-brand--interactive:focus-visible::after {
    opacity: 0.1;
  }

  .rail-brand--interactive.rail-brand--active {
    background: var(--mcafee-color-extended-brand-orange, #e87722);
  }

  .rail-brand__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Peek label positioning ── */
  .rail-item__peek,
  .rail-brand__peek {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .rail-item__peek--right,
  .rail-brand__peek {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(4px);
  }

  .rail-item__peek--right.rail-item__peek--visible,
  .rail-brand__peek--visible {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

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
export {
  t as default
};
