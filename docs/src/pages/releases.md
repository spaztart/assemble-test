---
layout: ../layouts/MarkdownLayout.astro
title: Releases - Design System
description: Latest updates and announcements for the Assemble design system
---

# Releases

Stay up to date with the latest changes, new features, and improvements to the Assemble design system.

![Releases cover](/covers/release.png)

---

### v1.1.0

<small>June 26, 2026</small>

## Web Component Library

The Assemble design system now ships as an installable npm package (`@mcafee/assemble`) with 38+ web components built on Lit, complete with design tokens and theming support.

### What's new

- **38 web components** — Full component library with `asm-*` custom elements matching the Flutter Pegasus components
- **npm package** — Install with `npm install @mcafee/assemble` and start building immediately
- **Design tokens CSS** — All OKLCH color, spacing, border-radius, and typography tokens as CSS custom properties
- **Light & dark themes** — Switch themes with `data-theme="light"` or `data-theme="dark"`
- **Tree-shakeable** — Import only what you need with per-component imports
- **15 new components** — Alert Banner, Chat Bubble, Date Picker, Feedback, List Item, Loader, Modal, Nav Drawer, Navigation Rail, Pagination, Peek Label, Phone Input, Progress Bar, Side Sheet, Topbar
- **Full documentation** — Every component has a dedicated docs page with live previews, code examples, and API tables for both Web and Flutter

---

### v1.0.0

<small>March 14, 2026</small>

## Introducing Assemble

We're excited to launch the Assemble design system documentation — the central hub for building consistent, high-quality McAfee experiences with Flutter and Material 3.

### What's new

- **Design token system** — A complete set of OKLCH color, typography, spacing, and elevation tokens available through `mc_flutter_tokens`
- **Six theme variants** — Light, dark, and medium/high contrast modes for both, ready to use out of the box
- **33+ Pegasus components** — A full Flutter component library (`Mc*` widgets) covering navigation, cards, inputs, chat, feedback, and more
- **Claude Code skills** — AI skill files that teach Claude Code and GitHub Copilot to build UIs using only Pegasus components and design tokens
- **Figma integration** — Design files synced directly with the token system so design and development stay aligned
- **Theming documentation** — Guides for applying and customizing themes across your Flutter apps
- **One-line skill installer** — Install AI skills into any Flutter project with a single command from the [Skills](/skills) page
