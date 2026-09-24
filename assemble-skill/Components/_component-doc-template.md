# Template: Component Doc

> Role: The structure every component doc in this folder follows. Derived from [[Button]], which is the reference implementation.
> Rule: Follow this section order. Add sections when a component needs them; never drop a required one.
> Audience: AI models reading this design system to decide how a component should be used. Write for a reader with no prior context who must make a correct choice from the text alone.

This is not itself documentation of a component. It is the contract the component docs hold to, so that 24 docs written in sequence read as one system rather than 24 essays.

## Section Order

Required sections, in order. `Flutter Usage`, `Rules`, and `Open Items` are always last and always in this order.

| # | Section | Required | Purpose |
| --- | --- | --- | --- |
| 1 | **Banner** | Yes | Role / Scope / Rule / Source blockquote |
| 2 | **Overview** | Yes | What it is, and the one distinction most often got wrong |
| 3 | **Anatomy** | Yes | ASCII diagram + parts table |
| 4 | **Sizes** | If it has them | Geometry table + how to choose |
| 5 | **Variants** | If it has them | Table, then a subsection per easily-misused variant |
| 6 | **Modifiers** | If it has them | Cross-cutting flags (e.g. `destructive`) |
| 7 | **States** | Yes | Delegate to [[States]]; document only divergences |
| 8 | **Behaviors** | Yes | Sizing, overflow, text scale, timing, interaction |
| 9 | **Content** | If text-bearing | What the labels/copy should say |
| 10 | **Decision Tree** | Yes | ASCII tree — when to use this vs. something else |
| 11 | **Accessibility** | Yes | Requirements table + component-specific obligations |
| 12 | **Anti-Patterns** | Yes | ❌ / → pairs |
| 13 | **`## Flutter Usage`** | Yes | The ONLY implementation section |
| 14 | **`## Rules`** | Yes | Numbered MUST/NEVER summary |
| 15 | **`## Open Items`** | Yes | Source conflicts and gaps |

Sections 4–6 and 9 are conditional — a Divider has no sizes, variants, or content. Skip them rather than padding them.

**Add a section when the component demands it.** Examples: `Timing` for Snackbar, `Dismissal` for Modal, `Validation` for Text Fields, `Placement` for Tooltip and Popover. A section that earns its place is better than forcing content into a heading that doesn't fit.

## The Banner

Four lines, always in this order:

```markdown
# Component: <Name>

> Role: <One sentence — what it does. Include what it does NOT do if confusable.>
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — ... Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: <The single most important, most-violated rule. One sentence.>
> Source: Figma `Components` → `<set names>` (node `<id>`). Implementation: `pegasus_flutter/lib/asm/components/<file>.dart`.
```

The `Rule` line is the one thing a reader should retain if they read nothing else. Choose the rule that is most often broken, not the most obvious one.

## Writing Rules

### Platform-agnostic core, Flutter in exactly one place

Everything before `## Flutter Usage` describes the component as a design decision: what it means, when to use it, what it must never do. Everything Flutter-specific — widget names, enum identifiers, parameter tables, code — goes below that heading.

The test: if a section above `## Flutter Usage` names a Dart type, it's in the wrong place. The exception is a variant or size table where the identifier IS the design vocabulary (`filled`, `xsmall`) — those names are shared with Figma and are not Flutter-specific.

**Never mention web, HTML, CSS, React, or web components.** This system targets Flutter only. Do not write "on the web…", do not name a CSS property, do not reference `:focus-visible` — describe the behavior instead ("keyboard focus only").

### Never state a value you have not verified

Every number in a doc comes from the Dart source or a Figma measurement. If a value cannot be found, say so in `Open Items` rather than inferring it. A plausible-but-wrong padding value is worse than an acknowledged gap, because a reader cannot tell the difference.

When Figma and the implementation disagree, document **both** and flag the conflict. Do not silently pick one.

### Delegate to foundations; never restate them

Foundation docs own their content. Component docs reference them:

| Topic | Owner |
| --- | --- |
| Color roles, theme modes, scrims | [[Color]] |
| Type styles, weights, line height | [[Typography]] |
| Icon sizing, touch targets | [[Icons]] |
| Shadows, layering | [[Elevation]] |
| Padding, gaps, radius, border width | [[Spacing]] |
| State layers, focus ring, disabled | [[States]] |
| Tiers, thresholds, content width | [[Breakpoints]] |
| Columns, gutters, margins | [[Grid]] |

In a `States` section, do **not** re-tabulate the opacities. State that the component follows [[States]], then document only what diverges — which state role each variant uses, and any state the component omits. Divergences are the valuable content; restatement is noise that goes stale.

### Rules sections are extracted, not invented

Every numbered rule must restate something already argued in the body above it. `Rules` is a summary for a reader who needs the constraints without the reasoning — not a place for new claims. Number sequentially; use MUST and NEVER in caps.

### Open Items are conflicts, not wishes

An open item is a **contradiction, gap, or drift between sources** — not a feature request. Each should name what disagrees with what, and where. Good: "Figma's `default` size maps to code's `small`." Bad: "It would be nice if there were a loading state." The exception is a genuine gap in the system that will cause someone to build the wrong thing.

Recurring categories worth checking for in every component:
- Values off the [[Spacing]] scale, hardcoded in the implementation
- Figma naming that diverges from the code
- Missing Figma states (focus especially — Figma rarely draws it)
- Widget defaults that contradict the documented default
- Divergences from [[States]] (missing state layers, different disabled treatment)
- Raw literals where a token exists
- Missing `automationIdentifier`
- Touch targets under 48×48

### Cross-link component to component

When two components compete for the same job, each doc's `Decision Tree` must name the other. Checkbox↔Radio↔Switch, Loaders↔Skeleton Loader↔Progress Bar, Snackbar↔Alert Banner, Modal↔Sheets↔Popover, Tooltip↔Popover. A decision tree that never mentions an alternative cannot be used to make a decision.

### Voice

- **Direct and declarative.** "One `filled` button per surface." Not "it is generally recommended that…"
- **Lead with the rule, then the reason.** A reader who stops after the first sentence should still have the rule.
- **Say why when a rule is surprising.** An unexplained rule gets overridden the first time it's inconvenient.
- **No hedging on settled matters.** If the source says 48, write 48.
- Use `MUST` / `NEVER` in rules; prose elsewhere.

### Formatting

- ASCII diagrams for anatomy and decision trees — they survive plain-text reading, which images do not.
- Tables for anything with parallel structure.
- `---` before `## Flutter Usage`, `## Rules`, and `## Open Items`.
- Anti-patterns as `**❌ <the mistake>.** <why it fails.> → <what to do instead.>`
- Bold the operative term in a rule, not the whole sentence.

## Anatomy Sections

An ASCII diagram, then a parts table with a **Required** column:

```
┌─────────────────────────────────────────┐
│  ◇  ┆gap┆   Label text   ┆gap┆  ◇       │  ← container
└─────────────────────────────────────────┘
   ↑                ↑
 start icon      label
```

| Part | Required | Notes |
| --- | --- | --- |

The Required column matters more than it looks: it tells a reader what they can omit, which is the most common thing they need to know.

## Decision Trees

Two questions, in this order:

1. **Is this the right component at all?** Route to alternatives first.
2. **Which variant/size within it?**

```
Is <the distinguishing question>?
├── <case> ─────────────────→ use <other component> instead
└── <case>
    ├── <condition>? ──────→ <variant>
    └── <condition>? ──────→ <variant>
```

Route away before routing within. The most valuable thing a decision tree does is send the reader somewhere else.

## Flutter Usage Sections

Structure:

1. One line naming the widget and its file
2. Enums, if any — with a warning when a default contradicts the guidance
3. **Basic usage** — the common case, complete and runnable
4. Additional snippets, one per meaningful variation
5. **Full parameter reference** table — Parameter / Type / Required / Default
6. **Guidance** — bulleted dos and don'ts specific to the implementation

Every snippet must be **complete and correct**, including required parameters like `automationIdentifier`. A reader will copy these. A snippet missing a required parameter teaches the wrong thing.

Never let a snippet contradict the doc's own rules. If the doc says a standalone text button needs an icon, no snippet may show one without an icon.

## Naming

- File name matches the component's display name: `Alert Banner.md`, `Text Fields.md`.
- `# Component: <Name>` as the H1.
- One doc per component **concept**, not per Dart class. `Sheets.md` covers bottom and side sheets; `Text Fields.md` covers both field widgets; `Status Indicators.md` covers indicator and notification.
- Where the checklist lists a component twice under different names (`tags` / `tag`), write one doc.

## Before Writing Each Doc

1. **Read the Dart source in full.** Not grep — the whole file. Behavior lives in the state class, and the comments frequently flag Figma divergences.
2. **Pull the Figma component set** for variant names, states drawn, and geometry.
3. **Reconcile the two.** Note every disagreement for `Open Items`.
4. **Identify the competing components** and confirm the decision tree routes to them.
5. **Identify the most-violated rule** — that's the banner `Rule` line.
6. Then write.

Step 3 is the one that cannot be skipped. A doc that describes only the implementation is a code comment; a doc that describes only Figma is a redlines file. The value is in the reconciliation.
