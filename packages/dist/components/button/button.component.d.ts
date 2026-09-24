import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmButtonVariant = 'filled' | 'tonal' | 'text' | 'outline';
export type AsmButtonSize = 'huge' | 'spacious' | 'default' | 'compact';
/**
 * @tag asm-button
 *
 * @csspart button - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart content - The content wrapper.
 * @csspart label - The label text span.
 */
export default class AsmButton extends LitElement {
    static styles: import("lit").CSSResult;
    /** The button label text. */
    label: string;
    /** The visual variant. */
    variant: AsmButtonVariant;
    /** The button size. */
    size: AsmButtonSize;
    /** Disables the button. */
    disabled: boolean;
    /** Destructive / danger mode (filled, tonal, text only). */
    destructive: boolean;
    /** Material Symbols icon name for the start position. */
    startIcon: string;
    /** Material Symbols icon name for the end position. */
    endIcon: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=button.component.d.ts.map