import AsmBadge from './badge.component.js';

export * from './badge.component.js';
export default AsmBadge;

customElements.define('asm-badge', AsmBadge);

declare global {
  interface HTMLElementTagNameMap {
    'asm-badge': AsmBadge;
  }
}
