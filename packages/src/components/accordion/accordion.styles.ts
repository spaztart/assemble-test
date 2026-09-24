import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  .accordion {
    border: none;
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    background: var(--md-sys-color-surface-bright, #fff);
    position: relative;
  }

  .accordion--white {
    background: var(--md-sys-color-surface-bright, #fff);
  }

  .accordion--gray {
    background: var(--md-sys-color-surface);
  }

  /* State layer covers the entire accordion item */
  .accordion::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-state-neutral-hover, var(--md-ref-palette-neutral60, #929094));
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 0;
  }

  .accordion:hover::before {
    opacity: 0.08;
  }

  .accordion:active::before {
    opacity: 0.12;
  }

  .accordion--expanded::before {
    opacity: 0.08;
  }

  .accordion--expanded:hover::before {
    opacity: 0.10;
  }

  .accordion--expanded:active::before {
    opacity: 0.12;
  }

  /* Border on container — always present for non-default states */
  .accordion {
    border: 1px solid transparent;
    transition: border-color 0.15s, background 0.15s;
  }

  .accordion:hover,
  .accordion:active,
  .accordion--expanded {
    border-color: var(--md-sys-color-outline-variant);
  }

  /* Header */
  .accordion__header {
    display: flex;
    align-items: center;
    gap: var(--md-spacing-300, 12px);
    padding: var(--md-spacing-400, 16px);
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    z-index: 1;
  }

  .accordion__header:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
    border-radius: 12px;
  }

  .accordion__leading-icon {
    font-size: 24px;
    color: var(--md-sys-color-on-surface);
    flex-shrink: 0;
  }

  .accordion__title {
    flex: 1;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--md-sys-color-on-surface);
  }

  .accordion__chevron {
    font-size: 24px;
    color: var(--md-sys-color-on-surface);
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .accordion--expanded .accordion__chevron {
    transform: rotate(180deg);
  }

  /* Body (animated) */
  .accordion__body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease;
    position: relative;
    z-index: 1;
  }

  .accordion--expanded .accordion__body {
    grid-template-rows: 1fr;
  }

  .accordion__content {
    overflow: hidden;
    min-width: 0;
    padding: 0 var(--md-spacing-400, 16px);
  }

  .accordion--expanded .accordion__content {
    padding-bottom: var(--md-spacing-400, 16px);
  }

  .accordion__content ::slotted(*) {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: var(--md-sys-color-on-surface);
  }
`;
