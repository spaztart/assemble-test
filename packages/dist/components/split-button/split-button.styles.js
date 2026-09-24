import { css as t } from "lit";
const i = t`
  :host {
    display: inline-flex;
    position: relative;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .split-button {
    display: inline-flex;
    align-items: stretch;
    border-radius: 999px;
    overflow: hidden;
  }

  /* ── Action button (left) ── */
  .split-button__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s, color 0.2s;
    border-radius: 999px 0 0 999px;
  }

  .split-button__action-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    gap: var(--md-spacing-200, 8px);
  }

  .split-button__action-state {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .split-button__action:hover .split-button__action-state { opacity: 0.08; }
  .split-button__action:active .split-button__action-state { opacity: 0.12; }
  .split-button__action:focus-visible .split-button__action-state { opacity: 0.10; }
  .split-button__action:disabled .split-button__action-state { opacity: 0; }

  .split-button__start-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: inherit;
  }

  .split-button__label {
    display: inline-flex;
    align-items: center;
  }

  /* ── Divider ── */
  .split-button__divider {
    width: 1px;
    align-self: stretch;
    flex-shrink: 0;
    z-index: 1;
  }

  /* ── Trigger button (right) ── */
  .split-button__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s, color 0.2s;
    border-radius: 0 999px 999px 0;
  }

  .split-button__trigger-state {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .split-button__trigger:hover .split-button__trigger-state { opacity: 0.08; }
  .split-button__trigger:active .split-button__trigger-state { opacity: 0.12; }
  .split-button__trigger:focus-visible .split-button__trigger-state { opacity: 0.10; }
  .split-button__trigger:disabled .split-button__trigger-state { opacity: 0; }

  .split-button__trigger-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transition: transform 0.2s;
  }

  :host([open]) .split-button__trigger-icon {
    transform: rotate(180deg);
  }

  /* ── Sizes ── */
  .split-button--huge .split-button__action {
    padding: var(--md-spacing-400, 16px) var(--md-spacing-600, 24px);
    min-height: 66px;
    font-size: 14px;
    line-height: 20px;
  }
  .split-button--huge .split-button__action-content { gap: var(--md-spacing-300, 12px); }
  .split-button--huge .split-button__start-icon { font-size: 20px; }
  .split-button--huge .split-button__trigger {
    padding: 0 var(--md-spacing-400, 16px);
    min-height: 66px;
  }
  .split-button--huge .split-button__trigger-icon { font-size: 24px; }

  .split-button--spacious .split-button__action {
    padding: var(--md-spacing-300, 12px) var(--md-spacing-400, 16px);
    min-height: 56px;
    font-size: 14px;
    line-height: 20px;
  }
  .split-button--spacious .split-button__start-icon { font-size: 20px; }
  .split-button--spacious .split-button__trigger {
    padding: 0 var(--md-spacing-300, 12px);
    min-height: 56px;
  }
  .split-button--spacious .split-button__trigger-icon { font-size: 22px; }

  .split-button--default .split-button__action {
    padding: var(--md-spacing-300, 12px) var(--md-spacing-400, 16px);
    min-height: 48px;
    font-size: 14px;
    line-height: 20px;
  }
  .split-button--default .split-button__start-icon { font-size: 16px; }
  .split-button--default .split-button__trigger {
    padding: 0 var(--md-spacing-300, 12px);
    min-height: 48px;
  }
  .split-button--default .split-button__trigger-icon { font-size: 20px; }

  .split-button--compact .split-button__action {
    padding: var(--md-spacing-200, 8px) var(--md-spacing-300, 12px);
    font-size: 12px;
    line-height: 16px;
  }
  .split-button--compact .split-button__start-icon { font-size: 16px; }
  .split-button--compact .split-button__trigger {
    padding: 0 var(--md-spacing-200, 8px);
  }
  .split-button--compact .split-button__trigger-icon { font-size: 18px; }

  /* ── Variant: filled ── */
  .split-button--filled .split-button__action {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .split-button--filled .split-button__action-state { background: var(--md-sys-state-primary-hover); }
  .split-button--filled .split-button__trigger {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .split-button--filled .split-button__trigger-state { background: var(--md-sys-state-primary-hover); }
  .split-button--filled .split-button__divider {
    background: color-mix(in oklch, var(--md-sys-color-on-primary) 30%, transparent);
  }

  /* ── Variant: tonal ── */
  .split-button--tonal .split-button__action {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
  }
  .split-button--tonal .split-button__action-state { background: var(--md-sys-state-neutral-hover); }
  .split-button--tonal .split-button__trigger {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
  }
  .split-button--tonal .split-button__trigger-state { background: var(--md-sys-state-neutral-hover); }
  .split-button--tonal .split-button__divider {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 20%, transparent);
  }

  /* ── Variant: outline ── */
  .split-button--outline .split-button__action {
    background: transparent;
    color: var(--md-sys-color-on-surface);
  }
  .split-button--outline .split-button__action-state { background: var(--md-sys-state-neutral-hover); }
  .split-button--outline .split-button__trigger {
    background: transparent;
    color: var(--md-sys-color-on-surface);
  }
  .split-button--outline .split-button__trigger-state { background: var(--md-sys-state-neutral-hover); }
  .split-button--outline .split-button__divider {
    background: var(--md-sys-color-outline);
  }
  .split-button--outline .split-button {
    border: 1px solid var(--md-sys-color-outline);
  }
  .split-button--outline .split-button__action {
    border: 1px solid var(--md-sys-color-outline);
    border-right: none;
  }
  .split-button--outline .split-button__trigger {
    border: 1px solid var(--md-sys-color-outline);
    border-left: none;
  }

  /* ── Destructive ── */
  .split-button--filled.split-button--destructive .split-button__action {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }
  .split-button--filled.split-button--destructive .split-button__action-state { background: var(--md-sys-state-error-hover); }
  .split-button--filled.split-button--destructive .split-button__trigger {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }
  .split-button--filled.split-button--destructive .split-button__trigger-state { background: var(--md-sys-state-error-hover); }
  .split-button--filled.split-button--destructive .split-button__divider {
    background: color-mix(in oklch, var(--md-sys-color-on-error) 30%, transparent);
  }

  .split-button--tonal.split-button--destructive .split-button__action {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .split-button--tonal.split-button--destructive .split-button__action-state { background: var(--md-sys-state-error-hover); }
  .split-button--tonal.split-button--destructive .split-button__trigger {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .split-button--tonal.split-button--destructive .split-button__trigger-state { background: var(--md-sys-state-error-hover); }
  .split-button--tonal.split-button--destructive .split-button__divider {
    background: color-mix(in oklch, var(--md-sys-color-error) 50%, transparent);
  }

  /* ── Disabled ── */
  .split-button__action:disabled {
    cursor: default;
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    border-color: color-mix(in oklch, var(--md-sys-color-outline) 38%, transparent);
  }
  .split-button__trigger:disabled {
    cursor: default;
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in oklch, var(--md-sys-color-on-surface) 38%, transparent);
    border-color: color-mix(in oklch, var(--md-sys-color-outline) 38%, transparent);
  }
  :host([disabled]) .split-button__divider {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 20%, transparent);
  }

  /* ── Focus ring ── */
  .split-button__action:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    z-index: 2;
  }
  .split-button__trigger:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    z-index: 2;
  }

  /* ── Dropdown (slotted menu) ── */
  .split-button__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    z-index: 100;
    display: none;
  }

  :host([open]) .split-button__dropdown {
    display: block;
  }
`;
export {
  i as default
};
