import AsmBrand from './brand.component.js';

export * from './brand.component.js';
export default AsmBrand;

customElements.define('asm-brand', AsmBrand);

declare global {
  interface HTMLElementTagNameMap {
    'asm-brand': AsmBrand;
  }
}
