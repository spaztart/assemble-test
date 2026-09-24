---
layout: ../layouts/MarkdownLayout.astro
title: Patterns - Design System
description: Common design patterns and solutions
---

# Patterns

![Patterns cover](/covers/patterns.svg)

Patterns are reusable combinations of components that solve common design problems and provide consistent user experiences.

## Layout patterns

### Grid layout

Use grid layouts to organize content in a structured, responsive manner.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--md-sys-space-600);
}
```

### Sidebar layout

A common pattern for documentation and dashboard applications.

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
}
```

## Navigation patterns

### Breadcrumbs

Breadcrumbs help users understand their location within the app hierarchy.

### Pagination

Break large data sets into manageable pages.

### Infinite scroll

Load content progressively as users scroll.

## Form patterns

### Multi-step forms

Break complex forms into logical steps to reduce cognitive load.

### Inline validation

Provide immediate feedback as users complete form fields.

### Auto-save

Automatically save user progress to prevent data loss.

## Data display patterns

### Tables

Display structured data in rows and columns.

### Lists

Show collections of items in a vertical arrangement.

### Cards grid

Display multiple cards in a responsive grid layout.

## Feedback patterns

### Toast notifications

Brief messages that appear temporarily at the bottom of the screen.

### Modal dialogs

Interrupt the user flow to display important information or request input.

### Loading states

Indicate that content is being fetched or processed.

## Best practices

- Choose patterns that match user expectations
- Maintain consistency across similar use cases
- Test patterns with real users
- Document pattern usage and variations
