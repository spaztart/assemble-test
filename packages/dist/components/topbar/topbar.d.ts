import AsmTopbar, { AsmTopbarDesktop } from './topbar.component.js';
export * from './topbar.component.js';
export default AsmTopbar;
export { AsmTopbarDesktop };
declare global {
    interface HTMLElementTagNameMap {
        'asm-topbar': AsmTopbar;
        'asm-topbar-desktop': AsmTopbarDesktop;
    }
}
//# sourceMappingURL=topbar.d.ts.map