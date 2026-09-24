import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './feedback.styles.js';
import '../icon/icon.js';

export type AsmFeedbackValue = 'thumbs-up' | 'thumbs-down' | null;

/**
 * @tag asm-feedback
 *
 * A thumbs up/down feedback widget.
 *
 * @fires thumbs-up - Fired when thumbs up is clicked.
 * @fires thumbs-down - Fired when thumbs down is clicked.
 */
export default class AsmFeedback extends LitElement {
  static styles = styles;

  /** Optional label text. */
  @property() label = '';

  /** Currently selected value: 'thumbs-up', 'thumbs-down', or null. */
  @property({ reflect: true }) value: AsmFeedbackValue = null;

  private _handleThumbsUp() {
    this.value = this.value === 'thumbs-up' ? null : 'thumbs-up';
    this.dispatchEvent(new CustomEvent('thumbs-up', { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  private _handleThumbsDown() {
    this.value = this.value === 'thumbs-down' ? null : 'thumbs-down';
    this.dispatchEvent(new CustomEvent('thumbs-down', { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  render() {
    const upClasses = {
      'feedback__btn': true,
      'feedback__btn--selected': this.value === 'thumbs-up',
    };
    const downClasses = {
      'feedback__btn': true,
      'feedback__btn--selected': this.value === 'thumbs-down',
    };

    return html`
      <div class="feedback">
        ${this.label ? html`<span class="feedback__label">${this.label}</span>` : nothing}
        <div class="feedback__buttons">
          <button class=${classMap(upClasses)} aria-label="Thumbs up" aria-pressed=${this.value === 'thumbs-up'} @click=${this._handleThumbsUp}>
            <asm-icon name=${this.value === 'thumbs-up' ? 'thumb_up' : 'thumb_up_off_alt'}></asm-icon>
          </button>
          <button class=${classMap(downClasses)} aria-label="Thumbs down" aria-pressed=${this.value === 'thumbs-down'} @click=${this._handleThumbsDown}>
            <asm-icon name=${this.value === 'thumbs-down' ? 'thumb_down' : 'thumb_down_off_alt'}></asm-icon>
          </button>
        </div>
      </div>
    `;
  }
}
