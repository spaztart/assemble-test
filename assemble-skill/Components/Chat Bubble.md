# Component: Chat Bubble

> Role: A single message in a conversation. Carries one person's utterance; never a system notice.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A chat bubble is a container, not a conversation. Sender attribution, ordering, timestamps, and grouping are the conversation view's job.
> Source: Figma `Components` → `Chat Bubble` (node `7902-15808`). Implementation: `pegasus_flutter/lib/asm/components/chat_bubble.dart`.

## Overview

A chat bubble is a rounded container holding one message. It sizes to its content and carries a notched corner that reads as the bubble's tail.

**It is deliberately minimal.** The bubble knows nothing about who sent the message, when, or what came before it. It has no variants, no states, and no interaction — it is a shape with a fill and a text style. Everything that makes a conversation a conversation lives in the view that arranges the bubbles.

This matters because the component looks like it does more than it does. There is currently **one appearance**, so a bubble cannot visually distinguish sender from recipient on its own — see [One appearance, and what that means](#one-appearance-and-what-that-means).

Use it for conversational message content: chat with support, an assistant exchange, a message thread. Do not use it for system messages, status, or anything that isn't something a participant said — those are [[Alert Banner]], [[Snackbar]], or [[Status Indicators]].

## Anatomy

```
     ╭──────────────────────────────╮╮        ← top-right corner is notched (4px)
     │                              ││
     │   Message text               ││
     │                              ││
     ╰──────────────────────────────╯╯
      ↑                            ↑
   16px horizontal padding    10px vertical

  Corners: top-left 16 · top-right 4 · bottom-right 16 · bottom-left 16
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | Asymmetric radius. Fill and border are the same color, so the edge reads flat. |
| **Content** | **Yes** | Either a text string or composed children. Never empty. |
| **Tail** | — | Not a separate part — it's the notched top-right corner. |

**The tail is a corner, not an appendage.** Three corners are 16px and the top-right is 4px; that asymmetry is the entire tail treatment. There is no drawn point or triangle.

The border is drawn in the same color as the fill, which adds 1px to the bubble's overall size while keeping the edge visually flat. It is a sizing detail, not a visible outline.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Horizontal padding | 16 | — see [Open Items](#open-items) |
| Vertical padding | 10 | — see [Open Items](#open-items) |
| Corner radius (3 corners) | 16 | `cornerLarge` |
| Corner radius (top-right) | 4 | `cornerSmall` |
| Gap between children | 10 | — see [Open Items](#open-items) |
| Fill | `secondary-fixed` | |
| Content color | `on-secondary-fixed` | |
| Text style | 16 regular | `body.large` |
| Border | 1px, same color as fill | |

The fill uses the **fixed** color roles, which do not change between light and dark themes. That is intentional for a chat surface — bubbles stay the same tint in both modes — but it means the bubble does not respond to theme the way most components do. Under an active high-contrast theme it switches to the secondary-container pair so it honors the user's palette.

## One appearance, and what that means

There is one bubble appearance. The notch is always top-right, the fill is always `secondary-fixed`, and there is no parameter to change either.

**So the bubble cannot distinguish sender from recipient.** In a two-party conversation, both sides render identically. Distinguishing them is the conversation view's responsibility, and it has two tools:

- **Alignment** — the sender's messages aligned to one edge, the recipient's to the other. This is the primary signal and the conventional one.
- **Labelling** — an explicit name or avatar beside or above each bubble.

Alignment alone is a **visual** signal only. Screen-reader users get nothing from it, which makes the accessibility requirement below non-optional: every bubble needs its sender attributed in a way assistive technology can reach. See [Accessibility](#accessibility).

This is a genuine gap rather than a design position — the notched corner is described in the implementation as identifying the sender, which only works if there is a mirrored variant with the notch on the other side. There isn't one. Flagged in [Open Items](#open-items).

## Behaviors

**The bubble sizes to its content.** It has no fixed or minimum width and no maximum. A long message produces a very wide bubble unless the conversation view constrains it — **which the view must do.** The conventional constraint is a maximum of roughly 70–80% of the conversation's width, so bubbles never span edge to edge and the alignment signal stays readable.

**Text wraps and never truncates.** With a bounded width, a long message becomes a tall bubble. Nothing is clipped, and nothing is ellipsized — correct for a message, which must always be fully readable.

**Content is either a string or composed children, never both.** Passing a plain string gets body text in the correct color. Passing children lays them out horizontally with a 10px gap, and each child is responsible for its own styling.

**Composed children are laid out in a single horizontal row**, centered vertically. This is worth knowing before reaching for it: an icon beside a short label works well, but a vertical stack (an image above a caption) needs its own layout widget as a single child, because the bubble will not stack for you.

**There is no interaction.** No hover, no press, no focus, no selection, no long-press menu. A bubble is not interactive, so it has no states. If a message needs to be actionable — copy, retry, react — that affordance belongs to the conversation view, and adding it around a bubble makes the bubble's content the label of the new control.

**No motion.** Bubbles appear instantly. Entry animation, if wanted, belongs to the list that adds them.

## Content

**One bubble is one message.** Don't concatenate several messages into one bubble to save space; the visual grouping is what conveys turn-taking.

- Text is never empty. Enforced.
- Message content is the user's or the assistant's words — don't inject UI copy, labels, or status into a bubble.
- Timestamps, read receipts, and sender names go **outside** the bubble. Putting a timestamp inside makes it part of the message text for a screen reader.
- Long messages are fine. Bubbles grow.

**Never put a system message in a bubble.** "Connection lost" is not something a participant said. Use the component that matches its meaning — [[Alert Banner]] for a persistent condition, [[Snackbar]] for a transient one.

## Decision Tree

```
Is this content something a PARTICIPANT said in a conversation?
├── no — it's a system notice, status, or app copy
│   ├── persistent condition ────────────→ [[Alert Banner]]
│   ├── transient confirmation ──────────→ [[Snackbar]]
│   ├── a state or health indicator ─────→ [[Status Indicators]]
│   └── ordinary page content ───────────→ plain text, no bubble
│
└── yes — it's a message in a conversation
    └── CHAT BUBBLE
        │
        │  Then the CONVERSATION VIEW must supply:
        ├── a width constraint (~70–80% max) ──── bubbles don't self-limit
        ├── alignment per sender ──────────────── the visual sender signal
        ├── sender attribution for assistive tech  the non-visual signal
        ├── timestamps / receipts, outside the bubble
        └── entry animation, if any
```

## Accessibility

The bubble contributes almost nothing to accessibility on its own, which makes the conversation view's obligations the substance of this section.

| Requirement | Where it's handled |
| --- | --- |
| **Message text is readable** | The bubble. Text is real text, announced normally. |
| **Contrast** | The bubble. `on-secondary-fixed` on `secondary-fixed`. |
| **High contrast support** | The bubble. Switches to the secondary-container pair. |
| **Sender attribution** | **The conversation view.** Not provided by the bubble. |
| **Message order and grouping** | **The conversation view.** |
| **Timestamps** | **The conversation view**, outside the bubble. |
| **New-message announcement** | **The conversation view**, via a live region. |
| **Keyboard access to actions** | **The conversation view.** The bubble has no controls. |

**Sender attribution is the requirement most likely to be missed.** Alignment is invisible to a screen reader, and because both sides of a conversation render identically, a user navigating by voice hears a sequence of messages with no indication of who said what. The conversation view must attribute each message — a semantic label like "Support said: …", or a visible name that reads before the bubble.

**A bubble has no accessible name of its own** beyond the text it contains. There is no semantics wrapper, no role, and no automation identifier, so a bubble cannot be targeted by UI automation without the surrounding view providing a handle. See [Open Items](#open-items).

**Announce new messages politely.** An arriving message should be announced without stealing focus. That's a live region on the conversation list, not on the bubble.

## Anti-Patterns

**❌ Relying on the bubble to show who sent the message.** There's one appearance — both sides look identical. → The conversation view aligns and attributes.

**❌ Relying on alignment alone for sender.** Invisible to screen readers. → Attribute each message semantically as well.

**❌ An unconstrained bubble width.** With no max width a long message spans the full region and the alignment signal disappears. → Constrain to ~70–80% in the conversation view.

**❌ A system message in a bubble.** → [[Alert Banner]] or [[Snackbar]].

**❌ A timestamp or read receipt inside the bubble.** It becomes part of the message for assistive tech. → Outside.

**❌ Several messages concatenated into one bubble.** → One bubble per message.

**❌ Wrapping a bubble in a tap handler.** Makes the message text the label of a control the user didn't ask for. → Put message actions in the conversation view.

**❌ Passing a vertical stack as `children`.** They're laid out in one horizontal row. → Pass a single child that does its own stacking.

**❌ Overriding the fill to distinguish senders.** There's no parameter for it, and forcing it bypasses the high-contrast handling. → Use alignment and attribution until a variant exists.

**❌ Truncating message text.** → Messages must be fully readable. Let the bubble grow.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmChatBubble`, from `pegasus_flutter/lib/asm/components/chat_bubble.dart`.

`AsmChatBubble` is stateless and takes no variant, size, or state parameters. It has **exactly two**, and they are mutually exclusive.

### Basic usage

```dart
AsmChatBubble(text: 'How can I help you today?');
```

`text` renders with the correct body style and content color. This is the common case.

### Composed content

```dart
AsmChatBubble(
  children: [
    const Icon(Icons.attach_file, size: 20),
    const Text('scan-report.pdf'),
  ],
);
```

`children` are laid out in a horizontal row with a 10px gap, centered vertically. **You own their styling** — the automatic body style and content color apply only to `text`. To match the bubble's own type, read it from the typography tokens and use the on-secondary-fixed content color.

`text` and `children` are mutually exclusive, and exactly one is required — both asserts fire in debug.

### In a conversation view

The bubble supplies none of this, so this is the part that matters:

```dart
ListView.builder(
  itemCount: messages.length,
  itemBuilder: (context, i) {
    final message = messages[i];
    final isMine = message.senderId == currentUserId;

    return Semantics(
      // Sender attribution — alignment alone is invisible to screen readers.
      label: '${message.senderName} said: ${message.body}',
      excludeSemantics: true,
      child: Align(
        alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
        child: ConstrainedBox(
          // Bubbles do not self-limit; the view must constrain them.
          constraints: BoxConstraints(
            maxWidth: MediaQuery.sizeOf(context).width * 0.75,
          ),
          child: AsmChatBubble(text: message.body),
        ),
      ),
    );
  },
);
```

Three things this does that the bubble cannot: constrains the width, aligns by sender, and attributes the sender for assistive technology.

`excludeSemantics: true` is what prevents the message text being announced twice — once as the wrapper's label and again as the bubble's own text.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `text` | `String?` | One of the two | `null` |
| `children` | `List<Widget>?` | One of the two | `null` |

There is no `variant`, `size`, `sender`, `alignment`, `automationIdentifier`, or state parameter.

### Guidance

- **Constrain the width at the call site.** `ConstrainedBox` or a `maxWidth` — the bubble has no maximum of its own.
- **Align at the call site**, and attribute the sender semantically alongside it.
- **Style your own `children`.** Only `text` gets the body style and content color automatically.
- **Pass a single child if you need vertical layout** — `children` is a horizontal row only.
- **Don't wrap a bubble in `GestureDetector` or `InkWell`.** It creates a tap target whose label is the message text.
- **Don't override the fill.** There's no parameter, and reaching around it bypasses the high-contrast path.
- **Use a live region on the conversation list**, not on individual bubbles, to announce arriving messages.
- The bubble takes no `automationIdentifier` — if UI automation needs to target messages, the surrounding view must provide the handle.

---

## Rules

1. A chat bubble holds ONE message from ONE participant. NEVER concatenate messages.
2. NEVER put a system message, status, or app copy in a bubble.
3. The conversation view MUST constrain bubble width — bubbles do not self-limit.
4. The conversation view MUST align bubbles by sender.
5. The conversation view MUST attribute the sender to assistive technology. Alignment alone is NOT sufficient.
6. Timestamps, read receipts, and sender names MUST sit OUTSIDE the bubble.
7. Pass EITHER text OR composed children, NEVER both.
8. Composed children are laid out HORIZONTALLY. Vertical layout MUST come from a single composed child.
9. When passing composed children, the caller MUST style them to match the bubble's type and content color.
10. NEVER wrap a bubble in a tap handler — message actions belong to the conversation view.
11. NEVER override the fill to distinguish senders; it bypasses high-contrast handling.
12. Message text MUST NEVER be truncated.
13. New messages MUST be announced via a live region on the conversation list, not per bubble.

---

## Open Items

1. **There is no sender variant, which contradicts the component's own stated intent.** The implementation describes the notched corner as reading like a tail that "identifies the sender", but the notch is hard-coded to the top-right and there is no mirrored form, no second fill, and no sender parameter. As shipped, both sides of a conversation are identical and the tail identifies nothing. Either Figma has variants that were not implemented, or the design needs a received/sent pair. This is the most significant gap in the component.
2. **Padding and gap are hardcoded literals off the token scale.** Horizontal padding 16 is `md.spacing.400` and is not read from the scale; vertical padding 10 and the child gap 10 correspond to `md.spacing.250`, also not read from the scale. All three should resolve through [[Spacing]] — note the implementation reads spacing tokens for the corner radii but not for the padding.
3. **Hardcoded hex fallbacks are present in component code.** The fill and content colors are read from the token map with literal fallbacks (`#DFDFFF` and `#131333`) if the keys are absent. This violates the tokens-only rule, which is explicit that a missing token should surface as a problem rather than fall back to a literal — the fallback means a token rename would silently substitute a stale color rather than failing visibly.
4. **The fixed color roles are not exposed on the theme's color scheme**, which is why they're read from the raw token map rather than resolved the way every other component resolves color. Surfacing `secondary-fixed` / `on-secondary-fixed` on the scheme would remove both the map lookup and the hex fallbacks above.
5. **`cornerLarge` and `cornerSmall` are aliases, not a parallel scale.** They resolve to `AsmCornerRadii.r16` and `AsmCornerRadii.r4`, so the values are right — but the token layer exposes two vocabularies for the same radii (`cornerNone`…`cornerFull` alongside `r0`…`r999`), and components pick between them inconsistently. The same applies to spacing, where `paddingXSmall`…`paddingXLarge` shadow `spacing100`…`spacing1200`. [[Spacing]] should declare one canonical vocabulary; see [[Checkbox]], which hits the same thing.
6. **No semantics, no role, no automation identifier.** The bubble emits no semantics node of its own. It's non-interactive, so no role is strictly required, but the absence of an automation identifier means UI automation cannot target a message without help from the surrounding view — a gap relative to every other component in the system, and relative to the automation-identifier rule.
7. **Sender attribution has no home in the design system.** The bubble can't provide it and no conversation-view or message-list component exists, so every consumer reimplements alignment, width constraint, attribution, and grouping. If chat is a real surface, that container is the missing component.
8. **No timestamp, status, or grouping treatment is specified.** Read receipts, delivery status, and consecutive-message grouping are all conventional in chat and none is defined here or in Figma as far as the registry shows.
9. **Dark mode behavior is unusual and worth confirming.** The bubble uses fixed color roles, so it does not change between light and dark themes. That's a defensible choice for a chat surface, but it means a bubble on a dark background keeps its light tint — worth verifying against the design intent rather than assuming.
10. **The border serves only to add 1px of size.** It's drawn in the fill color, so it's invisible by construction; its only effect is making the bubble 2px larger in each axis. This mirrors a box-sizing behavior from the design source. If the intent is a slightly larger bubble, padding would express it more clearly.
