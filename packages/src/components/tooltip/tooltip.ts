import AsmTooltip from './tooltip.component.js';

export * from './tooltip.component.js';
export default AsmTooltip;

customElements.define('asm-tooltip', AsmTooltip);

declare global {
  interface HTMLElementTagNameMap {
    'asm-tooltip': AsmTooltip;
  }
}
