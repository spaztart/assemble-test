import AsmStatusNotification from './status-notification.component.js';

export * from './status-notification.component.js';
export default AsmStatusNotification;

customElements.define('asm-status-notification', AsmStatusNotification);

declare global {
  interface HTMLElementTagNameMap {
    'asm-status-notification': AsmStatusNotification;
  }
}
