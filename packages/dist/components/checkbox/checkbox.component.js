import { LitElement as p, nothing as i, html as c } from "lit";
import { property as r } from "lit/decorators.js";
import { classMap as k } from "lit/directives/class-map.js";
import b from "./checkbox.styles.js";
var u = Object.defineProperty, l = (h, e, n, f) => {
  for (var s = void 0, o = h.length - 1, d; o >= 0; o--)
    (d = h[o]) && (s = d(e, n, s) || s);
  return s && u(e, n, s), s;
};
const a = class a extends p {
  constructor() {
    super(...arguments), this.checked = !1, this.tristate = !1, this.label = "", this.error = !1, this.disabled = !1;
  }
  _toggle() {
    this.disabled || (this.tristate ? this.checked === !1 ? this.checked = !0 : this.checked === !0 ? this.checked = null : this.checked = !1 : this.checked = !this.checked, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: this.checked },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleKeyDown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggle());
  }
  render() {
    const e = {
      checkbox: !0,
      "checkbox--checked": this.checked === !0,
      "checkbox--indeterminate": this.checked === null,
      "checkbox--error": this.error,
      "checkbox--disabled": this.disabled
    };
    return c`
      <div
        class=${k(e)}
        part="checkbox"
        role="checkbox"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${this.checked === null ? "mixed" : String(!!this.checked)}
        aria-disabled=${this.disabled}
        aria-label=${this.label || i}
        @click=${this._toggle}
        @keydown=${this._handleKeyDown}
      >
        <span class="checkbox__state-layer" part="state-layer"></span>
        <span class="checkbox__box" part="box">
          ${this.checked === !0 ? c`
            <svg class="checkbox__icon" viewBox="0 0 18 18" fill="none">
              <polyline points="3.5 9 7.5 13 14.5 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          ` : i}
          ${this.checked === null ? c`
            <svg class="checkbox__icon" viewBox="0 0 18 18" fill="none">
              <line x1="4" y1="9" x2="14" y2="9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          ` : i}
        </span>
        ${this.label ? c`<span class="checkbox__label" part="label">${this.label}</span>` : i}
      </div>
    `;
  }
};
a.styles = b;
let t = a;
l([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "checked");
l([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "tristate");
l([
  r()
], t.prototype, "label");
l([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "error");
l([
  r({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
export {
  t as default
};
