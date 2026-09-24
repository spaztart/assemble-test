import { LitElement as u, nothing as c, html as d } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as b } from "lit/directives/class-map.js";
import h from "./split-button.styles.js";
import "../icon/icon.js";
var _ = Object.defineProperty, s = (r, i, l, v) => {
  for (var a = void 0, n = r.length - 1, p; n >= 0; n--)
    (p = r[n]) && (a = p(i, l, a) || a);
  return a && _(i, l, a), a;
};
const o = class o extends u {
  constructor() {
    super(...arguments), this.label = "", this.variant = "filled", this.size = "default", this.disabled = !1, this.destructive = !1, this.startIcon = "", this.open = !1, this._onOutsideClick = (i) => {
      this.open && !this.contains(i.target) && (this.open = !1, this.dispatchEvent(
        new CustomEvent("toggle", {
          bubbles: !0,
          composed: !0,
          detail: { open: !1 }
        })
      ));
    };
  }
  _onActionClick() {
    this.dispatchEvent(new CustomEvent("action", { bubbles: !0, composed: !0 }));
  }
  _onTriggerClick() {
    this.open = !this.open, this.dispatchEvent(
      new CustomEvent("toggle", {
        bubbles: !0,
        composed: !0,
        detail: { open: this.open }
      })
    );
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("click", this._onOutsideClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("click", this._onOutsideClick);
  }
  render() {
    const i = {
      "split-button": !0,
      [`split-button--${this.variant}`]: !0,
      [`split-button--${this.size}`]: !0,
      "split-button--destructive": this.destructive && ["filled", "tonal"].includes(this.variant)
    };
    return d`
      <div class=${b(i)}>
        <button
          class="split-button__action"
          ?disabled=${this.disabled}
          aria-label=${this.label || c}
          part="action"
          @click=${this._onActionClick}
        >
          <span class="split-button__action-state" part="action-state"></span>
          <span class="split-button__action-content" part="action-content">
            ${this.startIcon ? d`<asm-icon class="split-button__start-icon" name=${this.startIcon}></asm-icon>` : c}
            <span class="split-button__label" part="label">${this.label}</span>
          </span>
        </button>
        <span class="split-button__divider" part="divider"></span>
        <button
          class="split-button__trigger"
          ?disabled=${this.disabled}
          aria-haspopup="true"
          aria-expanded=${this.open}
          aria-label="More options"
          part="trigger"
          @click=${this._onTriggerClick}
        >
          <span class="split-button__trigger-state" part="trigger-state"></span>
          <span class="split-button__trigger-icon">
            <asm-icon name="expand_more"></asm-icon>
          </span>
        </button>
      </div>
      <div class="split-button__dropdown" part="dropdown">
        <slot></slot>
      </div>
    `;
  }
};
o.styles = h;
let t = o;
s([
  e()
], t.prototype, "label");
s([
  e({ reflect: !0 })
], t.prototype, "variant");
s([
  e({ reflect: !0 })
], t.prototype, "size");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "destructive");
s([
  e({ attribute: "start-icon" })
], t.prototype, "startIcon");
s([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "open");
export {
  t as default
};
