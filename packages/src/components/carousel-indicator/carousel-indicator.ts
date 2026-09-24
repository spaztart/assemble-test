import AsmCarouselIndicator from './carousel-indicator.component.js';

export * from './carousel-indicator.component.js';
export default AsmCarouselIndicator;

customElements.define('asm-carousel-indicator', AsmCarouselIndicator);

declare global {
  interface HTMLElementTagNameMap {
    'asm-carousel-indicator': AsmCarouselIndicator;
  }
}
