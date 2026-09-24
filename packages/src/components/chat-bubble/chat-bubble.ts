import AsmChatBubble from './chat-bubble.component.js';

export * from './chat-bubble.component.js';
export default AsmChatBubble;

customElements.define('asm-chat-bubble', AsmChatBubble);

declare global {
  interface HTMLElementTagNameMap {
    'asm-chat-bubble': AsmChatBubble;
  }
}
