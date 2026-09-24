import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './navigation-rail.styles.js';
import '../brand/brand.js';
import '../status-indicator/status-indicator.js';
import '../peek-label/peek-label.js';
import '../icon/icon.js';

export type AsmNavRailOrientation = 'vertical' | 'horizontal';

/**
 * @tag asm-navigation-rail
 *
 * A vertical (or horizontal) navigation rail surface.
 *
 * Specs (from Figma):
 * - 52×52 icon slots, 4px gap, surfaceBright background
 * - Border radius: 16px (cornerLarge)
 * - Elevation-5: 0 0 20px shadow
 * - Brand slot: McAfee logo, interactive or decorative
 *
 * Slots:
 * - `top` – Items anchored to the top (below brand if shown)
 * - `(default)` – Items in the middle
 * - `bottom` – Items anchored to the bottom
 *
 * @csspart rail - The rail surface container.
 */
export default class AsmNavigationRail extends LitElement {
  static styles = styles;

  /** Rail orientation: vertical (side rail) or horizontal (bottom nav). */
  @property({ reflect: true }) orientation: AsmNavRailOrientation = 'vertical';

  /** Show McAfee brand slot at the top. */
  @property({ type: Boolean }) brand = false;

  /** Make the brand slot interactive (button). */
  @property({ type: Boolean, attribute: 'brand-interactive' }) brandInteractive = false;

  /** Whether the brand slot is the active destination. */
  @property({ type: Boolean, attribute: 'brand-active' }) brandActive = false;

  /** Accessible label for the brand slot. */
  @property({ attribute: 'brand-label' }) brandLabel = 'McAfee';

  @state() private _brandHovered = false;

  private _handleBrandClick() {
    this.dispatchEvent(new CustomEvent('brand-click', { bubbles: true, composed: true }));
  }

  render() {
    const brandSlot = this.brand ? this._renderBrand() : nothing;

    return html`
      <nav class="rail" part="rail" aria-label="Navigation rail" role="navigation">
        <div class="rail__top">
          ${brandSlot}
          <slot name="top"></slot>
        </div>
        <div class="rail__middle">
          <slot></slot>
        </div>
        <div class="rail__bottom">
          <slot name="bottom"></slot>
        </div>
      </nav>
    `;
  }

  private _renderBrand() {
    if (this.brandInteractive) {
      const classes = {
        'rail-brand': true,
        'rail-brand--interactive': true,
        'rail-brand--active': this.brandActive,
      };

      const iconColor = this.brandActive ? 'brand-orange' : 'primary';

      return html`
        <button
          class=${classMap(classes)}
          @click=${this._handleBrandClick}
          @mouseenter=${() => this._brandHovered = true}
          @mouseleave=${() => this._brandHovered = false}
          aria-label=${this.brandLabel}
          aria-current=${this.brandActive ? 'page' : nothing}
        >
          <span class="rail-brand__icon">
            <asm-brand variant="logo" color=${iconColor} size="sm"></asm-brand>
          </span>
          ${this.orientation === 'vertical' ? html`
            <span class="rail-brand__peek ${this._brandHovered ? 'rail-brand__peek--visible' : ''}" aria-hidden="true">
              <asm-peek-label text=${this.brandLabel}></asm-peek-label>
            </span>
          ` : nothing}
        </button>
      `;
    }

    return html`
      <div
        class="rail-brand rail-brand--decorative"
        role="img"
        aria-label=${this.brandLabel}
      >
        <span class="rail-brand__icon">
          <asm-brand variant="logo" color="white" size="sm"></asm-brand>
        </span>
      </div>
    `;
  }
}
