import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './badge.styles.js';
import '../icon/icon.js';
import '../status-indicator/status-indicator.js';
import type { AsmStatusIndicatorStatus } from '../status-indicator/status-indicator.component.js';

export type AsmBadgeStatus = 'high' | 'moderate' | 'low' | 'neutral' | 'dismissed' | 'stat' | 'offline';
export type AsmBadgeType = 'primary' | 'secondary' | 'tertiary';
export type AsmBadgeDotPosition = 'trailing' | 'leading';

/** Map badge status → status-indicator status */
const STATUS_MAP: Record<string, AsmStatusIndicatorStatus> = {
  high: 'critical',
  moderate: 'attention',
  low: 'positive',
  neutral: 'info',
  stat: 'info',
};

/**
 * @tag asm-badge
 *
 * @csspart badge - The badge container.
 * @csspart label - The label text.
 * @csspart indicator - The status indicator (secondary type).
 * @csspart number - The numeric prefix (stat).
 */
export default class AsmBadge extends LitElement {
  static styles = styles;

  /** Badge label text (rendered uppercase). */
  @property() label = '';

  /** Severity status. */
  @property({ reflect: true }) status: AsmBadgeStatus = 'high';

  /** Visual treatment type. */
  @property({ reflect: true }) type: AsmBadgeType = 'primary';

  /** Status indicator position for secondary type. */
  @property({ attribute: 'dot-position' }) dotPosition: AsmBadgeDotPosition = 'trailing';

  /** Numeric prefix (stat status only). */
  @property() number = '';

  /** Leading icon name (primary type, high/moderate/low/neutral only). */
  @property() icon = '';

  render() {
    const classes = {
      'badge': true,
      [`badge--${this.status}`]: true,
      [`badge--${this.type}`]: true,
    };

    const showIcon = this.icon && this.type === 'primary' && ['high', 'moderate', 'low', 'neutral'].includes(this.status);
    const showIndicator = this.type === 'secondary' && this.status !== 'dismissed' && this.status !== 'offline';
    const showNumber = this.status === 'stat' && this.number;
    const indicatorStatus = STATUS_MAP[this.status] || 'info';

    const indicator = showIndicator
      ? html`<asm-status-indicator class="badge__indicator" status=${indicatorStatus} size="small" part="indicator"></asm-status-indicator>`
      : nothing;

    return html`
      <span class=${classMap(classes)} part="badge" role="status">
        ${showIndicator && this.dotPosition === 'leading' ? indicator : nothing}
        ${showIcon ? html`<asm-icon class="badge__icon" name=${this.icon}></asm-icon>` : nothing}
        ${showNumber ? html`<span class="badge__number" part="number">${this.number}</span>` : nothing}
        <span class="badge__label" part="label">${this.label}</span>
        ${showIndicator && this.dotPosition === 'trailing' ? indicator : nothing}
      </span>
    `;
  }
}
