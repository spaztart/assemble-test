import { css } from 'lit';

export default css`
  :host {
    display: contents;
  }

  /* ------------------------------------
     Overlay / Backdrop
     ------------------------------------ */
  .modal__overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in oklch, var(--md-sys-color-scrim, #000) 20%, transparent);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    animation: modal-fade-in 0.25s ease-out;
  }

  @keyframes modal-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ------------------------------------
     Surface
     ------------------------------------ */
  .modal__surface {
    position: relative;
    background: var(--md-sys-color-surface);
    border-radius: 28px;
    box-shadow: 0 0 20px color-mix(in oklch, var(--md-sys-color-shadow) 20%, transparent);
    max-width: calc(100vw - 48px);
    max-height: calc(100vh - 48px);
    overflow: auto;
    animation: modal-scale-in 0.25s ease-out;
  }

  @keyframes modal-scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal__surface--gradient {
    background: var(--mcafee-surface-gradient-high-energy, linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary)));
    color: var(--mcafee-color-extended-white, #fff);
  }

  /* ------------------------------------
     Close button
     ------------------------------------ */
  .modal__close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 50%;
    color: var(--md-sys-color-on-surface);
    transition: background 0.15s;
    font-size: 24px;
  }

  .modal__close:hover {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .modal__close:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .modal__surface--gradient .modal__close {
    color: var(--mcafee-color-extended-white, #fff);
  }

  .modal__surface--gradient .modal__close:hover {
    background: color-mix(in oklch, #fff 12%, transparent);
  }

  /* ------------------------------------
     Content
     ------------------------------------ */
  .modal__content {
    padding: 24px;
  }

  /* ------------------------------------
     Standard variant (header/body/actions)
     ------------------------------------ */
  .modal__header {
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 700;
    font-size: var(--md-sys-typescale-headline-medium-size, 28px);
    line-height: var(--md-sys-typescale-headline-medium-line-height, 36px);
    color: var(--md-sys-color-on-surface);
    margin: 0 32px 0 0;
    padding: 0;
  }

  .modal__surface--gradient .modal__header {
    color: var(--mcafee-color-extended-white, #fff);
  }

  .modal__body {
    font-family: 'McAfee Sans', sans-serif;
    font-weight: 400;
    font-size: var(--md-sys-typescale-body-large-size, 16px);
    line-height: var(--md-sys-typescale-body-large-line-height, 24px);
    color: var(--md-sys-color-on-surface);
    margin: 16px 0 0 0;
    padding: 0;
  }

  .modal__surface--gradient .modal__body {
    color: var(--mcafee-color-extended-white, #fff);
  }

  .modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }

  .modal__actions:empty {
    display: none;
  }
`;
