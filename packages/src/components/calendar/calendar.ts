import AsmCalendar from './calendar.component.js';

export * from './calendar.component.js';
export default AsmCalendar;

customElements.define('asm-calendar', AsmCalendar);

declare global {
  interface HTMLElementTagNameMap {
    'asm-calendar': AsmCalendar;
  }
}
