import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './accordion.styles.js';
import '../icon/icon.js';

export type AsmAccordionType = 'white' | 'gray';

/**
 * @tag asm-accordion-item
 *
 * @csspart header - The accordion header.
 * @csspart content - The expanded content area.
 * @csspart chevron - The expand/collapse chevron.
 *
 * @fires toggle - Fired when expanded state changes. Detail: { expanded: boolean }
 */
export default class AsmAccordionItem extends LitElement {
  static styles = styles;

  /** Header title text. */
  @property() title = '';

  /** Whether the accordion is expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Background type. */
  @property({ reflect: true }) type: AsmAccordionType = 'white';

  /** Optional leading icon. */
  @property({ attribute: 'leading-icon' }) leadingIcon = '';

  /** Disables the accordion. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _toggle() {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { expanded: this.expanded },
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
      'accordion': true,
      'accordion--expanded': this.expanded,
      [`accordion--${this.type}`]: true,
      'accordion--disabled': this.disabled,
    };

    return html`
      <div class=${classMap(classes)}>
        <div
          class="accordion__header"
          part="header"
          role="button"
          tabindex=${this.disabled ? -1 : 0}
          aria-expanded=${String(this.expanded)}
          @click=${this._toggle}
          @keydown=${this._handleKeyDown}
        >
          ${this.leadingIcon ? html`<asm-icon class="accordion__leading-icon" name=${this.leadingIcon}></asm-icon>` : nothing}
          <span class="accordion__title">${this.title}</span>
          <asm-icon class="accordion__chevron" part="chevron" name="keyboard_arrow_down"></asm-icon>
        </div>
        <div class="accordion__body">
          <div class="accordion__content" part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
