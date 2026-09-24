# React Binding

> Role: How to use Assemble's React components — the prototyping binding, used in Figma Make and
> similar tools.
> Rule: **React is sanctioned, and React is not a spec.** The design law applies in full; the API
> does not carry across from Flutter, and nothing built here may be cited as production truth.
> Scope: The React component library only. Flutter production work uses `## Flutter Usage` in each
> component doc. Hand-written web code that does *not* use this library is a translation —
> see [`platform-adapters.md`](platform-adapters.md).
> Source: **there is no written documentation for the React components.** This file records what is
> known about the binding and what you must verify from the source. Everything above
> `## Flutter Usage` in the component docs remains the design law for both bindings.

---

## 0. What React is for

Assemble has **two sanctioned implementations**:

| | Flutter | React |
| --- | --- | --- |
| Used for | **McAfee production products** | **prototyping** — Figma Make and similar |
| Documented | yes — `## Flutter Usage` in all 34 docs | **no** |
| Reconciled against Figma + design law | yes, ~600 logged open items | no |
| API parity with the other binding | — | **not guaranteed** — a looser approximation |
| Component coverage | the 34 documented components | unknown; verify per component |
| Token source | `assemble_flutter_tokens` | the **web build of the same tokens** |
| Authority for "what do I type?" | full, for Flutter | full, for React |
| Authority for "what is correct?" | it's the documented binding | **none** |

Both bindings sit under the same design law. Neither is the design law.

---

## 1. The one-way flow rule

This is the rule that prevents the damage, and it is the reason this file exists.

```
                    DESIGN LAW  (Layer A — above `## Flutter Usage` in every component doc)
                    routing · meaning · anatomy · content · a11y · anti-patterns
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
      FLUTTER BINDING           REACT BINDING
      production                prototyping
      documented                undocumented
      reconciled                looser approximation

      ✗  React ──→ Flutter        A prototype is never an implementation spec.
      ✗  React ──→ design law     An approximation is never evidence about the system.
      ✓  design law ──→ either
```

**Never derive Flutter code from a React prototype.** The flow is design law → binding, never
binding → binding. If a stakeholder-approved Figma Make prototype is the input to a Flutter task,
the correct move is to route the *requirement* through the component docs again, not to port the
prototype.

**Never treat the React library as evidence about Assemble.** If React has a prop Flutter doesn't,
that is not a documented modifier. If React is missing a variant, that is not a deprecation. If
React renders something at 14px, that is not a type token. In every case the component doc wins and
the React behaviour is, at most, an open question.

This is precedence, not etiquette: the React source sits at **tier 9** for "what do I type in
React" and has **no tier at all** for design questions. See
[`decision-priority.md`](decision-priority.md).

---

## 2. What carries across, and what doesn't

### Carries across in full — use all of it

Everything above `## Flutter Usage` in the component doc:

- The **`## Decision Tree`.** Routing is target-independent. A modal that should have been a
  snackbar in Flutter should have been a snackbar in React.
- **`## Anatomy`**, including the **Required** column. Required parts are required in a prototype
  too.
- **`## Variants` / `## Sizes` — the *criteria*.** `Badges` `type` is still decided by the surface
  behind it. `Alert Card` layout is still decided by available width. `Button` `ghost` still means
  "sits on imagery or a gradient."
- **`## Modifiers`**, including what is documented as silently ignored.
- **`## States`** — hover 8% · focus 10% · pressed 10% · dragged 16%, additive, disabled wins,
  enabled is the absence of a layer.
- **`## Content`** — label law, empty-state law, truncation law. All of it.
- **`## Accessibility`** — all of it, unrelaxed. A prototype without focus states is how a shipped
  screen ends up without them.
- **`## Anti-Patterns`** and **`## Rules`.**
- **`## Open Items`** — the conflicts are real in both bindings.
- The **foundations**: colour roles, the type scale, the 15 spacing steps, the radius and border
  scales, the three shadows, icon sizes and pairings, the layout model.

### Does not carry across — verify from the React source

- **Component names.** React uses a **different prefix or plain names**. `Asm*` is Flutter
  vocabulary. Never write `<AsmButton>`, and never derive a React name from a Flutter one.
- **Prop names, enum values, and their spellings.**
- **Which variants and sizes exist.** Parity is not guaranteed. `Button` documents 8 variants and 4
  sizes in Flutter; do not assume React has 8 and 4.
- **Which components exist at all.** Coverage is unknown. Check before you use.
- **Default prop values.** Distrusted, exactly as Flutter's are — and with less documentation behind
  them.
- **Anything from `## Flutter Usage`**: `automationIdentifier`, `LayoutBuilder`, `WidgetState`,
  `null`-handler disabling, `AsmTokens.of(context)`. All Flutter mechanisms.

---

## 3. Tokens — the good news

**The React components consume a web build generated from the same token source.** Same three
layers, same semantic names, same meanings:

```
md.key.*        key         authoring only
md.ref.*        reference   authoring only
md.sys.* / mcafee.*   semantic    ← what UI consumes, in both bindings
```

So the token *contract* is identical to [`token-contract.md`](token-contract.md), and there is **no
mapping to declare and no approximation to make**. Everything in that file applies:

- Semantic layer only. Never `md.key.*` or `md.ref.*`.
- **No hex, no `rgb()`, no `hsl()`.** The reason is the same and it is not stylistic: a resolved
  value stops responding to theme at exactly the point the token system was supposed to work.
- The **15-step** spacing scale, closed. Radius including **999** as the pill. Border widths 0–4.
- **Composite type tokens.** Never split one into separate size / weight / line-height / tracking
  declarations — that is how leading drifts.
- Emphasis is **`-emphasized`** (weight 700), never a manual weight, never a bigger size.
- **Heavy**: display and headline only, promotional only. **Mono**: data values only.
- **Three shadows**, all zero-offset. Elevation is **not** tonal. No shadow is the most common
  correct answer.
- **Dark mode is a theme swap.** Never a hardcoded dark value, never a brightness branch at the
  usage site.

**Verify the naming transform once, then be consistent.** The web build necessarily renames tokens
into whatever form the target consumes (CSS custom properties, a JS export, or both), so
`md.sys.color.primary` will appear under a transformed name. That transform is mechanical and it is
in the web token package — read it there, confirm it, and use it everywhere. Do **not** guess the
convention, and do **not** fall back to a literal because you couldn't find the variable.

If a token genuinely has no entry in the web build, that is a **gap in the web build** to report —
not licence to inline a value.

---

## 4. Layout — the part that needs real care

Assemble decides layout from the **content region**, never the viewport:

```
content = window − 16 (margin) − 60 (rail) − 16 (margin) − 386 (side panel, if present)
```

Web targets can trivially ask about the viewport and often cannot ask about the container. **A
viewport-driven layout is wrong whenever a side panel is open** — the component believes it has
386px more room than it has.

**Use a container-based mechanism if one is available.** If it isn't, say so explicitly in the
prototype's notes rather than shipping a layout that only holds when no panel is open.

Everything else transfers unchanged:

- **Exactly two thresholds: 500 and 980.** Never a third.
- SM (500–979): **4 columns**, overlay drawer, bottom sheet — all three transforms together.
- MD (980–1279) / Default (1280–1439) / Max (1440+): **12 columns**, persistent rail, side panel —
  and **structurally identical**. Never build three variants. 1280 and 1440 differ only in margin.
- Gutter and outer margin **16** at every tier.
- The grid **caps at 992** `((12 × 68) + (11 × 16))` and **centres**. The surplus margin is
  intentional; don't fill it and don't stretch cards into it.
- Rail (**60**) and side panel (**386**) are **fixed**, sit **outside** the grid, and are
  **siblings** of the content — never ancestors, or the content never receives real constraints.
- Vertical rhythm: **24** between items, **30** at section boundaries.
- **No nested grid inside a card.**
- Components are **container-agnostic**: correct beside a 386 panel, inside a bottom sheet, and
  inside a card, without knowing the window size. Never pass a breakpoint tier as a prop.

And the form factor: **desktop app, resizable window.** There is no mobile build. SM starts at
**500** and means a narrow desktop window, not a phone. A 375px prototype frame is not an Assemble
target.

---

## 5. Accessibility does not relax for prototypes

The floor is tier 1 — it outranks every other rule in the system, in both bindings, and "it's just a
mock" is not an exception.

1. **48×48** minimum interactive target, achieved with **padding**, holding at 200% text scale.
2. **Visible keyboard focus ring** — the `primary` colour, 2px, 2px offset, solid, **keyboard only**.
   Never removed, narrowed, or recoloured. This is the most common omission in generated web code and
   the most consequential.
3. Every interactive element expresses **hover, pressed, focus, disabled**. No partial sets.
4. **Never meaning by colour alone** — status, severity, destructive, chart segments.
5. Meaningful icons have accessible names; decorative icons are hidden. **Icon-only controls need
   both an accessible name and a tooltip.**
6. Contrast: **4.5:1** normal text · **3:1** large text · **3:1** interactive and non-text.
7. **Nothing consequential lives only in a transient or hover-only surface.**
8. **Disabled leaves the tab order** and receives no other state.

The two documented exceptions are narrow and unchanged: disabled content at 38%, and `Cards`'
`brand` variant at 3.9:1 (large text only).

Also unchanged: keep the announced-name slots distinct — the **visible label** (read), and a
**semantic/accessible name** that *expands* a too-terse label and never says something different.
Flutter's `automationIdentifier` has a web analogue (a test id); it is a different mechanism with
the same discipline — derived from purpose, kebab-case, never spoken.

---

## 6. Working with a component whose React support is unknown

Because coverage and parity are both unverified, run this before you use a component:

1. **Read the component doc first** (Layer A). Route, choose the variant by its stated criterion,
   note the required anatomy and the content rules. This step is identical for both bindings.
2. **Check the React source for the component.** Does it exist? Under what name?
3. **Check which variants and sizes it actually exposes**, and against what prop names. Do not
   assume the Flutter list.
4. **If it's missing, or the variant you need is missing:** say so. Build the nearest thing from
   primitives, follow the doc's Layer A rules, and record what's absent. Do not add a variant to the
   library to satisfy a prototype without that being a deliberate, separate decision.
5. **If React diverges from the doc** — an extra prop, a missing state, a different default — the
   **doc wins** and the divergence is an **open question**, not a feature. Report it; it may be the
   most useful thing the prototype produces.

Never invent a React component for one of the seven undocumented components (`brand`,
`feature banner`, **`guided action panel`**, `lists`, `quick action`, `toggle groups`, **`topbars`**),
and never build a `Popover` or a reusable carousel — neither exists in the documented system. A
prototype is exactly where an invented component becomes precedent.

---

## 7. Report shape for React work

The four required elements are the same as everywhere else, plus two that are specific to this
binding:

1. **The routing decision and its reason**, citing the component doc.
2. **The variant/size choices and the input each was decided from.**
3. **Every value as a token name.**
4. **Open items touched, and anything you could not verify.**
5. **Which React names and props you verified from the source** — and which you couldn't find.
6. **The fidelity notice** below.

```
REACT PROTOTYPE — SANCTIONED BINDING, NOT A PRODUCTION SPEC
  Design law applied : <component>.md, everything above ## Flutter Usage
  Binding            : Assemble React (prototyping)
  Tokens             : web build of the shared token source — semantic layer only
  API verified from  : <source read> | NOT VERIFIED: <what you couldn't confirm>
  Parity             : not guaranteed against Flutter — variants/sizes verified per component
  Do not             : port this to Flutter, or cite it as evidence about the design system
  Layout caveat      : <container-based | viewport-based — wrong when a side panel is open>
```

Then the `ASSEMBLE VALIDATION` block from [`validation.md`](validation.md), with **G5** (Flutter
binding) reported as `—` and **G7** (React binding) run instead.

---

## 8. The standing gap

**There is no written documentation for the React components.** No doc records their names, props,
variant coverage, or divergences from the Flutter binding — so every one of those questions currently
resolves to "read the source," and nothing catches drift between the two bindings.

The component-doc template makes this worse rather than better: it currently instructs authors to
**never mention web, HTML, CSS, React, or web components**, which was correct when Flutter was the
only binding and is now the reason a real, sanctioned implementation has no home in the docs.

Two things would close it, in order:

1. **Amend the template** to add a `## React Usage` section alongside `## Flutter Usage`, under the
   same layer rule — platform-agnostic design law above, bindings below — and relax the web
   prohibition to apply to *design law* only, not to a documented binding.
2. **Reconcile per component**, the same way Flutter was: read the React source, compare against the
   doc and against Figma, and log every disagreement as a numbered open item. The docs with the most
   open items are the most trustworthy ones precisely because someone did this.

Until then, treat every React API detail as unverified, and say which ones you checked.
