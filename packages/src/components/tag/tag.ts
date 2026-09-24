import AsmTag from './tag.component.js';

export * from './tag.component.js';
export default AsmTag;

customElements.define('asm-tag', AsmTag);

declare global {
  interface HTMLElementTagNameMap {
    'asm-tag': AsmTag;
  }
}
