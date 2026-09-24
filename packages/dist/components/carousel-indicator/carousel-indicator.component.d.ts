import { LitElement } from 'lit';
/**
 * @tag asm-carousel-indicator
 *
 * A row of dots indicating the current page in a carousel.
 *
 * @fires - No events (purely presentational).
 */
export default class AsmCarouselIndicator extends LitElement {
    static styles: import("lit").CSSResult;
    /** Total number of pages. */
    count: number;
    /** Active page index (0-based). */
    activeIndex: number;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=carousel-indicator.component.d.ts.map