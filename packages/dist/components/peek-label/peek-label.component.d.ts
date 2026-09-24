import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmPeekLabelSize = 'default' | 'small';
/**
 * @tag asm-peek-label
 *
 * A floating chip label (e.g. nav rail hover labels).
 * Purely presentational — caller positions it.
 */
export default class AsmPeekLabel extends LitElement {
    static styles: import("lit").CSSResult;
    /** Text content of the label. */
    text: string;
    /** Size variant. */
    size: AsmPeekLabelSize;
    /** Optional trailing icon name. */
    trailingIcon: string;
    /** Muted/offline styling. */
    offline: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=peek-label.component.d.ts.map