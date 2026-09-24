import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './divider.styles.js';

/**
 * @tag asm-divider
 *
 * @csspart divider - The divider line.
 */
export default class AsmDivider extends LitElement {
  static styles = styles;

  /** Line thickness in pixels. */
  @property({ type: Number }) thickness = 1;

  /** Leading indent in pixels. */
  @property({ type: Number }) indent = 0;

  /** Trailing indent in pixels. */
  @property({ type: Number, attribute: 'end-indent' }) endIndent = 0;

  render() {
    return html`
      <hr
        class="divider"
        part="divider"
        role="separator"
        aria-hidden="true"
        style="
          border-top-width: ${this.thickness}px;
          margin-left: ${this.indent}px;
          margin-right: ${this.endIndent}px;
        "
      >
    `;
  }
}
