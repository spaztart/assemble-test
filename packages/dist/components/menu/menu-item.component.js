import { LitElement as u, nothing as r, html as i } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as d } from "lit/directives/class-map.js";
import h from "./menu-item.styles.js";
import "../icon/icon.js";
var b = Object.defineProperty, s = (l, n, c, f) => {
  for (var a = void 0, p = l.length - 1, m; p >= 0; p--)
    (m = l[p]) && (a = m(n, c, a) || a);
  return a && b(n, c, a), a;
};
const o = class o extends u {
  constructor() {
    super(...arguments), this.label = "", this.supportingText = "", this.startIcon = "", this.endIcon = "", this.selected = !1, this.disabled = !1, this.density = "default";
  }
  render() {
    const n = {
      "menu-item": !0,
      "menu-item--selected": this.selected
    };
    return i`
      <button
        class=${d(n)}
        ?disabled=${this.disabled}
        role="menuitem"
        aria-label=${this.label || r}
        part="item"
      >
        <span class="menu-item__state-layer" part="state-layer"></span>
        ${this.startIcon ? i`<span class="menu-item__leading" part="leading"><asm-icon name=${this.startIcon}></asm-icon></span>` : r}
        <span class="menu-item__content" part="content">
          <span class="menu-item__label" part="label">${this.label}</span>
          ${this.supportingText ? i`<span class="menu-item__supporting-text" part="supporting-text">${this.supportingText}</span>` : r}
        </span>
        ${this.endIcon ? i`<span class="menu-item__trailing" part="trailing"><asm-icon name=${this.endIcon}></asm-icon></span>` : r}
      </button>
    `;
  }
};
o.styles = h;
let t = o;
s([
  e()
], t.prototype, "label");
s([
  e({ attribute: "supporting-text" })
], t.prototype, "supportingText");
s([
  e({ attribute: "start-icon" })
], t.prototype, "startIcon");
s([
  e({ attribute: "end-icon" })
], t.prototype, "endIcon");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "selected");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
s([
  e({ reflect: !0 })
], t.prototype, "density");
export {
  t as default
};
