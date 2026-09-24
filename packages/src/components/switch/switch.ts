import AsmSwitch from './switch.component.js';

export * from './switch.component.js';
export default AsmSwitch;

customElements.define('asm-switch', AsmSwitch);

declare global {
  interface HTMLElementTagNameMap {
    'asm-switch': AsmSwitch;
  }
}
