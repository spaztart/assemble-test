import { LitElement } from 'lit';
export type AsmStatusNotificationStatus = 'critical' | 'attention' | 'info' | 'loader';
/**
 * @tag asm-status-notification
 *
 * @csspart badge - The notification badge pill.
 */
export default class AsmStatusNotification extends LitElement {
    static styles: import("lit").CSSResult;
    /** Status type (determines color). */
    status: AsmStatusNotificationStatus;
    /** Count number to display. Values >99 show "99+". */
    count: number;
    private get _displayCount();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=status-notification.component.d.ts.map