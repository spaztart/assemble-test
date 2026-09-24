import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmSplitButtonVariant = 'filled' | 'tonal' | 'outline';
export type AsmSplitButtonSize = 'huge' | 'spacious' | 'default' | 'compact';
/**
 * @tag asm-split-button
 *
 * A split button with a primary action and a dropdown trigger.
 * The left side performs the main action, the right chevron opens a dropdown menu.
 *
 * @fires action - Fired when the primary (left) button is clicked.
 * @fires toggle - Fired when the dropdown trigger (right) button is clicked. Detail contains `{ open: boolean }`.
 *
 * @csspart action - The primary action button.
 * @csspart action-state - The state overlay for the action button.
 * @csspart action-content - The content wrapper of the action button.
 * @csspart label - The label text span.
 * @csspart divider - The vertical divider between action and trigger.
 * @csspart trigger - The dropdown trigger button.
 * @csspart trigger-state - The state overlay for the trigger button.
 * @csspart dropdown - The dropdown container for slotted menu content.
 *
 * @slot - Default slot for dropdown content (e.g. asm-menu).
 */
export default class AsmSplitButton extends LitElement {
    static styles: import("lit").CSSResult;
    /** The button label text. */
    label: string;
    /** The visual variant. */
    variant: AsmSplitButtonVariant;
    /** The button size. */
    size: AsmSplitButtonSize;
    /** Disables the button. */
    disabled: boolean;
    /** Destructive / danger mode (filled and tonal only). */
    destructive: boolean;
    /** Material Symbols icon name for the start position. */
    startIcon: string;
    /** Whether the dropdown is open. */
    open: boolean;
    private _onActionClick;
    private _onTriggerClick;
    private _onOutsideClick;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=split-button.component.d.ts.map