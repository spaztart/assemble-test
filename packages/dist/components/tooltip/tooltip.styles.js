import { css as t } from "lit";
const i = t`
  :host {
    display: inline-block;
  }

  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .tooltip {
    position: absolute;
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.43;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 1000;
  }

  .tooltip--visible {
    opacity: 1;
  }

  .tooltip--multi-line {
    white-space: normal;
    max-width: 200px;
    text-align: center;
  }

  /* Position: top (default) */
  .tooltip--top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
  }

  /* Position: bottom */
  .tooltip--bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
  }

  /* Position: left */
  .tooltip--left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(-8px);
  }

  /* Position: right */
  .tooltip--right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(8px);
  }
`;
export {
  i as default
};
