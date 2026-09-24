import { LitElement } from 'lit';
/**
 * @tag asm-toggle-item
 * Data element for asm-toggle-group. Does not render — attributes are read by the parent.
 */
export default class AsmToggleItem extends LitElement {
    label: string;
    startIcon: string;
    endIcon: string;
    active: boolean;
    createRenderRoot(): this;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=toggle-item.component.d.ts.map