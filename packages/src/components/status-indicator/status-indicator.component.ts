import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './status-indicator.styles.js';

export type AsmStatusIndicatorStatus = 'critical' | 'attention' | 'info' | 'muted' | 'offline' | 'positive';
export type AsmStatusIndicatorStyle = 'neutral' | 'colored' | 'inverse';
export type AsmStatusIndicatorSize = 'small' | 'medium' | 'large';

/**
 * @tag asm-status-indicator
 *
 * @csspart dot - The status dot.
 * @csspart label - The optional label.
 */
export default class AsmStatusIndicator extends LitElement {
  static styles = styles;

  /** Status type. */
  @property({ reflect: true }) status: AsmStatusIndicatorStatus = 'info';

  /** Visual style. */
  @property({ reflect: true, attribute: 'indicator-style' }) indicatorStyle: AsmStatusIndicatorStyle = 'colored';

  /** Optional label text. */
  @property() label = '';

  /** Dot size. */
  @property({ reflect: true }) size: AsmStatusIndicatorSize = 'medium';

  render() {
    const classes = {
      'status-indicator': true,
      [`status-indicator--${this.status}`]: true,
      [`status-indicator--${this.indicatorStyle}`]: true,
      [`status-indicator--${this.size}`]: true,
    };

    return html`
      <span class=${classMap(classes)}>
        <span class="status-indicator__dot" part="dot"></span>
        ${this.label ? html`<span class="status-indicator__label" part="label">${this.label}</span>` : nothing}
      </span>
    `;
  }
}
