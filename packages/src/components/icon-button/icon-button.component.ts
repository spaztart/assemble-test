import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './icon-button.styles.js';
import '../icon/icon.js';

export type AsmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outline';
export type AsmIconButtonSize = 'huge' | 'spacious' | 'default' | 'compact';

/**
 * @tag asm-icon-button
 *
 * @csspart button - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart icon - The icon element.
 */
export default class AsmIconButton extends LitElement {
  static styles = styles;

  /** Material Symbols icon name. */
  @property() icon = '';

  /** The visual variant. */
  @property({ reflect: true }) variant: AsmIconButtonVariant = 'standard';

  /** The button size. */
  @property({ reflect: true }) size: AsmIconButtonSize = 'default';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Applies destructive/error styling. */
  @property({ type: Boolean, reflect: true }) destructive = false;

  /** Toggle/selected state. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Accessible label for the button. */
  @property({ attribute: 'label' }) label = '';

  render() {
    const classes = {
      'icon-button': true,
      [`icon-button--${this.variant}`]: true,
      [`icon-button--${this.size}`]: true,
      'icon-button--selected': this.selected,
      'icon-button--destructive': this.destructive,
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        aria-label=${this.label || nothing}
        aria-pressed=${this.selected ? 'true' : nothing}
        part="button"
      >
        <span class="icon-button__state-layer" part="state-layer"></span>
        <span class="icon-button__content">
          <asm-icon class="icon-button__icon" name=${this.icon} part="icon"></asm-icon>
        </span>
      </button>
    `;
  }
}
