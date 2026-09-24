import { css } from 'lit';

export default css`
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
