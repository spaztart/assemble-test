import { LitElement } from 'lit';
import type { AsmStatusIndicatorStatus } from '../status-indicator/status-indicator.component.js';
import '../status-indicator/status-indicator.js';
import '../peek-label/peek-label.js';
import '../icon/icon.js';
import '../loader/loader.js';
export type AsmNavRailPeekPosition = 'right' | 'top';
/**
 * @tag asm-navigation-rail-item
 *
 * A single 52×52 interactive slot inside an asm-navigation-rail.
 *
 * Specs:
 * - 52×52, 12px corner radius, 20×20 icon centered
 * - Hover: neutral state layer
 * - Active (nav destination): solid brand-orange fill, white icon
 * - Active (toggle/status): 12%-alpha brand gradient, info status dot
 * - Status: optional status-indicator badge at top-right
 * - Peek label: shown on hover for vertical rails
 * - Disabled: 38% opacity, not focusable
 *
 * Accessibility:
 * - `role="button"`, `aria-label` from `label` or `semantic-label`
 * - `aria-current="page"` when active
 * - `aria-disabled` when disabled
 * - Keyboard: Enter/Space activates
 *
 * @csspart item - The item button element.
 */
export default class AsmNavigationRailItem extends LitElement {
    static styles: import("lit").CSSResult;
    /** Human-readable name — drives peek label and accessible name. */
    label: string;
    /** Override accessible name when it should differ from the visible label. */
    semanticLabel: string;
    /** Material Symbols icon name (e.g. "home", "settings"). */
    icon: string;
    /** Whether this slot is the active/selected destination. */
    active: boolean;
    /** Whether this slot is disabled. */
    disabled: boolean;
    /** Optional status dot badge. */
    status: AsmStatusIndicatorStatus | '';
    /** Whether the item has toggle behaviour (status-based on/off). */
    toggle: boolean;
    /** Whether to show the peek label on hover (set false for horizontal rail). */
    showPeek: boolean;
    /** Peek label position: right (vertical rail) or top (horizontal rail). */
    peekPosition: AsmNavRailPeekPosition;
    /** Whether this item is in a loading state (shows spinner badge). */
    loading: boolean;
    /** Duration in ms for the loading state during toggle. */
    toggleDuration: number;
    private _hovered;
    private _handleClick;
    private _runToggle;
    private _handleKeydown;
    private get _accessibleLabel();
    /** Whether this is a plain nav destination (not a toggle slot). */
    private get _isBrandFilled();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=navigation-rail-item.component.d.ts.map