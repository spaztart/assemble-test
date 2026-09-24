import AsmPagination from './pagination.component.js';

export * from './pagination.component.js';
export default AsmPagination;

customElements.define('asm-pagination', AsmPagination);

declare global {
  interface HTMLElementTagNameMap {
    'asm-pagination': AsmPagination;
  }
}
