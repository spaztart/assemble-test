import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmAccordionType = 'white' | 'gray';
/**
 * @tag asm-accordion-item
 *
 * @csspart header - The accordion header.
 * @csspart content - The expanded content area.
 * @csspart chevron - The expand/collapse chevron.
 *
 * @fires toggle - Fired when expanded state changes. Detail: { expanded: boolean }
 */
export default class AsmAccordionItem extends LitElement {
    static styles: import("lit").CSSResult;
    /** Header title text. */
    title: string;
    /** Whether the accordion is expanded. */
    expanded: boolean;
    /** Background type. */
    type: AsmAccordionType;
    /** Optional leading icon. */
    leadingIcon: string;
    /** Disables the accordion. */
    disabled: boolean;
    private _toggle;
    private _handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=accordion.component.d.ts.map