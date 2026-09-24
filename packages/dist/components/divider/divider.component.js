import { LitElement as h, html as l } from "lit";
import { property as n } from "lit/decorators.js";
import m from "./divider.styles.js";
var u = Object.defineProperty, i = (p, d, o, f) => {
  for (var t = void 0, r = p.length - 1, a; r >= 0; r--)
    (a = p[r]) && (t = a(d, o, t) || t);
  return t && u(d, o, t), t;
};
const s = class s extends h {
  constructor() {
    super(...arguments), this.thickness = 1, this.indent = 0, this.endIndent = 0;
  }
  render() {
    return l`
      <hr
        class="divider"
        part="divider"
        role="separator"
        aria-hidden="true"
        style="
          border-top-width: ${this.thickness}px;
          margin-left: ${this.indent}px;
          margin-right: ${this.endIndent}px;
        "
      >
    `;
  }
};
s.styles = m;
let e = s;
i([
  n({ type: Number })
], e.prototype, "thickness");
i([
  n({ type: Number })
], e.prototype, "indent");
i([
  n({ type: Number, attribute: "end-indent" })
], e.prototype, "endIndent");
export {
  e as default
};
