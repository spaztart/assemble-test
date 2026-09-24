import { LitElement as f, nothing as p, html as n } from "lit";
import { property as o } from "lit/decorators.js";
import { classMap as g } from "lit/directives/class-map.js";
import y from "./toggle-group.styles.js";
import "../icon/icon.js";
var v = Object.defineProperty, c = (h, e, r, s) => {
  for (var t = void 0, l = h.length - 1, a; l >= 0; l--)
    (a = h[l]) && (t = a(e, r, t) || t);
  return t && v(e, r, t), t;
};
const d = class d extends f {
  constructor() {
    super(...arguments), this.size = "medium", this.variant = "page", this.selectedIndex = 0, this.disabled = !1;
  }
  _handleSelect(e) {
    this.disabled || e === this.selectedIndex || (this.selectedIndex = e, this.dispatchEvent(new CustomEvent("change", {
      detail: { index: e },
      bubbles: !0,
      composed: !0
    })));
  }
  _handleKeyDown(e, r) {
    var l;
    const s = this.querySelectorAll("asm-toggle-item");
    let t = -1;
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault(), t = (r + 1) % s.length;
        break;
      case "ArrowLeft":
        e.preventDefault(), t = (r - 1 + s.length) % s.length;
        break;
      case "Home":
        e.preventDefault(), t = 0;
        break;
      case "End":
        e.preventDefault(), t = s.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault(), this._handleSelect(r);
        return;
    }
    if (t >= 0) {
      this._handleSelect(t);
      const a = (l = this.shadowRoot) == null ? void 0 : l.querySelectorAll('[role="tab"]')[t];
      a == null || a.focus();
    }
  }
  updated(e) {
    e.has("selectedIndex") && this._syncItems();
  }
  firstUpdated() {
    this._syncItems();
  }
  connectedCallback() {
    super.connectedCallback(), this._observer = new MutationObserver(() => this._syncItems()), this._observer.observe(this, { childList: !0 });
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._observer) == null || e.disconnect();
  }
  _syncItems() {
    Array.from(this.querySelectorAll("asm-toggle-item")).forEach((r, s) => {
      r.toggleAttribute("active", s === this.selectedIndex);
    });
  }
  render() {
    const e = Array.from(this.querySelectorAll("asm-toggle-item")), r = {
      "toggle-group": !0,
      [`toggle-group--${this.variant}`]: !0,
      [`toggle-group--${this.size}`]: !0,
      "toggle-group--disabled": this.disabled
    };
    return n`
      <div class=${g(r)} part="group" role="tablist">
        ${e.map((s, t) => {
      const l = t === this.selectedIndex, a = s.getAttribute("label") || "", u = s.getAttribute("start-icon") || "", m = s.getAttribute("end-icon") || "";
      return n`
            <div
              class=${g({
        "toggle-item": !0,
        "toggle-item--selected": l
      })}
              role="tab"
              tabindex=${l ? 0 : -1}
              aria-selected=${String(l)}
              @click=${() => this._handleSelect(t)}
              @keydown=${(b) => this._handleKeyDown(b, t)}
            >
              <span class="toggle-item__state-layer"></span>
              ${u ? n`<asm-icon class="toggle-item__icon" name=${u}></asm-icon>` : p}
              <span class="toggle-item__label">${a}</span>
              ${m ? n`<asm-icon class="toggle-item__icon" name=${m}></asm-icon>` : p}
            </div>
          `;
    })}
      </div>
      <slot style="display:none" @slotchange=${() => this.requestUpdate()}></slot>
    `;
  }
};
d.styles = y;
let i = d;
c([
  o({ reflect: !0 })
], i.prototype, "size");
c([
  o({ reflect: !0 })
], i.prototype, "variant");
c([
  o({ type: Number, attribute: "selected-index", reflect: !0 })
], i.prototype, "selectedIndex");
c([
  o({ type: Boolean, reflect: !0 })
], i.prototype, "disabled");
export {
  i as default
};
