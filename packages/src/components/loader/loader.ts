import AsmLoader from './loader.component.js';

export * from './loader.component.js';
export default AsmLoader;

customElements.define('asm-loader', AsmLoader);

declare global {
  interface HTMLElementTagNameMap {
    'asm-loader': AsmLoader;
  }
}
