import AsmToggleGroup from './toggle-group.component.js';
import AsmToggleItem from './toggle-item.component.js';

export * from './toggle-group.component.js';
export { AsmToggleItem };
export default AsmToggleGroup;

customElements.define('asm-toggle-group', AsmToggleGroup);
customElements.define('asm-toggle-item', AsmToggleItem);

declare global {
  interface HTMLElementTagNameMap {
    'asm-toggle-group': AsmToggleGroup;
    'asm-toggle-item': AsmToggleItem;
  }
}
