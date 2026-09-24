import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './checkbox.styles.js';

/**
 * @tag asm-checkbox
 *
 * @csspart checkbox - The checkbox container.
 * @csspart state-layer - The state overlay layer.
 * @csspart box - The checkbox box.
 * @csspart label - The label text.
 *
 * @fires change - Fired when value changes. Detail: { value: boolean | null }
 */
export default class AsmCheckbox extends LitElement {
  static styles = styles;

  /** Checked state: true, false, or null (indeterminate). */
  @property({ type: Boolean, reflect: true }) checked: boolean | null = false;

  /** Enable tristate (indeterminate) cycling. */
  @property({ type: Boolean, reflect: true }) tristate = false;

  /** Optional label text. */
  @property() label = '';

  /** Show error styling. */
  @property({ type: Boolean, reflect: true }) error = false;

  /** Disables the checkbox. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _toggle() {
    if (this.disabled) return;

    if (this.tristate) {
      // false → true → null → false
      if (this.checked === false) this.checked = true;
      else if (this.checked === true) this.checked = null;
      else this.checked = false;
    } else {
      this.checked = !this.checked;
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.checked },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  }

  render() {
    const classes = {
      'checkbox': true,
      'checkbox--checked': this.checked === true,
      'checkbox--indeterminate': this.checked === null,
      'checkbox--error': this.error,
      'checkbox--disabled': this.disabled,
    };

    return html`
      <div
        class=${classMap(classes)}
        part="checkbox"
        role="checkbox"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${this.checked === null ? 'mixed' : String(!!this.checked)}
        aria-disabled=${this.disabled}
        aria-label=${this.label || nothing}
        @click=${this._toggle}
        @keydown=${this._handleKeyDown}
      >
        <span class="checkbox__state-layer" part="state-layer"></span>
        <span class="checkbox__box" part="box">
          ${this.checked === true ? html`
            <svg class="checkbox__icon" viewBox="0 0 18 18" fill="none">
              <polyline points="3.5 9 7.5 13 14.5 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          ` : nothing}
          ${this.checked === null ? html`
            <svg class="checkbox__icon" viewBox="0 0 18 18" fill="none">
              <line x1="4" y1="9" x2="14" y2="9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          ` : nothing}
        </span>
        ${this.label ? html`<span class="checkbox__label" part="label">${this.label}</span>` : nothing}
      </div>
    `;
  }
}
