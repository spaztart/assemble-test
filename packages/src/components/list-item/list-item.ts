import AsmListItem from './list-item.component.js';

export * from './list-item.component.js';
export default AsmListItem;

customElements.define('asm-list-item', AsmListItem);

declare global {
  interface HTMLElementTagNameMap {
    'asm-list-item': AsmListItem;
  }
}
