import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .menu {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline-variant, #D4D0D0);
    background: var(--md-sys-color-surface-bright, #FFF);
    box-shadow: var(--md-sys-elevation-level1);
    overflow: hidden;
    min-width: 112px;
    padding: 6px 0;
  }

  ::slotted(asm-menu-item) {
    flex-shrink: 0;
  }
`;
