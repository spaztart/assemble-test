import AsmAccordionItem from './accordion.component.js';

export * from './accordion.component.js';
export default AsmAccordionItem;

customElements.define('asm-accordion-item', AsmAccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'asm-accordion-item': AsmAccordionItem;
  }
}
