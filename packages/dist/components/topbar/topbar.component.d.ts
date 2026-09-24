import { LitElement } from 'lit';
import '../icon/icon.js';
import '../progress-bar/progress-bar.js';
export type AsmTopbarType = 'home' | 'back' | 'general' | 'progress';
export type AsmTopbarDesktopType = 'full-header' | 'back-only';
/**
 * @tag asm-topbar
 *
 * A compact top navigation bar (mobile/tablet).
 *
 * @fires left-press - Fired when left tile is clicked.
 * @fires right-press - Fired when right tile is clicked.
 */
export default class AsmTopbar extends LitElement {
    static styles: import("lit").CSSResult;
    /** Layout type: home, back, general, or progress. */
    type: AsmTopbarType;
    /** Title text (back/general types). */
    title: string;
    /** Whether to show the title. */
    showTitle: boolean;
    /** Whether to show left action tile. */
    showLeft: boolean;
    /** Whether to show right action tile. */
    showRight: boolean;
    /** Left tile icon name. Defaults by type. */
    leftIcon: string;
    /** Right tile icon name. */
    rightIcon: string;
    /** Show notification badge on right tile. */
    showBadge: boolean;
    /** Progress value 0-1 (progress type only). */
    progress: number;
    private get _leftIconName();
    private _handleLeftPress;
    private _handleRightPress;
    render(): import("lit-html").TemplateResult<1>;
}
/**
 * @tag asm-topbar-desktop
 *
 * A desktop navigation header bar.
 *
 * @fires press - Fired when the topbar is activated.
 */
export declare class AsmTopbarDesktop extends LitElement {
    static styles: import("lit").CSSResult;
    /** Layout type: full-header or back-only. */
    type: AsmTopbarDesktopType;
    /** Title text. */
    title: string;
    /** Optional subtitle (mono, uppercase). */
    subTitle: string;
    /** Show leading back chevron. */
    showBack: boolean;
    /** Show leading icon tile. */
    showIcon: boolean;
    /** Leading icon name. */
    leadingIcon: string;
    private _handlePress;
    render(): import("lit-html").TemplateResult<1>;
    private _handleKeydown;
}
//# sourceMappingURL=topbar.component.d.ts.map