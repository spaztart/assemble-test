import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab-group.styles.js';
import './tab.js';

export type AsmTabVariant = 'text' | 'icon-horizontal' | 'icon-vertical' | 'icon';

/**
 * @tag asm-tab-group
 *
 * Container for `<asm-tab>` items. Controls layout variant and manages selection.
 *
 * @slot - Default slot for `<asm-tab>` elements.
 *
 * @fires tab-change - Fired when the active tab changes. Detail: { index: number }
 */
export default class AsmTabGroup extends LitElement {
  static styles = styles;

  /** Layout variant for all child tabs. */
  @property({ reflect: true }) variant: AsmTabVariant = 'text';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tablist');
    this.addEventListener('tab-select', this._handleTabSelect as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('tab-select', this._handleTabSelect as EventListener);
  }

  private _handleTabSelect = (e: CustomEvent) => {
    const tab = e.composedPath().find(
      (el) => el instanceof HTMLElement && el.tagName === 'ASM-TAB'
    ) as HTMLElement | undefined;
    if (!tab) return;

    const tabs = this._getTabs();
    const index = tabs.indexOf(tab);

    tabs.forEach((t, i) => {
      t.setAttribute('active', String(i === index));
      if (i === index) {
        t.setAttribute('active', '');
      } else {
        t.removeAttribute('active');
      }
    });

    this.dispatchEvent(new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { index },
    }));
  };

  private _getTabs(): HTMLElement[] {
    return Array.from(this.querySelectorAll('asm-tab'));
  }

  protected updated() {
    // Propagate variant as layout to all child tabs
    const layout = this.variant;
    this._getTabs().forEach((tab) => {
      tab.setAttribute('layout', layout);
    });
  }

  render() {
    return html`
      <div class="tab-group" part="tab-group">
        <slot></slot>
      </div>
    `;
  }
}
