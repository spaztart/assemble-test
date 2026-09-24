import AsmPhoneput from './phoneput.component.js';

export * from './phoneput.component.js';
export default AsmPhoneput;

customElements.define('asm-phoneput', AsmPhoneput);

declare global {
  interface HTMLElementTagNameMap {
    'asm-phoneput': AsmPhoneput;
  }
}
