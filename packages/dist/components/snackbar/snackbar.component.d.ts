import { LitElement } from 'lit';
import '../icon/icon.js';
/**
 * @tag asm-snackbar
 *
 * @csspart snackbar - The snackbar container.
 * @csspart message - The message text.
 * @csspart action - The action button.
 * @csspart close - The close button.
 *
 * @fires action - Fired when the action button is clicked.
 * @fires close - Fired when the close button is clicked.
 */
export default class AsmSnackbar extends LitElement {
    static styles: import("lit").CSSResult;
    /** Snackbar message. */
    message: string;
    /** Action button label. */
    actionLabel: string;
    /** Whether the snackbar is visible. */
    open: boolean;
    /** Auto-dismiss duration in ms (0 = no auto-dismiss). */
    duration: number;
    /** Icon name shown before message. */
    leadingIcon: string;
    private _dismissTimer?;
    updated(changed: Map<string, unknown>): void;
    disconnectedCallback(): void;
    private _handleAction;
    private _handleClose;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=snackbar.component.d.ts.map