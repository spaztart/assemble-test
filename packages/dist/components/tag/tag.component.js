import { LitElement as b, nothing as h, html as n } from "lit";
import { property as a } from "lit/decorators.js";
import { classMap as m } from "lit/directives/class-map.js";
import u from "./tag.styles.js";
import "../icon/icon.js";
var d = Object.defineProperty, o = (c, e, l, f) => {
  for (var s = void 0, r = c.length - 1, p; r >= 0; r--)
    (p = c[r]) && (s = p(e, l, s) || s);
  return s && d(e, l, s), s;
};
const i = class i extends b {
  constructor() {
    super(...arguments), this.label = "", this.variant = "standard", this.leadingIcon = "", this.closable = !1, this.closeLabel = "Remove";
  }
  _handleClose(e) {
    e.stopPropagation(), this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    const e = {
      tag: !0,
      [`tag--${this.variant}`]: !0
    }, l = this.variant === "filter" && this.closable;
    return n`
      <span class=${m(e)} part="tag">
        ${this.leadingIcon ? n`<asm-icon class="tag__icon" name=${this.leadingIcon}></asm-icon>` : h}
        <span class="tag__label" part="label">${this.label}</span>
        ${l ? n`
          <button
            class="tag__close"
            part="close"
            aria-label=${this.closeLabel}
            @click=${this._handleClose}
          >
            <asm-icon name="close" class="tag__close-icon"></asm-icon>
          </button>
        ` : h}
      </span>
    `;
  }
};
i.styles = u;
let t = i;
o([
  a()
], t.prototype, "label");
o([
  a({ reflect: !0 })
], t.prototype, "variant");
o([
  a({ attribute: "leading-icon" })
], t.prototype, "leadingIcon");
o([
  a({ type: Boolean })
], t.prototype, "closable");
o([
  a({ attribute: "close-label" })
], t.prototype, "closeLabel");
export {
  t as default
};
