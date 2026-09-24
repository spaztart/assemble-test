import AsmAlertBanner from './alert-banner.component.js';

export * from './alert-banner.component.js';
export default AsmAlertBanner;

customElements.define('asm-alert-banner', AsmAlertBanner);

declare global {
  interface HTMLElementTagNameMap {
    'asm-alert-banner': AsmAlertBanner;
  }
}
