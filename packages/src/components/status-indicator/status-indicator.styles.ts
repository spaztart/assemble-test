import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
  }

  /* Dot */
  .status-indicator__dot {
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Sizes */
  .status-indicator--small .status-indicator__dot {
    width: 8px;
    height: 8px;
  }

  .status-indicator--medium .status-indicator__dot {
    width: 10px;
    height: 10px;
  }

  .status-indicator--large .status-indicator__dot {
    width: 12px;
    height: 12px;
  }

  /* Label */
  .status-indicator__label {
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.43;
    color: var(--md-sys-color-on-surface);
  }

  /* ====================================
     Colored style
     ==================================== */
  .status-indicator--colored.status-indicator--critical .status-indicator__dot {
    background: var(--md-sys-color-error);
  }

  .status-indicator--colored.status-indicator--attention .status-indicator__dot {
    background: #f59e0b;
  }

  .status-indicator--colored.status-indicator--info .status-indicator__dot {
    background: var(--md-sys-color-primary);
  }

  .status-indicator--colored.status-indicator--muted .status-indicator__dot {
    background: var(--md-sys-color-outline);
  }

  .status-indicator--colored.status-indicator--offline .status-indicator__dot {
    background: var(--md-sys-color-outline-variant);
  }

  .status-indicator--colored.status-indicator--positive .status-indicator__dot {
    background: #22c55e;
  }

  /* ====================================
     Neutral style
     ==================================== */
  .status-indicator--neutral .status-indicator__dot {
    background: var(--md-sys-color-on-surface-variant);
  }

  /* ====================================
     Inverse style
     ==================================== */
  .status-indicator--inverse .status-indicator__dot {
    background: var(--md-sys-color-inverse-surface);
  }

  .status-indicator--inverse .status-indicator__label {
    color: var(--md-sys-color-inverse-on-surface);
  }
`;
