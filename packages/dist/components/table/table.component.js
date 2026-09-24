import { LitElement as _, nothing as h, html as a } from "lit";
import { property as d } from "lit/decorators.js";
import { unsafeHTML as p } from "lit/directives/unsafe-html.js";
import b from "./table.styles.js";
import "../icon/icon.js";
var m = Object.defineProperty, c = (o, t, e, $) => {
  for (var l = void 0, s = o.length - 1, n; s >= 0; s--)
    (n = o[s]) && (l = n(t, e, l) || l);
  return l && m(t, e, l), l;
};
const i = class i extends _ {
  constructor() {
    super(...arguments), this.header = null, this.rows = [], this.htmlCells = !1;
  }
  _renderCell(t) {
    return this.htmlCells ? p(t) : t;
  }
  render() {
    var t;
    return a`
      <div class="table-wrapper">
        ${(t = this.header) != null && t.headline ? a`
          <div class="table-headline">${this.header.headline}</div>
        ` : h}
        <table class="table" part="table">
          ${this.header ? a`
            <thead>
              <tr class="table__header-row" part="header">
                <th class="table__header-cell">${this.header.col1}</th>
                <th class="table__header-cell">${this.header.col2}</th>
                <th class="table__header-cell">${this.header.col3}</th>
                <th class="table__header-cell">${this.header.col4}</th>
              </tr>
            </thead>
          ` : h}
          <tbody>
            ${this.rows.map((e) => a`
              <tr class="table__row" part="row">
                <td class="table__cell">
                  ${e.leadingIcon ? a`<asm-icon class="table__cell-icon" name=${e.leadingIcon}></asm-icon>` : h}
                  ${this._renderCell(e.col1)}
                </td>
                <td class="table__cell">${this._renderCell(e.col2)}</td>
                <td class="table__cell">${this._renderCell(e.col3)}</td>
                <td class="table__cell">${this._renderCell(e.col4)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }
};
i.styles = b;
let r = i;
c([
  d({ type: Object })
], r.prototype, "header");
c([
  d({ type: Array })
], r.prototype, "rows");
c([
  d({ type: Boolean, attribute: "html-cells" })
], r.prototype, "htmlCells");
export {
  r as default
};
