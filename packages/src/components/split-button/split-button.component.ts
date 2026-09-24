import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './split-button.styles.js';
import '../icon/icon.js';

export type AsmSplitButtonVariant = 'filled' | 'tonal' | 'outline';
export type AsmSplitButtonSize = 'huge' | 'spacious' | 'default' | 'compact';

/**
 * @tag asm-split-button
 *
 * A split button with a primary action and a dropdown trigger.
 * The left side performs the main action, the right chevron opens a dropdown menu.
 *
 * @fires action - Fired when the primary (left) button is clicked.
 * @fires toggle - Fired when the dropdown trigger (right) button is clicked. Detail contains `{ open: boolean }`.
 *
 * @csspart action - The primary action button.
 * @csspart action-state - The state overlay for the action button.
 * @csspart action-content - The content wrapper of the action button.
 * @csspart label - The label text span.
 * @csspart divider - The vertical divider between action and trigger.
 * @csspart trigger - The dropdown trigger button.
 * @csspart trigger-state - The state overlay for the trigger button.
 * @csspart dropdown - The dropdown container for slotted menu content.
 *
 * @slot - Default slot for dropdown content (e.g. asm-menu).
 */
export default class AsmSplitButton extends LitElement {
  static styles = styles;

  /** The button label text. */
  @property() label = '';

  /** The visual variant. */
  @property({ reflect: true }) variant: AsmSplitButtonVariant = 'filled';

  /** The button size. */
  @property({ reflect: true }) size: AsmSplitButtonSize = 'default';

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Destructive / danger mode (filled and tonal only). */
  @property({ type: Boolean, reflect: true }) destructive = false;

  /** Material Symbols icon name for the start position. */
  @property({ attribute: 'start-icon' }) startIcon = '';

  /** Whether the dropdown is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  private _onActionClick() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }));
  }

  private _onTriggerClick() {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      })
    );
  }

  private _onOutsideClick = (e: MouseEvent) => {
    if (this.open && !this.contains(e.target as Node)) {
      this.open = false;
      this.dispatchEvent(
        new CustomEvent('toggle', {
          bubbles: true,
          composed: true,
          detail: { open: false },
        })
      );
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutsideClick);
  }

  render() {
    const classes = {
      'split-button': true,
      [`split-button--${this.variant}`]: true,
      [`split-button--${this.size}`]: true,
      'split-button--destructive': this.destructive && ['filled', 'tonal'].includes(this.variant),
    };

    return html`
      <div class=${classMap(classes)}>
        <button
          class="split-button__action"
          ?disabled=${this.disabled}
          aria-label=${this.label || nothing}
          part="action"
          @click=${this._onActionClick}
        >
          <span class="split-button__action-state" part="action-state"></span>
          <span class="split-button__action-content" part="action-content">
            ${this.startIcon
              ? html`<asm-icon class="split-button__start-icon" name=${this.startIcon}></asm-icon>`
              : nothing}
            <span class="split-button__label" part="label">${this.label}</span>
          </span>
        </button>
        <span class="split-button__divider" part="divider"></span>
        <button
          class="split-button__trigger"
          ?disabled=${this.disabled}
          aria-haspopup="true"
          aria-expanded=${this.open}
          aria-label="More options"
          part="trigger"
          @click=${this._onTriggerClick}
        >
          <span class="split-button__trigger-state" part="trigger-state"></span>
          <span class="split-button__trigger-icon">
            <asm-icon name="expand_more"></asm-icon>
          </span>
        </button>
      </div>
      <div class="split-button__dropdown" part="dropdown">
        <slot></slot>
      </div>
    `;
  }
}
