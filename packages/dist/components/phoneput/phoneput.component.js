import { LitElement as f, nothing as u, html as l } from "lit";
import { property as d, state as c } from "lit/decorators.js";
import { classMap as h } from "lit/directives/class-map.js";
import m from "./phoneput.styles.js";
import "../icon/icon.js";
var y = Object.defineProperty, a = (g, e, t, i) => {
  for (var s = void 0, n = g.length - 1, r; n >= 0; n--)
    (r = g[n]) && (s = r(e, t, s) || s);
  return s && y(e, t, s), s;
};
const p = [
  { name: "United States", code: "US", dialCode: "1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dialCode: "1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dialCode: "61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", dialCode: "49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "33", flag: "🇫🇷" },
  { name: "Japan", code: "JP", dialCode: "81", flag: "🇯🇵" },
  { name: "India", code: "IN", dialCode: "91", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", dialCode: "55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "52", flag: "🇲🇽" },
  { name: "Spain", code: "ES", dialCode: "34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dialCode: "39", flag: "🇮🇹" },
  { name: "Netherlands", code: "NL", dialCode: "31", flag: "🇳🇱" },
  { name: "Sweden", code: "SE", dialCode: "46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dialCode: "47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dialCode: "45", flag: "🇩🇰" },
  { name: "Switzerland", code: "CH", dialCode: "41", flag: "🇨🇭" },
  { name: "South Korea", code: "KR", dialCode: "82", flag: "🇰🇷" },
  { name: "China", code: "CN", dialCode: "86", flag: "🇨🇳" },
  { name: "Singapore", code: "SG", dialCode: "65", flag: "🇸🇬" },
  { name: "New Zealand", code: "NZ", dialCode: "64", flag: "🇳🇿" },
  { name: "Ireland", code: "IE", dialCode: "353", flag: "🇮🇪" },
  { name: "Portugal", code: "PT", dialCode: "351", flag: "🇵🇹" },
  { name: "Poland", code: "PL", dialCode: "48", flag: "🇵🇱" },
  { name: "Argentina", code: "AR", dialCode: "54", flag: "🇦🇷" }
], _ = class _ extends f {
  constructor() {
    super(...arguments), this.label = "", this.defaultCountry = "US", this.value = "", this.placeholder = "Phone number", this.errorText = "", this.supportingText = "", this.disabled = !1, this.size = "medium", this._dropdownOpen = !1, this._searchQuery = "", this._highlightIndex = 0, this._selectedCountry = p[0];
  }
  connectedCallback() {
    super.connectedCallback();
    const e = p.find((t) => t.code === this.defaultCountry);
    e && (this._selectedCountry = e), this._handleDocumentClick = this._handleDocumentClick.bind(this), document.addEventListener("click", this._handleDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("click", this._handleDocumentClick);
  }
  _handleDocumentClick(e) {
    if (!this._dropdownOpen) return;
    e.composedPath().includes(this) || (this._dropdownOpen = !1);
  }
  get _filteredCountries() {
    if (!this._searchQuery) return p;
    const e = this._searchQuery.toLowerCase();
    return p.filter(
      (t) => t.name.toLowerCase().includes(e) || t.dialCode.includes(e) || t.code.toLowerCase().includes(e)
    );
  }
  _toggleDropdown() {
    this.disabled || (this._dropdownOpen = !this._dropdownOpen, this._searchQuery = "", this._highlightIndex = 0);
  }
  _selectCountry(e) {
    this._selectedCountry = e, this._dropdownOpen = !1, this._fireChange();
  }
  _handleSearchInput(e) {
    this._searchQuery = e.target.value, this._highlightIndex = 0;
  }
  _handleSearchKeydown(e) {
    const t = this._filteredCountries;
    e.key === "ArrowDown" ? (e.preventDefault(), this._highlightIndex = Math.min(this._highlightIndex + 1, t.length - 1)) : e.key === "ArrowUp" ? (e.preventDefault(), this._highlightIndex = Math.max(this._highlightIndex - 1, 0)) : e.key === "Enter" ? (e.preventDefault(), t[this._highlightIndex] && this._selectCountry(t[this._highlightIndex])) : e.key === "Escape" && (this._dropdownOpen = !1);
  }
  _handleNumberInput(e) {
    const t = e.target, i = t.value.replace(/\D/g, "").slice(0, 15);
    t.value = i, this.value = i, this._fireChange();
  }
  _fireChange() {
    this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      composed: !0,
      detail: {
        value: this.value,
        countryCode: this._selectedCountry.code,
        dialCode: this._selectedCountry.dialCode,
        countryName: this._selectedCountry.name
      }
    }));
  }
  render() {
    const e = this._filteredCountries, t = {
      "phoneput__country-btn": !0,
      "phoneput__country-btn--open": this._dropdownOpen
    }, i = {
      phoneput__input: !0,
      "phoneput__input--error": !!this.errorText
    }, s = {
      phoneput__helper: !0,
      "phoneput__helper--error": !!this.errorText
    };
    return l`
      <div class="phoneput">
        ${this.label ? l`<label class="phoneput__label">${this.label}</label>` : u}
        <div class="phoneput__row">
          <div class="phoneput__country">
            <button class=${h(t)} @click=${this._toggleDropdown} aria-expanded=${this._dropdownOpen} aria-haspopup="listbox" type="button">
              <span class="phoneput__flag">${this._selectedCountry.flag}</span>
              <span class="phoneput__dial-code">+${this._selectedCountry.dialCode}</span>
              <asm-icon class="phoneput__chevron" name=${this._dropdownOpen ? "expand_less" : "expand_more"}></asm-icon>
            </button>
            ${this._dropdownOpen ? l`
              <div class="phoneput__dropdown">
                <div class="phoneput__search">
                  <input type="text" placeholder="Search countries..." .value=${this._searchQuery}
                    @input=${this._handleSearchInput} @keydown=${this._handleSearchKeydown}
                    aria-label="Search countries" />
                </div>
                <div class="phoneput__list" role="listbox">
                  ${e.map((n, r) => {
      const C = {
        phoneput__option: !0,
        "phoneput__option--highlighted": r === this._highlightIndex,
        "phoneput__option--selected": n.code === this._selectedCountry.code
      };
      return l`
                      <div class=${h(C)} role="option" aria-selected=${n.code === this._selectedCountry.code}
                        @click=${() => this._selectCountry(n)}>
                        <span class="phoneput__option-flag">${n.flag}</span>
                        <span class="phoneput__option-name">${n.name}</span>
                        <span class="phoneput__option-dial">+${n.dialCode}</span>
                      </div>
                    `;
    })}
                </div>
              </div>
            ` : u}
          </div>
          <div class=${h(i)}>
            <input type="tel" .value=${this.value} placeholder=${this.placeholder}
              @input=${this._handleNumberInput} ?disabled=${this.disabled}
              aria-label=${this.label || "Phone number"} inputmode="numeric" />
          </div>
        </div>
        ${this.errorText ? l`<span class=${h(s)}>${this.errorText}</span>` : this.supportingText ? l`<span class="phoneput__helper">${this.supportingText}</span>` : u}
      </div>
    `;
  }
  updated(e) {
    e.has("_dropdownOpen") && this._dropdownOpen && requestAnimationFrame(() => {
      var i;
      const t = (i = this.shadowRoot) == null ? void 0 : i.querySelector(".phoneput__search input");
      t == null || t.focus();
    });
  }
};
_.styles = m;
let o = _;
a([
  d()
], o.prototype, "label");
a([
  d({ attribute: "default-country" })
], o.prototype, "defaultCountry");
a([
  d()
], o.prototype, "value");
a([
  d()
], o.prototype, "placeholder");
a([
  d({ attribute: "error-text" })
], o.prototype, "errorText");
a([
  d({ attribute: "supporting-text" })
], o.prototype, "supportingText");
a([
  d({ type: Boolean, reflect: !0 })
], o.prototype, "disabled");
a([
  d({ reflect: !0 })
], o.prototype, "size");
a([
  c()
], o.prototype, "_dropdownOpen");
a([
  c()
], o.prototype, "_searchQuery");
a([
  c()
], o.prototype, "_highlightIndex");
a([
  c()
], o.prototype, "_selectedCountry");
export {
  o as default
};
