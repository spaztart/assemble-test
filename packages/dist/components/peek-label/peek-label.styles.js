import { css as e } from "lit";
const s = e`
  :host {
    display: inline-block;
  }

  .peek-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 16px;
    border-radius: 12px;
    background: var(--md-sys-color-surface-bright, var(--md-sys-color-surface));
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    font-family: 'McAfee Sans', sans-serif;
    font-size: var(--md-sys-typescale-label-large-size, 14px);
    font-weight: 400;
    line-height: var(--md-sys-typescale-label-large-line-height, 20px);
    color: var(--md-sys-color-on-surface);
    white-space: nowrap;
    pointer-events: none;
  }

  .peek-label--small {
    height: 28px;
    font-size: var(--md-sys-typescale-label-medium-size, 12px);
    padding: 4px 12px;
  }

  .peek-label--default {
    height: 32px;
  }

  .peek-label--offline {
    color: var(--md-sys-color-outline);
  }

  .peek-label--offline asm-icon {
    color: var(--md-sys-color-outline);
  }

  .peek-label asm-icon {
    font-size: 16px;
    color: var(--md-sys-color-on-surface);
  }
`;
export {
  s as default
};
