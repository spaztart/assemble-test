# Button — Anti-Patterns

## NEVER: Multiple primary buttons in one viewport
```
❌ <button variant="primary">Save</button>
   <button variant="primary">Submit</button>

✅ <button variant="primary">Save</button>
   <button variant="secondary">Submit Draft</button>
```

## NEVER: Button without accessible name
```
❌ <button><icon name="x" /></button>

✅ <button aria-label="Close"><icon name="x" /></button>
```

## NEVER: Danger action without confirmation
```
❌ onClick → deleteAccount()

✅ onClick → openConfirmDialog() → onConfirm → deleteAccount()
```

## NEVER: Using `<div>` as a button
```
❌ <div role="button" onclick="save()">Save</div>

✅ <button onclick="save()">Save</button>
```

## NEVER: Nesting interactive elements inside button
```
❌ <button>
     <a href="/link">Click here</a>
   </button>

✅ <button>Click here</button>
```

## NEVER: Using button variant not in registry
```
❌ <button variant="outline">    ← does not exist
❌ <button variant="success">    ← does not exist
❌ <button variant="tertiary">   ← does not exist

✅ Use: primary, secondary, ghost, danger, link
```

## NEVER: Using size not in registry
```
❌ <button size="xs">     ← does not exist
❌ <button size="xl">     ← does not exist

✅ Use: sm, md, lg
```

## NEVER: Hiding loading state
```
❌ loading → hide button entirely

✅ loading → show spinner, keep button visible, disable interaction
```