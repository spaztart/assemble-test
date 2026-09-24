import { LitElement } from 'lit';
import '../icon/icon.js';
export type AsmPhoneputSize = 'small' | 'medium' | 'large';
/**
 * @tag asm-phoneput
 *
 * A phone number input with searchable country code dropdown.
 *
 * @fires change - Fired when the phone value changes. detail: { value, countryCode, dialCode, countryName }
 */
export default class AsmPhoneput extends LitElement {
    static styles: import("lit").CSSResult;
    /** Label above the input. */
    label: string;
    /** Default country ISO code. */
    defaultCountry: string;
    /** Phone number value (digits only). */
    value: string;
    /** Placeholder for the number field. */
    placeholder: string;
    /** Error text shown below. */
    errorText: string;
    /** Supporting/helper text. */
    supportingText: string;
    /** Whether the input is disabled. */
    disabled: boolean;
    /** Size variant. */
    size: AsmPhoneputSize;
    private _dropdownOpen;
    private _searchQuery;
    private _highlightIndex;
    private _selectedCountry;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleDocumentClick;
    private get _filteredCountries();
    private _toggleDropdown;
    private _selectCountry;
    private _handleSearchInput;
    private _handleSearchKeydown;
    private _handleNumberInput;
    private _fireChange;
    render(): import("lit-html").TemplateResult<1>;
    updated(changed: Map<string, unknown>): void;
}
//# sourceMappingURL=phoneput.component.d.ts.map