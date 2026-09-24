import { LitElement } from 'lit';
import '../icon/icon.js';
/**
 * @tag asm-tab
 *
 * Individual tab item. Must be used inside `<asm-tab-group>`.
 *
 * @csspart tab - The tab content wrapper.
 * @csspart indicator - The active underline indicator.
 * @csspart label - The label text.
 */
export default class AsmTab extends LitElement {
    static styles: import("lit").CSSResult;
    /** The tab label text. */
    label: string;
    /** Material Symbols icon name. */
    icon: string;
    /** Whether this tab is active. */
    active: boolean;
    /** Layout mode set by parent tab-group. */
    layout: 'text' | 'icon-horizontal' | 'icon-vertical' | 'icon';
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleClick;
    private _handleKeydown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=tab.component.d.ts.map