import AsmTabGroup from './tab-group.component.js';

export * from './tab-group.component.js';
export default AsmTabGroup;

customElements.define('asm-tab-group', AsmTabGroup);

declare global {
  interface HTMLElementTagNameMap {
    'asm-tab-group': AsmTabGroup;
  }
}
