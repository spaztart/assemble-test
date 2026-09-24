# Adapter — Claude Code

> Role: Install and run the Assemble skill in Claude Code.
> Target: Claude Code CLI, desktop app, web app, and IDE extensions.
> Status: **Native.** Claude Code reads `SKILL.md` frontmatter directly and loads the rest on
> demand. No adaptation needed for the skill itself — but the **repo** still decides which binding
> you're writing to: Flutter (production) or React (prototyping). See
> [`../react-binding.md`](../react-binding.md) if it's the latter.

---

## Install

Claude Code discovers skills in `.claude/skills/<name>/SKILL.md` (project) or
`~/.claude/skills/<name>/SKILL.md` (personal). The skill folder is the whole `AI/` directory.

**Option A — symlink (recommended; the vault stays the single source).**

```bash
# personal, available in every project
mkdir -p ~/.claude/skills
ln -s "$HOME/Documents/ob-vault/McAfee/Skill DS/AI" \
      ~/.claude/skills/assemble-design-system

# or per-project
mkdir -p .claude/skills
ln -s "$HOME/Documents/ob-vault/McAfee/Skill DS/AI" \
      .claude/skills/assemble-design-system
```

The `SKILL.md` links use relative paths (`../Components/…`) to reach the docs, so the symlink must
point at `AI/` inside the vault — not at a copy.

**Option B — copy into the Flutter repo**, if the design docs should be versioned with the code:

```bash
mkdir -p .claude/skills/assemble-design-system
cp -R "$HOME/Documents/ob-vault/McAfee/Skill DS/AI/." \
      .claude/skills/assemble-design-system/
cp -R "$HOME/Documents/ob-vault/McAfee/Skill DS/Components" \
      "$HOME/Documents/ob-vault/McAfee/Skill DS/Foundations" \
      .claude/skills/assemble-design-system/../
```

A copy drifts. If you take Option B, re-sync when the vault changes.

Verify with `/skills` (or ask "what skills do you have?"). The skill should appear as
`assemble-design-system`.

---

## How it triggers

The `description:` field in `SKILL.md` frontmatter is what Claude matches against. It fires on
Assemble / ASM / `Asm*` / Pegasus / McAfee UI, on component names (`alert card`, `navigation rail`,
`peek label`, `guided action panel`), on token namespaces (`md.sys.color`, `md.spacing`,
`AsmTokens`), and on questions of the form *"which component should I use"* / *"is this on-system"*.

You can also invoke it explicitly: `/assemble-design-system`.

If it isn't firing when it should, the fix is the `description:` field — add the phrasing you
actually use.

---

## Progressive disclosure — the point of the design

Claude Code loads `SKILL.md` and nothing else until it needs more. The load table in `SKILL.md` §1
is the routing:

```
SKILL.md                     always
  → component-router.md      "which component?"
  → <component>.md IN FULL   building or reviewing one
  → token-contract.md        any value
  → ../Foundations/<x>.md    when the contract isn't enough
  → decision-priority.md     two sources disagree
  → platform-adapters.md     target isn't Flutter          (mandatory)
  → react-binding.md         React, or a Figma Make        (mandatory)
                             prototype
  → validation.md            before returning anything     (mandatory)
```

`react-binding.md` is the **only** written record of the React binding — no component doc mentions it.
Load it before writing a `.tsx` file, not after.

**Read component docs in full.** These docs are long because the traps are in the middle. Grepping
for a variant name and stopping is the most reliable way to get this system wrong.

---

## Recommended `CLAUDE.md` addition

In a Flutter repo using Assemble, add this to `CLAUDE.md` so the hard constraints are always in
context rather than fetched on demand:

```markdown
## Design system

This project uses **Assemble** (McAfee). Use the `assemble-design-system` skill for any UI work.

Non-negotiable, on every change:
- No raw values. No hex, no raw font metrics, no hardcoded padding/radius/border, no
  hand-authored BoxShadow. Reference a token.
- Semantic layer only: `md.sys.color.*`, `mcafee.color.extended.*`. Never `md.key.*` or
  `md.ref.*`.
- Pass `variant` and `size` to `AsmButton` explicitly — its defaults contradict the guidance.
- `automationIdentifier` is required and asserted non-empty.
- Disable by passing `null` to the handler. Never `Opacity`/`IgnorePointer`/`AbsorbPointer`.
- Layout branches on `LayoutBuilder`/`constraints.maxWidth`, never `MediaQuery.size.width`.
- Never wrap an `Asm*` widget in `Semantics` or `GestureDetector`.
- 48×48 minimum touch target, via padding. Visible keyboard-only focus ring, 2px, 2px offset.
- Never state a value you have not read in the design-system docs.
```

In a **React prototyping repo** using the Assemble React library, the constraints are the same design
law with a different binding — and the verification burden is higher, because nothing documents the
React API:

```markdown
## Design system

This project uses **Assemble** (McAfee) via its **React library — the prototyping binding**.
Use the `assemble-design-system` skill for any UI work, and read `react-binding.md` first.

Non-negotiable, on every change:
- No raw values. No hex, `rgb()`, named CSS colour, raw `px`/`rem`, hand-written `box-shadow`,
  or composite type token split into separate declarations. Reference a token.
- Tokens come from the **web build** of the shared token source. Semantic layer only — never
  `md.key.*` or `md.ref.*`. A token missing from the web build is a gap to report, never
  licence to inline the value.
- **Verify component names, prop names, and which variants/sizes exist from the React source.**
  Parity with Flutter is not guaranteed. Deriving a React name from a Flutter one is a blocker.
- Never write `Asm*` in a `.tsx` file — those names belong to the Flutter library.
- Pass props explicitly. React's defaults are distrusted and undocumented.
- Layout decides from the **content region**, never the viewport. No viewport `@media` query for
  a layout decision; if you can only query the viewport, say the layout breaks with a side panel open.
- 48×48 minimum touch target, via padding. Visible keyboard-only focus ring, 2px, 2px offset.
  Never `outline: none`.
- Never port this to Flutter, and never cite a React prop as evidence about the design system.
- Never state a value you have not read in the design-system docs.
```

---

## Optional — a pre-commit token sweep

The regex block in [`../validation.md`](../validation.md) §G1 runs as a shell check. A minimal
version:

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit — Assemble token sweep (Flutter)
set -uo pipefail
files=$(git diff --cached --name-only --diff-filter=ACM -- '*.dart')
[ -z "$files" ] && exit 0

fail=0
check() {  # check <label> <pattern>
  hits=$(git diff --cached -U0 -- $files | grep -nE "^\+.*$2" || true)
  if [ -n "$hits" ]; then
    printf '\n[assemble] %s\n%s\n' "$1" "$hits"
    fail=1
  fi
}

check "raw colour literal"        'Color\(0x|#[0-9A-Fa-f]{6}\b'
check "authoring-layer token"     'md\.(key|ref)\.|md\.type\.size\.'
check "raw type metric"           'fontSize\s*:|letterSpacing\s*:'
check "hand-authored shadow"      'BoxShadow\(|blurRadius\s*:'
check "numeric elevation"         'elevation\s*:\s*[0-9]'
check "window-width layout"       'MediaQuery\.of\([^)]*\)\.size\.width'
check "fake disabled"             'IgnorePointer\(|AbsorbPointer\('

[ $fail -eq 0 ] || {
  echo
  echo "[assemble] See Skill DS/AI/validation.md §G1. Override with --no-verify if intentional."
  exit 1
}
```

Deliberately narrow — it catches the mechanical violations only. Spacing literals need context
(`EdgeInsets.all(16)` is on-scale but may still be double padding), so they're left to review.

For a **React** repo, swap the file filter to `'*.tsx' '*.jsx' '*.css' '*.scss'` and the patterns to
the web block in [`../validation.md`](../validation.md) §G1 — raw colour literals and named CSS
colours, `md.(key|ref).`, `:\s*-?[0-9.]+(px|rem|em)`, `box-shadow\s*:`, `outline\s*:\s*(none|0)`,
`@media[^{]*\((min|max)-width`. Same principle: catch the mechanical ones, leave the judgement calls
to review.

---

## Working with the Figma MCP server

When the Figma MCP tools are connected, prefer real values over reading them off a rendering:
`get_variable_defs` for tokens, `get_design_context` for structure, `get_code_connect_map` for
existing component mappings.

Three standing cautions:

- **Figma is precedence tier 10.** It loses to the doc body on meaning, and to whichever binding you're
  writing on what to type. See [`../decision-priority.md`](../decision-priority.md) §3.
- **Figma rarely draws focus states.** A missing focus variant is a Figma gap, never permission to
  skip focus.
- **`get_code_connect_map` may point at either binding.** Check which before trusting a mapping, and
  never carry a Flutter mapping into React output.

Translate names in both directions — `Button`'s Figma `default` is Flutter's `small`. There are now
**three** vocabularies (Figma, Flutter, React) and nothing records React's. See
[`../glossary.md`](../glossary.md) §2.

---

## Authoring a new design-system doc

Follow `../../Components/_component-doc-template.md` exactly: the 15-section order, the four-line
banner, the platform-agnostic / `## Flutter Usage` split, and the delegate-to-foundations rule.

The non-skippable step is **reconciliation** — read the Dart source in full, pull the Figma
component set, and record every disagreement in `## Open Items` as a numbered entry. A doc that
describes only the implementation is a code comment; a doc that describes only Figma is a redlines
file. The value is in the reconciliation.

Keep cross-links reciprocal. `../../Components/checklist.md` tracks the pairs.

One caveat about the template: its rule *"Never mention web, HTML, CSS, React, or web components. This
system targets Flutter only"* was written when Flutter was the only binding, and is now the reason a
real sanctioned implementation has no home in the docs. Follow it as written for now — but see
[`../known-gaps.md`](../known-gaps.md) §3.0, which proposes amending it with a `## React Usage`
section. Until that lands, `../react-binding.md` is the whole record.

By the checklist's own priority, the next two docs to write are **guided action panel** and
**topbars** — and the template amendment sits ahead of both.
