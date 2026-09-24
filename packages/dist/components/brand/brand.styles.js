import { css as e } from "lit";
const a = e`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }

  .brand svg {
    height: var(--asm-brand-height, 16px);
    width: auto;
  }

  /* Color variants */
  .brand--primary {
    color: var(--md-sys-color-primary);
  }

  .brand--brand {
    color: var(--mcafee-color-extended-brand, #c8102e);
  }

  .brand--brand-orange {
    color: var(--mcafee-color-extended-brand-orange, #e87722);
  }

  .brand--white {
    color: #fff;
  }

  /* Sizes */
  :host([size="sm"]) .brand svg {
    height: 16px;
  }

  :host([size="md"]) .brand svg {
    height: 32px;
  }

  :host([size="lg"]) .brand svg {
    height: 48px;
  }

  :host([size="xl"]) .brand svg {
    height: 64px;
  }

  /* Custom height override — wins over size presets */
  :host([height]) .brand svg {
    height: var(--asm-brand-height);
  }
`;
export {
  a as default
};
