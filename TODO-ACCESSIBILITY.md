# Accessibility Fixes — figma-ui3-kit-svelte

## Checkbox: visually-hidden input uses `width:0; height:0`

**File:** `src/components/Checkbox/index.svelte` lines 76–83

**Problem:** The real `<input type="checkbox">` is hidden with `width: 0; height: 0`. A zero-dimension element may not be keyboard-focusable in some browser/AT combinations, silently skipping the checkbox in Tab order.

**Fix:** Replace with `.sr-only`-style hiding that preserves a 1×1px layout footprint:

```css
input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**WCAG:** 4.1.2 Name, Role, Value

