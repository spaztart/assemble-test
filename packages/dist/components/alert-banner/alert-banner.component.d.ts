import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmAlertBannerMode = 'neutral' | 'info' | 'critical' | 'positive' | 'status';
/**
 * @tag asm-alert-banner
 *
 * A compact, dismissable alert banner.
 *
 * Layout (per Figma `alert_banner`):
 * - 44px min height, 12px padding, 8px radius
 * - Left: leading icon (18px) + title text
 * - Right: optional action link + 20px close icon
 *
 * @csspart container - The banner container.
 * @csspart icon - The leading icon.
 * @csspart title - The title text.
 * @csspart action - The action link.
 * @csspart close - The close button.
 *
 * @fires action - Fired when the action link is clicked.
 * @fires close - Fired when the close button is clicked.
 */
export default class AsmAlertBanner extends LitElement {
    static styles: import("lit").CSSResult;
    /** Headline text shown to the right of the leading icon. */
    title: string;
    /** Visual mode controlling background and content colour. */
    mode: AsmAlertBannerMode;
    /** Leading Material Symbols icon name. */
    icon: string;
    /** Optional action link label (e.g. "View plans"). When empty, no link is rendered. */
    actionLabel: string;
    /** Whether the close button is shown. */
    showClose: boolean;
    /** Accessible label for the close button. */
    closeLabel: string;
    private _handleAction;
    private _handleClose;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=alert-banner.component.d.ts.map