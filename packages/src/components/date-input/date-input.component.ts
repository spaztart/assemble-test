import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './date-input.styles.js';
import '../icon/icon.js';
import '../calendar/calendar.js';

export type AsmDateInputVariant = 'single' | 'range';

/**
 * @tag asm-date-input
 *
 * A date input field with MM/DD/YYYY masking and inline calendar picker.
 *
 * @csspart container - The outer container.
 * @csspart label - The label text.
 * @csspart field - The input field.
 * @csspart input - The native input element.
 * @csspart calendar-toggle - The calendar icon button.
 * @csspart supporting - The supporting text.
 * @csspart picker - The inline calendar picker.
 *
 * @fires change - Fired when the date value changes. detail: { value: string (ISO date) }
 * @fires range-change - Fired when a date range changes. detail: { start: string, end: string }
 * @fires picker-open - Fired when the calendar picker opens.
 * @fires picker-close - Fired when the calendar picker closes.
 */
export default class AsmDateInput extends LitElement {
  static styles = styles;

  /** Input variant: single date or range (two fields). */
  @property({ reflect: true }) variant: AsmDateInputVariant = 'single';

  /** Label text above the field. */
  @property() label = 'Date';

  /** Placeholder text. */
  @property() placeholder = 'MM/DD/YYYY';

  /** Supporting/helper text below the field. */
  @property({ attribute: 'supporting-text' }) supportingText = 'MM/DD/YYYY';

  /** Current value (ISO date format YYYY-MM-DD). */
  @property() value = '';

  /** Range start value (ISO). */
  @property({ attribute: 'range-start' }) rangeStart = '';

  /** Range end value (ISO). */
  @property({ attribute: 'range-end' }) rangeEnd = '';

  /** Earliest selectable date (ISO). */
  @property({ attribute: 'min-date' }) minDate = '';

  /** Latest selectable date (ISO). */
  @property({ attribute: 'max-date' }) maxDate = '';

  /** Whether the field is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the field has an error. */
  @property({ type: Boolean, reflect: true }) error = false;

  /** Error message text. */
  @property({ attribute: 'error-text' }) errorText = '';

  /** Placeholder for range end field. */
  @property({ attribute: 'end-placeholder' }) endPlaceholder = 'MM/DD/YYYY';

  @state() private _pickerOpen = false;
  @state() private _inputValue = '';
  @state() private _endInputValue = '';
  @state() private _focused = false;

  private _formatDateForDisplay(iso: string): string {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  private _parseDateInput(display: string): string {
    // Parse MM/DD/YYYY to YYYY-MM-DD
    const cleaned = display.replace(/[^\d/]/g, '');
    const parts = cleaned.split('/');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1000) {
        return `${parts[2]}-${parts[0]}-${parts[1]}`;
      }
    }
    return '';
  }

  private _applyDateMask(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let result = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) result += '/';
      result += digits[i];
    }
    return result;
  }

  private _handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    const masked = this._applyDateMask(input.value);
    input.value = masked;
    this._inputValue = masked;

    const iso = this._parseDateInput(masked);
    if (iso) {
      this.value = iso;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true, composed: true,
        detail: { value: iso },
      }));
    }
  }

  private _handleEndInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    const masked = this._applyDateMask(input.value);
    input.value = masked;
    this._endInputValue = masked;

    const iso = this._parseDateInput(masked);
    if (iso) {
      this.rangeEnd = iso;
      if (this.rangeStart) {
        this.dispatchEvent(new CustomEvent('range-change', {
          bubbles: true, composed: true,
          detail: { start: this.rangeStart, end: iso },
        }));
      }
    }
  }

  private _togglePicker() {
    this._pickerOpen = !this._pickerOpen;
    this.dispatchEvent(new CustomEvent(
      this._pickerOpen ? 'picker-open' : 'picker-close',
      { bubbles: true, composed: true }
    ));
  }

  private _handleCalendarChange(e: CustomEvent) {
    const iso = e.detail.value;
    this.value = iso;
    this._inputValue = this._formatDateForDisplay(iso);
    this._pickerOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true,
      detail: { value: iso },
    }));
  }

  private _handleCalendarRangeChange(e: CustomEvent) {
    this.rangeStart = e.detail.start;
    this.rangeEnd = e.detail.end;
    this._inputValue = this._formatDateForDisplay(e.detail.start);
    this._endInputValue = this._formatDateForDisplay(e.detail.end);
    this._pickerOpen = false;
    this.dispatchEvent(new CustomEvent('range-change', {
      bubbles: true, composed: true,
      detail: { start: e.detail.start, end: e.detail.end },
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.value) {
      this._inputValue = this._formatDateForDisplay(this.value);
    }
    if (this.rangeStart) {
      this._inputValue = this._formatDateForDisplay(this.rangeStart);
    }
    if (this.rangeEnd) {
      this._endInputValue = this._formatDateForDisplay(this.rangeEnd);
    }
  }

  private _renderField(value: string, placeholder: string, onInput: (e: InputEvent) => void) {
    const fieldClasses = {
      'date-input__field': true,
      'date-input__field--focused': this._focused,
      'date-input__field--error': this.error,
      'date-input__field--disabled': this.disabled,
    };

    return html`
      <div class=${classMap(fieldClasses)} part="field">
        <input
          class="date-input__input"
          part="input"
          type="text"
          .value=${value}
          placeholder=${placeholder}
          ?disabled=${this.disabled}
          aria-label=${this.label}
          @input=${onInput}
          @focus=${() => { this._focused = true; }}
          @blur=${() => { this._focused = false; }}
        />
        <button
          class="date-input__calendar-toggle"
          part="calendar-toggle"
          aria-label="Open calendar"
          ?disabled=${this.disabled}
          @click=${this._togglePicker}
        >
          <asm-icon name="calendar_today"></asm-icon>
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="date-input" part="container">
        <label class="date-input__label" part="label">${this.label}</label>
        
        ${this.variant === 'single'
          ? this._renderField(this._inputValue, this.placeholder, this._handleInput.bind(this))
          : html`
            <div class="date-input__range">
              ${this._renderField(this._inputValue, this.placeholder, this._handleInput.bind(this))}
              <span class="date-input__range-separator">–</span>
              ${this._renderField(this._endInputValue, this.endPlaceholder, this._handleEndInput.bind(this))}
            </div>
          `
        }

        ${this.error && this.errorText ? html`
          <span class="date-input__error" part="supporting">${this.errorText}</span>
        ` : this.supportingText ? html`
          <span class="date-input__supporting" part="supporting">${this.supportingText}</span>
        ` : nothing}

        ${this._pickerOpen ? html`
          <div class="date-input__picker" part="picker">
            <asm-calendar
              mode=${this.variant === 'range' ? 'range' : 'single'}
              chrome="grid-only"
              value=${this.value}
              range-start=${this.rangeStart}
              range-end=${this.rangeEnd}
              min-date=${this.minDate}
              max-date=${this.maxDate}
              @change=${this._handleCalendarChange}
              @range-change=${this._handleCalendarRangeChange}
            ></asm-calendar>
          </div>
        ` : nothing}
      </div>
    `;
  }
}
