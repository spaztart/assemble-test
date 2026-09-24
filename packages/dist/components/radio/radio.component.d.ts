import { LitElement } from 'lit';
/**
 * @tag asm-radio
 *
 * @csspart radio - The radio container.
 * @csspart state-layer - The state overlay layer.
 * @csspart circle - The radio circle.
 * @csspart label - The label text.
 *
 * @fires change - Fired when selected. Detail: { value: string }
 */
export default class AsmRadio extends LitElement {
    static styles: import("lit").CSSResult;
    /** This radio's value. */
    value: string;
    /** The group's selected value. */
    groupValue: string;
    /** Optional label text. */
    label: string;
    /** Disables the radio. */
    disabled: boolean;
    private get _selected();
    private _select;
    private _handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=radio.component.d.ts.map