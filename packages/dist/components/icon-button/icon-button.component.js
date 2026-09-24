import { LitElement as u, nothing as p, html as d } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as b } from "lit/directives/class-map.js";
import f from "./icon-button.styles.js";
import "../icon/icon.js";
var h = Object.defineProperty, s = (n, i, l, y) => {
  for (var r = void 0, o = n.length - 1, c; o >= 0; o--)
    (c = n[o]) && (r = c(i, l, r) || r);
  return r && h(i, l, r), r;
};
const a = class a extends u {
  constructor() {
    super(...arguments), this.icon = "", this.variant = "standard", this.size = "default", this.disabled = !1, this.destructive = !1, this.selected = !1, this.label = "";
  }
  render() {
    const i = {
      "icon-button": !0,
      [`icon-button--${this.variant}`]: !0,
      [`icon-button--${this.size}`]: !0,
      "icon-button--selected": this.selected,
      "icon-button--destructive": this.destructive
    };
    return d`
      <button
        class=${b(i)}
        ?disabled=${this.disabled}
        aria-label=${this.label || p}
        aria-pressed=${this.selected ? "true" : p}
        part="button"
      >
        <span class="icon-button__state-layer" part="state-layer"></span>
        <span class="icon-button__content">
          <asm-icon class="icon-button__icon" name=${this.icon} part="icon"></asm-icon>
        </span>
      </button>
    `;
  }
};
a.styles = f;
let t = a;
s([
  e()
], t.prototype, "icon");
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
  e({ type: Boolean, reflect: !0 })
], t.prototype, "selected");
s([
  e({ attribute: "label" })
], t.prototype, "label");
export {
  t as default
};
