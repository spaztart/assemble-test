import AsmTopbar, { AsmTopbarDesktop } from './topbar.component.js';

export * from './topbar.component.js';
export default AsmTopbar;
export { AsmTopbarDesktop };

customElements.define('asm-topbar', AsmTopbar);
customElements.define('asm-topbar-desktop', AsmTopbarDesktop);

declare global {
  interface HTMLElementTagNameMap {
    'asm-topbar': AsmTopbar;
    'asm-topbar-desktop': AsmTopbarDesktop;
  }
}
