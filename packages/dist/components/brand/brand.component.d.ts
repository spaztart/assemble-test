import { LitElement } from 'lit';
export type AsmBrandVariant = 'logo' | 'wordmark' | 'logo-wordmark';
export type AsmBrandColor = 'primary' | 'brand' | 'brand-orange' | 'white';
export type AsmBrandSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';
/**
 * @tag asm-brand
 *
 * Brand SVG component for logo, wordmark, or combined logo-wordmark.
 * Supports color variants mapped to design tokens and preset sizes.
 *
 * @csspart svg - The SVG element.
 */
export default class AsmBrand extends LitElement {
    static styles: import("lit").CSSResult;
    /** Brand variant: logo, wordmark, or logo-wordmark. */
    variant: AsmBrandVariant;
    /** Color variant: primary, brand (red), or brand-orange. */
    color: AsmBrandColor;
    /** Preset size: sm (16px), md (32px), lg (48px), xl (64px), or custom. */
    size: AsmBrandSize;
    /** Custom height in pixels. Overrides size when set. */
    height: number | null;
    private _getSvg;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=brand.component.d.ts.map