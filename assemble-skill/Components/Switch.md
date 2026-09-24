# Component: Switch

> Role: Turns one setting on or off. The change takes effect immediately.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they define what the component means and when to use it. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: A switch takes effect the moment it is flipped. If the change waits for a submit button, use a [[Checkbox]].
> Source: Figma `Components` → `Switch` (node `4101-10640`). Implementation: `pegasus_flutter/lib/asm/components/switch.dart`.

## Overview

A switch is a pill-shaped track with a handle that slides between two positions. It turns a single setting on or off, and **the effect is immediate** — there is no submit step.

That immediacy is the whole distinction, and it drives everything else about the component:

| Component | Choice | Timing |
| --- | --- | --- |
| **Switch** | On or off, one setting | Takes effect **immediately** |
| **[[Checkbox]]** | Zero or more, independent | Takes effect on **submit** |
| **[[Radio]]** | Exactly one from a set | Takes effect on **submit** |

Because a switch acts immediately, **the user's only way to undo is to flip it back.** There's no cancel. So a switch is wrong for anything destructive, anything slow enough to leave the UI ambiguous, or anything whose effect the user can't observe. A switch that turns off a security feature without confirmation is the canonical misuse.

**A switch has no label of its own.** It is a control, not a row — the setting's name, description, and layout belong to the surrounding row. What the switch does require is an accessible name, and that requirement is enforced.

## Anatomy

```
                        Off                          On
             ┌────────────────────┐      ┌────────────────────┐
             │ ○                  │      │                 ●  │
             └────────────────────┘      └────────────────────┘
               ↑                ↑          ↑
             handle          track      handle at the far inset

  Off: transparent track, 1–3px on-surface border, small handle
  On:  filled track (tone color), no border, larger handle


  In a settings row — all of this except the switch is the ROW's job:

  ┌──────────────────────────────────────────────────────────┐
  │  Real-time scanning                        ┌──────────┐  │
  │  Scans files as they are opened            │       ●  │  │
  │                                            └──────────┘  │
  └──────────────────────────────────────────────────────────┘
     ↑ name (row)      ↑ description (row)        ↑ switch
```

| Part | Required | Notes |
| --- | --- | --- |
| **Track** | Yes | Pill radius. Filled when on; transparent with a border when off. |
| **Handle** | Yes | Circular, `surface` fill when on, `on-surface` when off. Slides and resizes. |
| **State layer** | — | A circle that follows the handle. Carries hover, focus, pressed. |
| **Handle icon** | No | An icon inside the handle. |
| **Spinner** | — | Replaces the handle content while an async toggle is in flight. |
| **Label** | **Not part of the component** | The row owns it. |

**The handle changes size with state**, which is the switch's main motion signal: smallest when off, larger when on, largest while pressed. Combined with the border disappearing when the track fills, the on and off states differ in fill, border, handle size, and handle position — four signals, so the state is readable without color.

**The state layer follows the handle** rather than sitting centered on the track, so hover and focus feedback appears around whichever end the handle is at.

### Sizes

Three sizes. `medium` is the default.

| | `small` | `medium` | `large` |
| --- | --- | --- | --- |
| Track | 26 × 16 | **52 × 32** | 81 × 50 |
| Handle (off) | 8 | 16 | 24 |
| Handle (on) | 12 | 24 | 38 |
| Handle (pressed) | 14 | 28 | 44 |
| Track inset | 2 | 4 | 6 |
| State layer | 20 | 40 | 64 |
| Border | 1 | 2 | 3 |
| Handle icon | 8 | 16 | 24 |
| Spinner | 8 | 16 | 24 |

**`small` is exactly `medium` halved.** Every metric.

**Choose `medium` unless you have a specific reason not to.** It's the default and the only size that fits a normal settings row.

**`small` is for dense rows** where a full switch is too heavy — a table cell, a compact list. Note its total hit region is 26 × 20, far below the touch minimum, so it should not be the primary way to toggle something on a touch surface. See [Open Items](#open-items).

**`large` is for hero rows** where the switch is a primary visual element — a marketing-style feature row, a single prominent kill switch. It is not a way to make an ordinary setting more noticeable.

**An 8px handle icon is not legible.** If the icon carries meaning rather than decoration, `small` is the wrong size for it.

## Tone

Two tones, driving the on-state track fill and the state-layer ramp.

| Tone | On-track | Use |
| --- | --- | --- |
| **`secondary`** (default) | `secondary` — purple | The standard switch. |
| **`primary`** | `primary` — black | When the switch must read as the primary control on the surface. |

**Use `secondary` almost always.** `primary` is for a switch that is the surface's main action — a feature kill switch in a billing flow, for instance. More than one `primary` switch on a screen defeats the purpose, exactly as with [[Button]].

Note `md.sys.color.primary` is `#000000`, so a `primary` switch reads as a black track. That's high-contrast and heavy; it draws the eye, which is the point, but it also reads as more severe than `secondary`.

## States

Switches follow [[States]], with the state role matching the tone — `secondary` or `primary`.

| State | Treatment |
| --- | --- |
| Enabled | No layer |
| Hover | State layer tinted, following the handle |
| Focus | **Same tint as hover** — see below |
| Pressed | State layer tinted; handle grows |
| Disabled | Track filled at low opacity; handle stays opaque; not focusable |
| **Loading** | On/off colors kept, spinner in the handle, non-interactive |

**Focus and hover are visually identical, and there is no branded focus ring.** This is a real divergence from every other interactive component in the system — [[Button]], [[Checkbox]], [[Radio]], and [[Accordion]] all draw the branded ring on keyboard focus. A keyboard user tabbing to a switch sees the same faint tint a mouse user gets on hover, which on a mouse-driven surface may not read as focus at all. Flagged in [Open Items](#open-items).

**Disabled does not dim the handle.** The track fills with a low-opacity wash and the border is dropped, but the handle keeps its full-strength fill — so a disabled switch is lower contrast than an enabled one but not uniformly at 38% the way [[Checkbox]] and [[Radio]] are.

**Loading is a distinct state, not a variant of disabled.** While loading, the switch keeps its current on/off colors, replaces the handle content with a spinner, holds the handle in the on-position size, and blocks interaction. It is announced as busy. This is the right treatment for an async toggle: the user can see which state is being applied, unlike a disabled switch which just looks unavailable.

## Behaviors

**Toggling takes effect immediately.** There is no confirmation and no submit step.

**Async toggles use the loading state**, not optimistic flipping. If turning the setting on requires a round trip that can fail, show the spinner while it's in flight and reflect the true result when it returns. A switch that flips instantly and then flips back on failure looks broken.

**The handle grows on press and returns on release**, and the press growth also nudges the handle toward the track edge. That's feedback, not a state change.

**An icon in the handle keeps the handle at its larger size even when off.** Normally the off handle is the smallest of the three sizes; with an icon it stays at the on-size so the icon has room. This means the on/off difference is carried by fill, border, and position but *not* handle size — a slightly weaker signal, which is worth knowing before adding a handle icon.

**The handle icon is ignored while loading** — the spinner takes its place.

**Motion is short and continuous**: the track fill and handle position ease over roughly 150ms, the handle's size change over roughly 100ms. No motion tokens exist to name these; see [Open Items](#open-items).

**Activation is by click, Space, or Enter.**

**The switch is fully controlled.** It renders the value it's given and reports the requested value. A switch whose value doesn't change in response does nothing when flipped.

**The switch does not lay out with anything.** No label, no description, no row. The consumer builds the row.

## Content

The switch has no copy of its own; all of this belongs to the row around it.

**Name the setting, not the action.** "Real-time scanning", not "Turn on real-time scanning" — the switch's position already says on or off, so an imperative label contradicts it when the switch is already on.

- **Never phrase the label so that "on" is ambiguous.** "Disable notifications" turned on means notifications are off. Invert it: "Notifications".
- **Never use a switch label that reads as a question.**
- **State labels ("On"/"Off") beside the switch are redundant.** The handle position says it. The exception is where the setting's state has consequences worth spelling out, in which case that's a description, not a state label.
- **A description is for consequence, not restatement.** "Scans files as they are opened" earns its place; "Turns real-time scanning on and off" does not.

## Decision Tree

```
Does the change take effect IMMEDIATELY, with no submit step?
├── no — it commits with a form
│   ├── one of several independent options ────→ [[Checkbox]]
│   └── exactly one from a set ────────────────→ [[Radio]]
│
└── yes, immediately
    │
    ├── Is the effect DESTRUCTIVE or hard to reverse?
    │   └── yes → NOT a switch alone. A switch has no cancel.
    │             Use a [[Button]] plus a confirming [[Modal]].
    │
    ├── Is it really choosing between two VIEWS?
    │   └── yes ──────────────────────────────→ [[Tabs]]
    │
    ├── Is it an action rather than a state?
    │   └── yes ──────────────────────────────→ [[Button]]
    │
    └── SWITCH
        │
        ├── Does the toggle require a round trip that can fail?
        │   └── yes → use the loading state; do NOT flip optimistically
        │
        ├── Which size?
        │   ├── a normal settings row ────────→ medium (default)
        │   ├── a dense row or table cell ────→ small — but note the hit
        │   │                                    region is under 48×48
        │   └── a hero / feature row ─────────→ large
        │
        └── Which tone?
            ├── the surface's primary control → primary (at most one)
            └── everything else ──────────────→ secondary (default)
```

**Switch versus [[Checkbox]]** is the boundary that matters. Ask only whether anything happens when the user flips it. If the effect waits for Save, it's a checkbox.

**Switch versus [[Button]]** separates state from action. A switch shows and changes an ongoing state; a button performs a one-time action. "Run scan" is a button even though scanning can be on or off, because the user is starting a thing, not setting a state.

## Accessibility

| Requirement | How it's met |
| --- | --- |
| **Toggle role** | Announced with its on/off state. |
| **Announceable name** | **Required** — the component will not compile without one. |
| **Keyboard activation** | Space, Enter. |
| **Tab-reachable** | One tab stop. Disabled and loading switches are skipped. |
| **Assistive-tech activation** | Wired, so voice control can toggle it. |
| **Single semantics node** | The name, state, and identifier all attach to one node. |
| **State not color-only** | Fill, border, handle size, and handle position all differ. |
| **Loading announced** | Announced as busy and non-interactive. |
| **Visible focus** | **Weak** — no branded ring; the tint matches hover. See below. |
| **Touch target** | **Not met at `small` or `medium`** — see below. |
| **Automation identifier** | Required. |

**The accessible name is required**, which is the right call for a control with no visible text of its own. Where a visible label exists in the row, pass that same text.

**There is no branded focus ring.** Keyboard focus is signalled only by the state-layer tint, which is the same tint hover produces. This is the component's clearest accessibility gap and it diverges from the rest of the system.

**Touch targets fall below the 48×48 minimum at two of three sizes.** The interactive region is the track's width by the state layer's height: 81 × 64 at `large`, 52 × 40 at `medium`, 26 × 20 at `small`. Only `large` clears the minimum. **The consumer must expand the hit region** — the standard fix is to make the whole settings row the target, which is good practice anyway. See [Open Items](#open-items).

**Announce the outcome of a slow toggle.** The loading state announces as busy, but nothing announces when the toggle completes. If the result matters — a security feature turning off — the row should announce it, typically with a live region or a [[Snackbar]].

**Never wrap a switch in your own semantics.** It deliberately collapses its descendants into a single node so the name, toggle state, and identifier all land on the one node a screen reader focuses. Adding a wrapper re-splits the tree, which is the exact defect that produced a real consumer bug report where the label and identifier "did not work".

## Anti-Patterns

**❌ A switch that waits for Save.** → [[Checkbox]].

**❌ A switch for a destructive or irreversible change.** There is no cancel. → [[Button]] plus a confirming [[Modal]].

**❌ Optimistically flipping on an async toggle.** Flipping back on failure looks like a bug. → Use the loading state.

**❌ A switch for an action.** "Run scan" is not a state. → [[Button]].

**❌ A switch to choose between two views.** → [[Tabs]].

**❌ An imperative label.** "Turn on notifications" contradicts itself once the switch is on. → Name the setting.

**❌ A negated label.** "Disable notifications" makes on mean off. → Invert it.

**❌ "On" / "Off" text beside the switch.** The handle position already says it. → Use the space for a description, or nothing.

**❌ Relying on the switch's own hit area on a touch surface.** Under 48×48 at `small` and `medium`. → Make the row the target.

**❌ `small` for a primary toggle.** 26 × 20 hit region and an 8px icon. → `medium`.

**❌ `large` to make an ordinary setting noticeable.** → It's for hero rows. Use `medium`.

**❌ More than one `primary`-tone switch on a surface.** → One at most; `secondary` for the rest.

**❌ Overriding the track colors to brand a surface.** Bypasses the tone tokens and the theme. → Use `tone`.

**❌ Wrapping the switch in your own `Semantics`.** Re-splits the semantics node; the known cause of a "label and id not working" report. → Leave it.

**❌ Faking disabled with opacity.** → Remove the handler.

**❌ Faking loading by disabling.** Disabled reads as unavailable, not in-progress. → Use the loading state.

---

## Flutter Usage

McAfee products are built in Flutter, so this is the primary implementation target. The widget is `AsmSwitch`, from `pegasus_flutter/lib/asm/components/switch.dart`.

`AsmSwitch` is **fully controlled**. `semanticLabel` and `automationIdentifier` are both required.

### Enums

```dart
enum AsmSwitchSize { large, medium, small }   // default: medium
enum AsmSwitchTone { secondary, primary }     // default: secondary
```

Note the declaration order runs large → small while the default is the middle value; don't infer the default from position.

### Basic usage

```dart
class _SettingsState extends State<Settings> {
  bool _realtimeScanning = true;

  @override
  Widget build(BuildContext context) {
    return AsmSwitch(
      value: _realtimeScanning,
      onChanged: (next) => setState(() => _realtimeScanning = next),
      semanticLabel: 'Real-time scanning',
      automationIdentifier: 'realtime-scanning-switch',
    );
  }
}
```

### In a settings row, with the row as the target

This is the pattern to use on any touch surface, because the switch's own hit region is 52 × 40 at `medium` — under the 48×48 minimum.

```dart
Semantics(
  // One node owns the name, state, and tap. The switch's own semantics
  // are excluded so there is exactly one toggle node in the tree.
  container: true,
  toggled: _realtimeScanning,
  label: 'Real-time scanning',
  identifier: 'realtime-scanning-row',
  onTap: () => _set(!_realtimeScanning),
  child: ExcludeSemantics(
    child: InkWell(
      onTap: () => _set(!_realtimeScanning),
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: AsmSpacingScale.s400,
          vertical: AsmSpacingScale.s300,
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Real-time scanning',
                      style: context.asmTypographyTokens.bodyMedium),
                  Text('Scans files as they are opened',
                      style: context.asmTypographyTokens.bodySmall),
                ],
              ),
            ),
            AsmSwitch(
              value: _realtimeScanning,
              onChanged: _set,
              semanticLabel: 'Real-time scanning',
              automationIdentifier: 'realtime-scanning-switch',
            ),
          ],
        ),
      ),
    ),
  ),
);
```

`ExcludeSemantics` around the subtree is what keeps this to one toggle node — without it the row and the switch both expose a tappable node and a screen reader can land on either.

### An async toggle

```dart
class _VpnToggleState extends State<VpnToggle> {
  bool _enabled = false;
  bool _busy = false;

  Future<void> _toggle(bool next) async {
    setState(() => _busy = true);
    try {
      await vpnService.setEnabled(next);
      // Reflect the confirmed result, not the requested one.
      setState(() => _enabled = next);
    } finally {
      setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AsmSwitch(
      value: _enabled,
      loading: _busy,
      onChanged: _toggle,
      semanticLabel: 'VPN',
      automationIdentifier: 'vpn-switch',
    );
  }
}
```

`loading: true` shows the spinner and blocks interaction while keeping the current on/off colors. **`onChanged` stays non-null while loading** — pass `null` only to mean genuinely disabled, since a null handler renders the disabled treatment instead of the loading one.

### With a handle icon

```dart
AsmSwitch(
  value: _shieldOn,
  icon: Icons.shield,
  onChanged: (next) => setState(() => _shieldOn = next),
  semanticLabel: 'Protection',
  automationIdentifier: 'protection-switch',
);
```

The icon is decorative — it isn't announced, so `semanticLabel` still carries the meaning. Note that with an icon the off-state handle stays at its larger size, weakening the size difference between on and off.

### Disabled

```dart
AsmSwitch(
  value: false,
  onChanged: null, // null = disabled
  semanticLabel: 'Advanced scanning (requires a Plus plan)',
  automationIdentifier: 'advanced-scanning-switch',
);
```

When a switch is unavailable, say why in the row — a disabled switch with no explanation is a dead end.

### Parameter reference

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `bool` | **Yes** | — |
| `onChanged` | `ValueChanged<bool>?` | **Yes** | — (`null` = disabled) |
| `semanticLabel` | `String` | **Yes** | — |
| `automationIdentifier` | `String` | **Yes** | — |
| `size` | `AsmSwitchSize` | No | `medium` |
| `tone` | `AsmSwitchTone` | No | `secondary` |
| `icon` | `IconData?` | No | `null` |
| `loading` | `bool` | No | `false` |
| `activeColor` | `Color?` | No | `null` |
| `inactiveColor` | `Color?` | No | `null` |

### Guidance

- **Expand the hit region at the call site.** The switch is 52 × 40 at `medium` and 26 × 20 at `small`. Make the row the target.
- **Use `loading`, not `onChanged: null`, for an in-flight toggle.** A null handler renders disabled, which reads as unavailable rather than in-progress.
- **Reflect the confirmed value after an async toggle**, not the requested one.
- **Never pass `activeColor` or `inactiveColor`.** They bypass the tone tokens and the theme; a literal color will be wrong in dark mode and in high contrast. Use `tone` instead. These parameters exist and should be treated as deprecated — see [Open Items](#open-items).
- **Never wrap the switch in your own `Semantics`.** It collapses its descendants into one node deliberately; a wrapper re-splits the tree. This has already caused a consumer-reported bug. If you need the row to be the toggle, use `ExcludeSemantics` around the whole subtree as shown above.
- **Never fake disabled with `Opacity`** — pass `onChanged: null`.
- **`semanticLabel` should match the row's visible label**, not describe the action.
- **`icon` is decorative** and is not announced. It's also ignored while `loading`.
- **At most one `primary`-tone switch per surface.**
- `small`'s 8px icon is not legible — don't pair `size: small` with a meaningful `icon`.

---

## Rules

1. A switch takes effect IMMEDIATELY. Submit-time choices MUST be a [[Checkbox]] or [[Radio]].
2. NEVER use a switch alone for a destructive or irreversible change — it has no cancel.
3. Async toggles MUST use the loading state. NEVER flip optimistically and revert on failure.
4. `loading` MUST be used for in-flight toggles, NEVER a null handler.
5. The consumer MUST expand the hit region to at least 48×48 — the switch does not meet it at `small` or `medium`.
6. Every switch MUST have an accessible name matching the row's visible label.
7. Labels MUST name the setting, NEVER the action, and NEVER be negated or phrased as a question.
8. NEVER render "On" / "Off" text beside a switch.
9. NEVER wrap a switch in your own semantics — it collapses to a single node deliberately.
10. NEVER pass a custom track color. Tone MUST come from `tone`.
11. AT MOST ONE `primary`-tone switch per surface.
12. `medium` is the default. `small` MUST be used ONLY in dense rows and `large` ONLY in hero rows.
13. NEVER pair `small` with a meaningful handle icon — 8px is not legible.
14. Disable by removing the handler. NEVER fake disabled with opacity.
15. A disabled switch MUST be accompanied by a reason in the row.
16. Every switch MUST carry a stable, UNIQUE automation identifier.

---

## Open Items

1. **The switch has no branded focus ring, and focus is visually identical to hover.** Every other interactive component wraps its visual in the shared focus indicator; this one does not, and it resolves the focus state layer from the *hover* token rather than the focus token. So a keyboard user gets the same faint tint a mouse user gets on hover — on a mouse-driven desktop surface that may not read as focus at all. This is a direct divergence from the repo's own accessibility rule, which requires the branded ring on every interactive component and explicitly says not to rely on default highlighting. **The most significant gap in this component.**
2. **Touch targets are below 48×48 at two of three sizes.** The interactive region is the track width by the state-layer height: `large` 81 × 64 passes; `medium` 52 × 40 and `small` 26 × 20 do not. The repo's accessibility rule sets 48×48 as a hard floor "even at 200% text scale", and the responsiveness rule repeats it. `small` at 26 × 20 is less than a quarter of the required area. Every consumer must compensate, and nothing in the API signals that.
3. **`activeColor` and `inactiveColor` are token-escape hatches on the public API.** They accept an arbitrary `Color`, which is a direct violation of the tokens-only rule — a caller-supplied color will not respond to dark mode or high contrast. `tone` was added to serve the same need through tokens, which arguably makes both parameters obsolete. They should be deprecated and removed at the next breaking release.
4. **The disabled track uses a raw `0.16` alpha.** The tokens-only rule permits exactly one alpha literal, `0.38`, for the Material disabled-foreground convention. `0.16` on the track is neither a token nor the permitted literal, and it means the disabled treatment can't be adjusted centrally.
5. **Disabled does not dim the handle.** The track washes out but the handle keeps its full-strength fill, so a disabled switch is not uniformly de-emphasised the way [[Checkbox]] and [[Radio]] are at 38%. Whether that's the Figma intent is unconfirmed.
6. **All size geometry is hardcoded, and the code says so.** The metrics class is explicitly documented as "structural geometry (not design tokens)" — 26 values across three sizes, of which only the border and spinner strokes resolve to tokens. The `large` size is documented as "medium scaled up ~1.56×", which is a description of a measurement rather than a design decision. If Figma's `large` cell changes, nothing connects the two.
7. **The handle radius uses `cornerXLarge` (24), not `cornerFull`.** Every handle is small enough that 24 rounds it to a circle, so it renders correctly — but the intent is a circle, and `cornerFull` expresses that. A future larger handle would silently stop being round.
8. **Motion durations are hardcoded literals** — roughly 150ms for the track and position, 100ms for the handle size. No motion tokens exist system-wide, so this is consistent with [[Accordion]]'s 200ms, but it means the system has three unrelated animation timings and no way to tune them together.
9. **`Space` and `Enter` are not bound explicitly.** The component relies on Flutter's ambient shortcut map to produce activation, unlike [[Checkbox]] which binds Enter, Space, and Numpad Enter directly. It works today; it is fragile to a change in the ambient map, and it means Numpad Enter behavior is unverified.
10. **The handle icon's inset is a hardcoded 4**, applied identically at all three sizes, so the icon-to-handle ratio differs per size. At `small` the 8px icon inside a 12px handle with 4px of padding on each side does not fit the stated geometry — worth verifying what actually renders at `small` with an icon.
11. **There is no visible-label API and no settings-row component.** Every consumer builds the row — name, description, layout, the row-as-target semantics, and the `ExcludeSemantics` wrapper needed to avoid two toggle nodes. That last part is subtle enough that most consumers will get it wrong. Given that a switch is almost never used outside a settings row, the row is the missing component.
12. **Nothing announces the completion of an async toggle.** The loading state announces as busy, but when it clears, a screen-reader user gets no confirmation of the resulting state. For security settings this matters; the fix belongs to the row, and nothing documents it.
13. **`AsmSwitchSize` is declared large → medium → small** while the default is `medium`. Harmless, but it reads as though `large` were the base size, and it's the reverse of how [[Button]]'s sizes are ordered.
14. **The class documentation is stale on sizes.** It describes "Two sizes via `size`: medium and small", omitting `large`, which the enum and the metrics class both support. Same class of error as the stale comments found in [[Alert Banner]].
