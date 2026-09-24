import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './pagination.styles.js';
import '../icon/icon.js';

/**
 * @tag asm-pagination
 *
 * A pagination component with smart page windowing.
 *
 * Shows first/last boundary pages, siblings around current page,
 * and ellipsis for collapsed ranges. Stadium-shaped page pills.
 *
 * @csspart container - The pagination container.
 * @csspart page - Individual page button.
 * @csspart page-current - The current page indicator.
 * @csspart ellipsis - The ellipsis separator.
 * @csspart prev - The previous button.
 * @csspart next - The next button.
 *
 * @fires page-change - Fired when a page is selected. detail: { page: number }
 */
export default class AsmPagination extends LitElement {
  static styles = styles;

  /** Total number of pages (>= 1). */
  @property({ type: Number, attribute: 'page-count' }) pageCount = 1;

  /** Current page (1-based). */
  @property({ type: Number, attribute: 'current-page' }) currentPage = 1;

  /** Number of sibling pages to show around current. */
  @property({ type: Number, attribute: 'sibling-count' }) siblingCount = 1;

  /** Number of boundary pages to show at start/end. */
  @property({ type: Number, attribute: 'boundary-count' }) boundaryCount = 1;

  /** Whether the pagination is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Accessible label for the navigation. */
  @property({ attribute: 'aria-label' }) override ariaLabel = 'Pagination';

  private _generateRange(): (number | 'ellipsis')[] {
    const total = this.pageCount;
    const current = this.currentPage;
    const sibling = this.siblingCount;
    const boundary = this.boundaryCount;

    // If total pages fits without truncation
    const totalNumbers = boundary * 2 + sibling * 2 + 1;
    if (totalNumbers >= total) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftBound = Math.max(current - sibling, boundary + 1);
    const rightBound = Math.min(current + sibling, total - boundary);

    const showLeftEllipsis = leftBound > boundary + 1;
    const showRightEllipsis = rightBound < total - boundary;

    const result: (number | 'ellipsis')[] = [];

    // Left boundary
    for (let i = 1; i <= boundary; i++) {
      result.push(i);
    }

    if (showLeftEllipsis) {
      result.push('ellipsis');
    }

    // Middle range
    for (let i = leftBound; i <= rightBound; i++) {
      result.push(i);
    }

    if (showRightEllipsis) {
      result.push('ellipsis');
    }

    // Right boundary
    for (let i = total - boundary + 1; i <= total; i++) {
      result.push(i);
    }

    return result;
  }

  private _handlePageClick(page: number) {
    if (this.disabled || page === this.currentPage) return;
    this.dispatchEvent(new CustomEvent('page-change', {
      bubbles: true, composed: true,
      detail: { page },
    }));
  }

  private _handlePrev() {
    if (this.currentPage > 1) {
      this._handlePageClick(this.currentPage - 1);
    }
  }

  private _handleNext() {
    if (this.currentPage < this.pageCount) {
      this._handlePageClick(this.currentPage + 1);
    }
  }

  render() {
    const range = this._generateRange();

    return html`
      <nav
        class="pagination"
        part="container"
        role="navigation"
        aria-label=${this.ariaLabel || 'Pagination'}
      >
        <button
          class="pagination__nav-btn"
          part="prev"
          aria-label="Previous page"
          ?disabled=${this.disabled || this.currentPage <= 1}
          @click=${this._handlePrev}
        >
          <asm-icon name="chevron_left"></asm-icon>
        </button>

        ${range.map((item, index) => {
          if (item === 'ellipsis') {
            return html`<span class="pagination__ellipsis" part="ellipsis" aria-hidden="true">…</span>`;
          }

          const isCurrent = item === this.currentPage;
          const classes = {
            'pagination__page': true,
            'pagination__page--current': isCurrent,
          };

          return html`
            <button
              class=${classMap(classes)}
              part=${isCurrent ? 'page-current' : 'page'}
              aria-label="Page ${item}"
              aria-current=${isCurrent ? 'page' : nothing}
              ?disabled=${this.disabled}
              @click=${() => this._handlePageClick(item)}
            >${item}</button>
          `;
        })}

        <button
          class="pagination__nav-btn"
          part="next"
          aria-label="Next page"
          ?disabled=${this.disabled || this.currentPage >= this.pageCount}
          @click=${this._handleNext}
        >
          <asm-icon name="chevron_right"></asm-icon>
        </button>
      </nav>
    `;
  }
}
