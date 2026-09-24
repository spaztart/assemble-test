All 34 docs below are written. The list has 36 entries because two pairs name one component each: `tags` / `tag` are both covered by [[Tags]], and `carousel` / `carousel-indicator` are both covered by [[Carousel]] — per the one-doc-per-concept rule in `_component-doc-template.md`.

## DONE

- [x] button → [[Button]]
- [x] accordion → [[Accordion]]
- [x] alert banner → [[Alert Banner]]
- [x] alert card → [[Alert Card]] (`AsmAlertCard` + `AsmAlertCardTab`)
- [x] badges → [[Badges]] (`AsmBadge` — the severity chip, **not** the notification badge)
- [x] cards → [[Cards]] (`AsmCard` — the general-purpose surface six other components are built on)
- [x] carousel / carousel-indicator → [[Carousel]] (`AsmCarouselIndicator` + `AsmDotIndicator`; **there is no carousel component**, only the dot indicator)
- [x] chat bubble → [[Chat Bubble]]
- [x] checkbox → [[Checkbox]]
- [x] data arc chart → [[Data Arc Chart]] (`AsmArcChart`)
- [x] data linear chart → [[Data Linear Chart]] (`AsmLinearChart`)
- [x] divider → [[Divider]]
- [x] date picker → [[Date Picker]]
- [x] empty → [[Empty State]]
- [x] expanded card → [[Expanded Card]] (`AsmExpandedCard`)
- [x] feedback → [[Feedback]]
- [x] loaders → [[Loaders]]
- [x] menu → [[Menu]]
- [x] modal → [[Modal]]
- [x] navigation rail → [[Navigation Rail]] (`AsmNavigationRail` + `AsmNavigationRailItem`, plus `AsmNavDrawer` / `AsmNavSection` / `AsmNavListItem` as the rail's SM form)
- [x] peek label → [[Peek Label]] (`AsmPeekLabel`)
- [x] popover → [[Popover]]
- [x] progress bar → [[Progress Bar]]
- [x] radio → [[Radio]]
- [x] scroll → [[Scrollbar]]
- [x] sheets → [[Sheets]] (bottom + side)
- [x] snackbar → [[Snackbar]]
- [x] skeleton loader → [[Skeleton Loader]]
- [x] status indicators → [[Status Indicators]] (indicator + notification)
- [x] switch → [[Switch]]
- [x] tabs → [[Tabs]]
- [x] tags / tag → [[Tags]]
- [x] text fields → [[Text Fields]] (`AsmTextField` + `AsmTextFormField`)
- [x] tooltip → [[Tooltip]]

## NOT INCLUDED YET

brand
feature banner
**guided action panel** ← docks to the right of [[Alert Card]] on the homepage and is linked to it; also the surface [[Peek Label]]'s `inverse` tone is designed against, and the collapsed-handle case its chip exists for. The draft calls it the "Guided Journey panel"; the two names need reconciling ([[Alert Card]] open item 23). Built on [[Cards]]. The highest-priority next doc — three finished docs now route to a component that has none.
lists
quick action
toggle groups
**topbars** ← now the second-highest priority. [[Navigation Rail]] routes to a topbar twice: once in its decision tree (page title and page-level actions are not the rail's job) and once for the SM menu affordance that opens the overlay drawer, which [[Breakpoints]] requires and no component owns.

## Notes from the consistency pass

- **Touch target is 48×48 system-wide.** [[Icons]] and [[States]] previously said 44×44 and have been corrected. Every component doc uses 48.
- **`Open Items` are numbered lists in all 34 docs**, so an item can be cited as e.g. "[[Text Fields]] open item 24".
- **Three components are called "badge"** and the docs must keep them apart: the severity chip is [[Badges]] (`AsmBadge`), while the numeric notification badge and the dot-plus-word status label both live in [[Status Indicators]]. Any new doc using the word "badge" has to say which one it means.
- **No doc mentions HTML, CSS, React, or any web platform concept.** Where Figma's export format needed describing, it is named as Figma's style export rather than as CSS.
- **All wikilinks across the folder resolve** to notes that exist in the vault.
- **Required cross-link pairs are reciprocal** — Checkbox↔Radio↔Switch, Loaders↔Skeleton Loader↔Progress Bar, Snackbar↔Alert Banner↔Alert Card, Modal↔Sheets↔Popover, Tooltip↔Popover, Badges↔Status Indicators↔Tags, Badges↔Alert Card, Cards↔Alert Card↔Expanded Card, Cards↔Popover, Accordion↔Expanded Card, Carousel↔Alert Card, Peek Label↔Tooltip↔Popover, Data Arc Chart↔Data Linear Chart, both charts↔Progress Bar↔Empty State, Navigation Rail↔Peek Label↔Menu, Navigation Rail↔Tabs, Navigation Rail↔Alert Card, Navigation Rail↔Status Indicators.
- **[[Cards]] is the base of six other components** — [[Alert Card]], [[Popover]], [[Expanded Card]], the feature banner, the guided action panel, and the list feature card. Any doc for one of those must route *down* to [[Cards]] for the surface and not restate its variants or overrides.
- **The two chart docs share nine open items verbatim** ([[Data Arc Chart]] items 1–8 and 14 against [[Data Linear Chart]] items 1, 3, 5–9 and 16). They are duplicated deliberately: each chart is read on its own, and the divergence between them is the finding. If one is fixed, both entries must be updated.
- **[[Navigation Rail]] is the only component doc whose placement rule is absolute** — left edge, every tier, no exception — and the only one that documents a shipped constructor as forbidden. `AsmNavigationRail.bottom` positions the rail along the bottom edge, which contradicts both the rule and [[Breakpoints]]' SM treatment (a left overlay drawer over a scrim). Anything that reads like "the mobile nav bar" must route to [[Navigation Rail]] open item 1 rather than to that constructor.
- **[[Navigation Rail]] covers two Dart component families**, per the one-doc-per-concept rule: `AsmNavigationRail` (MD and up) and `AsmNavDrawer` (the SM form [[Breakpoints]] defines). There is deliberately no separate "nav drawer" entry — the drawer is the rail at a smaller tier, not a different component.
- **The missing-motion-token gap is now visible in at least five components** — [[Accordion]] (open item 8), both charts, and [[Navigation Rail]] (open item 24). It should be promoted to a Foundations gap rather than restated per component the next time a doc needs it.
- **Every doc ends `Flutter Usage` → `Rules` → `Open Items`**, and no `dart` snippet appears before the `Flutter Usage` section.
