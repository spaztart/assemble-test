import { LitElement } from 'lit';
import './tab.js';
export type AsmTabVariant = 'text' | 'icon-horizontal' | 'icon-vertical' | 'icon';
/**
 * @tag asm-tab-group
 *
 * Container for `<asm-tab>` items. Controls layout variant and manages selection.
 *
 * @slot - Default slot for `<asm-tab>` elements.
 *
 * @fires tab-change - Fired when the active tab changes. Detail: { index: number }
 */
export default class AsmTabGroup extends LitElement {
    static styles: import("lit").CSSResult;
    /** Layout variant for all child tabs. */
    variant: AsmTabVariant;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleTabSelect;
    private _getTabs;
    protected updated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=tab-group.component.d.ts.map