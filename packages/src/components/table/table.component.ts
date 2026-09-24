import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './table.styles.js';
import '../icon/icon.js';

export interface AsmTableHeader {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  headline?: string;
}

export interface AsmTableRowData {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  leadingIcon?: string;
}

/**
 * @tag asm-table
 *
 * @csspart table - The table element.
 * @csspart header - The header row.
 * @csspart row - A body row.
 */
export default class AsmTable extends LitElement {
  static styles = styles;

  /** Table header configuration (JSON string or object). */
  @property({ type: Object }) header: AsmTableHeader | null = null;

  /** Table rows (JSON string or array). */
  @property({ type: Array }) rows: AsmTableRowData[] = [];

  /** When true, cell values are rendered as HTML (supports web components in cells). */
  @property({ type: Boolean, attribute: 'html-cells' }) htmlCells = false;

  private _renderCell(value: string) {
    return this.htmlCells ? unsafeHTML(value) : value;
  }

  render() {
    return html`
      <div class="table-wrapper">
        ${this.header?.headline ? html`
          <div class="table-headline">${this.header.headline}</div>
        ` : nothing}
        <table class="table" part="table">
          ${this.header ? html`
            <thead>
              <tr class="table__header-row" part="header">
                <th class="table__header-cell">${this.header.col1}</th>
                <th class="table__header-cell">${this.header.col2}</th>
                <th class="table__header-cell">${this.header.col3}</th>
                <th class="table__header-cell">${this.header.col4}</th>
              </tr>
            </thead>
          ` : nothing}
          <tbody>
            ${this.rows.map(row => html`
              <tr class="table__row" part="row">
                <td class="table__cell">
                  ${row.leadingIcon ? html`<asm-icon class="table__cell-icon" name=${row.leadingIcon}></asm-icon>` : nothing}
                  ${this._renderCell(row.col1)}
                </td>
                <td class="table__cell">${this._renderCell(row.col2)}</td>
                <td class="table__cell">${this._renderCell(row.col3)}</td>
                <td class="table__cell">${this._renderCell(row.col4)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }
}
