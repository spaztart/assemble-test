import { LitElement as c, html as e } from "lit";
import { property as p } from "lit/decorators.js";
import { classMap as f } from "lit/directives/class-map.js";
import d from "./status-notification.styles.js";
var h = Object.defineProperty, l = (o, s, i, m) => {
  for (var t = void 0, a = o.length - 1, u; a >= 0; a--)
    (u = o[a]) && (t = u(s, i, t) || t);
  return t && h(s, i, t), t;
};
const n = class n extends c {
  constructor() {
    super(...arguments), this.status = "info", this.count = 0;
  }
  get _displayCount() {
    return this.count > 99 ? "99+" : String(this.count);
  }
  render() {
    const s = {
      "status-notification": !0,
      [`status-notification--${this.status}`]: !0
    };
    return e`
      <span class=${f(s)} part="badge" aria-label="${this.count} notifications">
        ${this.status === "loader" ? e`
          <span class="status-notification__loader"></span>
        ` : e`
          <span class="status-notification__count">${this._displayCount}</span>
        `}
      </span>
    `;
  }
};
n.styles = d;
let r = n;
l([
  p({ reflect: !0 })
], r.prototype, "status");
l([
  p({ type: Number })
], r.prototype, "count");
export {
  r as default
};
