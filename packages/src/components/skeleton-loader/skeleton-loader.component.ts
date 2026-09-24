import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './skeleton-loader.styles.js';

export type AsmSkeletonShape = 'card' | 'standalone-text' | 'icon' | 'list-item' | 'neutral-shape' | 'tile' | 'button';

/**
 * @tag asm-skeleton-loader
 *
 * @csspart skeleton - The skeleton element.
 */
export default class AsmSkeletonLoader extends LitElement {
  static styles = styles;

  /** Shape preset. */
  @property({ reflect: true }) shape: AsmSkeletonShape = 'neutral-shape';

  /** Width (CSS value). */
  @property() width = '';

  /** Height (CSS value). */
  @property() height = '';

  /** Border radius (CSS value). */
  @property({ attribute: 'border-radius' }) borderRadius = '';

  render() {
    const classes = {
      'skeleton': true,
      [`skeleton--${this.shape}`]: true,
    };

    const customStyle = [
      this.width ? `width:${this.width}` : '',
      this.height ? `height:${this.height}` : '',
      this.borderRadius ? `border-radius:${this.borderRadius}` : '',
    ].filter(Boolean).join(';');

    return html`
      <div
        class=${classMap(classes)}
        part="skeleton"
        style=${customStyle || ''}
        aria-hidden="true"
        role="presentation"
      ></div>
    `;
  }
}
