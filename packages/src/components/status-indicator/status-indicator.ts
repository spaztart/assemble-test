import AsmStatusIndicator from './status-indicator.component.js';

export * from './status-indicator.component.js';
export default AsmStatusIndicator;

customElements.define('asm-status-indicator', AsmStatusIndicator);

declare global {
  interface HTMLElementTagNameMap {
    'asm-status-indicator': AsmStatusIndicator;
  }
}
