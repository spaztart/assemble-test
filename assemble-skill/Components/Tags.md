# Component: Tags

> Role: A small pill that labels a piece of content — a name, a category, a saved filter. It states a fact about something else. It is not a button, not a status light, and not a count.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A tag is a label, not a control. The pill body MUST NEVER be tappable. The only interactive part of any tag is the remove affordance on the `filter` variant — if the user is meant to choose, select, or navigate by pressing the pill, this is the wrong component.
> Source: Figma `Components` → `tag_read_only` (`4208-10963`, set `3468:24` / `4208:10964`) and `tag_filter` (`3795-1313`, states `3787:1156` / `3795:1730` / `3795:1770`). Implementation: `pegasus_flutter/lib/asm/components/tag.dart`.

## Overview

A tag attaches a short piece of metadata to something the user is already looking at. "William Galligod" next to a shared file. "Expired" next to a subscription row. "Email" next to a contact method. The tag never stands alone — it is always subordinate to a row, a card, or a field.

**The distinction most often got wrong is tag versus status indicator.** They are both tiny, both coloured, and both describe a condition. The difference is what they describe. A [[Status Indicators|status indicator]] reports the *live condition of a thing* — online, at risk, protected — and it changes as the system changes. A tag reports a *classification* — who, what kind, which filter — and it changes when the data changes. "Protected" is a status. "Work laptop" is a tag. If it has a colour vocabulary of seven states, it is a status indicator.

**The second distinction is tag versus filter chip.** These are the same component here, distinguished by variant. A read-only tag says "this item is in this category". A `filter` tag says "the *list you are looking at* is narrowed by this, and you may remove it". The difference is whose state it describes: the item's, or the query's. Getting this wrong produces a tag with an × that removes nothing, or a filter row the user cannot clear.

**The third distinction is tag versus badge.** A [[Badges|badge]] is also a small filled chip holding one or two words, so the two get swapped constantly. A badge says *how urgent* — `CRITICAL RISK`, `MODERATE` — in uppercase mono with square corners. A tag says *what kind* — `Work laptop`, `Email` — in sentence case with a radius of 6. Severity belongs in a badge; everything else belongs in a tag.

**The fourth distinction is tag versus button.** A tag is never a target. There is no selected state, no hover on the pill, no press. A row of tags the user is meant to *pick from* is a set of [[Checkbox]] items, a [[Menu]], or [[Tabs]] — never tags.

## Anatomy

One row, three slots, all inside a small rounded rectangle. There is no border and no shadow.

```
┌───────────────────────────────────┐
│ ✉  ┆gap┆  William Galligod        │   read-only
└───────────────────────────────────┘
  ↑            ↑
leading      label
icon

┌────────────────────────────────────────┐
│ ✉ ┆4┆ William Galligod ┆4┆  ⊗         │   filter
└────────────────────────────────────────┘
                                  ↑
                          remove affordance
                          (the only interactive part)
```

| Part | Required | Notes |
| --- | --- | --- |
| Pill | Yes | Radius 6. Filled, no border, no elevation. |
| Label | Yes | One short phrase. Never empty. |
| Leading icon | No | 16×16, decorative. Announces nothing — it must not be the only thing carrying a distinction. |
| Remove affordance | `filter` only | 16×16 ×. Interactive: focusable, keyboard-activatable, and the only part of the tag that is. |

The pill has no header, no secondary line, and no room for a second label. A tag that needs two pieces of information is two tags, or is not a tag.

## Sizes

There is one size. The pill is **24** tall and as wide as its content.

| Measurement | Value | Source |
| --- | --- | --- |
| Height | 24 | Figma symbol bounds; derived from the 12pt label plus 4 top and bottom |
| Corner radius | 6 | Figma `rounded-[6px]` |
| Horizontal padding | 6 | Figma `px-[6px]` — **off the [[Spacing]] scale**, which steps 4 → 8 |
| Vertical padding | 4 | Figma `py-[4px]` |
| Gap, read-only | 8 | Figma `gap-[8px]` |
| Gap, filter | 4 | Figma `gap-[4px]` |
| Leading icon | 16 × 16 | Figma `size-[16px]` |
| Remove affordance box | 16 × 16 | Figma `h-[16px]` |
| Remove glyph | ~9 in Figma, **12** in code | Conflict — see [Open Items](#open-items) |
| Label | 12pt / 700 / line-height 1.3 | Figma `label/medium-emphasized` |

The 6px horizontal padding is the one value that does not resolve to a token. It is a real Figma number, it is deliberately narrower than the 8 the scale would give, and it is why a tag reads as tighter than every other filled surface in the system. Do not "fix" it to 8.

## Variants

| Variant | Interactive | Fill | Foreground | Means |
| --- | --- | --- | --- | --- |
| `standard` | No | `surface-container-high` | `on-surface-variant` | A neutral classification. The default and the overwhelming majority of uses. |
| `critical` | No | `error-container` | `on-error-container` | This classification is a problem the user should notice. |
| `filter` | The × only | `surface-container-high` | `on-surface` | An active filter on the list below, removable. |

Note that `filter` and `standard` share a fill but not a foreground: the filter variant's label is a shade darker, because it describes something the user is acting on rather than something they are reading past.

### `critical` — the variant that must not stand alone

`critical` differs from `standard` **only in hue.** Same size, same radius, same weight, same position, same absence of an icon. To a user who cannot distinguish red from grey — or who is scanning quickly, or reading under a contrast theme that flattens the palette — a critical tag and a neutral tag are the same object.

So `critical` earns its meaning from the *word inside it*, not the fill. "Expired", "Blocked", "At risk" work; "Subscription" does not, however red it is. Where the word cannot carry it, add the leading icon, or move the message out of the tag entirely into an [[Alert Banner]].

Do not use `critical` for emphasis. It is not "the important tag" — it is the tag that says something is wrong. A row of five critical tags means nothing is critical.

### `filter` — describes the query, not the item

A filter tag belongs directly above or inside the control that produced it, never in a content row. Its × removes that filter and re-runs the query immediately; there is no confirm and no undo, which is acceptable because re-adding the filter is one interaction away.

A filter tag with nothing to remove is a contradiction. If the filter is mandatory — a required scope the user cannot clear — it is not a tag; it is field text or a heading.

## States

Follows [[States]]. The read-only variants have **no states at all**: no hover, no focus, no press, no disabled. They are text with a wash behind them, and that is correct — a surface with hover feedback promises an interaction the component does not have.

The `filter` variant's remove affordance has the states:

| State | Treatment |
| --- | --- |
| Rest | No fill. The × sits in an invisible circular target. |
| Hover | Fills with the inverse surface at radius 4, and the glyph flips to the inverse foreground — the target changes shape as well as colour. |
| Focus | Branded ring. Not drawn in Figma; supplied by the implementation. |
| Pressed | The hover fill plus a neutral pressed overlay on top of it. |
| Disabled | Not drawn in Figma, and **not implemented** — the × is always live. |

**The shape change on hover is deliberate.** Circle at rest, rounded square when engaged. That is a second, non-colour signal that the × is a target, and it is the only place in the system where a control changes its silhouette on hover. Preserve it.

## Behaviors

**Width is content-driven, and the label does not wrap.** A tag is one line, always. It grows to fit its label until it is given no more room, at which point the label truncates with an ellipsis. Both sources agree the tag never wraps; they disagree about whether it may truncate — the component's own documentation calls tags "non-truncated" while the implementation truncates. Treat truncation as a failure mode to design away, not a feature to rely on.

**A truncated tag is a broken tag.** The whole value of a tag is that it is readable at a glance in peripheral vision. "William Gal…" is not a classification, it is a puzzle. Keep labels to one or two words and give tag rows room.

**Tags wrap as a group, not individually.** A set of tags flows onto multiple rows with the row gap matching the tag gap. The set has no maximum; a row of fifteen tags is a design problem, not a component one — collapse it behind a count, or reduce what is tagged.

**The tag needs a bounded width.** It sizes itself to content but reserves the right to shrink its label, which means it must be laid out somewhere with a known maximum width. Placing a tag in a horizontally unbounded context is not a supported arrangement.

**Removing a filter tag reflows the row.** The tags after it shift left, and if the user is clicking through several in sequence, the next × lands under a moving target. Where a user is likely to clear several filters at once, provide a "clear all" alongside the row rather than relying on repeated ×.

**Text scale.** The pill's height is content-derived rather than fixed, so it grows with the label — better than a fixed-height chip. The remove affordance does not grow, which makes it proportionally harder to hit as text scales up.

## Content

- **One or two words.** A tag is a name or a category, not a sentence.
- **No punctuation, no trailing colon, no parentheses.** "Expired", not "Expired!".
- **Sentence case for words, natural case for names.** "Work laptop", "William Galligod". Never all-caps — that treatment belongs to [[Status Indicators]] labels, and reusing it here makes the two indistinguishable.
- **No counts.** "Devices (4)" is a label with a number in it, which will change width and break the row. Counts go in the thing being labelled.
- **The word must carry the meaning without the colour.** Especially for `critical`.
- **Filter tags name the value, not the field.** "United States", not "Region: United States" — the field is already visible as the control the chip sits in.
- **Do not repeat the row.** A tag that says "Contact" on a row in a contacts list is noise.

## Decision Tree

```
Is the user meant to press it?
├── yes
│   ├── to run an action? ──────────────→ use a [[Button]]
│   ├── to choose one of several views? ─→ use [[Tabs]]
│   ├── to pick from a set of values? ───→ use [[Checkbox]] items or a [[Menu]]
│   └── to remove an active filter? ─────→ tag, `filter` variant
│                                          (only the × is pressable)
└── no — it is purely descriptive
    │
    ├── Does it report a live system condition
    │   that changes on its own? ─────────→ use [[Status Indicators]]
    │
    ├── Is it a message the user must read
    │   and act on? ──────────────────────→ use an [[Alert Banner]]
    │
    ├── Is it a number?
    │   ├── a count of things wanting
    │   │   attention? ──────────────────→ use a [[Status Indicators|notification badge]]
    │   └── a metric shown as a chip? ───→ use a [[Badges|badge]], `stat` status
    │
    ├── Does it say how urgent the item is
    │   rather than what kind it is? ─────→ use a [[Badges|badge]]
    │
    └── It classifies the item it sits with
        ├── Is the classification a problem? ─→ `critical`
        │                                       (and say so in the word)
        └── Otherwise ────────────────────────→ `standard`
```

## Accessibility

| Requirement | Rule |
| --- | --- |
| Read-only tags are not focusable | They are not controls. They must not appear in the tab order. |
| The label is announced | As text belonging to the row it labels, once. |
| The leading icon is silenced | It repeats the label; it must never carry information the label does not. |
| Remove affordance is a named button | Announced as a button with an explicit action name — "Remove", not "×", and never the tag's own label. |
| Remove is keyboard-operable | Tab reaches it; Enter, Space, and the numeric-keypad Enter activate it. |
| Focus visible on the × | Branded ring. It is the only focus affordance the component has. |
| Automation id on the × | Required for the `filter` variant, composed from a stable per-tag value so each chip's remove hook is independently targetable. |
| Colour is not the only signal | `critical` must be readable as critical from its text. |
| Touch target | **The remove affordance is 16×16 — far under the 48×48 floor.** |

**The remove affordance is the component's largest accessibility defect.** A 16×16 target is a third of the minimum in each dimension and about a ninth of the area. It is nested inside a 24-tall pill, so the pill itself cannot supply the padding without becoming tappable — which the component correctly refuses to be. This is a genuine design tension, not an oversight in the code, and it needs resolving in the design: either the pill grows, or the × gets an invisible expanded hit region that overlaps its neighbours.

**Removing a filter must be announced.** The × disappears along with the tag, so focus is destroyed by the very action the user took. Whatever hosts the filter row owes the user a live announcement of the new result ("12 results") and a sensible focus destination — the next tag, or the control the row belongs to.

**Contrast, light theme:**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `standard` label on its fill | ~7.4:1 | Passes AA |
| `critical` label on its fill | ~5.3:1 | Passes AA |
| `filter` label on its fill | ~11.4:1 | Passes AA |
| Remove affordance's hover fill on the pill | ~9.7:1 | Passes |
| **Pill fill against the page surface** | **~1.4:1** | Below 3:1 |

The last row is the one worth internalising. A `standard` tag's own boundary is nearly invisible against the page — the pill reads as a faint wash, not as a shape. That is fine for a decorative container, but it means **the pill does not distinguish a tag from ordinary text**, and it means the *only* thing separating `standard` from `critical` at a glance is the red. The `critical` fill is far more visible than the neutral one, which makes the pair asymmetric: neutral tags whisper, critical tags shout, and there is no middle.

## Anti-Patterns

**❌ A tappable tag.** The pill has no pressed state, no focus ring, and no announced role — a user cannot tell it is a target and assistive tech will not say so. → Use a [[Button]], [[Tabs]], or [[Checkbox]] items.

**❌ A row of tags used as a filter picker.** Tags cannot be selected; there is no selected state in either source. → Use a multi-select [[Menu]], which produces filter tags as its output.

**❌ `critical` as emphasis.** It means something is wrong. Using it to highlight makes real problems invisible. → Say the problem in words, or use an [[Alert Banner]].

**❌ A `critical` tag whose word is neutral.** "Subscription" in red says nothing to a user who cannot see red. → Name the problem: "Expired".

**❌ All-caps tag text.** That treatment belongs to [[Status Indicators]] labels; reusing it makes the two components indistinguishable. → Sentence case.

**❌ A count inside the label.** It changes width in a row that cannot reflow gracefully. → Put the number on the thing being counted.

**❌ A tag with no × in a filter row.** The user sees their active filters and cannot clear them. → Use the `filter` variant, or move the text out of a pill.

**❌ A filter tag inside a content row.** It implies the item can be removed, not the filter. → Read-only variants only, outside the query controls.

**❌ Relying on the ellipsis.** A truncated tag is unreadable metadata. → Shorten the label or widen the row.

**❌ Fifteen tags on one row.** → Show the first few and a count, or tag less.

**❌ Using a tag as a status light.** No dot, no live meaning, no seven-state colour vocabulary. → [[Status Indicators]].

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmTag`, from `pegasus_flutter/lib/asm/components/tag.dart`. It is stateless; the remove affordance is a private stateful child.

### Enums

```dart
enum AsmTagVariant { standard, critical, filter }   // default: standard
```

### Basic usage — read-only

```dart
const AsmTag(label: 'Work laptop')
```

With a decorative leading glyph:

```dart
const AsmTag(
  label: 'William Galligod',
  leadingIcon: Icons.mail_outline,
)
```

### Critical

```dart
const AsmTag(
  label: 'Expired',
  variant: AsmTagVariant.critical,
)
```

The word carries the meaning — see the [`critical` guidance](#critical--the-variant-that-must-not-stand-alone).

### Filter

`onClose` and `automationIdentifier` are both **required** for this variant, and both are asserted. `onClose` must be `null` for the read-only variants — passing one is also an assertion failure.

```dart
Wrap(
  spacing: context.asmSpacingTokens.spacing200,
  runSpacing: context.asmSpacingTokens.spacing200,
  children: [
    for (final region in _activeRegions)
      AsmTag(
        label: region.name,
        variant: AsmTagVariant.filter,
        onClose: () => _removeRegion(region.id),
        automationIdentifier: 'region-filter-${region.id}',
      ),
  ],
)
```

Compose the identifier from a stable per-tag value — never the list index.

### Parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | Yes | — (asserted non-empty) |
| `variant` | `AsmTagVariant` | No | `standard` |
| `leadingIcon` | `IconData?` | No | `null` |
| `onClose` | `VoidCallback?` | For `filter`; forbidden otherwise | `null` |
| `closeSemanticLabel` | `String` | No | `'Remove'` |
| `semanticLabel` | `String?` | No | `null` (asserted non-empty when given) |
| `automationIdentifier` | `String?` | For `filter`; ignored otherwise | `null` |

### Guidance

- **Do not pass `semanticLabel` on a `filter` tag.** Supplying it collapses the tag's whole semantics subtree, which takes the remove button's name, its button role, and its automation identifier with it. The button becomes invisible to assistive tech and to UI automation, silently. Use `semanticLabel` on read-only tags only.
- **Localise `closeSemanticLabel`.** The default is a hardcoded English string; it is the only announced text the component produces.
- **`automationIdentifier` is dropped for read-only variants.** It is validated if provided and then never forwarded, because there is no interactive surface to attach it to. Do not pass one expecting a test hook.
- **Give the tag a bounded width.** Its label is laid out flexibly, so an unbounded horizontal context is not a supported placement. A `Wrap`, a `Row` with constrained children, or any normal column works.
- **Use `Wrap`, not `Row`, for a set.** Tags must be able to flow onto a second line; a `Row` clips.
- **Do not wrap `AsmTag` in a gesture detector to make it tappable.** That produces an unnamed tap node over a component with no pressed state.
- **The remove affordance has no disabled state.** There is no way to render a filter tag whose × is inert. If the surrounding control is disabled, do not render filter tags at all — the alternative (passing `null` for `onClose`) is an assertion failure.

---

## Rules

1. A tag MUST be descriptive. The pill body MUST NEVER be tappable, selectable, or focusable.
2. The `filter` variant's remove affordance is the ONLY interactive part of any tag. Nothing else in a tag may respond to input.
3. A tag MUST label something else on screen. NEVER use one standalone.
4. Labels MUST be one or two words, sentence case for words and natural case for names. NEVER all-caps — that is [[Status Indicators]]' treatment.
5. A tag MUST NEVER contain a count, punctuation, or a dynamic value.
6. A label MUST NEVER be relied on to truncate. Shorten the copy or widen the container.
7. `critical` MUST state the problem in its text. It MUST NEVER be distinguished from `standard` by colour alone.
8. `critical` MUST NEVER be used for emphasis.
9. A `filter` tag MUST describe the query and MUST always be removable. NEVER place one in a content row.
10. A `filter` tag MUST carry a stable automation identifier composed from a per-tag value, NEVER from the index.
11. The remove affordance MUST be announced as a named button — the action, not the tag's label.
12. The remove affordance MUST be keyboard-reachable and activate on Enter and Space, with a visible focus ring.
13. Removing a filter MUST be announced to assistive tech, and focus MUST be moved deliberately — the button the user just pressed no longer exists.
14. The leading icon MUST be decorative and MUST NEVER carry information the label does not.
15. A set of tags MUST be able to wrap to a second line.
16. A tag MUST NEVER be used as a status light ([[Status Indicators]]), a severity chip ([[Badges]]), a count ([[Status Indicators|notification badge]]), or a button ([[Button]]).

---

## Open Items

1. **Supplying `semanticLabel` on a `filter` tag silences and un-automates its remove button.** The component sets `excludeSemantics` on its outer semantics wrapper whenever `semanticLabel` is non-null, and that collapse drops the entire subtree — including the remove button's `button` role, its announced name, and its automation identifier. The result is a filter chip whose only control is invisible to assistive tech and untargetable by UI automation, with no diagnostic. The collapse is correct for the read-only variants (there is nothing interactive below it) and wrong for `filter`; it should be gated on the variant.
2. **The remove affordance is 16×16, against a 48×48 minimum.** It is nested in a 24-tall pill that deliberately has no hit area of its own, so this cannot be fixed by padding without either growing the tag or letting the × overlap its neighbours. Needs a design decision, not a code change. Figma draws it at 16 as well, so both sources agree on a value that fails the accessibility floor.
3. **The remove affordance has no disabled state, and the one in-repo consumer trips an assertion because of it.** The multi-select dropdown renders its chips with a close handler only when the dropdown is enabled and passes `null` otherwise — while still passing `variant: filter`, which asserts that the handler is non-null. A disabled multi-select dropdown that has selections is therefore an assertion failure in debug builds. Either the variant needs a disabled treatment (undrawn in Figma) or the consumer must stop rendering chips when disabled.
4. **6px horizontal padding is off the [[Spacing]] scale**, which steps 4 → 8. It is a real Figma value, correctly named as a constant in the implementation with a comment pointing at the gap, and it is the second sub-scale padding in the system after [[Snackbar]]. The token is missing upstream.
5. **The remove glyph is bigger in code than in Figma.** Figma insets the × vector to about 9 within its 16 box; the code draws a 12pt glyph, as a bare literal with no sourcing comment. The affordance box matches at 16; the mark inside it does not.
6. **The component's own documentation contradicts its behaviour on truncation.** The class comment describes tags as "short, non-truncated labels"; the implementation lays the label out flexibly with a single line, no soft wrap, and an ellipsis overflow. Figma marks the label as never-wrapping with no truncation behaviour specified. This is the eleventh component whose class documentation asserts something the code does not do — the pattern is now systemic enough that class comments should not be treated as a source.
7. **The filter variant's cross-axis alignment differs.** Figma aligns the filter's row contents to the start; the implementation centres them. With a 16px icon, a 16px × and a 15.6px label line all in one 24-tall pill the visible difference is under a pixel, but the sources disagree.
8. **Figma's leading-icon default differs by variant.** `tag_read_only` defaults `showIcon` to false; `tag_filter` defaults it to true. The implementation has no icon by default in either. Worth confirming whether filter chips are *supposed* to carry a glyph.
9. **Figma's third filter state is unnamed.** The set is `default` / `hover` / `state3`. Its treatment (hover fill plus a neutral pressed overlay) makes clear it is pressed, and the implementation reads it that way, but the variant should be renamed in the file.
10. **Figma draws no focus state for the remove affordance.** The branded ring is an implementation addition. Consistent with the rest of the system, where Figma rarely draws focus — but here it means the only keyboard affordance on the component is unsourced.
11. **Neither variant has a disabled treatment in Figma**, and the read-only variants have none in code either. For read-only tags that is arguably correct — a label has no enabled state — but a tag inside a disabled form section will render at full contrast against greyed-out surroundings.
12. **Figma's `instance` slot is not expressible.** Both tag sets expose an arbitrary-content slot in the leading position; the implementation accepts icon *data* only. The same slot gap exists in [[Tabs]], and it is now a system-wide pattern: Figma models leading content as a slot, the Flutter components model it as an enum-like glyph.
13. **A stray max-width sits on the filter's close node.** Figma constrains the 16px remove affordance to a 460px maximum — a value with no possible effect, presumably left over from an earlier layout. Dead spec.
14. **The pill is nearly invisible against the page.** The neutral fill measures about 1.4:1 against the default surface. Non-text contrast does not strictly require 3:1 for a decorative container, but the consequence is real: a `standard` tag reads as text with a faint wash, so the pill shape does no work distinguishing a tag from prose, and the entire visible difference between `standard` and `critical` is hue. Compare [[Divider]], where the same token was accepted for the same reason.
15. **The registry still lists Figma's `status-label` as a candidate for this file.** It is not — that node is implemented by the status indicator's label form, as documented in [[Status Indicators]]. The candidate note should be cleared so nobody builds an all-caps tag variant to satisfy it.
16. **The component has no tests.** It appears in no test file — not even the semantics-merge regression suite that covers the other interactive components, which is where defect 1 above would have been caught.
17. **`automationIdentifier` is silently ignored for read-only variants.** It is asserted non-empty when provided, then never forwarded, so a caller who passes one gets validation but no hook. Either reject it for read-only variants or forward it.
18. **Only one component in the repository consumes tags**, and only as filter chips inside the multi-select dropdown. There is no in-repo example of a read-only tag outside the widgetbook story, so the `standard` and `critical` guidance here derives from the two sources rather than from observed use.
