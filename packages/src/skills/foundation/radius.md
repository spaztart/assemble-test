# Foundation: Radius

> Role: Defines the border-radius and border-width scales.
> Rule: NEVER use arbitrary radius or border-width values. Always reference a token.

## Token Resolution

- **Web:** CSS custom properties (`var(--md-border-radius-8)`, `var(--md-border-size-100)`)
- **Flutter:** `BorderRadius.circular(AsmCornerRadii.r8)` or the semantic `context.asmSpacingTokens.corner*` getters — see [Flutter Usage](#flutter-usage)

## Border Radius Scale (`md.border.radius.*`)

The scale is named by its pixel value. Radius `999` is the pill/circle token (fully rounded), not a literal 999px design intent.

| Token                  | Value  | Usage                                               |
| ---------------------- | ------ | --------------------------------------------------- |
| md.border.radius.0     | 0px    | Sharp corners — tables, code blocks, full-bleed     |
| md.border.radius.2     | 2px    | Hairline rounding on very small elements            |
| md.border.radius.4     | 4px    | Subtle rounding — chips, tags, small controls       |
| md.border.radius.6     | 6px    | Compact controls                                    |
| md.border.radius.8     | 8px    | Default — buttons, inputs, small cards              |
| md.border.radius.12    | 12px   | Cards, menus, popovers                              |
| md.border.radius.16    | 16px   | Large cards, panels                                 |
| md.border.radius.24    | 24px   | Sheets, hero cards                                  |
| md.border.radius.32    | 32px   | Extra-large containers                              |
| md.border.radius.36    | 36px   | Extra-large containers                              |
| md.border.radius.40    | 40px   | Feature surfaces                                    |
| md.border.radius.48    | 48px   | Feature surfaces                                    |
| md.border.radius.56    | 56px   | Oversized decorative surfaces                       |
| md.border.radius.64    | 64px   | Oversized decorative surfaces                       |
| md.border.radius.999   | 999px  | Pills, avatars, circular elements (fully rounded)   |

## Border Width Scale (`md.border.size.*`)

| Token                | Value | Usage                                          |
| -------------------- | ----- | ---------------------------------------------- |
| md.border.size.0     | 0px   | No border                                      |
| md.border.size.100   | 1px   | Default — dividers, input outlines, card edges |
| md.border.size.200   | 2px   | Emphasis — focus rings, selected states        |
| md.border.size.300   | 3px   | Heavy emphasis                                 |
| md.border.size.400   | 4px   | Decorative / accent borders                    |

## Component Radius Defaults

Values below reflect the actual component styles in the library.

| Component            | Default Radius        | Value |
| -------------------- | --------------------- | ----- |
| button               | md.border.radius.999  | pill  |
| split-button         | md.border.radius.999  | pill  |
| toggle-group         | md.border.radius.999  | pill  |
| switch               | md.border.radius.999  | pill  |
| progress bar         | md.border.radius.999  | pill  |
| status-notification  | md.border.radius.999  | pill  |
| badge                | md.border.radius.6    | 6px   |
| tag                  | md.border.radius.6    | 6px   |
| tooltip              | md.border.radius.4    | 4px   |
| snackbar             | md.border.radius.4    | 4px   |
| menu / dropdown      | md.border.radius.8    | 8px   |
| tab                  | md.border.radius.8    | 8px   |
| alert / banner       | md.border.radius.8    | 8px   |
| accordion            | md.border.radius.12   | 12px  |
| table                | md.border.radius.12   | 12px  |
| text field / input   | md.border.radius.12   | 12px  |
| calendar             | md.border.radius.12   | 12px  |
| navigation rail item | md.border.radius.12   | 12px  |
| nav-drawer / rail    | md.border.radius.16   | 16px  |
| list-item            | md.border.radius.16   | 16px  |
| side-sheet           | md.border.radius.16   | 16px  |
| card                 | md.border.radius.24   | 24px  |
| modal / dialog       | md.border.radius.24   | 24px* |
| avatar / status dot  | md.border.radius.999  | circular |

> *The modal component currently applies a raw `28px`; prefer `md.border.radius.24` for new dialog-style surfaces to stay on-scale. Circular elements (avatars, status dots, radios) render as a full circle — conceptually `md.border.radius.999`.

## Flutter Usage

Flutter reads the same scale from `assemble_flutter_tokens`. Raw values live on `AsmCornerRadii` (`r0`…`r999`); semantic aliases live on `AsmSpacingTokens` (via the `context.asmSpacingTokens` extension). Wrap either in `BorderRadius.circular(...)`.

| Web token             | Flutter semantic (`asmSpacingTokens`) | Flutter raw          | Value |
| --------------------- | ------------------------------------- | -------------------- | ----- |
| md.border.radius.0    | cornerNone                            | AsmCornerRadii.r0    | 0     |
| md.border.radius.2    | cornerXSmall                          | AsmCornerRadii.r2    | 2     |
| md.border.radius.4    | cornerSmall                           | AsmCornerRadii.r4    | 4     |
| md.border.radius.12   | cornerMedium                          | AsmCornerRadii.r12   | 12    |
| md.border.radius.16   | cornerLarge                           | AsmCornerRadii.r16   | 16    |
| md.border.radius.24   | cornerXLarge                          | AsmCornerRadii.r24   | 24    |
| md.border.radius.999  | cornerFull                            | AsmCornerRadii.r999  | 999   |

Values without a semantic alias (`r6`, `r8`, `r32`, `r36`, `r40`, `r48`, `r56`, `r64`) are still available as raw `AsmCornerRadii` constants.

```dart
final s = context.asmSpacingTokens;
Container(
  decoration: BoxDecoration(
    color: Theme.of(context).colorScheme.surface,
    borderRadius: BorderRadius.circular(s.cornerXLarge), // 24px card
  ),
);
```

Border widths use plain `BorderSide(width: ...)` with the `md.border.size.*` values (1 / 2 / 3 / 4).

## Rules

1. NEVER use arbitrary `border-radius` or `border-width` values — always reference a token.
2. Radius MUST match the size context: smaller components use smaller radius tokens.
3. Fully rounded elements (avatars, pills, status dots) ALWAYS use `md.border.radius.999`.
4. `md.border.radius.0` is ONLY for intentionally sharp elements (tables, code blocks, full-bleed media).
5. Nested elements SHOULD subtract parent padding from the parent radius for concentric alignment.
6. Default interactive controls use `md.border.radius.8`; default containers use `md.border.radius.12`.
7. Default borders use `md.border.size.100` (1px); reserve `md.border.size.200`+ for focus and emphasis.
