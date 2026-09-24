import AsmModal from './modal.component.js';

export * from './modal.component.js';
export default AsmModal;

customElements.define('asm-modal', AsmModal);

declare global {
  interface HTMLElementTagNameMap {
    'asm-modal': AsmModal;
  }
}
