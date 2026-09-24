import { LitElement } from 'lit';
import './menu-item.js';
export type AsmMenuDensity = 'default' | 'low' | 'compact';
/**
 * @tag asm-menu
 *
 * A menu container that holds asm-menu-item elements.
 *
 * @csspart menu - The menu container element.
 *
 * @slot - Default slot for asm-menu-item elements.
 */
export default class AsmMenu extends LitElement {
    static styles: import("lit").CSSResult;
    /** The density applied to all child menu items. */
    density: AsmMenuDensity;
    private _observer;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<string, unknown>): void;
    private _propagateDensity;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=menu.component.d.ts.map