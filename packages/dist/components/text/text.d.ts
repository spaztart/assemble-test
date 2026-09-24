import { LitElement } from 'lit';
/**
 * Assemble typescale text elements.
 *
 * Registers custom elements for every typescale variant defined in the
 * design token system. Each element applies the correct font-family,
 * font-size, font-weight, line-height, and letter-spacing from the
 * corresponding `--md-sys-typescale-*` CSS custom properties.
 *
 * Usage:
 * ```html
 * <asm-display-large>Hero Heading</asm-display-large>
 * <asm-body-large>Paragraph text</asm-body-large>
 * <asm-label-medium>BUTTON LABEL</asm-label-medium>
 * ```
 *
 * Override text color via the `--asm-text-color` custom property:
 * ```html
 * <asm-body-large style="--asm-text-color: var(--md-sys-color-on-surface-variant)">
 *   Muted text
 * </asm-body-large>
 * ```
 *
 * @cssprop [--asm-text-color=inherit] - Text color override.
 */
declare const variants: readonly ["display-large", "display-large-bold", "display-medium", "display-medium-bold", "display-small", "display-small-bold", "headline-large", "headline-large-bold", "headline-medium", "headline-medium-bold", "headline-small", "headline-small-bold", "title-large", "title-large-bold", "title-medium", "title-medium-bold", "title-small", "title-small-bold", "body-large", "body-large-bold", "body-medium", "body-medium-bold", "body-small", "body-small-bold", "label-large", "label-large-bold", "label-medium", "label-medium-bold", "label-small", "label-small-bold"];
export type AsmTextVariant = (typeof variants)[number];
declare const registry: Record<string, typeof LitElement>;
export { registry as AsmTextElements };
export default registry;
//# sourceMappingURL=text.d.ts.map