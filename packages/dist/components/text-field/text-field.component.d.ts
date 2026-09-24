import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmTextFieldVariant = 'filled' | 'outlined';
/**
 * @tag asm-text-field
 *
 * @csspart field - The field container.
 * @csspart input - The native input/textarea.
 * @csspart label - The floating label.
 * @csspart supporting - The supporting/error text.
 *
 * @fires input - Fired on text input.
 * @fires change - Fired on value committed.
 */
export default class AsmTextField extends LitElement {
    static styles: import("lit").CSSResult;
    /** Field label (floats on focus/value). */
    label: string;
    /** Placeholder text. */
    placeholder: string;
    /** Field value. */
    value: string;
    /** Visual variant. */
    variant: AsmTextFieldVariant;
    /** Helper text below field. */
    supportingText: string;
    /** Error text (replaces supporting text, triggers error state). */
    errorText: string;
    /** Leading icon name. */
    leadingIcon: string;
    /** Trailing icon name. */
    trailingIcon: string;
    /** Disables the field. */
    disabled: boolean;
    /** Read-only mode. */
    readOnly: boolean;
    /** Password masking. */
    obscureText: boolean;
    /** Max character length. */
    maxLength: number | null;
    /** Max lines (1 = single-line input, >1 = textarea). */
    maxLines: number;
    /** Input type. */
    type: string;
    private _focused;
    private get _hasValue();
    private get _isError();
    private _handleInput;
    private _handleChange;
    private _handleFocus;
    private _handleBlur;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=text-field.component.d.ts.map