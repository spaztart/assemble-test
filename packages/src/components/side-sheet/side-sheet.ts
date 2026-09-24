import AsmSideSheet from './side-sheet.component.js';

export * from './side-sheet.component.js';
export default AsmSideSheet;

customElements.define('asm-side-sheet', AsmSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    'asm-side-sheet': AsmSideSheet;
  }
}
