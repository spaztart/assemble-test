import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmMenuItemDensity = 'default' | 'low' | 'compact';
/**
 * @tag asm-menu-item
 *
 * A single item within an asm-menu.
 *
 * @csspart item - The native `<button>` element.
 * @csspart state-layer - The state overlay layer.
 * @csspart content - The content wrapper.
 * @csspart label - The label text span.
 * @csspart supporting-text - The supporting text span.
 * @csspart leading - The leading icon area.
 * @csspart trailing - The trailing icon area.
 */
export default class AsmMenuItem extends LitElement {
    static styles: import("lit").CSSResult;
    /** The menu item label text. */
    label: string;
    /** Optional supporting text below the label. */
    supportingText: string;
    /** Material Symbols icon name for the leading position. */
    startIcon: string;
    /** Material Symbols icon name for the trailing position. */
    endIcon: string;
    /** Whether this item is selected. */
    selected: boolean;
    /** Whether this item is disabled. */
    disabled: boolean;
    /** The density of this item (inherited from parent menu if not set). */
    density: AsmMenuItemDensity;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=menu-item.component.d.ts.map