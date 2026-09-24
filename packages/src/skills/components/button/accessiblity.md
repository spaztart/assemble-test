# Button — Accessibility

## Requirements

| Requirement | Implementation |
|-------------|---------------|
| Accessible name | Text content OR aria-label (icon-only) |
| Role | `<button>` element (native) — no `<div role="button">` |
| Keyboard | Enter and Space activate |
| Focus | :focus-visible ring (2px, color.border.focus) |
| Disabled | disabled attribute (removes from tab order) |
| Loading | aria-busy="true", aria-disabled="true" |
| Touch target | Minimum 44x44px |

## Icon-Only Buttons
- MUST have aria-label describing the action
- MUST have tooltip on hover/focus showing the label
- Example: `<button aria-label="Close dialog"><icon name="x" /></button>`

## Button Groups
- Wrap in a container — no special ARIA needed
- Tab navigates between buttons sequentially

## Danger Buttons
- Confirmation dialog MUST use aria-describedby to explain consequences
- Example: "This will permanently delete 5 items. This cannot be undone."

## Screen Reader Announcements
- Loading state: announce "Loading" or loading text
- Completion: announce result (via aria-live on associated region)
