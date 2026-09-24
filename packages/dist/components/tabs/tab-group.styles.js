import { css as o } from "lit";
const s = o`
  :host {
    display: block;
  }

  .tab-group {
    display: flex;
    align-items: stretch;
    position: relative;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tab-group::-webkit-scrollbar {
    display: none;
  }
`;
export {
  s as default
};
