import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './empty-state.styles.js';
import '../icon/icon.js';

/**
 * @tag asm-empty-state
 *
 * @csspart container - The empty state wrapper.
 * @csspart icon-wrapper - The icon background circle.
 * @csspart title - The title text.
 * @csspart description - The description text.
 *
 * @slot action - Slot for action button(s).
 */
export default class AsmEmptyState extends LitElement {
  static styles = styles;

  /** Icon name (Material Symbols). */
  @property() icon = '';

  /** Whether to show the icon. */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true;

  /** Title text. */
  @property() title = '';

  /** Description text. */
  @property() description = '';

  /** Icon size in pixels. */
  @property({ type: Number, attribute: 'icon-size' }) iconSize = 48;

  /** Icon background circle size in pixels. */
  @property({ type: Number, attribute: 'icon-background-size' }) iconBackgroundSize = 96;

  render() {
    return html`
      <div class="empty-state" part="container">
        ${this.showIcon && this.icon ? html`
          <div
            class="empty-state__icon-wrapper"
            part="icon-wrapper"
            style="width:${this.iconBackgroundSize}px;height:${this.iconBackgroundSize}px"
          >
            <asm-icon class="empty-state__icon" name=${this.icon} style="font-size:${this.iconSize}px"></asm-icon>
          </div>
        ` : nothing}
        ${this.title ? html`<h3 class="empty-state__title" part="title">${this.title}</h3>` : nothing}
        ${this.description ? html`<p class="empty-state__description" part="description">${this.description}</p>` : nothing}
        <slot name="action"></slot>
      </div>
    `;
  }
}
