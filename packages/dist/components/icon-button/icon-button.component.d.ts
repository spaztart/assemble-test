import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outline';
export type AsmIconButtonSize = 'huge' | 'spacious' | 'default' | 'compact';
/**
 * @tag asm-icon-button
 *
 * @csspart button - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart icon - The icon element.
 */
export default class AsmIconButton extends LitElement {
    static styles: import("lit").CSSResult;
    /** Material Symbols icon name. */
    icon: string;
    /** The visual variant. */
    variant: AsmIconButtonVariant;
    /** The button size. */
    size: AsmIconButtonSize;
    /** Disables the button. */
    disabled: boolean;
    /** Applies destructive/error styling. */
    destructive: boolean;
    /** Toggle/selected state. */
    selected: boolean;
    /** Accessible label for the button. */
    label: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=icon-button.component.d.ts.map