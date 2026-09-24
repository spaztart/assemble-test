import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmCalendarMode = 'single' | 'range';
export type AsmCalendarActions = 'none' | 'cancel-ok' | 'clear-cancel-ok';
export type AsmCalendarChrome = 'full' | 'grid-only';
/**
 * @tag asm-calendar
 *
 * A calendar date picker component supporting single and range selection.
 *
 * @csspart container - The outer calendar container.
 * @csspart header - The month/year navigation header.
 * @csspart grid - The day grid.
 * @csspart day - Individual day cell.
 * @csspart actions - The action button row.
 *
 * @fires change - Fired when a single date is selected. detail: { value: string (ISO date) }
 * @fires range-change - Fired when a date range is selected. detail: { start: string, end: string }
 * @fires confirm - Fired when OK is clicked.
 * @fires cancel - Fired when Cancel is clicked.
 * @fires clear - Fired when Clear is clicked.
 */
export default class AsmCalendar extends LitElement {
    static styles: import("lit").CSSResult;
    /** Selection mode: single date or date range. */
    mode: AsmCalendarMode;
    /** Which action buttons to show. */
    actions: AsmCalendarActions;
    /** Visual chrome: full card or bare grid. */
    chrome: AsmCalendarChrome;
    /** Title displayed in the header. */
    headerTitle: string;
    /** Earliest selectable date (ISO format YYYY-MM-DD). */
    minDate: string;
    /** Latest selectable date (ISO format YYYY-MM-DD). */
    maxDate: string;
    /** Currently selected date (ISO format). */
    value: string;
    /** Range start date (ISO format). */
    rangeStart: string;
    /** Range end date (ISO format). */
    rangeEnd: string;
    /** Labels for action buttons. */
    confirmLabel: string;
    cancelLabel: string;
    clearLabel: string;
    private _viewYear;
    private _viewMonth;
    private _rangeSelecting;
    private _daysInMonth;
    private _firstDayOfMonth;
    private _toISO;
    private _parseDate;
    private _isDisabled;
    private _isToday;
    private _isSelected;
    private _isInRange;
    private _handleDayClick;
    private _prevMonth;
    private _nextMonth;
    private _handleConfirm;
    private _handleCancel;
    private _handleClear;
    connectedCallback(): void;
    private _renderHeader;
    private _renderGrid;
    private _renderActions;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=calendar.component.d.ts.map