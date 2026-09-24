import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './text-field.styles.js';
import '../icon/icon.js';

export type AsmTextFieldVariant = 'filled' | 'outlined';

/**
 * @tag asm-text-field
 *
 * @csspart field - The field container.
 * @csspart input - The native input/textarea.
 * @csspart label - The floating label.
 * @csspart supporting - The supporting/error text.
 *
 * @fires input - Fired on text input.
 * @fires change - Fired on value committed.
 */
export default class AsmTextField extends LitElement {
  static styles = styles;

  /** Field label (floats on focus/value). */
  @property() label = '';

  /** Placeholder text. */
  @property() placeholder = '';

  /** Field value. */
  @property() value = '';

  /** Visual variant. */
  @property({ reflect: true }) variant: AsmTextFieldVariant = 'outlined';

  /** Helper text below field. */
  @property({ attribute: 'supporting-text' }) supportingText = '';

  /** Error text (replaces supporting text, triggers error state). */
  @property({ attribute: 'error-text' }) errorText = '';

  /** Leading icon name. */
  @property({ attribute: 'leading-icon' }) leadingIcon = '';

  /** Trailing icon name. */
  @property({ attribute: 'trailing-icon' }) trailingIcon = '';

  /** Disables the field. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Read-only mode. */
  @property({ type: Boolean, attribute: 'read-only' }) readOnly = false;

  /** Password masking. */
  @property({ type: Boolean, attribute: 'obscure-text' }) obscureText = false;

  /** Max character length. */
  @property({ type: Number, attribute: 'max-length' }) maxLength: number | null = null;

  /** Max lines (1 = single-line input, >1 = textarea). */
  @property({ type: Number, attribute: 'max-lines' }) maxLines = 1;

  /** Input type. */
  @property() type = 'text';

  private _focused = false;

  private get _hasValue() {
    return this.value.length > 0;
  }

  private get _isError() {
    return this.errorText.length > 0;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFocus() {
    this._focused = true;
    this.requestUpdate();
  }

  private _handleBlur() {
    this._focused = false;
    this.requestUpdate();
  }

  render() {
    const classes = {
      'text-field': true,
      [`text-field--${this.variant}`]: true,
      'text-field--focused': this._focused,
      'text-field--error': this._isError,
      'text-field--disabled': this.disabled,
      'text-field--has-value': this._hasValue,
      'text-field--has-label': !!this.label,
      'text-field--has-leading-icon': !!this.leadingIcon,
    };

    const isTextarea = this.maxLines > 1;
    const inputType = this.obscureText ? 'password' : this.type;
    const showErrorIcon = this._isError && !this.trailingIcon;

    return html`
      <div class=${classMap(classes)} part="field">
        <div class="text-field__container">
          ${this.variant === 'filled' ? html`<div class="text-field__state-layer"></div>` : nothing}
          ${this.variant === 'outlined' ? html`
            <fieldset class="text-field__outline" aria-hidden="true">
              <legend class="text-field__outline-notch">
                ${this.label && (this._focused || this._hasValue) ? html`<span>${this.label}</span>` : nothing}
              </legend>
            </fieldset>
          ` : nothing}
          ${this.leadingIcon ? html`<asm-icon class="text-field__leading-icon" name=${this.leadingIcon}></asm-icon>` : nothing}
          <div class="text-field__input-wrapper">
            ${this.label ? html`<span class="text-field__label" part="label">${this.label}</span>` : nothing}
            ${isTextarea ? html`
              <textarea
                class="text-field__input"
                part="input"
                .value=${this.value}
                placeholder=${this.placeholder || nothing}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                rows=${this.maxLines}
                maxlength=${this.maxLength ?? nothing}
                @input=${this._handleInput}
                @change=${this._handleChange}
                @focus=${this._handleFocus}
                @blur=${this._handleBlur}
              ></textarea>
            ` : html`
              <input
                class="text-field__input"
                part="input"
                type=${inputType}
                .value=${this.value}
                placeholder=${this.placeholder || nothing}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                maxlength=${this.maxLength ?? nothing}
                @input=${this._handleInput}
                @change=${this._handleChange}
                @focus=${this._handleFocus}
                @blur=${this._handleBlur}
              >
            `}
          </div>
          ${this.trailingIcon ? html`<asm-icon class="text-field__trailing-icon" name=${this.trailingIcon}></asm-icon>` : nothing}
          ${showErrorIcon ? html`<asm-icon class="text-field__error-icon" name="error"></asm-icon>` : nothing}
        </div>
        ${this._isError || this.supportingText ? html`
          <span class="text-field__supporting" part="supporting">
            ${this._isError ? this.errorText : this.supportingText}
          </span>
        ` : nothing}
      </div>
    `;
  }
}
