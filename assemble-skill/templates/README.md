# Templates

> Role: Whole-screen **compositions** — how Assemble's components assemble into a feature. A component
> doc answers *"how does this control behave?"*; a template answers *"how is this screen built?"*
> Rule: **A template composes; it never redefines.** Every component it places is governed by that
> component's own doc, which wins on every detail. A template owns only what no single component owns:
> region geometry, section order, vertical rhythm, and which slot holds what.
> Scope: **Layer A design law.** A template is target-independent — the same composition in Flutter
> production code and in a React prototype. Binding-specific notes live in the final sections.
> Source: read from Figma design files and reconciled against `../Components/` and `../Foundations/`.

---

## What lives here

| Template | Reads from | Covers |
| --- | --- | --- |
| [`home-feature-layout.md`](home-feature-layout.md) | `Feature Layouts` → `app` (`125:2435`) | The full app shell: system app bar, navigation rail, centred content column (salutation → alert deck → quick actions), and the guided action panel |

---

## Why templates are a separate folder

The 34 component docs are deliberately **container-agnostic** — `Cards` sets no width, `Alert Card`
negotiates its own presentation from available width, and no component knows what screen it is on. That
is correct, and it leaves a real gap: nothing records how a *feature* is put together.

Three questions have no home in a component doc, and they are exactly what a template answers:

1. **What are the regions, and how wide is each?** The content-region formula lives in
   [`../Foundations/Grid.md`](../Foundations/Grid.md), but the actual decomposition of a given screen
   does not.
2. **What is the section order and the rhythm between sections?** `Grid` gives 24 between items and 30
   at section boundaries; which gaps in a screen are "items" and which are "boundaries" is a
   composition decision.
3. **Which component fills which slot, and what happens when one is empty?** A screen with no alerts
   and a screen with four alerts are the same template in two states.

## How to read a template

Read it **second**. Route the requirement through
[`../AI/component-router.md`](../AI/component-router.md) first, open the component docs it names, and
only then use the template to place them. A template is a composition record, not a routing authority —
if it shows a `Modal` where your requirement wants a `Snackbar`, the decision tree wins.

**Where a template and a component doc disagree, the component doc wins.** Templates restate geometry
for convenience, and restatement drifts.

## How to author one

1. **Read the frame, don't eyeball it.** Pull the node tree for exact geometry and
   `get_variable_defs` for the tokens actually bound in the file. Measured pixels are not a spec.
2. **Record the as-drawn geometry and the doc-conformant geometry separately** when they disagree, and
   resolve the conflict explicitly using the ladder in
   [`../AI/decision-priority.md`](../AI/decision-priority.md). Figma is **tier 10**; a foundation's
   rules are **tier 4**. Never silently adopt the drawing.
3. **Delegate every component detail.** Link to the doc; do not restate variants, states, or anatomy.
   If you find yourself describing how `Alert Card` behaves, stop and link instead.
4. **Number every conflict** in `## Open Items`, the way component docs do. A template that describes
   only the drawing is a redlines file; the value is in the reconciliation.
5. **Name undocumented components as gaps**, and distinguish the two kinds sharply: a component with
   **no doc but a shipping widget** (use it, carefully) versus one with **no implementation at all**
   (don't invent it).

Templates are **not** a place to introduce new components, new tokens, or new spacing values. A
template that needs a value the system doesn't have has found a gap to file, not a licence to invent.
