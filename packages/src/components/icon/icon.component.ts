import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './icon.styles.js';

/**
 * @tag asm-icon
 *
 * Renders a Material Symbols icon by name.
 *
 * @csspart icon - The icon span element.
 *
 * @cssproperty --asm-icon-fill - Fill axis (0 or 1). Default: 0.
 * @cssproperty --asm-icon-weight - Weight axis (100–700). Default: 400.
 * @cssproperty --asm-icon-grade - Grade axis (-25 to 200). Default: 0.
 * @cssproperty --asm-icon-optical-size - Optical size axis (20–48). Default: 24.
 */
export default class AsmIcon extends LitElement {
  static styles = styles;

  /** The Material Symbols icon name (e.g. "download", "arrow_forward"). */
  @property() name = '';

  render() {
    return html`<span class="icon" part="icon" aria-hidden="true">${this.name}</span>`;
  }
}
