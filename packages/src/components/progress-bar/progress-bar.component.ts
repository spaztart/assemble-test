import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './progress-bar.styles.js';

export type AsmProgressBarStatus = 'brand' | 'moderate' | 'critical' | 'low';
export type AsmProgressBarSize = 'thick' | 'thin';

/**
 * @tag asm-progress-bar
 *
 * A determinate horizontal progress bar with status color variants.
 *
 * @csspart track - The background track.
 * @csspart fill - The filled portion.
 */
export default class AsmProgressBar extends LitElement {
  static styles = styles;

  /** Progress value between 0 and 1. */
  @property({ type: Number }) value = 0;

  /** Color status: brand, moderate, critical, or low. */
  @property({ reflect: true }) status: AsmProgressBarStatus = 'brand';

  /** Size: thick (14px) or thin (8px). */
  @property({ reflect: true }) size: AsmProgressBarSize = 'thick';

  /** Accessible label. */
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = null;

  render() {
    const clamped = Math.max(0, Math.min(1, this.value));
    const percent = Math.round(clamped * 100);

    const classes = {
      'progress-bar': true,
      'progress-bar--thick': this.size === 'thick',
      'progress-bar--thin': this.size === 'thin',
      [`progress-bar--${this.status}`]: true,
    };

    return html`
      <div class=${classMap(classes)}
           role="progressbar"
           aria-valuenow=${percent}
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label=${this.ariaLabel || `Progress, ${this.status}`}
           part="track">
        <div class="progress-bar__fill" style="width: ${percent}%" part="fill"></div>
      </div>
    `;
  }
}
