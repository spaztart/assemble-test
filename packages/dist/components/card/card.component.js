import { LitElement as p, html as d } from "lit";
import { property as a } from "lit/decorators.js";
import h from "./card.styles.js";
var f = Object.defineProperty, i = (c, e, n, u) => {
  for (var t = void 0, l = c.length - 1, o; l >= 0; l--)
    (o = c[l]) && (t = o(e, n, t) || t);
  return t && f(e, n, t), t;
};
const s = class s extends p {
  constructor() {
    super(...arguments), this.variant = "surface", this.clickable = !1;
  }
  render() {
    return d`
      <div
        class="card"
        part="card"
        tabindex=${this.clickable ? "0" : "-1"}
        role=${this.clickable ? "button" : "region"}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <span class="card__state-layer" part="state-layer"></span>
        <slot></slot>
      </div>
    `;
  }
  _handleClick() {
    this.clickable && this.dispatchEvent(new CustomEvent("card-click", { bubbles: !0, composed: !0 }));
  }
  _handleKeydown(e) {
    this.clickable && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._handleClick());
  }
};
s.styles = h;
let r = s;
i([
  a({ reflect: !0 })
], r.prototype, "variant");
i([
  a({ type: Boolean, reflect: !0 })
], r.prototype, "clickable");
i([
  a({ reflect: !0 })
], r.prototype, "elevation");
export {
  r as default
};
