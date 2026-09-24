---
layout: ../layouts/MarkdownLayout.astro
title: Installation - Design System
description: Step-by-step guide for setting up a project with the Assemble design system
---

# Installation

This guide walks through creating a new Flutter project pre-configured with the McAfee Pegasus design system.


## Prerequisites

Before starting, make sure you have:

1. **VS Code** installed and open
2. **GitHub access** — signed into GitHub with your McAfee credentials
3. **Flutter SDK** installed — run `flutter --version` to confirm

### GitHub authentication

You need McAfee GitHub credentials to install `pegasus_flutter` and `mc_flutter_tokens` from the McAfee org repos. Without them, package installation will fail.

If you aren't signed in yet, authenticate through VS Code before continuing.

### Flutter SDK

Run `flutter --version` to verify Flutter is installed. If it's not found:

1. Follow the install guide at [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
2. Make sure Flutter is added to your PATH
3. Confirm with `flutter --version` before continuing



## Step 1 — Create a Flutter project

Choose a project name following Flutter conventions:

- Lowercase only
- Use underscores to separate words (snake_case)
- No spaces, hyphens, or special characters

```bash
flutter create my_project_name
cd my_project_name
```



## Step 2 — Install Pegasus packages

Add both required packages to your project. First, install `pegasus_flutter`:

```bash
flutter pub add pegasus_flutter \
  --git-url=https://github.com/mcafee-eng/pegasus-flutter.git \
  --git-ref=v0.9.5
```

Then add `mc_flutter_tokens` to your `pubspec.yaml` under `dependencies`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  pegasus_flutter:
    git:
      url: https://github.com/mcafee-eng/pegasus-flutter.git
      ref: v0.9.5
  mc_flutter_tokens:
    git:
      url: https://github.com/mcafee-eng/mc_flutter_tokens.git
      ref: v0.4.5
```



## Step 3 — Validate the installation

Run these commands to verify everything is set up correctly:

```bash
# Check for outdated dependencies
flutter pub outdated

# Resolve and fetch all packages
flutter pub get
```



## Step 4 — Start using Pegasus

Every Dart file that builds UI should include these imports:

```dart
import 'package:flutter/material.dart';
import 'package:pegasus_flutter/pegasus_flutter.dart';
import 'package:mc_flutter_tokens/flutter_tokens.dart';
```

Replace your default `MaterialApp` with `McApp` and `Scaffold` with `McScaffold`:

```dart
void main() {
  runApp(
    McApp(
      home: McScaffold(
        appBar: McAppBar(title: 'My App'),
        body: Center(
          child: McButton(
            label: 'Get started',
            onPressed: () {},
          ),
        ),
      ),
    ),
  );
}
```



## Important rules

When working with the Pegasus design system:

- **Always use Pegasus components** (`Mc*` widgets) instead of raw Material widgets
- **Always use design tokens** from `mc_flutter_tokens` — never hardcode colors, typography, or spacing values
- **Only use approved packages** — `pegasus_flutter` and `mc_flutter_tokens` are the only sources for UI values

For the complete component reference, see the [Blocks](/blocks) documentation.



## Need help?

- Browse the [Foundations](/foundations) to understand the token system
- Check [Theming](/theming) for details on theme variants
- See [Claude + Pegasus Kit](/claude-kit) for AI-assisted development setup
