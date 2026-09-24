import AsmTab from './tab.component.js';

export * from './tab.component.js';
export default AsmTab;

customElements.define('asm-tab', AsmTab);

declare global {
  interface HTMLElementTagNameMap {
    'asm-tab': AsmTab;
  }
}
