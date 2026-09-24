import AsmCheckbox from './checkbox.component.js';

export * from './checkbox.component.js';
export default AsmCheckbox;

customElements.define('asm-checkbox', AsmCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'asm-checkbox': AsmCheckbox;
  }
}
