import AsmFeedback from './feedback.component.js';

export * from './feedback.component.js';
export default AsmFeedback;

customElements.define('asm-feedback', AsmFeedback);

declare global {
  interface HTMLElementTagNameMap {
    'asm-feedback': AsmFeedback;
  }
}
