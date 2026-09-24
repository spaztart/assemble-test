import { LitElement as p, nothing as d, html as o } from "lit";
import { property as i } from "lit/decorators.js";
import b from "./tab.styles.js";
import "../icon/icon.js";
var u = Object.defineProperty, n = (c, t, a, y) => {
  for (var e = void 0, l = c.length - 1, h; l >= 0; l--)
    (h = c[l]) && (e = h(t, a, e) || e);
  return e && u(t, a, e), e;
};
const r = class r extends p {
  constructor() {
    super(...arguments), this.label = "", this.icon = "", this.active = !1, this.layout = "text", this._handleClick = () => {
      this.dispatchEvent(new CustomEvent("tab-select", { bubbles: !0, composed: !0 }));
    }, this._handleKeydown = (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this._handleClick());
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tab"), this.setAttribute("tabindex", "0"), this.addEventListener("click", this._handleClick), this.addEventListener("keydown", this._handleKeydown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this._handleClick), this.removeEventListener("keydown", this._handleKeydown);
  }
  render() {
    const t = this.icon && this.layout !== "text", a = this.layout !== "icon";
    return o`
      <div class="tab" part="tab">
        <span class="tab__state-layer"></span>
        ${t ? o`<asm-icon class="tab__icon" name=${this.icon}></asm-icon>` : d}
        ${a ? o`<span class="tab__label" part="label">${this.label}</span>` : d}
        <span class="tab__indicator" part="indicator"></span>
      </div>
    `;
  }
};
r.styles = b;
let s = r;
n([
  i()
], s.prototype, "label");
n([
  i()
], s.prototype, "icon");
n([
  i({ type: Boolean, reflect: !0 })
], s.prototype, "active");
n([
  i({ reflect: !0 })
], s.prototype, "layout");
export {
  s as default
};
