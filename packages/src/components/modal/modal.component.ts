import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './modal.styles.js';
import '../icon/icon.js';

/**
 * @tag asm-modal
 *
 * A modal dialog with blurred backdrop.
 *
 * The overlay is teleported to document.body when opened so it
 * always renders above the entire page regardless of ancestor
 * stacking contexts (transforms, filters, backdrop-filter, etc.).
 *
 * Variants:
 * - Default: solid surface background
 * - Gradient: promotional gradient background (set `gradient` attribute)
 *
 * @csspart overlay - The full-screen backdrop overlay.
 * @csspart surface - The modal surface container.
 * @csspart close - The close button.
 * @csspart content - The content wrapper.
 * @csspart header - The header text (standard variant).
 * @csspart body - The body text (standard variant).
 * @csspart actions - The action button row (standard variant).
 *
 * @slot - Default slot for custom modal content.
 * @slot actions - Slot for action buttons.
 *
 * @fires close - Fired when the modal is dismissed (close button, backdrop click, or Escape).
 */
export default class AsmModal extends LitElement {
  static styles = styles;

  /** Whether the modal is open/visible. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Header text (for standard text variant). */
  @property() header = '';

  /** Body text (for standard text variant). */
  @property() body = '';

  /** Whether to show the close button. */
  @property({ type: Boolean, attribute: 'show-close' }) showClose = true;

  /** Whether the backdrop click dismisses the modal. */
  @property({ type: Boolean, attribute: 'barrier-dismiss' }) barrierDismiss = true;

  /** Whether to use gradient background. */
  @property({ type: Boolean, reflect: true }) gradient = false;

  /** Accessible label for the modal. */
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = null;

  private _overlayContainer: HTMLDivElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._handleKeydown = this._handleKeydown.bind(this);
    document.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeydown);
    this._removeOverlay();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open) {
      this._dismiss();
    }
  }

  private _dismiss() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget && this.barrierDismiss) {
      this._dismiss();
    }
  }

  private _createOverlay() {
    if (this._overlayContainer) return;

    this._overlayContainer = document.createElement('div');
    this._overlayContainer.setAttribute('class', 'asm-modal-overlay');
    this._overlayContainer.setAttribute('style', `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      animation: asm-modal-fade-in 0.25s ease-out;
    `);

    // Inject keyframes if not already present
    if (!document.getElementById('asm-modal-keyframes')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'asm-modal-keyframes';
      styleEl.textContent = `
        @keyframes asm-modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes asm-modal-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `;
      document.head.appendChild(styleEl);
    }

    this._overlayContainer.addEventListener('click', (e: Event) => {
      this._handleBackdropClick(e);
    });

    document.body.appendChild(this._overlayContainer);
    this._renderOverlayContent();
  }

  private _removeOverlay() {
    if (this._overlayContainer) {
      this._overlayContainer.remove();
      this._overlayContainer = null;
    }
  }

  private _renderOverlayContent() {
    if (!this._overlayContainer) return;

    const isGradient = this.gradient;
    const hasStandardContent = this.header || this.body;

    // Build surface HTML
    let contentHTML = '';
    if (hasStandardContent) {
      const headerHTML = this.header
        ? `<h2 style="font-family:'McAfee Sans',sans-serif;font-weight:700;font-size:var(--md-sys-typescale-headline-medium-size,28px);line-height:var(--md-sys-typescale-headline-medium-line-height,36px);color:${isGradient ? 'var(--mcafee-color-extended-white,#fff)' : 'var(--md-sys-color-on-surface)'};margin:0 32px 0 0;padding:0;">${this.header}</h2>`
        : '';
      const bodyHTML = this.body
        ? `<p style="font-family:'McAfee Sans',sans-serif;font-weight:400;font-size:var(--md-sys-typescale-body-large-size,16px);line-height:var(--md-sys-typescale-body-large-line-height,24px);color:${isGradient ? 'var(--mcafee-color-extended-white,#fff)' : 'var(--md-sys-color-on-surface)'};margin:16px 0 0;padding:0;">${this.body}</p>`
        : '';
      contentHTML = headerHTML + bodyHTML;
    }

    // Move slotted content to overlay
    const actionsSlot = this.querySelector('[slot="actions"]');
    const defaultSlotContent = Array.from(this.childNodes).filter(
      n => !(n instanceof Element && (n as Element).getAttribute('slot'))
    );

    const surface = document.createElement('div');
    surface.setAttribute('role', 'dialog');
    surface.setAttribute('aria-modal', 'true');
    if (this.ariaLabel || this.header) {
      surface.setAttribute('aria-label', this.ariaLabel || this.header);
    }
    surface.setAttribute('style', `
      position: relative;
      background: ${isGradient ? 'var(--mcafee-surface-gradient-high-energy, linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary)))' : 'var(--md-sys-color-surface)'};
      border-radius: 28px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      max-width: calc(100vw - 48px);
      max-height: calc(100vh - 48px);
      overflow: auto;
      animation: asm-modal-scale-in 0.25s ease-out;
    `);
    surface.addEventListener('click', (e: Event) => e.stopPropagation());

    // Close button
    if (this.showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.setAttribute('style', `
        position: absolute; top: 20px; right: 20px; z-index: 1;
        display: inline-flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; border: none; background: none; padding: 8px;
        cursor: pointer; border-radius: 50%;
        color: ${isGradient ? 'var(--mcafee-color-extended-white, #fff)' : 'var(--md-sys-color-on-surface)'};
        font-size: 24px;
      `);
      closeBtn.innerHTML = '<asm-icon name="close"></asm-icon>';
      closeBtn.addEventListener('click', () => this._dismiss());
      surface.appendChild(closeBtn);
    }

    // Content wrapper
    const contentWrap = document.createElement('div');
    contentWrap.setAttribute('style', 'padding: 24px;');

    if (hasStandardContent) {
      contentWrap.innerHTML = contentHTML;
      // Actions
      if (actionsSlot) {
        const actionsRow = document.createElement('div');
        actionsRow.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;');
        actionsRow.appendChild(actionsSlot.cloneNode(true));
        // Wire up cloned button clicks to dismiss
        actionsRow.querySelectorAll('asm-button').forEach(btn => {
          btn.addEventListener('click', () => this._dismiss());
        });
        contentWrap.appendChild(actionsRow);
      }
    } else {
      // Custom content — clone children
      defaultSlotContent.forEach(node => {
        contentWrap.appendChild(node.cloneNode(true));
      });
      // Wire up any buttons in custom content
      contentWrap.querySelectorAll('asm-button').forEach(btn => {
        btn.addEventListener('click', () => this._dismiss());
      });
    }

    surface.appendChild(contentWrap);
    this._overlayContainer!.appendChild(surface);
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this._createOverlay();
      } else {
        this._removeOverlay();
      }
    }
  }

  render() {
    return nothing;
  }
}
