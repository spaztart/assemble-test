---
layout: ../layouts/MarkdownLayout.astro
title: Change Log - Design System
description: Full change log for the Assemble design system
---

# Change Log

All notable changes to the Assemble design system are documented here. This log tracks updates across tokens, components, documentation, and tooling.

![Change Log cover](/covers/change-log.png)

Versioning follows [Semantic Versioning](https://semver.org/). For major announcements, see the [Releases](/releases) page.

## [0.9.5] — 2026-03-10

### Added
- `McChatCard` component for conversation-style card layouts
- `McStatCard` component for metric and statistic displays
- `McNbaWidget` for next-best-action recommendation cards
- Claude Code skills package for AI-assisted Flutter development
- Documentation site with Astro — foundations, components, patterns, and guides
- Figma MCP integration guide for Claude Code

### Changed
- Updated `McButton` pressed state to use correct state layer opacity (10%)
- Improved `McSideSheet` animation timing for smoother transitions
- Refined dark theme surface gradient stops for better visual hierarchy

### Fixed
- `McTextField` focus ring not matching the correct outline color in high contrast modes
- `McChip` text truncation on small screens
- Spacing token `space-600` resolving to wrong value in medium contrast themes


## [0.9.0] — 2026-01-15

### Added
- Initial Material 3 design token set in OKLCH color space
- Six theme variants: light, dark, medium contrast, high contrast
- 33+ Flutter components in the Pegasus library
- McAfee extended color tokens (brand, positive, warning, mcafee-red)
- Surface gradient tokens (high, moderate, low energy)
- Glass-radial and border gradient tokens
- Typography scale: display, headline, title, body, label at all sizes
- Spacing scale from 100 (4px) through 1200
- State layer tokens for hover, focus, pressed, dragged
- Figma libraries synced with token pipeline
- CSS custom properties export via `build-tokens.js`

### Changed
- Migrated from legacy McAfee color palette to Material 3 tonal palette system


## [0.8.1] — 2025-11-20

### Added
- `McSearchBar` component
- `McFilterChipGroup` for multi-select chip sets
- `McMultiFeatureList` for complex list layouts
- `McConnectionDetails` component for network/device info display

### Changed
- `McCard` now supports custom content slots via `McCustomCard`
- `McLoader` animation updated for smoother rendering on low-end devices

### Fixed
- `McBottomNavbar` badge count not updating dynamically
- `McAppBar` title alignment issue on iOS


## [0.8.0] — 2025-10-01

### Added
- Initial Pegasus Flutter component library
- `McApp`, `McScaffold`, `McAppBar` — app shell components
- `McButton` — filled, outlined, text, and icon variants
- `McCard`, `McHorizontalCard` — card layouts
- `McTextField` — text input with validation states
- `McChip`, `McFilterChip`, `McListChip` — chip components
- `McCarousel` — horizontal scrolling content
- `McBadge`, `McDivider`, `McModal` — display utilities
- `McLoader`, `McProgressIndicator`, `McSkeletonLoading` — loading states
- `McBottomNavbar`, `McSideSheet`, `McMenu` — navigation components
- `McList`, `McListItem`, `McFeaturedListItem` — list components
- `McChatBubble`, `McChatPrompt`, `McAIBubble` — chat components
- `mc_flutter_tokens` package with color, typography, spacing, and elevation tokens


## Tracking changes

This change log is maintained alongside the [Assemble GitHub repository](https://github.com/mcafee-eng/assemble). Each tagged release includes:

- Updated token files in `/tokens`
- Updated `pegasus_flutter` package version
- Updated `mc_flutter_tokens` package version
- Updated documentation and Figma libraries

To track changes in real time, watch the repository or subscribe to release notifications on GitHub.
