import { LitElement as b, nothing as r, html as h } from "lit";
import { property as s, state as m } from "lit/decorators.js";
import { classMap as g } from "lit/directives/class-map.js";
import f from "./navigation-rail-item.styles.js";
import "../status-indicator/status-indicator.js";
import "../peek-label/peek-label.js";
import "../icon/icon.js";
import "../loader/loader.js";
var v = Object.defineProperty, i = (p, e, l, u) => {
  for (var a = void 0, o = p.length - 1, n; o >= 0; o--)
    (n = p[o]) && (a = n(e, l, a) || a);
  return a && v(e, l, a), a;
};
const d = class d extends b {
  constructor() {
    super(...arguments), this.label = "", this.semanticLabel = "", this.icon = "", this.active = !1, this.disabled = !1, this.status = "", this.toggle = !1, this.showPeek = !0, this.peekPosition = "right", this.loading = !1, this.toggleDuration = 1500, this._hovered = !1;
  }
  _handleClick() {
    if (!(this.disabled || this.loading)) {
      if (this.toggle) {
        this._runToggle();
        return;
      }
      this.dispatchEvent(new CustomEvent("item-click", {
        bubbles: !0,
        composed: !0,
        detail: { label: this.label }
      }));
    }
  }
  _runToggle() {
    this.loading = !0;
    const e = this.active;
    this.dispatchEvent(new CustomEvent("toggle-start", {
      bubbles: !0,
      composed: !0,
      detail: { label: this.label, turning: e ? "off" : "on" }
    })), setTimeout(() => {
      this.loading = !1, this.active = !e, this.dispatchEvent(new CustomEvent("toggle-end", {
        bubbles: !0,
        composed: !0,
        detail: { label: this.label, active: this.active }
      }));
    }, this.toggleDuration);
  }
  _handleKeydown(e) {
    this.disabled || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._handleClick());
  }
  get _accessibleLabel() {
    return this.semanticLabel || this.label;
  }
  /** Whether this is a plain nav destination (not a toggle slot). */
  get _isBrandFilled() {
    return this.active && !this.toggle && !this.status;
  }
  render() {
    const e = this.disabled || this.loading, l = this._isBrandFilled && !this.loading, u = this.active ? "info" : this.status || "muted", a = !this.loading && !l && (this.toggle ? !0 : !!this.status && !this.active), o = this.toggle ? u : this.status, n = {
      "rail-item": !0,
      "rail-item--active": this.active && !l && !this.loading,
      "rail-item--brand-filled": l,
      "rail-item--disabled": this.disabled,
      "rail-item--loading": this.loading
    }, c = `rail-item__peek rail-item__peek--${this.peekPosition} ${this._hovered ? "rail-item__peek--visible" : ""}`;
    return h`
      <button
        class=${g(n)}
        part="item"
        role="button"
        aria-label=${this._accessibleLabel}
        aria-current=${this.active ? "page" : r}
        aria-disabled=${e ? "true" : r}
        tabindex=${e ? "-1" : "0"}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
        @mouseenter=${() => {
      e || (this._hovered = !0);
    }}
        @mouseleave=${() => this._hovered = !1}
      >
        <span class="rail-item__icon" aria-hidden="true">
          <asm-icon name=${this.icon}></asm-icon>
        </span>
        ${a && o ? h`
          <span class="rail-item__status" aria-hidden="true">
            <asm-status-indicator status=${o} size="small"></asm-status-indicator>
          </span>
        ` : r}
        ${this.loading ? h`
          <span class="rail-item__status" aria-hidden="true">
            <asm-loader size="16" stroke-width="2"></asm-loader>
          </span>
        ` : r}
        ${this.showPeek && this.label ? h`
          <span class=${c} aria-hidden="true">
            <asm-peek-label text=${this.label}></asm-peek-label>
          </span>
        ` : r}
      </button>
    `;
  }
};
d.styles = f;
let t = d;
i([
  s()
], t.prototype, "label");
i([
  s({ attribute: "semantic-label" })
], t.prototype, "semanticLabel");
i([
  s()
], t.prototype, "icon");
i([
  s({ type: Boolean, reflect: !0 })
], t.prototype, "active");
i([
  s({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
i([
  s()
], t.prototype, "status");
i([
  s({ type: Boolean })
], t.prototype, "toggle");
i([
  s({ type: Boolean, attribute: "show-peek" })
], t.prototype, "showPeek");
i([
  s({ attribute: "peek-position" })
], t.prototype, "peekPosition");
i([
  s({ type: Boolean, reflect: !0 })
], t.prototype, "loading");
i([
  s({ type: Number, attribute: "toggle-duration" })
], t.prototype, "toggleDuration");
i([
  m()
], t.prototype, "_hovered");
export {
  t as default
};
