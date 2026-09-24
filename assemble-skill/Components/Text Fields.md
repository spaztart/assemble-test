# Component: Text Fields

> Role: A bounded region where the user types a value the system cannot predict — a name, an address, a coupon code, a search term. It accepts free text. It is not a picker, not a toggle, and not a place to render values the user may only choose between.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The label MUST persist once the user starts typing. NEVER use the placeholder as the label — a field whose only naming disappears the moment it is filled leaves the user unable to check their own work, and leaves assistive tech with a field that has no name.
> Source: Figma `Components` → `text-field` (`1-2204`; 120 symbols across `Style` × `State` × `Text configurations` × `Leading icon` × `Trailing icon` — including `1:2514` Outlined/Enabled, `1:2503` Outlined/Focused, `1:2493` Outlined/Hovered, `1:2481` Outlined/Error, `1:2470` Outlined/Disabled, `1:2462` Label-text, `1:2415` Placeholder-text, `1:2653` Error with both icons, `1:2691` both icons, `1:3205` Filled/Enabled, `1:3193` Filled/Focused, `1:3182` Filled/Hovered, `1:3169` Filled/Error, `1:3157` Filled/Disabled). Implementation: `pegasus_flutter/lib/asm/components/text_field.dart` and `text_form_field.dart`.

## Overview

A text field is the answer to a question whose answer the system cannot enumerate. "What is your street address?" has infinitely many valid answers, so it is a text field. "Which country?" has 195, so it is a [[Menu]]. "Do you want marketing email?" has two, so it is a [[Switch]] or a [[Checkbox]]. **The number of possible answers, not the length of them, decides whether this is the right component.**

**The distinction most often got wrong is label versus placeholder.** They look interchangeable in a mockup and are not interchangeable in use. The label names the field permanently — it is what the field *is*. The placeholder is a disposable example of the shape of an acceptable answer, and it is destroyed by the first keystroke. A field labelled only by its placeholder is unnamed as soon as it is filled, which means a user reviewing a long form cannot tell what they answered, a user who was interrupted cannot resume, and a screen reader has nothing to announce. Every field in this system carries a label. The placeholder is optional and always has been.

**The second distinction is supporting text versus error text.** Supporting text is standing guidance — the format, the constraint, the reason the field exists. Error text is a transient statement that the current value is wrong. They occupy the same line beneath the field, and the error replaces the guidance while it is showing. This is the component's most consequential trade: **while an error is displayed, the user cannot see the rule they broke.** Design around it by writing errors that restate the rule ("Use 8 or more characters", not "Invalid password") rather than by trying to show both.

**The third distinction is which of the two field widgets to reach for.** They are one component with one visual contract. The difference is who owns the error string: a plain field is told what its error is by whoever renders it, and a form field derives its own error from a validator that a surrounding form runs. Use the form field when the value is submitted as part of a form; use the plain field for search boxes, filters, inline edits, and anything whose error comes back from a server. See [Validation](#validation).

## Anatomy

One horizontal row inside the container, with a label that floats onto the top edge and a supporting row hanging below it.

```
        ┌─LABEL─┐                            ← floated label, on the border
┌───────┴───────┴──────────────────────────────┐
│  ◔  ┆4┆  Input text│         ┆4┆  ◇         │  ← 56 container
└──────────────────────────────────────────────┘
  ↑          ↑     ↑                 ↑
 leading   input  caret          trailing
  icon     text                    icon

  Supporting text                        32/500
  ↑                                        ↑
  supporting / error text            character counter
  (sits below the container, +20)
```

At rest, with nothing typed, the label sits *inside* the field where the input text will go — there is no second resting element. The placeholder replaces it only when the label has already floated.

| Part | Required | Notes |
| --- | --- | --- |
| Container | Yes | 56 tall. Radius 12 — all four corners on `outlined`, top two only on `filled`. |
| Label | Effectively yes | Names the field. Rests inside, floats onto the top edge on focus or once a value exists. Omitting it is possible and almost always wrong. |
| Input text | Yes | The user's value. 16pt, one line by default. |
| Caret | Yes | 16 tall, zero width. Drawn only when the field is focused. |
| Placeholder | No | An example answer, shown only while the field is empty. Disappears on the first keystroke. |
| Leading icon | No | 20 glyph. Decorative by default — a search glass, a currency mark. |
| Trailing icon | No | 20 glyph or an icon button — reveal, clear, open-picker. **Displaced by the error indicator whenever an error is showing.** |
| Supporting text | No | One short line of standing guidance beneath the field. |
| Error text | Conditional | Replaces the supporting text while the value is invalid. |
| Character counter | No | Sits at the end of the supporting row. Only meaningful when there is a limit the user can hit. |

The container has no header, no second input, and no room for two values. A field that needs a start and an end is two fields (see [[Date Picker]]'s range form).

## Sizes

There is one size.

| Measurement | Value | Source |
| --- | --- | --- |
| Container height | 56 | Figma; every one of the 120 symbols is 56 tall |
| Content row height | 48 | Figma `h-[48px]` on the content column |
| Total footprint with supporting text | 76 | 56 + the 20-tall supporting row, which hangs *below* the container |
| Sample width | 210 | Figma symbol bounds only — **not a spec.** The field fills the width it is given. |
| Horizontal padding | 16 | Figma `px-[16px]`; `spacing400` |
| Vertical padding | 4 | Figma `py-[4px]`; `spacing100` — applied twice (state layer and content) |
| Gap, icon to text | 4 | Figma `gap-[4px]`; `spacing100` |
| Corner radius | 12 | Figma `md/border/radius/12` — see [Open Items](#open-items) for Figma's own inconsistency |
| Resting border | 1 | Figma `border` / 1px active indicator |
| Focus and error border | 3 | Figma `border-3` on both variants — the implementation uses 3 only for `filled` |
| Icon glyph | 20 × 20 | Figma `size-[20px]` |
| Icon slot, total | ~44 | Figma: the 20 glyph inside 12 of inner padding plus 4 of outer |
| Supporting row | 20 tall, 4 top padding, 16 horizontal | Figma `h-[20px] pt-[4px] px-[16px]` |
| Gap, supporting text to counter | 10 | Figma `gap-[10px]` — **off the [[Spacing]] scale**, which steps 8 → 12 |
| Label, floated | 12pt mono / 400 / line-height 1.0 / uppercase | Figma `label/mono/medium-mono` |
| Input and placeholder | 16pt / 400 / line-height 1.5 | Figma `body/large` |
| Supporting, error, counter | 12pt / 400 / line-height 1.3 | Figma `body/small` |

**The 56 is a design intent, not a ceiling.** The implementation never fixes the height, so the field grows when the supporting text wraps or the user's text scale is enlarged. That is the correct behaviour and the more useful contract: assume 56 when laying out a row of fields, but never position anything on the assumption that 56 is what you will get.

**Reserve the 20 below the field whether or not you use it.** Supporting text hangs outside the container, so a field with supporting text overlaps whatever sits beneath a field without it. If some fields in a form have supporting text and others do not, either give them all a line or space the rows for the tallest.

## Variants

| Variant | Boundary at rest | Fill | Radius | Use when |
| --- | --- | --- | --- | --- |
| `outlined` | 1 stroke on all four sides | None — transparent | All four corners | The default. Fields on a plain page, in a form, in a dialog. |
| `filled` | 1 rule along the bottom edge only | Solid, brightest surface | Top two corners only | Fields on a busy or coloured surface where a four-sided stroke competes with the surroundings. |

The two are not interchangeable within a view. **Pick one per surface and use it for every field on that surface** — a form mixing outlined and filled fields reads as though the two groups behave differently.

### `outlined` — the default, and the one to use unless you have a reason

Fully transparent at rest, so it inherits whatever it sits on and its whole visual weight is the 1px stroke. That stroke is the field's only signal that it is a field at all, and it is faint: it measures **2.0:1 against the surface it sits on, below the 3:1 non-text contrast floor** (see [Accessibility](#accessibility)). This is why the label matters so much here — in practice the label, not the box, is what tells the user there is something to fill in.

### `filled` — a bottom rule, not a box

The filled variant is a solid block with a rule underneath and no side or top strokes. Its top corners are rounded and its bottom corners are square, which makes it read as sitting *on* a line rather than being enclosed. Two consequences:

- **It needs the fill to be visible.** On a surface that is already the brightest surface, a filled field is a bottom rule and nothing else.
- **Its focus and error treatments thicken the rule to 3.** All of the state change happens on one edge, which is a smaller signal than the outlined variant's four-sided thickening — acceptable, but do not add a second reduction on top of it (for example, placing a filled field on a low-contrast panel).

## States

Follows [[States]]. The field carries rest, hover, focus, error, and disabled. There is no pressed state — a text field is not pressed, it is entered.

| State | Boundary | Fill | Content |
| --- | --- | --- | --- |
| Rest | 1, `outline` | Variant's base | Label inside the field, or floated with the value shown |
| Hover | 1, `on-surface` — the stroke darkens, it does not thicken | Base plus the neutral hover overlay | Figma also switches the **input text to bold**; the implementation does not |
| Focus | 3 | Base | Caret drawn; label floated and recoloured |
| Error | 3, error red | Base | Label recoloured to error; an error glyph appears in the trailing slot; the error string replaces the supporting text |
| Disabled | 1 | Figma adds a 4% `on-surface` wash; the implementation does not | Everything drops to 38% opacity; the field refuses focus |

**Focus is not a ring here — it is the field's own boundary.** This is the one component in the system that does not paint the branded focus indicator around itself, because the boundary it already has can carry the state. That is deliberate and it is why the focus border is three times the resting one: the thickening *is* the focus affordance, so it must be unmistakable. Do not wrap a text field in an additional focus ring; you get two competing indicators.

**Hover and focus do not compose.** A focused field that is also hovered shows the focused treatment. Error outranks both.

**Error outranks everything, including the trailing icon.** When an error is showing, the error glyph takes the trailing slot — a clear button, a reveal eye, or a picker affordance placed there is replaced, not shifted. Where the trailing affordance is essential to *resolving* the error (a password reveal on a rejected password is the obvious case), the error state removes the user's means of fixing it. Put the essential affordance outside the field rather than in the trailing slot.

**The counter disappears when an error appears.** Same mechanism, same problem: the "473 remaining" the user needed is gone exactly when they are most likely to be over the limit. If a length limit is the thing being validated, say the number in the error string.

## Behaviors

**The field fills its width and must be given a bounded one.** It has no intrinsic width. A field in an unbounded horizontal context is an error, and a field in a very narrow one truncates its supporting text — the reason the supporting line is allowed to wrap to three lines rather than one.

**One line by default; multi-line is possible and unspecified.** The default is a single line that scrolls horizontally as the user types past the end. The implementation accepts a line count above one, which turns the field into a growing text area — but **Figma draws no multi-line variant at all**, so a multi-line field's height, label behaviour, and supporting-text position are unspecified. Use it knowing there is no design source for it.

**The label floats on focus or on content, and does not come back.** Empty and unfocused, the label is inside the field. Focus it, or put a value in it, and the label rises onto the top edge, shrinks to 12pt, switches to the mono face, and uppercases. It stays floated for as long as there is a value. This is why the placeholder is only ever visible in the floated-label state — the two never occupy the same space.

**Supporting and error text wrap to three lines, then truncate.** A single line silently truncates real validation messages mid-word in a narrow field, so three lines is the bound. It also means an error can grow the row by up to 40, which is the second reason not to lay out on the assumption of 56.

**Text scale.** The container grows with the text because nothing fixes its height. The icon slots do not grow, so an icon becomes proportionally smaller and harder to hit as text scales up. The floated label sits on the boundary regardless of scale.

**Obscured text is always one line.** A password field ignores any multi-line request, which is correct — a wrapped password is unreadable and reveals its length.

**Read-only is not disabled.** A read-only field is focusable, selectable, copyable, and full-contrast; a disabled field is none of those. Use read-only for a value the user may read and copy but not change (an account number, a generated key). Use disabled for a value that is unavailable until something else happens, and say what that something is nearby — a disabled field with no explanation is the single most common dead end in a form.

## Validation

Validation is the field's whole reason for having an error state, and it has three separable decisions.

**When to validate.** Never on every keystroke — a user typing an email address is "wrong" for the entire time they are typing it, and a field that turns red on the second character is telling them off for not having finished. Validate on blur, or on submit, or after the first submit attempt on every subsequent change. The last is the best default for a form: silent until the user has said they are done, then live.

**Who owns the error.** Either the field derives it from a validator that a surrounding form runs, or whoever renders the field passes the error string in. These are exclusive, and the two widgets split along exactly this line — see [Flutter Usage](#flutter-usage). A field whose error comes from a server (a rejected coupon code, a username already taken) needs the passed-in form, because no local validator can know the answer.

**What the message says.** An error must let the user fix the value without hunting for the rule that is now hidden behind the error itself:

- **Restate the constraint, don't just deny.** "Use 8 or more characters" beats "Password too short", which beats "Invalid".
- **Name what is wrong, not who is wrong.** "Enter an email address" not "You entered an invalid email".
- **Be specific about format.** "Use MM/DD/YYYY" beats "Invalid date".
- **Never blame the user and never use an exclamation mark.**
- **Include the number when the limit is the problem** — the counter is gone while the error shows.

**Enforce and display the same limit.** A field can silently refuse input past a maximum, and it can display a count against a limit, and these are two independent settings. Set both to the same number or the counter will describe a limit the field is not applying — or worse, the field will stop accepting characters with no counter on screen explaining why.

**Required-ness must be visible before submission.** Nothing in the component marks a field as required. If a field is mandatory, the label or the supporting text has to say so; discovering it via a red border after pressing Submit is the failure mode this component makes easy.

## Content

- **Label: one or two words, sentence case, a noun.** "Email", "Street address", "Coupon code". It is uppercased automatically when it floats — write it in sentence case, not caps.
- **Never put a colon on the label**, and never write it as a question ("What is your email?").
- **Placeholder: an example, not an instruction.** "name@example.com" is a placeholder. "Enter your email" is an instruction and it belongs nowhere — the label already says what to enter. "Optional" is not a placeholder either; that goes in the supporting text.
- **Never write a placeholder that duplicates the label.** A field labelled "Email" with placeholder "Email" wastes the one slot that could have shown the expected format.
- **Supporting text: the constraint or the reason, one line.** "We'll only use this to send your receipt." "8 or more characters." Not a restatement of the label.
- **Do not use supporting text for anything the user must not miss.** It is small, low in the hierarchy, and destroyed by any error. Something that must be read goes in an [[Alert Banner]].
- **Counter: only where the limit is real and reachable.** A counter on a 500-character note is useful. A counter on a 254-character email field is noise that tells the user they are being measured.
- **Sentence case throughout, and no trailing period on labels or placeholders.** Supporting text and errors are sentences and take a period only if they are more than a fragment.

## Decision Tree

```
Can the system enumerate the valid answers?
├── yes, exactly two ────────────────────→ use a [[Switch]] or a [[Checkbox]]
├── yes, a handful (2–6, all visible) ───→ use [[Radio]] items
├── yes, a list ─────────────────────────→ use a [[Menu]] (dropdown)
├── it is a date ────────────────────────→ use a [[Date Picker]]
│                                          (its field form is this component,
│                                           wired to a calendar)
└── no — the answer is free text
    │
    ├── Is it a phone number, currency,
    │   or other masked format? ──────────→ text field with the input
    │                                        restricted to what it accepts
    │
    ├── Is it a password or secret? ──────→ text field, obscured, with a
    │                                        reveal control outside the
    │                                        trailing slot
    │
    ├── Is it a search box that filters
    │   what is already on screen? ───────→ text field, no error state,
    │                                        leading search glyph
    │
    └── It is a value being submitted
        ├── inside a form, validated
        │   locally? ─────────────────────→ the form-aware field
        └── error comes from a server, or
            there is no form? ────────────→ the plain field, error passed in

Which variant?
├── The surface is plain ────────────────→ `outlined`
└── The surface is busy or coloured, and
    a four-sided stroke competes ────────→ `filled` (all fields on it)
```

## Accessibility

| Requirement | Rule |
| --- | --- |
| Announced as a text field | The role is explicit, not inferred from appearance. |
| Every field has a name | From the visible label. A field with no label needs an announced name supplied another way — but the visible label is the fix, not the override. |
| The name persists | It must survive the field being filled. This is why the placeholder cannot be the label. |
| Error is announced as an error | Not as a second block of supporting text. The field itself reports that it is invalid. |
| Error text is associated with the field | The message is read as part of the field, not as loose text that happens to be nearby. |
| Focus is visible | The 3px boundary. It is the only focus affordance the component has, and it must never be suppressed. |
| Disabled refuses focus | And is announced as disabled. |
| Read-only keeps focus | It is reachable, selectable, and announced as read-only — not as disabled. |
| Colour is not the only error signal | The error state must carry text. The red border and red label are not sufficient on their own. |
| Automation identifier | **Required** on every field, no exceptions. Any interactive icon in a slot needs its own. |
| Touch target | Icon slots are ~44 in Figma and unconstrained in the implementation — **under the 48×48 floor either way.** The field body itself clears it at 56. |

**The error state's only non-colour signal is the text.** The border thickens from 1 to 3 and turns red, the label turns red, a glyph appears — the glyph is the only shape change, and a user who cannot distinguish red sees a slightly thicker border plus an icon. That is thin. **The error message text is therefore load-bearing, not supplementary:** a field put into an error state with no message is inaccessible, and the implementation enforces this by making the error string the thing that triggers the state at all.

**An icon in a slot is decorative until it is a button, and then it needs everything.** A search glyph announces nothing. A reveal control is a button and needs a name that says what it does ("Show password"), keyboard reachability, a focus indicator, and its own automation identifier. Putting a bare tappable glyph in the slot produces an unnamed 20×20 target — see [[Icons]] for the sizing floor.

**Contrast, light theme, against the brightest surface:**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Input text on the field | ~15.9:1 | Passes AAA |
| Floated label on the field | ~15.9:1 | Passes AAA |
| Supporting text and counter | ~10.1:1 | Passes AAA |
| Placeholder, as implemented | ~10.4:1 | Passes AAA |
| Placeholder, as designed in Figma | ~5.05:1 | Passes AA |
| Focus border | ~21:1 | Passes |
| Error border, 3px | ~3.86:1 | Passes (non-text needs 3:1) |
| **Error text, 12pt** | **~3.86:1** | **Below the 4.5:1 needed for text this size** |
| **Resting border, as implemented** | **~2.0:1** | **Below 3:1** |
| **Resting border, as designed in Figma** | **~2.55:1** | **Below 3:1** |
| Disabled foreground at 38% | ~2.3:1 | Exempt as a disabled control, but effectively unreadable |

Three rows matter.

**The resting border fails non-text contrast in both sources.** An `outlined` field at rest is a very faint rectangle — the stroke does about half the work it needs to for a user to see that there is an input there. Figma's value is marginally better than the shipped token's and both are under the floor. The practical consequence is that **the label is doing the job the border is supposed to do**, and a field without one is close to invisible.

**Error text in the error red fails at 12pt.** The red passes as a border, where 3:1 is the bar, and fails as text, where 4.5:1 is. Figma keeps the supporting text neutral in the error state and recolours only the label; the implementation recolours the text as well, which is the more legible-looking and less legible choice. Figma's own floated error label has the same problem at the same size.

**The disabled treatment is at the edge of meaningless.** 38% of the foreground lands near 2.3:1 and the border lands near 1.3:1 — a disabled field is a ghost. That is within the letter of the guidelines and it is why a disabled field always needs an adjacent explanation.

## Anti-Patterns

**❌ Using the placeholder as the label.** The field is unnamed the moment it is filled, unreviewable on a long form, and nameless to assistive tech. → Always give the field a label; make the placeholder an example of the format, or omit it.

**❌ A placeholder that repeats the label.** It occupies the one slot that could have shown the expected format. → "name@example.com", not "Email".

**❌ An instruction in the placeholder.** "Enter your name" says nothing the label does not, and vanishes when it would matter. → Put guidance in the supporting text.

**❌ Validating on every keystroke.** A half-typed email is not an error; showing one is scolding. → Validate on blur or on submit, then live.

**❌ An error state with no message.** The red border alone is invisible to a user who cannot distinguish it and unhelpful to everyone else. → Every error carries text that restates the rule.

**❌ "Invalid input" as an error.** It states that something is wrong and withholds what. → Name the constraint: "Use MM/DD/YYYY".

**❌ Putting the fix for an error in the trailing slot.** The error glyph replaces it, so the reveal button the user needs to check their password disappears at the moment they need it. → Put essential affordances outside the field.

**❌ A counter whose limit the field does not enforce, or a limit with no counter.** The user types past a number they were shown, or is silently blocked at a number nobody mentioned. → Set the enforced and displayed limits to the same value.

**❌ A required field that never says it is required.** The user finds out from a red border after submitting. → Mark it in the label or the supporting text.

**❌ Disabling a field with no explanation.** At 38% it is barely legible and it says nothing about what would make it available. → Say what unlocks it, or do not render it yet.

**❌ Using disabled to mean read-only.** A value the user may read and copy but not change must stay focusable and full-contrast. → Read-only.

**❌ Mixing `outlined` and `filled` in one form.** The two groups read as behaving differently. → One variant per surface.

**❌ Wrapping a field in a focus ring.** The field's own 3px boundary is its focus affordance; a second one is two competing indicators. → Let the boundary do it.

**❌ A text field for a value the system can enumerate.** Free text where a list would do produces typos, invalid values, and validation that could have been avoided. → [[Menu]], [[Radio]], [[Checkbox]], [[Date Picker]].

**❌ Relying on the supporting line for something the user must not miss.** It is small, low, and erased by the first error. → [[Alert Banner]].

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. There are two widgets, both in `pegasus_flutter/lib/asm/components/`:

- **`AsmTextField`** (`text_field.dart`) — the plain field. Its error is a string you pass in.
- **`AsmTextFormField`** (`text_form_field.dart`) — the form-aware field. It has **no `errorText` parameter**; its error comes only from `validator`.

Both wrap Material's own field widgets, so caret, IME, autofill, selection, and platform accessibility come for free. Both are stateful and manage their own focus node and controller when you do not supply one.

### Enums

```dart
enum AsmTextFieldVariant { filled, outlined }            // default: outlined
enum AsmCharacterCountMode { none, countUp, countDown }  // default: none
```

`AsmTextFieldVariant` is declared in `text_field.dart` and shared by both widgets. `countUp` renders `'32/500'`; `countDown` renders `'468'`.

### Basic usage

```dart
AsmTextField(
  automationIdentifier: 'street-address-field',
  controller: _addressController,
  label: 'Street address',
  supportingText: 'Where we should ship your order.',
)
```

`automationIdentifier` is required and asserted non-empty. `label` is optional in the API and effectively mandatory in practice.

### With a placeholder and a leading glyph

```dart
AsmTextField(
  automationIdentifier: 'search-field',
  controller: _searchController,
  label: 'Search',
  placeholder: 'Device name or serial',
  leadingIcon: const Icon(Icons.search),
  onChanged: _runSearch,
)
```

A bare `Icon` in a slot is decorative. It gets no focus, no announcement, and no hit area.

### An actionable trailing affordance

```dart
AsmTextField(
  automationIdentifier: 'coupon-field',
  controller: _couponController,
  label: 'Coupon code',
  trailingIcon: AsmIconButton(
    icon: const Icon(Icons.close),
    variant: AsmIconButtonVariant.iconOnly,
    size: AsmIconButtonSize.small,
    onPressed: () => _couponController.clear(),
    semanticLabel: 'Clear coupon code',
    automationIdentifier: 'coupon-field-clear',
  ),
)
```

Use `AsmIconButton`, never a bare `Icon` wrapped in a gesture detector — the button brings its own hit area, focus ring, hover, disabled handling, and name. Note that this affordance is **replaced** whenever `errorText` is non-null.

### An error passed in from outside

```dart
AsmTextField(
  automationIdentifier: 'coupon-field',
  controller: _couponController,
  label: 'Coupon code',
  supportingText: 'Case-insensitive.',
  errorText: _serverRejection,   // null when valid
)
```

Setting `errorText` is what puts the field in the error state; there is no separate flag. The string must be non-empty — pass `null` to clear it, which is asserted.

### With a character counter

```dart
AsmTextField(
  automationIdentifier: 'note-field',
  controller: _noteController,
  label: 'Note',
  maxLines: 4,
  maxLength: 500,                                     // enforces
  characterCountMode: AsmCharacterCountMode.countUp,  // displays
  characterCountLimit: 500,                           // must match maxLength
)
```

`maxLength` and `characterCountLimit` are independent: the first truncates input, the second only labels it. Set them to the same number. `characterCountLimit` is asserted present when the mode is not `none`, and asserted greater than zero. The counter counts grapheme clusters, so an emoji or a combining sequence counts as one character.

### Form validation

```dart
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: Column(
    children: [
      AsmTextFormField(
        automationIdentifier: 'email-field',
        label: 'Email',
        placeholder: 'name@example.com',
        keyboardType: TextInputType.emailAddress,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        validator: (value) {
          if (value == null || value.isEmpty) return 'Enter an email address';
          if (!value.contains('@')) return 'Use the form name@example.com';
          return null;
        },
        onSaved: (value) => _email = value,
      ),
      AsmButton(
        label: 'Submit',
        automationIdentifier: 'submit-button',
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            _formKey.currentState!.save();
          }
        },
      ),
    ],
  ),
)
```

`AutovalidateMode.onUserInteraction` is the right default — silent until the user has touched the field, live afterwards. `AutovalidateMode.always` reddens the form before the user has typed anything.

**Pass `initialValue` or `controller`, never both** — it is asserted. And note the label-float defect below: an `AsmTextFormField` with neither a `controller` nor an `initialValue` never floats its label.

### Parameters

Shared by both widgets:

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `automationIdentifier` | `String` | **Yes** | — (asserted non-empty) |
| `controller` | `TextEditingController?` | No | `null` (one is created internally) |
| `focusNode` | `FocusNode?` | No | `null` (one is created internally) |
| `label` | `String?` | No | `null` (asserted non-empty when given) |
| `placeholder` | `String?` | No | `null` (asserted non-empty when given) |
| `supportingText` | `String?` | No | `null` (asserted non-empty when given) |
| `leadingIcon` | `Widget?` | No | `null` |
| `trailingIcon` | `Widget?` | No | `null` |
| `variant` | `AsmTextFieldVariant` | No | `outlined` |
| `enabled` | `bool` | No | `true` |
| `obscureText` | `bool` | No | `false` |
| `readOnly` | `bool` | No | `false` |
| `autofocus` | `bool` | No | `false` |
| `maxLength` | `int?` | No | `null` |
| `maxLines` | `int?` | No | `1` (asserted `> 0` when given) |
| `minLines` | `int?` | No | `null` |
| `keyboardType` | `TextInputType?` | No | `null` |
| `textInputAction` | `TextInputAction?` | No | `null` |
| `textCapitalization` | `TextCapitalization` | No | `none` |
| `inputFormatters` | `List<TextInputFormatter>?` | No | `null` |
| `onChanged` | `ValueChanged<String>?` | No | `null` |
| `onSubmitted` | `ValueChanged<String>?` | No | `null` |
| `onEditingComplete` | `VoidCallback?` | No | `null` |
| `onTap` | `VoidCallback?` | No | `null` |
| `semanticLabel` | `String?` | No | `null` (asserted non-empty when given) |
| `forceFocused` | `bool` | No | `false` |
| `characterCountMode` | `AsmCharacterCountMode` | No | `none` |
| `characterCountLimit` | `int?` | With a count mode | `null` (asserted `> 0`) |

`AsmTextField` only:

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `errorText` | `String?` | No | `null` (asserted non-empty when given) |

`AsmTextFormField` only:

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `validator` | `FormFieldValidator<String>?` | No | `null` |
| `autovalidateMode` | `AutovalidateMode?` | No | `null` |
| `onSaved` | `FormFieldSetter<String>?` | No | `null` |
| `initialValue` | `String?` | No | `null` (forbidden with `controller`) |

### Guidance

- **Give every field a `label`.** It is nullable and nothing enforces it. `semanticLabel` is an override for an announced name, not a substitute for a visible one — use it when the visible label is too terse out of context, not to paper over its absence.
- **Do not pass a pre-uppercased `label`.** The widget uppercases it when it floats. Passing `'DATE'` makes the resting label all-caps too, which is what the date field family currently does.
- **Use `AsmTextFormField` only inside a `Form`.** Outside one, nothing calls its validator, so it is a plain field with a dead parameter and no `errorText`.
- **Use `AsmTextField` when the error comes from a server.** `AsmTextFormField` has no way to accept an externally-produced error message.
- **Prefer `inputFormatters` over validation for shape.** Refusing a character is kinder than accepting it and then complaining — `FilteringTextInputFormatter.digitsOnly` on a numeric field prevents an error state that would otherwise be inevitable.
- **`maxLength` does not show a counter.** The widget suppresses Material's built-in one to render its own. A `maxLength` with no `characterCountMode` silently stops accepting input.
- **`onSubmitted` receives the value; `onEditingComplete` does not.** Use the second for side effects like advancing focus in an OTP flow.
- **`textCapitalization` is a soft-keyboard hint only.** It does nothing on a physical keyboard, so it cannot be relied on to normalise input — and it must be verified on a device or simulator, not in a desktop build.
- **Do not put an `AsmFocusIndicator` around a field.** The field's own border is the focus affordance.
- **Do not use `forceFocused`.** It exists so the dropdown anchor can borrow the field's outline as its focus ring while an outer `Focus` owns the tab stop. In application code it produces a field that looks focused and is not.
- **Pass an `automationIdentifier` to every interactive widget you put in a slot**, in addition to the field's own. The field's identifier does not cover its children.
- **`obscureText` forces a single line** regardless of `maxLines`.

---

## Rules

1. Every field MUST have a visible label, and that label MUST persist once a value is present. The placeholder MUST NEVER serve as the label.
2. A placeholder MUST be an example of the expected format. It MUST NEVER duplicate the label or contain an instruction.
3. Supporting text MUST state the constraint or the reason. Anything the user must not miss MUST NEVER live there.
4. A field MUST NEVER validate on every keystroke. Validate on blur, on submit, or live only after the first submit attempt.
5. An error state MUST carry text. Colour and border weight MUST NEVER be the only signals.
6. Error copy MUST restate the constraint so the user can fix the value. It MUST NEVER blame the user and MUST NEVER be "Invalid input".
7. An error message MUST be announced as the field's error, not as loose adjacent text.
8. An affordance required to *resolve* an error MUST NEVER live in the trailing slot — the error indicator replaces it.
9. When a length limit is enforced, the same limit MUST be the one displayed.
10. A required field MUST say so before the user submits.
11. A disabled field MUST be accompanied by an explanation of what would make it available.
12. A value the user may read but not change MUST be read-only, NEVER disabled.
13. One variant per surface. A form MUST NEVER mix `outlined` and `filled`.
14. The field's own boundary is its focus affordance. A field MUST NEVER be wrapped in an additional focus ring, and its focus border MUST NEVER be suppressed.
15. A field MUST be given a bounded width. An unbounded horizontal context is not a supported placement.
16. Layout MUST NOT assume a 56 height — supporting text, errors, and text scale all grow it. The 20 below the field MUST be reserved whether or not supporting text is used.
17. Every field MUST carry a stable automation identifier, and every interactive widget in a slot MUST carry its own.
18. An interactive slot affordance MUST be a named button with a focus indicator and its own hit area. A bare tappable glyph MUST NEVER be used.
19. A leading icon MUST be decorative and MUST NEVER carry information the label does not.
20. A text field MUST NEVER be used where the system can enumerate the valid answers.

---

## Open Items

1. **The focus and error border widths disagree between the two variants, and both class comments describe a third value.** Figma specifies 3 for the focused and errored state of *both* variants (`border-3` on outlined, a 3px inset indicator on filled). The implementation uses 3 for `filled` and **2 for `outlined`**. Meanwhile the class documentation says "Focused / errored states draw a 2 px primary / error border" and the variant enum's own comment says 2 for both. So three sources give three answers, and the shipped outlined field — the default variant, and the overwhelming majority of fields — has the weakest focus affordance of the three. Figma is the design source; outlined should be 3.
2. **`AsmBorderWidths.w200` (2.0) and `w300` (3.0) both exist and neither is used.** All four border widths in the two field widgets are bare `1`, `2`, and `3` literals, and `menu.dart`'s multi-select field goes further with `showFocused || hasError ? 2 : AsmBorderWidths.w100` — a bare literal and a token in the same expression. This is a direct token-discipline violation with the correct tokens already generated and available.
3. **The error indicator silently displaces a caller-supplied trailing icon.** The implementation is explicit that this is intentional ("so the error indicator is never hidden behind an unrelated affordance"), and the reasoning is sound, but the consequence is that a password field's reveal control vanishes in exactly the state where the user needs to check what they typed. The password-reveal component puts the eye in the trailing slot and is therefore affected. Figma has a dedicated `trailing-icon-error` node and does not model the collision.
4. **`AsmTextFormField` duplicates roughly 200 lines of styling rather than delegating, and its class comment claims a parity that does not hold.** It says "All visual styling, accessibility, and interaction behavior match `AsmTextField` exactly", and then reimplements the border helpers, the fill compositing, the hover overlay, the error glyph, and every text style by hand. Any future change to the field's appearance has to be made twice, and defects 6 and 7 below are already the result of the two copies drifting.
5. **`AsmTextFormField` has no `errorText`.** Its error can only come from a validator, so a form field cannot display a server-side or asynchronous error — a rejected coupon code, a username already taken, a card declined. The only workaround is to abandon the form widget for the plain one and lose the form integration that motivated using it.
6. **`AsmTextFormField`'s error icon lags the border by one frame.** Its validator returns the message synchronously but stores it in state inside a post-frame callback, so the border recolours in the frame the validation runs and the trailing glyph appears in the next one. Visible as a flicker on a form that validates on submit.
7. **`AsmTextFormField` never floats its label when it is uncontrolled with no initial value.** Its float condition checks focus, the caller's controller, and `initialValue` — but not the internal controller it creates when given neither. The counter in the same build method *does* read the internal controller. So an uncontrolled form field with no initial value shows a live character count while its label sits behind the text the user is typing.
8. **The character counter is suppressed whenever an error is showing.** Both widgets gate the counter on there being no error. The user loses their remaining-character count precisely when they are most likely to be over the limit, and if the limit *is* what failed validation the number that would explain the failure is the number that has just been hidden. Figma renders the supporting text and the counter as two children of one row and gates neither on the other.
9. **`maxLength` and `characterCountLimit` are unrelated.** One enforces silently, the other displays without enforcing. Nothing ties them together or warns when they differ, so `maxLength: 100` with `characterCountLimit: 500` is a field that stops accepting input at 100 while showing "100/500", and a `characterCountLimit` with no `maxLength` lets the user type to "512/500" with no error. They should be one concept.
10. **Figma's resting label is 12pt uppercase mono *inside* the field; the implementation renders it as 16pt sentence-case sans.** Figma's `Text configurations=Label text` symbol — the resting, empty state — puts the label in `label/mono/medium-mono` in `on-surface-variant` inside the container. There is no 16pt sentence-case resting label anywhere in the Figma set. The implementation deliberately mirrors the placeholder instead ("so the same string would look identical in either slot"), which is a defensible choice made against the design source, and it means the label changes size, family, *and* case when it floats rather than just position and colour.
11. **The date field family passes a pre-uppercased label to work around item 10.** Three call sites pass `label: 'DATE'`, which renders as all-caps 16pt sans at rest. A consumer compensating for a divergence in the component is a sign the divergence is the defect.
12. **Figma's placeholder is `on-background`; the implementation uses `on-surface-variant`.** #786c6c against #423f3e — the shipped placeholder is substantially darker than designed, closer in weight to real input text, which weakens the distinction between an example and a value. `AsmExtendedColors.onBackground` exists and is not used here.
13. **Figma bolds the input text on hover; the implementation does not.** Both variants' `Hovered` symbols set the input string to `body/large-emphasized` (weight 700). Every other state uses the regular weight. Text reflowing on mouse-over is a questionable interaction and the implementation is arguably right to omit it, but the sources disagree and nothing records the decision.
14. **The error text colour fails contrast at its size.** 12pt error red on the field measures ~3.86:1, below the 4.5:1 required for text that small. It passes as a border, where the bar is 3:1. Figma keeps the supporting text neutral in the error state and recolours only the floated label — which is both the more accessible choice for the message and, at 12pt mono, has the same problem for the label. Needs a darker error-text role.
15. **The resting border fails non-text contrast in both sources.** The shipped `outline` token measures ~2.0:1 against the brightest surface; Figma's value measures ~2.55:1. Both are under 3:1, so an `outlined` field at rest does not meet the floor for a control boundary in either the design or the implementation.
16. **The `outline` token itself has drifted.** Figma resolves `md/sys/color/outline` to #a2a2a2; the generated Dart token is #BCB6B6. This is not a text-field decision — it affects every bordered component — but the text field is where it is most consequential, because the border is the entire visual definition of the default variant. Worth a full sweep of the generated ramp against the Figma variables.
17. **Figma's own radius is internally inconsistent.** Most nodes carry 12. The disabled overlays carry 8. `Filled/Hovered` and `Filled/Error` carry 4 on their outer nodes. `Filled/Disabled` carries 8 on one corner and the 12 variable on the other. The implementation uses 12 everywhere, which is almost certainly the intent — but the file needs cleaning before anyone reads a state's radius off it.
18. **The icon slots have no minimum size at all.** Both slots are constrained to a zero minimum in each dimension, so a bare `Icon` in a slot is a 20×20 element with no hit area and an `AsmIconButton` supplies its own. Figma wraps both slots in icon-button instances at roughly 44 total. Neither reaches the 48×48 floor, and the implementation's zero floor means the value depends entirely on what the caller passes.
19. **Figma models filter chips inside the field and the component has no slot for them.** Every symbol carries a `showFilter` slot containing a filter-tag instance, so the design source describes a multi-select field whose selections render as removable chips inside the container. The Flutter field cannot do this, and the multi-select dropdown solves it by abandoning the component and hand-rolling its own outlined container. See item 20.
20. **There are three hand-rolled copies of this component's chrome, and they have drifted.** `text_field.dart`, `text_form_field.dart`, and the multi-select field inside `menu.dart` each construct the borders, radius, fill, and text styles independently. The menu's copy uses a mono type ramp for its supporting and error text where the field uses the sans one, and mixes a bare `2` with a token in its border width. Any of the fixes above has to be applied in three places.
21. **A type token's documentation names a consumer that does not consume it.** `bodyMonoSmall`'s comment says it is "Used by `AsmTextField` supporting / error text". The field uses `bodySmall`. Figma specifies `body/small`, so the field is correct and the token comment is wrong — but this is a new failure category: the drift is in a *token's* documentation, pointing at a component, which is a direction nothing was checking.
22. **The 10px gap between the supporting text and the counter is off the [[Spacing]] scale**, which steps 8 → 12. It joins the stray 10s already noted in [[Popover]] and [[Sheets]].
23. **The disabled treatment differs between the sources.** Figma layers a 4% `on-surface` wash over the field *and* drops the content to 38%. The implementation applies only the 38%, and for the filled variant fades the fill itself to 38% rather than adding a wash. The result is lighter than designed, on a treatment that is already at the edge of legibility.
24. **Neither widget excludes the inner field's semantics.** Both wrap the field in a semantics node carrying a role, an optional label, and the automation identifier, without collapsing the subtree — so a supplied `semanticLabel` may be announced alongside the inner field's own name rather than instead of it. The dropdown anchor sets the collapse explicitly on its own wrapper, which suggests the base widgets need it too. Compare the opposite defect in [[Tags]], where the collapse is applied too broadly.
25. **`forceFocused` is a public parameter that exists for one internal caller.** Its only purpose is to let the dropdown anchor borrow the field's outline as a focus ring. In application code it produces a field that permanently looks focused. It should be library-private.
26. **Multi-line is implemented and undesigned.** The line count is settable above one and Figma has no multi-line symbol, so a text-area field's height, label float, and supporting-text placement have no design source. Every one of the 120 Figma symbols is 56 tall and single-line.
27. **The 56 height is Figma's and is not enforced anywhere.** The implementation never constrains the height, so the field grows with text scale and wrapped supporting text — which is the better behaviour and the reason the class comment's "56 px container" claim is wrong. Worth stating as an intent rather than a dimension.
28. **Figma's supporting text sits outside the container and the implementation lets it grow to three lines.** Figma models it as a fixed 20-tall row hanging 20 below the field; the implementation wraps to three lines before truncating, citing a real ticket, and the repository's only dedicated test for this component pins exactly that behaviour. So the code is right and Figma under-models the case — but nothing in Figma tells a designer the row can triple.
29. **The counter's format is unspecified in Figma.** The sample counter reads `50`, which is consistent with either a countdown or a bare limit and matches neither of the implementation's two formats exactly. Nothing in the design source says which is intended, or when.
30. **Test coverage is one file covering one behaviour.** The most-consumed component in the repository — five in-repo consumers — has a single dedicated test, covering supporting-text and error-text wrapping. There is no test for the variant borders, the hover treatment, the label float, the counter, the error-icon displacement, or the semantics wrapper, which is why items 1, 6, and 7 are all live.
31. **Figma draws no read-only state.** The state axis is enabled / focused / hovered / error / disabled. Read-only is an implementation-only concept, used by the dropdown anchor and the date fields, with no design treatment distinguishing it from an ordinary enabled field — so a read-only field currently invites typing it will silently ignore.
32. **Nothing expresses required-ness.** Neither source has a required marker, an asterisk, or a required flag, so every form in the system communicates required-ness by convention in its own copy. This is a system-level gap, not a component defect, but it is the reason rule 10 exists as prose rather than as a parameter.
33. **A dead max-width sits on every icon slot.** Figma constrains the icon-button instances in both slots to a 460px maximum, a value with no possible effect at 20px. The same leftover appears on [[Tags]]' remove affordance and the filter chip's close node.
