import { LitElement as u, nothing as d, html as n } from "lit";
import { property as a } from "lit/decorators.js";
import { classMap as h } from "lit/directives/class-map.js";
import m from "./snackbar.styles.js";
import "../icon/icon.js";
var b = Object.defineProperty, i = (c, e, l, _) => {
  for (var s = void 0, o = c.length - 1, p; o >= 0; o--)
    (p = c[o]) && (s = p(e, l, s) || s);
  return s && b(e, l, s), s;
};
const r = class r extends u {
  constructor() {
    super(...arguments), this.message = "", this.actionLabel = "", this.open = !1, this.duration = 0, this.leadingIcon = "";
  }
  updated(e) {
    e.has("open") && this.open && this.duration > 0 && (clearTimeout(this._dismissTimer), this._dismissTimer = setTimeout(() => this._handleClose(), this.duration));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearTimeout(this._dismissTimer);
  }
  _handleAction() {
    this.dispatchEvent(new CustomEvent("action", { bubbles: !0, composed: !0 }));
  }
  _handleClose() {
    this.open = !1, this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    const e = {
      snackbar: !0,
      "snackbar--open": this.open
    };
    return n`
      <div class=${h(e)} part="snackbar" role="status" aria-live="polite">
        ${this.leadingIcon ? n`<asm-icon class="snackbar__leading-icon" name=${this.leadingIcon}></asm-icon>` : d}
        <span class="snackbar__message" part="message">${this.message}</span>
        <div class="snackbar__actions">
          ${this.actionLabel ? n`
            <button class="snackbar__action" part="action" @click=${this._handleAction}>
              ${this.actionLabel}
            </button>
          ` : d}
          <button class="snackbar__close" part="close" aria-label="Close" @click=${this._handleClose}>
            <asm-icon name="close"></asm-icon>
          </button>
        </div>
      </div>
    `;
  }
};
r.styles = m;
let t = r;
i([
  a()
], t.prototype, "message");
i([
  a({ attribute: "action-label" })
], t.prototype, "actionLabel");
i([
  a({ type: Boolean, reflect: !0 })
], t.prototype, "open");
i([
  a({ type: Number, attribute: "duration" })
], t.prototype, "duration");
i([
  a({ attribute: "leading-icon" })
], t.prototype, "leadingIcon");
export {
  t as default
};
