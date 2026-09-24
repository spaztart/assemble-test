import { LitElement as h, nothing as o, html as d } from "lit";
import { property as l } from "lit/decorators.js";
import { classMap as c } from "lit/directives/class-map.js";
import b from "./radio.styles.js";
var _ = Object.defineProperty, r = (n, e, t, v) => {
  for (var s = void 0, i = n.length - 1, u; i >= 0; i--)
    (u = n[i]) && (s = u(e, t, s) || s);
  return s && _(e, t, s), s;
};
const p = class p extends h {
  constructor() {
    super(...arguments), this.value = "", this.groupValue = "", this.label = "", this.disabled = !1;
  }
  get _selected() {
    return this.value === this.groupValue;
  }
  _select() {
    if (this.disabled || this._selected) return;
    this.groupValue = this.value;
    const e = this.parentElement;
    e && e.querySelectorAll("asm-radio").forEach((t) => {
      t !== this && t.groupValue !== this.value && (t.groupValue = this.value);
    }), this.dispatchEvent(new CustomEvent("change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleKeyDown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._select());
  }
  render() {
    const e = {
      radio: !0,
      "radio--selected": this._selected,
      "radio--disabled": this.disabled
    };
    return d`
      <div
        class=${c(e)}
        part="radio"
        role="radio"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${String(this._selected)}
        aria-disabled=${this.disabled}
        aria-label=${this.label || o}
        @click=${this._select}
        @keydown=${this._handleKeyDown}
      >
        <span class="radio__state-layer" part="state-layer"></span>
        <span class="radio__circle" part="circle">
          ${this._selected ? d`<span class="radio__dot"></span>` : o}
        </span>
        ${this.label ? d`<span class="radio__label" part="label">${this.label}</span>` : o}
      </div>
    `;
  }
};
p.styles = b;
let a = p;
r([
  l()
], a.prototype, "value");
r([
  l({ attribute: "group-value" })
], a.prototype, "groupValue");
r([
  l()
], a.prototype, "label");
r([
  l({ type: Boolean, reflect: !0 })
], a.prototype, "disabled");
export {
  a as default
};
