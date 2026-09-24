import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './phoneput.styles.js';
import '../icon/icon.js';

export type AsmPhoneputSize = 'small' | 'medium' | 'large';

interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: CountryData[] = [
  { name: 'United States', code: 'US', dialCode: '1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '33', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', dialCode: '81', flag: '🇯🇵' },
  { name: 'India', code: 'IN', dialCode: '91', flag: '🇮🇳' },
  { name: 'Brazil', code: 'BR', dialCode: '55', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', dialCode: '52', flag: '🇲🇽' },
  { name: 'Spain', code: 'ES', dialCode: '34', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', dialCode: '39', flag: '🇮🇹' },
  { name: 'Netherlands', code: 'NL', dialCode: '31', flag: '🇳🇱' },
  { name: 'Sweden', code: 'SE', dialCode: '46', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', dialCode: '47', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', dialCode: '45', flag: '🇩🇰' },
  { name: 'Switzerland', code: 'CH', dialCode: '41', flag: '🇨🇭' },
  { name: 'South Korea', code: 'KR', dialCode: '82', flag: '🇰🇷' },
  { name: 'China', code: 'CN', dialCode: '86', flag: '🇨🇳' },
  { name: 'Singapore', code: 'SG', dialCode: '65', flag: '🇸🇬' },
  { name: 'New Zealand', code: 'NZ', dialCode: '64', flag: '🇳🇿' },
  { name: 'Ireland', code: 'IE', dialCode: '353', flag: '🇮🇪' },
  { name: 'Portugal', code: 'PT', dialCode: '351', flag: '🇵🇹' },
  { name: 'Poland', code: 'PL', dialCode: '48', flag: '🇵🇱' },
  { name: 'Argentina', code: 'AR', dialCode: '54', flag: '🇦🇷' },
];

/**
 * @tag asm-phoneput
 *
 * A phone number input with searchable country code dropdown.
 *
 * @fires change - Fired when the phone value changes. detail: { value, countryCode, dialCode, countryName }
 */
export default class AsmPhoneput extends LitElement {
  static styles = styles;

  /** Label above the input. */
  @property() label = '';

  /** Default country ISO code. */
  @property({ attribute: 'default-country' }) defaultCountry = 'US';

  /** Phone number value (digits only). */
  @property() value = '';

  /** Placeholder for the number field. */
  @property() placeholder = 'Phone number';

  /** Error text shown below. */
  @property({ attribute: 'error-text' }) errorText = '';

  /** Supporting/helper text. */
  @property({ attribute: 'supporting-text' }) supportingText = '';

  /** Whether the input is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Size variant. */
  @property({ reflect: true }) size: AsmPhoneputSize = 'medium';

  @state() private _dropdownOpen = false;
  @state() private _searchQuery = '';
  @state() private _highlightIndex = 0;
  @state() private _selectedCountry: CountryData = COUNTRIES[0];

  connectedCallback() {
    super.connectedCallback();
    const found = COUNTRIES.find(c => c.code === this.defaultCountry);
    if (found) this._selectedCountry = found;
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    document.addEventListener('click', this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleDocumentClick);
  }

  private _handleDocumentClick(e: Event) {
    if (!this._dropdownOpen) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._dropdownOpen = false;
    }
  }

  private get _filteredCountries(): CountryData[] {
    if (!this._searchQuery) return COUNTRIES;
    const q = this._searchQuery.toLowerCase();
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }

  private _toggleDropdown() {
    if (this.disabled) return;
    this._dropdownOpen = !this._dropdownOpen;
    this._searchQuery = '';
    this._highlightIndex = 0;
  }

  private _selectCountry(country: CountryData) {
    this._selectedCountry = country;
    this._dropdownOpen = false;
    this._fireChange();
  }

  private _handleSearchInput(e: Event) {
    this._searchQuery = (e.target as HTMLInputElement).value;
    this._highlightIndex = 0;
  }

  private _handleSearchKeydown(e: KeyboardEvent) {
    const filtered = this._filteredCountries;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._highlightIndex = Math.min(this._highlightIndex + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._highlightIndex = Math.max(this._highlightIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[this._highlightIndex]) {
        this._selectCountry(filtered[this._highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      this._dropdownOpen = false;
    }
  }

  private _handleNumberInput(e: Event) {
    const input = e.target as HTMLInputElement;
    // Digits only, max 15
    const digits = input.value.replace(/\D/g, '').slice(0, 15);
    input.value = digits;
    this.value = digits;
    this._fireChange();
  }

  private _fireChange() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        countryCode: this._selectedCountry.code,
        dialCode: this._selectedCountry.dialCode,
        countryName: this._selectedCountry.name,
      },
    }));
  }

  render() {
    const filtered = this._filteredCountries;
    const btnClasses = {
      'phoneput__country-btn': true,
      'phoneput__country-btn--open': this._dropdownOpen,
    };
    const inputClasses = {
      'phoneput__input': true,
      'phoneput__input--error': !!this.errorText,
    };
    const helperClasses = {
      'phoneput__helper': true,
      'phoneput__helper--error': !!this.errorText,
    };

    return html`
      <div class="phoneput">
        ${this.label ? html`<label class="phoneput__label">${this.label}</label>` : nothing}
        <div class="phoneput__row">
          <div class="phoneput__country">
            <button class=${classMap(btnClasses)} @click=${this._toggleDropdown} aria-expanded=${this._dropdownOpen} aria-haspopup="listbox" type="button">
              <span class="phoneput__flag">${this._selectedCountry.flag}</span>
              <span class="phoneput__dial-code">+${this._selectedCountry.dialCode}</span>
              <asm-icon class="phoneput__chevron" name=${this._dropdownOpen ? 'expand_less' : 'expand_more'}></asm-icon>
            </button>
            ${this._dropdownOpen ? html`
              <div class="phoneput__dropdown">
                <div class="phoneput__search">
                  <input type="text" placeholder="Search countries..." .value=${this._searchQuery}
                    @input=${this._handleSearchInput} @keydown=${this._handleSearchKeydown}
                    aria-label="Search countries" />
                </div>
                <div class="phoneput__list" role="listbox">
                  ${filtered.map((country, i) => {
                    const optClasses = {
                      'phoneput__option': true,
                      'phoneput__option--highlighted': i === this._highlightIndex,
                      'phoneput__option--selected': country.code === this._selectedCountry.code,
                    };
                    return html`
                      <div class=${classMap(optClasses)} role="option" aria-selected=${country.code === this._selectedCountry.code}
                        @click=${() => this._selectCountry(country)}>
                        <span class="phoneput__option-flag">${country.flag}</span>
                        <span class="phoneput__option-name">${country.name}</span>
                        <span class="phoneput__option-dial">+${country.dialCode}</span>
                      </div>
                    `;
                  })}
                </div>
              </div>
            ` : nothing}
          </div>
          <div class=${classMap(inputClasses)}>
            <input type="tel" .value=${this.value} placeholder=${this.placeholder}
              @input=${this._handleNumberInput} ?disabled=${this.disabled}
              aria-label=${this.label || 'Phone number'} inputmode="numeric" />
          </div>
        </div>
        ${this.errorText ? html`<span class=${classMap(helperClasses)}>${this.errorText}</span>` :
          this.supportingText ? html`<span class="phoneput__helper">${this.supportingText}</span>` : nothing}
      </div>
    `;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('_dropdownOpen') && this._dropdownOpen) {
      // Focus search input when dropdown opens
      requestAnimationFrame(() => {
        const input = this.shadowRoot?.querySelector('.phoneput__search input') as HTMLInputElement;
        input?.focus();
      });
    }
  }
}
