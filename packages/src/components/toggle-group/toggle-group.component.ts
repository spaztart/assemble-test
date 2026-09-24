import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './toggle-group.styles.js';
import '../icon/icon.js';

export type AsmToggleGroupSize = 'xsmall' | 'small' | 'medium' | 'large';
export type AsmToggleGroupVariant = 'page' | 'section';

/**
 * @tag asm-toggle-group
 *
 * @csspart group - The group container.
 *
 * @fires change - Fired when selection changes. Detail: { index: number }
 */
export default class AsmToggleGroup extends LitElement {
  static styles = styles;

  /** Toggle group size (page variant). */
  @property({ reflect: true }) size: AsmToggleGroupSize = 'medium';

  /** Toggle group variant. */
  @property({ reflect: true }) variant: AsmToggleGroupVariant = 'page';

  /** Currently selected index. */
  @property({ type: Number, attribute: 'selected-index', reflect: true }) selectedIndex = 0;

  /** Disables the toggle group. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _handleSelect(index: number) {
    if (this.disabled || index === this.selectedIndex) return;
    this.selectedIndex = index;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { index },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent, index: number) {
    const items = this.querySelectorAll('asm-toggle-item');
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % items.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this._handleSelect(index);
        return;
    }

    if (newIndex >= 0) {
      this._handleSelect(newIndex);
      const target = this.shadowRoot?.querySelectorAll('[role="tab"]')[newIndex] as HTMLElement;
      target?.focus();
    }
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('selectedIndex')) {
      this._syncItems();
    }
  }

  firstUpdated() {
    this._syncItems();
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver(() => this._syncItems());
    this._observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  private _observer?: MutationObserver;

  private _syncItems() {
    const items = Array.from(this.querySelectorAll('asm-toggle-item'));
    items.forEach((item, i) => {
      item.toggleAttribute('active', i === this.selectedIndex);
    });
  }

  render() {
    const items = Array.from(this.querySelectorAll('asm-toggle-item'));
    const classes = {
      'toggle-group': true,
      [`toggle-group--${this.variant}`]: true,
      [`toggle-group--${this.size}`]: true,
      'toggle-group--disabled': this.disabled,
    };

    return html`
      <div class=${classMap(classes)} part="group" role="tablist">
        ${items.map((item, i) => {
          const selected = i === this.selectedIndex;
          const itemLabel = item.getAttribute('label') || '';
          const startIcon = item.getAttribute('start-icon') || '';
          const endIcon = item.getAttribute('end-icon') || '';
          const itemClasses = {
            'toggle-item': true,
            'toggle-item--selected': selected,
          };

          return html`
            <div
              class=${classMap(itemClasses)}
              role="tab"
              tabindex=${selected ? 0 : -1}
              aria-selected=${String(selected)}
              @click=${() => this._handleSelect(i)}
              @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, i)}
            >
              <span class="toggle-item__state-layer"></span>
              ${startIcon ? html`<asm-icon class="toggle-item__icon" name=${startIcon}></asm-icon>` : nothing}
              <span class="toggle-item__label">${itemLabel}</span>
              ${endIcon ? html`<asm-icon class="toggle-item__icon" name=${endIcon}></asm-icon>` : nothing}
            </div>
          `;
        })}
      </div>
      <slot style="display:none" @slotchange=${() => this.requestUpdate()}></slot>
    `;
  }
}
