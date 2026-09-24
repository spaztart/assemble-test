import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './carousel-indicator.styles.js';

/**
 * @tag asm-carousel-indicator
 *
 * A row of dots indicating the current page in a carousel.
 *
 * @fires - No events (purely presentational).
 */
export default class AsmCarouselIndicator extends LitElement {
  static styles = styles;

  /** Total number of pages. */
  @property({ type: Number }) count = 1;

  /** Active page index (0-based). */
  @property({ type: Number, attribute: 'active-index' }) activeIndex = 0;

  render() {
    const dots = Array.from({ length: this.count }, (_, i) => {
      const classes = {
        'dot': true,
        'dot--active': i === this.activeIndex,
      };
      return html`<div class=${classMap(classes)}></div>`;
    });

    return html`
      <div class="carousel-indicator" role="tablist" aria-label=${`Page ${this.activeIndex + 1} of ${this.count}`}>
        ${dots}
      </div>
    `;
  }
}
