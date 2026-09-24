import { LitElement } from 'lit';
export type AsmProgressBarStatus = 'brand' | 'moderate' | 'critical' | 'low';
export type AsmProgressBarSize = 'thick' | 'thin';
/**
 * @tag asm-progress-bar
 *
 * A determinate horizontal progress bar with status color variants.
 *
 * @csspart track - The background track.
 * @csspart fill - The filled portion.
 */
export default class AsmProgressBar extends LitElement {
    static styles: import("lit").CSSResult;
    /** Progress value between 0 and 1. */
    value: number;
    /** Color status: brand, moderate, critical, or low. */
    status: AsmProgressBarStatus;
    /** Size: thick (14px) or thin (8px). */
    size: AsmProgressBarSize;
    /** Accessible label. */
    ariaLabel: string | null;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=progress-bar.component.d.ts.map