import AsmSplitButton from './split-button.component.js';

export * from './split-button.component.js';
export default AsmSplitButton;

customElements.define('asm-split-button', AsmSplitButton);

declare global {
  interface HTMLElementTagNameMap {
    'asm-split-button': AsmSplitButton;
  }
}
