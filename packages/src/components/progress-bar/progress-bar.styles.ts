import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    border-radius: 999px;
    overflow: hidden;
    background: var(--md-sys-color-surface-container-highest);
  }

  .progress-bar--thick {
    height: 14px;
  }

  .progress-bar--thin {
    height: 8px;
  }

  .progress-bar__fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  /* Status colors */
  .progress-bar--brand .progress-bar__fill {
    background: linear-gradient(90deg, var(--mcafee-gradient-brand-stop-1, #c8102e), var(--mcafee-gradient-brand-stop-2, #6b2fa0));
  }

  .progress-bar--brand {
    background: var(--md-sys-color-surface-container-highest);
  }

  .progress-bar--moderate .progress-bar__fill {
    background: var(--md-sys-color-secondary);
  }

  .progress-bar--moderate {
    background: var(--md-sys-color-secondary-container);
  }

  .progress-bar--critical .progress-bar__fill {
    background: var(--mcafee-color-extended-brand-orange, #e87722);
  }

  .progress-bar--critical {
    background: var(--md-sys-color-error-container);
  }

  .progress-bar--low .progress-bar__fill {
    background: var(--mcafee-color-extended-positive, #2e7d32);
  }

  .progress-bar--low {
    background: var(--mcafee-color-extended-positive-container, #c8e6c9);
  }
`;
