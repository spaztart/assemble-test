import { LitElement as p, nothing as o, html as r } from "lit";
import { property as i } from "lit/decorators.js";
import { classMap as u } from "lit/directives/class-map.js";
import v from "./switch.styles.js";
import "../icon/icon.js";
var f = Object.defineProperty, s = (d, e, h, y) => {
  for (var a = void 0, l = d.length - 1, c; l >= 0; l--)
    (c = d[l]) && (a = c(e, h, a) || a);
  return a && f(e, h, a), a;
};
const n = class n extends p {
  constructor() {
    super(...arguments), this.value = !1, this.size = "medium", this.tone = "secondary", this.icon = "", this.loading = !1, this.disabled = !1, this.label = "";
  }
  _toggle() {
    this.disabled || this.loading || (this.value = !this.value, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleKeyDown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggle());
  }
  render() {
    const e = {
      switch: !0,
      "switch--on": this.value,
      [`switch--${this.size}`]: !0,
      [`switch--${this.tone}`]: !0,
      "switch--disabled": this.disabled,
      "switch--loading": this.loading
    };
    return r`
      <div
        class=${u(e)}
        role="switch"
        tabindex=${this.disabled ? -1 : 0}
        aria-checked=${String(this.value)}
        aria-label=${this.label || o}
        aria-disabled=${String(this.disabled)}
        @click=${this._toggle}
        @keydown=${this._handleKeyDown}
      >
        <div class="switch__track" part="track">
          <div class="switch__handle" part="handle">
            ${this.loading ? r`<div class="switch__loader"></div>` : o}
            ${!this.loading && this.icon ? r`<asm-icon class="switch__icon" name=${this.value ? this.icon : "close"}></asm-icon>` : o}
          </div>
        </div>
      </div>
    `;
  }
};
n.styles = v;
let t = n;
s([
  i({ type: Boolean, reflect: !0 })
], t.prototype, "value");
s([
  i({ reflect: !0 })
], t.prototype, "size");
s([
  i({ reflect: !0 })
], t.prototype, "tone");
s([
  i()
], t.prototype, "icon");
s([
  i({ type: Boolean, reflect: !0 })
], t.prototype, "loading");
s([
  i({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
s([
  i()
], t.prototype, "label");
export {
  t as default
};
