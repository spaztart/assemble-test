import { LitElement } from 'lit';
export type AsmCardVariant = 'surface' | 'outlined' | 'brand' | 'secondary' | 'positive' | 'gradient';
export type AsmCardElevation = '1' | '5';
/**
 * @tag asm-card
 *
 * An Assemble surface container card.
 *
 * Supports six visual variants out of the box:
 * - `surface` (default): Light surface with `onSurface` text.
 * - `outlined`: Surface card with a 1px brand-gradient stroke.
 * - `brand`: Brand-red filled card.
 * - `secondary`: Secondary-blue filled card.
 * - `positive`: Positive/teal filled card.
 * - `gradient`: Lavender → mint gradient fill.
 *
 * Specs (from Figma):
 * - Border radius: 24px (`--md-border-radius-24`)
 * - Padding: 20px (`--md-spacing-500`)
 * - Elevation-1 shadow: `0 0 4px 0` of `--md-sys-color-shadow`
 *
 * @slot - Default slot for card content.
 *
 * @csspart card - The card container element.
 * @csspart state-layer - The interactive state overlay.
 *
 * @cssprop [--asm-card-radius=var(--md-border-radius-24, 24px)] - Corner radius override.
 * @cssprop [--asm-card-padding=var(--md-spacing-500, 20px)] - Inner padding override.
 * @cssprop [--asm-card-shadow] - Box shadow override.
 * @cssprop [--asm-card-background] - Background color/gradient override.
 * @cssprop [--asm-card-foreground] - Text/icon color override.
 * @cssprop [--asm-card-border] - Border override.
 */
export default class AsmCard extends LitElement {
    static styles: import("lit").CSSResult;
    /** Visual variant of the card. */
    variant: AsmCardVariant;
    /**
     * When true, the card is interactive (shows hover/focus/active states and
     * emits click). Adds `cursor: pointer` and state-layer effects.
     */
    clickable: boolean;
    /**
     * Elevation level. Omit for no shadow, `"1"` for subtle (4px blur),
     * `"5"` for prominent (20px blur).
     */
    elevation?: AsmCardElevation;
    render(): import("lit-html").TemplateResult<1>;
    private _handleClick;
    private _handleKeydown;
}
//# sourceMappingURL=card.component.d.ts.map