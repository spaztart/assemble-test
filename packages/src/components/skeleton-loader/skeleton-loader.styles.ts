import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .skeleton {
    background: var(--md-sys-color-surface-container);
    overflow: hidden;
    position: relative;
  }

  /* Shimmer animation */
  .skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in oklch, var(--md-sys-color-surface-bright, #fff) 40%, transparent) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }

  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }

  /* Shape presets */
  .skeleton--card {
    width: 100%;
    height: 200px;
    border-radius: 12px;
  }

  .skeleton--standalone-text {
    width: 100%;
    height: 16px;
    border-radius: 4px;
  }

  .skeleton--icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .skeleton--list-item {
    width: 100%;
    height: 48px;
    border-radius: 8px;
  }

  .skeleton--neutral-shape {
    width: 100%;
    height: 100px;
    border-radius: 8px;
  }

  .skeleton--tile {
    width: 100%;
    height: 120px;
    border-radius: 12px;
  }

  .skeleton--button {
    width: 120px;
    height: 40px;
    border-radius: 999px;
  }
`;
