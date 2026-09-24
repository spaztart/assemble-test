import { LitElement as _, html as p, nothing as c } from "lit";
import { property as n, state as o } from "lit/decorators.js";
import { classMap as g } from "lit/directives/class-map.js";
import f from "./date-input.styles.js";
import "../icon/icon.js";
import "../calendar/calendar.js";
var b = Object.defineProperty, s = (u, t, i, e) => {
  for (var a = void 0, l = u.length - 1, d; l >= 0; l--)
    (d = u[l]) && (a = d(t, i, a) || a);
  return a && b(t, i, a), a;
};
const h = class h extends _ {
  constructor() {
    super(...arguments), this.variant = "single", this.label = "Date", this.placeholder = "MM/DD/YYYY", this.supportingText = "MM/DD/YYYY", this.value = "", this.rangeStart = "", this.rangeEnd = "", this.minDate = "", this.maxDate = "", this.disabled = !1, this.error = !1, this.errorText = "", this.endPlaceholder = "MM/DD/YYYY", this._pickerOpen = !1, this._inputValue = "", this._endInputValue = "", this._focused = !1;
  }
  _formatDateForDisplay(t) {
    if (!t) return "";
    const i = t.split("-");
    return i.length !== 3 ? t : `${i[1]}/${i[2]}/${i[0]}`;
  }
  _parseDateInput(t) {
    const e = t.replace(/[^\d/]/g, "").split("/");
    if (e.length === 3 && e[0].length === 2 && e[1].length === 2 && e[2].length === 4) {
      const a = parseInt(e[0], 10), l = parseInt(e[1], 10), d = parseInt(e[2], 10);
      if (a >= 1 && a <= 12 && l >= 1 && l <= 31 && d >= 1e3)
        return `${e[2]}-${e[0]}-${e[1]}`;
    }
    return "";
  }
  _applyDateMask(t) {
    const i = t.replace(/\D/g, "").slice(0, 8);
    let e = "";
    for (let a = 0; a < i.length; a++)
      (a === 2 || a === 4) && (e += "/"), e += i[a];
    return e;
  }
  _handleInput(t) {
    const i = t.target, e = this._applyDateMask(i.value);
    i.value = e, this._inputValue = e;
    const a = this._parseDateInput(e);
    a && (this.value = a, this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      composed: !0,
      detail: { value: a }
    })));
  }
  _handleEndInput(t) {
    const i = t.target, e = this._applyDateMask(i.value);
    i.value = e, this._endInputValue = e;
    const a = this._parseDateInput(e);
    a && (this.rangeEnd = a, this.rangeStart && this.dispatchEvent(new CustomEvent("range-change", {
      bubbles: !0,
      composed: !0,
      detail: { start: this.rangeStart, end: a }
    })));
  }
  _togglePicker() {
    this._pickerOpen = !this._pickerOpen, this.dispatchEvent(new CustomEvent(
      this._pickerOpen ? "picker-open" : "picker-close",
      { bubbles: !0, composed: !0 }
    ));
  }
  _handleCalendarChange(t) {
    const i = t.detail.value;
    this.value = i, this._inputValue = this._formatDateForDisplay(i), this._pickerOpen = !1, this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      composed: !0,
      detail: { value: i }
    }));
  }
  _handleCalendarRangeChange(t) {
    this.rangeStart = t.detail.start, this.rangeEnd = t.detail.end, this._inputValue = this._formatDateForDisplay(t.detail.start), this._endInputValue = this._formatDateForDisplay(t.detail.end), this._pickerOpen = !1, this.dispatchEvent(new CustomEvent("range-change", {
      bubbles: !0,
      composed: !0,
      detail: { start: t.detail.start, end: t.detail.end }
    }));
  }
  connectedCallback() {
    super.connectedCallback(), this.value && (this._inputValue = this._formatDateForDisplay(this.value)), this.rangeStart && (this._inputValue = this._formatDateForDisplay(this.rangeStart)), this.rangeEnd && (this._endInputValue = this._formatDateForDisplay(this.rangeEnd));
  }
  _renderField(t, i, e) {
    const a = {
      "date-input__field": !0,
      "date-input__field--focused": this._focused,
      "date-input__field--error": this.error,
      "date-input__field--disabled": this.disabled
    };
    return p`
      <div class=${g(a)} part="field">
        <input
          class="date-input__input"
          part="input"
          type="text"
          .value=${t}
          placeholder=${i}
          ?disabled=${this.disabled}
          aria-label=${this.label}
          @input=${e}
          @focus=${() => {
      this._focused = !0;
    }}
          @blur=${() => {
      this._focused = !1;
    }}
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
    return p`
      <div class="date-input" part="container">
        <label class="date-input__label" part="label">${this.label}</label>
        
        ${this.variant === "single" ? this._renderField(this._inputValue, this.placeholder, this._handleInput.bind(this)) : p`
            <div class="date-input__range">
              ${this._renderField(this._inputValue, this.placeholder, this._handleInput.bind(this))}
              <span class="date-input__range-separator">–</span>
              ${this._renderField(this._endInputValue, this.endPlaceholder, this._handleEndInput.bind(this))}
            </div>
          `}

        ${this.error && this.errorText ? p`
          <span class="date-input__error" part="supporting">${this.errorText}</span>
        ` : this.supportingText ? p`
          <span class="date-input__supporting" part="supporting">${this.supportingText}</span>
        ` : c}

        ${this._pickerOpen ? p`
          <div class="date-input__picker" part="picker">
            <asm-calendar
              mode=${this.variant === "range" ? "range" : "single"}
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
        ` : c}
      </div>
    `;
  }
};
h.styles = f;
let r = h;
s([
  n({ reflect: !0 })
], r.prototype, "variant");
s([
  n()
], r.prototype, "label");
s([
  n()
], r.prototype, "placeholder");
s([
  n({ attribute: "supporting-text" })
], r.prototype, "supportingText");
s([
  n()
], r.prototype, "value");
s([
  n({ attribute: "range-start" })
], r.prototype, "rangeStart");
s([
  n({ attribute: "range-end" })
], r.prototype, "rangeEnd");
s([
  n({ attribute: "min-date" })
], r.prototype, "minDate");
s([
  n({ attribute: "max-date" })
], r.prototype, "maxDate");
s([
  n({ type: Boolean, reflect: !0 })
], r.prototype, "disabled");
s([
  n({ type: Boolean, reflect: !0 })
], r.prototype, "error");
s([
  n({ attribute: "error-text" })
], r.prototype, "errorText");
s([
  n({ attribute: "end-placeholder" })
], r.prototype, "endPlaceholder");
s([
  o()
], r.prototype, "_pickerOpen");
s([
  o()
], r.prototype, "_inputValue");
s([
  o()
], r.prototype, "_endInputValue");
s([
  o()
], r.prototype, "_focused");
export {
  r as default
};
