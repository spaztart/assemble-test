import AsmRadio from './radio.component.js';

export * from './radio.component.js';
export default AsmRadio;

customElements.define('asm-radio', AsmRadio);

declare global {
  interface HTMLElementTagNameMap {
    'asm-radio': AsmRadio;
  }
}
