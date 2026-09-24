import AsmSnackbar from './snackbar.component.js';

export * from './snackbar.component.js';
export default AsmSnackbar;

customElements.define('asm-snackbar', AsmSnackbar);

declare global {
  interface HTMLElementTagNameMap {
    'asm-snackbar': AsmSnackbar;
  }
}
