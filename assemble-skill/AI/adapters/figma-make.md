# Adapter — Figma Make (and design-tool code generation)

> Role: How to apply Assemble in Figma Make, Figma design files, and any design-tool code generator.
> Rule: **Use the Assemble React library, and never let a prototype become a spec.** React is a
> sanctioned binding — but it is undocumented, its parity with Flutter is not guaranteed, and
> production code is never derived from it.
> Prerequisite: [`../platform-adapters.md`](../platform-adapters.md) and
> [`../react-binding.md`](../react-binding.md). Read both first; this file is the Figma-specific layer
> on top of them.

---

## 0. What Figma Make actually is, in Assemble terms

Assemble has **two sanctioned bindings**:

| | Flutter | React |
| --- | --- | --- |
| Used for | **McAfee production products** | **prototyping — this is Figma Make's binding** |
| Documented | yes, in all 34 docs | **no** |
| Reconciled against Figma and the design law | yes, ~600 logged open items | no |
| Parity with the other binding | — | **not guaranteed** — a looser approximation |

So Figma Make output is **not a translation.** It is a sanctioned binding, and you should be reaching
for the **Assemble React library** rather than generating bespoke components. Generating your own
when the library has one is how a prototype becomes a fork.

But it is also **not a specification**, and that is the part that needs a label. Two things are true
at once, and both are load-bearing:

1. **The design law applies in full.** Routing, anatomy, variant criteria, content rules,
   accessibility, anti-patterns — none of it is platform-specific, and none of it relaxes for a
   prototype.
2. **Nothing you build here is evidence about the design system.** The React binding is undocumented
   and unreconciled. A prototype is never ported to Flutter, and a React prop is never cited as proof
   that Assemble has that modifier.

**The flow is one-way: design law → binding.** If someone approves a Make prototype and then asks for
the Flutter screen, the correct move is to route the *requirement* back through the component docs —
not to port the prototype. See [`../react-binding.md`](../react-binding.md) §1.

The specific risk here is that Make produces polished, plausible web code that *looks* like a
design-system implementation. With a real React library in play the risk gets subtler, not smaller:
the output may be genuinely on-system, partly on-system, or a convincing invention, and nothing on the
surface distinguishes them. §8's notice exists to say which.

---

## 1. What carries across, and what you must verify

Every component doc is cut at `## Flutter Usage`. Everything above it is design law and belongs to
**both** bindings.

| Use in full — it's design law | Verify from the React source | Leave in Flutter |
| --- | --- | --- |
| The `## Decision Tree` — all of it | The component's **name** | `Asm*` widget names |
| `## Anatomy`, honouring the **Required** column | Its **prop names** and enum spellings | Every Dart enum value |
| `## Variants` / `## Sizes` — the **criteria** | **Which** variants and sizes exist | Every snippet |
| `## Modifiers`, including what is silently ignored | Whether the component **exists at all** | `automationIdentifier` (use a test id) |
| `## States` — 8/10/10/16, additive, disabled wins | Its **prop defaults** | `AsmTokens.of(context)` and friends |
| `## Content` — label law, empty-state law, truncation law | | `LayoutBuilder`, `WidgetState` |
| `## Accessibility` — all of it, unrelaxed | | `null`-handler disabling |
| `## Anti-Patterns` — all of it | | |
| `## Rules` and `## Open Items` | | |

**The middle column has no documentation behind it.** There is no doc anywhere recording React's
names, props, or coverage — read the source, and state in your output what you verified and what you
couldn't. Deriving a React name from a Flutter one is a **BLOCKER** (gate G7.3), not a reasonable
guess: `Button` documents 8 variants and 4 sizes in Flutter, and React's set is unverified until you
look.

**Never write `Asm*` in React output.** `AsmButton` is a real name in the wrong vocabulary, which
makes it easier to miss than an invented one. Gate **G7.2**.

---

## 2. Tokens — the good news

**The Assemble React library consumes a web build of the same token source.** Same three layers, same
semantic names, same meanings. There is **no mapping to declare and no approximation to make** — which
removes the single largest source of drift in prototype work.

```
                     THE TOKEN SOURCE
              key → reference → semantic
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
      Flutter build            web build   ← what Make's React output binds to
```

What this means in practice:

- **Bind to the web build's variables.** Not to values, and not to a mapping you invented.
- **Verify the naming transform once.** The web build renames tokens mechanically into whatever form
  the target consumes (CSS custom properties, a JS export, or both), so `md.sys.color.primary` appears
  under a transformed name. That transform lives in the **web token package** — read it there, confirm
  it, and use it consistently. Do **not** guess the convention.
- **A missing token is a gap in the web build to report.** Inlining `#0074E0` because you couldn't
  find the variable defeats the entire point: the value stops responding to theme at exactly the
  moment the token system was supposed to work. Gate **G7.4** is a BLOCKER.

Everything in [`../token-contract.md`](../token-contract.md) applies unchanged:

- **The three layers.** Only the **semantic** layer may be referenced from a component, whatever the
  web build exposes.
- **Composite type tokens stay composite.** Splitting one into separate `font-size` / `font-weight` /
  `line-height` / `letter-spacing` declarations is how leading drifts.
- **Emphasis is `-emphasized`** (weight 700). Never a manual weight, never a bigger size.
- **The spacing scale is closed** — 15 steps, 0–48. `md.spacing.250` (10) has no place in a 4pt
  scale, and if the target's scale lacks a step, that's a finding, not something to round.
- **`999` is the pill.** Not a large fixed radius — the shape breaks the moment the height changes.
- **Three shadows, all zero-offset.** No shadow is the most common correct answer.
- **Dark mode is a theme swap** at the root. Never a hardcoded dark value, never a brightness branch
  at the usage site.

---

## 3. Layout — the part that still needs real care

Assemble decides layout from the **content region**, never the viewport:

```
content = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (side panel, if present)
```

Make's frames and most web output can only ask about the **viewport**. A viewport-driven layout is
wrong whenever a side panel is open — the component believes it has 386px more room than it has.

**What to do:** use a container-based mechanism if one is available. If not, say plainly in the notes
that the layout only holds while no side panel is open. Silence here reads as "this works."

Everything else transfers unchanged:

- **Exactly two thresholds: 500 and 980.** Not three.
- SM (500–979): **4 columns**, overlay drawer, bottom sheet — all three transforms together.
- MD / Default / Max (980+): **12 columns**, persistent rail, side panel — **structurally
  identical**; never design or build three variants for them.
- **1280 and 1440 produce identical content.** The grid capped at 992 first; only the margin differs.
  If a Make file has separate 1280 and 1440 frames, they should be the same layout in different
  margins.
- Grid caps at **992** `((12 × 68) + (11 × 16))` and **centres**. The surplus margin is intentional —
  don't fill it with content, and don't stretch cards to consume it.
- Rail (**60**) and side panel (**386**) are **fixed**, sit **outside** the grid, and are **siblings**
  of the content — never ancestors, or the content never receives real constraints.
- Vertical rhythm: **24** between items, **30** at section boundaries.
- **No nested grid inside a card.**
- Components are **container-agnostic**: correct beside a 386 panel, inside a bottom sheet, and inside
  a card, without knowing the window size. Never pass a breakpoint tier as a prop.

**And remember the form factor.** This is a desktop app with a resizable window. There is no mobile
build. A 375px-wide Make frame is not an Assemble target; SM starts at **500** and means a narrow
desktop window.

---

## 4. What Make gets wrong by default

Check each of these before you ship a frame. None of them relax because the output is a prototype —
the prototype is what stakeholders approve.

| Default behaviour | What Assemble requires |
| --- | --- |
| Focus states omitted | The ring is **mandatory** — 2px `primary`, 2px offset, keyboard-only. This is the most common omission in generated web code and the most consequential. Figma rarely draws focus states; that is a **Figma gap**, never permission to skip it. |
| `outline: none` on focusables | Never. Gate **G7.13**. |
| Hover-only affordances | Nothing consequential in a hover-only or transient surface. |
| Tap targets sized to the glyph | **48×48 minimum**, achieved with **padding**. |
| A shadow on every card | **No shadow is the most common correct answer.** Three shadows exist; peers share one. |
| Tonal "elevation" — a greyer box to imply lift | Elevation is **shadow-based**. `surface-container-*` is a fill, not a lift. |
| Colour as the whole message | **Never meaning by colour alone.** The text must say what the colour says. |
| A whole card made clickable | Cards carry no interaction. Put a real control inside. |
| Placeholder used as the label | The label **persists** once typing starts. |
| "No data" empty states | Say **why** it's empty and **what to do next**. "Nothing matched" needs a different action from "nothing yet". |
| "OK" / "Submit" / "Confirm" | Labels are **verb phrases** naming the action. Destructive labels name what is destroyed. |
| Labels shrunk or truncated to fit | Labels **never truncate**. Fix the label or the container. |
| Filled icons for emphasis | Filled means **selected**. Material Symbols Outlined, weight 400. |
| Sizes mixed within a button group | **One size per group.** Exactly one `filled` button per surface. |
| Two competing primary buttons | One. Emphasis is relative; two primaries is none. |
| Off-scale spacing from nudging frames | 15 steps, closed. Nudging produces 14 and 18; neither exists. |
| A phone frame | Desktop, resizable window. SM starts at 500. |
| A bespoke component the library already has | Use the library. Gate **G7.12**. |
| `<AsmButton>` from autocomplete | Wrong vocabulary. Gate **G7.2**. |

---

## 5. What never to generate

Being a sanctioned binding does not extend to inventing components. A prototype is exactly where an
invented component becomes precedent.

- **The seven undocumented components** — `brand`, `feature banner`, **`guided action panel`**,
  `lists`, `quick action`, `toggle groups`, **`topbars`**. Generating one manufactures a component the
  design system does not have, and it will be cited back. Name the gap.
- **A `Popover`.** It ships no Flutter implementation. Don't create one here and imply it exists.
- **A reusable carousel.** Only the dot indicator exists — decorative, not focusable, not tappable.
  The one working carousel is private to `Alert Card`.
- **A bottom navigation bar.** The rail docks **left at every tier**, without exception. At SM it
  becomes a **left overlay drawer** over a scrim.
- **A component named `Asm…`.** Those names belong to the Flutter library. React uses a different
  prefix or plain names.
- **A new variant on a library component.** If React lacks the variant you need, say so and record
  what's absent. Adding one to satisfy a prototype is a deliberate, separate decision — not something
  a prototype gets to make.
- **Anything with motion specified.** There are **no motion tokens** in Assemble. If a prototype needs
  a transition, that value is invented — say so.

---

## 6. Using the Figma MCP tools

When available, read real values rather than eyeballing a rendering:

| Tool | For |
| --- | --- |
| `get_variable_defs` | actual token names and values bound in the file |
| `get_design_context` | structure, layers, properties |
| `get_metadata` | the frame tree, cheaply |
| `get_screenshot` | visual confirmation only — never a source for values |
| `get_code_connect_map` | existing component→code mappings, if any |

Three standing cautions:

- **Figma is precedence tier 10.** It loses to the doc body on *meaning* and to a binding on *what to
  type*. If the file and the docs disagree, **document both and flag it** — don't pick silently.
- **Names drift, in three vocabularies now.** `Button` sizes: Figma `huge`/`spacious`/`default`/
  `compact` → Flutter `large`/`medium`/`small`/`xsmall`. Figma's **`default` is Flutter's `small`**,
  and the documented default size is `medium`. Three meanings of one word — and **nothing records
  what React calls them.** See [`../glossary.md`](../glossary.md) §2.
- **`get_code_connect_map` may point at either binding.** Check which one before you trust a mapping,
  and never carry a Flutter mapping into React output.

---

## 7. Design-file authoring (not code generation)

The best-behaved case, because there's no implementation to mislabel.

- Redlines reference **token names**, not the pixels you measured.
- Draw the **focus state** for every interactive component. It's the most common Figma omission and
  the most consequential.
- Draw the full state set: hover, pressed, focus, disabled. There is no partial set.
- Design **one** MD+ layout, not three. MD, Default, and Max are structurally identical.
- Design SM as the **transformed shell** — drawer, bottom sheet, 4 columns — all at once, not
  piecemeal.
- Don't design a component that only works at one width. It must be correct beside a 386 panel,
  inside a bottom sheet, and inside a card.
- If a component you need has no doc, that's a gap to file, not a thing to invent. The next two docs
  the system needs are **guided action panel** and **topbars**.

---

## 8. Attach this to every code deliverable

Make output that uses the Assemble React library is **not** a translation, so it does not carry a
translation notice. It carries a fidelity notice instead:

```
REACT PROTOTYPE — SANCTIONED BINDING, NOT A PRODUCTION SPEC
  Design law applied : <component>.md, everything above ## Flutter Usage
  Binding            : Assemble React (prototyping), via Figma Make
  Tokens             : web build of the shared token source — semantic layer only
  API verified from  : <source read> | NOT VERIFIED: <what you couldn't confirm>
  Parity             : not guaranteed against Flutter — variants/sizes verified per component
  Do not             : port this to Flutter, or cite it as evidence about the design system
  Layout caveat      : <container-based | viewport-based — wrong when a side panel is open>
```

If the output **deliberately does not use** the Assemble React library — hand-rolled CSS, a bespoke
component set — then it *is* a translation, and it takes the `TRANSLATION — NOT SANCTIONED ASSEMBLE`
notice from [`../platform-adapters.md`](../platform-adapters.md) §7 instead, with a declared,
unreviewed token mapping above it. Ask which one you're producing before you label it.

Then the `ASSEMBLE VALIDATION` block from [`../validation.md`](../validation.md), with **G7** run and
**G5** reported as `—` (not Flutter).
