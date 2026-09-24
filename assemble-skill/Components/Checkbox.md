# Component: Checkbox

> Role: An independent binary choice. Selects zero or more options from a set, or toggles one setting that takes effect on submit.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A checkbox takes effect on SUBMIT. If the change applies immediately, use a [[Switch]].
> Source: Figma `Components` → `Checkbox` (node `6526-37340`). Implementation: `pegasus_flutter/lib/asm/components/checkbox.dart`.

## Overview

A checkbox is a small square that can be checked, unchecked, or — when enabled — indeterminate. It represents a choice the user makes now and commits later.

**Two boundaries define when a checkbox is correct**, and both are commonly got wrong:

| Component | Choice | Timing |
| --- | --- | --- |
| **Checkbox** | Zero or more, independent | Takes effect on **submit** |
| **[[Radio]]** | Exactly one from a set | Takes effect on **submit** |
| **[[Switch]]** | On or off, one setting | Takes effect **immediately** |

So: several independent options that commit together → checkbox. One choice from mutually exclusive options → radio. A setting that acts the moment it's flipped → switch.

The submit-versus-immediate distinction is the one people miss. A checkbox that applies instantly leaves the user with no way to reconsider, and no submit button to explain what happened.

## Anatomy

```
┌─────────────────────────────────────────┐
│  ╭───────╮                              │
│  │   ✓   │   Label text                 │   ← whole row is the target
│  ╰───────╯                              │
└─────────────────────────────────────────┘
   ↑    ↑         ↑
 box  glyph     label
(18px)         (optional)

     ┌─────────────────┐
     │  ·············  │  48×48 hit target
     │  ·  ╭─────╮  ·  │  40×40 circular state layer
     │  ·  │  ✓  │  ·  │  18×18 box
     │  ·  ╰─────╯  ·  │
     │  ·············  │
     └─────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Box** | Yes | 18×18, 4px radius, 2px border. |
| **Glyph** | — | A check when checked, a dash when indeterminate, nothing when unchecked. |
| **State layer** | — | 40×40 circle behind the box. Carries hover, focus, pressed. |
| **Hit target** | — | 48×48, invisible, always present. |
| **Label** | No | To the right of the box. When present, the whole row is the target. |

**The state layer is circular while the box is square.** That's deliberate and matches Material — the layer reads as a halo around the box, not as an extension of it.

**The 48×48 hit target exists independently of the box.** An 18px box would be far below the touch minimum, so the box is centered inside a 48×48 region that is entirely tappable. Never wrap a checkbox in something that clips this — a checkbox in a tightly-sized container loses two thirds of its target.

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Hit target | 48 × 48 | — |
| State layer | 40 × 40, circular | — |
| Box | 18 × 18 | — |
| Box border | 2 | `md.border.size.200` |
| Box radius | 4 | `md.border.radius.*` |
| Glyph | 14 | — |
| Label style | 14 regular | `body.medium` |
| Focus ring radius | Fully rounded | `cornerFull` |

All of these are hardcoded literals in the implementation rather than token references — see [Open Items](#open-items).

## Values

Three values, not two.

| Value | Box | Glyph | Meaning |
| --- | --- | --- | --- |
| **Unchecked** | Outlined, no fill | None | Not selected |
| **Checked** | Filled | Check | Selected |
| **Indeterminate** | Filled | Dash | Partially selected — some children checked, some not |

**Indeterminate is opt-in** and must be enabled explicitly. It is not a state the user can reach directly by clicking; it is a state the *application* sets to describe a mixed group.

The canonical use is a parent checkbox over a list: all children checked → parent checked; none → unchecked; some → indeterminate. Nothing else should produce it.

**Indeterminate is not "unknown" and not "loading".** It means specifically *partially selected*. Using it for a value that hasn't loaded yet miscommunicates — a screen reader announces it as "mixed", which is meaningless if nothing is mixed.

**Enabling indeterminate changes the click cycle.** A normal checkbox alternates unchecked ↔ checked. With indeterminate enabled it cycles unchecked → checked → indeterminate → unchecked, which means **the user can click their way into the indeterminate state**. That is usually wrong: for the parent-of-a-list case the parent should be a plain two-value checkbox whose displayed value is *derived* from its children, with indeterminate set by the application rather than reachable by clicking. Enable the three-value cycle only when the user genuinely should be able to select "mixed" on purpose, which is rare.

## Error

Error is a **modifier**, orthogonal to the value. It composes with all three values, giving six appearances.

| | Normal | Error |
| --- | --- | --- |
| **Unchecked** | `primary` border | `error` border |
| **Checked** | `secondary` fill | `error` fill |
| **Indeterminate** | `secondary` fill | `error` fill |

The error treatment recolors the box, the label, and the state layer.

- **Error is for a validation failure on this specific choice** — a required checkbox left unchecked, most commonly a terms-acceptance box.
- **Never rely on the red alone.** The checkbox turning red says something is wrong but not what. Pair it with a message; see [[Text Fields]] for how field-level errors are presented.
- **Error is not a severity dial.** There is no warning tier. Either the choice is invalid or it isn't.

## States

Checkboxes follow [[States]]. The state role is `secondary` normally and `error` when the error modifier is set.

| State | Treatment |
| --- | --- |
| Enabled | No layer |
| Hover | State layer tinted at 8% |
| Focus | State layer at 10%, plus the branded focus ring |
| Pressed | State layer at 10% |
| Disabled | Whole control at 38%; box drawn in `on-surface` |

**The state layer is the 40×40 circle**, so hover and focus feedback appears as a halo around the box rather than a change to the box itself.

**Disabled applies a single 38% opacity to the entire control** — box, glyph, and label together — and redraws the box in `on-surface` so a disabled checked box looks the same regardless of whether it was in error. It leaves the tab order and is announced as disabled.

Note that disabled reads 38% for both container and content, which matches [[Button]] but diverges from the 12%/38% split in [[States]]. Flagged in [Open Items](#open-items).

**The focus ring is fully rounded** even though the box is a 4px-radius square — it follows the hit region, not the box.

## Behaviors

**The whole row is the target when a label is present.** Clicking the label toggles the checkbox. This is not optional politeness; a label that isn't clickable is a real usability defect, and it's handled here — don't wrap the label separately.

**Without a label, the target is the 48×48 region around the box.** This is the case that needs care: a bare checkbox has no visible label, so its accessible name must come from somewhere. See [Accessibility](#accessibility).

**Labels wrap and never truncate.** A long label wraps to multiple lines; the box stays vertically centered against the wrapped block.

**Activation is by click, Enter, Space, or Numpad Enter.**

**The checkbox is fully controlled.** It does not track its own value — it renders what it's given and reports what was requested. A checkbox whose value never changes in response is a control that visibly does nothing.

**No motion.** The glyph appears and disappears without transition.

## Content

**The label states what checking the box does or means**, phrased positively.

- "Email me about new features" — clear.
- "Do not email me" — a negative label makes the checked state a double negative. Invert it.
- Sentence case, no terminal period.
- Keep it short enough to scan in a list of options.

**Never phrase a checkbox label as a question.** "Receive emails?" reads as a prompt awaiting an answer, when the box itself is the answer.

**Group related checkboxes under a group label**, which the checkbox does not provide — the surrounding layout owns it. A set of options with no group label leaves the user guessing what they have in common.

## Decision Tree

```
Does the change take effect IMMEDIATELY, with no submit step?
├── yes ─────────────────────────────────────→ [[Switch]]
└── no — it commits on submit
    │
    ├── Must the user pick EXACTLY ONE from a set?
    │   └── yes ────────────────────────────→ [[Radio]]
    │
    ├── Is it a single yes/no gate on a form (terms, opt-in)?
    │   └── yes ────────────────────────────→ CHECKBOX (single)
    │
    └── Zero or more independent options?
        └── CHECKBOX (group)
            │
            ├── Is there a parent controlling a list of children?
            │   └── yes → parent shows indeterminate when partially selected
            │             (set by the app — do NOT enable the 3-value click cycle)
            │
            └── Did validation fail on this specific choice?
                └── yes → set the error modifier, AND show a message
```

**Checkbox vs. [[Switch]]** is the boundary most often crossed. Ask only: does anything happen when the user clicks it? If yes, it's a switch. If the effect waits for a submit button, it's a checkbox.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Checkbox role** | Announced as a checkbox. |
| **Value announced** | Checked, unchecked, or mixed. |
| **Announceable name** | The visible label, or an explicit override. |
| **Keyboard activation** | Enter, Space, Numpad Enter. |
| **Tab-reachable** | One tab stop. Disabled boxes are skipped. |
| **Visible focus** | Branded ring, keyboard-only. |
| **Touch target** | 48×48 always, independent of the 18px box. |
| **Disabled announced** | Announced as disabled and removed from the tab order. |
| **Error not color-only** | **Caller's responsibility** — see below. |
| **Automation identifier** | Required. |

**A checkbox with no label and no override has no accessible name.** This is the failure mode to watch for. The pattern is common in tables — a selection checkbox per row, no visible label — and it produces a control announced as just "checkbox, unchecked". Either supply an override that names what the row is ("Select invoice 4521"), or ensure the surrounding row provides the context.

**The error modifier is not announced.** It changes color only. A screen-reader user gets no indication that a checkbox is in error, so the accompanying message must be associated with the control by the surrounding form — the checkbox cannot do it. This is the component's most significant accessibility gap; see [Open Items](#open-items).

**Indeterminate announces as "mixed"**, which is correct only if the value genuinely means partially-selected. Using it for anything else produces a confusing announcement.

**Group labels are the caller's job.** A set of checkboxes needs a group name for screen-reader users to know what the options belong to.

**Automation identifiers must be unique per box.** In a list or table, compose from a stable per-row field so each is independently targetable. See [[Button]] for the three-string-slots distinction.

## Anti-Patterns

**❌ A checkbox that applies immediately.** → [[Switch]].

**❌ Checkboxes for mutually exclusive options.** → [[Radio]].

**❌ A single checkbox where only one of two options is valid.** "Check for A, leave unchecked for B" hides option B. → Two radios.

**❌ A negatively phrased label.** "Don't send me email" makes checked mean don't. → Invert it.

**❌ A question as a label.** → A statement.

**❌ Using indeterminate for unknown or loading.** It announces as "mixed". → Use a determinate value, or don't render yet.

**❌ Enabling the three-value cycle for a parent-of-a-list.** Lets the user click into "mixed", which means nothing as an intentional choice. → Two-value checkbox whose value the app derives.

**❌ A bare checkbox with no accessible name.** Common in tables. → Supply a semantic label.

**❌ Relying on the error color alone.** Not announced at all. → Always pair with a message.

**❌ Constraining the checkbox smaller than 48×48.** Silently destroys the touch target. → Let it claim its space.

**❌ Wrapping the label in its own tap handler.** The row is already the target; a second handler competes. → Pass the label to the checkbox.

**❌ Wrapping in your own semantics.** Role, value, and identifier are wired. → Leave them.

**❌ A checkbox with no group label in a set.** → The surrounding layout provides one.

**❌ A shared automation identifier across rows.** → Compose from a per-row field.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmCheckbox`, from `pegasus_flutter/lib/asm/components/checkbox.dart`.

`AsmCheckbox` is **fully controlled** — it renders the value you give it and calls back with the next requested value. You own the state.

### Basic usage

```dart
class _FormState extends State<MyForm> {
  bool _acceptedTerms = false;

  @override
  Widget build(BuildContext context) {
    return AsmCheckbox(
      value: _acceptedTerms,
      label: 'I accept the terms of service',
      onChanged: (next) => setState(() => _acceptedTerms = next ?? false),
      automationIdentifier: 'accept-terms-checkbox',
    );
  }
}
```

`value`, `onChanged`, and `automationIdentifier` are required. Note `onChanged` receives `bool?`, so a two-value checkbox still needs to handle the nullable type.

### Error state

```dart
AsmCheckbox(
  value: _acceptedTerms,
  label: 'I accept the terms of service',
  isError: _submitted && !_acceptedTerms,
  onChanged: (next) => setState(() => _acceptedTerms = next ?? false),
  automationIdentifier: 'accept-terms-checkbox',
);
```

`isError` recolors the box, label, and state layer. **It does not announce anything** — render a message beside the checkbox as well.

### Disabled

```dart
AsmCheckbox(
  value: false,
  label: 'Unavailable option',
  onChanged: null, // null = disabled
  automationIdentifier: 'unavailable-checkbox',
);
```

### Indeterminate parent over a list

```dart
class _SelectAllState extends State<SelectAll> {
  final Set<String> _selected = {};

  bool? get _parentValue {
    if (_selected.isEmpty) return false;
    if (_selected.length == widget.items.length) return true;
    return null; // partially selected
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AsmCheckbox(
          value: _parentValue,
          tristate: true, // required because value can be null
          label: 'Select all',
          onChanged: (_) => setState(() {
            // Two-way toggle: clicking the parent selects all or clears all.
            // Never cycles the user into the indeterminate state.
            if (_selected.length == widget.items.length) {
              _selected.clear();
            } else {
              _selected.addAll(widget.items.map((i) => i.id));
            }
          }),
          automationIdentifier: 'select-all-checkbox',
        ),
        for (final item in widget.items)
          AsmCheckbox(
            value: _selected.contains(item.id),
            label: item.name,
            onChanged: (next) => setState(() {
              next == true ? _selected.add(item.id) : _selected.remove(item.id);
            }),
            automationIdentifier: 'select-${item.id}-checkbox',
          ),
      ],
    );
  }
}
```

Two things to note. **`tristate: true` is required whenever `value` can be `null`** — an assert fires otherwise. And the handler ignores the value it's given, deriving the next state from the children instead, so the user cannot click into indeterminate even though the three-value cycle is enabled. That's the correct pattern for a parent checkbox.

### A bare checkbox in a table row

```dart
AsmCheckbox(
  value: _selected.contains(invoice.id),
  semanticLabel: 'Select invoice ${invoice.number}',
  onChanged: (next) => _toggle(invoice.id, next),
  automationIdentifier: 'select-invoice-${invoice.id}-checkbox',
);
```

With no visible label, `semanticLabel` is what gives the checkbox an accessible name. Without it the control announces as an unnamed checkbox.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `bool?` | **Yes** | — |
| `onChanged` | `ValueChanged<bool?>?` | **Yes** | — (`null` = disabled) |
| `automationIdentifier` | `String` | **Yes** | — |
| `label` | `String?` | No | `null` |
| `isError` | `bool` | No | `false` |
| `tristate` | `bool` | No | `false` |
| `semanticLabel` | `String?` | No | `null` (inherits `label`) |

### Guidance

- **`tristate: true` is mandatory when `value` may be `null`.** The assert is debug-only, so a release build renders a null value on a two-value checkbox without complaint.
- **`onChanged` always receives `bool?`.** Coalesce with `?? false` for a two-value checkbox rather than force-unwrapping.
- **Always pass `semanticLabel` when there's no visible `label`.**
- **Pair `isError` with a visible message** — it announces nothing on its own.
- **Never constrain the checkbox below 48×48.** A `SizedBox(width: 24)` around it destroys the touch target invisibly.
- **Never wrap the label in its own `GestureDetector`** — pass it as `label` and the row becomes the target.
- **Never wrap in your own `Semantics`** — role, checked state, mixed state, and identifier are wired.
- **Never use `Opacity` to fake disabled** — pass `onChanged: null`.
- **In a list, compose `automationIdentifier` from a stable per-row field.**
- `label` is a `String`, not a widget, so rich or multi-styled labels aren't supported — see [Open Items](#open-items).

---

## Rules

1. A checkbox takes effect on SUBMIT. Immediate-effect controls MUST be a [[Switch]].
2. Mutually exclusive options MUST use [[Radio]], never a set of checkboxes.
3. Labels MUST be phrased positively. NEVER a negative or a question.
4. Indeterminate means PARTIALLY SELECTED. NEVER use it for unknown or loading.
5. A parent-of-a-list MUST derive its value from its children and MUST NOT let the user click into indeterminate.
6. Every checkbox MUST have an accessible name — a visible label or an explicit override.
7. The error modifier MUST be paired with a message. It announces NOTHING on its own.
8. NEVER constrain a checkbox below 48×48.
9. The whole row MUST be the target when a label is present — never the box alone.
10. Labels MUST wrap, never truncate.
11. Disable by removing the change handler. NEVER fake disabled with opacity.
12. NEVER add a semantics or gesture wrapper around a checkbox.
13. A set of checkboxes MUST have a group label, supplied by the surrounding layout.
14. Every checkbox MUST carry a stable, UNIQUE automation identifier.
15. NEVER hardcode the box, glyph, or hit-target dimensions at a call site.

---

## Open Items

1. **The error modifier is not exposed to assistive technology.** `isError` changes color only — no semantics flag, no announced state, no association with a message. A screen-reader user has no way to know a checkbox is in error. Flutter's semantics layer does not currently expose a validation flag for checkboxes, so the fix may need to be a labelled error message the form associates with the control. Either way this is the component's most significant accessibility gap, and it applies equally to [[Radio]].
2. **Every dimension is a hardcoded literal.** Hit target 48, state layer 40, box 18, border 2, radius 4, glyph 14 are all raw `static const double` values rather than token references. Border 2 and radius 4 have exact token equivalents (`md.border.size.200`, the 4 step of the radius scale) and should use them. 48, 40, 18, and 14 have no token equivalents, which is the same missing icon-size and control-size gap flagged in [[Icons]].
3. **Unchecked and checked use different color roles.** An unchecked box draws its border in `primary`, but a checked box fills with `secondary`. So the box changes hue when toggled, not just fill. That may be intentional per Figma, but it's unusual and worth confirming — Material uses one role for both.
4. **The state role is `secondary` while the unchecked border is `primary`.** The state layer resolves from the `secondary` state role, which matches the checked fill but not the unchecked border. A hover on an unchecked box therefore tints in a hue unrelated to the border it surrounds.
5. **Disabled uses 38% for everything.** A single opacity is applied to the whole control, diverging from the 12% container / 38% content split in [[States]]. Consistent with [[Button]], which suggests [[States]] may be the doc that's wrong — worth resolving once, globally.
6. **The disabled box is drawn in `on-surface` before the 38% opacity is applied**, so a disabled error checkbox is indistinguishable from a disabled normal one. Defensible (nothing is actionable) but it means error state is lost rather than muted.
7. **`label` is a `String`, not a widget.** A checkbox label containing a link — "I accept the terms of service" where "terms of service" is a link — cannot be expressed. This is an extremely common requirement for exactly the terms-acceptance case this component is most used for. There is no supported composition; a caller must render the label separately and lose the row-as-target behavior.
8. **The label padding and focus radius use the alias names rather than the scale.** `paddingXSmall` resolves to `spacing100` (4) and `cornerFull` resolves to `AsmCornerRadii.r999`, so both are correct — but the token layer exposes two parallel vocabularies for the same values (`spacing100`…`spacing1200` alongside `paddingXSmall`…`paddingXLarge`, and `cornerSmall`…`cornerFull` alongside `r0`…`r999`). Components mix them freely, so the same 4px value appears as `spacing100`, `paddingXSmall`, and a literal `4` across the library. [[Spacing]] should name one vocabulary as canonical.
9. **No group component exists.** Group label, group semantics, and layout for a set of checkboxes are all left to the caller, so every consumer reimplements them. [[Radio]] has the same gap and needs it more acutely, since a radio group is meaningless without grouping.
10. **Figma has no `focus` variant**, consistent with [[Button]], [[Accordion]], and [[Alert Banner]] — focus is code-only.
11. **The six documented Figma variants compose from two axes** (three values × normal/error), which the implementation models correctly as `value` + `isError`. Worth confirming Figma also models it as two axes rather than six discrete variants, since six discrete variants would drift the moment a third axis appears.
12. **No motion on the glyph.** The check appears instantly. Material animates the checkmark stroke; no motion tokens exist system-wide to specify an alternative.
