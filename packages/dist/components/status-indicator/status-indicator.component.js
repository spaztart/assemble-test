import { LitElement as c, nothing as d, html as u } from "lit";
import { property as r } from "lit/decorators.js";
import { classMap as f } from "lit/directives/class-map.js";
import h from "./status-indicator.styles.js";
var m = Object.defineProperty, a = (l, e, n, y) => {
  for (var t = void 0, i = l.length - 1, p; i >= 0; i--)
    (p = l[i]) && (t = p(e, n, t) || t);
  return t && m(e, n, t), t;
};
const o = class o extends c {
  constructor() {
    super(...arguments), this.status = "info", this.indicatorStyle = "colored", this.label = "", this.size = "medium";
  }
  render() {
    const e = {
      "status-indicator": !0,
      [`status-indicator--${this.status}`]: !0,
      [`status-indicator--${this.indicatorStyle}`]: !0,
      [`status-indicator--${this.size}`]: !0
    };
    return u`
      <span class=${f(e)}>
        <span class="status-indicator__dot" part="dot"></span>
        ${this.label ? u`<span class="status-indicator__label" part="label">${this.label}</span>` : d}
      </span>
    `;
  }
};
o.styles = h;
let s = o;
a([
  r({ reflect: !0 })
], s.prototype, "status");
a([
  r({ reflect: !0, attribute: "indicator-style" })
], s.prototype, "indicatorStyle");
a([
  r()
], s.prototype, "label");
a([
  r({ reflect: !0 })
], s.prototype, "size");
export {
  s as default
};
