import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: inherit;
    color: inherit;
  }

  .icon {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: inherit;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'liga';

    /* Variable font axes */
    font-variation-settings:
      'FILL' var(--asm-icon-fill, 0),
      'wght' var(--asm-icon-weight, 400),
      'GRAD' var(--asm-icon-grade, 0),
      'opsz' var(--asm-icon-optical-size, 24);
  }
`;
