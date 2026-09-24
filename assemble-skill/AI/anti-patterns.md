# Anti-Patterns

> Role: The cross-component failure catalogue. Everything that goes wrong more than once, in one
> place, grouped by what causes it rather than by which component it happens to.
> Rule: Read these as **assertions about your output**, not as background. A named anti-pattern is
> never acceptable output, even when it renders fine.
> Scope: Every target, and both bindings — groups A–H are design law and hold identically in Flutter
> and React. Group I adds the failures specific to having **two** bindings. Where a component doc's
> own `## Anti-Patterns` section is more specific, it wins.
> Source: the `## Anti-Patterns` and `## Rules` sections of all 34 component docs and 8 foundations.

Each entry: **the pattern** — why it's wrong — where it's documented.

---

## A. Token bypass

**A1. A hex, an rgb(), or a `Color(0x…)` in application code.**
The value stops responding to theme at the exact point the token system was supposed to work.
Nothing about it is obvious in review — it renders correctly in whichever mode you built in.
→ `Color`

**A2. A reference-layer token in UI.** `md.ref.palette.*`, `md.ref.brand.*`, `md.key.*`.
The reference layer has no meaning; only the semantic layer carries intent. Referencing it means
the next theme change silently misses this element.
→ `Color`

**A3. Resolving a token to its value "just for this one case."**
There is no such case. If the semantic layer lacks the role you need, that's a gap to report, not a
hex to inline.
→ `Color`

**A4. A raw font size, weight, line height, or tracking.**
Type tokens are composite. Naming one metric separately guarantees the other three drift.
→ `Typography`

**A5. Emphasizing with a bigger size or a manual weight instead of `-emphasized`.**
`-emphasized` exists so emphasis is a *variant* of the style rather than a different style.
→ `Typography`

**A6. Hand-authoring a `BoxShadow`.**
There are three shadows. A hand-authored fourth is invisible in review and impossible to update.
→ `Elevation`

**A7. An off-scale spacing value.**
15 steps, closed. Off-scale means either the wrong step or a wrong layout — never a missing step.
→ `Spacing`

**A8. Approximating a pill with a large fixed radius.**
`md.border.radius.999` *is* the pill. A fixed radius breaks the moment the element's height changes.
→ `Spacing`

**A9. Hardcoding a dark-mode value, or branching on brightness at the usage site.**
Dark mode is a theme-mode swap. A colour that looks wrong in dark mode means the wrong semantic
role was chosen — fix the role.
→ `Color`

---

## B. Accessibility

**B1. Removing, narrowing, or softening the focus ring.**
Tier-1 violation. It is 2px `md.sys.color.primary` at 2px offset, or the element is unusable by
keyboard. "It looked heavy" is not a reason.
→ `States`

**B2. Showing the focus ring after a mouse click.**
Focus is keyboard-only. A ring on every click trains users to ignore it.
→ `States`

**B3. Enlarging a glyph to reach 48×48.**
The target comes from padding. Growing the glyph changes the design and still often misses.
→ `Icons`

**B4. A touch target under 48×48.**
Including at 200% text scale. Two shipped cases are documented and both are defects, not licences:
`Switch` `small`, and `Menu` `compact` (40).
→ `Icons`, `States`, `Switch`, `Menu`

**B5. Meaning by colour alone.**
A red dot, a coloured chart segment, a severity conveyed only by fill. Needs a glyph, a label, or
adjacent text.
→ `Color`, `Status Indicators`, both charts

**B6. A coloured surface as the message.**
A `Cards` `brand`/severity variant, or a coloured badge, where the text doesn't say what the colour
says. The colour is decoration; a screen reader hears nothing.
→ `Cards`, `Badges`

**B7. A bare status dot whose condition is named nowhere.**
Decoration that looks like information. Either the adjacent text names it, or you find room for the
label — the fallback is never "ship the dot anyway."
→ `Status Indicators`

**B8. An icon-only control with a label but no tooltip, or a tooltip but no label.**
Both, always. The glyph is not a name.
→ `Icons`

**B9. Wrapping an `Asm*` widget in your own `Semantics` or `GestureDetector`.**
Produces a competing announcement or a second, nameless tap target. The component already owns
both.
→ `Icons`, component `Flutter Usage` sections

**B10. Conflating the three string slots.**
Visible **label** (spoken) · **semantic label** (spoken; *expands* a too-terse label, never says
something different) · **automation identifier** (never spoken, kebab-case, from purpose,
required and asserted non-empty). Three slots, three jobs.
→ component `Accessibility` sections

**B11. Mutating a label to communicate progress.** "Save" → "Saving…".
Changes the accessible name mid-interaction; assistive tech re-announces a control that didn't
change. Use the component's loading state.
→ `Button`

**B12. Relying on a chart legend.**
Both chart docs state the legend is **not announced**. The caller supplies the breakdown or the
data is unavailable to screen-reader users.
→ `Data Arc Chart`, `Data Linear Chart`

**B13. Anything consequential in a transient or hover-only surface.**
Snackbars expire, tooltips vanish, scrollbars fade. None is reliably reachable.
→ `Snackbar`, `Tooltip`, `Scrollbar`

**B14. Reaching an item only by hover, swipe, or drag.**
Carousel items behind decorative dots are the canonical case.
→ `Carousel`

**B15. Faking disabled with `Opacity`, `IgnorePointer`, or `AbsorbPointer`.**
Looks disabled, stays in the tab order, still receives states. Pass `null` to the handler.
→ component `Flutter Usage` sections

---

## C. Routing

**C1. Entering a decision tree in the middle.**
Question one is always "is this the right component at all?" Skipping it is the most common and
most expensive error in the system.
→ every component doc

**C2. A modal for something that isn't blocking.**
Most modals should have been a snackbar or an alert banner. The test: *must the user respond before
anything else can happen?*
→ `Modal`

**C3. A snackbar the user can't afford to miss.**
The test: *would the user be stuck if they missed it?* If yes, `Alert Banner`.
→ `Snackbar`

**C4. A carousel where the user must compare, scan, or find.**
Hiding items behind paging is the opposite of what the task needs. Use a list.
→ `Carousel`

**C5. A scrollbar instead of dividing the content.**
Tabs, sections, or pagination were the answer. A scrollbar inside a `Popover`, `Tooltip`, or
`Modal` means the content outgrew the shape.
→ `Scrollbar`, `Popover`, `Tooltip`, `Modal`

**C6. An accordion hiding content needed to complete the task.**
Accordions are for secondary detail, not for making a page look shorter.
→ `Accordion`

**C7. A checkbox that takes effect immediately, or a switch that waits for Save.**
The only question is whether anything happens on click.
→ `Checkbox`, `Switch`

**C8. A switch for something destructive or hard to reverse.**
A switch has no cancel. Button + confirming modal.
→ `Switch`

**C9. Tabs used as navigation, or as a filter.**
Tabs swap a region of one page. Changing the page or the subject is the rail's job (or a topbar's);
multiple simultaneous options is filter `Tags` or a multi-select `Menu`.
→ `Tabs`

**C10. A destructive confirmation in a menu row.**
A menu row can't state a consequence. `Modal`.
→ `Menu`

**C11. Focusable content inside a tooltip.**
Anything pressable, focusable, scrollable, or selectable means `Popover`.
→ `Tooltip`

**C12. A popover that opens on hover.**
Unreachable by keyboard, and it vanishes during pointer travel.
→ `Popover`

**C13. Using a chart as a progress indicator, or a progress bar for a composition.**
`Progress Bar` has a **track** and its remainder means "not yet." The charts have no track and the
split *is* the message. They look identical and mean opposite things.
→ `Progress Bar`, both charts

**C14. A loader for a wait under ~300ms.**
A flash reads as a glitch. Show nothing.
→ `Loaders`, `Skeleton Loader`

**C15. Skeletons over content that's already on screen.**
Refreshing existing content: leave the stale content. Skeletons are for first paint.
→ `Skeleton Loader`

**C16. A skeleton that doesn't match the incoming footprint.**
Causes the exact layout jump it exists to prevent.
→ `Skeleton Loader`

**C17. A divider where spacing or a heading was the answer.**
Ask "would more space make it clear?" first.
→ `Divider`

**C18. A badge at zero.**
Show nothing.
→ `Status Indicators`

**C19. A one-option radio group, or a chart with one part.**
One option isn't a choice; one segment reads as completed progress.
→ `Radio`, both charts

**C20. A sheet for a flow needing a minute or internal navigation.**
A sheet has no URL and no back stack. That's a screen.
→ `Sheets`

**C21. Choosing between side and bottom sheet by screen size or content length.**
The question is whether the main UI must stay visible **and usable**.
→ `Sheets`

**C22. A grid-only date picker for a date the user already knows.**
The typed field must always be available.
→ `Date Picker`

**C23. A button that navigates, or a link that acts.**
Announced differently, expected differently.
→ `Button`

**C24. Inventing a spec for one of the seven undocumented components.**
`brand`, `feature banner`, `guided action panel`, `lists`, `quick action`, `toggle groups`,
`topbars`. Name the gap.
→ `checklist.md`

---

## D. Variant and size

**D1. Relying on a widget's default.**
`AsmButton` defaults to `variant: text, size: large`; the guidance is `filled`/`medium`. Pass both
explicitly, every time.
→ `Button`

**D2. Two `filled` buttons on one surface.** (Also: two `primary`-tone switches.)
Emphasis is relative; two primaries is none.
→ `Button`, `Switch`

**D3. Mixed button sizes in a row or a dialog footer.**
One size per group.
→ `Button`

**D4. `xsmall` to rescue a crowded layout.**
It drops to 12px type. Fix the layout.
→ `Button`

**D5. A standalone `text`/`textNoPadding` button with no directional icon.**
Those two variants have **no state layer at all** — the icon is the only remaining affordance. With
a `filled`/`tonal`/`outline` neighbour it must *not* need one.
→ `Button`

**D6. `destructive` on `outline`, `ghost`, `textNoPadding`, or `strict*`.**
**Silently ignored.** Renders an ordinary button that you believe is destructive.
→ `Button`

**D7. `Peek Label` `inverse` + `offline`.**
The tone is **silently ignored**.
→ `Peek Label`

**D8. `Expanded Card` with both `options` and `expandedContent`.**
**Asserts.** An error, not a precedence question.
→ `Expanded Card`

**D9. Choosing a surface-decided variant by emphasis or taste.**
`Badges` `type` ← the surface behind it (`primary`'s near-white fill is invisible on light).
`Accordion` type ← the page background. `Text Fields` `filled`/`outlined` ← whether a four-sided
stroke competes with a busy surface, and then *all* fields on that surface match. `Button` `ghost`
← imagery or a gradient. `Button` `strict*` ← the surface is theme-independent.
→ `Badges`, `Accordion`, `Text Fields`, `Button`

**D10. `strictBlack`/`strictWhite` on a themed surface.**
`strictWhite` can vanish entirely.
→ `Button`

**D11. `Menu` `compact` for touch.**
40px rows, under the floor.
→ `Menu`

**D12. Filled icons for emphasis, or mixed with outlined in one group.**
Filled means **selected**. Nothing else.
→ `Icons`

**D13. Mono type on a control, prose, or a heading.**
Data values only.
→ `Typography`

**D14. Heavy weight on title/label/body, or anywhere in standard product UI.**
Display and headline only, promotional only.
→ `Typography`

**D15. Rotating, flipping, or redrawing a library glyph; or giving a concept a second glyph.**
One concept, one glyph, product-wide.
→ `Icons`

**D16. Overriding an icon size on a component slot, or constraining its box to resize it.**
Take the size from the pairing table and pass the icon bare.
→ `Icons`

---

## E. Layout

**E1. Branching on window width.**
Layout comes from the content region:
`window − 16 − 60 (rail) − 16 − 386 (panel, if present)`.
In Flutter: `LayoutBuilder`/`constraints.maxWidth`, never `MediaQuery.size.width`.
→ `Breakpoints`

**E2. A third threshold.**
There are two: 500 and 980.
→ `Breakpoints`

**E3. Branching between 1280 and 1440.**
The grid capped at 992 before either. The content is identical; only the margin differs.
→ `Breakpoints`, `Grid`

**E4. Applying the SM transforms separately.**
Rail→drawer, panel→bottom sheet, and 12→4 columns move together or the shell is inconsistent.
→ `Breakpoints`

**E5. "Fixing" the surplus margin past 992.**
The grid caps and centres. The empty space is intentional; filler is not a fix.
→ `Grid`

**E6. Treating the 60px rail as grid columns, or letting the rail/panel flex.**
Both are fixed and sit **outside** the grid. Flex belongs to the content columns.
→ `Grid`, `Navigation Rail`, `Sheets`

**E7. A hardcoded card or column width.**
Derive from the grid.
→ `Grid`

**E8. Peers with different spans for no reason.**
Different spans express hierarchy. If there is none, share the span.
→ `Grid`

**E9. A nested grid inside a card.**
A card lays out its own contents; it does not run a second column system.
→ `Grid`

**E10. Rail and panel as ancestors of the content.**
They're siblings. As ancestors, the content never receives real constraints and E1 becomes
unavoidable.
→ `Grid`, `Breakpoints`

**E11. A component that takes a breakpoint tier as a parameter, or only works at one width.**
Components are container-agnostic. They must be correct beside a 386 panel, inside a bottom sheet,
and inside a card, without knowing the window size.
→ `Breakpoints`

**E12. Authoring side-panel and bottom-sheet content twice.**
One content definition that adapts to its container.
→ `Sheets`, `Breakpoints`

**E13. Vertical gaps other than 24 between items / 30 at section boundaries.**
→ `Grid`

**E14. Inlining 500, 980, 992, 386, or 60 at a call site.**
They aren't tokenized, which is exactly why they need naming.
→ `Breakpoints`, `Grid`

---

## F. Elevation and surface

**F1. Adding a shadow by default.**
No shadow is the most common correct answer. Colour, spacing, or a border usually already
separates it.
→ `Elevation`

**F2. Stacking shadows, interpolating, or inventing a fourth.**
Three: `subtle`, `light`, `heavy`.
→ `Elevation`

**F3. Peers in a grid with different shadows.**
Reads as a bug, not a hierarchy.
→ `Elevation`

**F4. Stepping up `surface-container-*` to imply lift.**
Elevation is shadow-based, not tonal. That's a container fill for tertiary UI.
→ `Elevation`

**F5. `Material(elevation:)` or `Card(elevation:)`.**
Numeric elevation isn't this system's model.
→ `Elevation`

**F6. Manually darkening a shadow for dark mode.**
Lean on the surface tokens.
→ `Elevation`

**F7. A floating surface that scrolls.**
`Popover`, `Tooltip`, `Modal` — scrolling means the content was wrong for the shape.
→ `Popover`, `Tooltip`, `Modal`

---

## G. Composition and structure

**G1. Several `Alert Card`s stacked on one surface.**
"Many alerts" is many items inside **one** alert card. It already resolves deck vs carousel from
width — don't rebuild that outside it.
→ `Alert Card`

**G2. Making a whole card tappable.**
Cards carry no interaction. Put a real control inside.
→ `Cards`

**G3. Restating a substrate's variants in a doc built on it.**
`Cards` is the base of six components. Route *down* to it; never restate.
→ `Cards`

**G4. Rebuilding `Alert Card`'s width logic elsewhere.**
The component that owns the width decision wins.
→ `Alert Card`

**G5. A tag body made pressable.**
Tag bodies are never interactive. Only the `filter` variant's × is.
→ `Tags`

**G6. Removing one of the selected tab's signals.**
Design gives three; the shipped component delivers two. Removing another leaves one.
→ `Tabs`

**G7. Placing the rail anywhere but the left edge.**
Right, bottom, floated, rotated — including via the shipped-but-forbidden
`AsmNavigationRail.bottom`. The system's only absolute placement rule.
→ `Navigation Rail`

**G8. A lone radio, or a radio that owns its own selection/name/default.**
The **group** owns all three.
→ `Radio`

**G9. Charts outside their part counts.** Arc 2–4, linear 2–5.
The colour ramp cycles and the legend breaks.
→ both charts

**G10. Shipping a chart whose values sum to zero.**
It renders blank rather than erroring. Check the sum at the call site and swap in an `Empty State`.
→ both charts

**G11. Treating `Feedback`'s own visual change as acknowledgement.**
The selected fill is nearly invisible. Acknowledge with a `Snackbar` or a follow-up.
→ `Feedback`

**G12. Shipping `Chat Bubble` without the conversation view's obligations.**
Width constraint (~70–80%), per-sender alignment, sender attribution for assistive tech,
timestamps, entry animation. The bubble does none of it.
→ `Chat Bubble`

**G13. Treating carousel dots as a control.**
Decorative, not focusable, not tappable. Build the affordance yourself and inherit every
obligation a control carries.
→ `Carousel`

**G14. Launching product feedback mid-task.**
`Feedback` is about the content on screen. Product feedback belongs in a survey elsewhere.
→ `Feedback`

**G15. Omitting a part marked Required in the anatomy table.**
Required and optional. There is no third category.
→ every component doc

---

## H. Content and copy

**H1. "OK", "Submit", "Yes", "Confirm".**
Labels are verb phrases naming the action.
→ `Button`

**H2. A destructive label that doesn't name what is destroyed.**
"Delete account", not "Confirm".
→ `Button`, `Modal`

**H3. Truncating or abbreviating a label to fit.**
If it doesn't fit, the label is too long or the container too narrow. Never abbreviate to fit a
size step.
→ `Button`

**H4. "No data" as an empty state.**
Say why it's empty and what to do next. And *"nothing matched"* is a query problem needing a
different action from *"nothing yet."*
→ `Empty State`

**H5. The placeholder used as the label.**
The label persists once typing starts.
→ `Text Fields`

**H6. A page-level error shown as a field error, or a field error shown as a banner.**
Scope the message to what it's about.
→ `Text Fields`, `Alert Banner`

**H7. A `Peek Label` longer than one or two words.**
There is no width cap, so nothing stops you overflowing it.
→ `Peek Label`

**H8. Ordinary copy rendered as a chat bubble.**
A bubble means a message in a conversation.
→ `Chat Bubble`

---

## I. Process and output

**I1. Stating a value you didn't read in the docs.**
A plausible-but-wrong value is worse than an acknowledged gap, because the reader can't tell the
difference.
→ `_component-doc-template.md`

**I2. Grepping a component doc for a variant name and stopping.**
The reason a variant exists is rarely next to the variant's name. The traps are in the middle.
→ `SKILL.md`

**I3. Inferring a number because it looks like the scale, or copying one from a sibling component.**
→ `decision-priority.md` §5

**I4. Resolving a Figma-vs-code conflict silently.**
Document both and flag it. That's the authoring rule and the reading rule.
→ `decision-priority.md` §3

**I5. Using a Figma variant name as a code identifier.**
`Button`'s Figma `default` is code's `small`.
→ `Button`, `glossary.md`

**I6. Propagating a component's documented divergence to another component.**
`Button`'s 38%/38% disabled treatment is a `Button` divergence and an open item. It is not a new
rule.
→ `decision-priority.md` §2

**I7. Restating a foundation inside a component answer.**
Re-tabulating state opacities or the type scale duplicates a thing that will change.
→ `_component-doc-template.md`

**I8. Answering without naming the open items you touched.**
~600 exist. Landing on one is normal; citing it is a better answer than filling the gap.
→ `known-gaps.md`

**I9. Writing web platform concepts into the *design-law* part of a doc.**
HTML, CSS, React, `:focus-visible` in a component doc's **platform-agnostic** sections — everything
above `## Flutter Usage`. Design law stays platform-agnostic because it governs both bindings; a
documented **binding** section is a different matter, and React is a sanctioned binding that should
eventually have a `## React Usage` section of its own. Producing web *output* is governed by
[`platform-adapters.md`](platform-adapters.md).
→ `_component-doc-template.md`, [`known-gaps.md`](known-gaps.md) §3.0

**I10. Presenting output with no sanctioned binding as sanctioned Assemble.**
CSS, Vue, SwiftUI, bespoke web. It's a translation — label it. Flutter and Assemble-**React** output
are *not* translations; React carries a fidelity notice instead.
→ [`platform-adapters.md`](platform-adapters.md) §7

**I11. Deriving Flutter code from a React prototype.**
The flow is one-way: **design law → binding**, never binding → binding. React is an undocumented,
unreconciled approximation of the design law; porting it launders that approximation into production
where nobody downstream can tell. Take the *requirement* the prototype demonstrates and run it
through the component docs again.
→ [`react-binding.md`](react-binding.md) §1, [`decision-priority.md`](decision-priority.md) tier 9

**I12. Citing the React library as evidence about the design system.**
"React has a `subtle` variant, so Assemble has one." It doesn't. React is authoritative about what
React does and about nothing else — it sits at tier 9 for "what do I type in React" and has **no
tier at all** for design questions. A React-only prop is an **open question worth filing**, not a
documented modifier; a missing variant is not a deprecation.
→ [`decision-priority.md`](decision-priority.md) §6, [`react-binding.md`](react-binding.md) §1

**I13. Writing `Asm*` in React, or React prop names in Dart.**
`Asm*` is Flutter vocabulary. `<AsmButton>` in a `.tsx` file is a defect even though the name is
real — which is what makes it easier to miss than an invented name. Autocomplete will produce it
happily.
→ [`glossary.md`](glossary.md) §2–3, validation gate **G7.2**

**I14. Assuming React has Flutter's API.**
Parity is **not guaranteed** — React is a looser prototyping approximation. `Button` documents 8
variants and 4 sizes in Flutter; React's set is unverified until you read it. Deriving a React
component name from a Flutter one is a BLOCKER, not a reasonable guess.
→ [`react-binding.md`](react-binding.md) §2, validation gates **G7.3**, **G7.6**

**I15. Relaxing anything because "it's just a prototype."**
The accessibility floor is tier 1 in both bindings. A prototype without focus states is how a shipped
screen ends up without them — and the prototype is what stakeholders approve.
→ [`react-binding.md`](react-binding.md) §5, validation gate **G7.13**

**I16. Hand-rolling a component the Assemble React library already has.**
That is how a prototype becomes a fork. Use the library; if the component or variant genuinely isn't
there, say so and record what's absent rather than quietly filling it in.
→ [`react-binding.md`](react-binding.md) §6, validation gate **G7.12**

**I17. Inlining a value because you couldn't find the token in the web build.**
A token with no entry in the web build is a **gap in the web build to report**. The naming transform
is mechanical and lives in the web token package — read it, don't guess it, and don't fall back to a
hex.
→ [`token-contract.md`](token-contract.md), [`react-binding.md`](react-binding.md) §3
