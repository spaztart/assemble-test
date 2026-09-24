import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * @tag asm-toggle-item
 * Data element for asm-toggle-group. Does not render — attributes are read by the parent.
 */
export default class AsmToggleItem extends LitElement {
  @property() label = '';
  @property({ attribute: 'start-icon' }) startIcon = '';
  @property({ attribute: 'end-icon' }) endIcon = '';
  @property({ type: Boolean, reflect: true }) active = false;

  createRenderRoot() {
    return this;
  }

  render() {
    return html``;
  }
}
