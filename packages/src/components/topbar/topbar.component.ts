import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './topbar.styles.js';
import '../icon/icon.js';
import '../progress-bar/progress-bar.js';

export type AsmTopbarType = 'home' | 'back' | 'general' | 'progress';
export type AsmTopbarDesktopType = 'full-header' | 'back-only';

/**
 * @tag asm-topbar
 *
 * A compact top navigation bar (mobile/tablet).
 *
 * @fires left-press - Fired when left tile is clicked.
 * @fires right-press - Fired when right tile is clicked.
 */
export default class AsmTopbar extends LitElement {
  static styles = styles;

  /** Layout type: home, back, general, or progress. */
  @property({ reflect: true }) type: AsmTopbarType = 'home';

  /** Title text (back/general types). */
  @property() title = '';

  /** Whether to show the title. */
  @property({ type: Boolean, attribute: 'show-title' }) showTitle = false;

  /** Whether to show left action tile. */
  @property({ type: Boolean, attribute: 'show-left' }) showLeft = true;

  /** Whether to show right action tile. */
  @property({ type: Boolean, attribute: 'show-right' }) showRight = true;

  /** Left tile icon name. Defaults by type. */
  @property({ attribute: 'left-icon' }) leftIcon = '';

  /** Right tile icon name. */
  @property({ attribute: 'right-icon' }) rightIcon = 'notifications';

  /** Show notification badge on right tile. */
  @property({ type: Boolean, attribute: 'show-badge' }) showBadge = false;

  /** Progress value 0-1 (progress type only). */
  @property({ type: Number }) progress = 0;

  private get _leftIconName(): string {
    if (this.leftIcon) return this.leftIcon;
    switch (this.type) {
      case 'home': return 'menu';
      case 'back': return 'arrow_back';
      case 'progress': return 'close';
      default: return 'menu';
    }
  }

  private _handleLeftPress() {
    this.dispatchEvent(new CustomEvent('left-press', { bubbles: true, composed: true }));
  }

  private _handleRightPress() {
    this.dispatchEvent(new CustomEvent('right-press', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <nav class="topbar" aria-label="Top navigation">
        ${this.showLeft ? html`
          <button class="topbar__tile" @click=${this._handleLeftPress} aria-label=${this._leftIconName}>
            <asm-icon name=${this._leftIconName}></asm-icon>
          </button>
        ` : nothing}

        ${this.type === 'home' ? html`
          <div class="topbar__center">
            <div class="topbar__brand">
              <slot name="brand"></slot>
            </div>
          </div>
        ` : this.type === 'progress' ? html`
          <div class="topbar__progress">
            <asm-progress-bar .value=${this.progress} status="brand" size="thin"></asm-progress-bar>
          </div>
        ` : html`
          <div class="topbar__center">
            ${this.showTitle && this.title ? html`<span class="topbar__title">${this.title}</span>` : nothing}
          </div>
        `}

        ${this.showRight ? html`
          <button class="topbar__tile" @click=${this._handleRightPress} aria-label=${this.rightIcon}>
            <asm-icon name=${this.rightIcon}></asm-icon>
            ${this.showBadge ? html`<span class="topbar__badge"></span>` : nothing}
          </button>
        ` : nothing}
      </nav>
    `;
  }
}

/**
 * @tag asm-topbar-desktop
 *
 * A desktop navigation header bar.
 *
 * @fires press - Fired when the topbar is activated.
 */
export class AsmTopbarDesktop extends LitElement {
  static styles = styles;

  /** Layout type: full-header or back-only. */
  @property({ reflect: true }) type: AsmTopbarDesktopType = 'full-header';

  /** Title text. */
  @property() title = '';

  /** Optional subtitle (mono, uppercase). */
  @property({ attribute: 'sub-title' }) subTitle = '';

  /** Show leading back chevron. */
  @property({ type: Boolean, attribute: 'show-back' }) showBack = true;

  /** Show leading icon tile. */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true;

  /** Leading icon name. */
  @property({ attribute: 'leading-icon' }) leadingIcon = 'visibility';

  private _handlePress() {
    this.dispatchEvent(new CustomEvent('press', { bubbles: true, composed: true }));
  }

  render() {
    if (this.type === 'back-only') {
      return html`
        <div class="topbar-desktop--back-only">
          <button class="topbar-desktop__back-btn" @click=${this._handlePress} aria-label="Go back">
            <asm-icon name="chevron_left"></asm-icon>
          </button>
        </div>
      `;
    }

    return html`
      <div class="topbar-desktop" tabindex="0" role="button" @click=${this._handlePress} @keydown=${this._handleKeydown}>
        ${this.showBack ? html`
          <div class="topbar-desktop__back">
            <asm-icon name="chevron_left"></asm-icon>
          </div>
        ` : nothing}
        ${this.showIcon ? html`
          <div class="topbar-desktop__icon-tile">
            <asm-icon name=${this.leadingIcon}></asm-icon>
          </div>
        ` : nothing}
        <div class="topbar-desktop__text">
          <span class="topbar-desktop__title">${this.title}</span>
          ${this.subTitle ? html`<span class="topbar-desktop__subtitle">${this.subTitle}</span>` : nothing}
        </div>
      </div>
    `;
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handlePress();
    }
  }
}
