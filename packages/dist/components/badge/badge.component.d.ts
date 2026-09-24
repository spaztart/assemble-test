import { LitElement } from 'lit';
import '../icon/icon.js';
import '../status-indicator/status-indicator.js';
export type AsmBadgeStatus = 'high' | 'moderate' | 'low' | 'neutral' | 'dismissed' | 'stat' | 'offline';
export type AsmBadgeType = 'primary' | 'secondary' | 'tertiary';
export type AsmBadgeDotPosition = 'trailing' | 'leading';
/**
 * @tag asm-badge
 *
 * @csspart badge - The badge container.
 * @csspart label - The label text.
 * @csspart indicator - The status indicator (secondary type).
 * @csspart number - The numeric prefix (stat).
 */
export default class AsmBadge extends LitElement {
    static styles: import("lit").CSSResult;
    /** Badge label text (rendered uppercase). */
    label: string;
    /** Severity status. */
    status: AsmBadgeStatus;
    /** Visual treatment type. */
    type: AsmBadgeType;
    /** Status indicator position for secondary type. */
    dotPosition: AsmBadgeDotPosition;
    /** Numeric prefix (stat status only). */
    number: string;
    /** Leading icon name (primary type, high/moderate/low/neutral only). */
    icon: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=badge.component.d.ts.map