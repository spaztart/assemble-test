import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './radio.styles.js';

/**
 * @tag asm-radio
 *
 * @csspart radio - The radio container.
 * @csspart state-layer - The state overlay layer.
 * @csspart circle - The radio circle.
 * @csspart label - The label text.
 *
 * @fires change - Fired when selected. Detail: { value: string }
 */
export default class AsmRadio extends LitElement {
  static styles = styles;

  /** This radio's value. */
  @property() value = '';

  /** The group's selected value. */
  @property({ attribute: 'group-value' }) groupValue = '';

  /** Optional label text. */
  @property() label = '';

  /** Disables the radio. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private get _selected() {
    return this.value === this.groupValue;
  }

  private _select() {
    if (this.disabled || this._selected) return;

    // Update group-value on self and sibling radios
    this.groupValue = this.value;
    const parent = this.parentElement;
    if (parent) {
      parent.querySelectorAll<AsmRadio>('asm-radio').forEach(radio => {
        if (radio !== this && radio.groupValue !== this.value) {
          radio.groupValue = this.value;
        }
      });
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._select();
    }
  }

  render() {
    const classes = {
      'radio': true,
      'radio--selected': this._selected,
      'radio--disabled': this.disabled,
    };

    return html`
      <div
        class=${classMap(classes)}
        part="radio"
        role="radio"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${String(this._selected)}
        aria-disabled=${this.disabled}
        aria-label=${this.label || nothing}
        @click=${this._select}
        @keydown=${this._handleKeyDown}
      >
        <span class="radio__state-layer" part="state-layer"></span>
        <span class="radio__circle" part="circle">
          ${this._selected ? html`<span class="radio__dot"></span>` : nothing}
        </span>
        ${this.label ? html`<span class="radio__label" part="label">${this.label}</span>` : nothing}
      </div>
    `;
  }
}
