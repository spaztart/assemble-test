import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .loader {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .loader svg {
    animation: asm-loader-spin 1.1s linear infinite;
  }

  .track {
    stroke: var(--md-sys-color-surface-container-highest);
    fill: none;
  }

  .arc {
    fill: none;
    stroke: var(--md-sys-color-secondary);
    stroke-linecap: round;
  }

  @keyframes asm-loader-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader svg {
      animation: none;
    }
  }

  /* AI Loader */
  .ai-loader {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ai-loader__bubble {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      var(--md-sys-color-primary),
      var(--md-sys-color-error),
      var(--md-sys-color-primary)
    );
    animation: asm-ai-bubble-spin 1.8s linear infinite;
    flex-shrink: 0;
  }

  .ai-loader__text {
    font-family: 'McAfee Sans Mono', monospace;
    font-size: var(--md-sys-typescale-body-medium-size, 14px);
    line-height: var(--md-sys-typescale-body-medium-line-height, 20px);
    color: var(--md-sys-color-on-surface);
  }

  @keyframes asm-ai-bubble-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-loader__bubble {
      animation: none;
    }
  }
`;
