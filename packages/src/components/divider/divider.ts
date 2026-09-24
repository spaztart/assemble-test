import AsmDivider from './divider.component.js';

export * from './divider.component.js';
export default AsmDivider;

customElements.define('asm-divider', AsmDivider);

declare global {
  interface HTMLElementTagNameMap {
    'asm-divider': AsmDivider;
  }
}
