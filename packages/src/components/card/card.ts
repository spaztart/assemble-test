import AsmCard from './card.component.js';

export * from './card.component.js';
export default AsmCard;

customElements.define('asm-card', AsmCard);

declare global {
  interface HTMLElementTagNameMap {
    'asm-card': AsmCard;
  }
}
