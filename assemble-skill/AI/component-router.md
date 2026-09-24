# Component Router

> Role: The global entry point to routing. Gets you from "what the user needs" to a candidate
> component, so you can run that component's own `## Decision Tree`.
> Rule: This file is a **lookup, not a decision.** It never terminates a routing question — it
> hands you a candidate whose tree you then run from the top.
> Scope: **Target-independent.** Routing is Layer A design law: it is the same question and the same
> answer for a Flutter product, a React prototype, a Figma frame, or a spec. Nothing here changes
> because of what you're writing to.
> Source: aggregated from the 34 component decision trees. Where this file and a component doc
> disagree, the component doc wins.

---

## How to use this

1. Find your job in §1 or §2.
2. Open the candidate's doc and run its `## Decision Tree` **from the first branch**.
3. If it routes you elsewhere, go there and start over — don't carry variant reasoning across.
4. Stop when a tree terminates on itself. Then read §3 for the pairs that get confused.

Two hops is normal. Three means the job statement was fuzzy — go back to phase 1 of
[`reasoning-engine.md`](reasoning-engine.md).

**Route before you pick a binding, and route the same way whichever one you picked.** A modal that
should have been a snackbar in Flutter should have been a snackbar in React too. "It's only a
prototype" is not a reason to skip a tree — a prototype that routed wrong gets approved and then
built.

One caveat, and it belongs here rather than in the tables: this file tells you which component the
*system* has. It does not tell you whether the **React** library actually ships it. Coverage there is
unverified — route first, then check the source. See [`react-binding.md`](react-binding.md) §6.

---

## 1. The six discriminators that settle most routing

Nearly every routing question in Assemble is one of these six. Answer the question, not the
component.

### D1 — Act or navigate?

```
Does activating this DO something, or GO somewhere?
├── GO somewhere ──────────────→ a link (NOT a Button). Announced differently, expected differently.
└── DO something
    ├── records an opinion about content on screen ──→ Feedback
    ├── icon-only, no visible text ──────────────────→ an icon-only control (AsmIconButton)
    ├── sets an ongoing state, immediately ──────────→ Switch
    ├── sets a value for later submit ───────────────→ Checkbox / Radio
    ├── removes an active filter ────────────────────→ Tags, filter variant
    └── otherwise ───────────────────────────────────→ Button
```

`Button` has no navigation role at all, and `Tags` bodies are never pressable. "Run scan" is a
button even though scanning has an on/off state — the user is starting a thing, not setting one.

### D2 — Commit now, or on submit?

```
Does the change take effect the moment it's made?
├── Yes, immediately
│   ├── destructive / hard to reverse ──→ NOT a switch. Button + confirming Modal.
│   │                                     A switch has no cancel.
│   ├── really choosing between views ──→ Tabs
│   ├── an action, not a state ─────────→ Button
│   └── otherwise ──────────────────────→ Switch
└── No, it waits for submit
    ├── exactly one from a set ─────────→ Radio        (2–5 visible; >5 → Menu)
    ├── zero or more, independent ──────→ Checkbox
    └── one yes/no gate (terms, opt-in) ─→ Checkbox, single
```

This is the boundary crossed most often. Ask only: *does anything happen when the user clicks it?*

### D3 — Persist, expire, or block?

```
├── Blocks everything until answered ────────→ Modal        (one decision, heading + a sentence)
│   └── multi-step / a form / a long list ───→ Sheets
├── Persists until the condition clears
│   ├── page- or region-level, short ────────→ Alert Banner
│   ├── needs >1 sentence or >1 action ──────→ Alert Card
│   ├── about one specific field ────────────→ the field's own error (Text Fields)
│   └── the state of one thing ──────────────→ Status Indicators
├── Expires on its own, nothing depends on
│   the user seeing it ──────────────────────→ Snackbar
└── Revealed only on hover/focus
    ├── one short read-only string ──────────→ Tooltip
    ├── a name for an icon-only rail item ───→ Peek Label
    └── contains anything focusable ─────────→ Popover
```

**The question that invalidates most snackbars:** *would the user be stuck if they missed it?*
If yes, it is an `Alert Banner`. Every snackbar misuse in the wild is a failure to ask this.

**The question that invalidates most modals:** *must the user respond before anything else can
happen?* The answer is usually no.

### D4 — Waiting: fraction, layout, or neither?

```
Is the wait under ~300ms? ──→ show NOTHING. A flash reads as a glitch.

Do you know the PROGRESS FRACTION?
├── Yes
│   ├── branded, owns the screen or card ──→ Loaders — brand loader
│   ├── a gauge or meter inside a layout ──→ Progress Bar
│   └── it's a measurement split 2–5 ways ─→ the charts (see D5)
└── No
    ├── an AI / agent action in flight ────→ Loaders — AI loader
    ├── you know the LAYOUT arriving ──────→ Skeleton Loader   (reserves the space)
    ├── content already on screen,
    │   being refreshed ───────────────────→ leave the stale content
    ├── the result may be EMPTY ───────────→ skeleton while loading, then Empty State
    └── otherwise ─────────────────────────→ Loaders — spinner
                                             (inline → bar; owns the screen → halfTrack)
```

Never fake a fraction to get a bar. A toggle awaiting a round trip uses `Switch`'s own loading
state, not a loader.

### D5 — Does the empty part mean "not yet"?

The single most consequential visual ambiguity in the system.

```
Does the unfilled part of the shape mean "not done yet"?
├── Yes → Progress Bar          (it has a TRACK; the remainder means incomplete)
└── No — the whole is divided among its parts   (NO track; bands always fill)
    ├── only one part ───────────────→ NOT a chart. Reads as completed progress.
    ├── all values zero ─────────────→ Empty State
    ├── still loading ───────────────→ Skeleton Loader
    ├── per-part values on demand ───→ NOT a chart. Nothing here is interactive. Use a table.
    ├── more than 4 (arc) / 5 (linear) parts ──→ a table. The ramp cycles; the legend breaks.
    ├── the TOTAL is the headline ───→ Data Arc Chart    (it has a centre to print it in)
    └── only the SPLIT matters ──────→ Data Linear Chart (no total slot)
```

`Progress Bar` and `Data Linear Chart` are the same shape. `Data Arc Chart` is not a circular
progress indicator. A user cannot tell them apart by looking — the docs are emphatic that you
must never substitute one for the other.

### D6 — Small chip: count, severity, condition, or category?

```
├── A COUNT of things wanting attention ────→ Status Indicators — notification badge
│   └── the count is zero ──────────────────→ nothing. No badge.
│   └── the count is loading ───────────────→ badge, loader form
├── A SEVERITY, in a word ("CRITICAL RISK") → Badges
│   └── type is decided by the SURFACE behind it, never by emphasis
├── A metric as a chip ("0042 COUNT") ──────→ Badges, stat status
├── A live CONDITION (online, protected) ───→ Status Indicators — status label (dot + word)
│   └── no room for a word, condition named
│       in adjacent text ───────────────────→ bare dot
│   └── no room and nothing names it ───────→ find room. Not a bare dot.
├── A CATEGORY, name, or attribute ─────────→ Tags, standard
├── A removable filter ─────────────────────→ Tags, filter (only the × is pressable)
└── Something the user presses ─────────────→ Button
```

Three different things are called "badge" — see [`glossary.md`](glossary.md).

---

## 2. Job → candidate

Alphabetical by job. Every entry is a *candidate*; run its tree.

| The job | Candidate | Route away if… |
| --- | --- | --- |
| Announce something succeeded | `Snackbar` | the user would be stuck missing it → `Alert Banner` |
| Ask "was this helpful?" | `Feedback` | there's a middle option or >2 answers → `Radio`; you need *why* → `Modal`/`Sheets` follow-up |
| Blocking decision | `Modal` | multi-step, a form, or a long list → `Sheets` |
| Break up a long scrolling column | `Tabs` / `Accordion` / pagination | genuinely can't be divided → `Scrollbar` |
| Card that expands | `Expanded Card` | several in a stack the user reads → `Accordion`; nothing to reveal → `Cards` |
| Choose a date | `Date Picker` | a few *named* dates ("today/tomorrow") → `Radio` or `Menu` |
| Choose from many values | `Menu` | 2–5 and they must be compared → `Radio`/`Checkbox`; top-level views → `Tabs` |
| Confirm a destructive action | `Modal` | — never a `Menu` row; a menu can't state the consequence |
| Dot row under a paged set | `Carousel` (indicator only) | >5 items, autoplay, or users must compare → a list |
| Empty region | `Empty State` | still loading → `Skeleton Loader`; the request failed → `Alert Banner`/`Modal` |
| Explain an icon | `Tooltip` | it's a rail destination's name → `Peek Label`; it has a link inside → `Popover` |
| Field error | `Text Fields` error state | it's about the whole page → `Alert Banner` |
| Free-text input | `Text Fields` | the system can enumerate the answers → `Switch`/`Checkbox`/`Radio`/`Menu`; it's a date → `Date Picker` |
| Group related content | `Cards` | the shape is already named (alert, row, disclosure, floating, strip) → the named component |
| Homepage security risk | `Alert Card` | transient → `Snackbar`; page-level → `Alert Banner`; blocking → `Modal` |
| Label a piece of content | `Tags` | it's a live condition → `Status Indicators`; a severity → `Badges`; a count → notification badge |
| Layered detail on an anchor | `Popover` | nothing focusable inside → `Tooltip`; a list of choices → `Menu`; expanding in place works → `Accordion` |
| Message in a conversation | `Chat Bubble` | it's a system notice → `Alert Banner`/`Snackbar`/`Status Indicators` |
| Move between top-level pages | `Navigation Rail` | it swaps a region of one page → `Tabs`; it's the page title/actions → **a topbar (no doc)** |
| Name a collapsed rail item | `Peek Label` | it explains rather than names → `Tooltip` |
| One-at-a-time paged set | `Carousel` | it's a stack of alerts → `Alert Card` (already resolves deck vs carousel from width) |
| Primary action | `Button` | it navigates → a link; icon-only → `AsmIconButton` |
| Progressive disclosure, several sections | `Accordion` | exactly one section → a show/hide toggle, or `Expanded Card` |
| Scrolling indicator | `Scrollbar` | it's a floating surface → never scroll; content could be divided → `Tabs`/`Accordion` |
| Secondary flow beside the main UI | `Sheets` — side | the main UI needn't stay usable → `Modal` or a screen |
| Secondary task on a narrow window | `Sheets` — bottom | it needs >1 minute or internal navigation → a real screen |
| Separate two blocks | `Divider` | more space would do → `Spacing`; the second needs a name → a heading; one is a distinct surface → a container |
| Show a fraction | `Progress Bar` | you don't know it → `Loaders`; it's a composition → the charts |
| Show a split / composition | `Data Arc Chart` / `Data Linear Chart` | the remainder means "not yet" → `Progress Bar`; >4–5 parts → a table |
| Switch between views of one subject | `Tabs` | it changes the page or subject → `Navigation Rail`/topbar; multi-select → filter `Tags`/multi-select `Menu`; set is long or unknown → `Menu` |
| Toggle a setting | `Switch` (immediate) / `Checkbox` (on submit) | destructive → `Button` + `Modal` |
| Waiting, layout known | `Skeleton Loader` | layout unknown → `Loaders` |

---

## 3. The confusion pairs

Each pair is documented in **both** docs, because each is read on its own. The discriminator is
the only thing that matters.

| Pair | The only question |
| --- | --- |
| `Checkbox` ↔ `Switch` | Does anything happen when clicked, or does it wait for Save? |
| `Checkbox` ↔ `Radio` | Zero-or-more, or exactly one? |
| `Radio` ↔ `Tabs` | Choosing a *value* to submit, or switching which *content* is visible? |
| `Radio` ↔ `Menu` | Must the options be compared (show all), or just located (hide them)? |
| `Snackbar` ↔ `Alert Banner` | Would the user be stuck if they missed it? |
| `Alert Banner` ↔ `Alert Card` | One sentence and one action, or more? |
| `Alert Card` ↔ `Cards` | Is it a homepage security risk/update/opportunity, or a novel grouping? |
| `Modal` ↔ `Sheets` | One decision, or a task with room? |
| `Modal` ↔ everything | Must the user respond before anything else can happen? |
| `Sheets` (side ↔ bottom) | Must the main UI stay visible **and usable**? Not screen size, not length. |
| `Tooltip` ↔ `Popover` | Is anything inside it focusable? |
| `Tooltip` ↔ `Peek Label` | A *name*, or something *about* the thing? |
| `Popover` ↔ `Menu` | Rich content, or a list of rows? |
| `Popover` ↔ `Accordion` | Would expanding in place work? (The question nobody asks.) |
| `Loaders` ↔ `Skeleton Loader` | Do you know the layout arriving? |
| `Loaders` ↔ `Progress Bar` | Do you know the fraction? And: branded moment owning the screen, or a gauge in a layout? |
| `Progress Bar` ↔ the charts | Does the unfilled part mean "not yet"? (Is there a **track**?) |
| `Data Arc` ↔ `Data Linear` | Does the total matter as a headline number? |
| `Skeleton Loader` ↔ `Empty State` | "Not yet", or "none"? |
| `Badges` ↔ `Status Indicators` | A severity in a word, or a count / a live condition? |
| `Badges` ↔ `Tags` | How urgent it is, or what kind it is? |
| `Tags` ↔ `Status Indicators` | An attribute the user might filter by, or a condition that changes on its own? |
| `Accordion` ↔ `Tabs` | Supporting detail that grows the page, or peer views at fixed height? |
| `Accordion` ↔ `Expanded Card` | A list of sections, or a single card with a summary worth reading closed? |
| `Tabs` ↔ `Navigation Rail` | Does it swap a region, or change the page/subject? |
| `Button` ↔ a link | Act, or navigate? |
| `Button` ↔ `Switch` | A one-time action, or an ongoing state? |
| `Button` ↔ `Feedback` | Performs something, or records an opinion? |
| `Divider` ↔ `Spacing` | Would more space make it clear? |
| `Divider` ↔ a container | Is one side a distinct thing with its own padding and affordances? |
| `Carousel` ↔ a list | Must the user compare, scan, or find? |
| `Scrollbar` ↔ dividing the content | Could it be tabs, sections, or pages instead? |
| `Text Fields` ↔ `Date Picker` | Is the answer an arbitrary date, or one of a few named ones? |
| `Cards` ↔ its six children | Is the content's shape already named by the system? |

---

## 4. Routes that leave the library

Correct, common terminations. Reaching one is a good outcome, not a dead end.

| Termination | From | Because |
| --- | --- | --- |
| **Show the content** | `Accordion` | It's needed to complete the task. An accordion is for secondary detail, not for shortening a page. |
| **Nothing at all** | `Loaders`, `Skeleton Loader` | Wait under ~300ms. A flash reads as a glitch. |
| **No badge** | `Status Indicators`, `Badges` | The count is zero. |
| **No shadow** | `Elevation` | The most common correct answer. Colour, spacing, or a border already separates it. |
| **No divider** | `Divider` | Spacing or a heading is the real answer. |
| **A link** | `Button` | It navigates. Announced differently, expected differently. |
| **A list** | `Carousel`, `Menu` | The user must compare, scan, or find. |
| **A table** | both charts | More than 4–5 parts, or per-part values needed on demand. |
| **Pagination** | `Scrollbar` | The content divides into numbered pages. |
| **A real screen** | `Sheets` | >1 minute, or internal navigation. A sheet has no URL and no back stack. |
| **Plain text** | `Radio`, `Chat Bubble` | One option isn't a choice. Ordinary copy isn't a message. |
| **Cut the content** | `Scrollbar` | A scrollbar inside a `Popover` or `Tooltip` means the content was too long for the shape. |
| **Fix the layout** | `Button` | `xsmall` exists for genuinely tight contexts, not to rescue a crowded layout. |
| **Find room** | `Status Indicators` | A dot whose meaning appears nowhere is decoration that looks like information. |
| **A survey elsewhere** | `Feedback` | It's about the product, not this content — don't launch it mid-task. |
| **Build the affordance yourself** | `Carousel` | Dots are decorative. If users must jump to an item, you own that control and every obligation it carries. |

---

## 5. Undocumented destinations

Four decision trees route to components that have no doc. When you land here, say so.

| Routed to | Routed from | Status |
| --- | --- | --- |
| **a topbar** | `Navigation Rail` (page title and page-level actions; the SM menu affordance that opens the overlay drawer) · `Tabs` | **No doc.** `Breakpoints` requires the SM menu affordance and no component owns it. Second-highest-priority gap. |
| **guided action panel** | `Alert Card` (docks right, linked) · `Peek Label` (the surface `inverse` is designed against; its collapsed handle) · `Cards` (built on it) | **No doc.** Highest-priority gap — three finished docs route to it. Named "Guided Journey panel" in the draft; the two names need reconciling (`Alert Card` open item 23). |
| **a list feature row / list feature card** | `Cards` · `Expanded Card` | **No doc** (`lists`). |
| **an icon-only control** | `Button` | Documented in `Foundations/Icons.md` as `AsmIconButton`, not as a component doc. |

Also undocumented, not currently routed to: `brand`, `feature banner`, `quick action`,
`toggle groups`.

---

## 6. Components that are not what their name suggests

| Doc | The catch |
| --- | --- |
| `Carousel` | **There is no carousel component.** Only `AsmCarouselIndicator` / `AsmDotIndicator`. The one working carousel is private to `Alert Card` and does not use that indicator. |
| `Popover` | **No implementation ships.** The nearest shipped placement logic is the private popup inside `menu.dart`. Do not write `AsmPopover`. |
| `Badges` | The severity chip only. The notification badge and the status label are in `Status Indicators`. |
| `Cards` | A substrate with no title, no interaction, no state, and no meaning. Six components are built on it. |
| `Navigation Rail` | Covers two Dart families — `AsmNavigationRail` (MD and up) and `AsmNavDrawer` (the SM form). There is deliberately no separate "nav drawer" doc. `AsmNavigationRail.bottom` ships and is **forbidden**. |
| `Sheets` | Both bottom and side sheets. |
| `Text Fields` | Both `AsmTextField` and `AsmTextFormField`. |
| `Status Indicators` | Both the indicator/label and the notification badge. |
| `Date Picker` | A *family* — a typed field, a month grid, and month/year lists. The field must always be available. |
| `Loaders` | Three unrelated forms — indeterminate spinner, AI "thinking" row, determinate branded shield. |
| `Tabs` | Design gives the selected tab three signals; the shipped component delivers two. Never remove another. |
