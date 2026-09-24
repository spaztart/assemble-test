# Decision Priority

> Role: The precedence ladder. When two sources in this design system disagree, this file says
> which one you follow.
> Rule: A conflict is never resolved silently. Follow the ladder, then **say which side you
> took and why**.
> Scope: Applies to every target — Flutter, React, Figma, or a translation.

Assemble is documented across 42 files, and implemented **twice** — Flutter for production products,
React for prototyping — alongside its Figma source. They do not always agree, and the disagreements
are catalogued rather than hidden (~600 numbered open items across the component docs). That makes
precedence a real question with a real answer, not a matter of judgement.

---

## The ladder

Higher tier wins. Always. Check from the top.

| Tier | Source | Wins over everything below because |
| --- | --- | --- |
| **1** | **Accessibility floors** (§1) | They are the only rules with an external authority behind them. Nothing in this system may trade them away. |
| **2** | **The component's banner `Rule:` line** | Deliberately chosen as the most-violated rule for that component. It is the one thing to retain if you read nothing else. |
| **3** | **The component's `## Rules` list** | Extracted, numbered constraints. Every entry restates something argued in the body. |
| **4** | **Foundation `## Rules`** (Color, Typography, Spacing, Grid, Breakpoints, States, Elevation, Icons) | Foundations own their subject system-wide. |
| **5** | **The component's `## Decision Tree`** | Routing. Settles *which* component before anything settles *how*. |
| **6** | **Component body prose** — Overview, Anatomy, Variants, Sizes, Modifiers, Behaviors, Content, Placement | The reasoning. Where a rule surprises you, this is where the why lives. |
| **7** | **`## Anti-Patterns`** | Failure catalogue. Advisory relative to the Rules, but a named anti-pattern is never acceptable output. |
| **8** | **`## Flutter Usage`** — widget names, enums, parameter tables, snippets | The **production binding**. Documented and reconciled. Correct for Flutter; carries no authority for any other target. |
| **9** | **The React source** — component names, props, variant coverage | The **prototyping binding**. Authoritative about what React *does*, because it's code. **Undocumented and unreconciled**, so it carries no authority about what the system *means*. |
| **10** | **Figma component sets, variant names, measured geometry** | Design source. Frequently drifts from both bindings, and rarely draws focus states. |
| **11** | **Shipped defaults** — `Asm*` widget defaults and React prop defaults | **Actively distrusted.** Several contradict the documented guidance. A default is what the library does, not what the system means. |
| **12** | Anything else — legacy docs, older `Design System/` notes, your own inference | No authority. |

**Tier 11 is below tier 10 on purpose.** `AsmButton` defaults to `variant: text, size: large`
while the guidance is `filled`/`medium`; `AsmNavigationRail.bottom` ships a constructor the
system forbids. A shipped default is evidence about the code, never evidence about the design.

**Tier 12 includes your own reasoning.** Plausibility is not a source. See §5.

### The two bindings are not peers

Assemble has two sanctioned implementations and they carry different weight:

| | Flutter (tier 8) | React (tier 9) |
| --- | --- | --- |
| Used for | **production products** | **prototyping** (Figma Make and similar) |
| Documented | yes, in all 34 docs | **no** |
| Reconciled against Figma and the design law | yes — ~600 numbered open items | no |
| API parity with the other binding | — | **not guaranteed** |

**Neither binding is ever evidence about the other, and React is never evidence about the design.**
If React exposes a prop Flutter doesn't, that is not a documented modifier. If React lacks a variant,
that is not a deprecation. In both directions the component doc wins and the difference is an open
question.

**The flow is one-way: design law → binding.** Never derive Flutter code from a React prototype. If a
stakeholder-approved prototype is the input to a Flutter task, route the *requirement* back through
the component doc — don't port the prototype. See [`react-binding.md`](react-binding.md) §1.

---

## 1. The accessibility floor (tier 1)

These override every other rule in the system, including a component's own banner rule. If
satisfying a design rule would breach one of these, the design rule is wrong and the conflict
is an open item.

1. **48×48 minimum touch target**, achieved with padding, never by enlarging a glyph. Holds at
   200% text scale.
2. **Visible keyboard focus** — `md.sys.color.primary`, 2px, offset 2px. Never removed,
   narrowed, or softened.
3. **Never meaning by colour alone.** A status must be readable by glyph, label, or adjacent
   text.
4. **Every meaningful icon has an accessible name**; decorative icons are hidden from assistive
   technology.
5. **Icon-only controls need both an accessible label and a tooltip.** The glyph is not a name.
6. **Contrast minimums:** 4.5:1 normal text, 3:1 large text, 3:1 interactive and non-text
   content.
7. **Nothing consequential lives only in a transient or hover-only surface.** Snackbars expire,
   tooltips vanish, scrollbars fade, and none of the three is reliably reachable.
8. **Disabled elements leave the tab order** and receive no other state.

Two documented exceptions, both accepted and both narrow:

- **Disabled content sits at 38% and does not meet text contrast.** Accepted because it is
  non-interactive — which is exactly why disabled text may never be the only place information
  appears.
- **`Cards`' `brand` variant measures 3.9:1** — large text only. Not a licence to relax
  contrast elsewhere.

---

## 2. Component overrides foundation — but only for itself, and only out loud

A component doc may diverge from a foundation. When it does, the component wins **within that
component**, the divergence is documented in its `States`/`Behaviors` section, and it is filed
as an open item. It never generalises.

Live examples:

| Divergence | Foundation says | Component says | Status |
| --- | --- | --- | --- |
| Button disabled treatment | `States`: 12% container / 38% content | `Button`: **38% both**, matching Figma's whole-container opacity | Open item — one of the two is wrong |
| Button disabled container colour | `States`: derived from `on-surface` | `Button`: derived from `colorScheme.outline` at 38% | Open item |
| `text` / `textNoPadding` state layer | `States`: every interactive element expresses hover/pressed/focus | `Button`: those two variants have **no state layer at all** | Open item — and the reason a standalone text button must carry an icon |

**How to use a divergence:** follow it for that component, cite it, and never propagate it. "The
button renders disabled at 38%/38%, which diverges from `States`' 12%/38% — see `Button` open
item 4" is a correct answer. Quietly applying 38%/38% to a list row is not.

---

## 3. Figma vs implementation — and which implementation

**Do not pick a side silently.** Document both and flag the conflict — that is the authoring
rule, and it is the reading rule too.

Resolve by what the question is actually asking:

- **"What does this mean / when do I use it?"** → the doc body wins. No tool and no binding is
  authoritative about intent.
- **"What do I type?"** → the binding for **your** target wins. Flutter → `## Flutter Usage`.
  React → the React source, verified, because nothing is written down
  ([`react-binding.md`](react-binding.md)). Never answer this from the other binding.
- **"Which variants and sizes exist?"** → the component doc for the *criteria*, then your binding
  for what it actually exposes. React parity is **not guaranteed**, so verify rather than assume.
- **"What should the redlines say?"** → Figma wins, but check the doc's open items first: Figma
  **rarely draws focus states**, so a missing focus variant is a Figma gap, not permission to
  skip focus.
- **"What is this called?"** → all of them, with the mapping. Three vocabularies are in play —
  Figma names, Flutter `Asm*` names, and React names (a **different prefix or plain names**).
  Assume they disagree until a table proves otherwise. [`glossary.md`](glossary.md).

Known name drift is catalogued in [`glossary.md`](glossary.md).

---

## 4. Cross-component conflicts

When two components both claim a job, the tie is broken in this order:

1. **The narrower role wins.** A component whose `Role:` names the exact case beats a general
   one. Homepage security risks are `Alert Card`, not `Cards` — even though `Alert Card` is
   built on `Cards`.
2. **Route down to the substrate, never up.** `Cards` is the base of six components. A doc for
   one of those routes *down* to `Cards` for the surface and does not restate its variants.
3. **Both decision trees must agree.** Cross-links are reciprocal by design. If A routes to B
   and B does not route back, you are reading a stale doc — flag it.
4. **The component that owns the width decision wins.** `Alert Card` already resolves deck vs
   carousel from width. Don't rebuild that outside it.
5. **Composition beats duplication.** "Many alerts" is many items inside **one** `Alert Card`,
   never several alert cards stacked.

---

## 5. Under-specification

Absence of a value is a finding, not a licence.

**Never** infer a number because it looks like the scale. **Never** copy a value from a sibling
component. **Never** resolve a token to a hex value and hardcode it. **Never** invent a variant,
state, size, or parameter that no doc names.

**Do** say which value is missing and where you looked. **Do** check `## Open Items` — roughly
600 entries mean the gap is often already recorded, and citing it is a better answer than
filling it. **Do** offer the nearest documented option and name what it can't do.

Standing gaps that come up constantly:

- **No breakpoint tokens.** 500 and 980 are measured, not tokenized.
- **No layout tokens.** 992, 386, 60, 16, 24, 30 are measured, not tokenized.
- **No motion tokens.** Visible in at least five components (`Accordion` item 8, both charts,
  `Navigation Rail` item 24). Should be promoted to a Foundations gap rather than restated again.
- **No column-span-per-component record.** `Grid` defines the grid; which span each card takes
  at each tier was never written down.

---

## 6. Worked resolutions

**"Give the delete button an error-coloured outline."**
Tier 3 (`Button` rule 7): destructive is honoured on `filled`, `tonal`, `text` **only** — on
`outline` the flag is silently ignored and renders an ordinary button. Answer: switch to
`filled` or `tonal` destructive. Also tier 3 (rule 8): the label must name what is destroyed —
"Delete account", not "Confirm".

**"The 1440 layout should be wider than the 1280 one."**
Tier 4 (`Breakpoints` rule 3, `Grid` rule 4): the grid caps at 992 and centres, so 1280 and
1440 produce **identical content**. The difference is margin. Any rule branching between them is
describing margin, not layout.

**"Raise the card with `surface-container-high`."**
Tier 4 (`Elevation` rule 3): elevation is shadows, not tonal fills; `surface-container-*` is a
container fill for tertiary UI, not an elevation scale. Answer: `light`, or no shadow.

**"Put the nav bar along the bottom on small windows — the constructor exists."**
Tier 2 (`Navigation Rail` banner rule) beats tier 11 (a shipped default/constructor). The rail
docks left at every tier; at SM it hides and returns as a left overlay drawer over a scrim.
Cite `Navigation Rail` open item 1.

**"Use the tooltip to explain the required format."**
Tier 1 (§1.7) and tier 2 (`Tooltip` banner rule): a tooltip is never the only place information
appears. If it's needed to complete the task, it belongs on the surface — as supporting text on
the field (`Text Fields`).

**"Figma calls this size `default`, so use the default size."**
Tier 10 with the mapping applied: Figma's `default` is Flutter's **`small`**. Tier 3 (`Button` rule
6): the documented default is `medium`. The two words mean different things; translate, don't
assume.

**"The React prototype uses a `subtle` button variant, so add it to Flutter."**
Tier 9 carries no design authority. React is a looser approximation with no reconciliation pass, so
its API is not evidence about the system. Answer: `Button` documents 8 variants (tier 3/6) and
`subtle` is not among them. The React prop is an **open question worth filing** — possibly the most
useful thing that prototype produced — not a variant to implement.

**"Prototype's approved — build the Flutter screen from it."**
The flow is one-way. Take the *requirement* the prototype demonstrates, route it through the
component docs again, and expect differences: React parity is not guaranteed, so the prototype may
be using a variant, size, or default that Flutter doesn't have or names differently. Porting it
launders an unreconciled approximation into production.
