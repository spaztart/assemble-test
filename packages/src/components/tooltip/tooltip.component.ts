import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './tooltip.styles.js';

export type AsmTooltipType = 'single-line' | 'multi-line';
export type AsmTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * @tag asm-tooltip
 *
 * @csspart tooltip - The tooltip popup.
 *
 * @slot - Default slot for the trigger element.
 */
export default class AsmTooltip extends LitElement {
  static styles = styles;

  /** Tooltip message text. */
  @property() message = '';

  /** Tooltip type. */
  @property({ reflect: true }) type: AsmTooltipType = 'single-line';

  /** Tooltip position relative to trigger. */
  @property({ reflect: true }) position: AsmTooltipPosition = 'top';

  private _visible = false;

  private _show() {
    this._visible = true;
    this.requestUpdate();
  }

  private _hide() {
    this._visible = false;
    this.requestUpdate();
  }

  render() {
    const classes = {
      'tooltip': true,
      'tooltip--visible': this._visible,
      [`tooltip--${this.type}`]: true,
      [`tooltip--${this.position}`]: true,
    };

    return html`
      <div
        class="tooltip-wrapper"
        @mouseenter=${this._show}
        @mouseleave=${this._hide}
        @focusin=${this._show}
        @focusout=${this._hide}
      >
        <slot></slot>
        <div class=${classMap(classes)} part="tooltip" role="tooltip" aria-hidden=${String(!this._visible)}>
          ${this.message}
        </div>
      </div>
    `;
  }
}
