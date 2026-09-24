---
layout: ../layouts/MarkdownLayout.astro
title: Claude + Pegasus Kit - Design System
description: Set up Claude Code to build Flutter UIs with McAfee's Pegasus design system
---

# Claude + Pegasus Kit

![Claude + Pegasus Kit cover](/covers/claude-kit.svg)

Configure [Claude Code](https://docs.anthropic.com/en/docs/claude-code) to build Flutter UIs using **only** McAfee's Pegasus design system — no raw Material widgets, no hardcoded colors, no manual styling.

## What it does

The Pegasus Claude Kit drops a set of configuration files into your Flutter project that instruct Claude Code to:

- Use **`McApp`** instead of `MaterialApp`
- Use **`McButton`**, **`McCard`**, **`McTextField`**, **`McScaffold`**, etc. instead of raw Material widgets
- Map all colors to **`context.extendedColors`** or **`Theme.of(context).colorScheme`**
- Map all typography to **`context.typographyTokens`**
- Map all spacing and border radius to **`context.spacingTokens`**
- Map all elevation/shadows to **`context.elevations`**
- **Never hardcode** any visual values

Every line of Flutter UI code Claude generates will be fully on-brand.

## What's included

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project-level instructions Claude reads on startup |
| `.claude/skills/SKILL.md` | Deep component & token reference with every Pegasus API |
| `.claude/settings.local.json` | Pre-configured permissions for `flutter` commands |
| `FIGMA_SETUP.md` | Guide for connecting Figma designs to Claude via MCP |
| `templates/` | Starter `pubspec.yaml` deps, lint rules, and `main.dart` |
| `examples/chat-app/` | Full working example app built with Pegasus |
| `setup.sh` | Automated installation script |


## Prerequisites

Before you begin, make sure you have:

- **Flutter SDK** 3.0+ installed
- **Claude Code** installed (`npm install -g @anthropic-ai/claude-code`)
- Access to the McAfee GitHub org (for `pegasus_flutter` and `mc_flutter_tokens`)


## Installation

### Option A — Automated setup (recommended)

If you have the Assemble repo cloned, run the setup script from your Flutter project directory:

```bash
# From your Flutter project root:
/path/to/assemble/claude-ds/setup.sh
```

Or pass your project path as an argument:

```bash
/path/to/assemble/claude-ds/setup.sh /path/to/your/flutter/project
```

The script will:
1. Copy `CLAUDE.md` to your project root
2. Copy the `.claude/` directory (skills + permissions)
3. Copy `FIGMA_SETUP.md` for optional Figma integration
4. Check your `pubspec.yaml` for Pegasus dependencies

### Option B — Manual setup

**Step 1 — Copy Claude configuration files**

```bash
# From your Flutter project root:
cp /path/to/assemble/claude-ds/CLAUDE.md ./CLAUDE.md
cp -r /path/to/assemble/claude-ds/.claude ./.claude
cp /path/to/assemble/claude-ds/FIGMA_SETUP.md ./FIGMA_SETUP.md
```

**Step 2 — Add Pegasus dependencies to `pubspec.yaml`**

```yaml
dependencies:
  flutter:
    sdk: flutter
  pegasus_flutter:
    git:
      url: https://github.com/mcafee-eng/pegasus-flutter.git
      ref: v0.8.1
  mc_flutter_tokens:
    git:
      url: https://github.com/mcafee-eng/mc_flutter_tokens.git
      ref: v0.4.2
```

**Step 3 — Install packages**

```bash
flutter pub get
```

**Step 4 — Start Claude Code**

```bash
claude
```

Claude will now follow the Pegasus design system for every UI request.


## Verify it's working

Open Claude Code in your project and ask it to generate a simple screen:

> *"Create a settings screen with a side menu containing Home, Profile, and Notifications"*

The output should:
- ✅ Use `McApp` as the app root
- ✅ Use `McScaffold` and `McAppBar` for layout
- ✅ Use `McSideSheet` for the side menu
- ✅ Use `McSideSheetItem` for navigation items
- ✅ Use `context.typographyTokens` for text styles
- ✅ Use `context.extendedColors` or `colorScheme` for colors
- ❌ No `MaterialApp`, `Scaffold`, `AppBar`, `Drawer`, hardcoded colors, or raw `TextStyle`


## Figma integration (optional)

You can connect Figma to Claude Code so it reads your designs directly and generates Pegasus Flutter code from frames.

**One-time setup:**

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

**Authenticate:** start Claude Code, type `/mcp`, find `figma`, select `Authenticate`, and allow access in the browser.

**Usage:** paste a Figma frame link into Claude Code along with your request:

```
Implement this Figma design as a Flutter screen using only Pegasus components:
https://www.figma.com/design/YOUR_FILE_ID/...?node-id=...
```

See `FIGMA_SETUP.md` (included in the kit) for the full guide, troubleshooting, and rate limit details.


## Prompting guide

Once installed, you can prompt Claude naturally. It handles all component and token selection automatically.

### For developers

> *"Build a home dashboard showing VPN protection status, recent threat chips, and a connect button."*

> *"Create an onboarding screen with a headline, subtext, and a next button."*

> *"Build a form with email and password fields and a sign-in button."*

### For designers & PMs

Describe the screen's purpose and content — Claude handles everything:

> *"Make a settings screen with a side menu containing Home, Profile, and Notifications."*

> *"Build a custom status card with a green background and body text for 'all clear' state."*

### With Figma

```
Convert this Figma frame to Flutter. Rules:
- Components: pegasus_flutter only (McButton, McCard, McChip, McAppBar, McScaffold, etc.)
- Colors: context.extendedColors or colorScheme — no hex values
- Typography: context.typographyTokens — no hardcoded TextStyle
- Spacing: context.spacingTokens — no hardcoded numbers
- Flag any part of the design that has NO Pegasus equivalent

Figma link: [paste link]
```


## Component quick reference

These are the Pegasus components Claude will use. You never need to memorize these — Claude picks the right one automatically.

| Need | Pegasus component |
|---|---|
| App root | `McApp` |
| Screen layout | `McScaffold` |
| Top bar | `McAppBar` |
| Button | `McButton` |
| Card / container | `McCard` |
| Text input | `McTextField` |
| Chip / tag / status | `McChip` |
| Side menu / drawer | `McSideSheet.show()` |
| Nav item | `McSideSheetItem` |
| Badge / count | `McBadge` |
| Status / connection info | `McConnectionDetails` |

## Token quick reference

| Need | Token |
|---|---|
| Brand / semantic colors | `Theme.of(context).colorScheme.*` |
| McAfee brand colors | `context.extendedColors.mcafee` / `.positive` / `.warning` |
| Button colors | `context.buttonColors.*` |
| Gradients | `context.gradientColors.*` |
| Corner radius / spacing | `context.spacingTokens.cornerMedium` |
| Typography / text styles | `context.typographyTokens.bodyMedium` |
| Elevation / shadows | `context.elevations["2"]` |
| Tonal palette | `context.tonalPalettes.brand.tone40` |


## Example app

The kit includes a complete chat UI built entirely with Pegasus. Run it to see the design system in action:

```bash
cd /path/to/assemble/claude-ds/examples/chat-app
flutter pub get
flutter run
```

This example demonstrates `McApp`, `McScaffold`, `McAppBar`, `McSideSheet`, `McButton`, `McTextField`, `McChip`, `McBadge`, and full token usage for colors, typography, spacing, and elevation.


## Updating

To update Pegasus package versions, change the `ref:` values in your `pubspec.yaml`:

```yaml
pegasus_flutter:
  git:
    url: https://github.com/mcafee-eng/pegasus-flutter.git
    ref: v0.9.0  # ← new version
mc_flutter_tokens:
  git:
    url: https://github.com/mcafee-eng/mc_flutter_tokens.git
    ref: v0.5.0  # ← new version
```

Then run `flutter pub get`.

To update the Claude configuration files, re-run the setup script or copy the latest versions from the Assemble repo.


## Troubleshooting

**Claude is generating raw Material widgets**
Your `CLAUDE.md` or `.claude/skills/SKILL.md` may be missing. Verify both files exist in your project root and re-run the setup script if needed.

**`flutter pub get` fails on Pegasus packages**
Make sure you have access to the McAfee GitHub org. Try authenticating with:
```bash
git config --global credential.helper osxkeychain
```

**Colors/tokens not applying**
Ensure your app root uses `McApp`, not `MaterialApp`. `McApp` auto-configures the theme from design tokens.

**"No MaterialLocalizations found" error**
`McSideSheet.show()` must be called from within an `McApp` widget tree. Check your widget hierarchy.

**Need to explore available components**
Run the Pegasus Widgetbook for interactive docs:
```bash
cd widget_book
flutter run
```
