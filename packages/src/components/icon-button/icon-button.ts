import AsmIconButton from './icon-button.component.js';

export * from './icon-button.component.js';
export default AsmIconButton;

customElements.define('asm-icon-button', AsmIconButton);

declare global {
  interface HTMLElementTagNameMap {
    'asm-icon-button': AsmIconButton;
  }
}
