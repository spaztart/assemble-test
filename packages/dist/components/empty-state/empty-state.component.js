import { LitElement as d, nothing as n, html as s } from "lit";
import { property as e } from "lit/decorators.js";
import u from "./empty-state.styles.js";
import "../icon/icon.js";
var m = Object.defineProperty, o = (c, a, h, y) => {
  for (var i = void 0, r = c.length - 1, l; r >= 0; r--)
    (l = c[r]) && (i = l(a, h, i) || i);
  return i && m(a, h, i), i;
};
const p = class p extends d {
  constructor() {
    super(...arguments), this.icon = "", this.showIcon = !0, this.title = "", this.description = "", this.iconSize = 48, this.iconBackgroundSize = 96;
  }
  render() {
    return s`
      <div class="empty-state" part="container">
        ${this.showIcon && this.icon ? s`
          <div
            class="empty-state__icon-wrapper"
            part="icon-wrapper"
            style="width:${this.iconBackgroundSize}px;height:${this.iconBackgroundSize}px"
          >
            <asm-icon class="empty-state__icon" name=${this.icon} style="font-size:${this.iconSize}px"></asm-icon>
          </div>
        ` : n}
        ${this.title ? s`<h3 class="empty-state__title" part="title">${this.title}</h3>` : n}
        ${this.description ? s`<p class="empty-state__description" part="description">${this.description}</p>` : n}
        <slot name="action"></slot>
      </div>
    `;
  }
};
p.styles = u;
let t = p;
o([
  e()
], t.prototype, "icon");
o([
  e({ type: Boolean, attribute: "show-icon" })
], t.prototype, "showIcon");
o([
  e()
], t.prototype, "title");
o([
  e()
], t.prototype, "description");
o([
  e({ type: Number, attribute: "icon-size" })
], t.prototype, "iconSize");
o([
  e({ type: Number, attribute: "icon-background-size" })
], t.prototype, "iconBackgroundSize");
export {
  t as default
};
