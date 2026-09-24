# Validation

> Role: The gate. Every check that can be run against Assemble output without asking a human.
> Rule: A failed **BLOCKER** is not a suggestion. Fix it or report it as a defect — never ship
> past it silently.
> When: Phase 8 of [`reasoning-engine.md`](reasoning-engine.md). Also usable standalone as an
> audit checklist for existing UI.

Three severities:

- **BLOCKER** — the output is wrong. Do not deliver it.
- **DEFECT** — violates a documented rule. Fix, or state explicitly why the exception holds.
- **REVIEW** — cannot be settled from the docs. Surface it as an open question.

**G1–G4 and G6 apply to every target.** The binding groups are mutually exclusive — run **G5** for
Flutter, **G7** for React, and report the one you didn't run as `—`, never `✓`. A translation target
runs neither and reports both as `—`.

| Target | Run | Report as `—` |
| --- | --- | --- |
| Flutter (production) | G1–G6 | G7 |
| React (prototyping) | G1–G4, G6, G7 | G5 |
| Figma, prose, redlines | G1–G4, G6 (code-shaped rows N/A) | G5, G7 |
| Translation (CSS, Vue, SwiftUI, bespoke web) | G1–G4, G6 | G5, G7 |

---

## G1 — Token gates (BLOCKER)

| # | Check | Fails when |
| --- | --- | --- |
| 1.1 | No raw colour literals | Any `#RGB`/`#RRGGBB`/`#RRGGBBAA`, `rgb(`, `rgba(`, `hsl(`, `Color(0x…)` appears in output |
| 1.2 | No authoring-layer references | Output names `md.key.*`, `md.ref.palette.*`, `md.ref.brand.*`, `md.ref.type.font.*`, or `md.type.size.*` |
| 1.3 | Colour comes from the semantic layer | A colour is not an `md.sys.color.*` or `mcafee.color.extended.*` token |
| 1.4 | No raw type metrics | A font size, weight, line height, or letter-spacing number appears instead of a composite typescale token |
| 1.5 | Composite type tokens only | Output names a size without its style token (e.g. "16px bold" instead of `body.large-emphasized`) |
| 1.6 | No off-scale spacing | Any padding/gap/margin number that is not one of the 15 steps: 0, 2, 4, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48 |
| 1.7 | Spacing referenced by token | A spacing value appears as a bare literal rather than `md.spacing.*` / `AsmSpacing.s*` |
| 1.8 | No hand-authored shadow | A `BoxShadow(...)`, blur radius, or shadow colour is written out instead of `subtle` / `light` / `heavy` from the tokens |
| 1.9 | Radius and border width from their scales | A radius outside {0,2,4,6,8,12,16,24,32,36,40,48,56,64,999} or a border width outside {0,1,2,3,4} |
| 1.10 | Pill shapes use `999` | A large fixed radius stands in for a pill |
| 1.11 | Dark mode by theme swap | Output hardcodes a dark value, re-points a token, or branches colour on brightness at the usage site |
| 1.12 | State opacities are the documented four | Any state layer opacity other than 8 / 10 / 10 / 16 (hover / focus / pressed / dragged) |

**Regex sweep.** Run the shared block always, then the block for your target's language. The
Flutter-flavoured patterns catch nothing in a `.tsx` file and vice versa — running only the Dart
block over React output is how a hex ships.

Shared — any target, any language:

```
#[0-9A-Fa-f]{3,8}\b | \brgba?\( | \bhsla?\( | \bhwb\( | \b(oklch|lab|lch)\(
\bmd\.(key|ref)\. | \bmd\.type\.size\.
\bAsm[A-Z]                          ← in any non-Dart file: wrong vocabulary (G7.2)
```

Flutter / Dart:

```
Color\(0x
fontSize\s*[:=] | fontWeight\s*[:=]\s*(?!FontWeight\.w?400\b) | letterSpacing\s*[:=] | height\s*[:=]\s*1\.
BoxShadow\( | blurRadius\s*[:=] | elevation\s*[:=]
EdgeInsets\.(all|symmetric|only|fromLTRB)\([^)]*\b\d
SizedBox\((width|height)\s*[:=]\s*\d | spacing\s*[:=]\s*\d
BorderRadius\.circular\(\s*\d
MediaQuery\.of\([^)]*\)\.size\.width
```

Web / React / CSS — for the React binding **and** for translations:

```
:\s*(-?\d*\.?\d+)(px|rem|em)\b                  ← any raw length; every hit needs a token
\bbox-shadow\s*: | \btext-shadow\s*:
\bfont-(size|weight)\s*: | \bline-height\s*: | \bletter-spacing\s*:
\b(padding|margin|gap|row-gap|column-gap|border-radius|border-width)\s*:\s*[^v]  ← not var(…)
\boutline\s*:\s*(none|0)\b | \boutline-width\s*:\s*0
@media[^{]*\((min|max)-(width|device-width)                ← viewport query → G3.1 / G7.5
\b(black|white|red|grey|gray|blue|green|orange|yellow)\b   ← named CSS colours
style\s*=\s*\{\{ | style\s*=\s*"                           ← inline style: check every value
\btransform\s*:\s*rotate                                    ← rotated glyph (G4.42)
```

Every hit is a BLOCKER unless it is a documented raw value you are explicitly quoting from a doc
(e.g. citing `Button`'s off-scale 23/18 vertical padding as an open item).

---

## G2 — Accessibility gates (BLOCKER)

| # | Check | Fails when |
| --- | --- | --- |
| 2.1 | Touch target ≥ 48×48 | Any interactive element smaller, at any text scale up to 200%. Watch `Switch` `small` (documented as under the floor) and `Menu` `compact` (40, under the floor) |
| 2.2 | Target reached by padding | The glyph was enlarged instead of padded |
| 2.3 | Visible focus ring | Any interactive element without `md.sys.color.primary` at 2px, offset 2px — or with it removed, narrowed, or recoloured |
| 2.4 | Focus is keyboard-only | A ring shows after a plain mouse click, or a pointer-click focus is not suppressed |
| 2.5 | Full state set | An interactive element missing any of hover / pressed / focus / disabled |
| 2.6 | Never colour alone | A status, severity, or destructive meaning is carried only by hue — no glyph, label, or adjacent text |
| 2.7 | Meaningful icons named | An icon that conveys meaning has no accessible name (its own or its control's visible text) |
| 2.8 | Decorative icons silenced | A decorative icon is exposed to assistive technology |
| 2.9 | Icon-only controls | Missing **either** the accessible label **or** the tooltip |
| 2.10 | Contrast | Below 4.5:1 normal text, 3:1 large text, 3:1 interactive/non-text. Documented exceptions only: disabled content at 38%, `Cards` `brand` at 3.9:1 (large text only) |
| 2.11 | Non-empty label | A `Button` (or any labelled control) with an empty/absent visible label |
| 2.12 | Nothing critical in a transient surface | Consequential or action-only information lives solely in a `Snackbar`, `Tooltip`, `Scrollbar`, or hover-revealed surface |
| 2.13 | Disabled leaves the tab order | A disabled element is focusable or still receives states |
| 2.14 | Label never mutates mid-interaction | A label is swapped to communicate progress ("Save" → "Saving…"), changing the accessible name |
| 2.15 | Announced name slots kept distinct | The visible label, the semantic label, and the automation identifier are conflated — or the semantic label says something *different* rather than expanding |
| 2.16 | Chart breakdown supplied | A chart legend is relied on for meaning; both chart docs state the legend is **not announced** |
| 2.17 | Focus order matches visual order | Tab order jumps around the layout |
| 2.18 | Keyboard route to everything | Any item reachable only by swipe, hover, or drag — e.g. carousel items behind decorative dots |

---

## G3 — Layout gates (DEFECT, BLOCKER where marked)

| # | Check | Fails when |
| --- | --- | --- |
| 3.1 | **BLOCKER** Decisions from content width | Layout branches on window/viewport width instead of `content = window − 16 − 60 − 16 − 386(if panel)`. In Flutter: `MediaQuery.size.width` used for a layout decision instead of `LayoutBuilder`/`constraints.maxWidth`. On web: a viewport `@media` query used where a container query was needed — and the caveat not stated |
| 3.2 | Exactly two thresholds | Any threshold other than 500 and 980 |
| 3.3 | No branching between 1280 and 1440 | A rule distinguishes them; the grid capped at 992 before either, so content is identical |
| 3.4 | Column count is 4 or 12 | Any other count |
| 3.5 | SM transforms move together | Rail→drawer, panel→bottom sheet, and 12→4 columns are not all applied at once |
| 3.6 | MD / Default / Max treated identically | Tier-specific behaviour written among the three |
| 3.7 | Grid caps and centres at 992 | Content grows past 992, or the surplus margin is "fixed" with filler |
| 3.8 | Rail subtracted before column math | The 60px rail treated as grid columns |
| 3.9 | Fixed regions stay fixed | The 60 rail or 386 panel flexes; flex belongs to the content columns |
| 3.10 | No hardcoded card/column width | A pixel width is set instead of derived from the grid |
| 3.11 | Peers share a span | Cards in a row take different spans without deliberately expressing hierarchy |
| 3.12 | Vertical rhythm | Gaps other than 24 between items / 30 at section boundaries |
| 3.13 | No nested grid inside a card | A card lays its contents out on its own column system |
| 3.14 | Shell laid out as siblings | Rail and panel are ancestors of the content rather than siblings, so the content never receives real constraints |
| 3.15 | Layout constants not inlined | 500, 980, 992, 386, or 60 hardcoded at a call site |
| 3.16 | Container-agnostic component | The component only works at one container width, or takes a breakpoint tier as a parameter |
| 3.17 | Dual-container content authored once | Side-panel and bottom-sheet content written twice instead of adapting to its container |

---

## G4 — Component-integrity gates (DEFECT)

| # | Check | Fails when |
| --- | --- | --- |
| 4.1 | Routed away first | The component's decision tree was entered mid-way; question one ("is this the right component at all?") was never answered |
| 4.2 | Required anatomy present | A part marked **Required** in the anatomy table is missing |
| 4.3 | One `filled` button per surface | Two `filled` buttons coexist |
| 4.4 | One size per button group | Sizes mixed in a row or dialog footer |
| 4.5 | Standalone text button has an icon | A `text`/`textNoPadding` button with no button neighbour and no directional icon |
| 4.6 | Variant/size explicitly passed | `AsmButton` (or any widget whose default contradicts guidance) relies on its default |
| 4.7 | Modifier lands on a supported variant | `destructive` on `outline`/`ghost`/`textNoPadding`/`strict*` (silently ignored); `Peek Label` `inverse` + `offline` (silently ignored) |
| 4.8 | Surface-decided choices decided by surface | `Badges` `type`, `Accordion` type, `Text Fields` `filled`/`outlined`, `Button` `ghost`/`strict*` chosen by emphasis or taste instead |
| 4.9 | Strict variants only on theme-independent surfaces | `strictBlack`/`strictWhite` on a themed surface |
| 4.10 | One alert card, many items | Several `Alert Card`s stacked on one surface |
| 4.11 | Card is not the tap target | A whole card made tappable instead of holding a real control inside it |
| 4.12 | Coloured surface's text carries the meaning | A coloured `Cards`/badge variant is the only thing saying what it means |
| 4.13 | Elevation: one shadow, peers match | Shadows stacked, a fourth invented, or one card in a grid differs |
| 4.14 | Not tonal elevation | `surface-container-*` stepped up to imply lift |
| 4.15 | Determinacy honoured | A `Progress Bar` at a guessed value; a chart used where the remainder would read as "not yet"; a chart used as a progress indicator |
| 4.16 | Part/segment counts respected | `Data Arc Chart` outside 2–4 parts, `Data Linear Chart` outside 2–5 — the colour ramp cycles and the legend breaks |
| 4.17 | Zero-sum charts handled | Sum not checked at the call site; a blank ring or empty strip shipped instead of an `Empty State` |
| 4.18 | Commit semantics correct | `Checkbox` used for immediate effect, or `Switch` used where the change waits for submit |
| 4.19 | Radio in a group | A lone radio; or the radio rather than the group owns selection/name/default |
| 4.20 | Focusable content not in a tooltip | Anything pressable, focusable, scrollable, or selectable inside a `Tooltip` (use `Popover`) |
| 4.21 | Popover opens on activation | A popover opens on hover — unreachable by keyboard, vanishes on pointer travel |
| 4.22 | Floating surfaces don't scroll | A scrollbar inside a `Popover`, `Tooltip`, or `Modal` |
| 4.23 | Rail docked left | The rail placed right, bottom, floated, or rotated — including via `AsmNavigationRail.bottom` |
| 4.24 | Tab strip is not navigation or a filter | `Tabs` used to move between pages, change the subject, or allow multiple active options |
| 4.25 | Tag body not tappable | A tag pill made pressable (only `filter`'s × is interactive) |
| 4.26 | Selected-tab signals preserved | The indicator hidden or the selected label colour-matched — the shipped component already delivers only two of design's three signals |
| 4.27 | Carousel constraints | More than 5 items, autoplay, or used where the user must compare/scan/find |
| 4.28 | Menu is a list of rows | A menu carrying a heading, a paragraph, and a button (use `Popover`), or a destructive confirmation (use `Modal`) |
| 4.29 | Loader thresholds | A loader shown for a wait under ~300ms; loaded content replaced by skeletons on refresh |
| 4.30 | Skeleton matches footprint | A skeleton that doesn't reserve the content's space, causing the jump it exists to prevent |
| 4.31 | Snackbar is missable-safe | Anything the user would be stuck without, in a snackbar |
| 4.32 | Empty state explains | Copy doesn't say why it's empty and what to do next; or "nothing matched" given the "nothing yet" action |
| 4.33 | Field label persists | The placeholder used as the label |
| 4.34 | Disclosure has content | `Expanded Card` with nothing to reveal; or both `options` **and** `expandedContent` (asserts) |
| 4.35 | Divider is not the only signal | A divider used where spacing or a heading was the answer |
| 4.36 | Bare status dot is named | A dot whose condition appears nowhere in adjacent text |
| 4.37 | Zero count shows nothing | A notification badge rendered at zero |
| 4.38 | Date is typeable | A grid-only picker for a date the user already knows |
| 4.39 | Mono used only for data values | `label.mono.*` on a control, prose, or heading |
| 4.40 | Heavy weight restricted | Heavy on title/label/body, or in standard product UI rather than a promotional display/headline |
| 4.41 | Filled icons mean selected | Filled icons used for emphasis, or mixed with outlined in one group |
| 4.42 | One concept, one glyph | A concept given a different glyph than it has elsewhere; a library glyph rotated, flipped, or redrawn |
| 4.43 | Icon size from the pairing table | Icon size set by constraining its box, overridden on a component slot, or mixed within one instance |

---

## G5 — Flutter binding gates (DEFECT; **Flutter targets only** — report `—` otherwise)

| # | Check | Fails when |
| --- | --- | --- |
| 5.1 | `automationIdentifier` present | Missing on any widget that requires it — it is asserted non-empty, so the snippet won't even run |
| 5.2 | Identifier is kebab-case and purposeful | e.g. `save-changes-button`, not `btn1` |
| 5.3 | Disabled via `null` handler | `Opacity`, `IgnorePointer`, `AbsorbPointer`, or an invented `disabled` flag used instead |
| 5.4 | No semantics/gesture wrapper | An `Asm*` widget wrapped in `Semantics` or `GestureDetector` — produces a competing or nameless tap target |
| 5.5 | No padding wrapper for sizing | `Padding` added to change a component's size instead of using its size step |
| 5.6 | Icons passed bare | `size:` set on an icon handed to a component slot |
| 5.7 | No numeric elevation | `Material(elevation:)` or `Card(elevation:)` used instead of a decoration with a shadow token |
| 5.8 | `LayoutBuilder`, not `MediaQuery` | Layout branched on window size (`MediaQuery` remains correct for safe areas, insets, and text scale) |
| 5.9 | Gaps owned by the parent | A bottom margin on every child instead of `Column(spacing:)` / explicit gaps |
| 5.10 | No `Spacer`/`Expanded` for a defined gap | Those fill available space; a defined gap needs a value from the scale |
| 5.11 | No double padding | Padding added to a widget that already has it from its `Asm*` parent |
| 5.12 | States resolved from `WidgetState` | Hover/press tracked in local `setState` instead |
| 5.13 | No `TextStyle` override | A style passed where the component applies its own weight and leading |
| 5.14 | Shape not overridden | A button's pill shape overridden — it is not configurable |
| 5.15 | Snippets are complete and self-consistent | A snippet omits a required parameter, or contradicts a rule stated elsewhere in the same doc |

---

## G6 — Output-hygiene gates (BLOCKER)

| # | Check | Fails when |
| --- | --- | --- |
| 6.1 | No unverified values | Any number, token name, variant, state, size, or parameter not read from these docs |
| 6.2 | No invented API | An `Asm*` widget, enum value, or parameter that doesn't exist. Specifically: **there is no `AsmPopover`** (`Popover` ships no implementation) and **no reusable carousel component** |
| 6.3 | No undocumented component silently filled in | `brand`, `feature banner`, `guided action panel`, `lists`, `quick action`, `toggle groups`, `topbars` given a spec instead of a named gap |
| 6.4 | No invented state | Anything outside hover, focus, pressed, dragged, disabled, selected |
| 6.5 | Conflicts surfaced, not resolved silently | A Figma-vs-code disagreement quietly decided one way |
| 6.6 | Figma↔code names translated | A Figma variant name used as a code identifier (or vice versa) without the mapping — `Button`'s Figma `default` is code's `small` |
| 6.7 | Foundation content not restated | A component answer re-tabulates state opacities, the type scale, or the spacing scale instead of delegating |
| 6.8 | Web platform concepts absent from **design law** | An HTML/CSS/React/`:focus-visible` reference written into a *platform-agnostic* section of a design-system doc — the part above `## Flutter Usage`. A documented **binding** section is a different matter: React is a sanctioned binding and one day earns a `## React Usage` section (see [`react-binding.md`](react-binding.md) §8). Design law stays platform-agnostic; bindings name their platform |
| 6.9 | Translations labeled | Output with **no sanctioned binding** (CSS, Vue, SwiftUI, bespoke web, React that deliberately avoids the Assemble library) presented as if it were sanctioned Assemble. Flutter and Assemble-React output are **not** translations — they get their own labels, per 6.11 |
| 6.10 | Open items reported | The answer touched a known conflict or gap and didn't cite it |
| 6.11 | React output carries the fidelity notice | React/Figma-Make output ships without the `REACT PROTOTYPE — SANCTIONED BINDING, NOT A PRODUCTION SPEC` block, is described as an implementation or a spec, is offered as something to port to Flutter, or is cited as evidence about what the design system does |
| 6.12 | Flow stayed one-way | Flutter output derived from a React prototype rather than routed through the component docs; or a React API detail used as an argument about the design (see [`decision-priority.md`](decision-priority.md), tier 9) |

---

## G7 — React binding gates (DEFECT unless marked; **React targets only** — report `—` otherwise)

The React library is sanctioned and **undocumented**, so most of these gates are about *verifying
instead of assuming*. Full context: [`react-binding.md`](react-binding.md).

| # | Check | Fails when |
| --- | --- | --- |
| 7.1 | **BLOCKER** Layer A applied in full | The component doc above `## Flutter Usage` wasn't read — routing, required anatomy, variant criteria, content rules, states, or accessibility skipped because "it's a prototype" |
| 7.2 | **BLOCKER** No Flutter vocabulary | `<AsmButton>`, `AsmTokens`, `automationIdentifier`, `WidgetState`, `LayoutBuilder`, or any `Asm*` name in React output. `Asm*` is Flutter vocabulary; React uses a different prefix or plain names |
| 7.3 | **BLOCKER** Component name verified from source | A React component name was **derived from the Flutter name** or guessed, rather than read from the React source |
| 7.4 | **BLOCKER** Tokens from the web build | A value inlined because the variable couldn't be found. A missing token is a **gap in the web build to report**, never licence to inline |
| 7.5 | Token naming transform confirmed once | The web build's naming convention was guessed, or two different conventions appear in one output |
| 7.6 | Variants and sizes verified, not assumed | Flutter's variant/size list assumed to exist in React. Parity is **not guaranteed** — `Button` documents 8 variants and 4 sizes in Flutter; React's set is unverified until read |
| 7.7 | Component existence checked | A React component used without confirming it exists in the library |
| 7.8 | Prop names and enum spellings read from source | A prop name inferred from the Flutter parameter table |
| 7.9 | Prop defaults passed explicitly | Relied on a React default — distrusted exactly as Flutter's are, and with less documentation behind them |
| 7.10 | Divergences filed as open questions | A React-only prop treated as a documented modifier, or a missing variant treated as a deprecation. The **doc wins**; the difference is an open question worth filing |
| 7.11 | Nothing invented for an undocumented component | A React component built for `brand`, `feature banner`, `guided action panel`, `lists`, `quick action`, `toggle groups`, or `topbars` — or a `Popover` or reusable carousel. A prototype is exactly where an invented component becomes precedent |
| 7.12 | Not using the library when it has the component | A bespoke component hand-rolled where the Assemble React library already provides one — that is how a prototype becomes a fork |
| 7.13 | **BLOCKER** Accessibility unrelaxed | Any G2 gate waived because the output is a prototype. Watch the focus ring specifically: it is the most common omission in generated web code and the most consequential |
| 7.14 | Container-based sizing, or the caveat stated | Layout driven by the viewport with no note that it breaks whenever a side panel is open (see G3.1) |
| 7.15 | Desktop form factor respected | A frame narrower than 500, or a mobile layout. SM starts at **500** and means a narrow desktop window, not a phone |
| 7.16 | What was verified is stated | The report doesn't say which React names and props were read from source and which couldn't be confirmed |

---

## Self-report block

Append this to any build, translate, or review answer. It is short, and it is the part a reviewer
reads first.

```
ASSEMBLE VALIDATION
  Routing      : <component> — <the discriminator that decided it> (<doc>)
  Routed away  : <components rejected, and why> | none
  Choices      : <variant/size/mode> ← decided from <the doc's stated input>
  Foundations  : colour <tokens> · type <tokens> · spacing <tokens> · elevation <shadow|none>
                 states <role> · icons <size>
  Layout       : content region <derivation> · tier <SM|MD+> · span <n/12>
  Gates        : G1 ✓  G2 ✓  G3 ✓  G4 ✓  G5 ✓  G6 ✓  G7 —
  Open items   : <doc> item <n> — <one line> | none touched
  Unverified   : <what is not in the docs, and where I looked> | none
  Target       : Flutter (sanctioned binding — production)
               | React (sanctioned binding — prototyping; NOT a production spec)
               | Figma / prose (no binding)
               | <target> (TRANSLATION — not sanctioned Assemble)
```

The `Gates` line always lists all seven, with the binding group you didn't run shown as `—`. A
Flutter answer reads `G5 ✓  G7 —`; a React answer reads `G5 —  G7 ✓`; a translation reads both as
`—`.

Any gate that isn't a clean `✓` is listed underneath with its number, severity, and either the
fix applied or the reason the exception holds. A gate you didn't run is reported as `—`, not `✓`.

Whichever target you chose, the matching **label** from [`platform-adapters.md`](platform-adapters.md)
§7 goes *above* this block: none for Flutter, the React fidelity notice for React, the translation
notice for everything else.
