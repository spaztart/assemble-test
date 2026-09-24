import { LitElement as p, nothing as h, html as c } from "lit";
import { property as a } from "lit/decorators.js";
import { classMap as _ } from "lit/directives/class-map.js";
import u from "./accordion.styles.js";
import "../icon/icon.js";
var y = Object.defineProperty, o = (d, e, r, f) => {
  for (var i = void 0, n = d.length - 1, l; n >= 0; n--)
    (l = d[n]) && (i = l(e, r, i) || i);
  return i && y(e, r, i), i;
};
const s = class s extends p {
  constructor() {
    super(...arguments), this.title = "", this.expanded = !1, this.type = "white", this.leadingIcon = "", this.disabled = !1;
  }
  _toggle() {
    this.disabled || (this.expanded = !this.expanded, this.dispatchEvent(new CustomEvent("toggle", {
      detail: { expanded: this.expanded },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleKeyDown(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._toggle());
  }
  render() {
    const e = {
      accordion: !0,
      "accordion--expanded": this.expanded,
      [`accordion--${this.type}`]: !0,
      "accordion--disabled": this.disabled
    };
    return c`
      <div class=${_(e)}>
        <div
          class="accordion__header"
          part="header"
          role="button"
          tabindex=${this.disabled ? -1 : 0}
          aria-expanded=${String(this.expanded)}
          @click=${this._toggle}
          @keydown=${this._handleKeyDown}
        >
          ${this.leadingIcon ? c`<asm-icon class="accordion__leading-icon" name=${this.leadingIcon}></asm-icon>` : h}
          <span class="accordion__title">${this.title}</span>
          <asm-icon class="accordion__chevron" part="chevron" name="keyboard_arrow_down"></asm-icon>
        </div>
        <div class="accordion__body">
          <div class="accordion__content" part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
};
s.styles = u;
let t = s;
o([
  a()
], t.prototype, "title");
o([
  a({ type: Boolean, reflect: !0 })
], t.prototype, "expanded");
o([
  a({ reflect: !0 })
], t.prototype, "type");
o([
  a({ attribute: "leading-icon" })
], t.prototype, "leadingIcon");
o([
  a({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
export {
  t as default
};
