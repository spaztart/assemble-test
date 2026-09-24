import { LitElement } from 'lit';
export type AsmLoaderStyle = 'bar';
/**
 * @tag asm-loader
 *
 * An indeterminate circular loading spinner.
 *
 * @csspart container - The loader container.
 *
 * @fires - No events.
 */
export default class AsmLoader extends LitElement {
    static styles: import("lit").CSSResult;
    /** Size of the spinner in pixels. */
    size: number;
    /** Visual variant: 'bar' (short arc) or 'half-track' (half circle). */
    variant: AsmLoaderStyle;
    /** Stroke width of the track and arc. */
    strokeWidth: number;
    /** Accessible label. */
    ariaLabel: string | null;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=loader.component.d.ts.map