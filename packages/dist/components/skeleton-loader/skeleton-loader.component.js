import { LitElement as l, html as u } from "lit";
import { property as i } from "lit/decorators.js";
import { classMap as n } from "lit/directives/class-map.js";
import f from "./skeleton-loader.styles.js";
var c = Object.defineProperty, h = (d, r, s, m) => {
  for (var t = void 0, o = d.length - 1, p; o >= 0; o--)
    (p = d[o]) && (t = p(r, s, t) || t);
  return t && c(r, s, t), t;
};
const a = class a extends l {
  constructor() {
    super(...arguments), this.shape = "neutral-shape", this.width = "", this.height = "", this.borderRadius = "";
  }
  render() {
    const r = {
      skeleton: !0,
      [`skeleton--${this.shape}`]: !0
    }, s = [
      this.width ? `width:${this.width}` : "",
      this.height ? `height:${this.height}` : "",
      this.borderRadius ? `border-radius:${this.borderRadius}` : ""
    ].filter(Boolean).join(";");
    return u`
      <div
        class=${n(r)}
        part="skeleton"
        style=${s || ""}
        aria-hidden="true"
        role="presentation"
      ></div>
    `;
  }
};
a.styles = f;
let e = a;
h([
  i({ reflect: !0 })
], e.prototype, "shape");
h([
  i()
], e.prototype, "width");
h([
  i()
], e.prototype, "height");
h([
  i({ attribute: "border-radius" })
], e.prototype, "borderRadius");
export {
  e as default
};
