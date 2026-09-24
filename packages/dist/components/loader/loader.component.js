import { LitElement as n, html as d } from "lit";
import { property as a } from "lit/decorators.js";
import { classMap as $ } from "lit/directives/class-map.js";
import u from "./loader.styles.js";
var b = Object.defineProperty, o = (l, r, s, i) => {
  for (var t = void 0, c = l.length - 1, p; c >= 0; c--)
    (p = l[c]) && (t = p(r, s, t) || t);
  return t && b(r, s, t), t;
};
const h = class h extends n {
  constructor() {
    super(...arguments), this.size = 40, this.variant = "bar", this.strokeWidth = 3, this.ariaLabel = "Loading";
  }
  render() {
    const r = (this.size - this.strokeWidth) / 2, s = 2 * Math.PI * r, i = this.size / 2;
    return d`
      <div class=${$({
      loader: !0,
      "loader--bar": !0
    })} role="progressbar" aria-label=${this.ariaLabel || "Loading"} part="container">
        <svg width=${this.size} height=${this.size} viewBox="0 0 ${this.size} ${this.size}">
          <circle class="track" cx=${i} cy=${i} r=${r} stroke-width=${this.strokeWidth} />
          <circle class="arc" cx=${i} cy=${i} r=${r} stroke-width=${this.strokeWidth}
            stroke-dasharray="${s * 0.14} ${s}" />
        </svg>
      </div>
    `;
  }
};
h.styles = u;
let e = h;
o([
  a({ type: Number })
], e.prototype, "size");
o([
  a({ reflect: !0 })
], e.prototype, "variant");
o([
  a({ type: Number, attribute: "stroke-width" })
], e.prototype, "strokeWidth");
o([
  a({ attribute: "aria-label" })
], e.prototype, "ariaLabel");
export {
  e as default
};
