import { LitElement as c, nothing as s, html as a } from "lit";
import { property as e } from "lit/decorators.js";
import { classMap as _ } from "lit/directives/class-map.js";
import x from "./text-field.styles.js";
import "../icon/icon.js";
var f = Object.defineProperty, i = (d, l, r, p) => {
  for (var n = void 0, o = d.length - 1, u; o >= 0; o--)
    (u = d[o]) && (n = u(l, r, n) || n);
  return n && f(l, r, n), n;
};
const h = class h extends c {
  constructor() {
    super(...arguments), this.label = "", this.placeholder = "", this.value = "", this.variant = "outlined", this.supportingText = "", this.errorText = "", this.leadingIcon = "", this.trailingIcon = "", this.disabled = !1, this.readOnly = !1, this.obscureText = !1, this.maxLength = null, this.maxLines = 1, this.type = "text", this._focused = !1;
  }
  get _hasValue() {
    return this.value.length > 0;
  }
  get _isError() {
    return this.errorText.length > 0;
  }
  _handleInput(l) {
    const r = l.target;
    this.value = r.value, this.dispatchEvent(new CustomEvent("input", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleChange(l) {
    const r = l.target;
    this.value = r.value, this.dispatchEvent(new CustomEvent("change", {
      detail: { value: this.value },
      bubbles: !0,
      composed: !0
    }));
  }
  _handleFocus() {
    this._focused = !0, this.requestUpdate();
  }
  _handleBlur() {
    this._focused = !1, this.requestUpdate();
  }
  render() {
    const l = {
      "text-field": !0,
      [`text-field--${this.variant}`]: !0,
      "text-field--focused": this._focused,
      "text-field--error": this._isError,
      "text-field--disabled": this.disabled,
      "text-field--has-value": this._hasValue,
      "text-field--has-label": !!this.label,
      "text-field--has-leading-icon": !!this.leadingIcon
    }, r = this.maxLines > 1, p = this.obscureText ? "password" : this.type, n = this._isError && !this.trailingIcon;
    return a`
      <div class=${_(l)} part="field">
        <div class="text-field__container">
          ${this.variant === "filled" ? a`<div class="text-field__state-layer"></div>` : s}
          ${this.variant === "outlined" ? a`
            <fieldset class="text-field__outline" aria-hidden="true">
              <legend class="text-field__outline-notch">
                ${this.label && (this._focused || this._hasValue) ? a`<span>${this.label}</span>` : s}
              </legend>
            </fieldset>
          ` : s}
          ${this.leadingIcon ? a`<asm-icon class="text-field__leading-icon" name=${this.leadingIcon}></asm-icon>` : s}
          <div class="text-field__input-wrapper">
            ${this.label ? a`<span class="text-field__label" part="label">${this.label}</span>` : s}
            ${r ? a`
              <textarea
                class="text-field__input"
                part="input"
                .value=${this.value}
                placeholder=${this.placeholder || s}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                rows=${this.maxLines}
                maxlength=${this.maxLength ?? s}
                @input=${this._handleInput}
                @change=${this._handleChange}
                @focus=${this._handleFocus}
                @blur=${this._handleBlur}
              ></textarea>
            ` : a`
              <input
                class="text-field__input"
                part="input"
                type=${p}
                .value=${this.value}
                placeholder=${this.placeholder || s}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                maxlength=${this.maxLength ?? s}
                @input=${this._handleInput}
                @change=${this._handleChange}
                @focus=${this._handleFocus}
                @blur=${this._handleBlur}
              >
            `}
          </div>
          ${this.trailingIcon ? a`<asm-icon class="text-field__trailing-icon" name=${this.trailingIcon}></asm-icon>` : s}
          ${n ? a`<asm-icon class="text-field__error-icon" name="error"></asm-icon>` : s}
        </div>
        ${this._isError || this.supportingText ? a`
          <span class="text-field__supporting" part="supporting">
            ${this._isError ? this.errorText : this.supportingText}
          </span>
        ` : s}
      </div>
    `;
  }
};
h.styles = x;
let t = h;
i([
  e()
], t.prototype, "label");
i([
  e()
], t.prototype, "placeholder");
i([
  e()
], t.prototype, "value");
i([
  e({ reflect: !0 })
], t.prototype, "variant");
i([
  e({ attribute: "supporting-text" })
], t.prototype, "supportingText");
i([
  e({ attribute: "error-text" })
], t.prototype, "errorText");
i([
  e({ attribute: "leading-icon" })
], t.prototype, "leadingIcon");
i([
  e({ attribute: "trailing-icon" })
], t.prototype, "trailingIcon");
i([
  e({ type: Boolean, reflect: !0 })
], t.prototype, "disabled");
i([
  e({ type: Boolean, attribute: "read-only" })
], t.prototype, "readOnly");
i([
  e({ type: Boolean, attribute: "obscure-text" })
], t.prototype, "obscureText");
i([
  e({ type: Number, attribute: "max-length" })
], t.prototype, "maxLength");
i([
  e({ type: Number, attribute: "max-lines" })
], t.prototype, "maxLines");
i([
  e()
], t.prototype, "type");
export {
  t as default
};
