import { LitElement } from 'lit';
import '../icon/icon.js';
import '../status-indicator/status-indicator.js';
import '../status-notification/status-notification.js';
export type AsmListItemKind = 'interactive' | 'read-only';
export type AsmListItemState = 'default' | 'unread' | 'badge';
/**
 * @tag asm-list-item
 *
 * A feature list item row for dashboards, settings lists, and accordion bodies.
 * Supports leading icon, overline, title, supporting text, trailing chevron,
 * expandable content, and status states using asm-status-indicator (unread)
 * and asm-status-notification (badge).
 *
 * @slot leading - Leading content (icon container, avatar, image).
 * @slot - Default slot for right-content area.
 * @slot trailing - Custom trailing widget (overrides default chevron).
 * @slot expanded - Expandable body content revealed when `expanded` is true.
 *
 * @fires press - Fired when the row is clicked or activated via keyboard.
 */
export default class AsmListItem extends LitElement {
    static styles: import("lit").CSSResult;
    /** Primary title text. Required. */
    title: string;
    /** Optional uppercase overline above the title. */
    overline: string;
    /** Optional secondary line below the title. */
    supportingText: string;
    /** Interaction model: 'interactive' (default) or 'read-only'. */
    kind: AsmListItemKind;
    /** Content state: 'default', 'unread', or 'badge'. */
    state: AsmListItemState;
    /** Badge count (only visible when state is 'badge'). */
    badgeCount: number;
    /** Whether trailing icon is shown. */
    showTrailingIcon: boolean;
    /** Whether expanded slot is visible. */
    expanded: boolean;
    /** Whether the item is disabled. */
    disabled: boolean;
    /** Accessible label override. */
    ariaLabel: string | null;
    private _handleClick;
    private _handleKeydown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=list-item.component.d.ts.map