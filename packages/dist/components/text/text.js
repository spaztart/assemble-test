import { LitElement as d, unsafeCSS as a, css as o, html as m } from "lit";
const n = [
  "display-large",
  "display-large-bold",
  "display-medium",
  "display-medium-bold",
  "display-small",
  "display-small-bold",
  "headline-large",
  "headline-large-bold",
  "headline-medium",
  "headline-medium-bold",
  "headline-small",
  "headline-small-bold",
  "title-large",
  "title-large-bold",
  "title-medium",
  "title-medium-bold",
  "title-small",
  "title-small-bold",
  "body-large",
  "body-large-bold",
  "body-medium",
  "body-medium-bold",
  "body-small",
  "body-small-bold",
  "label-large",
  "label-large-bold",
  "label-medium",
  "label-medium-bold",
  "label-small",
  "label-small-bold"
], r = {};
var l;
for (const t of n) {
  const i = `asm-${t}`, e = `--md-sys-typescale-${t}`, s = (l = class extends d {
    render() {
      return m`<slot></slot>`;
    }
  }, l.styles = o`
      :host {
        display: inline;
        font-family: var(${a(e)}-fontFamily);
        font-size: var(${a(e)}-fontSize);
        font-weight: var(${a(e)}-fontWeight);
        line-height: var(${a(e)}-lineHeight);
        letter-spacing: var(${a(e)}-letterSpacing);
        color: var(--asm-text-color, inherit);
      }
    `, l);
  customElements.define(i, s), r[i] = s;
}
export {
  r as AsmTextElements
};
