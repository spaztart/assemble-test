import { LitElement as c, html as d } from "lit";
import { property as b } from "lit/decorators.js";
import u from "./tab-group.styles.js";
import "./tab.js";
var h = Object.defineProperty, p = (o, r, a, i) => {
  for (var t = void 0, e = o.length - 1, s; e >= 0; e--)
    (s = o[e]) && (t = s(r, a, t) || t);
  return t && h(r, a, t), t;
};
const l = class l extends c {
  constructor() {
    super(...arguments), this.variant = "text", this._handleTabSelect = (r) => {
      const a = r.composedPath().find(
        (e) => e instanceof HTMLElement && e.tagName === "ASM-TAB"
      );
      if (!a) return;
      const i = this._getTabs(), t = i.indexOf(a);
      i.forEach((e, s) => {
        e.setAttribute("active", String(s === t)), s === t ? e.setAttribute("active", "") : e.removeAttribute("active");
      }), this.dispatchEvent(new CustomEvent("tab-change", {
        bubbles: !0,
        composed: !0,
        detail: { index: t }
      }));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tablist"), this.addEventListener("tab-select", this._handleTabSelect);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("tab-select", this._handleTabSelect);
  }
  _getTabs() {
    return Array.from(this.querySelectorAll("asm-tab"));
  }
  updated() {
    const r = this.variant;
    this._getTabs().forEach((a) => {
      a.setAttribute("layout", r);
    });
  }
  render() {
    return d`
      <div class="tab-group" part="tab-group">
        <slot></slot>
      </div>
    `;
  }
};
l.styles = u;
let n = l;
p([
  b({ reflect: !0 })
], n.prototype, "variant");
export {
  n as default
};
