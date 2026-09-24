# Platform Adapters

> Role: Decide which binding you are writing to, and what authority it carries. Assemble has **two
> sanctioned bindings** — Flutter for products, React for prototyping — and everything else is a
> translation.
> Rule: **Design law is portable. Bindings are not.** Never carry an API across bindings, and never
> present a translation as sanctioned Assemble.
> Scope: Mandatory before writing any non-Flutter output. Read it *before* phase 7 of
> [`reasoning-engine.md`](reasoning-engine.md), not after.

---

## 0. Pick your target first

| Target | Status | Purpose | Where the API comes from |
| --- | --- | --- | --- |
| **Flutter** | **sanctioned** | **McAfee production products** | `## Flutter Usage` in each component doc |
| **React** | **sanctioned** | **prototyping** — Figma Make and similar | the React source. **No docs exist** — see [`react-binding.md`](react-binding.md) |
| Figma design files | design source | redlines, specs | the Figma file; precedence tier **10** |
| Spec prose, tickets, PRDs | — | describing, not implementing | the docs. No binding needed. |
| Hand-written web, or any other framework | **translation** | nothing sanctioned | you're inventing it. §4. |

**Establish the target before anything else.** Getting this wrong invalidates every later decision.
Ask: is this a Flutter product repo, a React prototype, a Figma file, prose, or something with no
sanctioned binding at all?

---

## 1. The three-layer model

Every component doc is cut at `## Flutter Usage`. Everything above that heading is design law and
belongs to **both** bindings.

```
            LAYER A — DESIGN LAW           portable, and where all the authority lives
            Banner · Overview · Anatomy · Sizes · Variants · Modifiers ·
            States · Behaviors · Content · Decision Tree · Accessibility ·
            Anti-Patterns · Rules · Open Items
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
  LAYER B-FLUTTER                        LAYER B-REACT
  `## Flutter Usage`                     the React source
  production · documented ·              prototyping · UNDOCUMENTED ·
  reconciled (~600 open items)           looser approximation, parity not guaranteed
  Asm* widget names                      different prefix or plain names
```

| | Layer A | Layer B (either binding) |
| --- | --- | --- |
| Contains | routing, meaning, anatomy, content rules, a11y obligations, anti-patterns | names, props/params, code |
| Portable across bindings | **yes, entirely** | **no, not at all** |
| Precedence tier | 2–7 | 8 (Flutter) / 9 (React) |
| Authority for the *other* binding | full | **none** |

**Both bindings consume all of Layer A.** The routing decision, the required anatomy, the variant
*criteria*, the content rules, the accessibility obligations, the anti-patterns — none of that is
platform-specific. It is what the system *means*.

**Never carry Layer B across.** No `AsmButton` in React; no React prop names in Dart. And critically:
**never derive Flutter code from a React prototype.** The flow is design law → binding, never binding
→ binding. See [`react-binding.md`](react-binding.md) §1.

---

## 2. Flutter — the production binding

Use `## Flutter Usage` directly. Snippets must be **complete**, including `automationIdentifier`,
which is required and asserted non-empty.

Pass `variant` and `size` **explicitly** — the shipped defaults are untrusted (`AsmButton` defaults
to `variant: text, size: large` while the guidance is `filled`/`medium`). Disable by passing `null`
to the handler, never `Opacity`/`IgnorePointer`/`AbsorbPointer`. Never wrap an `Asm*` widget in your
own `Semantics` or `GestureDetector`. Branch on `constraints.maxWidth` via `LayoutBuilder`, never
`MediaQuery.size.width`. Never `Material(elevation:)` or `Card(elevation:)`.

Validation: run **G5** in [`validation.md`](validation.md).

---

## 3. React — the prototyping binding

**Sanctioned, so it needs no translation label** — but it is undocumented, its API parity with
Flutter is not guaranteed, and it must never be cited as production truth.

The short version:

- **Tokens are the same.** The React components consume a **web build of the same token source** —
  same three layers, same semantic names, same meanings. There is no mapping to declare and no
  approximation to make. Verify the naming transform once from the web token package, then be
  consistent. Never fall back to a hex because you couldn't find the variable.
- **Names do not carry across.** React uses a **different prefix or plain names**. `Asm*` is Flutter
  vocabulary. Never write `<AsmButton>`, and never derive a React name from a Flutter one.
- **Parity is not guaranteed.** Verify per component which variants, sizes, and props actually exist.
  Don't assume `Button`'s 8 variants and 4 sizes made it across.
- **Coverage is unknown.** Check the component exists before you use it.
- **Divergences are open questions, not features.** An extra prop is not a documented modifier; a
  missing variant is not a deprecation. The doc wins.
- **Accessibility does not relax for prototypes.** "It's just a mock" is how a shipped screen ends up
  without focus states.

Full detail, including the report shape: **[`react-binding.md`](react-binding.md)**.

Validation: run **G7** in [`validation.md`](validation.md), and report **G5** as `—`.

---

## 4. Translations — everything with no sanctioned binding

Hand-written CSS, a Vue/Svelte/SwiftUI port, a web component written from scratch, React code that
deliberately does **not** use the Assemble React library. There is no sanctioned Assemble here, so:

1. **Consume Layer A in full. Cite it.** The routing decision and the variant criteria are the
   valuable part and they translate perfectly.
2. **Map token *names* through a declared mapping** — and check first whether the **web token build**
   already covers your target, in which case use it instead of inventing a mapping. Never resolve a
   token to a hex. An unmapped token is a finding, not something to approximate.
3. **Never invent an `Asm*` API**, and don't borrow the React library's names either.
4. **Never port a Flutter or React snippet.** Read Layer A and build natively.
5. **Label the output**, per §6.

If the target has an existing design-token system, **map onto it** rather than introducing a parallel
one. Two token systems in one codebase is worse than one imperfect mapping.

### Token mapping, when you genuinely need one

Declare it **before** the output, as a table, marked unreviewed:

```
TOKEN MAPPING (declared, UNREVIEWED — check the web token build first)
  md.sys.color.primary        → --color-primary          (target var, unresolved)
  md.spacing.400              → --space-400              (16)
  md.sys.typescale.body.large → --type-body-large        (composite — do not split)
  elevation-light             → --shadow-light           (blur 20, zero offset)
  md.border.radius.999        → --radius-pill
  md.border.focus             → NO EQUIVALENT — author it: 2px solid primary, 2px offset,
                                keyboard-only
```

Rules: **names, not values** · **one-to-one or nothing** (if the target's scale lacks the step, report
it — don't round) · **composite type tokens stay composite** · **only the semantic layer is
referenceable from UI** · **mark every row unreviewed**.

---

## 5. What travels, what needs re-authoring, what never travels

| Travels intact (both bindings + translations) | Needs re-authoring per target | Never travels |
| --- | --- | --- |
| Every decision tree and routing rule | The focus ring (2px, 2px offset, keyboard-only) | `Asm*` widget names |
| Required vs optional anatomy | State layers (8/10/10/16, additive) | Flutter enum values |
| Variant and size **criteria** | Disabled at 12%/38% + tab-order removal | Flutter snippets |
| Content rules and copy law | The three shadows as shadow primitives | React prop names, into Flutter |
| The accessibility floor, all 8 items | Container-driven layout | `AsmTokens.of(context)` and friends |
| Every anti-pattern | The 992 cap and centring | The `LayoutBuilder` mechanism |
| The token architecture and semantic names | Theme swapping | `automationIdentifier` (web analogue: a test id) |
| Open items and gaps | | |

**The layout one is the sharpest for any web target.** Assemble decides from the **content region**
(`window − 16 − 60 − 16 − 386`), never window width. A target that can only query the viewport will
believe it has 386px more room than it has whenever a side panel is open. Use a container-based
mechanism if one exists; if not, say so explicitly rather than shipping a layout that only holds when
no panel is open.

---

## 6. Per-target notes

### Figma Make

The likeliest source of convincing wrong output — it produces polished web code that *looks* like a
design-system implementation.

- **Use the Assemble React library.** That is what it is for. Generating bespoke components when the
  library has one is how a prototype becomes a fork.
- Bind to the **web token build**, not to values.
- Route the component through Layer A first. Include every required anatomy part. Apply the content
  rules and the full state set.
- **Never generate** one of the seven undocumented components, a `Popover`, a reusable carousel, or a
  bottom navigation bar. A prototype is exactly where an invented component becomes precedent.
- Remember the form factor: **desktop, resizable window**. SM starts at 500. A 375px frame is not an
  Assemble target.
- Full guidance: [`adapters/figma-make.md`](adapters/figma-make.md).

### Figma design files

- Figma is **tier 10**: it loses to the doc body on *meaning* and to a binding on *what to type*.
- Translate names in both directions. `Button`: Figma `huge`/`spacious`/`default`/`compact` → Flutter
  `large`/`medium`/`small`/`xsmall`. Figma's **`default` is Flutter's `small`**. See
  [`glossary.md`](glossary.md).
- Where Figma and an implementation disagree, **document both and flag it.** Don't quietly pick.
- **Figma rarely draws focus states.** A missing focus variant is a Figma gap, never permission to
  skip focus.
- Redlines reference **token names**, not measured pixels.

### Cursor / Copilot / coding agents

- **Establish the repo's binding first.** Flutter product repo → §2. React prototype → §3. Neither →
  §4.
- Install as a project rule so the constraints stay in context — see
  [`adapters/cursor.mdc`](adapters/cursor.mdc) and
  [`adapters/copilot-instructions.md`](adapters/copilot-instructions.md).
- Autocomplete is the specific risk: these tools will happily complete a plausible `AsmFoo` that
  doesn't exist, or an `<AsmButton>` in a React file where the name is different. Gates **G6.2** and
  **G7.2** exist for exactly this.

### Spec prose, tickets, redlines, PRDs

The best-behaved target — no code, so no translation problem and no label needed. Cite Layer A, name
tokens, name the component doc, list the open items you touched.

---

## 7. Labels

**Flutter** — no label. It's the documented production binding.

**React** — no translation label, but a fidelity notice, because it is undocumented and must not
become a spec:

```
REACT PROTOTYPE — SANCTIONED BINDING, NOT A PRODUCTION SPEC
  Design law applied : <component>.md, everything above ## Flutter Usage
  Binding            : Assemble React (prototyping)
  Tokens             : web build of the shared token source — semantic layer only
  API verified from  : <source read> | NOT VERIFIED: <what you couldn't confirm>
  Parity             : not guaranteed against Flutter — verified per component
  Do not             : port this to Flutter, or cite it as evidence about the design system
  Layout caveat      : <container-based | viewport-based — wrong when a side panel is open>
```

**Anything else** — a translation notice. All four facts must appear:

```
TRANSLATION — NOT SANCTIONED ASSEMBLE
  Design law applied : <component>.md, Layer A (above ## Flutter Usage)
  Target             : <CSS | Vue | SwiftUI | bespoke web | …>
  Token mapping      : declared above, UNREVIEWED — no Assemble owner has approved it
  Not portable       : Asm* widget APIs, Flutter/React snippets, container-based sizing
  Caveats            : <unmapped tokens · viewport-vs-container width · anything re-authored>
```

Then the `ASSEMBLE VALIDATION` block from [`validation.md`](validation.md), with the binding gates you
didn't run reported as `—` (never `✓`).

Three BLOCKER gates enforce this: **G6.9** (translations labeled), **G6.11** (React output carries the
fidelity notice and is never presented as a production spec), and **G6.8** (web platform concepts stay
out of the *design-law* sections of the docs — a documented binding section is a different matter; see
[`known-gaps.md`](known-gaps.md) on amending the template).
