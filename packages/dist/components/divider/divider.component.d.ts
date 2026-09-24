import { LitElement } from 'lit';
/**
 * @tag asm-divider
 *
 * @csspart divider - The divider line.
 */
export default class AsmDivider extends LitElement {
    static styles: import("lit").CSSResult;
    /** Line thickness in pixels. */
    thickness: number;
    /** Leading indent in pixels. */
    indent: number;
    /** Trailing indent in pixels. */
    endIndent: number;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=divider.component.d.ts.map