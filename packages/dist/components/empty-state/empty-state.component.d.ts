import { LitElement } from 'lit';
import '../icon/icon.js';
/**
 * @tag asm-empty-state
 *
 * @csspart container - The empty state wrapper.
 * @csspart icon-wrapper - The icon background circle.
 * @csspart title - The title text.
 * @csspart description - The description text.
 *
 * @slot action - Slot for action button(s).
 */
export default class AsmEmptyState extends LitElement {
    static styles: import("lit").CSSResult;
    /** Icon name (Material Symbols). */
    icon: string;
    /** Whether to show the icon. */
    showIcon: boolean;
    /** Title text. */
    title: string;
    /** Description text. */
    description: string;
    /** Icon size in pixels. */
    iconSize: number;
    /** Icon background circle size in pixels. */
    iconBackgroundSize: number;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=empty-state.component.d.ts.map