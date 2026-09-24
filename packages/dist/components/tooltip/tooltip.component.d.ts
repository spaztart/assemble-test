import { LitElement } from 'lit';
export type AsmTooltipType = 'single-line' | 'multi-line';
export type AsmTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
/**
 * @tag asm-tooltip
 *
 * @csspart tooltip - The tooltip popup.
 *
 * @slot - Default slot for the trigger element.
 */
export default class AsmTooltip extends LitElement {
    static styles: import("lit").CSSResult;
    /** Tooltip message text. */
    message: string;
    /** Tooltip type. */
    type: AsmTooltipType;
    /** Tooltip position relative to trigger. */
    position: AsmTooltipPosition;
    private _visible;
    private _show;
    private _hide;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=tooltip.component.d.ts.map