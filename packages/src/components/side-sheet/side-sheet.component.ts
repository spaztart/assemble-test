import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './side-sheet.styles.js';

/**
 * @tag asm-side-sheet
 *
 * A vertical side-sheet surface for the Assemble design system.
 *
 * Layout primitive meant to dock to the right of main UI. Exposes
 * three optional regions:
 * 1. header - sticky, never scrolls
 * 2. default slot - scrolling content (only part that scrolls)
 * 3. footer - sticky, never scrolls
 *
 * Visual contract (Figma):
 * - Background: md.sys.color.surface-bright
 * - Padding: md.spacing.400 (16px) all sides
 * - Corners: md.border.radius.16 (cornerLarge)
 * - Elevation: 0 0 20px 0 md.sys.color.shadow (elevation-5)
 *
 * @csspart container - The sheet outer container.
 * @csspart header - The sticky header region.
 * @csspart content - The scrolling content region.
 * @csspart footer - The sticky footer region.
 *
 * @slot - Default slot for scrolling content.
 * @slot header - Slot for sticky header content.
 * @slot footer - Slot for sticky footer content.
 */
export default class AsmSideSheet extends LitElement {
  static styles = styles;

  /** Whether the side sheet is visible. */
  @property({ type: Boolean, reflect: true }) open = true;

  /** Gap between child items in pixels. */
  @property({ type: Number }) gap = 10;

  /** Optional explicit width. */
  @property() width = '';

  /** Optional explicit height (defaults to filling parent). */
  @property() height = '';

  render() {
    if (!this.open) return nothing;

    const containerStyle = [
      this.width ? `width: ${this.width}` : '',
      this.height ? `height: ${this.height}` : '',
    ].filter(Boolean).join(';');

    return html`
      <aside
        class="side-sheet"
        part="container"
        style=${containerStyle || nothing}
        role="complementary"
      >
        <div class="side-sheet__header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="side-sheet__content" part="content" style="gap: ${this.gap}px">
          <slot></slot>
        </div>
        <div class="side-sheet__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </aside>
    `;
  }
}
