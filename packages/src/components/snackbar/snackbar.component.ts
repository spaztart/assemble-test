import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './snackbar.styles.js';
import '../icon/icon.js';

/**
 * @tag asm-snackbar
 *
 * @csspart snackbar - The snackbar container.
 * @csspart message - The message text.
 * @csspart action - The action button.
 * @csspart close - The close button.
 *
 * @fires action - Fired when the action button is clicked.
 * @fires close - Fired when the close button is clicked.
 */
export default class AsmSnackbar extends LitElement {
  static styles = styles;

  /** Snackbar message. */
  @property() message = '';

  /** Action button label. */
  @property({ attribute: 'action-label' }) actionLabel = '';

  /** Whether the snackbar is visible. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Auto-dismiss duration in ms (0 = no auto-dismiss). */
  @property({ type: Number, attribute: 'duration' }) duration = 0;

  /** Icon name shown before message. */
  @property({ attribute: 'leading-icon' }) leadingIcon = '';

  private _dismissTimer?: ReturnType<typeof setTimeout>;

  updated(changed: Map<string, unknown>) {
    if (changed.has('open') && this.open && this.duration > 0) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = setTimeout(() => this._handleClose(), this.duration);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._dismissTimer);
  }

  private _handleAction() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }));
  }

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    const classes = {
      'snackbar': true,
      'snackbar--open': this.open,
    };

    return html`
      <div class=${classMap(classes)} part="snackbar" role="status" aria-live="polite">
        ${this.leadingIcon ? html`<asm-icon class="snackbar__leading-icon" name=${this.leadingIcon}></asm-icon>` : nothing}
        <span class="snackbar__message" part="message">${this.message}</span>
        <div class="snackbar__actions">
          ${this.actionLabel ? html`
            <button class="snackbar__action" part="action" @click=${this._handleAction}>
              ${this.actionLabel}
            </button>
          ` : nothing}
          <button class="snackbar__close" part="close" aria-label="Close" @click=${this._handleClose}>
            <asm-icon name="close"></asm-icon>
          </button>
        </div>
      </div>
    `;
  }
}
