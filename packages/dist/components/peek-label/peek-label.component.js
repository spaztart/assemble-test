import { LitElement as c, nothing as m, html as f } from "lit";
import { property as r } from "lit/decorators.js";
import { classMap as h } from "lit/directives/class-map.js";
import u from "./peek-label.styles.js";
import "../icon/icon.js";
var d = Object.defineProperty, s = (n, i, a, y) => {
  for (var t = void 0, l = n.length - 1, p; l >= 0; l--)
    (p = n[l]) && (t = p(i, a, t) || t);
  return t && d(i, a, t), t;
};
const o = class o extends c {
  constructor() {
    super(...arguments), this.text = "", this.size = "default", this.trailingIcon = "", this.offline = !1;
  }
  render() {
    const i = {
      "peek-label": !0,
      "peek-label--default": this.size === "default",
      "peek-label--small": this.size === "small",
      "peek-label--offline": this.offline
    };
    return f`
      <div class=${h(i)}>
        <span>${this.text}</span>
        ${this.trailingIcon ? f`<asm-icon name=${this.trailingIcon}></asm-icon>` : m}
      </div>
    `;
  }
};
o.styles = u;
let e = o;
s([
  r()
], e.prototype, "text");
s([
  r({ reflect: !0 })
], e.prototype, "size");
s([
  r({ attribute: "trailing-icon" })
], e.prototype, "trailingIcon");
s([
  r({ type: Boolean, reflect: !0 })
], e.prototype, "offline");
export {
  e as default
};
