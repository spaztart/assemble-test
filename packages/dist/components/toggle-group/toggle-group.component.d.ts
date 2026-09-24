import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmToggleGroupSize = 'xsmall' | 'small' | 'medium' | 'large';
export type AsmToggleGroupVariant = 'page' | 'section';
/**
 * @tag asm-toggle-group
 *
 * @csspart group - The group container.
 *
 * @fires change - Fired when selection changes. Detail: { index: number }
 */
export default class AsmToggleGroup extends LitElement {
    static styles: import("lit").CSSResult;
    /** Toggle group size (page variant). */
    size: AsmToggleGroupSize;
    /** Toggle group variant. */
    variant: AsmToggleGroupVariant;
    /** Currently selected index. */
    selectedIndex: number;
    /** Disables the toggle group. */
    disabled: boolean;
    private _handleSelect;
    private _handleKeyDown;
    updated(changed: Map<string, unknown>): void;
    firstUpdated(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _observer?;
    private _syncItems;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=toggle-group.component.d.ts.map