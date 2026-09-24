import { LitElement as u, nothing as a, html as s } from "lit";
import { property as t } from "lit/decorators.js";
import _ from "./topbar.styles.js";
import "../icon/icon.js";
import "../progress-bar/progress-bar.js";
var y = Object.defineProperty, e = (c, r, b, m) => {
  for (var n = void 0, l = c.length - 1, d; l >= 0; l--)
    (d = c[l]) && (n = d(r, b, n) || n);
  return n && y(r, b, n), n;
};
const h = class h extends u {
  constructor() {
    super(...arguments), this.type = "home", this.title = "", this.showTitle = !1, this.showLeft = !0, this.showRight = !0, this.leftIcon = "", this.rightIcon = "notifications", this.showBadge = !1, this.progress = 0;
  }
  get _leftIconName() {
    if (this.leftIcon) return this.leftIcon;
    switch (this.type) {
      case "home":
        return "menu";
      case "back":
        return "arrow_back";
      case "progress":
        return "close";
      default:
        return "menu";
    }
  }
  _handleLeftPress() {
    this.dispatchEvent(new CustomEvent("left-press", { bubbles: !0, composed: !0 }));
  }
  _handleRightPress() {
    this.dispatchEvent(new CustomEvent("right-press", { bubbles: !0, composed: !0 }));
  }
  render() {
    return s`
      <nav class="topbar" aria-label="Top navigation">
        ${this.showLeft ? s`
          <button class="topbar__tile" @click=${this._handleLeftPress} aria-label=${this._leftIconName}>
            <asm-icon name=${this._leftIconName}></asm-icon>
          </button>
        ` : a}

        ${this.type === "home" ? s`
          <div class="topbar__center">
            <div class="topbar__brand">
              <slot name="brand"></slot>
            </div>
          </div>
        ` : this.type === "progress" ? s`
          <div class="topbar__progress">
            <asm-progress-bar .value=${this.progress} status="brand" size="thin"></asm-progress-bar>
          </div>
        ` : s`
          <div class="topbar__center">
            ${this.showTitle && this.title ? s`<span class="topbar__title">${this.title}</span>` : a}
          </div>
        `}

        ${this.showRight ? s`
          <button class="topbar__tile" @click=${this._handleRightPress} aria-label=${this.rightIcon}>
            <asm-icon name=${this.rightIcon}></asm-icon>
            ${this.showBadge ? s`<span class="topbar__badge"></span>` : a}
          </button>
        ` : a}
      </nav>
    `;
  }
};
h.styles = _;
let o = h;
e([
  t({ reflect: !0 })
], o.prototype, "type");
e([
  t()
], o.prototype, "title");
e([
  t({ type: Boolean, attribute: "show-title" })
], o.prototype, "showTitle");
e([
  t({ type: Boolean, attribute: "show-left" })
], o.prototype, "showLeft");
e([
  t({ type: Boolean, attribute: "show-right" })
], o.prototype, "showRight");
e([
  t({ attribute: "left-icon" })
], o.prototype, "leftIcon");
e([
  t({ attribute: "right-icon" })
], o.prototype, "rightIcon");
e([
  t({ type: Boolean, attribute: "show-badge" })
], o.prototype, "showBadge");
e([
  t({ type: Number })
], o.prototype, "progress");
const p = class p extends u {
  constructor() {
    super(...arguments), this.type = "full-header", this.title = "", this.subTitle = "", this.showBack = !0, this.showIcon = !0, this.leadingIcon = "visibility";
  }
  _handlePress() {
    this.dispatchEvent(new CustomEvent("press", { bubbles: !0, composed: !0 }));
  }
  render() {
    return this.type === "back-only" ? s`
        <div class="topbar-desktop--back-only">
          <button class="topbar-desktop__back-btn" @click=${this._handlePress} aria-label="Go back">
            <asm-icon name="chevron_left"></asm-icon>
          </button>
        </div>
      ` : s`
      <div class="topbar-desktop" tabindex="0" role="button" @click=${this._handlePress} @keydown=${this._handleKeydown}>
        ${this.showBack ? s`
          <div class="topbar-desktop__back">
            <asm-icon name="chevron_left"></asm-icon>
          </div>
        ` : a}
        ${this.showIcon ? s`
          <div class="topbar-desktop__icon-tile">
            <asm-icon name=${this.leadingIcon}></asm-icon>
          </div>
        ` : a}
        <div class="topbar-desktop__text">
          <span class="topbar-desktop__title">${this.title}</span>
          ${this.subTitle ? s`<span class="topbar-desktop__subtitle">${this.subTitle}</span>` : a}
        </div>
      </div>
    `;
  }
  _handleKeydown(r) {
    (r.key === "Enter" || r.key === " ") && (r.preventDefault(), this._handlePress());
  }
};
p.styles = _;
let i = p;
e([
  t({ reflect: !0 })
], i.prototype, "type");
e([
  t()
], i.prototype, "title");
e([
  t({ attribute: "sub-title" })
], i.prototype, "subTitle");
e([
  t({ type: Boolean, attribute: "show-back" })
], i.prototype, "showBack");
e([
  t({ type: Boolean, attribute: "show-icon" })
], i.prototype, "showIcon");
e([
  t({ attribute: "leading-icon" })
], i.prototype, "leadingIcon");
export {
  i as AsmTopbarDesktop,
  o as default
};
