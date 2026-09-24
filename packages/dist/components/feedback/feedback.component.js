import { LitElement as m, nothing as d, html as b } from "lit";
import { property as o } from "lit/decorators.js";
import { classMap as i } from "lit/directives/class-map.js";
import p from "./feedback.styles.js";
import "../icon/icon.js";
var c = Object.defineProperty, r = (n, e, s, v) => {
  for (var t = void 0, a = n.length - 1, h; a >= 0; a--)
    (h = n[a]) && (t = h(e, s, t) || t);
  return t && c(e, s, t), t;
};
const l = class l extends m {
  constructor() {
    super(...arguments), this.label = "", this.value = null;
  }
  _handleThumbsUp() {
    this.value = this.value === "thumbs-up" ? null : "thumbs-up", this.dispatchEvent(new CustomEvent("thumbs-up", { bubbles: !0, composed: !0, detail: { value: this.value } }));
  }
  _handleThumbsDown() {
    this.value = this.value === "thumbs-down" ? null : "thumbs-down", this.dispatchEvent(new CustomEvent("thumbs-down", { bubbles: !0, composed: !0, detail: { value: this.value } }));
  }
  render() {
    const e = {
      feedback__btn: !0,
      "feedback__btn--selected": this.value === "thumbs-up"
    }, s = {
      feedback__btn: !0,
      "feedback__btn--selected": this.value === "thumbs-down"
    };
    return b`
      <div class="feedback">
        ${this.label ? b`<span class="feedback__label">${this.label}</span>` : d}
        <div class="feedback__buttons">
          <button class=${i(e)} aria-label="Thumbs up" aria-pressed=${this.value === "thumbs-up"} @click=${this._handleThumbsUp}>
            <asm-icon name=${this.value === "thumbs-up" ? "thumb_up" : "thumb_up_off_alt"}></asm-icon>
          </button>
          <button class=${i(s)} aria-label="Thumbs down" aria-pressed=${this.value === "thumbs-down"} @click=${this._handleThumbsDown}>
            <asm-icon name=${this.value === "thumbs-down" ? "thumb_down" : "thumb_down_off_alt"}></asm-icon>
          </button>
        </div>
      </div>
    `;
  }
};
l.styles = p;
let u = l;
r([
  o()
], u.prototype, "label");
r([
  o({ reflect: !0 })
], u.prototype, "value");
export {
  u as default
};
