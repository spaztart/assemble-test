import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './loader.styles.js';

export type AsmLoaderStyle = 'bar';

/**
 * @tag asm-loader
 *
 * An indeterminate circular loading spinner.
 *
 * @csspart container - The loader container.
 *
 * @fires - No events.
 */
export default class AsmLoader extends LitElement {
  static styles = styles;

  /** Size of the spinner in pixels. */
  @property({ type: Number }) size = 40;

  /** Visual variant: 'bar' (short arc) or 'half-track' (half circle). */
  @property({ reflect: true }) variant: AsmLoaderStyle = 'bar';

  /** Stroke width of the track and arc. */
  @property({ type: Number, attribute: 'stroke-width' }) strokeWidth = 3;

  /** Accessible label. */
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = 'Loading';

  render() {
    const r = (this.size - this.strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const center = this.size / 2;

    const classes = {
      'loader': true,
      'loader--bar': true,
    };

    return html`
      <div class=${classMap(classes)} role="progressbar" aria-label=${this.ariaLabel || 'Loading'} part="container">
        <svg width=${this.size} height=${this.size} viewBox="0 0 ${this.size} ${this.size}">
          <circle class="track" cx=${center} cy=${center} r=${r} stroke-width=${this.strokeWidth} />
          <circle class="arc" cx=${center} cy=${center} r=${r} stroke-width=${this.strokeWidth}
            stroke-dasharray="${circumference * 0.14} ${circumference}" />
        </svg>
      </div>
    `;
  }
}
