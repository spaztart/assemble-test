import { LitElement as d, html as c, nothing as r } from "lit";
import { property as i } from "lit/decorators.js";
import { classMap as m } from "lit/directives/class-map.js";
import b from "./badge.styles.js";
import "../icon/icon.js";
import "../status-indicator/status-indicator.js";
var f = Object.defineProperty, o = (h, n, p, l) => {
  for (var t = void 0, a = h.length - 1, e; a >= 0; a--)
    (e = h[a]) && (t = e(n, p, t) || t);
  return t && f(n, p, t), t;
};
const y = {
  high: "critical",
  moderate: "attention",
  low: "positive",
  neutral: "info",
  stat: "info"
}, u = class u extends d {
  constructor() {
    super(...arguments), this.label = "", this.status = "high", this.type = "primary", this.dotPosition = "trailing", this.number = "", this.icon = "";
  }
  render() {
    const n = {
      badge: !0,
      [`badge--${this.status}`]: !0,
      [`badge--${this.type}`]: !0
    }, p = this.icon && this.type === "primary" && ["high", "moderate", "low", "neutral"].includes(this.status), l = this.type === "secondary" && this.status !== "dismissed" && this.status !== "offline", t = this.status === "stat" && this.number, a = y[this.status] || "info", e = l ? c`<asm-status-indicator class="badge__indicator" status=${a} size="small" part="indicator"></asm-status-indicator>` : r;
    return c`
      <span class=${m(n)} part="badge" role="status">
        ${l && this.dotPosition === "leading" ? e : r}
        ${p ? c`<asm-icon class="badge__icon" name=${this.icon}></asm-icon>` : r}
        ${t ? c`<span class="badge__number" part="number">${this.number}</span>` : r}
        <span class="badge__label" part="label">${this.label}</span>
        ${l && this.dotPosition === "trailing" ? e : r}
      </span>
    `;
  }
};
u.styles = b;
let s = u;
o([
  i()
], s.prototype, "label");
o([
  i({ reflect: !0 })
], s.prototype, "status");
o([
  i({ reflect: !0 })
], s.prototype, "type");
o([
  i({ attribute: "dot-position" })
], s.prototype, "dotPosition");
o([
  i()
], s.prototype, "number");
o([
  i()
], s.prototype, "icon");
export {
  s as default
};
