import AsmMenuItem from './menu-item.component.js';

export * from './menu-item.component.js';
export default AsmMenuItem;

customElements.define('asm-menu-item', AsmMenuItem);

declare global {
  interface HTMLElementTagNameMap {
    'asm-menu-item': AsmMenuItem;
  }
}
