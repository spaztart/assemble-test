import { LitElement as u, html as d } from "lit";
import { property as l } from "lit/decorators.js";
import { classMap as v } from "lit/directives/class-map.js";
import f from "./carousel-indicator.styles.js";
var m = Object.defineProperty, p = (a, e, s, n) => {
  for (var t = void 0, i = a.length - 1, c; i >= 0; i--)
    (c = a[i]) && (t = c(e, s, t) || t);
  return t && m(e, s, t), t;
};
const o = class o extends u {
  constructor() {
    super(...arguments), this.count = 1, this.activeIndex = 0;
  }
  render() {
    const e = Array.from({ length: this.count }, (s, n) => {
      const t = {
        dot: !0,
        "dot--active": n === this.activeIndex
      };
      return d`<div class=${v(t)}></div>`;
    });
    return d`
      <div class="carousel-indicator" role="tablist" aria-label=${`Page ${this.activeIndex + 1} of ${this.count}`}>
        ${e}
      </div>
    `;
  }
};
o.styles = f;
let r = o;
p([
  l({ type: Number })
], r.prototype, "count");
p([
  l({ type: Number, attribute: "active-index" })
], r.prototype, "activeIndex");
export {
  r as default
};
