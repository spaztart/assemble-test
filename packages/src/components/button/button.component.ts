import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './button.styles.js';
import '../icon/icon.js';

export type AsmButtonVariant = 'filled' | 'tonal' | 'text' | 'outline';
export type AsmButtonSize = 'huge' | 'spacious' | 'default' | 'compact';

/**
 * @tag asm-button
 *
 * @csspart button - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart content - The content wrapper.
 * @csspart label - The label text span.
 */
export default class AsmButton extends LitElement {
  static styles = styles;

  /** The button label text. */
  @property() label = '';

  /** The visual variant. */
  @property({ reflect: true }) variant: AsmButtonVariant = 'filled';

  /** The button size. */
  @property({ reflect: true }) size: AsmButtonSize = 'default';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Destructive / danger mode (filled, tonal, text only). */
  @property({ type: Boolean, reflect: true }) destructive = false;

  /** Material Symbols icon name for the start position. */
  @property({ attribute: 'start-icon' }) startIcon = '';

  /** Material Symbols icon name for the end position. */
  @property({ attribute: 'end-icon' }) endIcon = '';

  render() {
    const classes = {
      button: true,
      [`button--${this.variant}`]: true,
      [`button--${this.size}`]: true,
      'button--destructive': this.destructive && ['filled', 'tonal', 'text'].includes(this.variant),
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-label=${this.label || nothing}
        part="button"
      >
        <span class="button__state-layer" part="state-layer"></span>
        <span class="button__content" part="content">
          ${this.startIcon ? html`<asm-icon class="button__start-icon" name=${this.startIcon}></asm-icon>` : nothing}
          <span class="button__label" part="label">${this.label}</span>
          ${this.endIcon ? html`<asm-icon class="button__end-icon" name=${this.endIcon}></asm-icon>` : nothing}
        </span>
      </button>
    `;
  }
}
