import { LitElement as l, html as p } from "lit";
import { property as c } from "lit/decorators.js";
import d from "./menu.styles.js";
import "./menu-item.js";
var h = Object.defineProperty, u = (n, e, o, y) => {
  for (var t = void 0, s = n.length - 1, a; s >= 0; s--)
    (a = n[s]) && (t = a(e, o, t) || t);
  return t && h(e, o, t), t;
};
const i = class i extends l {
  constructor() {
    super(...arguments), this.density = "default", this._observer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._propagateDensity(), this._observer = new MutationObserver(() => this._propagateDensity()), this._observer.observe(this, { childList: !0 });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._observer) == null || e.disconnect(), this._observer = null;
  }
  updated(e) {
    e.has("density") && this._propagateDensity();
  }
  _propagateDensity() {
    this.querySelectorAll("asm-menu-item").forEach((e) => {
      e.setAttribute("density", this.density);
    });
  }
  render() {
    return p`
      <div class="menu" role="menu" part="menu">
        <slot @slotchange=${this._propagateDensity}></slot>
      </div>
    `;
  }
};
i.styles = d;
let r = i;
u([
  c({ reflect: !0 })
], r.prototype, "density");
export {
  r as default
};
