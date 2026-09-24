# Component: Button

> Role: The primary action control. Triggers an action; never navigates.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what each variant means and when to use it, and apply to any surface built on this design system. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: Every button MUST have a non-empty visible label. Icon-only controls are a different component.
> Source: Figma `Components` → `button` / `button_critical` / `button_no_theme` (node `7902:7800`). Implementation: `pegasus_flutter/lib/asm/components/button.dart`.

## Overview

A button triggers an action — submitting, confirming, dismissing, starting a flow. It is the most heavily used interactive component and the one most often misused.

**Buttons act; links navigate.** If activating the control takes the user somewhere rather than doing something, it is a link, not a button. This is the single most common misuse.

Buttons come in **eight variants** across **four sizes**, plus a **destructive** modifier. The variant carries emphasis; the size carries density. Both are chosen from context, and neither is a styling preference.

## Anatomy

```
┌─────────────────────────────────────────┐
│  ◇  ┆gap┆   Label text   ┆gap┆  ◇       │  ← container (pill)
└─────────────────────────────────────────┘
   ↑                ↑                ↑
 start icon      label           end icon
 (optional)     (required)      (optional)
      ├── horizontal padding ──┤
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | Pill-shaped (fully rounded). Carries the variant's fill, border, and state layer. |
| **Label** | **Yes** | Always visible, always non-empty. Bold weight (700) at every size. |
| **Start icon** | No | Leading decorative icon. Hidden from assistive tech. |
| **End icon** | No | Trailing decorative icon. Hidden from assistive tech. |
| **Gap** | — | Space between icon and label. Varies by size. |
| **Focus ring** | — | Drawn outside the container on keyboard focus only. See [States](#states). |

The container is **pill-shaped at every size** — a fully rounded stadium shape, not a fixed corner radius. The two borderless text variants are the exception: they have no container to shape, and their focus ring uses an 8px radius instead.

**Label rules:**

- Never empty. A button with no label is not a button — use an icon-only control instead.
- Always bold (700), at every size and variant. Weight is not a variant axis.
- Short and action-led — a verb phrase like "Save changes", not a sentence.
- Never truncated. If the label doesn't fit, the label is too long or the layout is too narrow.

## Sizes

Four sizes. Height is fixed per size; width is driven by content.

| Size | Height | Horizontal padding | Vertical padding | Icon | Gap | Label style |
| --- | --- | --- | --- | --- | --- | --- |
| **large** | 70 | 24 | 23 | 20 | 12 | body.large-emphasized (16 bold) |
| **medium** | 60 | 24 | 18 | 20 | 8 | body.large-emphasized (16 bold) |
| **small** | 52 | 16 | 12 | 16 | 8 | body.large-emphasized (16 bold) |
| **xsmall** | 48 | 16 | 8 | 16 | 8 | body.small-emphasized (12 bold) |

Notes on the scale:

- **Only `xsmall` changes the type size** — the other three all use 16px bold. Size is expressed through padding and height, not type, until the smallest step.
- **Icon size steps once**, at the `medium` → `small` boundary: 20px above, 16px below. See [[Icons]].
- **The gap steps once**, at `large` → `medium`: 12px, then 8px everywhere below.
- **Every size meets the 48×48 minimum touch target** — `xsmall` sits exactly at the floor.

Choosing a size:

1. **`medium` is the default.** Use it unless the context argues otherwise.
2. **`large`** for prominent, high-commitment moments — a promotional CTA, an onboarding primary action, a hero surface.
3. **`small`** for dense UI — inline actions, table rows, compact panels.
4. **`xsmall`** for the tightest contexts only. Note it drops to 12px type, so it is genuinely less legible; do not use it to fit a layout that is simply too crowded.

**Never mix sizes within a button group.** All buttons in a row or a dialog footer share one size.

### A note on the Figma size names

The Figma component uses different size labels than the implementation. They map one-to-one:

| Figma | Implementation | Height |
| --- | --- | --- |
| `huge` | `large` | 70 |
| `spacious` | `medium` | 60 |
| `default` | `small` | 52 |
| `compact` | `xsmall` | 48 |

Note that Figma's `default` is **not** the implementation's default size. When reading a Figma spec, translate through this table rather than assuming the names agree.

## Variants

Eight variants, ordered by emphasis.

| Variant | Container | Label | Use for |
| --- | --- | --- | --- |
| **filled** | `primary` | `on-primary` | The one primary action on a surface |
| **tonal** | `surface-container-high` | `primary` | Secondary actions with visible weight |
| **outline** | Transparent + 1px `on-surface-variant` border | `on-surface` | Secondary actions that must not compete |
| **text** | None (padded) | `on-surface` | Low-emphasis, tertiary actions |
| **textNoPadding** | None (no padding) | `on-surface` | Text button flush to a layout edge |
| **ghost** | `mcafee.extended.ghost` (translucent) | `mcafee.extended.white` | Buttons over imagery or gradient |
| **strictBlack** | `mcafee.extended.black` | `mcafee.extended.white` | Fixed black — ignores theme |
| **strictWhite** | `mcafee.extended.white` | `mcafee.extended.black` | Fixed white — ignores theme |

### Emphasis hierarchy

```
filled  >  tonal  >  outline  >  text  >  textNoPadding
 highest                                    lowest
```

**One `filled` button per surface.** It marks the single most likely action. Two filled buttons side by side is the most common button anti-pattern in the system — it forces the user to decide which is primary when the UI should already have.

Pair by stepping down the hierarchy: `filled` + `outline`, or `filled` + `text`. Never `filled` + `filled`.

### The strict variants ignore the theme

`strictBlack` and `strictWhite` use fixed black and white and **deliberately bypass the color scheme** — they look identical in light and dark mode. They exist for surfaces that are themselves theme-independent, such as a fixed-dark promotional panel or a photographic background.

Because they don't respond to the theme, they carry real risk: a `strictWhite` button on a surface that becomes white in some mode disappears. **Only use a strict variant when the surface behind it is also theme-independent.** If the surface is themed, use `filled`, `tonal`, or `outline`.

### ghost is for imagery, not for transparency

`ghost` uses a translucent dark fill with a white label, so it reads on photography and gradients where neither `filled` nor `outline` holds up. It is **not** a general-purpose transparent button — for that, use `text`.

### textNoPadding is a layout tool

`textNoPadding` is `text` with its horizontal padding removed, so the label aligns flush with surrounding content. Use it when a text button must optically align to a column edge or a body paragraph. Everywhere else, use `text` — the padding is part of the touch target.

### A text button MUST carry an affordance

This is the most important rule for the two text variants, and it doesn't apply to any other variant.

A text button has **no container** — no fill, no border, no shape. Its label is `on-surface`, which is the same near-black used for body copy, at the same 16px size. The only thing distinguishing it from static text is its bold weight. That is not enough. A user scanning a surface has no reason to believe that bold text is clickable, so a lone text button on its own reads as a heading or a piece of emphasized copy and simply never gets clicked.

Every text button therefore needs one of two affordances:

**1. Pair it with another button.** When a text button sits beside a `filled`, `tonal`, or `outline` button, the neighbor establishes the region as a set of actions and the text button inherits that reading. This is the standard case — a dialog footer, a form's action row, a card's actions:

```
┌──────────────────────────────────────────┐
│                                          │
│              Cancel   ( Save changes )   │
│                 ↑            ↑           │
│           text button    filled button   │
│        reads as an action because        │
│        it sits in a row of actions       │
└──────────────────────────────────────────┘
```

**2. Give it an icon.** When a text button stands alone, an icon supplies the affordance the container would otherwise provide. Use a directional glyph that signals where the action leads — a chevron for "this continues somewhere", an external-link glyph for a new context, a caret for expanding in place:

```
Learn more  ›            ← chevron: leads onward
View report  ↗           ← leads to another context
Show details  ⌄          ← expands in place
```

The icon is doing semantic work here, not decoration. It tells the user this text opens onto something. A standalone text button with no icon and no button neighbor is a defect, not a style choice.

Note the icon slots are hidden from assistive technology by design, so this affordance is **purely visual** — it fixes discoverability for sighted users. Screen reader users already receive the button role and are unaffected. That's the correct split: the icon compensates for the missing visual container, and the role compensates for nothing being missing semantically.

This is more acute in this system than in most, because the text variants also carry **no state layer** — see [States](#states). There is no hover tint to reward a speculative mouseover, so a user who is unsure whether the text is clickable gets no confirmation from hovering it. The affordance has to be present at rest.

## Destructive

Any of `filled`, `tonal`, and `text` can be marked **destructive**, which repaints it on the error ramp. This is the Figma `button_critical` set.

| Variant | Destructive container | Destructive label |
| --- | --- | --- |
| filled | `error` | `on-error` |
| tonal | `error-container` | `on-error-container` |
| outline | *not supported* | — |
| text | Transparent | `error` |

Rules:

- **Destructive is a modifier, not a variant.** It changes the color ramp of the variant you already chose.
- **Only `filled`, `tonal`, and `text` honor it.** On `outline`, `ghost`, `textNoPadding`, and the strict variants the flag is silently ignored — so a destructive outline button will render as an ordinary one. Choose a supported variant when the action is destructive.
- **Reserve it for genuinely destructive actions** — deleting, revoking, permanently discarding. Not for "Cancel", which is merely dismissive.
- **Never rely on color alone** to communicate destructiveness. The label must say what will happen: "Delete account", not "Confirm".
- **A destructive action styled as `text` is still destructive.** Use the flag rather than approximating with an error-colored label.

## States

Buttons implement the full state model in [[States]]. The state layer color comes from the button's state role, and the opacity from the state.

| State | Layer | Additional |
| --- | --- | --- |
| Enabled | None | Resting |
| Hover | 8% | Pointer cursor |
| Focus | 10% | **Focus ring** (2px `primary`, offset outside) |
| Pressed | 10% | — |
| Dragged | 16% | — |
| Disabled | None | Container and label both at 38%; no cursor, not focusable |

### State roles per variant

Which state role a variant uses is not uniform — it's chosen so the overlay reads against that variant's own background:

| Variant | State role | Notes |
| --- | --- | --- |
| filled | `primary` (or `error` when destructive) | Light overlay on a dark fill |
| tonal | **Mixed** — `neutral` for hover/focus, `primary` for pressed/dragged | See below |
| outline | `neutral` | |
| ghost | `neutral` | |
| strictBlack | `primary` | White overlay on black |
| strictWhite | `neutral` | Dark overlay on white |
| text | **None** | No state layer at all |
| textNoPadding | **None** | No state layer at all |

**`tonal` deliberately mixes roles.** Hover and focus *darken* it via the neutral role; pressed and dragged *lighten* it via the primary role. This is intentional in the design — the button darkens as you approach it and flashes lighter on commit.

**The text variants have no state layer.** Their hover and pressed feedback comes from the cursor and the focus ring alone. This is a real divergence from [[States]] and is flagged in [Open Items](#open-items).

The practical consequence is a discoverability problem rather than a cosmetic one: a user who hovers a text button to test whether it's clickable gets no response. This is why a text button must carry a visible affordance at rest — see [A text button MUST carry an affordance](#a-text-button-must-carry-an-affordance).

### The focus ring

Focus is the state that matters most and the one most often broken. Buttons draw a **branded focus ring** rather than relying on a tint:

- **2px, `primary`, drawn outside the container** via a transparent inset, so it causes no layout shift.
- **Follows the button's shape** — a stadium ring on pill variants, an 8px-radius ring on the two text variants.
- **Keyboard only.** The ring appears for Tab and directional navigation, never after a plain mouse click.

The keyboard-only rule is harder than it sounds on desktop. Windows gives buttons focus when they're clicked; macOS generally does not — and both report the same focus-highlight mode, so highlight mode alone cannot distinguish a Windows pointer-click focus from real keyboard traversal. The implementation therefore tracks whether focus arrived from a pointer and suppresses the ring in that case, restoring it on the next key press. **Do not reimplement this per-button** — it is handled centrally and getting it wrong means either a missing ring for keyboard users or a spurious ring on every click.

### Disabled

Disabled buttons render both container and label at **38%**, are announced as disabled, are removed from the tab order, and show the default cursor rather than a pointer.

Note this differs from the generic treatment in [[States]] (12% container / 38% content) — buttons apply 38% to both, matching Figma's whole-container opacity. Flagged in [Open Items](#open-items).

- **Disabled means temporarily unavailable.** If it will never be available, don't render it.
- **Say why.** A disabled submit button with no indication of what's missing is a dead end.
- **Never disable the only way out of a flow.**

## Behaviors

**Width is content-driven.** Height is fixed per size; width grows with the label. Buttons do not stretch to fill their container by default, and there is no full-width variant — if a layout needs one, that is a layout decision imposed from outside, not a button property.

**Labels never truncate.** A button sizes to its label. If the result overflows, the fix is a shorter label or a wider container.

**Text scaling.** Labels wrap and grow with OS text scale up to 200%. Because heights are fixed minimums rather than fixed heights, buttons grow instead of clipping.

**Icons are decorative.** Both icon slots are hidden from assistive technology, because the label already conveys the action. This prevents "Save, save icon" double announcements.

**Icon sizing is automatic.** Icons inherit their size from the button's size — you pass the glyph, not a size. Never override it.

**Activation.** Click, tap, Enter, Space, and Numpad Enter all activate. Nothing extra is needed per button.

**Loading and async.** There is no built-in loading state. For an async action, disable the button while in flight and communicate progress outside it. Do not swap the label to "Loading…" — that changes the accessible name mid-interaction.

## Decision Tree

```
Does activating this control DO something, or GO somewhere?
├── GO somewhere ──────────────────────────→ use a Link, not a button
└── DO something
    │
    ├── Does it only record an opinion about
    │   content on screen? ───────────────────→ [[Feedback]], not a button
    │
    ├── Is it icon-only, with no visible text?
    │   └── yes ─────────────────────────────→ use an icon-only control
    │
    ├── Is the action destructive (deletes / revokes / discards)?
    │   └── yes → set destructive, and pick filled / tonal / text only
    │
    ├── Is the button on imagery or a gradient?
    │   └── yes ─────────────────────────────→ ghost
    │
    ├── Is the surface theme-independent (fixed dark or light)?
    │   └── yes ─────────────────────────────→ strictBlack / strictWhite
    │
    └── Otherwise, choose by emphasis:
        ├── The single most likely action here? ──→ filled   (max one per surface)
        ├── Secondary, needs visible weight?   ──→ tonal
        ├── Secondary, must not compete?       ──→ outline
        ├── Tertiary / low emphasis?           ──→ text
        └── Tertiary, flush to a layout edge?  ──→ textNoPadding

If you chose text or textNoPadding:
└── Is it beside another (filled / tonal / outline) button?
    ├── yes ──────────────────────────────────→ no icon needed
    └── no  ── standalone ────────────────────→ MUST add an icon
                                                (chevron / external-link / caret)

Then choose size:
├── Promotional / hero moment  → large
├── Default                    → medium
├── Dense UI, table rows       → small
└── Tightest contexts only     → xsmall  (drops to 12px type)
```

## Accessibility

Buttons are accessible by construction — the label is required and asserted non-empty, so an unlabeled button cannot be built. The remaining obligations:

| Requirement | How it's met |
| --- | --- |
| **Announceable name** | The visible label. Required, non-empty. |
| **Button role** | Set by the underlying control; do not add your own. |
| **Keyboard activation** | Enter, Space, Numpad Enter. Automatic. |
| **Visible focus** | 2px `primary` ring, keyboard-only. Automatic. |
| **Touch target** | ≥48×48 at every size; `xsmall` sits at the floor. |
| **Disabled announced** | Announced as disabled and removed from tab order. |
| **Decorative icons silenced** | Both icon slots hidden from assistive tech. |
| **Contrast** | Label meets text contrast against its container in both themes. |

**Overriding the announced name.** When the visible label is too terse to be meaningful out of context — repeated "Delete" buttons in a list — provide a longer announced label ("Delete invoice 4521") while keeping the visible text short. Use this to *expand* on the label, never to say something different.

**Tooltips.** Add one when the button needs a discoverable hover hint. Tooltips are surfaced to assistive tech as a hint, not as the name — a tooltip is never a substitute for a label.

**Automation identifier.** Every button carries a required stable identifier for UI test automation, forwarded to the platform accessibility layer (`resource-id` on Android, `accessibilityIdentifier` on iOS, UIA on Windows). It is **required**, kebab-case, derived from purpose (`login-submit-button`). Keep the three string slots distinct:

| Slot | Purpose | Spoken? |
| --- | --- | --- |
| Label | Visible text, default announced name | Yes |
| Semantic label | Override when the visible label is too terse | Yes |
| Automation identifier | Stable handle for test tooling | No |

**What you do not need to do:** wrap the button in your own semantics, set a button role, or manage focus. All of it is wired up. Adding another semantics ancestor fights the inherited tree and can produce a second, nameless tap target.

## Anti-Patterns

**❌ Two `filled` buttons on one surface.** The most common misuse. It removes the hierarchy the variant exists to express. → One `filled`; step the other down to `outline` or `text`.

**❌ A button that navigates.** → Use a link. The distinction matters for screen readers, which announce them differently, and for user expectation about what happens next.

**❌ An icon-only "button".** Removing the label breaks the accessible name. → Use the icon-only control, which requires a semantic label.

**❌ Mixing sizes in one group.** → All buttons in a row or dialog footer share a size.

**❌ Using `xsmall` to fit a cramped layout.** It drops to 12px type and hurts legibility. → Fix the layout.

**❌ Destructive styling on an unsupported variant.** Setting destructive on `outline`, `ghost`, or a strict variant does nothing and silently renders a normal button. → Use `filled`, `tonal`, or `text`.

**❌ "Cancel" as destructive.** Dismissing isn't destroying. → Use `text` or `outline`, undecorated.

**❌ A standalone `text` button with no icon.** With no container, no state layer, and `on-surface` label color, it is visually indistinguishable from bold body copy and won't be recognized as clickable. → Pair it with another button, or add a directional icon.

**❌ A strict variant on a themed surface.** `strictWhite` on a surface that goes white in some mode vanishes. → Use `filled`, `tonal`, or `outline`.

**❌ Overriding icon size.** → Size comes from the button's size. Pass the glyph only.

**❌ Hardcoding padding, height, or color.** → All of it comes from the size spec and the token layer. See [[Spacing]] and [[Color]].

**❌ Swapping the label to communicate progress.** Changing "Save" to "Saving…" mutates the accessible name mid-interaction. → Disable and report progress elsewhere.

**❌ Removing the focus ring because it looks wrong.** → Fix the offset or the surrounding layout. Never remove focus indication.

**❌ Vague labels.** "OK", "Submit", "Yes" don't say what happens. → Use a verb phrase: "Delete account", "Save changes".

**❌ Adding your own semantics wrapper.** → Already handled; a second wrapper can create a nameless tap target.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmButton`, from `pegasus_flutter/lib/asm/components/button.dart`.

### Enums

```dart
enum AsmButtonVariant {
  filled, tonal, text, textNoPadding, ghost, outline, strictBlack, strictWhite,
}

enum AsmButtonSize { large, medium, small, xsmall }
```

**`variant` defaults to `AsmButtonVariant.text`** and **`size` defaults to `AsmButtonSize.large`** — neither default matches the guidance above (`filled` for the primary action, `medium` as the standard size). **Always pass both explicitly.**

### Basic usage

```dart
AsmButton(
  label: 'Save changes',
  variant: AsmButtonVariant.filled,
  size: AsmButtonSize.medium,
  onPressed: _handleSave,
  automationIdentifier: 'save-changes-button',
);
```

`label`, `onPressed`, and `automationIdentifier` are the parameters you always think about. `label` and `automationIdentifier` are **required**; `automationIdentifier` is asserted non-empty.

### With icons

```dart
AsmButton(
  label: 'Download',
  variant: AsmButtonVariant.filled,
  size: AsmButtonSize.medium,
  startIcon: const Icon(Icons.download),
  onPressed: _download,
  automationIdentifier: 'download-button',
);
```

Pass a bare `Icon` with **no `size:`** — the button injects the correct size for its own size step and wraps the icon to hide it from assistive tech.

### Destructive

```dart
AsmButton(
  label: 'Delete account',
  variant: AsmButtonVariant.filled,
  size: AsmButtonSize.medium,
  destructive: true,
  onPressed: _confirmDelete,
  automationIdentifier: 'delete-account-button',
);
```

`destructive` is honored only for `filled`, `tonal`, and `text`.

### Disabled

```dart
AsmButton(
  label: 'Continue',
  variant: AsmButtonVariant.filled,
  size: AsmButtonSize.medium,
  onPressed: isValid ? _continue : null, // null = disabled
  automationIdentifier: 'continue-button',
);
```

**Passing `null` to `onPressed` is how you disable a button.** There is no `disabled` flag. The disabled visuals, semantics, cursor, and focus removal all follow automatically.

### Overriding the announced label

```dart
AsmButton(
  label: 'Delete',
  semanticLabel: 'Delete invoice 4521',
  variant: AsmButtonVariant.text,
  size: AsmButtonSize.small,
  destructive: true,
  onPressed: () => _delete(4521),
  automationIdentifier: 'delete-invoice-4521-button',
);
```

`semanticLabel` is asserted non-empty when provided — pass `null` to inherit the visible label.

This example assumes the button sits in a row alongside other actions. If it were the only action in the row, it would need an icon — see below.

### A standalone text button

A text button with no button neighbor needs an icon to read as clickable:

```dart
AsmButton(
  label: 'Learn more',
  variant: AsmButtonVariant.text,
  size: AsmButtonSize.medium,
  endIcon: const Icon(Icons.chevron_right),
  onPressed: _openArticle,
  automationIdentifier: 'learn-more-button',
);
```

Use `endIcon` rather than `startIcon` for directional glyphs — the icon reads as "and then this happens", which only works trailing the label.

### A primary/secondary pair

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.end,
  spacing: AsmTokens.spacing.spacing300,
  children: [
    AsmButton(
      label: 'Cancel',
      variant: AsmButtonVariant.text,
      size: AsmButtonSize.medium,
      onPressed: _dismiss,
      automationIdentifier: 'modal-cancel-button',
    ),
    AsmButton(
      label: 'Save changes',
      variant: AsmButtonVariant.filled,
      size: AsmButtonSize.medium,
      onPressed: _save,
      automationIdentifier: 'modal-save-button',
    ),
  ],
);
```

Note the shared size, the single `filled`, and the gap taken from the spacing scale rather than a literal. The `Cancel` text button needs no icon here — the adjacent `filled` button establishes the row as actions.

### Full parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `String` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `onPressed` | `VoidCallback?` | No | `null` (disabled) |
| `variant` | `AsmButtonVariant` | No | `text` |
| `size` | `AsmButtonSize` | No | `large` |
| `destructive` | `bool` | No | `false` |
| `startIcon` | `Widget?` | No | `null` |
| `endIcon` | `Widget?` | No | `null` |
| `semanticLabel` | `String?` | No | `null` (inherits `label`) |
| `tooltip` | `String?` | No | `null` |

### Guidance

- **Always pass `variant` and `size` explicitly** — the defaults are `text` and `large`.
- **A standalone `text`/`textNoPadding` button needs an `endIcon`.** Nothing enforces this, so it's on the call site. If the button has a `filled`/`tonal`/`outline` sibling in the same row, omit it.
- **Disable with `onPressed: null`**, never with an opacity wrapper or `IgnorePointer`.
- **Never set `size:` on an icon** you pass to a slot.
- **Never wrap in your own `Semantics`** — the label, role, and identifier are wired. A second wrapper can emit a nameless tap node.
- **Never wrap in `GestureDetector`** to add behavior; that produces a competing tap target.
- **Never add `Padding`** to adjust the button's size. Use the size step.
- **Never use `Opacity`** to fake disabled.
- **Never override the shape** — pill is not configurable.
- The label's bold weight and even leading distribution are applied internally; don't pass a `TextStyle`.

---

## Rules

1. Every button MUST have a non-empty visible label. Icon-only controls are a different component.
2. Buttons trigger actions. A control that navigates MUST be a link.
3. **One `filled` button per surface.** NEVER two.
4. Buttons MUST be paired by stepping down the emphasis hierarchy — `filled` + `outline` or `filled` + `text`.
5. All buttons in a group MUST share one size.
6. `medium` is the default size and `filled` the variant for a primary action; both MUST be passed explicitly, because the widget's own defaults differ.
7. Destructive is a modifier on `filled`, `tonal`, or `text` ONLY — it is silently ignored elsewhere.
8. Destructive actions MUST say what they destroy in the label. Never rely on color alone.
9. Strict variants MUST only be used on theme-independent surfaces.
10. `ghost` MUST be used ONLY on imagery and gradients — NEVER as a general-purpose transparent button.
11. A `text` or `textNoPadding` button MUST carry an affordance — either a neighboring `filled`/`tonal`/`outline` button, or a directional icon. NEVER standalone with text alone.
12. Labels NEVER truncate. Shorten the label or widen the container.
13. Icon size comes from the button's size — NEVER override it.
14. Disable by removing the action handler. NEVER fake disabled with opacity.
15. The focus ring is keyboard-only and MUST NEVER be removed or weakened.
16. Every button MUST carry a stable automation identifier.
17. NEVER hardcode padding, height, radius, or color — all come from the size spec and tokens.
18. NEVER add a semantics or gesture wrapper around a button.
19. NEVER mutate the label to communicate progress. Disable and report elsewhere.
20. Labels MUST be verb phrases naming the action. NEVER "OK", "Submit", or "Yes".
21. Every size MUST retain a ≥48×48 touch target, including at 200% text scale.

---

## Open Items

1. **Text variants have no state layer.** `text` and `textNoPadding` set their overlay to fully transparent, so they show no hover, focus, or pressed tint — feedback comes only from the cursor and focus ring. This contradicts [[States]], which requires every interactive element to express those states. Either the variants should adopt a `neutral` layer or [[States]] should record the exception. Adding a hover layer would also directly reduce the discoverability problem below, since hovering would then confirm clickability.
2. **The text-button affordance rule is unenforced and unrepresented.** A standalone `text` button with no icon is visually indistinguishable from bold body copy, but nothing prevents building one: the widget has no assertion, and Figma's `text` and `text-no-padding` variants are drawn without icons, so the component library's own default composition is the failure case. Options are a lint rule, a debug assertion requiring an icon when no sibling button is detectable, or at minimum an icon-bearing variant in Figma so the correct usage is the one designers reach for.
3. **`on-surface` for text-button labels may be the root cause.** The label uses the same near-black as body copy at the same size, differing only in weight. Material gives text buttons the `primary` color specifically so they read as interactive. Whether Assemble's choice is deliberate — plausible, since `md.sys.color.primary` is itself `#000000` in the light theme, which would make a `primary` label no more distinguishable — is worth confirming. If `primary` is black by design, then no color change can solve this and the icon affordance is load-bearing rather than a nicety.
4. **Disabled treatment diverges from [[States]].** Buttons render container and content both at 38%, following Figma's whole-container opacity; [[States]] specifies 12% container / 38% content. One of the two is wrong.
5. **Disabled container uses `outline`, not `on-surface`.** The implementation derives the disabled background from `colorScheme.outline` at 38%, while [[States]] specifies `on-surface`. Worth confirming which is intended.
6. **Two vertical padding values are off the spacing scale.** `large` uses 23 and `medium` uses 18 — neither exists in the scale documented in [[Spacing]], and both are marked in code as raw Figma values. This violates the closed-set rule; either the scale needs these steps or the Figma spec should snap to 20 and 16.
7. **Figma has no `focus` variant.** The component set covers `default`, `hover`, `pressed`, and `disabled` only. Focus is implemented entirely in code, so the design source cannot be used to verify focus appearance.
8. **Figma and code disagree on size names.** Figma uses `huge` / `spacious` / `default` / `compact`; the implementation uses `large` / `medium` / `small` / `xsmall`. Figma's `default` maps to `small`, which is actively misleading. Worth renaming on one side.
9. **Touch-target minimum was stated inconsistently across docs, and is now settled at 48×48.** This document and the Flutter accessibility rules always used 48×48; [[Icons]] and [[States]] said 44×44 and have been corrected. `xsmall` at 48 satisfies it exactly, with no margin — any future reduction of `xsmall` breaks the floor.
10. **The widget's defaults contradict the guidance.** `variant` defaults to `text` and `size` to `large`, whereas the documented defaults are `filled` for a primary action and `medium` for size. A call site that omits both gets a large text button, which is rarely what's wanted.
11. **No loading state exists.** Async actions are handled by disabling, with progress communicated externally. If a spinner-in-button pattern is wanted, it isn't specified.
12. **No full-width variant exists.** Buttons are content-width. Whether a stretched button is permitted, and how, is unspecified — relevant at SM widths per [[Breakpoints]].
13. **`outline` uses a raw 1px border width.** The border is constructed with a literal rather than the `md.border.size.100` token, despite the token existing.
14. **Stale hex values in the legacy button doc.** `Design System/Components/Button.md` hardcodes `Icons/Primary: #000000` and `Icons Color: #737374`. That doc predates the token layer and should be reconciled or retired.
