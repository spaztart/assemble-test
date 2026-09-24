import AsmNavigationRail from './navigation-rail.component.js';
import AsmNavigationRailItem from './navigation-rail-item.component.js';

export * from './navigation-rail.component.js';
export * from './navigation-rail-item.component.js';
export { AsmNavigationRail, AsmNavigationRailItem };

customElements.define('asm-navigation-rail', AsmNavigationRail);
customElements.define('asm-navigation-rail-item', AsmNavigationRailItem);

declare global {
  interface HTMLElementTagNameMap {
    'asm-navigation-rail': AsmNavigationRail;
    'asm-navigation-rail-item': AsmNavigationRailItem;
  }
}
