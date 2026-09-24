# Component: Feedback

> Role: A short question and a pair of thumbs that capture one binary opinion about the thing next to them — "was this helpful?". It records a judgement. It does not collect detail, does not confirm, and does not act on anything.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A tap on a thumb MUST be acknowledged. The component's own visual change is not acknowledgement — the selected fill is nearly invisible, and a user who answers and sees nothing happen will answer again or conclude the app ignored them.
> Source: Figma `Components` → `feedback` (`2476-3009`; states `2476:3008` unselected, `2482:3396` thumbsup, `2482:3420` thumbsdown). Implementation: `pegasus_flutter/lib/asm/components/feedback.dart`.

## Overview

Feedback is the smallest possible survey: one question, two answers, no free text. It sits directly beneath the thing being judged — an article, a support answer, an assistant reply — and its whole value is that answering costs one tap.

**The distinction most often got wrong is feedback versus an action.** The thumbs look like buttons and they are not buttons in the usual sense: pressing one changes nothing the user can see beyond the thumb itself. Nothing is saved, nothing navigates, nothing is undone. If pressing it *does* something to the user's data or the view, it is a [[Button]] and it needs a verb. "Was this helpful?" is feedback. "Delete this article" is not.

**The second distinction is feedback versus a rating.** Two options is an opinion; five stars is a measurement. If the answer has a middle — "somewhat helpful", "3 out of 5" — this component cannot express it, and forcing a nuanced judgement into two options produces data that means nothing. Use [[Radio]] items for a scale.

**The third distinction is feedback versus a survey.** The thumbs capture *that* the user was dissatisfied and never *why*. A thumbs-down with nowhere to go is a dead end for the user and a useless signal for the product. If the reason matters, the thumb is the entry point to something else — a [[Modal]] with a short form, or a [[Sheets|sheet]] — and the component's job ends at reporting the tap.

## Anatomy

One horizontal row: the question, then the two thumbs.

```
┌───────────────────────────────────────────┐
│  Was this helpful?  ┆8┆  👍  ┆8┆  👎     │
└───────────────────────────────────────────┘
        ↑                  ↑        ↑
     prompt          thumbs up   thumbs down
                    (positive)   (negative)
```

Selected, the chosen thumb gains a filled circular background and its glyph switches from outline to solid:

```
   Was this helpful?    (●👍)      👎
                          ↑         ↑
                      selected   unselected
                   (filled glyph  (outline glyph,
                    + tonal fill)  no fill)
```

| Part | Required | Notes |
| --- | --- | --- |
| Prompt | No | One short question. 14pt, muted foreground. Omit it only when the surrounding container already asks. |
| Thumbs up | Yes | Icon-only control, 20 glyph. Outline when unselected, solid when selected. |
| Thumbs down | Yes | Same, mirrored. |
| Selected fill | Conditional | A circular tonal fill behind the chosen thumb. |

There is no third option, no "not sure", no comment box, and no submit. The tap is the submission.

## Sizes

There is one size.

| Measurement | Value | Source |
| --- | --- | --- |
| Row height | 44 | Figma symbol bounds — set by the thumb control |
| Row width | 184 unselected / 176 selected | Figma symbol bounds — **the row changes width when answered.** See [Open Items](#open-items) |
| Gap between all children | 8 | Figma `gap-[8px]` |
| Thumb control | 44 × 44 in Figma; 56 × 56 as implemented | Figma: 20 glyph + 12 inner padding each side. See [Open Items](#open-items) |
| Glyph | 20 × 20 | Figma `size-[20px]` |
| Thumb shape | Fully round | Figma `rounded-[999px]` |
| Prompt | 14pt / 400 / line-height 1.4 | Figma `label/large` |

**The prompt does not wrap in Figma** — it is marked as a single line at any length. The implementation lets it flex and wrap instead, which is the better behaviour and means the row can be taller than 44.

## Variants

There are none. Feedback has one form; what changes is which answer is selected.

## Modifiers

| Flag | Effect |
| --- | --- |
| Prompt hidden | Renders the thumbs alone. Only correct when the question is already asked by the surrounding container — a card heading, a section label. A pair of naked thumbs with no question anywhere is unanswerable. |
| A thumb disabled | Either thumb can be made inert independently. Both inert disables the component. Not drawn in Figma at all. |

**Disabling one thumb and not the other is almost always wrong.** A user offered only "yes" is being asked a leading question, and the data collected is worthless. If feedback cannot be accepted right now, disable both or render nothing.

## States

Follows [[States]]. The row itself has no states — it is a container. Each thumb is an icon-only control and carries the full set: rest, hover, focus, pressed, disabled, plus **selected**, which is the one this component adds.

| State | Treatment |
| --- | --- |
| Unselected | No fill. Outline glyph. |
| Selected | Tonal circular fill, solid glyph. |
| Hover / focus / pressed | Whatever the icon-only control provides. Not drawn in Figma for either thumb. |
| Disabled | Not drawn in Figma. Supplied by the control. |

**Selection is signalled two ways, and only one of them is reliable.** The tonal fill measures about **1.36:1 against the page** — very nearly invisible. What actually communicates the answer is the **glyph switching from outline to solid**, which is a shape change rather than a colour change and therefore works for a user who cannot distinguish the fill. Preserve the glyph swap; do not "simplify" it to a fill change.

**Selection must also be announced, not just drawn.** A thumb that looks chosen and reports nothing to assistive tech leaves a screen-reader user unable to tell whether their tap registered — which is the same failure the banner rule describes, in a different channel.

## Selection

What a tap means is the caller's decision, and there are three separate questions to answer before shipping this component anywhere.

**Can the user change their mind?** Tapping the other thumb should move the answer — a user who mis-taps has no other recourse, and refusing to move the selection means the first tap is permanent. Support switching sides.

**Can the user withdraw entirely?** Tapping the already-selected thumb may clear the answer, or may do nothing. Clearing is the friendlier behaviour and the one to prefer. Whichever is chosen, **be consistent across the whole app** — a user who learns that re-tapping clears in one place and does not in another has learned nothing.

**What happens after?** The tap is the submission, so something must happen:

- **A thumbs-up needs a brief acknowledgement.** "Thanks for the feedback." Nothing more; do not open anything.
- **A thumbs-down needs somewhere to go.** Either a short follow-up asking why, or the same acknowledgement — but a negative answer that vanishes into nothing teaches the user their input is discarded, and they stop giving it.
- **Neither may block.** The acknowledgement is a [[Snackbar]] or a line of text appearing near the row, never a [[Modal]] the user must dismiss.
- **The row must not disappear on answer.** The user needs to see what they chose. Replacing the component with a thank-you removes their own answer from the screen.

**One answer per thing.** The component records a single judgement about a single object. Two feedback rows on one screen must be about two different things, and each needs its own question — otherwise the user cannot tell which they are answering.

## Behaviors

**The component owns nothing.** It draws the current answer and reports taps. It never changes the answer by itself, which means an unwired feedback row is one the user can tap forever with no effect — and nothing warns about that.

**The row's width changes when answered.** In the design, the unselected state is 8 wider than either answered state, so answering shifts everything after it in the row. In a tight layout that is a visible jump at the moment of the tap. Give the row its own line, or reserve the wider width.

**The prompt wraps rather than truncating.** A long question makes the row taller. Keep the question short and this never arises.

**Text scale.** The prompt grows; the thumbs do not. At a large text scale the glyphs become proportionally small relative to the question they answer.

**Nothing is retried.** If the tap's side effect fails — the network call that records the answer — the component knows nothing about it and will keep showing the answer as selected. Whoever wires it up owns the failure case.

## Content

- **The prompt is a yes/no question, short, in sentence case.** "Was this helpful?" "Did this answer your question?"
- **Never ask something the thumbs cannot answer.** "How helpful was this?" invites a scale and gets a binary.
- **Never ask two things at once.** "Was this clear and helpful?" gets one thumb for two questions.
- **Do not label the thumbs.** They are glyphs; adding "Yes" and "No" beside them doubles the row for no information.
- **Name the outcome, not the glyph, in the announced label.** "Mark as helpful" tells a screen-reader user what the control does. "Thumbs up" describes a picture.
- **Keep the acknowledgement to one short sentence.** "Thanks for the feedback." No exclamation mark, no explanation of what happens to the data.
- **Never promise a response.** "We'll look into this" commits the product to something the tap does not do.

## Decision Tree

```
Is the user's input an opinion about something on screen?
├── no — it performs an action ──────────────→ use a [[Button]]
├── no — it sets a preference ──────────────→ use a [[Switch]] or [[Checkbox]]
└── yes
    │
    ├── Does the answer have a middle, or more
    │   than two options? ───────────────────→ use [[Radio]] items
    │
    ├── Do you need to know *why*? ──────────→ thumbs as the entry point,
    │                                          then a [[Modal]] or
    │                                          [[Sheets|sheet]] with a
    │                                          short form
    │
    ├── Is it about the whole product rather
    │   than one piece of content? ──────────→ not this component — a
    │                                          survey, launched from
    │                                          somewhere the user is not
    │                                          mid-task
    │
    └── One binary judgement about the thing
        it sits under ──────────────────────→ feedback
        ├── Does the container already ask
        │   the question? ──────────────────→ thumbs only, no prompt
        └── Otherwise ──────────────────────→ prompt plus thumbs

What acknowledges the answer?
├── A brief confirmation ───────────────────→ [[Snackbar]]
└── A follow-up asking why ─────────────────→ [[Modal]] or [[Sheets|sheet]]
                                              (never blocking on a
                                               thumbs-up)
```

## Accessibility

| Requirement | Rule |
| --- | --- |
| Each thumb is a named button | With a name describing the outcome — "Mark as helpful" — not the glyph. |
| Selection is announced | A screen-reader user must be able to hear which thumb is chosen, not only see it. |
| Keyboard operable | Tab reaches each thumb; Enter, Space, and the numeric-keypad Enter activate. |
| Focus visible | The branded ring on each thumb. Not drawn in Figma for any state. |
| The prompt is announced once | It is visible text and it names the group. Announcing it twice — once as a group name, once as its own text — is a defect, not thoroughness. |
| The answer is acknowledged in the announcement channel too | A visual-only "Thanks" is invisible to a screen-reader user; the acknowledgement must be announced. |
| Selection is not colour-alone | The outline-to-solid glyph swap carries it. The fill alone does not. |
| Automation identifier | Each thumb needs its own, composed from a per-instance prefix. Two feedback rows sharing a default prefix are indistinguishable to automation. |
| Touch target | The thumbs must clear 48×48. Figma draws them at 44. |
| Localise the announced labels | They are the only text the component produces that the caller may not have written. |

**The announced labels are the component's weakest point.** Two glyphs with no visible text mean the announced name is the *entire* description of each control. "Thumbs up" leaves a user who cannot see the glyph to infer what a thumb means in this context; "Mark as helpful" does not. And because these labels default to English strings inside the component, a product that never overrides them ships an untranslated control.

**Contrast, light theme:**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Prompt on the page | ~10.1:1 | Passes AAA |
| Glyph on the page, unselected | ~15.4:1 | Passes |
| Glyph on the selected fill | ~11.4:1 | Passes |
| **Selected fill against the page** | **~1.36:1** | **Far below 3:1** |

The last row is the one that matters. **The circular fill that marks the chosen answer is very nearly invisible** — it is the same faint neutral used by [[Tags]], where the same measurement was accepted for a decorative pill. Here it is doing more work: it is one of only two signals that the user's answer registered. It fails as a signal, which is exactly why the glyph swap must stay.

## Anti-Patterns

**❌ A thumb that does nothing.** No visible change, no acknowledgement, no record. The user taps twice, then stops trusting the control. → Wire it up and acknowledge it.

**❌ A thumbs-down that goes nowhere.** The user says the thing failed them and the app has no response. → Ask why, or at minimum acknowledge.

**❌ A blocking follow-up on a thumbs-up.** The user paid one tap for a compliment and got a dialog. → Acknowledge and move on.

**❌ Replacing the row with a thank-you.** The user's own answer disappears, so they cannot see or change what they said. → Keep the row and its selection visible.

**❌ Naked thumbs with no question anywhere.** Two glyphs the user cannot interpret. → Show the prompt, or let the container ask.

**❌ One thumb disabled.** A leading question that collects meaningless data. → Disable both or render nothing.

**❌ "How helpful was this?" over two thumbs.** The question invites a scale the component cannot express. → Ask a yes/no question, or use [[Radio]] items.

**❌ Two questions in one prompt.** One thumb answers both, ambiguously. → One question.

**❌ Labelling the thumbs "Yes" and "No".** The glyphs already say it, and the row doubles in width. → Glyphs only.

**❌ Announced labels that describe the picture.** "Thumbs up" is not what the control does. → "Mark as helpful".

**❌ Feedback in the middle of a task.** It interrupts something the user came to do, and the answer is about the wrong thing. → After the content, or after the task completes.

**❌ Feedback about the whole product attached to one article.** The signal cannot be attributed. → A survey, launched separately.

**❌ Two feedback rows sharing one prompt.** The user cannot tell which one they are answering. → One question per row, each about a distinct thing.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmFeedback`, from `pegasus_flutter/lib/asm/components/feedback.dart`. It is stateless and **fully controlled** — it never mutates the selection. Each thumb is an `AsmIconButton` at the `medium` size, so the whole keyboard, focus, hover, and disabled contract comes from there.

### Enums

```dart
enum AsmFeedbackValue { thumbsUp, thumbsDown }   // null means neither
```

There is no `none` member; the absence of an answer is `null`.

### Basic usage

The caller owns the value and decides what a tap means. This is the recommended behaviour — switching sides, and re-tapping to clear:

```dart
AsmFeedbackValue? _value;

AsmFeedback(
  label: 'Was this helpful?',
  value: _value,
  automationIdentifier: 'article-$articleId-feedback',
  onThumbsUp: () {
    setState(() {
      _value = _value == AsmFeedbackValue.thumbsUp
          ? null
          : AsmFeedbackValue.thumbsUp;
    });
    _recordFeedback(_value);
  },
  onThumbsDown: () {
    setState(() {
      _value = _value == AsmFeedbackValue.thumbsDown
          ? null
          : AsmFeedbackValue.thumbsDown;
    });
    _recordFeedback(_value);
  },
)
```

Pass an `automationIdentifier` composed from a stable per-instance value. The default is a library-shared constant, so two feedback rows left on the default are indistinguishable to automation.

### Thumbs only

```dart
AsmFeedback(
  label: null,
  value: _value,
  automationIdentifier: 'assistant-reply-$replyId-feedback',
  onThumbsUp: _markHelpful,
  onThumbsDown: _markUnhelpful,
)
```

Only when the container already asks the question.

### Announced labels for the outcome

```dart
AsmFeedback(
  label: 'Was this helpful?',
  value: _value,
  thumbsUpSemanticLabel: 'Mark as helpful',
  thumbsDownSemanticLabel: 'Mark as not helpful',
  automationIdentifier: 'article-$articleId-feedback',
  onThumbsUp: _markHelpful,
  onThumbsDown: _markUnhelpful,
)
```

**Do this on every instance.** The defaults are hardcoded English and describe the glyph rather than the action.

### Disabled

```dart
const AsmFeedback(
  label: 'Was this helpful?',
  value: null,
  onThumbsUp: null,
  onThumbsDown: null,
)
```

A `null` callback disables that thumb. Disable both or neither.

### Parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String?` | No | `null` (asserted non-empty when given) |
| `value` | `AsmFeedbackValue?` | No | `null` |
| `onThumbsUp` | `VoidCallback?` | No | `null` (disables that thumb) |
| `onThumbsDown` | `VoidCallback?` | No | `null` (disables that thumb) |
| `thumbsUpSemanticLabel` | `String` | No | `'Thumbs up'` |
| `thumbsDownSemanticLabel` | `String` | No | `'Thumbs down'` |
| `automationIdentifier` | `String` | No | `'asm-feedback'` (asserted non-empty) |

The thumbs compose their own identifiers as `'<prefix>-thumbs-up'` and `'<prefix>-thumbs-down'`.

### Guidance

- **Always pass an `automationIdentifier`.** The default is shared across every instance in the app.
- **Always override both semantic labels.** They are the only description each control has.
- **Wire both callbacks or neither.** A component with callbacks that do not change `value` renders a control the user can tap indefinitely with no effect, and nothing warns.
- **Acknowledge the tap yourself.** The widget provides no confirmation, no live announcement, and no follow-up. All of that is the call site's.
- **Do not use `AsmFeedback` for an action.** The thumbs are `AsmIconButton`s and will happily run any callback, including a destructive one. Use an [[Button|AsmButton]] or `AsmIconButton` directly for anything that is not an opinion.
- **Keep the label short.** It flexes and wraps, growing the row.
- **The thumbs are Material's `thumb_up` / `thumb_down` glyphs**, not McAfee icon assets — see [[Icons]] and [Open Items](#open-items).

---

## Rules

1. A tap MUST be acknowledged. The selected fill MUST NEVER be treated as sufficient feedback that the answer registered.
2. Selection MUST be signalled by the outline-to-solid glyph change, NEVER by the fill alone.
3. Selection MUST be announced to assistive tech, not only drawn.
4. The component MUST NEVER change the answer by itself, and MUST NEVER be shipped with callbacks that do not update the value.
5. Tapping the other thumb MUST move the answer. A first tap MUST NEVER be permanent.
6. Whether re-tapping the selected thumb clears the answer MUST be the same everywhere in the app.
7. The row MUST stay visible after answering, with the user's selection shown.
8. A thumbs-down MUST lead somewhere — a short follow-up or an acknowledgement. It MUST NEVER vanish into nothing.
9. An acknowledgement MUST NEVER block. A thumbs-up MUST NEVER open a [[Modal]].
10. The prompt MUST be one short yes/no question. It MUST NEVER ask for a scale and MUST NEVER ask two things.
11. Thumbs MUST NEVER be rendered without the question being asked somewhere.
12. Each thumb MUST be a named button whose name describes the outcome, NEVER the glyph.
13. Both announced labels MUST be localised at the call site.
14. Both thumbs MUST be keyboard-reachable, activate on Enter and Space, and show a visible focus ring.
15. One thumb MUST NEVER be disabled while the other is live.
16. Each thumb MUST carry its own automation identifier, composed from a per-instance prefix — NEVER the shared default.
17. Each thumb MUST clear a 48×48 touch target.
18. One feedback row MUST correspond to exactly one thing being judged.
19. Feedback MUST NEVER be used to perform an action, set a preference, or capture a scale.
20. Feedback MUST NEVER interrupt a task in progress.

---

## Open Items

1. **The thumb control is 44 in Figma and 56 as implemented.** Figma composes the thumb from a 20 glyph plus 12 of padding on each side, giving 44 — under the 48×48 floor. The implementation uses the `medium` icon-button size, whose container is 56 with the same 20 glyph. So the code clears the accessibility floor and misses the design by 12 on each thumb, making the whole row 24 wider than the design. One of the two has to move, and the design is the one that is wrong.
2. **Figma's 44 thumb was drawn to the wrong floor.** [[Icons]] previously stated the minimum as 44×44 in two places while the repository's accessibility rule requires 48×48; [[Icons]] has since been corrected to 48 throughout, so Figma's 44-tall thumb now unambiguously fails the system's minimum. 44 is the raw accessibility-standard floor, which is presumably where the design took it from — but this system requires 48, and the design file needs updating to match.
3. **The row is 8 wider before it is answered.** Figma's unselected symbol is 184 wide against 176 for either answered state, because the unselected thumbs-up carries 4 of extra horizontal padding that no other thumb in any state has. The result is a layout shift at the exact moment of the tap. Almost certainly an accident in the file rather than intent; the implementation does not reproduce it.
4. **Figma renders the selected thumb as a non-interactive element.** In both answered states the chosen thumb is drawn as a plain container while the unchosen one is drawn as a button. Read literally, that means an answer cannot be changed or withdrawn once given — which contradicts the implementation, whose documented example clears the value on a re-tap. The design source needs to say whether the selected thumb is still pressable.
5. **The `selected` flag is set on a wrapper rather than on the button.** Each thumb is wrapped in a semantics node carrying `selected`, outside the `AsmIconButton` that produces its own semantics node. Whether the flag lands on the node a screen reader reads as the button depends on how the two merge, and nothing tests it. Compare [[Tabs]], where the selected state is set on the item itself.
6. **The prompt is announced twice.** The row is wrapped in a semantics container whose label is the prompt, and the prompt is also a visible `Text` inside that container, with no exclusion. So the question is available as both the group's name and its content. This is the third instance of the same class of defect — [[Tags]] collapses too much, [[Text Fields]] collapses too little, and this collapses nothing while also duplicating.
7. **The default automation identifier is a library-shared constant.** `'asm-feedback'` is the default, so two unmodified feedback rows on one screen produce colliding identifiers for four buttons. The repository's own automation rule lists `AsmFeedback` by name in its "flagged more than once in review" section for exactly this pattern, and the default is still there.
8. **The default announced labels describe the glyph and are hardcoded English.** `'Thumbs up'` and `'Thumbs down'` are the entire accessible description of two controls with no visible text. They should name the outcome, and a product that does not override them ships an untranslated control. The component's own doc comment suggests `'Mark as helpful'` as an override, which is an admission that the default is wrong.
9. **The gap between the two thumbs is missing.** Figma's row puts 8 between every pair of children, including between the thumbs. The implementation inserts the gap only between the prompt and the first thumb, so the two thumbs sit flush against each other. With 56-wide containers the glyphs are still visually separated, which is presumably why it went unnoticed.
10. **Figma draws no hover, focus, pressed, or disabled state.** The state axis has exactly three members — unselected, thumbsup, thumbsdown — so every interaction treatment on both thumbs is inherited from the icon-button component rather than specified here, and the focus ring in particular is unsourced. Consistent with the rest of the file, where focus is rarely drawn.
11. **The implementation supports disabling one thumb; the design has no disabled state at all.** Per-thumb disabling is an API capability with no design source and, as documented above, no legitimate use.
12. **The selected fill is nearly invisible against the page.** ~1.36:1, the same neutral surface flagged in [[Tags]] for the same reason. There it was acceptable on a decorative pill; here the fill is one of only two signals that an answer registered.
13. **The glyphs are Material's, not McAfee's.** `Icons.thumb_up` / `Icons.thumb_up_outlined` and their mirrors come from Material's icon set, while Figma draws custom vectors. The outline-to-solid distinction survives the substitution, but the shapes are not the design's.
14. **The component has no tests.** It appears in no test file. It joins `AsmTag` and `AsmTooltip` as the third component with zero coverage — and it is the one whose only two defects that a test would catch (items 5 and 6) are both in the semantics layer, which is precisely what the repository's semantics-merge suite exists to check.
15. **There are no in-repo consumers.** Only the Widgetbook story uses it. So every content rule above — the prompt wording, the acknowledgement, the follow-up on a thumbs-down — derives from the two sources rather than from observed use, and the acknowledgement behaviour in particular has never been built.
16. **Nothing in the component or the design addresses what happens after the answer.** No acknowledgement, no live announcement, no follow-up affordance, no failure handling for the call that records the answer. This is the largest gap: the component captures an answer and has no opinion about the most important part of the interaction. Whether that belongs here or at the call site is a real design decision that has not been made.
17. **The `showLabel` axis is a Figma boolean, and the implementation expresses it as a nullable string.** Equivalent in effect, but it means Figma's `label = "Label name"` default persists in the symbol while hidden, so a designer toggling the label back on gets placeholder copy.
18. **A dead max-width sits on every thumb.** Figma constrains each icon-button instance to a 460px maximum, a value with no possible effect at 44. The same leftover appears on [[Tags]]' remove affordance, in [[Text Fields]]' icon slots, and in the filter chip's close node — it is now clearly a file-wide artefact rather than a per-component one.
19. **A legacy `feedback.dart` exists alongside the Assemble one**, built from a hand-rolled 48-wide tappable region around a 32 circle with a hover fill on a different colour role and a Material tooltip on each thumb. It is read-only legacy and not a source, but it is worth noting that the older component *did* give each thumb a tooltip — which the Assemble version does not, against the guidance in [[Icons]] that icon-only controls carry both a semantic label and a tooltip.
