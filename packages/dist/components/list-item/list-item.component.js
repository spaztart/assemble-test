import { LitElement as m, nothing as n, html as l } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as u } from "lit/directives/class-map.js";
import _ from "./list-item.styles.js";
import "../icon/icon.js";
import "../status-indicator/status-indicator.js";
import "../status-notification/status-notification.js";
var v = Object.defineProperty, i = (p, s, r, h) => {
  for (var a = void 0, o = p.length - 1, c; o >= 0; o--)
    (c = p[o]) && (a = c(s, r, a) || a);
  return a && v(s, r, a), a;
};
const d = class d extends m {
  constructor() {
    super(...arguments), this.title = "", this.overline = "", this.supportingText = "", this.kind = "interactive", this.state = "default", this.badgeCount = 0, this.showTrailingIcon = !0, this.expanded = !1, this.disabled = !1, this.ariaLabel = null;
  }
  _handleClick() {
    this.disabled || this.kind === "read-only" || this.dispatchEvent(new CustomEvent("press", { bubbles: !0, composed: !0 }));
  }
  _handleKeydown(s) {
    this.disabled || this.kind === "read-only" || (s.key === "Enter" || s.key === " ") && (s.preventDefault(), this._handleClick());
  }
  render() {
    const s = this.kind === "interactive" && !this.disabled, r = {
      "list-item": !0,
      "list-item--expanded": this.expanded
    }, h = {
      "list-item__trailing": !0,
      "list-item__trailing--expanded": this.expanded
    };
    return l`
      <div
        class=${u(r)}
        role=${this.kind === "interactive" ? "button" : "region"}
        tabindex=${s ? "0" : "-1"}
        aria-label=${this.ariaLabel || this.title}
        aria-disabled=${this.disabled}
        aria-expanded=${this.expanded ? "true" : n}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <div class="list-item__leading">
          <slot name="leading"></slot>
          ${this.state === "badge" && this.badgeCount > 0 ? l`
            <span class="list-item__badge-slot">
              <asm-status-notification status="critical" count=${this.badgeCount}></asm-status-notification>
            </span>
          ` : n}
        </div>

        <div class="list-item__content">
          ${this.overline ? l`<span class="list-item__overline">${this.overline}</span>` : n}
          <div class="list-item__title-row">
            <span class="list-item__title">${this.title}</span>
            ${this.state === "unread" ? l`
              <span class="list-item__unread-dot"></span>
            ` : n}
          </div>
          ${this.supportingText ? l`<span class="list-item__supporting">${this.supportingText}</span>` : n}
        </div>

        <div class="list-item__right">
          <slot></slot>
        </div>

        ${this.kind === "interactive" && this.showTrailingIcon ? l`
          <div class=${u(h)}>
            <slot name="trailing">
              <asm-icon name="chevron_right"></asm-icon>
            </slot>
          </div>
        ` : n}
      </div>

      <div class="list-item__expanded ${this.expanded ? "list-item__expanded--open" : ""}">
        <div class="list-item__expanded-inner">
          <slot name="expanded"></slot>
        </div>
      </div>
    `;
  }
};
d.styles = _;
let t = d;
i([
  e()
], t.prototype, "title");
i([
  e()
], t.prototype, "overline");
i([
  e({ attribute: "supporting-text" })
], t.prototype, "supportingText");
i([
  e({ reflect: !0 })
], t.prototype, "kind");
i([
  e({ reflect: !0 })
], t.prototype, "state");
i([
  e({ type: Number, attribute: "badge-count" })
], t.prototype, "badgeCount");
i([
  e({ type: Boolean, attribute: "show-trailing-icon" })
], t.prototype, "showTrailingIcon");
i([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "expanded");
i([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
i([
  e({ attribute: "aria-label" })
], t.prototype, "ariaLabel");
export {
  t as default
};
