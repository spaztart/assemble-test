import { LitElement as d, nothing as l, html as c } from "lit";
import { property as r } from "lit/decorators.js";
import f from "./side-sheet.styles.js";
var y = Object.defineProperty, o = (a, s, p, m) => {
  for (var t = void 0, i = a.length - 1, n; i >= 0; i--)
    (n = a[i]) && (t = n(s, p, t) || t);
  return t && y(s, p, t), t;
};
const h = class h extends d {
  constructor() {
    super(...arguments), this.open = !0, this.gap = 10, this.width = "", this.height = "";
  }
  render() {
    if (!this.open) return l;
    const s = [
      this.width ? `width: ${this.width}` : "",
      this.height ? `height: ${this.height}` : ""
    ].filter(Boolean).join(";");
    return c`
      <aside
        class="side-sheet"
        part="container"
        style=${s || l}
        role="complementary"
      >
        <div class="side-sheet__header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="side-sheet__content" part="content" style="gap: ${this.gap}px">
          <slot></slot>
        </div>
        <div class="side-sheet__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </aside>
    `;
  }
};
h.styles = f;
let e = h;
o([
  r({ type: Boolean, reflect: !0 })
], e.prototype, "open");
o([
  r({ type: Number })
], e.prototype, "gap");
o([
  r()
], e.prototype, "width");
o([
  r()
], e.prototype, "height");
export {
  e as default
};
