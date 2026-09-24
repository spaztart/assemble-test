import AsmTextField from './text-field.component.js';

export * from './text-field.component.js';
export default AsmTextField;

customElements.define('asm-text-field', AsmTextField);

declare global {
  interface HTMLElementTagNameMap {
    'asm-text-field': AsmTextField;
  }
}
