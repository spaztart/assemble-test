# Component: Radio

> Role: Exactly one choice from a small set of mutually exclusive options. Takes effect on submit.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A radio NEVER exists alone. It is always one of a group, and the group — not the radio — owns the selection.
> Source: Figma `Components` → `Radio` (node `1-1174`). Implementation: `pegasus_flutter/lib/asm/components/radio.dart`.

## Overview

A radio is a ring that fills with a dot when selected. It represents one option in a set where exactly one must be chosen.

**The group is the component; the radio is a part of it.** A single radio is meaningless — there's nothing for it to be exclusive against, and once selected it cannot be cleared. Every radio belongs to a group that owns the selected value, and the group is what carries the accessibility contract: the group role, the arrow-key navigation, and the single tab stop.

That last point is the one that surprises people. **A group of five radios is one stop in the tab order, not five.** Tab moves into the selected radio (or the first if nothing is selected), the arrow keys move the selection among them, and the next Tab leaves the group entirely. This is the standard radio pattern and it's why radios can't be treated as five independent controls that happen to sit near each other.

| Component | Choice | Timing |
| --- | --- | --- |
| **Radio** | Exactly one from a set | Takes effect on **submit** |
| **[[Checkbox]]** | Zero or more, independent | Takes effect on **submit** |
| **[[Switch]]** | On or off, one setting | Takes effect **immediately** |
| **[[Menu]]** (dropdown) | Exactly one from a **long** set | Takes effect on submit |

Radio and dropdown do the same job; the difference is how many options and whether they should all be visible. Radios show every option at once, which is their advantage and their limit.

## Anatomy

```
   Group                                   ← the group's own label is
   ┌─────────────────────────────────────┐   the LAYOUT's job, not the
   │  ╭───╮                              │   group component's
   │  │ ● │   Fastest                    │   ← selected
   │  ╰───╯                              │
   │  ╭───╮                              │
   │  │   │   United States              │   ← unselected
   │  ╰───╯                              │
   │  ╭───╮                              │
   │  │   │   Europe                     │
   │  ╰───╯                              │
   └─────────────────────────────────────┘

     ┌─────────────────┐
     │  ·············  │  48×48 hit target
     │  ·  ╭───────╮ · │  40×40 circular state layer
     │  ·  │  ╭─╮  │ · │  24×24 ring, 2px stroke
     │  ·  │  ╰─╯  │ · │  12×12 dot when selected
     │  ·  ╰───────╯ · │
     │  ·············  │
     └─────────────────┘
```

| Part | Required | Notes |
| --- | --- | --- |
| **Group** | **Yes** | Owns the selected value. A radio without one is an error. |
| **Ring** | Yes | 24×24, 2px stroke. |
| **Dot** | — | 12×12, centered. Present only when selected. |
| **State layer** | — | 40×40 circle. Carries hover, focus, pressed. |
| **Hit target** | — | 48×48, invisible, always present. |
| **Label** | No | To the right of the ring. When present, the whole row is the target. |
| **Group label** | **Yes, in practice** | **Not part of the component** — the layout must supply it. |

**The dot is exactly half the ring's diameter.** 12 inside 24.

**The 48×48 hit target is independent of the 24px ring**, which is what puts the visible gap between the ring and its label — the ring sits centered in a 48px box, leaving 12px of clear space on each side. There is no separate gap value.

**The group label is missing from the component and required by the design.** A set of radios with no name tells the user nothing about what they're choosing between. The layout owns it; see [Accessibility](#accessibility) and [Open Items](#open-items).

### Geometry

| Property | Value | Token |
| --- | --- | --- |
| Hit target | 48 × 48 | — |
| State layer | 40 × 40, circular | — |
| Ring | 24 × 24 | — |
| Ring stroke | 2 | `md.border.size.200` |
| Dot | 12 × 12 | — |
| Label style | 14 regular | `body.medium` |
| Selected color | `secondary` | |
| Unselected ring | `on-surface` | |

Note the unselected ring is `on-surface`, where [[Checkbox]]'s unchecked border is `primary`. Two controls in the same family outline themselves in different roles — flagged in [Open Items](#open-items).

## States

Radios follow [[States]] with the `secondary` state role.

| State | Treatment |
| --- | --- |
| Enabled | No layer |
| Hover | State layer tinted |
| Focus | State layer tinted, plus the branded focus ring |
| Pressed | State layer tinted |
| Disabled | Ring and dot at 38%; not focusable; **skipped by arrow navigation** |

**The state layer is the 40×40 circle** around the ring, so feedback reads as a halo.

**Disabled radios are skipped by the arrow keys**, not just unfocusable. Arrowing through a group jumps over them, which is correct — the arrows move *selection*, and selecting a disabled option is impossible.

**There is no error state.** Unlike [[Checkbox]], a radio has no error modifier, so a radio group that fails validation has no visual treatment of its own. See [Open Items](#open-items).

Disabled applies 38% to the glyph — consistent with [[Checkbox]] and [[Button]], diverging from the 12%/38% split in [[States]].

## Behaviors

**Selection cannot be cleared by the user.** Clicking the selected radio does nothing; there is no toggle-off. Once a group has a selection, the user can only move it, never remove it. This is correct radio behavior, and it has a design consequence: **if "none" is a valid answer, it must be an explicit option in the group.** A group with no default selection can start empty, but the user cannot return it to empty.

**Selection wraps at the ends.** Down-arrow from the last radio moves to the first.

**Arrow keys change the selection, not just the focus.** Moving with the arrows selects as it moves — there is no "focus without selecting" state. That's the standard pattern, and it means arrowing through a group fires the change handler at each step.

**The whole row is the target when a label is present.** Clicking the label selects the radio.

**Labels wrap and never truncate.** The ring stays vertically centered against the wrapped block.

**Activation is by click, Space, Enter, or Numpad Enter.**

**Radios are fully controlled by the group.** A radio does not track its own selection; it paints selected when its value matches the group's, and reports the requested value up to the group.

**No motion.** The dot appears and disappears without transition.

## Content

**Each label states one option, not a sentence about it.** "Europe", not "Connect me to a server in Europe".

- Sentence case, no terminal period.
- **Keep the options parallel** — same grammatical form, same level of detail. A group where one option is a noun and the next is a clause reads as a mistake.
- **Order deliberately.** Most-likely first, or a natural order (cheapest to most expensive, soonest to latest). Alphabetical is a fallback, not a default.
- **Name a default and preselect it** when there is a sensible one. An unselected group forces a choice the user may not have an opinion about.
- **If "none" or "no preference" is valid, make it an option.** The user cannot deselect their way back to it.

**The group needs a label**, phrased as what is being chosen: "VPN region", not "Choose one".

**Two to about five options.** Below two there is no choice. Above roughly five, the group is taller than it is useful and a dropdown fits better — see the [decision tree](#decision-tree).

## Decision Tree

```
Must the user pick EXACTLY ONE option?
├── no — zero or more, independently ────────────→ [[Checkbox]]
├── no — it's one setting, on or off ────────────→ [[Checkbox]] (submit)
│                                                  or [[Switch]] (immediate)
├── no — it's a binary opinion about content
│        on screen, not a value to submit ───────→ [[Feedback]]
└── yes, exactly one
    │
    ├── Does the change take effect IMMEDIATELY?
    │   └── yes → not a radio. Radios commit on submit.
    │             Reconsider the interaction, or use [[Tabs]] if
    │             the "choice" is really a view switch.
    │
    ├── Is the choice between VIEWS rather than values?
    │   └── yes ────────────────────────────────→ [[Tabs]]
    │
    ├── How many options?
    │   ├── 1 ──────────→ not a choice. Show it as text.
    │   ├── 2 to ~5 ────→ RADIO GROUP — all options visible
    │   └── more than ~5 → [[Menu]] as a dropdown — a long radio
    │                      group pushes the rest of the form off-screen
    │
    └── RADIO GROUP
        │
        ├── Is there a sensible default? → preselect it
        ├── Is "none" a valid answer? ──→ add it as an explicit option
        └── Does the group need a name? → yes, always. The layout
                                          supplies it.
```

**Radio versus dropdown** is a question about comparison. If the user needs to weigh the options against each other, show them all — radios. If they already know which one they want and are just locating it, a dropdown is shorter.

**Radio versus [[Tabs]]** is a question about what changes. Radios choose a *value* that gets submitted; tabs switch which *content* is visible, immediately. A radio group that changes the page on selection is a tab set wearing the wrong control.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Radio role** | Announced as a radio, in a mutually exclusive group. |
| **Group role** | The group announces as a radio group. |
| **Selection announced** | Selected or not. |
| **One tab stop per group** | Tab lands on the selected radio; the next Tab exits. |
| **Arrow-key navigation** | Left/Up previous, Right/Down next, wrapping, skipping disabled. |
| **Keyboard activation** | Space, Enter, Numpad Enter. |
| **Visible focus** | Branded ring, keyboard-only. |
| **Touch target** | 48×48 per radio. |
| **Disabled announced** | Announced as disabled, unfocusable, skipped by the arrows. |
| **Announceable name per option** | The visible label, or an explicit override. |
| **Group NAME** | **Not met by the component** — see below. |
| **Automation identifier** | Required, per radio. |

**The group has a role but no name.** The group announces as a radio group, so a screen-reader user knows they're in one — but nothing supplies *what* the group is choosing between. Announcing "radio group, three items, Europe, selected" without "VPN region" leaves the user to infer the question from the answers. **The surrounding layout must provide the group's accessible name**, and this is not optional; see [Open Items](#open-items).

**A bare radio with no label has no accessible name.** Same failure as [[Checkbox]] — supply an override that names the option.

**Arrow-key selection fires the change handler on every step.** For a group whose selection triggers expensive work — a network request, a re-layout — arrowing from the first option to the fourth fires four times. Debounce the *effect*, never the selection.

**Automation identifiers must be unique per option.** Compose from the option's value so each radio in the group is independently targetable.

## Anti-Patterns

**❌ A single radio.** It can't be deselected, so it's a one-way switch with no off. → [[Checkbox]], or two radios.

**❌ A radio outside a group.** No exclusivity, no arrow keys, no group role. It's an error, and it asserts in debug. → Always wrap in a group.

**❌ A radio group with no label.** The options are answers to an unasked question. → The layout supplies the group name, visibly and semantically.

**❌ More than about five radios.** → [[Menu]] as a dropdown.

**❌ Radios that switch views on selection.** → [[Tabs]].

**❌ Radios for independent options.** → [[Checkbox]].

**❌ Expecting the user to deselect.** There's no toggle-off. → Add an explicit "none" option.

**❌ Non-parallel option labels.** "Europe" next to "I'd like the fastest available server" reads as an error. → Same form, same detail.

**❌ Options in arbitrary order.** → Most likely first, or a natural order.

**❌ Alphabetical order by default.** It's a fallback for long lists, not a design decision. → Order by likelihood or magnitude.

**❌ Treating each radio as its own tab stop.** Five radios are one stop. → Don't add focus handling to work around it.

**❌ Expensive work fired directly from selection.** The arrow keys fire it on every step. → Debounce the effect.

**❌ A shared automation identifier across options.** → Compose from the option's value.

**❌ Wrapping a radio in your own semantics or tap handler.** Role, exclusivity, and identifier are wired; the row is already the target. → Leave them.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widgets are `AsmRadioGroup<T>` and `AsmRadio<T>`, from `pegasus_flutter/lib/asm/components/radio.dart`.

Both are generic over the option's value type — typically an enum. **`AsmRadio<T>` must have an `AsmRadioGroup<T>` ancestor with the matching `T`**; it asserts otherwise. Radios with a different `T` are independent, which is how two groups can coexist in one subtree.

The group owns `groupValue` and `onChanged`. Individual radios declare only their own `value`.

### Basic usage

```dart
enum VpnRegion { fastest, us, eu }

class _RegionPickerState extends State<RegionPicker> {
  VpnRegion _region = VpnRegion.fastest;

  @override
  Widget build(BuildContext context) {
    // The group's accessible name — AsmRadioGroup does not provide one.
    return Semantics(
      container: true,
      label: 'VPN region',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('VPN region', style: context.asmTypographyTokens.titleSmall),
          AsmRadioGroup<VpnRegion>(
            groupValue: _region,
            onChanged: (value) => setState(() => _region = value ?? _region),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final region in VpnRegion.values)
                  AsmRadio<VpnRegion>(
                    value: region,
                    label: _labelFor(region),
                    automationIdentifier: 'vpn-region-${region.name}',
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

The visible heading and the `Semantics` label are both needed: the heading for sighted users, the label so the group announces its name. Neither comes from `AsmRadioGroup`.

`onChanged` receives `T?`. `AsmRadio` does not opt into tristate, so in practice the value is non-null — coalesce rather than force-unwrap.

### A disabled option

```dart
AsmRadio<VpnRegion>(
  value: VpnRegion.eu,
  label: 'Europe (unavailable in your plan)',
  enabled: false,
  automationIdentifier: 'vpn-region-eu',
);
```

`enabled: false` dims the glyph, removes it from focus, and makes the arrow keys skip it. Note the pattern differs from [[Checkbox]] and [[Button]], which disable by passing a null handler — a radio has no handler of its own, so it takes an explicit flag.

### A bare radio in a row

```dart
AsmRadio<String>(
  value: plan.id,
  semanticLabel: 'Select the ${plan.name} plan',
  automationIdentifier: 'plan-${plan.id}',
);
```

With no visible `label`, `semanticLabel` is the accessible name.

### Two independent groups in one subtree

```dart
AsmRadioGroup<VpnRegion>(
  groupValue: _region,
  onChanged: (v) => setState(() => _region = v ?? _region),
  child: AsmRadioGroup<BillingCycle>(
    groupValue: _cycle,
    onChanged: (v) => setState(() => _cycle = v ?? _cycle),
    child: Column(
      children: [
        // Resolves to the VpnRegion group by type.
        AsmRadio<VpnRegion>(value: VpnRegion.us, label: 'United States',
            automationIdentifier: 'vpn-region-us'),
        // Resolves to the BillingCycle group by type.
        AsmRadio<BillingCycle>(value: BillingCycle.annual, label: 'Annual',
            automationIdentifier: 'billing-annual'),
      ],
    ),
  ),
);
```

Radios bind to the nearest ancestor group of their own `T`. This works, but nesting groups is hard to read — prefer sibling groups in separate subtrees.

### Parameter reference

**`AsmRadioGroup<T>`**

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `groupValue` | `T?` | **Yes** | — |
| `onChanged` | `ValueChanged<T?>` | **Yes** | — |
| `child` | `Widget` | **Yes** | — |

There is no `label`, `semanticLabel`, `enabled`, or `automationIdentifier` on the group.

**`AsmRadio<T>`**

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `T` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `label` | `String?` | No | `null` |
| `semanticLabel` | `String?` | No | `null` (inherits `label`) |
| `enabled` | `bool` | No | `true` |

There is no `isError` on either.

### Guidance

- **Always wrap radios in an `AsmRadioGroup<T>` with the matching `T`.** An unwrapped radio asserts in debug and has no selection source in release.
- **Give the group an accessible name** with a `Semantics(container: true, label: …)` wrapper. The group provides the role, not the name.
- **Disable with `enabled: false`**, not by omitting a handler — the radio has none.
- **Pass `semanticLabel` when there's no visible `label`.**
- **Compose `automationIdentifier` from the option's value**, e.g. `'vpn-region-${region.name}'`.
- **Don't debounce the selection; debounce the effect.** Arrow-key navigation fires `onChanged` per step.
- **Don't wrap a radio in your own `Semantics`, `GestureDetector`, or `Focus`** — exclusivity, the collapsed semantics node, and the traversal policy are all wired.
- **Don't build a radio group out of `AsmButton`s or `AsmTag`s** to get a different look. The keyboard contract is the component.
- Use an `enum` for `T` where possible; it makes exhaustive handling and identifier composition trivial.

---

## Rules

1. A radio MUST belong to a group. A standalone radio is an ERROR.
2. The group, NEVER the individual radio, owns the selected value.
3. Every radio group MUST have an accessible name, supplied by the surrounding layout.
4. A radio group MUST offer at least two options. More than ~5 MUST use a dropdown ([[Menu]]).
5. Selection CANNOT be cleared by the user. If "none" is valid it MUST be an explicit option.
6. Option labels MUST be parallel in form and ordered deliberately.
7. A default MUST be preselected whenever one is sensible; NEVER open a group unselected just to force a deliberate choice.
8. Radios commit on SUBMIT. Immediate-effect choices are [[Switch]]; view switches are [[Tabs]].
9. A group of N radios MUST be ONE tab stop, with arrow keys moving selection.
10. Disabled radios MUST be skipped by arrow-key navigation, not merely unfocusable.
11. Every radio MUST have an accessible name — a visible label or an explicit override.
12. Every radio MUST carry a stable, UNIQUE automation identifier composed from its value.
13. Expensive side effects MUST be debounced downstream of selection, NEVER wired directly to it.
14. NEVER wrap a radio in your own semantics, focus, or gesture handling.
15. NEVER construct a radio group from other components to change its appearance.

---

## Open Items

1. **The group has no accessible name, and the code claims it does.** The class documentation states a user hears "VPN region, radiogroup, 4 items", but `AsmRadioGroup` accepts no label of any kind — nothing supplies "VPN region". The role is announced; the name is not. Every consumer must add a `Semantics(container: true, label: …)` wrapper, which nothing in the API signals. A `label` parameter on `AsmRadioGroup` would fix both the gap and the doc, and [[Checkbox]] needs the same for grouped checkboxes.
2. **There is no error state.** [[Checkbox]] has an error modifier; radio has none. A required radio group left unanswered has no visual treatment, so validation feedback is entirely the form's job — and it can't tint the ring even if it wants to. Whether Figma draws an error variant is unconfirmed.
3. **The unselected ring uses `on-surface` while [[Checkbox]]'s unchecked box uses `primary`.** Two controls in the same family, in the same form, outline themselves in different color roles. One of them is wrong; [[Color]] should say which.
4. **Every dimension is a hardcoded literal.** 48 hit, 40 state layer, 24 ring, 2 stroke, 12 dot. The 2px stroke has an exact token (`md.border.size.200`); the rest have no equivalents — the same missing control-size scale flagged in [[Checkbox]] and [[Icons]].
5. **The label's padding is on its trailing edge, not between the ring and the label.** The 4px value sits to the *right* of the label text, and the visible ring-to-label gap comes incidentally from the ring's 48px hit box. So the gap is a side effect of the touch target rather than a spacing decision — identical to [[Checkbox]]. If the hit target ever changes, the gap changes with it.
6. **Space is not bound explicitly, unlike Enter and Numpad Enter.** The component binds those two and relies on Flutter's default shortcut mapping for Space. It works, but Space is the primary activation key for a radio, and [[Checkbox]] binds all three explicitly. The inconsistency means a future change to the ambient shortcut map would break radio and not checkbox.
7. **Disabled is expressed differently from every other control.** Radio takes `enabled: false`; [[Checkbox]], [[Button]], and [[Switch]] disable by passing a null handler. Radio has no handler of its own so the flag is necessary, but the divergence is a real API inconsistency callers have to remember.
8. **Arrow-key navigation fires the change handler on every step.** Standard for the radio pattern, but it means a group whose selection triggers a network call fires once per arrow press. Nothing in the component debounces or documents this.
9. **Disabled uses a flat 38%**, diverging from the 12%/38% split in [[States]] — consistent with [[Checkbox]] and [[Button]], which suggests [[States]] is the doc that needs correcting.
10. **The repo's own Flutter-currency rule is stale on this component.** `.claude/rules/45_flutter_currency.md` states that `AsmRadio` "still uses the old shape" and should adopt `RadioGroup`; the implementation has already adopted it. The rule file needs updating, and it's worth checking whether the group-semantics half of that same note — "emit a single `Semantics(container: true, role: …)` for the group label" — was the intended fix for the missing group name above.
11. **Figma has no `focus` variant**, consistent with [[Button]], [[Accordion]], [[Alert Banner]], and [[Checkbox]] — focus is code-only in every component.
12. **No motion on the dot.** It appears instantly; Material animates it. No motion tokens exist system-wide.
13. **No group component means no group layout.** Spacing between radios, orientation, and the group label are all the caller's. A `Column` of radios with default spacing is what every consumer will write, and nothing defines what that spacing should be.
