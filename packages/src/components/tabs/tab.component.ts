import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab.styles.js';
import '../icon/icon.js';

/**
 * @tag asm-tab
 *
 * Individual tab item. Must be used inside `<asm-tab-group>`.
 *
 * @csspart tab - The tab content wrapper.
 * @csspart indicator - The active underline indicator.
 * @csspart label - The label text.
 */
export default class AsmTab extends LitElement {
  static styles = styles;

  /** The tab label text. */
  @property() label = '';

  /** Material Symbols icon name. */
  @property() icon = '';

  /** Whether this tab is active. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Layout mode set by parent tab-group. */
  @property({ reflect: true }) layout: 'text' | 'icon-horizontal' | 'icon-vertical' | 'icon' = 'text';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.setAttribute('tabindex', '0');
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleClick = () => {
    this.dispatchEvent(new CustomEvent('tab-select', { bubbles: true, composed: true }));
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  };

  render() {
    const showIcon = this.icon && this.layout !== 'text';
    const showLabel = this.layout !== 'icon';

    return html`
      <div class="tab" part="tab">
        <span class="tab__state-layer"></span>
        ${showIcon ? html`<asm-icon class="tab__icon" name=${this.icon}></asm-icon>` : nothing}
        ${showLabel ? html`<span class="tab__label" part="label">${this.label}</span>` : nothing}
        <span class="tab__indicator" part="indicator"></span>
      </div>
    `;
  }
}
