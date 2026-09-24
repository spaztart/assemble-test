import { css as e } from "lit";
const t = e`
  :host {
    display: block;
    height: 100%;
  }

  :host(:not([open])) {
    display: none;
  }

  .side-sheet {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--md-sys-color-surface-bright, var(--md-sys-color-surface));
    border-radius: var(--md-border-radius-16, 16px);
    padding: var(--md-spacing-400, 16px);
    box-shadow: 0 0 20px var(--md-sys-color-shadow);
    box-sizing: border-box;
    overflow: hidden;
  }

  /* ------------------------------------
     Header (sticky top)
     ------------------------------------ */
  .side-sheet__header {
    flex-shrink: 0;
  }

  .side-sheet__header:empty {
    display: none;
  }

  .side-sheet__header:not(:empty) {
    margin-bottom: 10px;
  }

  /* ------------------------------------
     Content (scrolling)
     ------------------------------------ */
  .side-sheet__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* Scrollbar styling */
  .side-sheet__content::-webkit-scrollbar {
    width: 4px;
  }

  .side-sheet__content::-webkit-scrollbar-track {
    background: transparent;
  }

  .side-sheet__content::-webkit-scrollbar-thumb {
    background: color-mix(in oklch, var(--md-sys-color-on-surface) 20%, transparent);
    border-radius: 2px;
  }

  /* ------------------------------------
     Footer (sticky bottom)
     ------------------------------------ */
  .side-sheet__footer {
    flex-shrink: 0;
  }

  .side-sheet__footer:empty {
    display: none;
  }

  .side-sheet__footer:not(:empty) {
    margin-top: 10px;
  }

  /* ------------------------------------
     Slotted content spacing
     ------------------------------------ */
  ::slotted(*) {
    flex-shrink: 0;
  }
`;
export {
  t as default
};
