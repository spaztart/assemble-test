import { LitElement, html, css, unsafeCSS } from 'lit';

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

const variants = [
  'display-large',
  'display-large-bold',
  'display-medium',
  'display-medium-bold',
  'display-small',
  'display-small-bold',
  'headline-large',
  'headline-large-bold',
  'headline-medium',
  'headline-medium-bold',
  'headline-small',
  'headline-small-bold',
  'title-large',
  'title-large-bold',
  'title-medium',
  'title-medium-bold',
  'title-small',
  'title-small-bold',
  'body-large',
  'body-large-bold',
  'body-medium',
  'body-medium-bold',
  'body-small',
  'body-small-bold',
  'label-large',
  'label-large-bold',
  'label-medium',
  'label-medium-bold',
  'label-small',
  'label-small-bold',
] as const;

export type AsmTextVariant = (typeof variants)[number];

const registry: Record<string, typeof LitElement> = {};

for (const variant of variants) {
  const tag = `asm-${variant}`;
  const tokenPrefix = `--md-sys-typescale-${variant}`;

  const AsmText = class extends LitElement {
    static styles = css`
      :host {
        display: inline;
        font-family: var(${unsafeCSS(tokenPrefix)}-fontFamily);
        font-size: var(${unsafeCSS(tokenPrefix)}-fontSize);
        font-weight: var(${unsafeCSS(tokenPrefix)}-fontWeight);
        line-height: var(${unsafeCSS(tokenPrefix)}-lineHeight);
        letter-spacing: var(${unsafeCSS(tokenPrefix)}-letterSpacing);
        color: var(--asm-text-color, inherit);
      }
    `;

    render() {
      return html`<slot></slot>`;
    }
  };

  customElements.define(tag, AsmText);
  registry[tag] = AsmText;
}

export { registry as AsmTextElements };
export default registry;
