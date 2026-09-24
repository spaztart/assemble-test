import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './menu-item.styles.js';
import '../icon/icon.js';

export type AsmMenuItemDensity = 'default' | 'low' | 'compact';

/**
 * @tag asm-menu-item
 *
 * A single item within an asm-menu.
 *
 * @csspart item - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart content - The content wrapper.
 * @csspart label - The label text span.
 * @csspart supporting-text - The supporting text span.
 * @csspart leading - The leading icon area.
 * @csspart trailing - The trailing icon area.
 */
export default class AsmMenuItem extends LitElement {
  static styles = styles;

  /** The menu item label text. */
  @property() label = '';

  /** Optional supporting text below the label. */
  @property({ attribute: 'supporting-text' }) supportingText = '';

  /** Material Symbols icon name for the leading position. */
  @property({ attribute: 'start-icon' }) startIcon = '';

  /** Material Symbols icon name for the trailing position. */
  @property({ attribute: 'end-icon' }) endIcon = '';

  /** Whether this item is selected. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Whether this item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The density of this item (inherited from parent menu if not set). */
  @property({ reflect: true }) density: AsmMenuItemDensity = 'default';

  render() {
    const classes = {
      'menu-item': true,
      'menu-item--selected': this.selected,
    };

    return html`
      <button
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        role="menuitem"
        aria-label=${this.label || nothing}
        part="item"
      >
        <span class="menu-item__state-layer" part="state-layer"></span>
        ${this.startIcon
          ? html`<span class="menu-item__leading" part="leading"><asm-icon name=${this.startIcon}></asm-icon></span>`
          : nothing}
        <span class="menu-item__content" part="content">
          <span class="menu-item__label" part="label">${this.label}</span>
          ${this.supportingText
            ? html`<span class="menu-item__supporting-text" part="supporting-text">${this.supportingText}</span>`
            : nothing}
        </span>
        ${this.endIcon
          ? html`<span class="menu-item__trailing" part="trailing"><asm-icon name=${this.endIcon}></asm-icon></span>`
          : nothing}
      </button>
    `;
  }
}
