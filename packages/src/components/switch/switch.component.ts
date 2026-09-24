import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './switch.styles.js';
import '../icon/icon.js';

export type AsmSwitchSize = 'large' | 'medium' | 'small';
export type AsmSwitchTone = 'secondary' | 'primary';

/**
 * @tag asm-switch
 *
 * @csspart track - The switch track.
 * @csspart handle - The switch handle/thumb.
 *
 * @fires change - Fired when value changes. Detail: { value: boolean }
 */
export default class AsmSwitch extends LitElement {
  static styles = styles;

  /** Whether the switch is on. */
  @property({ type: Boolean, reflect: true }) value = false;

  /** Switch size. */
  @property({ reflect: true }) size: AsmSwitchSize = 'medium';

  /** Color tone. */
  @property({ reflect: true }) tone: AsmSwitchTone = 'secondary';

  /** Icon name shown on handle when on. */
  @property() icon = '';

  /** Shows loading spinner. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Disables the switch. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Accessible label. */
  @property() label = '';

  private _toggle() {
    if (this.disabled || this.loading) return;
    this.value = !this.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
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
      'switch': true,
      'switch--on': this.value,
      [`switch--${this.size}`]: true,
      [`switch--${this.tone}`]: true,
      'switch--disabled': this.disabled,
      'switch--loading': this.loading,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="switch"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${String(this.value)}
        aria-label=${this.label || nothing}
        aria-disabled=${String(this.disabled)}
        @click=${this._toggle}
        @keydown=${this._handleKeyDown}
      >
        <div class="switch__track" part="track">
          <div class="switch__handle" part="handle">
            ${this.loading ? html`<div class="switch__loader"></div>` : nothing}
            ${!this.loading && this.icon ? html`<asm-icon class="switch__icon" name=${this.value ? this.icon : 'close'}></asm-icon>` : nothing}
          </div>
        </div>
      </div>
    `;
  }
}
