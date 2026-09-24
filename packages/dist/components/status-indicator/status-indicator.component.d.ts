import { LitElement } from 'lit';
export type AsmStatusIndicatorStatus = 'critical' | 'attention' | 'info' | 'muted' | 'offline' | 'positive';
export type AsmStatusIndicatorStyle = 'neutral' | 'colored' | 'inverse';
export type AsmStatusIndicatorSize = 'small' | 'medium' | 'large';
/**
 * @tag asm-status-indicator
 *
 * @csspart dot - The status dot.
 * @csspart label - The optional label.
 */
export default class AsmStatusIndicator extends LitElement {
    static styles: import("lit").CSSResult;
    /** Status type. */
    status: AsmStatusIndicatorStatus;
    /** Visual style. */
    indicatorStyle: AsmStatusIndicatorStyle;
    /** Optional label text. */
    label: string;
    /** Dot size. */
    size: AsmStatusIndicatorSize;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=status-indicator.component.d.ts.map