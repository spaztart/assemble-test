import AsmMenu from './menu.component.js';

export * from './menu.component.js';
export default AsmMenu;

customElements.define('asm-menu', AsmMenu);

declare global {
  interface HTMLElementTagNameMap {
    'asm-menu': AsmMenu;
  }
}
