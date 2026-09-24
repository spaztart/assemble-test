import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './status-notification.styles.js';

export type AsmStatusNotificationStatus = 'critical' | 'attention' | 'info' | 'loader';

/**
 * @tag asm-status-notification
 *
 * @csspart badge - The notification badge pill.
 */
export default class AsmStatusNotification extends LitElement {
  static styles = styles;

  /** Status type (determines color). */
  @property({ reflect: true }) status: AsmStatusNotificationStatus = 'info';

  /** Count number to display. Values >99 show "99+". */
  @property({ type: Number }) count = 0;

  private get _displayCount() {
    if (this.count > 99) return '99+';
    return String(this.count);
  }

  render() {
    const classes = {
      'status-notification': true,
      [`status-notification--${this.status}`]: true,
    };

    return html`
      <span class=${classMap(classes)} part="badge" aria-label="${this.count} notifications">
        ${this.status === 'loader' ? html`
          <span class="status-notification__loader"></span>
        ` : html`
          <span class="status-notification__count">${this._displayCount}</span>
        `}
      </span>
    `;
  }
}
