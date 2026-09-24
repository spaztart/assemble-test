import { LitElement } from 'lit';
import '../brand/brand.js';
import '../status-indicator/status-indicator.js';
import '../peek-label/peek-label.js';
import '../icon/icon.js';
export type AsmNavRailOrientation = 'vertical' | 'horizontal';
/**
 * @tag asm-navigation-rail
 *
 * A vertical (or horizontal) navigation rail surface.
 *
 * Specs (from Figma):
 * - 52×52 icon slots, 4px gap, surfaceBright background
 * - Border radius: 16px (cornerLarge)
 * - Elevation-5: 0 0 20px shadow
 * - Brand slot: McAfee logo, interactive or decorative
 *
 * Slots:
 * - `top` – Items anchored to the top (below brand if shown)
 * - `(default)` – Items in the middle
 * - `bottom` – Items anchored to the bottom
 *
 * @csspart rail - The rail surface container.
 */
export default class AsmNavigationRail extends LitElement {
    static styles: import("lit").CSSResult;
    /** Rail orientation: vertical (side rail) or horizontal (bottom nav). */
    orientation: AsmNavRailOrientation;
    /** Show McAfee brand slot at the top. */
    brand: boolean;
    /** Make the brand slot interactive (button). */
    brandInteractive: boolean;
    /** Whether the brand slot is the active destination. */
    brandActive: boolean;
    /** Accessible label for the brand slot. */
    brandLabel: string;
    private _brandHovered;
    private _handleBrandClick;
    render(): import("lit-html").TemplateResult<1>;
    private _renderBrand;
}
//# sourceMappingURL=navigation-rail.component.d.ts.map