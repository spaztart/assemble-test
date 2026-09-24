import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmSwitchSize = 'large' | 'medium' | 'small';
export type AsmSwitchTone = 'secondary' | 'primary';
/**
 * @tag asm-switch
 *
 * @csspart track - The switch track.
 * @csspart handle - The switch handle/thumb.
 *
 * @fires change - Fired when value changes. Detail: { value: boolean }
 */
export default class AsmSwitch extends LitElement {
    static styles: import("lit").CSSResult;
    /** Whether the switch is on. */
    value: boolean;
    /** Switch size. */
    size: AsmSwitchSize;
    /** Color tone. */
    tone: AsmSwitchTone;
    /** Icon name shown on handle when on. */
    icon: string;
    /** Shows loading spinner. */
    loading: boolean;
    /** Disables the switch. */
    disabled: boolean;
    /** Accessible label. */
    label: string;
    private _toggle;
    private _handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=switch.component.d.ts.map