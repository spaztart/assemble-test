import { LitElement } from 'lit';
export type AsmSkeletonShape = 'card' | 'standalone-text' | 'icon' | 'list-item' | 'neutral-shape' | 'tile' | 'button';
/**
 * @tag asm-skeleton-loader
 *
 * @csspart skeleton - The skeleton element.
 */
export default class AsmSkeletonLoader extends LitElement {
    static styles: import("lit").CSSResult;
    /** Shape preset. */
    shape: AsmSkeletonShape;
    /** Width (CSS value). */
    width: string;
    /** Height (CSS value). */
    height: string;
    /** Border radius (CSS value). */
    borderRadius: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=skeleton-loader.component.d.ts.map