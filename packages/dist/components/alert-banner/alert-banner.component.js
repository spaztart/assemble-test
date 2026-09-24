import { LitElement as h, nothing as b, html as n } from "lit";
import { property as s } from "lit/decorators.js";
import { classMap as u } from "lit/directives/class-map.js";
import m from "./alert-banner.styles.js";
import "../icon/icon.js";
var d = Object.defineProperty, o = (r, i, c, _) => {
  for (var e = void 0, a = r.length - 1, p; a >= 0; a--)
    (p = r[a]) && (e = p(i, c, e) || e);
  return e && d(i, c, e), e;
};
const l = class l extends h {
  constructor() {
    super(...arguments), this.title = "", this.mode = "neutral", this.icon = "notification_important", this.actionLabel = "", this.showClose = !0, this.closeLabel = "Dismiss";
  }
  _handleAction() {
    this.dispatchEvent(new CustomEvent("action", { bubbles: !0, composed: !0 }));
  }
  _handleClose() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    const i = {
      banner: !0,
      [`banner--${this.mode}`]: !0
    };
    return n`
      <div
        class=${u(i)}
        part="container"
        role="status"
        aria-live="polite"
        aria-label=${this.title}
      >
        <div class="banner__leading">
          <asm-icon class="banner__icon" part="icon" name=${this.icon}></asm-icon>
          <span class="banner__title" part="title">${this.title}</span>
          ${this.actionLabel ? n`
            <button
              class="banner__action"
              part="action"
              @click=${this._handleAction}
              aria-label=${this.actionLabel}
            >${this.actionLabel}</button>
          ` : b}
        </div>
        <div class="banner__trailing">
          ${this.showClose ? n`
            <button
              class="banner__close"
              part="close"
              aria-label=${this.closeLabel}
              @click=${this._handleClose}
            >
              <asm-icon name="close"></asm-icon>
            </button>
          ` : b}
        </div>
      </div>
    `;
  }
};
l.styles = m;
let t = l;
o([
  s()
], t.prototype, "title");
o([
  s({ reflect: !0 })
], t.prototype, "mode");
o([
  s()
], t.prototype, "icon");
o([
  s({ attribute: "action-label" })
], t.prototype, "actionLabel");
o([
  s({ type: Boolean, attribute: "show-close" })
], t.prototype, "showClose");
o([
  s({ attribute: "close-label" })
], t.prototype, "closeLabel");
export {
  t as default
};
