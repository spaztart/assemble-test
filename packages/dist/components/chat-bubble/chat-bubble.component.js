import { LitElement as n, html as r } from "lit";
import { property as f } from "lit/decorators.js";
import d from "./chat-bubble.styles.js";
var u = Object.defineProperty, x = (p, i, l, m) => {
  for (var t = void 0, e = p.length - 1, a; e >= 0; e--)
    (a = p[e]) && (t = a(i, l, t) || t);
  return t && u(i, l, t), t;
};
const o = class o extends n {
  constructor() {
    super(...arguments), this.text = "";
  }
  render() {
    return r`
      <div class="bubble" part="bubble">
        ${this.text ? r`<span class="bubble__text" part="text">${this.text}</span>` : r`<slot></slot>`}
      </div>
    `;
  }
};
o.styles = d;
let s = o;
x([
  f()
], s.prototype, "text");
export {
  s as default
};
