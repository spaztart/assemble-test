import { LitElement as n, html as u } from "lit";
import { property as o } from "lit/decorators.js";
import { classMap as d } from "lit/directives/class-map.js";
import f from "./tooltip.styles.js";
var v = Object.defineProperty, r = (p, s, h, m) => {
  for (var t = void 0, i = p.length - 1, a; i >= 0; i--)
    (a = p[i]) && (t = a(s, h, t) || t);
  return t && v(s, h, t), t;
};
const l = class l extends n {
  constructor() {
    super(...arguments), this.message = "", this.type = "single-line", this.position = "top", this._visible = !1;
  }
  _show() {
    this._visible = !0, this.requestUpdate();
  }
  _hide() {
    this._visible = !1, this.requestUpdate();
  }
  render() {
    const s = {
      tooltip: !0,
      "tooltip--visible": this._visible,
      [`tooltip--${this.type}`]: !0,
      [`tooltip--${this.position}`]: !0
    };
    return u`
      <div
        class="tooltip-wrapper"
        @mouseenter=${this._show}
        @mouseleave=${this._hide}
        @focusin=${this._show}
        @focusout=${this._hide}
      >
        <slot></slot>
        <div class=${d(s)} part="tooltip" role="tooltip" aria-hidden=${String(!this._visible)}>
          ${this.message}
        </div>
      </div>
    `;
  }
};
l.styles = f;
let e = l;
r([
  o()
], e.prototype, "message");
r([
  o({ reflect: !0 })
], e.prototype, "type");
r([
  o({ reflect: !0 })
], e.prototype, "position");
export {
  e as default
};
