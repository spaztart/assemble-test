import { LitElement } from 'lit';
/**
 * @tag asm-checkbox
 *
 * @csspart checkbox - The checkbox container.
 * @csspart state-layer - The state overlay layer.
 * @csspart box - The checkbox box.
 * @csspart label - The label text.
 *
 * @fires change - Fired when value changes. Detail: { value: boolean | null }
 */
export default class AsmCheckbox extends LitElement {
    static styles: import("lit").CSSResult;
    /** Checked state: true, false, or null (indeterminate). */
    checked: boolean | null;
    /** Enable tristate (indeterminate) cycling. */
    tristate: boolean;
    /** Optional label text. */
    label: string;
    /** Show error styling. */
    error: boolean;
    /** Disables the checkbox. */
    disabled: boolean;
    private _toggle;
    private _handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=checkbox.component.d.ts.map