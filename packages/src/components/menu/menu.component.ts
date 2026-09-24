import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './menu.styles.js';
import './menu-item.js';

export type AsmMenuDensity = 'default' | 'low' | 'compact';

/**
 * @tag asm-menu
 *
 * A menu container that holds asm-menu-item elements.
 *
 * @csspart menu - The menu container element.
 *
 * @slot - Default slot for asm-menu-item elements.
 */
export default class AsmMenu extends LitElement {
  static styles = styles;

  /** The density applied to all child menu items. */
  @property({ reflect: true }) density: AsmMenuDensity = 'default';

  private _observer: MutationObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._propagateDensity();

    this._observer = new MutationObserver(() => this._propagateDensity());
    this._observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('density')) {
      this._propagateDensity();
    }
  }

  private _propagateDensity() {
    this.querySelectorAll('asm-menu-item').forEach((item) => {
      item.setAttribute('density', this.density);
    });
  }

  render() {
    return html`
      <div class="menu" role="menu" part="menu">
        <slot @slotchange=${this._propagateDensity}></slot>
      </div>
    `;
  }
}
