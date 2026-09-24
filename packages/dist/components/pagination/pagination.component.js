import { LitElement as m, html as c, nothing as P } from "lit";
import { property as s } from "lit/decorators.js";
import { classMap as y } from "lit/directives/class-map.js";
import v from "./pagination.styles.js";
import "../icon/icon.js";
var C = Object.defineProperty, o = (g, e, i, l) => {
  for (var t = void 0, u = g.length - 1, p; u >= 0; u--)
    (p = g[u]) && (t = p(e, i, t) || t);
  return t && C(e, i, t), t;
};
const h = class h extends m {
  constructor() {
    super(...arguments), this.pageCount = 1, this.currentPage = 1, this.siblingCount = 1, this.boundaryCount = 1, this.disabled = !1, this.ariaLabel = "Pagination";
  }
  _generateRange() {
    const e = this.pageCount, i = this.currentPage, l = this.siblingCount, t = this.boundaryCount;
    if (t * 2 + l * 2 + 1 >= e)
      return Array.from({ length: e }, (a, _) => _ + 1);
    const p = Math.max(i - l, t + 1), b = Math.min(i + l, e - t), d = p > t + 1, f = b < e - t, r = [];
    for (let a = 1; a <= t; a++)
      r.push(a);
    d && r.push("ellipsis");
    for (let a = p; a <= b; a++)
      r.push(a);
    f && r.push("ellipsis");
    for (let a = e - t + 1; a <= e; a++)
      r.push(a);
    return r;
  }
  _handlePageClick(e) {
    this.disabled || e === this.currentPage || this.dispatchEvent(new CustomEvent("page-change", {
      bubbles: !0,
      composed: !0,
      detail: { page: e }
    }));
  }
  _handlePrev() {
    this.currentPage > 1 && this._handlePageClick(this.currentPage - 1);
  }
  _handleNext() {
    this.currentPage < this.pageCount && this._handlePageClick(this.currentPage + 1);
  }
  render() {
    const e = this._generateRange();
    return c`
      <nav
        class="pagination"
        part="container"
        role="navigation"
        aria-label=${this.ariaLabel || "Pagination"}
      >
        <button
          class="pagination__nav-btn"
          part="prev"
          aria-label="Previous page"
          ?disabled=${this.disabled || this.currentPage <= 1}
          @click=${this._handlePrev}
        >
          <asm-icon name="chevron_left"></asm-icon>
        </button>

        ${e.map((i, l) => {
      if (i === "ellipsis")
        return c`<span class="pagination__ellipsis" part="ellipsis" aria-hidden="true">…</span>`;
      const t = i === this.currentPage;
      return c`
            <button
              class=${y({
        pagination__page: !0,
        "pagination__page--current": t
      })}
              part=${t ? "page-current" : "page"}
              aria-label="Page ${i}"
              aria-current=${t ? "page" : P}
              ?disabled=${this.disabled}
              @click=${() => this._handlePageClick(i)}
            >${i}</button>
          `;
    })}

        <button
          class="pagination__nav-btn"
          part="next"
          aria-label="Next page"
          ?disabled=${this.disabled || this.currentPage >= this.pageCount}
          @click=${this._handleNext}
        >
          <asm-icon name="chevron_right"></asm-icon>
        </button>
      </nav>
    `;
  }
};
h.styles = v;
let n = h;
o([
  s({ type: Number, attribute: "page-count" })
], n.prototype, "pageCount");
o([
  s({ type: Number, attribute: "current-page" })
], n.prototype, "currentPage");
o([
  s({ type: Number, attribute: "sibling-count" })
], n.prototype, "siblingCount");
o([
  s({ type: Number, attribute: "boundary-count" })
], n.prototype, "boundaryCount");
o([
  s({ type: Boolean, reflect: !0 })
], n.prototype, "disabled");
o([
  s({ attribute: "aria-label" })
], n.prototype, "ariaLabel");
export {
  n as default
};
