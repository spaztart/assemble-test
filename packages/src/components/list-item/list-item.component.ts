import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './list-item.styles.js';
import '../icon/icon.js';
import '../status-indicator/status-indicator.js';
import '../status-notification/status-notification.js';

export type AsmListItemKind = 'interactive' | 'read-only';
export type AsmListItemState = 'default' | 'unread' | 'badge';

/**
 * @tag asm-list-item
 *
 * A feature list item row for dashboards, settings lists, and accordion bodies.
 * Supports leading icon, overline, title, supporting text, trailing chevron,
 * expandable content, and status states using asm-status-indicator (unread)
 * and asm-status-notification (badge).
 *
 * @slot leading - Leading content (icon container, avatar, image).
 * @slot - Default slot for right-content area.
 * @slot trailing - Custom trailing widget (overrides default chevron).
 * @slot expanded - Expandable body content revealed when `expanded` is true.
 *
 * @fires press - Fired when the row is clicked or activated via keyboard.
 */
export default class AsmListItem extends LitElement {
  static styles = styles;

  /** Primary title text. Required. */
  @property() title = '';

  /** Optional uppercase overline above the title. */
  @property() overline = '';

  /** Optional secondary line below the title. */
  @property({ attribute: 'supporting-text' }) supportingText = '';

  /** Interaction model: 'interactive' (default) or 'read-only'. */
  @property({ reflect: true }) kind: AsmListItemKind = 'interactive';

  /** Content state: 'default', 'unread', or 'badge'. */
  @property({ reflect: true }) state: AsmListItemState = 'default';

  /** Badge count (only visible when state is 'badge'). */
  @property({ type: Number, attribute: 'badge-count' }) badgeCount = 0;

  /** Whether trailing icon is shown. */
  @property({ type: Boolean, attribute: 'show-trailing-icon' }) showTrailingIcon = true;

  /** Whether expanded slot is visible. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Accessible label override. */
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = null;

  private _handleClick() {
    if (this.disabled || this.kind === 'read-only') return;
    this.dispatchEvent(new CustomEvent('press', { bubbles: true, composed: true }));
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled || this.kind === 'read-only') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  render() {
    const isInteractive = this.kind === 'interactive' && !this.disabled;

    const rowClasses = {
      'list-item': true,
      'list-item--expanded': this.expanded,
    };

    const trailingClasses = {
      'list-item__trailing': true,
      'list-item__trailing--expanded': this.expanded,
    };

    return html`
      <div
        class=${classMap(rowClasses)}
        role=${this.kind === 'interactive' ? 'button' : 'region'}
        tabindex=${isInteractive ? '0' : '-1'}
        aria-label=${this.ariaLabel || this.title}
        aria-disabled=${this.disabled}
        aria-expanded=${this.expanded ? 'true' : nothing}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <div class="list-item__leading">
          <slot name="leading"></slot>
          ${this.state === 'badge' && this.badgeCount > 0 ? html`
            <span class="list-item__badge-slot">
              <asm-status-notification status="critical" count=${this.badgeCount}></asm-status-notification>
            </span>
          ` : nothing}
        </div>

        <div class="list-item__content">
          ${this.overline ? html`<span class="list-item__overline">${this.overline}</span>` : nothing}
          <div class="list-item__title-row">
            <span class="list-item__title">${this.title}</span>
            ${this.state === 'unread' ? html`
              <span class="list-item__unread-dot"></span>
            ` : nothing}
          </div>
          ${this.supportingText ? html`<span class="list-item__supporting">${this.supportingText}</span>` : nothing}
        </div>

        <div class="list-item__right">
          <slot></slot>
        </div>

        ${this.kind === 'interactive' && this.showTrailingIcon ? html`
          <div class=${classMap(trailingClasses)}>
            <slot name="trailing">
              <asm-icon name="chevron_right"></asm-icon>
            </slot>
          </div>
        ` : nothing}
      </div>

      <div class="list-item__expanded ${this.expanded ? 'list-item__expanded--open' : ''}">
        <div class="list-item__expanded-inner">
          <slot name="expanded"></slot>
        </div>
      </div>
    `;
  }
}
