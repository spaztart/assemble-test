import { LitElement } from 'lit';
import '../icon/icon.js';
/**
 * @tag asm-modal
 *
 * A modal dialog with blurred backdrop.
 *
 * The overlay is teleported to document.body when opened so it
 * always renders above the entire page regardless of ancestor
 * stacking contexts (transforms, filters, backdrop-filter, etc.).
 *
 * Variants:
 * - Default: solid surface background
 * - Gradient: promotional gradient background (set `gradient` attribute)
 *
 * @csspart overlay - The full-screen backdrop overlay.
 * @csspart surface - The modal surface container.
 * @csspart close - The close button.
 * @csspart content - The content wrapper.
 * @csspart header - The header text (standard variant).
 * @csspart body - The body text (standard variant).
 * @csspart actions - The action button row (standard variant).
 *
 * @slot - Default slot for custom modal content.
 * @slot actions - Slot for action buttons.
 *
 * @fires close - Fired when the modal is dismissed (close button, backdrop click, or Escape).
 */
export default class AsmModal extends LitElement {
    static styles: import("lit").CSSResult;
    /** Whether the modal is open/visible. */
    open: boolean;
    /** Header text (for standard text variant). */
    header: string;
    /** Body text (for standard text variant). */
    body: string;
    /** Whether to show the close button. */
    showClose: boolean;
    /** Whether the backdrop click dismisses the modal. */
    barrierDismiss: boolean;
    /** Whether to use gradient background. */
    gradient: boolean;
    /** Accessible label for the modal. */
    ariaLabel: string | null;
    private _overlayContainer;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleKeydown;
    private _dismiss;
    private _handleBackdropClick;
    private _createOverlay;
    private _removeOverlay;
    private _renderOverlayContent;
    updated(changed: Map<string, unknown>): void;
    render(): symbol;
}
//# sourceMappingURL=modal.component.d.ts.map