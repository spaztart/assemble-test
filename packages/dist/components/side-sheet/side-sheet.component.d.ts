import { LitElement, nothing } from 'lit';
/**
 * @tag asm-side-sheet
 *
 * A vertical side-sheet surface for the Assemble design system.
 *
 * Layout primitive meant to dock to the right of main UI. Exposes
 * three optional regions:
 * 1. header - sticky, never scrolls
 * 2. default slot - scrolling content (only part that scrolls)
 * 3. footer - sticky, never scrolls
 *
 * Visual contract (Figma):
 * - Background: md.sys.color.surface-bright
 * - Padding: md.spacing.400 (16px) all sides
 * - Corners: md.border.radius.16 (cornerLarge)
 * - Elevation: 0 0 20px 0 md.sys.color.shadow (elevation-5)
 *
 * @csspart container - The sheet outer container.
 * @csspart header - The sticky header region.
 * @csspart content - The scrolling content region.
 * @csspart footer - The sticky footer region.
 *
 * @slot - Default slot for scrolling content.
 * @slot header - Slot for sticky header content.
 * @slot footer - Slot for sticky footer content.
 */
export default class AsmSideSheet extends LitElement {
    static styles: import("lit").CSSResult;
    /** Whether the side sheet is visible. */
    open: boolean;
    /** Gap between child items in pixels. */
    gap: number;
    /** Optional explicit width. */
    width: string;
    /** Optional explicit height (defaults to filling parent). */
    height: string;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=side-sheet.component.d.ts.map