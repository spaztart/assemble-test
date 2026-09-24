import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './nav-drawer.styles.js';
import '../brand/brand.js';
import '../icon/icon.js';

/**
 * @tag asm-nav-list-item
 *
 * A single tappable row inside an asm-nav-drawer.
 *
 * Specs:
 * - Leading icon (optional), bodyLarge label, trailing arrow (default)
 * - Hover/pressed/focus neutral state layers, 8px corner radius
 * - Disabled: 38% opacity, not focusable
 *
 * Accessibility:
 * - role="button", Enter/Space activates
 * - Disabled rows announced as disabled
 * - Decorative icons excluded from screen reader
 *
 * @csspart item - The item button.
 */
export class AsmNavListItem extends LitElement {
  static styles = styles;

  /** Row label text. Required, non-empty. */
  @property() label = '';

  /** Optional leading Material icon name. */
  @property() icon = '';

  /** Trailing icon name. Defaults to arrow_forward. */
  @property({ attribute: 'trailing-icon' }) trailingIcon = 'arrow_forward';

  /** Whether to show the trailing icon. */
  @property({ type: Boolean, attribute: 'show-trailing' }) showTrailing = true;

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Override accessible label. */
  @property({ attribute: 'semantic-label' }) semanticLabel = '';

  private _handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('item-click', {
      bubbles: true,
      composed: true,
      detail: { label: this.label },
    }));
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  render() {
    const classes = {
      'nav-list-item': true,
      'nav-list-item--disabled': this.disabled,
    };

    return html`
      <button
        class=${classMap(classes)}
        part="item"
        role="button"
        aria-label=${this.semanticLabel || this.label}
        aria-disabled=${this.disabled ? 'true' : nothing}
        tabindex=${this.disabled ? '-1' : '0'}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        ${this.icon ? html`
          <span class="nav-list-item__leading" aria-hidden="true">
            <asm-icon name=${this.icon}></asm-icon>
          </span>
        ` : nothing}
        <span class="nav-list-item__label">${this.label}</span>
        ${this.showTrailing ? html`
          <span class="nav-list-item__trailing" aria-hidden="true">
            <asm-icon name=${this.trailingIcon}></asm-icon>
          </span>
        ` : nothing}
      </button>
    `;
  }
}

/**
 * @tag asm-nav-drawer
 *
 * Full side-panel navigation drawer.
 *
 * Specs:
 * - surfaceBright background, rounded trailing corners (0 16 16 0)
 * - Elevation-5 shadow, 320px default width
 * - Brand header: McAfee wordmark at top
 * - Scrollable body with sections
 * - Optional pinned footer
 *
 * Slots:
 * - `(default)` – Nav sections (asm-nav-list-item elements)
 * - `footer` – Pinned footer content
 *
 * Accessibility:
 * - role="navigation" with aria-label
 * - Category headers announced as headings
 *
 * @csspart drawer - The drawer surface.
 * @csspart header - The brand header area.
 * @csspart body - The scrollable body.
 * @csspart footer - The pinned footer.
 */
export default class AsmNavDrawer extends LitElement {
  static styles = styles;

  /** Show brand wordmark header at top. */
  @property({ type: Boolean }) brand = true;

  /** Accessible label for the navigation. */
  @property({ attribute: 'nav-label' }) navLabel = 'Main navigation';

  render() {
    return html`
      <nav class="nav-drawer" part="drawer" aria-label=${this.navLabel} role="navigation">
        ${this.brand ? html`
          <div class="nav-drawer__header" part="header">
            <asm-brand variant="wordmark" color="primary" size="sm"></asm-brand>
          </div>
        ` : nothing}
        <div class="nav-drawer__body" part="body">
          <slot></slot>
        </div>
        <div class="nav-drawer__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </nav>
    `;
  }
}

/**
 * @tag asm-nav-section
 *
 * Groups nav list items under an optional category header.
 *
 * @csspart section - The section container.
 * @csspart header - The category header text.
 */
export class AsmNavSection extends LitElement {
  static styles = styles;

  /** Optional category header title. Uppercase mono. */
  @property() title = '';

  render() {
    return html`
      <div class="nav-section" part="section" role="group" aria-label=${this.title || nothing}>
        ${this.title ? html`
          <div class="nav-category-header" part="header" role="heading" aria-level="2">
            ${this.title}
          </div>
        ` : nothing}
        <slot></slot>
      </div>
    `;
  }
}
