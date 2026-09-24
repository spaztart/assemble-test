import { LitElement } from 'lit';
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
    static styles: import("lit").CSSResult;
    /** Input variant: single date or range (two fields). */
    variant: AsmDateInputVariant;
    /** Label text above the field. */
    label: string;
    /** Placeholder text. */
    placeholder: string;
    /** Supporting/helper text below the field. */
    supportingText: string;
    /** Current value (ISO date format YYYY-MM-DD). */
    value: string;
    /** Range start value (ISO). */
    rangeStart: string;
    /** Range end value (ISO). */
    rangeEnd: string;
    /** Earliest selectable date (ISO). */
    minDate: string;
    /** Latest selectable date (ISO). */
    maxDate: string;
    /** Whether the field is disabled. */
    disabled: boolean;
    /** Whether the field has an error. */
    error: boolean;
    /** Error message text. */
    errorText: string;
    /** Placeholder for range end field. */
    endPlaceholder: string;
    private _pickerOpen;
    private _inputValue;
    private _endInputValue;
    private _focused;
    private _formatDateForDisplay;
    private _parseDateInput;
    private _applyDateMask;
    private _handleInput;
    private _handleEndInput;
    private _togglePicker;
    private _handleCalendarChange;
    private _handleCalendarRangeChange;
    connectedCallback(): void;
    private _renderField;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=date-input.component.d.ts.map