import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmFeedbackValue = 'thumbs-up' | 'thumbs-down' | null;
/**
 * @tag asm-feedback
 *
 * A thumbs up/down feedback widget.
 *
 * @fires thumbs-up - Fired when thumbs up is clicked.
 * @fires thumbs-down - Fired when thumbs down is clicked.
 */
export default class AsmFeedback extends LitElement {
    static styles: import("lit").CSSResult;
    /** Optional label text. */
    label: string;
    /** Currently selected value: 'thumbs-up', 'thumbs-down', or null. */
    value: AsmFeedbackValue;
    private _handleThumbsUp;
    private _handleThumbsDown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=feedback.component.d.ts.map