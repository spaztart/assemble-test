import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmTagVariant = 'standard' | 'critical' | 'filter';
/**
 * @tag asm-tag
 *
 * @csspart tag - The tag container.
 * @csspart label - The label text.
 * @csspart close - The close button (filter variant).
 *
 * @fires close - Fired when close button is clicked (filter variant).
 */
export default class AsmTag extends LitElement {
    static styles: import("lit").CSSResult;
    /** Tag label text. */
    label: string;
    /** Visual variant. */
    variant: AsmTagVariant;
    /** Leading icon name. */
    leadingIcon: string;
    /** Whether the close button is shown (filter variant). */
    closable: boolean;
    /** Accessible label for the close button. */
    closeLabel: string;
    private _handleClose;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=tag.component.d.ts.map