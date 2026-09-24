import { LitElement as f, html as o, nothing as c } from "lit";
import { property as l, state as d } from "lit/decorators.js";
import { classMap as b } from "lit/directives/class-map.js";
import y from "./calendar.styles.js";
import "../icon/icon.js";
var w = Object.defineProperty, s = (u, t, a, r) => {
  for (var e = void 0, n = u.length - 1, h; n >= 0; n--)
    (h = u[n]) && (e = h(t, a, e) || e);
  return e && w(t, a, e), e;
};
const _ = class _ extends f {
  constructor() {
    super(...arguments), this.mode = "single", this.actions = "none", this.chrome = "full", this.headerTitle = "Select date", this.minDate = "", this.maxDate = "", this.value = "", this.rangeStart = "", this.rangeEnd = "", this.confirmLabel = "OK", this.cancelLabel = "Cancel", this.clearLabel = "Clear", this._viewYear = (/* @__PURE__ */ new Date()).getFullYear(), this._viewMonth = (/* @__PURE__ */ new Date()).getMonth(), this._rangeSelecting = "start";
  }
  _daysInMonth(t, a) {
    return new Date(t, a + 1, 0).getDate();
  }
  _firstDayOfMonth(t, a) {
    return new Date(t, a, 1).getDay();
  }
  _toISO(t, a, r) {
    return `${t}-${String(a + 1).padStart(2, "0")}-${String(r).padStart(2, "0")}`;
  }
  _parseDate(t) {
    if (!t) return null;
    const a = /* @__PURE__ */ new Date(t + "T00:00:00");
    return isNaN(a.getTime()) ? null : a;
  }
  _isDisabled(t, a, r) {
    const e = this._toISO(t, a, r);
    return !!(this.minDate && e < this.minDate || this.maxDate && e > this.maxDate);
  }
  _isToday(t, a, r) {
    const e = /* @__PURE__ */ new Date();
    return t === e.getFullYear() && a === e.getMonth() && r === e.getDate();
  }
  _isSelected(t, a, r) {
    const e = this._toISO(t, a, r);
    return this.mode === "single" ? e === this.value : e === this.rangeStart || e === this.rangeEnd;
  }
  _isInRange(t, a, r) {
    if (this.mode !== "range" || !this.rangeStart || !this.rangeEnd) return !1;
    const e = this._toISO(t, a, r);
    return e > this.rangeStart && e < this.rangeEnd;
  }
  _handleDayClick(t, a, r) {
    if (this._isDisabled(t, a, r)) return;
    const e = this._toISO(t, a, r);
    this.mode === "single" ? (this.value = e, this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      composed: !0,
      detail: { value: e }
    }))) : this._rangeSelecting === "start" ? (this.rangeStart = e, this.rangeEnd = "", this._rangeSelecting = "end") : (e < this.rangeStart ? (this.rangeEnd = this.rangeStart, this.rangeStart = e) : this.rangeEnd = e, this._rangeSelecting = "start", this.dispatchEvent(new CustomEvent("range-change", {
      bubbles: !0,
      composed: !0,
      detail: { start: this.rangeStart, end: this.rangeEnd }
    })));
  }
  _prevMonth() {
    this._viewMonth === 0 ? (this._viewMonth = 11, this._viewYear--) : this._viewMonth--;
  }
  _nextMonth() {
    this._viewMonth === 11 ? (this._viewMonth = 0, this._viewYear++) : this._viewMonth++;
  }
  _handleConfirm() {
    this.dispatchEvent(new CustomEvent("confirm", { bubbles: !0, composed: !0 }));
  }
  _handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel", { bubbles: !0, composed: !0 }));
  }
  _handleClear() {
    this.value = "", this.rangeStart = "", this.rangeEnd = "", this.dispatchEvent(new CustomEvent("clear", { bubbles: !0, composed: !0 }));
  }
  connectedCallback() {
    super.connectedCallback();
    const t = this._parseDate(this.value || this.rangeStart);
    t && (this._viewYear = t.getFullYear(), this._viewMonth = t.getMonth());
  }
  _renderHeader() {
    const t = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return o`
      <div class="calendar__header" part="header">
        <button
          class="calendar__nav-btn"
          @click=${this._prevMonth}
          aria-label="Previous month"
        >
          <asm-icon name="chevron_left"></asm-icon>
        </button>
        <span class="calendar__month-label">
          ${t[this._viewMonth]} ${this._viewYear}
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
  _renderGrid() {
    const t = this._daysInMonth(this._viewYear, this._viewMonth), a = this._firstDayOfMonth(this._viewYear, this._viewMonth), r = ["S", "M", "T", "W", "T", "F", "S"], e = [];
    for (const n of r)
      e.push(o`<span class="calendar__day-label">${n}</span>`);
    for (let n = 0; n < a; n++)
      e.push(o`<span class="calendar__empty"></span>`);
    for (let n = 1; n <= t; n++) {
      const h = this._isDisabled(this._viewYear, this._viewMonth, n), p = this._isSelected(this._viewYear, this._viewMonth, n), v = this._isInRange(this._viewYear, this._viewMonth, n), g = this._isToday(this._viewYear, this._viewMonth, n), m = {
        calendar__day: !0,
        "calendar__day--selected": p,
        "calendar__day--in-range": v,
        "calendar__day--today": g,
        "calendar__day--disabled": h
      };
      e.push(o`
        <button
          class=${b(m)}
          part="day"
          ?disabled=${h}
          aria-label="${this._viewYear}-${this._viewMonth + 1}-${n}"
          aria-pressed=${p ? "true" : "false"}
          @click=${() => this._handleDayClick(this._viewYear, this._viewMonth, n)}
        >${n}</button>
      `);
    }
    return o`<div class="calendar__grid" part="grid">${e}</div>`;
  }
  _renderActions() {
    return this.actions === "none" ? c : o`
      <div class="calendar__actions" part="actions">
        ${this.actions === "clear-cancel-ok" ? o`
          <button class="calendar__action-btn calendar__action-btn--text" @click=${this._handleClear}>
            ${this.clearLabel}
          </button>
        ` : c}
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
    const t = {
      calendar: !0,
      "calendar--full": this.chrome === "full",
      "calendar--grid-only": this.chrome === "grid-only"
    };
    return o`
      <div class=${b(t)} part="container" role="application" aria-label=${this.headerTitle}>
        ${this.chrome === "full" ? o`
          <div class="calendar__title">${this.headerTitle}</div>
        ` : c}
        ${this._renderHeader()}
        ${this._renderGrid()}
        ${this._renderActions()}
      </div>
    `;
  }
};
_.styles = y;
let i = _;
s([
  l({ reflect: !0 })
], i.prototype, "mode");
s([
  l()
], i.prototype, "actions");
s([
  l()
], i.prototype, "chrome");
s([
  l({ attribute: "header-title" })
], i.prototype, "headerTitle");
s([
  l({ attribute: "min-date" })
], i.prototype, "minDate");
s([
  l({ attribute: "max-date" })
], i.prototype, "maxDate");
s([
  l()
], i.prototype, "value");
s([
  l({ attribute: "range-start" })
], i.prototype, "rangeStart");
s([
  l({ attribute: "range-end" })
], i.prototype, "rangeEnd");
s([
  l({ attribute: "confirm-label" })
], i.prototype, "confirmLabel");
s([
  l({ attribute: "cancel-label" })
], i.prototype, "cancelLabel");
s([
  l({ attribute: "clear-label" })
], i.prototype, "clearLabel");
s([
  d()
], i.prototype, "_viewYear");
s([
  d()
], i.prototype, "_viewMonth");
s([
  d()
], i.prototype, "_rangeSelecting");
export {
  i as default
};
