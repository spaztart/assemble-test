# Component: Carousel

> Role: A horizontally paged set of surfaces with a row of dots beneath it naming the current position. **There is no reusable carousel component in this system** — only the dot indicator. The one working carousel lives inside [[Alert Card]], and it does not use that indicator.
> Scope: Sections up to [Flutter Usage](#flutter-usage) are platform-agnostic — they describe what a carousel is, when it is the wrong pattern, and what the dots may and may not do. Flutter is the primary implementation target; its bindings are in [Flutter Usage](#flutter-usage).
> Rule: The dot indicator is **decorative**. It is not focusable, not tappable, and has no keyboard path. If a user needs to jump to a page, you must build that affordance yourself — and if you do, the dots stop being decorative and inherit every obligation a control has.
> Source: Figma `Components` → `carousel_indicator` / `dot_indicator`, container frame `carousel_container` (36 tall). No node ids are cited in the implementation. Implementation: `pegasus_flutter/lib/asm/components/carousel_indicator.dart`. The paging behaviour is in `pegasus_flutter/lib/asm/components/alert_card.dart`.

## Overview

A carousel shows one surface at a time from an ordered set, and gives the user a way to move between them plus a way to know where they are. This system ships the last of those three things as a component and none of the first two.

**What actually exists:**

| Piece | Ships as | Where |
| --- | --- | --- |
| Position indicator (the dot row) | `AsmCarouselIndicator` — public, exported, **decorative** | `carousel_indicator.dart` |
| A single dot glyph | `AsmDotIndicator` — public, exported, decorative | `carousel_indicator.dart` |
| Paging behaviour (drag, page state, transitions) | **Not a component.** Private to [[Alert Card]]. | `alert_card.dart` |
| A tappable dot row | **Not a component.** Private to [[Alert Card]], and a *second, different* implementation. | `alert_card.dart` |

**The distinction most often got wrong is indicator versus carousel.** `AsmCarouselIndicator` looks like the carousel's navigation. It is not. It renders `count` dots, highlights index `activeIndex`, and announces "Page N of M" — and that is all. It cannot be focused, cannot be tapped, shows no pointer cursor, and handles no keys. Its own documentation is explicit: pair it with the carousel's own controls, and wrap it in your own button if you need tap or keyboard behaviour.

**The second distinction is component versus shipped behaviour.** The dots you see in the product are *not* `AsmDotIndicator`. [[Alert Card]] contains its own dot row, built independently, with different geometry, different colours, and — critically — **per-dot tap and semantics that the component lacks**. Two implementations of one thing, and the one that is public and documented is the one nothing uses. See [The two implementations](#the-two-implementations).

**The third distinction is carousel versus a list.** A carousel hides content behind a gesture. Anything a user might need to compare, scan, or find should not be in one. The system's own use of the pattern is narrow and defensible — a stack of alerts on a narrow viewport, where only the top one is actionable anyway — and that narrowness is the point. See [Decision Tree](#decision-tree).

## Anatomy

The indicator component:

```
  ┌─────────────────────────────────────────────────┐
  │ ┆12┆                                      ┆12┆  │  ← 36 min height (carousel_container)
  │      ╭──╮  ┆4┆  ╭──╮  ┆4┆  ╭──╮  ┆4┆  ╭──╮      │
  │      │●●│       │  │       │  │       │  │      │
  │      ╰──╯       ╰──╯       ╰──╯       ╰──╯      │
  └─────────────────────────────────────────────────┘
          ↑          ↑                    ↑
       active     inactive          12 frame /
        dot         dot             8 painted circle
```

| Part | Required | Notes |
| --- | --- | --- |
| **Container** | Yes | Minimum 36 tall, 12 horizontal inset. A *minimum*, not a fixed height — it grows if its content does. |
| **Dot frame** | Yes | 12 × 12 per dot. Layout footprint only; nothing is painted at this size. |
| **Painted dot** | Yes | An 8pt circle centred in the frame. |
| **Gap** | Yes | 4pt between adjacent dot frames, so 16pt centre to centre. |
| **Active dot** | Yes | Exactly one, at `activeIndex`. Filled with `primary`. |
| **Inactive dots** | If `count > 1` | Filled with the `ghost` token. |
| **Tap target** | **Absent** | There is none. The dots are not controls. |
| **Focus ring** | **Absent** | The component is not focusable. |

Everything inside the container is wrapped so that assistive technology sees a single node with one label, never the individual dots. See [Accessibility](#accessibility).

## The two implementations

The public component and the shipped carousel's dots agree on almost nothing.

| | `AsmCarouselIndicator` (public) | [[Alert Card]]'s dots (private) |
| --- | --- | --- |
| Painted dot size | 8 | 6 |
| Gap between dots | 4 | 6 |
| Tap cell | none | 12 × 32 |
| Container height | 36 minimum | 32 fixed per cell |
| Active colour | `primary` — `#000000` light / `#FFFFFF` dark | `onSurface` — `#252121` / `#DCDBDB` |
| Inactive colour | `ghost` — `#000000` at 19%, **both themes** | `onSurface` at 25% |
| Tappable | No | **Yes**, per dot |
| Pointer cursor | No | Yes |
| Semantics | One container node, "Page N of M" | Container node **plus** a button node per dot, "Go to page N", with selected state |
| Keyboard reachable | No | No |
| In-product use | **None** | Every compact alert carousel |

Read that table as the finding it is: the component that is exported, documented, and story-covered has **zero call sites**, and the behaviour that ships is a private reimplementation that diverges on every axis. The localisation strings make it plainest — "Go to page N," whose own description in the string table calls it the carousel dot affordance, is used **only** by the alert card, because the carousel *component* has no affordance to name.

**Which one is authoritative?** Neither has been reconciled. Until it is:

- Use `AsmCarouselIndicator` when you are building a new carousel and want the sanctioned dot geometry. Accept that it is decorative and supply your own navigation.
- Do not copy the alert card's dots. They are 12 × 32 — far below the 48 × 48 floor in [[Icons]] — and they are not keyboard reachable, which [[Alert Card]] already records as a defect ([[Alert Card]] open item on pagination reachability).
- Do not expect the two to look alike on the same screen. They will not.

## Paging behaviour

There is no paging component, so this section describes what the one working carousel does. It is the only reference implementation, and its rules are documented in full in [[Alert Card]].

- **A carousel appears only on the narrowest layout, and only with two or more items.** On wider layouts the same set of alerts is a vertical deck instead. The presentation is resolved from available width, not chosen.
- **A flick pages by exactly one.** A slow drag does nothing — it does not track the finger and does not settle partway. There is no free scrolling and no momentum across multiple pages.
- **Adjacent items are partially visible.** A narrow strip of the next and previous item shows on each side, and tapping that strip promotes it. That strip is the primary navigation, not the dots.
- **The incoming item slides in from the side it was activated from**, travelling exactly one strip width, so the strip visually becomes the new item.
- **There are no navigation arrows.** The vertical deck has arrows and no dots; the carousel has dots and no arrows. Neither presentation has both, and neither has a "page 3 of 7" text readout.

Two things a new carousel must add that the reference implementation does not have:

1. **A keyboard path.** Nothing in the shipped carousel can be reached by keyboard except the peek strip. If your carousel's items are the only route to their content, that content is keyboard-unreachable.
2. **No autoplay.** Nothing in this system autoplays, and nothing should. An advancing carousel steals reading position, breaks any pointer-based interaction mid-gesture, and violates the pause/stop/hide requirement for moving content. If a set of items must rotate, it is not a carousel — it is a queue, and it should advance on the user's input.

## States

The indicator has **no states**. It is not focusable, hoverable, pressable, or disable-able, and it renders no state layer. [[States]] does not apply to it.

The dots do carry one piece of state, and it is not an interaction state: exactly one dot is active. That is a *value*, not a state, and it is supplied by the caller as `activeIndex`.

The component does **not** have a high-contrast branch, and its inactive colour is a fixed-alpha black that does not change with theme mode. See [Accessibility](#accessibility) and [Open Items](#open-items) items 3 and 4.

## Behaviors

- **The dot row is fixed-width and does not adapt to `count`.** Each dot is 16pt of horizontal space, so twelve items is 192pt of dots plus 24pt of inset. There is no wrapping, no compression, no "…" collapse, and no maximum. **Cap the item count in your own layout** — see [Content](#content).
- **The container height is a minimum, not a fixed value.** This is deliberate and matches the system's rule against fixed heights around content; the row grows if platform text scaling grows its contents, rather than clipping.
- **No animation.** Changing `activeIndex` swaps the two dots' colours instantly. There is no travelling highlight, no cross-fade, and no reduced-motion branch to need.
- **Nothing is driven by the carousel.** The component holds no state and observes no page controller. `activeIndex` is a value the caller pushes in; keeping it in sync with whatever is actually on screen is entirely the caller's job.
- **Out-of-range values fail loudly.** `count` must be positive and `activeIndex` must be within range; both are asserted. There is no clamping and no empty rendering — a bad index is a crash in debug, which is the right trade.
- **The row centres itself** within whatever width it is given and takes only the space it needs.

## Content

The indicator renders no text. It produces one string, and that string is what a screen-reader user hears in place of the dots.

- **The default announcement is "Page N of M."** It is localised and it is correct for the overwhelming majority of cases. Do not override it to say something cleverer.
- **Override the announcement only when "page" is the wrong noun** — and then say what the items are: "Alert 2 of 5," "Photo 3 of 8." An override must still carry both the position and the total, because that is the only information the dots convey.
- **Never override it to a static string.** "Carousel" or "Pagination" tells a user nothing and replaces the one useful thing the component says.
- **Never announce the count of items a user cannot reach.** If only the visible item is reachable, "Page 1 of 9" promises eight pages the user has no way to get to.

On the number of items: the dots are the only positional signal, and eight identical 8pt circles do not communicate position — they communicate "many." **Keep a carousel at or below five items.** Beyond that the pattern has stopped working and the content wants a list.

## Decision Tree

```
Does the user need to compare, scan, or find something in the set?
├── Yes ───────────────────────────────────→ NOT a carousel. Use a list.
│                                             Hiding items behind a gesture
│                                             makes finding impossible.
└── No — only one item matters at a time
    │
    ├── Is the set a stack of alerts or messages?
    │   └── Yes ─────────────────────────────→ use [[Alert Card]]. It already
    │                                          resolves deck vs carousel from
    │                                          width. Do not build your own.
    │
    ├── Is the set larger than five?
    │   └── Yes ─────────────────────────────→ NOT a carousel. Dots stop
    │                                          conveying position. Use a list
    │                                          or paginate with a readout.
    │
    ├── Must it advance on its own?
    │   └── Yes ─────────────────────────────→ NOT a carousel. NEVER autoplay.
    │
    └── A genuine one-at-a-time set of ≤ 5
        │
        ├── Do users need to jump directly to an item?
        │   ├── Yes ──→ Build the affordance yourself.
        │   │           AsmCarouselIndicator will NOT do it.
        │   │           Each dot becomes a real button: 48×48,
        │   │           focusable, named, keyboard reachable.
        │   └── No ───→ AsmCarouselIndicator as-is, plus a swipe
        │               AND a keyboard-reachable alternative route
        │               to every item.
        │
        └── Which dot component?
            ├── The whole row ────────────────→ AsmCarouselIndicator
            └── One dot, in your own layout ──→ AsmDotIndicator
```

## Accessibility

The indicator gets one thing right and several things wrong.

**What it gets right:** it presents as a single node with one meaningful label and suppresses its children, so a screen-reader user hears "Page 2 of 5" instead of five nameless circles. That is the correct shape for a decorative positional readout, and it is what the alert card's version does *in addition to* its per-dot buttons.

| Requirement | Status | Notes |
| --- | --- | --- |
| Accessible name | **Met** | "Page N of M", localised, overridable. |
| Individual dots hidden from AT | **Met** | The dots are suppressed; only the container is announced. |
| Role | **N/A by design** | No role, because it is not a control. |
| Non-text contrast (WCAG 1.4.11, 3 : 1) | **Fails** | The inactive dot is **1.56 : 1** in light mode and **1.11 : 1** in dark. See below. |
| Touch target 48 × 48 | **N/A for the component** | It has no target. The alert card's tappable version is **12 × 32** and fails. |
| Keyboard reachable | **No** | Not focusable. Neither implementation is. |
| Reduced motion | **N/A** | No animation. |
| High contrast | **Not handled** | No branch; the inactive colour is theme-invariant. |

**The inactive dot is effectively invisible, and in dark mode it is invisible.** Computed from the token values against the card surface:

| | Active dot | Inactive dot | Active vs inactive |
| --- | --- | --- | --- |
| Light | `#000000` — 21.0 : 1 | 19% black over white ≈ `#CFCFCF` — **1.56 : 1** | 13.5 : 1 |
| Dark | `#FFFFFF` — 14.4 : 1 | 19% black over `#2D2929` ≈ `#252121` — **1.11 : 1** | 15.9 : 1 |

The cause is that the inactive colour is a **fixed 19% black in both themes**. In light mode that is a pale grey on white — under the 3 : 1 floor for a meaningful graphic, but visible. In dark mode it is black-on-dark, i.e. *darker than the surface it sits on*, at 1.11 : 1. A user in dark mode sees one white dot and no others, and therefore cannot tell how many items exist. The alert card's version, which uses 25% of the foreground colour instead, reaches 1.98 : 1 in dark — still failing, but visible.

Four obligations the component cannot discharge for you:

1. **Provide a keyboard-reachable route to every item.** Neither the dots nor the swipe is keyboard reachable. If the carousel is the only path to its items, those items do not exist for a keyboard or switch-control user. [[Alert Card]] handles this by making the peek strip tappable and its content reachable another way; a new carousel must handle it explicitly.
2. **If you make the dots tappable, they become controls in full.** Each needs a 48 × 48 target per [[Icons]], a name ("Go to page 3"), a selected state, keyboard focus, and a visible focus ring from [[States]]. An 8pt circle in a 12pt frame is none of those things, and neither is a 12 × 32 cell.
3. **Do not rely on the dots to communicate position.** They fail contrast, they are absent from the semantics tree individually, and past five items they do not scale. Position must also be recoverable from the content itself.
4. **The dots must not be the only indication that more items exist.** Given the dark-mode contrast figure, a user may see exactly one dot. The partially-visible adjacent item — the approach [[Alert Card]] takes — is a far more reliable affordance than the dots are.

## Anti-Patterns

**❌ Treating `AsmCarouselIndicator` as navigation.** It is decorative: no focus, no tap, no cursor, no keys. → Supply your own navigation, or wrap each dot in a real button.

**❌ Making the dots tappable without making them controls.** A tap handler on an 8pt circle gives a target under 48 × 48, no name, no role, no focus, and no keyboard path. → If a dot is tappable, build it as a button, at 48 × 48, focusable and named.

**❌ Building a carousel because a set is long.** Length is the argument *against* a carousel. Nine items behind a gesture is nine items nobody finds. → Use a list.

**❌ Autoplaying.** It steals reading position, interrupts gestures, and denies the user control of moving content. → Advance only on input.

**❌ More than five items.** Six identical circles say "many," not "you are on the fourth." → Cap the set, or paginate with a text readout.

**❌ Using a carousel for content users need to compare.** Comparison requires simultaneity. → Lay the items out.

**❌ Copying [[Alert Card]]'s private dot row into a new carousel.** It is 12 × 32, under the touch-target floor, keyboard-unreachable, and it disagrees with the public component on every value. → Use `AsmCarouselIndicator` and add the navigation yourself.

**❌ Relying on the inactive dot to be visible in dark mode.** It computes to 1.11 : 1 against the surface. → Never let the dots be the only signal that more items exist.

**❌ Overriding the announcement to a static label.** "Carousel" replaces the position and the total with nothing. → If you override, keep both numbers.

**❌ Letting `activeIndex` drift from what is on screen.** The component holds no state and watches nothing. → Drive both from one source of truth.

**❌ Rolling your own carousel for a stack of alerts.** [[Alert Card]] already resolves deck versus carousel from available width, with tabs, transitions, and swipe. → Use it.

**❌ Putting the indicator in a fixed-height box.** Its height is a minimum so it can grow with text scaling. A fixed box reintroduces the clipping the minimum exists to prevent.

---

## Flutter Usage

`AsmCarouselIndicator` and `AsmDotIndicator` in `lib/asm/components/carousel_indicator.dart`, both exported from `assemble.dart`. There is **no carousel widget** — no `AsmCarousel`, no page view, no controller. The paging behaviour lives inside `AsmAlertCard` and is private.

No enums.

### Basic usage

```dart
AsmCarouselIndicator(
  count: pages.length,
  activeIndex: _currentPage,
)
```

`count` must be greater than zero and `activeIndex` must be in `[0, count)`; both are asserted. The announcement defaults to the localised "Page N of M".

### Naming the items

```dart
AsmCarouselIndicator(
  count: alerts.length,
  activeIndex: _index,
  semanticLabel: 'Alert ${_index + 1} of ${alerts.length}',
)
```

Override only when "page" is the wrong noun, and keep both the position and the total. `semanticLabel` is asserted non-empty.

### Wired to a page view

```dart
class _Deck extends StatefulWidget {
  const _Deck();
  @override
  State<_Deck> createState() => _DeckState();
}

class _DeckState extends State<_Deck> {
  final _controller = PageController();
  int _index = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: 240,
          child: PageView.builder(
            controller: _controller,
            itemCount: _items.length,
            onPageChanged: (i) => setState(() => _index = i),
            itemBuilder: (_, i) => _items[i],
          ),
        ),
        AsmCarouselIndicator(count: _items.length, activeIndex: _index),
      ],
    );
  }
}
```

The indicator is a readout of `_index`. It does not observe the controller and will silently disagree with the page view if you forget to update the index.

### A single dot in your own layout

```dart
AsmDotIndicator(active: index == _currentPage)
```

The 12pt frame and 4pt gap are the row's geometry, not the glyph's — if you lay dots out yourself, reproduce both. Take the gap from `AsmSpacingScale.s100`.

### Making a dot an actual control

The component will not do this for you. If a user must be able to jump to a page, each dot needs to become a button in full:

```dart
Semantics(
  button: true,
  selected: i == _index,
  label: context.asmL10n.goToPage(i + 1),
  excludeSemantics: true,
  child: InkWell(
    customBorder: const CircleBorder(),
    onTap: () => _goTo(i),
    child: const SizedBox.square(
      dimension: 48, // the floor from [[Icons]] — not 12, not 32
      child: Center(child: AsmDotIndicator(active: false)),
    ),
  ),
)
```

Note what that costs: 48pt per dot instead of 16, which is 240pt for five dots. That expense is the reason to prefer a partially-visible adjacent item as the navigation affordance and leave the dots decorative.

### Full parameter reference — `AsmCarouselIndicator`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `count` | `int` | **Yes** | — ; asserted `> 0` |
| `activeIndex` | `int` | **Yes** | — ; asserted `>= 0 && < count` |
| `semanticLabel` | `String?` | No | `null` → localised "Page N of M"; asserted non-empty if given |

### Full parameter reference — `AsmDotIndicator`

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `active` | `bool` | **Yes** | — |

Neither widget takes an `automationIdentifier`, an `onTap`, or a focus node.

### Tokens

| Property | Token | Value |
| --- | --- | --- |
| Container minimum height | hardcoded `36` (Figma `carousel_container`) | 36 |
| Container horizontal inset | `AsmSpacingScale.s300` | 12 |
| Gap between dots | `AsmSpacingScale.s100` | 4 |
| Dot frame | `AsmSpacingScale.s300` | 12 |
| Painted dot | `AsmSpacingScale.s200` | 8 |
| Active fill | `colorScheme.primary` | `#000000` light / `#FFFFFF` dark |
| Inactive fill | `extColors.ghost` | `#000000` at 19% — **identical in both themes** |

### Guidance

- **Never attach a tap handler to `AsmCarouselIndicator` or `AsmDotIndicator` directly.** Neither has one, and adding one from outside produces a target under 48 × 48 with no role or name.
- **Keep `activeIndex` and the visible page driven from a single source.** The component observes nothing.
- **Do not put the indicator in a `SizedBox` with a fixed height.** 36 is a minimum by design.
- **Do not use `AsmDotIndicator` for anything that is not carousel position** — not for a status dot ([[Status Indicators]]), not for an unread marker, not for a list bullet. It is a positional glyph with no semantics.
- **Cap the item count at five** in your own layout; the component will happily render fifty.
- **Localise through the string table.** "Page N of M" and "Go to page N" already exist there; do not hand-build either string.
- **Test in dark mode.** The inactive dot computes to 1.11 : 1 against the surface, so a defect here is invisible in light mode and obvious in dark.

---

## Rules

1. `AsmCarouselIndicator` MUST be treated as decorative. It is NEVER navigation.
2. A tap handler MUST NEVER be attached to `AsmCarouselIndicator` or `AsmDotIndicator` from outside.
3. If a dot is made tappable, it MUST become a control in full: 48 × 48 per [[Icons]], focusable, named, with a selected state and a visible focus ring per [[States]].
4. Every carousel MUST provide a keyboard-reachable route to every item. Neither the dots nor the swipe provides one.
5. The dots MUST NEVER be the only signal that more items exist. The inactive dot computes to 1.11 : 1 in dark mode.
6. A carousel MUST NEVER autoplay.
7. A carousel MUST hold five items or fewer. Beyond that, use a list.
8. Content users need to compare, scan, or search MUST NOT be put in a carousel.
9. A stack of alerts MUST use [[Alert Card]], which already resolves deck versus carousel from available width. NEVER build a second one.
10. [[Alert Card]]'s private dot row MUST NOT be copied into new work — it is 12 × 32, below the touch-target floor, and keyboard-unreachable.
11. `count` MUST be positive and `activeIndex` MUST be in range. Both are asserted; do not defend against them by clamping.
12. `activeIndex` and the visible page MUST come from one source of truth. The component observes nothing.
13. `semanticLabel`, if overridden, MUST carry both the position and the total. NEVER replace it with a static string.
14. The announcement MUST NOT claim a count of items the user cannot reach.
15. The indicator MUST NOT be placed in a fixed-height container. 36 is a minimum so it can grow with text scale.
16. `AsmDotIndicator` MUST NOT be used for anything other than carousel position — not a status dot, not an unread marker, not a bullet.

---

## Open Items

1. **There are two carousel-dot implementations and they agree on nothing.** `AsmCarouselIndicator` — public, exported, story-covered — has **zero call sites in the repository.** [[Alert Card]] contains a private reimplementation that ships in the product and differs on dot size (6 vs 8), gap (6 vs 4), active colour (`onSurface` vs `primary`), inactive colour (`onSurface` at 25% vs `ghost`), interactivity (per-dot button vs none), and cursor. One of the two has to become the other. As it stands the documented component describes something the product does not contain.
2. **The "Go to page N" localisation string names an affordance the carousel component does not have.** Its own description in the string table calls it the carousel dot affordance, and it is consumed only by the alert card's private dots. The public component has no per-dot node to attach it to. Either the component gains an interactive mode or that string belongs to the alert card.
3. **The inactive dot colour is theme-invariant and fails contrast in both themes.** `ghost` is a fixed 19% black in the light *and* dark token maps, so the inactive dot computes to 1.56 : 1 in light and **1.11 : 1** in dark against the card surface — darker than the surface it sits on. Below the 3 : 1 floor in WCAG 1.4.11 in both cases, and functionally invisible in dark mode. The token needs a dark-mode value, or the component needs to stop using it.
4. **The `ghost` token's own documentation states the wrong value.** `AsmDotIndicator` describes the inactive fill as 12% black. The token is `0x30000000` — **19%**. A reader computing contrast from the documented value gets a different (and still failing) answer than the shipped one.
5. **Neither implementation is keyboard reachable, and only one of the two admits it.** [[Alert Card]] records the gap in its own open items. `carousel_indicator.dart` states that the component is not focusable as a design decision without noting that the carousel it is named for therefore has no keyboard navigation at all.
6. **The alert card's tap cell is 12 × 32.** That is under the 48 × 48 floor that [[Icons]] and every other doc in this folder enforce, on the only interactive dots that ship. Already recorded in [[Alert Card]]; repeated here because a reader arriving at this doc to build a carousel will otherwise copy it.
7. **The `showPagination` parameter on [[Alert Card]] is dead** — declared, documented, stored, never read. Dot pagination renders unconditionally on the compact layout and never on the vertical deck. So the only carousel in the system has no way to turn its indicator off, and a call site that tries gets a silent no-op. Recorded as [[Alert Card]] open item 1.
8. **No carousel component exists, and nothing records that as a decision.** The paging behaviour — the drag threshold, the one-page-per-flick rule, the strip-width travel, the transition — is written once, privately, inside a component about alerts. A second consumer would have to reimplement all of it. There is no ticket, no `TODO`, and no note in the checklist explaining whether a general carousel is intended.
9. **No high-contrast branch.** The dots are pure colour with no shape, size, or fill difference between active and inactive, so a forced-colours theme that flattens `primary` and `ghost` toward each other removes the only distinction the component has. Same defect class as [[Status Indicators]] open item 9.
10. **The 36pt container height is a raw literal, not a token.** It is the Figma frame height, and 36 exists on the spacing scale as `s900`, so the value could be tokenised. The horizontal inset, the gap, the frame, and the glyph all correctly read from the scale; only the height does not.
11. **`AsmCarouselIndicator` has no `automationIdentifier`.** Neither does `AsmDotIndicator`. An automated test cannot assert which page a carousel is on except by reading the accessibility label, which couples the test to localisation.
12. **The component holds no state and observes no controller**, so keeping `activeIndex` in sync is entirely manual and nothing detects when it drifts. A carousel showing page 3 with dot 1 highlighted is a silent, undetectable bug. A variant that accepts a `PageController` would make the class of bug impossible.
13. **No maximum count.** The component renders any `count` at 16pt each with no wrapping or collapse, so a large set silently overflows its parent. The five-item guidance in this doc is a design rule with nothing enforcing it — not an assert, not a debug warning.
14. **`AsmDotIndicator` is a public export with no non-carousel use case and no guard against one.** It is a generic 12pt circle with an `active` flag, which is exactly what someone building a status dot or an unread marker will find first. [[Status Indicators]] owns those, and nothing in either doc's code points the reader away.
