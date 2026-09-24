import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .bubble {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: var(--md-sys-color-secondary-fixed, #DFDFFF);
    color: var(--md-sys-color-on-secondary-fixed, #131333);
    border: 1px solid var(--md-sys-color-secondary-fixed, #DFDFFF);
    border-radius: 16px 4px 16px 16px;
    box-sizing: border-box;
  }

  .bubble__text {
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 400;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    line-height: var(--md-sys-typescale-body-large-line-height, 24px);
    color: inherit;
  }

  ::slotted(*) {
    color: var(--md-sys-color-on-secondary-fixed, #131333);
  }
`;
