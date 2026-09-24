import { LitElement as p, nothing as l, html as s } from "lit";
import { property as i, state as v } from "lit/decorators.js";
import { classMap as m } from "lit/directives/class-map.js";
import h from "./navigation-rail.styles.js";
import "../brand/brand.js";
import "../status-indicator/status-indicator.js";
import "../peek-label/peek-label.js";
import "../icon/icon.js";
var u = Object.defineProperty, e = (b, r, n, _) => {
  for (var t = void 0, o = b.length - 1, c; o >= 0; o--)
    (c = b[o]) && (t = c(r, n, t) || t);
  return t && u(r, n, t), t;
};
const d = class d extends p {
  constructor() {
    super(...arguments), this.orientation = "vertical", this.brand = !1, this.brandInteractive = !1, this.brandActive = !1, this.brandLabel = "McAfee", this._brandHovered = !1;
  }
  _handleBrandClick() {
    this.dispatchEvent(new CustomEvent("brand-click", { bubbles: !0, composed: !0 }));
  }
  render() {
    const r = this.brand ? this._renderBrand() : l;
    return s`
      <nav class="rail" part="rail" aria-label="Navigation rail" role="navigation">
        <div class="rail__top">
          ${r}
          <slot name="top"></slot>
        </div>
        <div class="rail__middle">
          <slot></slot>
        </div>
        <div class="rail__bottom">
          <slot name="bottom"></slot>
        </div>
      </nav>
    `;
  }
  _renderBrand() {
    if (this.brandInteractive) {
      const r = {
        "rail-brand": !0,
        "rail-brand--interactive": !0,
        "rail-brand--active": this.brandActive
      }, n = this.brandActive ? "brand-orange" : "primary";
      return s`
        <button
          class=${m(r)}
          @click=${this._handleBrandClick}
          @mouseenter=${() => this._brandHovered = !0}
          @mouseleave=${() => this._brandHovered = !1}
          aria-label=${this.brandLabel}
          aria-current=${this.brandActive ? "page" : l}
        >
          <span class="rail-brand__icon">
            <asm-brand variant="logo" color=${n} size="sm"></asm-brand>
          </span>
          ${this.orientation === "vertical" ? s`
            <span class="rail-brand__peek ${this._brandHovered ? "rail-brand__peek--visible" : ""}" aria-hidden="true">
              <asm-peek-label text=${this.brandLabel}></asm-peek-label>
            </span>
          ` : l}
        </button>
      `;
    }
    return s`
      <div
        class="rail-brand rail-brand--decorative"
        role="img"
        aria-label=${this.brandLabel}
      >
        <span class="rail-brand__icon">
          <asm-brand variant="logo" color="white" size="sm"></asm-brand>
        </span>
      </div>
    `;
  }
};
d.styles = h;
let a = d;
e([
  i({ reflect: !0 })
], a.prototype, "orientation");
e([
  i({ type: Boolean })
], a.prototype, "brand");
e([
  i({ type: Boolean, attribute: "brand-interactive" })
], a.prototype, "brandInteractive");
e([
  i({ type: Boolean, attribute: "brand-active" })
], a.prototype, "brandActive");
e([
  i({ attribute: "brand-label" })
], a.prototype, "brandLabel");
e([
  v()
], a.prototype, "_brandHovered");
export {
  a as default
};
