import AsmIcon from './icon.component.js';

export * from './icon.component.js';
export default AsmIcon;

customElements.define('asm-icon', AsmIcon);

declare global {
  interface HTMLElementTagNameMap {
    'asm-icon': AsmIcon;
  }
}
