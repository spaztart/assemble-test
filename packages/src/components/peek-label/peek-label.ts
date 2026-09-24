import AsmPeekLabel from './peek-label.component.js';

export * from './peek-label.component.js';
export default AsmPeekLabel;

customElements.define('asm-peek-label', AsmPeekLabel);

declare global {
  interface HTMLElementTagNameMap {
    'asm-peek-label': AsmPeekLabel;
  }
}
