import { LitElement } from 'lit';
import '../brand/brand.js';
import '../icon/icon.js';
/**
 * @tag asm-nav-list-item
 *
 * A single tappable row inside an asm-nav-drawer.
 *
 * Specs:
 * - Leading icon (optional), bodyLarge label, trailing arrow (default)
 * - Hover/pressed/focus neutral state layers, 8px corner radius
 * - Disabled: 38% opacity, not focusable
 *
 * Accessibility:
 * - role="button", Enter/Space activates
 * - Disabled rows announced as disabled
 * - Decorative icons excluded from screen reader
 *
 * @csspart item - The item button.
 */
export declare class AsmNavListItem extends LitElement {
    static styles: import("lit").CSSResult;
    /** Row label text. Required, non-empty. */
    label: string;
    /** Optional leading Material icon name. */
    icon: string;
    /** Trailing icon name. Defaults to arrow_forward. */
    trailingIcon: string;
    /** Whether to show the trailing icon. */
    showTrailing: boolean;
    /** Whether the item is disabled. */
    disabled: boolean;
    /** Override accessible label. */
    semanticLabel: string;
    private _handleClick;
    private _handleKeydown;
    render(): import("lit-html").TemplateResult<1>;
}
/**
 * @tag asm-nav-drawer
 *
 * Full side-panel navigation drawer.
 *
 * Specs:
 * - surfaceBright background, rounded trailing corners (0 16 16 0)
 * - Elevation-5 shadow, 320px default width
 * - Brand header: McAfee wordmark at top
 * - Scrollable body with sections
 * - Optional pinned footer
 *
 * Slots:
 * - `(default)` – Nav sections (asm-nav-list-item elements)
 * - `footer` – Pinned footer content
 *
 * Accessibility:
 * - role="navigation" with aria-label
 * - Category headers announced as headings
 *
 * @csspart drawer - The drawer surface.
 * @csspart header - The brand header area.
 * @csspart body - The scrollable body.
 * @csspart footer - The pinned footer.
 */
export default class AsmNavDrawer extends LitElement {
    static styles: import("lit").CSSResult;
    /** Show brand wordmark header at top. */
    brand: boolean;
    /** Accessible label for the navigation. */
    navLabel: string;
    render(): import("lit-html").TemplateResult<1>;
}
/**
 * @tag asm-nav-section
 *
 * Groups nav list items under an optional category header.
 *
 * @csspart section - The section container.
 * @csspart header - The category header text.
 */
export declare class AsmNavSection extends LitElement {
    static styles: import("lit").CSSResult;
    /** Optional category header title. Uppercase mono. */
    title: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=nav-drawer.component.d.ts.map