# Home Feature Layout

> Role: The primary app shell — a persistent rail, a centred single-column content region carrying a salutation, an alert deck and a quick-action row, and a guided action panel docked right.
> 
> Rule: **The content region is derived, never drawn.** Every width in this template is the remainder after the rail and the panel are subtracted from the window. Hardcoding any of them breaks the layout the moment the panel opens.
> 
> Scope: **Layer A design law** — target-independent. Applies to Flutter production code and to a React prototype without change. Binding notes are in §11–§12.
> Source: Figma `Feature Layouts` → frame `app`, node `125:2435` (1306 × 911), read
> 2026-09-15. Reconciled against [`../Foundations/Grid.md`](../Foundations/Grid.md),
> [`../Foundations/Breakpoints.md`](../Foundations/Breakpoints.md),
> [`../Components/Alert Card.md`](../Components/Alert%20Card.md), and
> [`../Components/Cards.md`](../Components/Cards.md). **Nine conflicts found — see §10.**

---

## 1. The shell

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  system app bar                                            ─  ▢  ✕     32 h  │
├──────────────────────────────────────────────────────────────────────────────┤
│ 16                                                                       16  │
│  ┌────┐  ┌──────────────────────────────┐  ┌─────────────────────────────┐   │
│  │    │  │        CONTENT REGION        │  │   GUIDED ACTION PANEL       │   │
│  │ r  │  │                              │  │                             │   │
│  │ a  │  │  ┌────────────────────────┐  │  │  wayfinder            70 h  │   │
│  │ i  │  │  │  Header                │  │  ├─────────────────────────────┤   │
│  │ l  │  │  │   salutation      31 h │  │  │                             │   │
│  │    │  │  │   subline + link  24 h │  │  │  content (scrolls)          │   │
│  │ 60 │  │  └────────────────────────┘  │  │                             │   │
│  │    │  │            ↕ 24              │  │                             │   │
│  │    │  │  ┌────────────────────────┐  │  │                             │   │
│  │    │  │  │  ALERT DECK            │  │  │                             │   │
│  │    │  │  │   active card    320 h │  │  │                             │   │
│  │    │  │  │   tab            ┐     │  │  │                             │   │
│  │    │  │  │   tab            │ 80 h│  │  │                             │   │
│  │    │  │  │   tab            ┘each │  │  │                             │   │
│  │    │  │  └────────────────────────┘  │  ├─────────────────────────────┤   │
│  │    │  │            ↕ 30 (§10.2)      │  │  footer            ↑  24 h  │   │
│  │    │  │  ┌────────────────────────┐  │  └─────────────────────────────┘   │
│  │    │  │  │  Quick actions   24 h  │  │              386 (§10.1)          │
│  │    │  │  │        ↕ 10            │  │                                   │
│  │    │  │  │  ┌────┐┌────┐┌────┐    │  │                                   │
│  │    │  │  │  │card││card││card│    │  │                                   │
│  │    │  │  │  └────┘└────┘└────┘    │  │                                   │
│  │    │  │  │      ↔ 12 gaps         │  │                                   │
│  │    │  │  └────────────────────────┘  │                                   │
│  └────┘  └──────────────────────────────┘                                    │
│ 16                                                                       16  │
└──────────────────────────────────────────────────────────────────────────────┘
```

Four regions, and only one of them flexes:

| Region | Width | Flexes? | Owner |
| --- | --- | --- | --- |
| System app bar | full window, 32 tall | — | window chrome, not an Assemble component |
| Navigation rail | **60**, fixed | no | [`Navigation Rail`](../Components/Navigation%20Rail.md) |
| Content region | **the remainder** | **yes — absorbs all flex** | this template |
| Guided action panel | **386**, fixed | no | guided action panel — **no doc**, see §9 |

**Docking is absolute.** The rail docks left at every tier without exception; the panel docks right.
Neither is an ancestor of the content — all three are **siblings**, or the content never receives real
constraints. See [`../Foundations/Grid.md`](../Foundations/Grid.md).

---

## 2. The content region is computed

```
content region = window − 16 (margin) − 60 (rail) − 16 (gap) − 386 (panel, if present) − 16 (margin)
```

At the drawn window of 1306 with the panel open, that is **812**. Worked examples, from
[`../Foundations/Breakpoints.md`](../Foundations/Breakpoints.md):

| Window | Panel | Content region | Consequence for this template |
| --- | --- | --- | --- |
| 1440 | 386 | ~946 | Quick actions 3-up comfortably; alert deck `expanded` |
| 1306 | 386 | **812** | The drawn case. 3-up, `expanded` |
| 1280 | 386 | ~772 | 3-up is tight — verify against the card's own min width |
| 1280 | none | ~1188 | Grid caps at **992** and centres; the surplus margin is intentional |
| 980 | 386 | ~472 | Cards collapse to 1-up, and the **alert deck crosses into `medium`** |
| < 980 | → bottom sheet | full width | SM: rail → overlay drawer, panel → bottom sheet |

**Two numbers in this template are consequences, not decisions:**

- The **content column** is centred inside the content region and capped near **640** — because that is
  the top of `Alert Card`'s `expanded` band (480–640). The column exists to keep the alert deck at its
  widest documented size; it is not a grid-derived width.
- **Everything reflows when the panel opens or closes.** Expanding the panel narrows the content region
  by 386, which can push the alert deck across the 480 threshold and change it from a deck to a
  carousel. This is documented behaviour, not a bug — see
  [`../Components/Alert Card.md`](../Components/Alert%20Card.md).

> **Never hardcode 992, 386, or 60 at a call site.** Reference shared layout constants so a change
> propagates. These values are *measured*, not tokenized — there are no layout tokens.

---

## 3. Section stack

The content column is a single vertical stack. Nothing here is a grid.

| # | Section | Height | Gap below | Band |
| --- | --- | --- | --- | --- |
| 1 | Header | 55 | **24** | between items |
| 2 | Alert deck | flexes with the active card | **30** | section boundary |
| 3 | Quick actions | 236 | — | — |

`24` between items and `30` at a section boundary come from
[`../Foundations/Grid.md`](../Foundations/Grid.md). The header → deck gap is 24 because the salutation
and the alerts are one thought: *here is your status*. The deck → quick actions gap is 30 because the
subject genuinely changes: *here is what you can do*. **Reserve 30 for a real change of subject** — if
every gap is 30, none of them signals a boundary.

**The deck's height is measured, not declared.** The active card is measured after layout and the tabs
below it re-flow around the measurement, so section 3's position is content-dependent. Never pin the
deck's height to make the quick actions land somewhere pleasing.

---

## 4. Header

```
Good afternoon, Evie                                              ← salutation,  31 h
We've taken 75 actions to keep you safer this year.  View all alerts ›   ← 24 h row
```

| Element | Spec | Notes |
| --- | --- | --- |
| Salutation | size 24 type token, full column width | Time-of-day + name. A greeting, not a heading — it carries no page-title role. |
| Subline | size 16 type token, `md.sys.color.on-surface` | One sentence. A running count of actions taken. |
| Trailing link | [`Button`](../Components/Button.md), `textNoPadding`, **with a trailing chevron** | Right-aligned in the subline row, baseline-aligned to it. |

**The chevron is mandatory, not decorative.** `text` and `textNoPadding` have **no state layer at
all**, so a standalone one must carry a directional icon or it is invisible as a control. The drawn
frame gets this right — keep it right.

---

## 5. Alert deck

**One component owns the whole set.** It takes a list of alerts; with several entries it renders one
active card at full size and collapses the rest into 80-tall tabs. See
[`../Components/Alert Card.md`](../Components/Alert%20Card.md) for everything about its behaviour — this
template only records its placement.

| Property | Value here | Decided by |
| --- | --- | --- |
| Layout | **`expanded`** | available width ≥ 480 — **not** chosen, derived |
| Presentation | **vertical deck** | ≥ 2 alerts at `expanded` or `medium` |
| Active card | 320 tall as drawn; **measured at runtime** | its own content |
| Collapsed tabs | **80 tall, always** | fixed; they do not grow with text scale |
| Tab pitch | 56 → **24 overlap** | the deck's own stacking |
| Severity | `low` in the drawn frame — a green surface gradient | the alert's data, never the layout |

**Do not build this as a stack of cards.** Rendering several alert cards one under another destroys the
tab stack, the top-to-bottom keyboard order, the single-announcement screen-reader contract, and the
"one alert has your attention" hierarchy. All of it belongs to the one component.

Three things the deck owns that you must not reimplement:

- **Navigation arrows** — right-aligned, 16 below the deck, appearing automatically whenever there is
  more than one alert. They are **missing from the drawn frame**; see §10.3.
- **The keyboard focus ring's input-source tracking**, which is deck-wide. A local version leaks a
  spurious ring on every click that promotes a card.
- **Focus traversal order.** Do not insert your own focus order into the deck — it will fight the
  component's and reintroduce a jump between non-adjacent tabs.

**The deck must never be wrapped in a single semantic container or live region.**

---

## 6. Quick actions

A labelled row of three cards, each a [`Cards`](../Components/Cards.md) substrate holding a bespoke
child. **`quick action` has no doc** — see §9.

| Property | Value | Token |
| --- | --- | --- |
| Section label | "Quick actions", size 16 emphasized | see §10.4 |
| Label → cards gap | 10 | `md.spacing.250` |
| Card gap | 12 | `md.spacing.300` |
| Card padding | 20 all sides | `md.spacing.500` |
| Card radius | 24 | `md.border.radius.24` |
| Card shadow | elevation-1 | `md.sys.color.shadow` |

The three cards are the same substrate with different payloads:

| Card | Payload | Component |
| --- | --- | --- |
| Smart Scan | title + body + action button | [`Button`](../Components/Button.md), tonal |
| Secure VPN | title + `LOCATION:` label + value + "Change location" link + toggle | toggle: see §9 |
| Credit lock | title + toggle | toggle: see §9 |

**The card sets no width and no height.** It grows to fill what its parent gives it and grows
vertically to fit its child plus 40 of vertical padding. The 205 × 202 in the drawn frame is the
*parent's* doing — constrain from outside, never from within.

**Never override a card's radius or padding to match a mock.** The 24 radius and 20 inset are the
card's identity across the product. If the mock disagrees, the mock is the thing to fix.

**Cards in this row must not be nested inside another card**, and the row itself is not a card.

---

## 7. Guided action panel

Docked right, full height, fixed width. **This component has no doc — but the widget ships.** See §9.

| Slot | Height | Contents |
| --- | --- | --- |
| Wayfinder | 70 | A titled, pressable header row with a trailing affordance |
| Content | flexes, **scrolls** | Conversation / agent output. Drawn state: an AI loader, "On it! Just a moment…" |
| Footer | 24 | A single trailing `arrow_upward` control |

Internal padding is **16** on all four sides, with **no gap** between the three slots — the wayfinder,
the content region, and the footer are flush.

Two obligations the panel inherits and the drawn frame does not settle:

- **Its content must be authorable once and re-hostable.** At SM the panel becomes a **bottom sheet**
  carrying the same content. Content that only works in a fixed-width column has been built wrong.
- **The scrollbar is wrong in three different ways** across the sources. See §10.5.

The AI loader is [`Loaders`](../Components/Loaders.md) — the AI form, for an agent action in flight
whose fraction is unknown. **Never fake a fraction to get a progress bar.**

---

## 8. Tokens bound in this frame

Read from the file, not measured. Semantic layer only — this is what UI code may reference.

**Colour**

| Role | Token |
| --- | --- |
| Page canvas | `md.sys.color.background` |
| Card / panel surface | `md.sys.color.surface-bright`, `md.sys.color.surface` |
| Tertiary containers | `md.sys.color.surface-container`, `-high`, `-highest` |
| Body and headings | `md.sys.color.on-surface`, `-variant`, `md.sys.color.on-background` |
| Focus ring, primary action | `md.sys.color.primary` |
| Critical severity | `md.sys.color.error` |
| Shadow | `md.sys.color.shadow` |
| Positive / protected | `mcafee.color.extended.positive` |
| Brand | `mcafee.color.extended.brand-product`, `brand-orange` |
| Theme-independent | `mcafee.color.extended.white`, `black`, `ghost` |
| Alert severity surfaces | `mcafee.color.extended.gradient.surface.low.*`, `.moderate.*` |
| Brand gradient | `mcafee.color.extended.gradient.brand.*` |

**Scale** — every value in the frame is on-scale:

| Scale | Steps used |
| --- | --- |
| Spacing | `md.spacing.` 0, 100 (4), 200 (8), 400 (16), 500 (20), 600 (24) |
| Radius | `md.border.radius.` 2, 8, 12, 16, 24, 48 |
| Type | `title/small-emphasized`, `link/small`, `body/mono/small` |

Type tokens are **composite** — family, style, size, weight, line height and tracking travel together.
Splitting one into separate declarations is how leading drifts. Emphasis is `emphasized` (weight
**700**), never a larger size or a hand-set weight.

`md.ref.type.font.system` (McAfee Sans) and `md.ref.type.font.mono` appear in the file because
composite type tokens reference them internally. **That is correct inside a token definition and a
blocker in UI code.** Reference the composite, never its parts.

Mono (`body/mono/small`) is for **data values only** — here, the uppercase category on the alert card.
Never on a control, prose, or heading.

---

## 9. Undocumented components in this template

Four of this screen's parts have no component doc. They are **not** the same kind of gap, and
conflating them causes opposite errors:

| Part | Widget ships? | What to do |
| --- | --- | --- |
| **guided action panel** | **Yes** — `guided_action_panel.dart`, cited from `Cards`, `Peek Label`, and `Scrollbar` | **Use it.** Read the source for its API; expect no documented guidance. Highest-priority doc gap — three finished docs route to it. |
| **quick action** (section + toggle) | Unverified | Read the source before use. Do not infer a spec from `Switch` or `Cards`. |
| **wayfinder** | Unverified | **Recorded nowhere at all** — not even on the seven-undocumented list. See §10.7. |
| **system app bar** | `system_app_bar.dart` | Window chrome, not a design-system component. No doc expected. |

> **Undocumented ≠ nonexistent.** `AsmGuidedActionPanel` is real and undocumented; `AsmTopbar` is
> neither. Inventing a widget that doesn't exist and refusing to use one that does are both failures.

Do not improvise a spec for any of these from a neighbouring component. Name the gap in your output.

---

## 10. Open Items

Nine conflicts between the drawn frame and the documented system. **Figma is precedence tier 10**; a
foundation's rules are tier 4. Every resolution below follows the docs and flags the drawing.

1. **Panel width: Figma draws 417, the docs say 386.**
   `Grid.md` states 386 in three places and `Breakpoints.md` in two. The 31px delta cascades: it is why
   the drawn content region is 797 rather than the computed 812. **Resolution: build to 386.** Ask
   design whether 417 is an intentional revision or drift; if intentional, `Grid` and `Breakpoints`
   both need updating and every content-region example recomputing.

2. **Section gap: Figma draws 48, the rhythm scale has 24 and 30.**
   48 is not on the vertical rhythm scale at all. **Resolution: 30** — this is a genuine section
   boundary. Recorded as 30 in §3.

3. **The alert deck has no navigation arrows.**
   The doc: arrows appear automatically whenever there is more than one alert, right-aligned 16 below
   the deck. The frame draws four alerts and no arrows. **Resolution: the arrows are required.** In the
   vertical deck they are the *only* positional indicator other than the visible tabs — dot pagination
   belongs to the carousel, and no presentation has both.

4. **The "Quick actions" heading is detached from its type token.**
   It renders at size 16 / weight 700 with line height **1.5** and tracking **0.08px**, while
   `title/small-emphasized` is 16 / 700 / **1.4** / **0**. **Resolution: bind the composite token.** A
   detached heading is a split composite token by another route, and it will drift again.

5. **The panel's scrollbar has three different widths across three sources.**
   Figma draws **12**. The brand capsule is **6**. `guided_action_panel.dart` ships two
   `SingleChildScrollView`s with neither `AsmScrollbar` nor a `ScrollbarTheme`, so on desktop it renders
   Flutter's **8px** Material thumb. **Resolution: the brand 6px capsule** via
   [`Scrollbar`](../Components/Scrollbar.md). Already a known shipped defect.

6. **A fourth shadow is bound in the file.**
   `shadows/special-blur` = 48 with `mcafee.color.shadows.special` (#0000001f). Elevation is **exactly
   three** zero-offset shadows — `subtle` 4, `light` 20, `heavy` 25 — with no fourth, no stacking, and
   no interpolation. **Resolution: do not consume it.** Either it is an unsanctioned addition, or
   `Elevation.md` is out of date. Needs a design decision, not a build-time choice.

7. **`wayfinder` is recorded nowhere.**
   It is not in `Components/`, not in `Foundations/`, and not on the seven-undocumented-components list
   — so it is invisible even to the gap tracking. **Resolution: add it to the undocumented list**, then
   verify from source whether it is a real shared component or a one-off inside the panel.

8. **An off-namespace spacing variable is bound.**
   `sys/space/800` = 32. The value is on-scale but the namespace is not Assemble's — `md.spacing.800`
   is the same 32. **Resolution: use `md.spacing.800`** and have the stray variable removed, before it
   forks the spacing scale.

9. **Sub-pixel misalignment between the two content sections.**
   The header/deck group sits at x **79.5** width **638**; the quick-action section at x **79** width
   **639**. A 0.5px offset and a 1px width mismatch between siblings that should share one column.
   **Resolution: one column, one width**, derived from the content region.

**Separately — the Code Connect mappings on this frame are not trustworthy.** They point at three
codebases at once: `pegasus-flutter` (the sanctioned production binding), and
`M1AUIComponents` **iOS Swift** (`SCButton`, `SCTextField`) — which is not an Assemble binding at all.
Several are plainly wrong: `blank_card` maps to `SCTextField/Default-Stroke/Large`, a **text field**
mapped to a **card**. **Trust the `pegasus-flutter` mappings; ignore the Swift ones**, and never let a
Code Connect snippet stand in for the component doc.

---

## 11. Flutter Usage

Widget names below are verified from the component docs; **anything not listed here must be read from
the source, not inferred.**

| Region | Widget | Source |
| --- | --- | --- |
| Rail | `AsmNavigationRail` (SM: `AsmNavDrawer`) | `navigation_rail.dart` |
| Alert deck | `AsmAlertCard` + `AsmAlertCardItem`, `AsmAlertCardLayout`, `AsmAlertCardTab` | `alert_card.dart`, `alert_card_tab.dart` |
| Severity badge | `AsmBadge` | `badge.dart` |
| Quick-action cards | `AsmCard` | `card.dart` |
| Buttons | `AsmButton` + `AsmButtonVariant`, `AsmButtonSize` | — |
| AI loader | `AsmAiLoader` | — |
| Panel scrollbar | `AsmScrollbar` | — |
| Guided action panel | `AsmGuidedActionPanel` | `guided_action_panel.dart` — **no doc; read the source** |
| System app bar | — | `system_app_bar.dart` |

Binding rules that apply to this composition:

- **Branch on `LayoutBuilder` / `constraints.maxWidth`, never `MediaQuery.of(context).size.width`.**
  The window width does not account for the rail or the panel, and produces exactly the wrong answer in
  the 980-with-panel case — the one case this layout is most likely to break in.
- **Pass `variant` and `size` explicitly** to every `AsmButton`. Its defaults (`text` / `large`)
  contradict the documented `filled` / `medium`.
- **`automationIdentifier` is required** and asserted non-empty on every interactive element here.
- **Gaps are owned by the parent** — use `Column(spacing:)` or explicit gaps for the 24 and 30, not a
  margin on each section. One owner per gap.
- **Never `Material(elevation:)` or `Card(elevation:)`** — set the decoration and pass the shadow token.
- **Never nest `AsmCard`** inside `AsmCard`, `AsmAlertCard`, or `AsmGuidedActionPanel`; all of them
  already render one.
- **Don't wrap any `Asm*` widget in `Semantics` or `GestureDetector`** — it produces a competing
  announcement or a second, nameless tap target.

Figma → Flutter size names drift: `Button`'s Figma `compact` is Flutter **`xsmall`**, and Figma
`default` is Flutter **`small`**. The drawn "Scan now" button is `compact`/tonal — so verify against
[`Button`](../Components/Button.md) whether `xsmall` is intended here, given that `xsmall` drops to
12px type and is never a fix for a crowded layout.

---

## 12. React Usage — the prototyping binding

Everything in §1–§10 applies unchanged. What changes is that **nothing documents the React API**, so
verify rather than assume, and say which you did. Read
[`../AI/react-binding.md`](../AI/react-binding.md) first.

- **Verify from the React source**: each component's name, its prop names, which variants and sizes
  exist, and whether it exists at all. Parity with Flutter is **not guaranteed**. Deriving a React name
  from a Flutter one is a **blocker**, not a guess.
- **Never write `Asm*` in a `.tsx` file** — a real name in the wrong vocabulary.
- **Tokens come from the web build** of the same source, so the token names in §8 carry across
  mechanically. Read the naming transform from the web token package; never inline a value because you
  couldn't find the variable.
- **Layout still comes from the content region.** No viewport `@media` query decides anything here — a
  viewport-driven version of this template is wrong whenever the panel is open, which is most of the
  time. Use a container-based mechanism, or state the limitation plainly.
- **Accessibility does not relax**, and never `outline: none`.
- **This composition is not a production spec.** Never port it to Flutter, and never cite a React prop
  as evidence that Assemble has a modifier.

> This section exists ahead of the component-doc template's amendment. That template still forbids
> mentioning React, which is why the React binding has no home in the 34 component docs — see
> [`../AI/known-gaps.md`](../AI/known-gaps.md) §3.0.

---

## 13. Accessibility obligations of the composition

The components carry their own obligations; these belong to the screen.

1. **Reading order is rail → content → panel**, matching the visual order. The panel is last because it
   is supplementary, and it must not intercept focus on load.
2. **The deck is strictly top-to-bottom** in the tab order, and bottom-to-top with Shift+Tab. Do not
   add a focus order around it.
3. **Nothing consequential lives only in the panel.** It scrolls, and at SM it collapses into a bottom
   sheet the user may never open.
4. **Severity is never colour alone.** The green `low` surface and the red `CRITICAL` label must both be
   accompanied by text that says the same thing — as the drawn frame does.
5. **Every control here clears 48 × 48**, achieved with padding, holding at 200% text scale. The
   `textNoPadding` header link and the footer arrow are the two most likely to fail this.
6. **The keyboard focus ring is `md.sys.color.primary`, 2px, 2px offset, keyboard-only** — never
   removed, narrowed, or recoloured. Figma rarely draws focus states; its silence here is a **Figma
   gap**, never permission to skip them.
7. **The salutation is not a heading.** If this screen needs a programmatic heading structure, that is
   an open question for design — the greeting does not supply one.
8. **The AI loader must announce.** A silent "On it! Just a moment…" leaves screen-reader users with no
   indication that anything is in flight.

---

## 14. Anti-Patterns

- **Hardcoding 386, 60, 992, or the content-region width.** Reference shared constants. The panel width
  alone is already wrong in the drawing (§10.1).
- **Deciding anything from window width.** The 980-with-panel case makes this visibly wrong.
- **Rendering several alert cards instead of one deck.** It destroys the tab stack, the keyboard order,
  and the screen-reader contract at once.
- **Pinning the deck's height** so the quick actions land at a chosen position. The deck measures itself.
- **Building three MD+ variants.** MD, Default, and Max are **structurally identical** — never branch
  among them. 1280 and 1440 differ only in margin; the grid already capped at 992.
- **Treating the panel as an ancestor of the content.** Siblings, or the content gets no real
  constraints.
- **Docking the rail anywhere but left.** The system's only absolute placement rule.
- **A nested grid inside a quick-action card.**
- **Overriding card padding or radius to match the mock.**
- **Stacking a section's padding with a child's margin.** One owner per gap.
- **Adopting the drawn 48 gap, 417 panel, or fourth shadow because Figma shows them.** Figma is tier 10.
- **Making a whole quick-action card clickable.** Cards carry no interaction; put a real control inside.
- **Adding a fourth quick-action card** without re-deriving the row — three at 205 already fills a
  638 column, and a fourth crosses into the 1-up collapse.

---

## 15. Rules

1. **The content region is computed from the window, the rail, and the panel — never drawn.**
2. **Rail 60 left, panel 386 right, both fixed; all flex is absorbed by the content column.**
3. **Rail, content, and panel are siblings.**
4. **24 between items, 30 at the section boundary.** Nothing else.
5. **The alert deck's layout and presentation are derived from available width**, never chosen.
6. **One `Alert Card` component owns the whole alert set.**
7. **The deck's height is measured at runtime**; downstream sections reflow.
8. **Quick-action cards are constrained from outside**; the card sets no size.
9. **Card radius 24 and padding 20 are never overridden to match a mock.**
10. **Semantic tokens only, composites unsplit; no fourth shadow, no off-namespace spacing.**
11. **The panel's content is authored once and re-hosted** as a bottom sheet at SM.
12. **A `text` / `textNoPadding` button carries a directional icon** or it isn't a visible control.
13. **Where this template and a component doc disagree, the component doc wins.**
14. **Where this template and Figma disagree, this template wins** — the nine conflicts in §10 are
    resolved in favour of the docs, deliberately.

---

```
ASSEMBLE VALIDATION
  Gates        : G1 ✓  G2 ✓  G3 ✓  G4 ✓  G5 —  G6 ✓  G7 —
  Target       : Layer A design law (composition template — no binding emitted)
  Routing       : composition read from Figma; every component delegated to its own doc
  Tokens        : semantic layer only, read from get_variable_defs — not measured
  Conflicts     : 9 recorded in §10, all resolved toward the docs (Figma = tier 10)
  Unverified    : quick-action toggle API · wayfinder (recorded nowhere) ·
                  AsmGuidedActionPanel API (ships, no doc) · React component names
  Gaps named    : guided action panel · quick action · wayfinder · Code Connect mapping rot
```
