import { css as r } from "lit";
const a = r`
  :host {
    display: inline-block;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0px 6px;
    border-radius: 6px;
    font-family: 'McAfee Sans Mono', 'McAfee Sans', monospace;
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    white-space: nowrap;
    box-sizing: border-box;
  }

  /* Status indicator */
  .badge__indicator {
    flex-shrink: 0;
  }

  /* Icon */
  .badge__icon {
    font-size: 14px;
    flex-shrink: 0;
  }

  /* Number */
  .badge__number {
    font-weight: 700;
  }

  /* ====================================
     Primary type
     ==================================== */
  .badge--primary {
    background: var(--md-sys-color-surface);
  }
  .badge--primary.badge--high { color: var(--md-sys-color-error); }
  .badge--primary.badge--moderate { color: var(--md-sys-color-secondary); }
  .badge--primary.badge--low { color: var(--mcafee-color-extended-positive); }
  .badge--primary.badge--neutral { color: var(--md-sys-color-primary); }
  .badge--primary.badge--stat { color: var(--md-sys-color-secondary); }
  .badge--primary.badge--dismissed {
    background: var(--md-sys-color-outline-variant);
    color: var(--md-sys-color-on-background);
  }
  .badge--primary.badge--offline {
    background: var(--md-sys-color-on-surface-variant);
    color: var(--md-sys-color-surface-container-highest);
  }

  /* ====================================
     Secondary type
     ==================================== */
  .badge--secondary {
    background: transparent;
  }
  .badge--secondary.badge--high { color: var(--md-sys-color-error); }
  .badge--secondary.badge--moderate { color: var(--md-sys-color-secondary); }
  .badge--secondary.badge--low { color: var(--md-sys-color-positive, #1b873b); }
  .badge--secondary.badge--neutral { color: var(--md-sys-color-primary); }
  .badge--secondary.badge--stat {
    color: var(--md-sys-color-secondary);
    border: 1px solid var(--md-sys-color-secondary);
  }
  .badge--secondary.badge--dismissed { color: var(--md-sys-color-outline); }
  .badge--secondary.badge--offline { color: var(--md-sys-color-on-surface-variant); }

  /* ====================================
     Tertiary type
     ==================================== */
  .badge--tertiary.badge--high { background: var(--md-sys-color-error); color: var(--md-sys-color-on-error, #fff); }
  .badge--tertiary.badge--moderate { background: var(--md-sys-color-secondary); color: var(--md-sys-color-on-secondary, #fff); }
  .badge--tertiary.badge--low { background: var(--md-sys-color-positive, #1b873b); color: #fff; }
  .badge--tertiary.badge--neutral { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
  .badge--tertiary.badge--stat { background: var(--md-sys-color-secondary); color: var(--md-sys-color-on-secondary, #fff); }
  .badge--tertiary.badge--dismissed {
    background: var(--md-sys-color-outline-variant);
    color: var(--md-sys-color-outline);
  }
  .badge--tertiary.badge--offline {
    background: var(--md-sys-color-on-surface-variant);
    color: var(--md-sys-color-surface-container-highest);
  }
`;
export {
  a as default
};
