import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './tag.styles.js';
import '../icon/icon.js';

export type AsmTagVariant = 'standard' | 'critical' | 'filter';

/**
 * @tag asm-tag
 *
 * @csspart tag - The tag container.
 * @csspart label - The label text.
 * @csspart close - The close button (filter variant).
 *
 * @fires close - Fired when close button is clicked (filter variant).
 */
export default class AsmTag extends LitElement {
  static styles = styles;

  /** Tag label text. */
  @property() label = '';

  /** Visual variant. */
  @property({ reflect: true }) variant: AsmTagVariant = 'standard';

  /** Leading icon name. */
  @property({ attribute: 'leading-icon' }) leadingIcon = '';

  /** Whether the close button is shown (filter variant). */
  @property({ type: Boolean }) closable = false;

  /** Accessible label for the close button. */
  @property({ attribute: 'close-label' }) closeLabel = 'Remove';

  private _handleClose(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  render() {
    const classes = {
      'tag': true,
      [`tag--${this.variant}`]: true,
    };

    const showClose = this.variant === 'filter' && this.closable;

    return html`
      <span class=${classMap(classes)} part="tag">
        ${this.leadingIcon ? html`<asm-icon class="tag__icon" name=${this.leadingIcon}></asm-icon>` : nothing}
        <span class="tag__label" part="label">${this.label}</span>
        ${showClose ? html`
          <button
            class="tag__close"
            part="close"
            aria-label=${this.closeLabel}
            @click=${this._handleClose}
          >
            <asm-icon name="close" class="tag__close-icon"></asm-icon>
          </button>
        ` : nothing}
      </span>
    `;
  }
}
