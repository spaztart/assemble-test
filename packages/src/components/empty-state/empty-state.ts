import AsmEmptyState from './empty-state.component.js';

export * from './empty-state.component.js';
export default AsmEmptyState;

customElements.define('asm-empty-state', AsmEmptyState);

declare global {
  interface HTMLElementTagNameMap {
    'asm-empty-state': AsmEmptyState;
  }
}
