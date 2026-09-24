import AsmButton from './button.component.js';

export * from './button.component.js';
export default AsmButton;

customElements.define('asm-button', AsmButton);

declare global {
  interface HTMLElementTagNameMap {
    'asm-button': AsmButton;
  }
}
