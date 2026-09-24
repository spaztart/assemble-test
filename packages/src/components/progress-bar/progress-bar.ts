import AsmProgressBar from './progress-bar.component.js';

export * from './progress-bar.component.js';
export default AsmProgressBar;

customElements.define('asm-progress-bar', AsmProgressBar);

declare global {
  interface HTMLElementTagNameMap {
    'asm-progress-bar': AsmProgressBar;
  }
}
