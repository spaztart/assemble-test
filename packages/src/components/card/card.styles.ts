import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .card {
    position: relative;
    box-sizing: border-box;
    border-radius: var(--asm-card-radius, var(--md-border-radius-24, 24px));
    padding: var(--asm-card-padding, var(--md-spacing-500, 20px));
    box-shadow: var(--asm-card-shadow, none);
    background: var(--asm-card-background);
    color: var(--asm-card-foreground);
    border: var(--asm-card-border, none);
    overflow: hidden;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
  }

  /* ------------------------------------
     Variant: surface (default)
     ------------------------------------ */
  :host([variant="surface"]) .card,
  :host(:not([variant])) .card {
    --asm-card-background: var(--md-sys-color-surface-bright, #fff);
    --asm-card-foreground: var(--md-sys-color-on-surface, #1c1b1f);
  }

  /* ------------------------------------
     Variant: outlined
     ------------------------------------ */
  :host([variant="outlined"]) .card {
    --asm-card-background: var(--md-sys-color-surface-bright, #fff);
    --asm-card-foreground: var(--md-sys-color-on-surface, #1c1b1f);
    --asm-card-border: 1px solid transparent;
    border-image: linear-gradient(
      to right,
      var(--mcafee-color-extended-gradient-brand-stop-1, #ff6900),
      var(--mcafee-color-extended-gradient-brand-stop-2, #6161ff)
    ) 1;
    border-image-slice: 1;
  }

  /* Outlined needs a wrapper trick for rounded corners + gradient border */
  :host([variant="outlined"]) .card {
    border: none;
    background:
      linear-gradient(var(--md-sys-color-surface-bright, #fff), var(--md-sys-color-surface-bright, #fff)) padding-box,
      linear-gradient(
        to right,
        var(--mcafee-color-extended-gradient-brand-stop-1, #ff6900),
        var(--mcafee-color-extended-gradient-brand-stop-2, #6161ff)
      ) border-box;
    border: 1px solid transparent;
  }

  /* ------------------------------------
     Variant: brand
     ------------------------------------ */
  :host([variant="brand"]) .card {
    --asm-card-background: var(--md-sys-color-error, #ba1a1a);
    --asm-card-foreground: var(--md-sys-color-on-error, #fff);
  }

  /* ------------------------------------
     Variant: secondary
     ------------------------------------ */
  :host([variant="secondary"]) .card {
    --asm-card-background: var(--md-sys-color-secondary, #6161ff);
    --asm-card-foreground: var(--md-sys-color-on-secondary, #fff);
  }

  /* ------------------------------------
     Variant: positive
     ------------------------------------ */
  :host([variant="positive"]) .card {
    --asm-card-background: var(--mcafee-color-extended-positive, var(--md-ref-palette-positive50, #00a67e));
    --asm-card-foreground: var(--mcafee-color-extended-on-positive, #fff);
  }

  /* ------------------------------------
     Variant: gradient
     ------------------------------------ */
  :host([variant="gradient"]) .card {
    --asm-card-background: linear-gradient(
      248deg,
      var(--md-sys-color-secondary-container, #e7e1ff) 0%,
      var(--mcafee-color-extended-positive-container, #97fcea) 98%
    );
    --asm-card-foreground: var(--md-sys-color-on-secondary-container, #1d192b);
    background: linear-gradient(
      248deg,
      var(--md-sys-color-secondary-container, #e7e1ff) 0%,
      var(--mcafee-color-extended-positive-container, #97fcea) 98%
    );
  }

  /* ------------------------------------
     Interactive state layer
     ------------------------------------ */
  .card__state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    background: currentColor;
    transition: opacity 0.2s;
  }

  :host([clickable]) .card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  :host([clickable]) .card:hover .card__state-layer {
    opacity: 0.08;
  }

  :host([clickable]) .card:active .card__state-layer {
    opacity: 0.12;
  }

  :host([clickable]) .card:focus-visible {
    outline: 2px solid var(--md-sys-color-primary, #6750a4);
    outline-offset: 2px;
  }

  :host([clickable]) .card:focus-visible .card__state-layer {
    opacity: 0.10;
  }

  /* ------------------------------------
     Elevation levels
     ------------------------------------ */
  :host([elevation="1"]) .card {
    box-shadow: var(--md-sys-elevation-level1);
  }

  :host([elevation="5"]) .card {
    box-shadow: var(--md-sys-elevation-level5);
  }
`;
