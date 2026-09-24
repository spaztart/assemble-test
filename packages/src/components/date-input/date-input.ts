import AsmDateInput from './date-input.component.js';

export * from './date-input.component.js';
export default AsmDateInput;

customElements.define('asm-date-input', AsmDateInput);

declare global {
  interface HTMLElementTagNameMap {
    'asm-date-input': AsmDateInput;
  }
}
