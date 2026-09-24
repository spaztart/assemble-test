import { LitElement as h, nothing as l, html as s } from "lit";
import { property as t } from "lit/decorators.js";
import { classMap as f } from "lit/directives/class-map.js";
import p from "./nav-drawer.styles.js";
import "../brand/brand.js";
import "../icon/icon.js";
var g = Object.defineProperty, e = (v, a, m, _) => {
  for (var r = void 0, o = v.length - 1, y; o >= 0; o--)
    (y = v[o]) && (r = y(a, m, r) || r);
  return r && g(a, m, r), r;
};
const c = class c extends h {
  constructor() {
    super(...arguments), this.label = "", this.icon = "", this.trailingIcon = "arrow_forward", this.showTrailing = !0, this.disabled = !1, this.semanticLabel = "";
  }
  _handleClick() {
    this.disabled || this.dispatchEvent(new CustomEvent("item-click", {
      bubbles: !0,
      composed: !0,
      detail: { label: this.label }
    }));
  }
  _handleKeydown(a) {
    this.disabled || (a.key === "Enter" || a.key === " ") && (a.preventDefault(), this._handleClick());
  }
  render() {
    const a = {
      "nav-list-item": !0,
      "nav-list-item--disabled": this.disabled
    };
    return s`
      <button
        class=${f(a)}
        part="item"
        role="button"
        aria-label=${this.semanticLabel || this.label}
        aria-disabled=${this.disabled ? "true" : l}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        ${this.icon ? s`
          <span class="nav-list-item__leading" aria-hidden="true">
            <asm-icon name=${this.icon}></asm-icon>
          </span>
        ` : l}
        <span class="nav-list-item__label">${this.label}</span>
        ${this.showTrailing ? s`
          <span class="nav-list-item__trailing" aria-hidden="true">
            <asm-icon name=${this.trailingIcon}></asm-icon>
          </span>
        ` : l}
      </button>
    `;
  }
};
c.styles = p;
let i = c;
e([
  t()
], i.prototype, "label");
e([
  t()
], i.prototype, "icon");
e([
  t({ attribute: "trailing-icon" })
], i.prototype, "trailingIcon");
e([
  t({ type: Boolean, attribute: "show-trailing" })
], i.prototype, "showTrailing");
e([
  t({ type: Boolean, reflect: !0 })
], i.prototype, "disabled");
e([
  t({ attribute: "semantic-label" })
], i.prototype, "semanticLabel");
const b = class b extends h {
  constructor() {
    super(...arguments), this.brand = !0, this.navLabel = "Main navigation";
  }
  render() {
    return s`
      <nav class="nav-drawer" part="drawer" aria-label=${this.navLabel} role="navigation">
        ${this.brand ? s`
          <div class="nav-drawer__header" part="header">
            <asm-brand variant="wordmark" color="primary" size="sm"></asm-brand>
          </div>
        ` : l}
        <div class="nav-drawer__body" part="body">
          <slot></slot>
        </div>
        <div class="nav-drawer__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </nav>
    `;
  }
};
b.styles = p;
let n = b;
e([
  t({ type: Boolean })
], n.prototype, "brand");
e([
  t({ attribute: "nav-label" })
], n.prototype, "navLabel");
const u = class u extends h {
  constructor() {
    super(...arguments), this.title = "";
  }
  render() {
    return s`
      <div class="nav-section" part="section" role="group" aria-label=${this.title || l}>
        ${this.title ? s`
          <div class="nav-category-header" part="header" role="heading" aria-level="2">
            ${this.title}
          </div>
        ` : l}
        <slot></slot>
      </div>
    `;
  }
};
u.styles = p;
let d = u;
e([
  t()
], d.prototype, "title");
export {
  i as AsmNavListItem,
  d as AsmNavSection,
  n as default
};
