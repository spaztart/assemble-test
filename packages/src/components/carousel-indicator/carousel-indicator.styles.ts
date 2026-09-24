import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
  }

  .carousel-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 12px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md-sys-color-surface-container-highest);
    transition: background 0.2s ease;
  }

  .dot--active {
    background: var(--md-sys-color-primary);
  }
`;
