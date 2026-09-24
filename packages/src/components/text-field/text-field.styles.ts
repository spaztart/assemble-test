import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  :host([disabled]) {
    pointer-events: none;
    opacity: 0.38;
  }

  .text-field__container {
    display: flex;
    align-items: center;
    gap: var(--md-spacing-200, 8px);
    position: relative;
    transition: border-color 0.15s;
    height: 56px;
  }

  /* Outlined variant */
  .text-field--outlined .text-field__container {
    border: none;
    border-radius: 12px;
    padding: 0 var(--md-spacing-400, 16px);
    position: relative;
  }

  /* Fieldset notch — draws the border with a native gap for the label */
  .text-field__outline {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0 12px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    pointer-events: none;
    overflow: visible;
  }

  .text-field__outline-notch {
    height: 0;
    width: auto;
    padding: 0;
    margin: 0;
    visibility: hidden;
    max-width: 0.01px;
    transition: max-width 0.15s ease;
  }

  .text-field__outline-notch span {
    font-family: 'McAfee Sans Mono', 'Courier New', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 0 4px;
    display: inline-block;
  }

  .text-field--focused .text-field__outline-notch,
  .text-field--has-value .text-field__outline-notch {
    max-width: 100%;
  }

  .text-field--focused .text-field__outline {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  .text-field--outlined.text-field--error .text-field__outline {
    border-color: var(--md-sys-color-error);
  }

  .text-field--has-leading-icon .text-field__outline {
    padding-left: 44px;
  }

  .text-field--outlined.text-field--focused .text-field__container {
    padding: 0 var(--md-spacing-400, 16px);
  }

  /* Filled variant */
  .text-field--filled .text-field__container {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
    border-radius: 12px 12px 0 0;
    padding: 0 var(--md-spacing-400, 16px);
    position: relative;
  }

  .text-field--filled .text-field__state-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-state-neutral-hover);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .text-field--filled .text-field__container:hover .text-field__state-layer {
    opacity: 0.08;
  }

  .text-field--filled.text-field--focused .text-field__state-layer {
    opacity: 0;
  }

  .text-field--filled.text-field--focused .text-field__container {
    border-bottom: 3px solid var(--md-sys-color-on-surface);
  }

  .text-field--filled.text-field--error .text-field__container {
    border-bottom: 3px solid var(--md-sys-color-error);
  }

  /* Input wrapper */
  .text-field__input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  .text-field--has-label .text-field__input-wrapper {
    padding-top: 8px;
  }

  /* Label */
  .text-field__label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant);
    pointer-events: none;
    transition: all 0.15s ease;
    transform-origin: left top;
    background: transparent;
    padding: 0;
  }

  .text-field--focused .text-field__label,
  .text-field--has-value .text-field__label {
    top: 8px;
    transform: translateY(0);
    font-family: 'McAfee Sans Mono', 'Courier New', monospace;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--md-sys-color-on-surface-variant);
    background: transparent;
    padding: 0;
    margin-left: 0;
  }

  /* Outlined variant: label floats above border (notch handles the gap) */
  .text-field--outlined.text-field--focused .text-field__label,
  .text-field--outlined.text-field--has-value .text-field__label {
    top: 0;
    transform: translateY(-50%);
    background: transparent;
    padding: 0 4px;
    margin-left: -4px;
  }

  .text-field--filled.text-field--focused .text-field__label,
  .text-field--filled.text-field--has-value .text-field__label {
    background: transparent;
  }

  .text-field--error .text-field__label {
    color: var(--md-sys-color-error);
  }

  /* Input / Textarea */
  .text-field__input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: var(--md-sys-color-on-surface);
    padding: 0;
    resize: none;
  }

  .text-field__input::placeholder {
    color: var(--md-sys-color-on-surface-variant);
  }

  textarea.text-field__input {
    padding-top: 4px;
  }

  /* Icons */
  .text-field__leading-icon,
  .text-field__trailing-icon {
    font-size: 24px;
    color: var(--md-sys-color-on-surface-variant);
    flex-shrink: 0;
  }

  .text-field__error-icon {
    font-size: 24px;
    color: var(--md-sys-color-error);
    flex-shrink: 0;
  }

  /* Supporting / Error text */
  .text-field__supporting {
    display: block;
    padding: 4px var(--md-spacing-400, 16px) 0;
    font-family: 'McAfee Sans', system-ui, sans-serif;
    font-size: 12px;
    line-height: 1.33;
    color: var(--md-sys-color-on-surface-variant);
  }

  .text-field--error .text-field__supporting {
    color: var(--md-sys-color-error);
  }
`;
