import AsmNavDrawer, { AsmNavListItem, AsmNavSection } from './nav-drawer.component.js';

export * from './nav-drawer.component.js';
export default AsmNavDrawer;

customElements.define('asm-nav-drawer', AsmNavDrawer);
customElements.define('asm-nav-list-item', AsmNavListItem);
customElements.define('asm-nav-section', AsmNavSection);

declare global {
  interface HTMLElementTagNameMap {
    'asm-nav-drawer': AsmNavDrawer;
    'asm-nav-list-item': AsmNavListItem;
    'asm-nav-section': AsmNavSection;
  }
}
