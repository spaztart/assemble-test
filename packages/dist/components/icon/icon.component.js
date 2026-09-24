import { LitElement as o, html as l } from "lit";
import { property as m } from "lit/decorators.js";
import f from "./icon.styles.js";
var d = Object.defineProperty, u = (a, n, i, h) => {
  for (var r = void 0, t = a.length - 1, p; t >= 0; t--)
    (p = a[t]) && (r = p(n, i, r) || r);
  return r && d(n, i, r), r;
};
const s = class s extends o {
  constructor() {
    super(...arguments), this.name = "";
  }
  render() {
    return l`<span class="icon" part="icon" aria-hidden="true">${this.name}</span>`;
  }
};
s.styles = f;
let e = s;
u([
  m()
], e.prototype, "name");
export {
  e as default
};
