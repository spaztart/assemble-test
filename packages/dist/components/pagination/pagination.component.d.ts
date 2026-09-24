import { LitElement } from 'lit';
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
    static styles: import("lit").CSSResult;
    /** Total number of pages (>= 1). */
    pageCount: number;
    /** Current page (1-based). */
    currentPage: number;
    /** Number of sibling pages to show around current. */
    siblingCount: number;
    /** Number of boundary pages to show at start/end. */
    boundaryCount: number;
    /** Whether the pagination is disabled. */
    disabled: boolean;
    /** Accessible label for the navigation. */
    ariaLabel: string;
    private _generateRange;
    private _handlePageClick;
    private _handlePrev;
    private _handleNext;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pagination.component.d.ts.map