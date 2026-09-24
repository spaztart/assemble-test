import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './navigation-rail-item.styles.js';
import type { AsmStatusIndicatorStatus } from '../status-indicator/status-indicator.component.js';
import '../status-indicator/status-indicator.js';
import '../peek-label/peek-label.js';
import '../icon/icon.js';
import '../loader/loader.js';

export type AsmNavRailPeekPosition = 'right' | 'top';

/**
 * @tag asm-navigation-rail-item
 *
 * A single 52×52 interactive slot inside an asm-navigation-rail.
 *
 * Specs:
 * - 52×52, 12px corner radius, 20×20 icon centered
 * - Hover: neutral state layer
 * - Active (nav destination): solid brand-orange fill, white icon
 * - Active (toggle/status): 12%-alpha brand gradient, info status dot
 * - Status: optional status-indicator badge at top-right
 * - Peek label: shown on hover for vertical rails
 * - Disabled: 38% opacity, not focusable
 *
 * Accessibility:
 * - `role="button"`, `aria-label` from `label` or `semantic-label`
 * - `aria-current="page"` when active
 * - `aria-disabled` when disabled
 * - Keyboard: Enter/Space activates
 *
 * @csspart item - The item button element.
 */
export default class AsmNavigationRailItem extends LitElement {
  static styles = styles;

  /** Human-readable name — drives peek label and accessible name. */
  @property() label = '';

  /** Override accessible name when it should differ from the visible label. */
  @property({ attribute: 'semantic-label' }) semanticLabel = '';

  /** Material Symbols icon name (e.g. "home", "settings"). */
  @property() icon = '';

  /** Whether this slot is the active/selected destination. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Whether this slot is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Optional status dot badge. */
  @property() status: AsmStatusIndicatorStatus | '' = '';

  /** Whether the item has toggle behaviour (status-based on/off). */
  @property({ type: Boolean }) toggle = false;

  /** Whether to show the peek label on hover (set false for horizontal rail). */
  @property({ type: Boolean, attribute: 'show-peek' }) showPeek = true;

  /** Peek label position: right (vertical rail) or top (horizontal rail). */
  @property({ attribute: 'peek-position' }) peekPosition: AsmNavRailPeekPosition = 'right';

  /** Whether this item is in a loading state (shows spinner badge). */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Duration in ms for the loading state during toggle. */
  @property({ type: Number, attribute: 'toggle-duration' }) toggleDuration = 1500;

  @state() private _hovered = false;

  private _handleClick() {
    if (this.disabled || this.loading) return;

    // Toggle items manage their own on/off cycle
    if (this.toggle) {
      this._runToggle();
      return;
    }

    this.dispatchEvent(new CustomEvent('item-click', {
      bubbles: true,
      composed: true,
      detail: { label: this.label },
    }));
  }

  private _runToggle() {
    this.loading = true;
    const wasActive = this.active;

    this.dispatchEvent(new CustomEvent('toggle-start', {
      bubbles: true,
      composed: true,
      detail: { label: this.label, turning: wasActive ? 'off' : 'on' },
    }));

    setTimeout(() => {
      this.loading = false;
      this.active = !wasActive;

      this.dispatchEvent(new CustomEvent('toggle-end', {
        bubbles: true,
        composed: true,
        detail: { label: this.label, active: this.active },
      }));
    }, this.toggleDuration);
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private get _accessibleLabel(): string {
    return this.semanticLabel || this.label;
  }

  /** Whether this is a plain nav destination (not a toggle slot). */
  private get _isBrandFilled(): boolean {
    return this.active && !this.toggle && !this.status;
  }

  render() {
    const inert = this.disabled || this.loading;
    const brandFilled = this._isBrandFilled && !this.loading;

    // Toggle items: active=info dot, inactive=muted dot (or consumer-provided status)
    const toggleStatus: AsmStatusIndicatorStatus | '' =
      this.active ? 'info' : (this.status || 'muted');

    const showStatusDot = !this.loading && !brandFilled && (
      this.toggle ? true : (!!this.status && !this.active)
    );
    const effectiveStatus: AsmStatusIndicatorStatus | '' =
      this.toggle ? toggleStatus : this.status;

    const classes = {
      'rail-item': true,
      'rail-item--active': this.active && !brandFilled && !this.loading,
      'rail-item--brand-filled': brandFilled,
      'rail-item--disabled': this.disabled,
      'rail-item--loading': this.loading,
    };

    const peekClasses = `rail-item__peek rail-item__peek--${this.peekPosition} ${this._hovered ? 'rail-item__peek--visible' : ''}`;

    return html`
      <button
        class=${classMap(classes)}
        part="item"
        role="button"
        aria-label=${this._accessibleLabel}
        aria-current=${this.active ? 'page' : nothing}
        aria-disabled=${inert ? 'true' : nothing}
        tabindex=${inert ? '-1' : '0'}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
        @mouseenter=${() => { if (!inert) this._hovered = true; }}
        @mouseleave=${() => this._hovered = false}
      >
        <span class="rail-item__icon" aria-hidden="true">
          <asm-icon name=${this.icon}></asm-icon>
        </span>
        ${showStatusDot && effectiveStatus ? html`
          <span class="rail-item__status" aria-hidden="true">
            <asm-status-indicator status=${effectiveStatus} size="small"></asm-status-indicator>
          </span>
        ` : nothing}
        ${this.loading ? html`
          <span class="rail-item__status" aria-hidden="true">
            <asm-loader size="16" stroke-width="2"></asm-loader>
          </span>
        ` : nothing}
        ${this.showPeek && this.label ? html`
          <span class=${peekClasses} aria-hidden="true">
            <asm-peek-label text=${this.label}></asm-peek-label>
          </span>
        ` : nothing}
      </button>
    `;
  }
}
