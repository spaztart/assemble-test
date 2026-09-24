import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './alert-banner.styles.js';
import '../icon/icon.js';

export type AsmAlertBannerMode = 'neutral' | 'info' | 'critical' | 'positive' | 'status';

/**
 * @tag asm-alert-banner
 *
 * A compact, dismissable alert banner.
 *
 * Layout (per Figma `alert_banner`):
 * - 44px min height, 12px padding, 8px radius
 * - Left: leading icon (18px) + title text
 * - Right: optional action link + 20px close icon
 *
 * @csspart container - The banner container.
 * @csspart icon - The leading icon.
 * @csspart title - The title text.
 * @csspart action - The action link.
 * @csspart close - The close button.
 *
 * @fires action - Fired when the action link is clicked.
 * @fires close - Fired when the close button is clicked.
 */
export default class AsmAlertBanner extends LitElement {
  static styles = styles;

  /** Headline text shown to the right of the leading icon. */
  @property() title = '';

  /** Visual mode controlling background and content colour. */
  @property({ reflect: true }) mode: AsmAlertBannerMode = 'neutral';

  /** Leading Material Symbols icon name. */
  @property() icon = 'notification_important';

  /** Optional action link label (e.g. "View plans"). When empty, no link is rendered. */
  @property({ attribute: 'action-label' }) actionLabel = '';

  /** Whether the close button is shown. */
  @property({ type: Boolean, attribute: 'show-close' }) showClose = true;

  /** Accessible label for the close button. */
  @property({ attribute: 'close-label' }) closeLabel = 'Dismiss';

  private _handleAction() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }));
  }

  private _handleClose() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    const classes = {
      'banner': true,
      [`banner--${this.mode}`]: true,
    };

    return html`
      <div
        class=${classMap(classes)}
        part="container"
        role="status"
        aria-live="polite"
        aria-label=${this.title}
      >
        <div class="banner__leading">
          <asm-icon class="banner__icon" part="icon" name=${this.icon}></asm-icon>
          <span class="banner__title" part="title">${this.title}</span>
          ${this.actionLabel ? html`
            <button
              class="banner__action"
              part="action"
              @click=${this._handleAction}
              aria-label=${this.actionLabel}
            >${this.actionLabel}</button>
          ` : nothing}
        </div>
        <div class="banner__trailing">
          ${this.showClose ? html`
            <button
              class="banner__close"
              part="close"
              aria-label=${this.closeLabel}
              @click=${this._handleClose}
            >
              <asm-icon name="close"></asm-icon>
            </button>
          ` : nothing}
        </div>
      </div>
    `;
  }
}
