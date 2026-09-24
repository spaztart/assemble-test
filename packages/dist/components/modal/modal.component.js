import { LitElement as y, nothing as f } from "lit";
import { property as s } from "lit/decorators.js";
import u from "./modal.styles.js";
import "../icon/icon.js";
var b = Object.defineProperty, o = (m, t, l, c) => {
  for (var a = void 0, d = m.length - 1, i; d >= 0; d--)
    (i = m[d]) && (a = i(t, l, a) || a);
  return a && b(t, l, a), a;
};
const p = class p extends y {
  constructor() {
    super(...arguments), this.open = !1, this.header = "", this.body = "", this.showClose = !0, this.barrierDismiss = !0, this.gradient = !1, this.ariaLabel = null, this._overlayContainer = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._handleKeydown = this._handleKeydown.bind(this), document.addEventListener("keydown", this._handleKeydown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._handleKeydown), this._removeOverlay();
  }
  _handleKeydown(t) {
    t.key === "Escape" && this.open && this._dismiss();
  }
  _dismiss() {
    this.open = !1, this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  _handleBackdropClick(t) {
    t.target === t.currentTarget && this.barrierDismiss && this._dismiss();
  }
  _createOverlay() {
    if (!this._overlayContainer) {
      if (this._overlayContainer = document.createElement("div"), this._overlayContainer.setAttribute("class", "asm-modal-overlay"), this._overlayContainer.setAttribute("style", `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      animation: asm-modal-fade-in 0.25s ease-out;
    `), !document.getElementById("asm-modal-keyframes")) {
        const t = document.createElement("style");
        t.id = "asm-modal-keyframes", t.textContent = `
        @keyframes asm-modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes asm-modal-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `, document.head.appendChild(t);
      }
      this._overlayContainer.addEventListener("click", (t) => {
        this._handleBackdropClick(t);
      }), document.body.appendChild(this._overlayContainer), this._renderOverlayContent();
    }
  }
  _removeOverlay() {
    this._overlayContainer && (this._overlayContainer.remove(), this._overlayContainer = null);
  }
  _renderOverlayContent() {
    if (!this._overlayContainer) return;
    const t = this.gradient, l = this.header || this.body;
    let c = "";
    if (l) {
      const e = this.header ? `<h2 style="font-family:'McAfee Sans',sans-serif;font-weight:700;font-size:var(--md-sys-typescale-headline-medium-size,28px);line-height:var(--md-sys-typescale-headline-medium-line-height,36px);color:${t ? "var(--mcafee-color-extended-white,#fff)" : "var(--md-sys-color-on-surface)"};margin:0 32px 0 0;padding:0;">${this.header}</h2>` : "", h = this.body ? `<p style="font-family:'McAfee Sans',sans-serif;font-weight:400;font-size:var(--md-sys-typescale-body-large-size,16px);line-height:var(--md-sys-typescale-body-large-line-height,24px);color:${t ? "var(--mcafee-color-extended-white,#fff)" : "var(--md-sys-color-on-surface)"};margin:16px 0 0;padding:0;">${this.body}</p>` : "";
      c = e + h;
    }
    const a = this.querySelector('[slot="actions"]'), d = Array.from(this.childNodes).filter(
      (e) => !(e instanceof Element && e.getAttribute("slot"))
    ), i = document.createElement("div");
    if (i.setAttribute("role", "dialog"), i.setAttribute("aria-modal", "true"), (this.ariaLabel || this.header) && i.setAttribute("aria-label", this.ariaLabel || this.header), i.setAttribute("style", `
      position: relative;
      background: ${t ? "var(--mcafee-surface-gradient-high-energy, linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary)))" : "var(--md-sys-color-surface)"};
      border-radius: 28px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      max-width: calc(100vw - 48px);
      max-height: calc(100vh - 48px);
      overflow: auto;
      animation: asm-modal-scale-in 0.25s ease-out;
    `), i.addEventListener("click", (e) => e.stopPropagation()), this.showClose) {
      const e = document.createElement("button");
      e.setAttribute("aria-label", "Close"), e.setAttribute("style", `
        position: absolute; top: 20px; right: 20px; z-index: 1;
        display: inline-flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; border: none; background: none; padding: 8px;
        cursor: pointer; border-radius: 50%;
        color: ${t ? "var(--mcafee-color-extended-white, #fff)" : "var(--md-sys-color-on-surface)"};
        font-size: 24px;
      `), e.innerHTML = '<asm-icon name="close"></asm-icon>', e.addEventListener("click", () => this._dismiss()), i.appendChild(e);
    }
    const n = document.createElement("div");
    if (n.setAttribute("style", "padding: 24px;"), l) {
      if (n.innerHTML = c, a) {
        const e = document.createElement("div");
        e.setAttribute("style", "display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;"), e.appendChild(a.cloneNode(!0)), e.querySelectorAll("asm-button").forEach((h) => {
          h.addEventListener("click", () => this._dismiss());
        }), n.appendChild(e);
      }
    } else
      d.forEach((e) => {
        n.appendChild(e.cloneNode(!0));
      }), n.querySelectorAll("asm-button").forEach((e) => {
        e.addEventListener("click", () => this._dismiss());
      });
    i.appendChild(n), this._overlayContainer.appendChild(i);
  }
  updated(t) {
    t.has("open") && (this.open ? this._createOverlay() : this._removeOverlay());
  }
  render() {
    return f;
  }
};
p.styles = u;
let r = p;
o([
  s({ type: Boolean, reflect: !0 })
], r.prototype, "open");
o([
  s()
], r.prototype, "header");
o([
  s()
], r.prototype, "body");
o([
  s({ type: Boolean, attribute: "show-close" })
], r.prototype, "showClose");
o([
  s({ type: Boolean, attribute: "barrier-dismiss" })
], r.prototype, "barrierDismiss");
o([
  s({ type: Boolean, reflect: !0 })
], r.prototype, "gradient");
o([
  s({ attribute: "aria-label" })
], r.prototype, "ariaLabel");
export {
  r as default
};
