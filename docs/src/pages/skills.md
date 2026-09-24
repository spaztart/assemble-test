---
layout: ../layouts/MarkdownLayout.astro
title: Skills - Design System
description: Claude Code skills and AI packages for the Assemble design system
---

# Skills

AI skill files that teach Claude Code and GitHub Copilot to build Flutter UIs using the McAfee Pegasus design system.

![Skills cover](/covers/skills.png)


## Installation

From your Flutter project root, run:
```bash
git clone --depth 1 https://github.com/mcafee-eng/claude-ds.git /tmp/claude-ds && bash /tmp/claude-ds/install.sh && rm -rf /tmp/claude-ds
```

This clones the skill package, runs the installer, and cleans up after itself. You'll end up with a `.claude/` directory in your project containing all the skill files.

### Download individual files

If you'd prefer to install only the files you need, download them separately from the [claude-ds GitHub repository](https://github.com/mcafee-eng/claude-ds) and place them in a `.claude/` directory at your project root.

## What It Does

Once installed, AI coding assistants will:

- **Use only Pegasus `Mc*` components** — never raw Material widgets
- **Use only `mc_flutter_tokens`** for colors, typography, spacing, and elevation
- **Follow McAfee design patterns** for screens, chat, dashboards, and navigation

Skills are structured instruction files (`.md`) placed in your project's `.claude/` directory. Claude Code and GitHub Copilot automatically pick them up and follow the rules, use the correct components, and apply the right tokens — no configuration needed.


## Keeping skills up to date

Skills are versioned alongside the Assemble design system. To update, re-run the install command:

```bash
git clone --depth 1 https://github.com/mcafee-eng/claude-ds.git /tmp/claude-ds && bash /tmp/claude-ds/install.sh && rm -rf /tmp/claude-ds
```

Check the [Releases](/releases) page for announcements about skill updates.
