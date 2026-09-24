import { LitElement as l, html as c } from "lit";
import { property as e } from "lit/decorators.js";
var u = Object.defineProperty, r = (n, s, i, d) => {
  for (var t = void 0, a = n.length - 1, p; a >= 0; a--)
    (p = n[a]) && (t = p(s, i, t) || t);
  return t && u(s, i, t), t;
};
class o extends l {
  constructor() {
    super(...arguments), this.label = "", this.startIcon = "", this.endIcon = "", this.active = !1;
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return c``;
  }
}
r([
  e()
], o.prototype, "label");
r([
  e({ attribute: "start-icon" })
], o.prototype, "startIcon");
r([
  e({ attribute: "end-icon" })
], o.prototype, "endIcon");
r([
  e({ type: Boolean, reflect: !0 })
], o.prototype, "active");
export {
  o as default
};
