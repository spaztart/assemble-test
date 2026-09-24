import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './peek-label.styles.js';
import '../icon/icon.js';

export type AsmPeekLabelSize = 'default' | 'small';

/**
 * @tag asm-peek-label
 *
 * A floating chip label (e.g. nav rail hover labels).
 * Purely presentational — caller positions it.
 */
export default class AsmPeekLabel extends LitElement {
  static styles = styles;

  /** Text content of the label. */
  @property() text = '';

  /** Size variant. */
  @property({ reflect: true }) size: AsmPeekLabelSize = 'default';

  /** Optional trailing icon name. */
  @property({ attribute: 'trailing-icon' }) trailingIcon = '';

  /** Muted/offline styling. */
  @property({ type: Boolean, reflect: true }) offline = false;

  render() {
    const classes = {
      'peek-label': true,
      'peek-label--default': this.size === 'default',
      'peek-label--small': this.size === 'small',
      'peek-label--offline': this.offline,
    };

    return html`
      <div class=${classMap(classes)}>
        <span>${this.text}</span>
        ${this.trailingIcon ? html`<asm-icon name=${this.trailingIcon}></asm-icon>` : nothing}
      </div>
    `;
  }
}
