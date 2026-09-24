import { LitElement as n, html as c } from "lit";
import { property as s } from "lit/decorators.js";
import { classMap as b } from "lit/directives/class-map.js";
import m from "./progress-bar.styles.js";
var v = Object.defineProperty, i = (p, a, e, u) => {
  for (var t = void 0, l = p.length - 1, h; l >= 0; l--)
    (h = p[l]) && (t = h(a, e, t) || t);
  return t && v(a, e, t), t;
};
const o = class o extends n {
  constructor() {
    super(...arguments), this.value = 0, this.status = "brand", this.size = "thick", this.ariaLabel = null;
  }
  render() {
    const a = Math.max(0, Math.min(1, this.value)), e = Math.round(a * 100), u = {
      "progress-bar": !0,
      "progress-bar--thick": this.size === "thick",
      "progress-bar--thin": this.size === "thin",
      [`progress-bar--${this.status}`]: !0
    };
    return c`
      <div class=${b(u)}
           role="progressbar"
           aria-valuenow=${e}
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label=${this.ariaLabel || `Progress, ${this.status}`}
           part="track">
        <div class="progress-bar__fill" style="width: ${e}%" part="fill"></div>
      </div>
    `;
  }
};
o.styles = m;
let r = o;
i([
  s({ type: Number })
], r.prototype, "value");
i([
  s({ reflect: !0 })
], r.prototype, "status");
i([
  s({ reflect: !0 })
], r.prototype, "size");
i([
  s({ attribute: "aria-label" })
], r.prototype, "ariaLabel");
export {
  r as default
};
