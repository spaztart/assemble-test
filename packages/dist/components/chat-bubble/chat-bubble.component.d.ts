import { LitElement } from 'lit';
/**
 * @tag asm-chat-bubble
 *
 * A chat message bubble with asymmetric border radius (tail notch).
 *
 * Layout (per Figma):
 * - display: flex; align-items: center; gap: 10px
 * - padding: 10px 16px
 * - Asymmetric radius: top-left 16, top-right 4 (tail), bottom-right 16, bottom-left 16
 * - border: 1px solid secondary-fixed
 * - background: secondary-fixed
 * - text color: on-secondary-fixed
 *
 * @csspart bubble - The bubble container.
 * @csspart text - The text content (when using text property).
 *
 * @slot - Default slot for custom content (icons, images, etc.)
 */
export default class AsmChatBubble extends LitElement {
    static styles: import("lit").CSSResult;
    /** Convenience: renders a simple text message using bodyLarge typography. */
    text: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=chat-bubble.component.d.ts.map