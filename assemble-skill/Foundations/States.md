# Foundation: States

> Role: Defines how interaction is communicated — state layers, their opacities, the focus ring, and the disabled treatment.
> Rule: Every interactive element MUST express hover, pressed, focus, and disabled. A control with no state feedback is broken.

## Overview

States communicate whether something is actionable, being acted upon, focused, or unavailable. They are the core of how interaction is expressed — without them the UI cannot be operated with confidence by mouse or keyboard.

Assemble follows **Material 3's state principles**: interaction is expressed by a semi-transparent **state layer** over the element, at a defined opacity per state. Assemble diverges in two ways:

1. **Focus rings** — focus is expressed with a visible ring for accessibility, not by a state layer alone. See [Focus Ring](#focus-ring).
2. **Keyed state colors** — each state role has its own **key color** (`primary`, `secondary`, `neutral`, `error`) that all of its states derive from, rather than every state layer using the element's content color. See [State Color Roles](#state-color-roles).

## State Layers

A state layer is a semi-transparent overlay drawn over the element, filling its shape and inheriting its corner radius. The element's own color does not change; the layer sits on top.

| State | Opacity | Meaning |
| --- | --- | --- |
| Enabled | 0% | Resting. No layer. |
| Hover | **8%** | Pointer is over the element |
| Focus | **10%** | Element has keyboard focus (plus a [focus ring](#focus-ring)) |
| Pressed | **10%** | Element is being actively pressed |
| Dragged | **16%** | Element is being dragged |

**Enabled is the absence of a layer, not a layer at 0%.** Disabled is not in this table because it is not a state layer — see [Disabled](#disabled).

Opacity is the only thing that varies between states. The layer's color comes from the element's state role, so the same 8% hover reads correctly on a primary button and on a neutral list row.

### State layer principles

- **The layer is additive, never a replacement.** It sits over the element's existing color rather than substituting a different one.
- **The layer inherits the element's shape**, including corner radius. A pill button gets a pill-shaped layer.
- **The layer covers the whole interactive target**, not just its visible content — the full hit area receives it.
- **Transitions are short.** Opacity animates quickly enough to feel immediate; state feedback that lags reads as lag in the app.

## State Color Roles

Each state role carries a **key color**, and every state within that role derives from it. This is the Assemble-specific structure: rather than every state layer using `currentColor`, a role's states resolve from one authored key.

| Role | Applies to |
| --- | --- |
| `primary` | Primary actions, filled buttons, main interactive controls |
| `secondary` | Secondary and tonal controls |
| `neutral` | List rows, table rows, low-emphasis and structural interactive surfaces |
| `error` | Destructive and critical actions |

The token structure is `md.sys.state.<role>.<state>`:

```
md.sys.state.primary.key       ← the authored key color for the role
md.sys.state.primary.hover     → derives from key
md.sys.state.primary.pressed   → derives from key
md.sys.state.primary.focus     → derives from key
md.sys.state.primary.dragged   → derives from key
```

**The key is the only authored value per role.** `hover`, `pressed`, `focus`, and `dragged` all reference it, and the state's *opacity* — not its color — is what distinguishes them. This is why the scale in [State Layers](#state-layers) is opacity-only: changing a role's appearance means changing one key, and all four states follow.

Key colors resolve per theme mode. Light and dark modes assign different keys to the same role, so a role's states stay legible in both without any usage-site branching. See [[Color]].

### Choosing a role

Match the role to the **action's meaning**, not to the element's current color:

1. Is this the primary action, or a main interactive control? → `primary`
2. Is it a secondary or tonal control? → `secondary`
3. Is it a row, cell, or structural surface that happens to be interactive? → `neutral`
4. Is it destructive or critical? → `error`

A destructive action styled as a plain text button still uses the `error` role. The role expresses what the action *does*.

## Focus Ring

**Focus is expressed with a visible ring**, and this is a deliberate divergence from relying on a state layer alone. A 10% overlay is not a reliable focus indicator — it can be nearly invisible depending on the surface beneath it, which fails keyboard users.

The focus treatment is a border token, `md.border.focus`:

| Property | Value |
| --- | --- |
| Color | `md.sys.color.primary` |
| Width | `md.border.size.200` (2px) |
| Style | Solid |
| Offset | 2px outside the element |

The ring is accompanied by the 10% focus state layer. Both apply together — the ring guarantees visibility, and the layer keeps focus consistent with the other states.

### Focus ring rules

- **Show the ring for keyboard focus only.** A mouse click should not produce a ring; keyboard navigation must. Platforms distinguish these (`:focus-visible` and equivalents) — use that distinction.
- **The ring sits outside the element**, offset by 2px, so it never obscures content or reduces the element's apparent size.
- **The ring is always visible against its background.** It uses `primary` at 2px specifically so it survives being drawn over any surface. Never reduce its width or swap it for a subtler color.
- **Never remove the ring.** Removing focus indication makes a control unusable by keyboard. If it looks wrong, fix the offset or the surrounding layout.
- **Focus follows a logical order** matching the visual layout. Tab order that jumps around is a failure even with a perfect ring.
- **Focus must be visible on every interactive element**, including icon-only controls, list rows, and custom targets.

## Disabled

Disabled is **not a state layer**. It is an opacity treatment applied to the element's container and content independently:

| Part | Treatment |
| --- | --- |
| Container | 12% opacity of `md.sys.color.on-surface` |
| Content (text, icons) | 38% opacity of `md.sys.color.on-surface` |

Both derive from `on-surface` rather than from the element's own color, so every disabled control across the product looks the same regardless of what it looked like enabled. A disabled primary button and a disabled secondary button are indistinguishable — intentionally, because neither is available.

**Disabled elements receive no other states.** No hover, no pressed, no focus, no focus ring. They are not in the tab order.

- **Disabled means unavailable, not forbidden.** If an action is permanently unavailable, consider not showing it.
- **Explain why when it matters.** A disabled control with no explanation is a dead end; pair it with helper text where the reason isn't obvious from context.
- **Do not disable as validation feedback.** A form's submit button disabled with no indication of what's wrong is worse than an enabled button that reports errors.
- **Note the contrast tradeoff.** Content at 38% does not meet text contrast minimums. This is accepted for disabled content because it is non-interactive, but it means disabled text cannot be the only place information appears.

## Combining States

States can co-occur. When they do, **layer opacities are additive** — hover plus focus is 18%.

| Combination | Result |
| --- | --- |
| Hover + focus | 18% layer, plus the focus ring |
| Hover + pressed | 18% layer |
| Hover + selected | 8% layer over the selected container color |
| Disabled + anything | Disabled only |

**Disabled always wins.** A disabled element ignores every other state.

Beyond that, the highest-priority state takes visual precedence, and the ordering is: disabled → pressed → focus → hover → enabled.

Selected is a separate axis rather than a competing state — a selected element still hovers, focuses, and presses. Selection changes the element's container and content color (typically to the secondary container role from [[Color]]), and the state layer composes over that new color.

## Applying States

1. **Is this element interactive?** If yes, it needs all four of hover, pressed, focus, and disabled. There is no partial set.
2. **Which state role applies?** Match the action's meaning — `primary`, `secondary`, `neutral`, or `error`.
3. **Is focus distinguishable from click?** The ring shows for keyboard focus only.
4. **Is the disabled reason clear?** If not, add explanation or reconsider disabling.
5. **Does the target meet minimum size?** State feedback on a target too small to hit is not usable — see the 48×48 minimum in [[Icons]].

Additional constraints:

- **Never invent a state.** The set is hover, focus, pressed, dragged, disabled, and selected. Nothing else.
- **Never express a state with color alone.** Pressed at 10% is a small change; pair it with the state's other affordances so the feedback is unmistakable.
- **Never use elevation as the sole state signal.** A shadow change can accompany a state (see [[Elevation]]), but the state layer is what communicates it.
- **Keep states consistent across peers.** Every row in a list responds identically.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target.

States are driven by Flutter's `WidgetState` (formerly `MaterialState`) system, and `Asm*` components apply state layers automatically. **The common case requires no state code at all** — passing `null` to `onPressed` disables a control, and the correct disabled treatment follows:

```dart
AsmButton(
  label: 'Submit',
  onPressed: isValid ? _handleSubmit : null, // null = disabled
);
```

State colors resolve through the extension described in [[Color]] — `context.asmStateColors` exposes the keyed roles for the active brightness.

**For custom interactive widgets**, resolve the layer from widget state rather than tracking hover and press manually:

```dart
WidgetStateProperty.resolveWith((states) {
  if (states.contains(WidgetState.disabled)) return null;
  if (states.contains(WidgetState.pressed))  return stateColor.withOpacity(0.10);
  if (states.contains(WidgetState.focused))  return stateColor.withOpacity(0.10);
  if (states.contains(WidgetState.hovered))  return stateColor.withOpacity(0.08);
  return null;
});
```

Use `InkWell`/`InkResponse` or `WidgetStateProperty` overlays so the layer inherits the shape and hit area rather than being painted as a sibling box.

**Focus rings** come from the `md.border.focus` token. Flutter's `FocusableActionDetector` and the framework's focus-highlight mode distinguish keyboard focus from pointer interaction — use that rather than showing a ring on every focus event.

Guidance:

- Prefer `Asm*` components, which handle states correctly. Only hand-roll states for genuinely custom controls.
- Never track hover or press state in your own `setState` when `WidgetState` can resolve it.
- Never hardcode an opacity literal — reference the documented values through the token layer.
- Do not use `IgnorePointer` or `AbsorbPointer` as a substitute for disabled; those suppress interaction without communicating unavailability.
- Ensure custom controls are reachable by keyboard and expose a focus node. A widget that cannot receive focus cannot show a focus ring.

---

## Rules

1. Every interactive element MUST express hover, pressed, focus, and disabled. There is no partial set.
2. State layer opacities are **hover 8%, focus 10%, pressed 10%, dragged 16%**. Never author others.
3. Enabled is the **absence** of a layer, not a 0% layer.
4. Each state role has ONE authored key color; hover, pressed, focus, and dragged all derive from it. Never author a per-state color.
5. Choose the state role by the action's **meaning** (`primary` / `secondary` / `neutral` / `error`), not by the element's current color.
6. Focus MUST show a visible ring — `md.sys.color.primary` at 2px, offset 2px. NEVER remove or weaken it.
7. The focus ring appears for **keyboard focus only**, never for mouse clicks.
8. Disabled is an opacity treatment — **12% container, 38% content**, both from `on-surface`. It is not a state layer.
9. Disabled elements receive NO other states and are NOT in the tab order.
10. Combined state opacities are **additive**; disabled always overrides everything.
11. NEVER invent a state outside hover, focus, pressed, dragged, disabled, and selected.
12. Selected is a separate axis — a selected element still hovers, focuses, and presses.
13. NEVER communicate a state through color alone, or through elevation alone.
14. Peer elements MUST respond to states identically.

---
