import { LitElement as d, nothing as o, html as i } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as b } from "lit/directives/class-map.js";
import h from "./button.styles.js";
import "../icon/icon.js";
var f = Object.defineProperty, s = (c, r, p, m) => {
  for (var a = void 0, n = c.length - 1, u; n >= 0; n--)
    (u = c[n]) && (a = u(r, p, a) || a);
  return a && f(r, p, a), a;
};
const l = class l extends d {
  constructor() {
    super(...arguments), this.label = "", this.variant = "filled", this.size = "default", this.disabled = !1, this.destructive = !1, this.startIcon = "", this.endIcon = "";
  }
  render() {
    const r = {
      button: !0,
      [`button--${this.variant}`]: !0,
      [`button--${this.size}`]: !0,
      "button--destructive": this.destructive && ["filled", "tonal", "text"].includes(this.variant)
    };
    return i`
      <button
        class=${b(r)}
        ?disabled=${this.disabled}
        aria-label=${this.label || o}
        part="button"
      >
        <span class="button__state-layer" part="state-layer"></span>
        <span class="button__content" part="content">
          ${this.startIcon ? i`<asm-icon class="button__start-icon" name=${this.startIcon}></asm-icon>` : o}
          <span class="button__label" part="label">${this.label}</span>
          ${this.endIcon ? i`<asm-icon class="button__end-icon" name=${this.endIcon}></asm-icon>` : o}
        </span>
      </button>
    `;
  }
};
l.styles = h;
let t = l;
s([
  e()
], t.prototype, "label");
s([
  e({ reflect: !0 })
], t.prototype, "variant");
s([
  e({ reflect: !0 })
], t.prototype, "size");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "destructive");
s([
  e({ attribute: "start-icon" })
], t.prototype, "startIcon");
s([
  e({ attribute: "end-icon" })
], t.prototype, "endIcon");
export {
  t as default
};
