import AsmTable from './table.component.js';

export * from './table.component.js';
export default AsmTable;

customElements.define('asm-table', AsmTable);

declare global {
  interface HTMLElementTagNameMap {
    'asm-table': AsmTable;
  }
}
