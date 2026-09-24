import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './calendar.styles.js';
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
  static styles = styles;

  /** Selection mode: single date or date range. */
  @property({ reflect: true }) mode: AsmCalendarMode = 'single';

  /** Which action buttons to show. */
  @property() actions: AsmCalendarActions = 'none';

  /** Visual chrome: full card or bare grid. */
  @property() chrome: AsmCalendarChrome = 'full';

  /** Title displayed in the header. */
  @property({ attribute: 'header-title' }) headerTitle = 'Select date';

  /** Earliest selectable date (ISO format YYYY-MM-DD). */
  @property({ attribute: 'min-date' }) minDate = '';

  /** Latest selectable date (ISO format YYYY-MM-DD). */
  @property({ attribute: 'max-date' }) maxDate = '';

  /** Currently selected date (ISO format). */
  @property() value = '';

  /** Range start date (ISO format). */
  @property({ attribute: 'range-start' }) rangeStart = '';

  /** Range end date (ISO format). */
  @property({ attribute: 'range-end' }) rangeEnd = '';

  /** Labels for action buttons. */
  @property({ attribute: 'confirm-label' }) confirmLabel = 'OK';
  @property({ attribute: 'cancel-label' }) cancelLabel = 'Cancel';
  @property({ attribute: 'clear-label' }) clearLabel = 'Clear';

  @state() private _viewYear = new Date().getFullYear();
  @state() private _viewMonth = new Date().getMonth();
  @state() private _rangeSelecting: 'start' | 'end' = 'start';

  private _daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private _firstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  private _toISO(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private _parseDate(iso: string): Date | null {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  private _isDisabled(year: number, month: number, day: number): boolean {
    const iso = this._toISO(year, month, day);
    if (this.minDate && iso < this.minDate) return true;
    if (this.maxDate && iso > this.maxDate) return true;
    return false;
  }

  private _isToday(year: number, month: number, day: number): boolean {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
  }

  private _isSelected(year: number, month: number, day: number): boolean {
    const iso = this._toISO(year, month, day);
    if (this.mode === 'single') return iso === this.value;
    return iso === this.rangeStart || iso === this.rangeEnd;
  }

  private _isInRange(year: number, month: number, day: number): boolean {
    if (this.mode !== 'range' || !this.rangeStart || !this.rangeEnd) return false;
    const iso = this._toISO(year, month, day);
    return iso > this.rangeStart && iso < this.rangeEnd;
  }

  private _handleDayClick(year: number, month: number, day: number) {
    if (this._isDisabled(year, month, day)) return;
    const iso = this._toISO(year, month, day);

    if (this.mode === 'single') {
      this.value = iso;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true, composed: true,
        detail: { value: iso },
      }));
    } else {
      if (this._rangeSelecting === 'start') {
        this.rangeStart = iso;
        this.rangeEnd = '';
        this._rangeSelecting = 'end';
      } else {
        if (iso < this.rangeStart) {
          this.rangeEnd = this.rangeStart;
          this.rangeStart = iso;
        } else {
          this.rangeEnd = iso;
        }
        this._rangeSelecting = 'start';
        this.dispatchEvent(new CustomEvent('range-change', {
          bubbles: true, composed: true,
          detail: { start: this.rangeStart, end: this.rangeEnd },
        }));
      }
    }
  }

  private _prevMonth() {
    if (this._viewMonth === 0) {
      this._viewMonth = 11;
      this._viewYear--;
    } else {
      this._viewMonth--;
    }
  }

  private _nextMonth() {
    if (this._viewMonth === 11) {
      this._viewMonth = 0;
      this._viewYear++;
    } else {
      this._viewMonth++;
    }
  }

  private _handleConfirm() {
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
  }

  private _handleCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  private _handleClear() {
    this.value = '';
    this.rangeStart = '';
    this.rangeEnd = '';
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize view to the value date if set
    const initial = this._parseDate(this.value || this.rangeStart);
    if (initial) {
      this._viewYear = initial.getFullYear();
      this._viewMonth = initial.getMonth();
    }
  }

  private _renderHeader() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    return html`
      <div class="calendar__header" part="header">
        <button
          class="calendar__nav-btn"
          @click=${this._prevMonth}
          aria-label="Previous month"
        >
          <asm-icon name="chevron_left"></asm-icon>
        </button>
        <span class="calendar__month-label">
          ${monthNames[this._viewMonth]} ${this._viewYear}
        </span>
        <button
          class="calendar__nav-btn"
          @click=${this._nextMonth}
          aria-label="Next month"
        >
          <asm-icon name="chevron_right"></asm-icon>
        </button>
      </div>
    `;
  }

  private _renderGrid() {
    const daysInMonth = this._daysInMonth(this._viewYear, this._viewMonth);
    const firstDay = this._firstDayOfMonth(this._viewYear, this._viewMonth);
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const cells = [];
    // Day-of-week headers
    for (const label of dayLabels) {
      cells.push(html`<span class="calendar__day-label">${label}</span>`);
    }
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(html`<span class="calendar__empty"></span>`);
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = this._isDisabled(this._viewYear, this._viewMonth, day);
      const selected = this._isSelected(this._viewYear, this._viewMonth, day);
      const inRange = this._isInRange(this._viewYear, this._viewMonth, day);
      const today = this._isToday(this._viewYear, this._viewMonth, day);

      const dayClasses = {
        'calendar__day': true,
        'calendar__day--selected': selected,
        'calendar__day--in-range': inRange,
        'calendar__day--today': today,
        'calendar__day--disabled': disabled,
      };

      cells.push(html`
        <button
          class=${classMap(dayClasses)}
          part="day"
          ?disabled=${disabled}
          aria-label="${this._viewYear}-${this._viewMonth + 1}-${day}"
          aria-pressed=${selected ? 'true' : 'false'}
          @click=${() => this._handleDayClick(this._viewYear, this._viewMonth, day)}
        >${day}</button>
      `);
    }

    return html`<div class="calendar__grid" part="grid">${cells}</div>`;
  }

  private _renderActions() {
    if (this.actions === 'none') return nothing;

    return html`
      <div class="calendar__actions" part="actions">
        ${this.actions === 'clear-cancel-ok' ? html`
          <button class="calendar__action-btn calendar__action-btn--text" @click=${this._handleClear}>
            ${this.clearLabel}
          </button>
        ` : nothing}
        <div class="calendar__actions-spacer"></div>
        <button class="calendar__action-btn calendar__action-btn--text" @click=${this._handleCancel}>
          ${this.cancelLabel}
        </button>
        <button class="calendar__action-btn calendar__action-btn--filled" @click=${this._handleConfirm}>
          ${this.confirmLabel}
        </button>
      </div>
    `;
  }

  render() {
    const containerClasses = {
      'calendar': true,
      'calendar--full': this.chrome === 'full',
      'calendar--grid-only': this.chrome === 'grid-only',
    };

    return html`
      <div class=${classMap(containerClasses)} part="container" role="application" aria-label=${this.headerTitle}>
        ${this.chrome === 'full' ? html`
          <div class="calendar__title">${this.headerTitle}</div>
        ` : nothing}
        ${this._renderHeader()}
        ${this._renderGrid()}
        ${this._renderActions()}
      </div>
    `;
  }
}
