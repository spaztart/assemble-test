# @mcafee-eng/assemble

Assemble Design System — a library of web components built with [Lit](https://lit.dev), powered by design tokens.

## Installation

```bash
npm install @mcafee-eng/assemble
```

## Setup

### 1. Import the design tokens CSS

Add the token stylesheet to your app's entry point or HTML:

```html
<link rel="stylesheet" href="node_modules/@mcafee-eng/assemble/dist/tokens.css" />
```

Or import in your bundler (Vite, Webpack, etc.):

```js
import '@mcafee-eng/assemble/tokens.css';
```

### 2. Copy fonts (optional)

The tokens CSS references `fonts/` relative to itself. Either:

- Serve `node_modules/@mcafee-eng/assemble/dist/fonts/` at the correct path, or
- Copy the fonts folder into your public/static directory alongside `tokens.css`

### 3. Use components

```js
// Import all components (registers custom elements automatically)
import '@mcafee-eng/assemble';

// Or import individual components
import '@mcafee-eng/assemble/dist/components/button/button.js';
```

## Usage

```html
<asm-button variant="filled">Click Me</asm-button>

<asm-text-field label="Email" placeholder="you@example.com"></asm-text-field>

<asm-card variant="elevated" elevation="1">
  <h3 slot="header">Card Title</h3>
  <p>Card content goes here.</p>
</asm-card>
```

## Theming

Assemble uses CSS custom properties for theming. The default tokens provide both light and dark themes:

```html
<!-- Light theme (default) -->
<body data-theme="light">

<!-- Dark theme -->
<body data-theme="dark">
```

Override any token in your own CSS:

```css
:root {
  --md-sys-color-primary: #your-brand-color;
}
```

## Available Components

| Component | Tag | Description |
|-----------|-----|-------------|
| Button | `<asm-button>` | Primary action buttons |
| Icon Button | `<asm-icon-button>` | Icon-only buttons |
| Split Button | `<asm-split-button>` | Button with dropdown |
| Icon | `<asm-icon>` | Material icons |
| Tabs | `<asm-tab-group>` | Tab navigation |
| Menu | `<asm-menu>` | Dropdown menus |
| Checkbox | `<asm-checkbox>` | Checkboxes |
| Radio | `<asm-radio>` | Radio buttons |
| Badge | `<asm-badge>` | Status badges |
| Tag | `<asm-tag>` | Labels and tags |
| Toggle Group | `<asm-toggle-group>` | Segmented controls |
| Accordion | `<asm-accordion-item>` | Collapsible panels |
| Divider | `<asm-divider>` | Visual separators |
| Text Field | `<asm-text-field>` | Text inputs |
| Tooltip | `<asm-tooltip>` | Hover tooltips |
| Switch | `<asm-switch>` | Toggle switches |
| Table | `<asm-table>` | Data tables |
| Empty State | `<asm-empty-state>` | Empty placeholders |
| Snackbar | `<asm-snackbar>` | Toast notifications |
| Status Indicator | `<asm-status-indicator>` | Status dots |
| Status Notification | `<asm-status-notification>` | Alert banners |
| Skeleton Loader | `<asm-skeleton-loader>` | Loading placeholders |
| Card | `<asm-card>` | Content cards |
| Alert Banner | `<asm-alert-banner>` | System alerts |
| Chat Bubble | `<asm-chat-bubble>` | Chat messages |
| Date Picker | `<asm-date-picker>` | Date selection |
| Feedback | `<asm-feedback>` | Thumbs/share actions |
| List Item | `<asm-list-item>` | List rows |
| Loader | `<asm-loader>` | Spinners |
| Modal | `<asm-modal>` | Dialog overlays |
| Nav Drawer | `<asm-nav-drawer>` | Side navigation |
| Navigation Rail | `<asm-navigation-rail>` | Vertical nav |
| Pagination | `<asm-pagination>` | Page indicators |
| Peek Label | `<asm-peek-label>` | Status pills |
| Phone Input | `<asm-phone-input>` | Phone fields |
| Progress Bar | `<asm-progress-bar>` | Progress indicators |
| Side Sheet | `<asm-side-sheet>` | Right panel |
| Topbar | `<asm-topbar>` | App bar |

## Browser Support

Modern browsers with Custom Elements v1 support (Chrome, Firefox, Safari, Edge).

## License

MIT
