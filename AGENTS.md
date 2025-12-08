# AI Assistant Guidelines for Figma UI3 Kit Svelte

This document provides instructions for AI assistants working on the Figma UI3 Kit Svelte component library. This is a Svelte-based design system that matches Figma's UI3 design language for use in Figma plugins.

## Project Overview

**Purpose:** A lightweight Svelte component library for building Figma plugin UIs that match Figma's native UI3 design system.

**Tech Stack:**
- Svelte 4.x
- Rollup for bundling
- Native Figma CSS variables for theming
- No external UI dependencies

**Key Files:**
- `/src/components/` - All Svelte components (one per directory)
- `/src/index.js` - Main export file
- `/src/global.css` - Global typography, spacing, and utility styles
- `/src/figma-development-theme.css` - Figma's native CSS variables
- `/src/icons/` - Icon assets (16px and 24px variants)
- `/playground/App.svelte` - Development playground for testing

## Core Principles

### 1. Design System Fidelity
- **ALWAYS use Figma CSS variables** from `figma-development-theme.css` - never hardcode colors
- Use REM-based typography with semantic tokens from `global.css`
- Support automatic light/dark mode through Figma's native theme variables
- Components must feel native to Figma's interface

### 2. Lightweight & Plugin-Optimized
- Keep bundle size small - runs in plugin context with size constraints
- Avoid heavy dependencies
- Prefer vanilla Svelte features over external libraries

### 3. Developer Experience
- Clean, intuitive APIs with sensible defaults
- Comprehensive prop documentation
- Consistent patterns across all components

## Component Development Workflow

### Creating a New Component

1. **Directory Structure:**
   ```
   /src/components/ComponentName/
     └── index.svelte
   ```
   - Always use PascalCase for component directory names
   - Always name the file `index.svelte`

2. **Component Template:**
   ```svelte
   <script>
     import { createEventDispatcher } from 'svelte';
     
     export let variant = 'default';
     export let disabled = false;
     export { className as class };
     
     let className = '';
     const dispatch = createEventDispatcher();
     
     function handleClick(event) {
       if (!disabled) {
         dispatch('click', event);
       }
     }
   </script>
   
   <div 
     class="component-name {variant} {className}"
     class:disabled
     on:click={handleClick}
     on:blur
     on:focus
   >
     <slot />
   </div>
   
   <style>
     .component-name {
       /* Always use CSS variables */
       background-color: var(--figma-color-bg);
       color: var(--figma-color-text);
       border-radius: var(--border-radius-medium);
       padding: var(--size-xxsmall);
       
       /* Use semantic typography tokens */
       font-family: var(--font-stack);
       font-size: var(--body-medium-font-size);
       font-weight: var(--body-medium-font-weight);
       line-height: var(--body-medium-line-height);
       letter-spacing: var(--body-medium-letter-spacing);
     }
   </style>
   ```

3. **Add to Exports:**
   - Add to `/src/index.js` (maintain alphabetical order)
   - Add to `/playground/App.svelte` with comprehensive examples
   - Update `README.md` with usage and props table
   - Update `CHANGELOG.md` with the new component

### Testing Checklist
- [ ] Test all prop variants
- [ ] Test disabled state (if applicable)
- [ ] Test in light AND dark theme
- [ ] Test keyboard navigation and focus states
- [ ] Test with long content/edge cases
- [ ] Verify in actual Figma plugin context (not just browser)
- [ ] Leave working examples in playground/App.svelte

## Code Style & Patterns

### Props

**Standard Props Pattern:**
```javascript
export let variant = 'default';    // Appearance variant
export let size = 'default';       // Size variant  
export let disabled = false;       // Boolean states (no "is" or "has" prefix)
export let value = '';             // Form value
export let checked = false;        // Checkbox/toggle state
export { className as class };     // ALWAYS include for class passthrough
```

**Always provide sensible defaults** and use `variant` for appearance, `size` for sizing.

### Event Handling

**Pattern: Dispatch + Forward (use both)**
```javascript
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

function handleClick(event) {
  if (!disabled) {
    dispatch('click', event);  // Custom event
  }
}
```

```svelte
<button
  on:click={handleClick}
  on:blur    <!-- Forward native events -->
  on:focus
>
```

**Why both?** Custom events work across component boundaries, forwarding allows native listeners.

### Reactive Statements

**Prefer reactive statements for derived values:**
```javascript
// Good - reactive
$: isActive = checked && !disabled;
$: cssColorVar = color.startsWith('--') ? `var(${color})` : color;

// Avoid - computed in template
{#if checked && !disabled}
```

### Styling Rules

**CSS Variables - REQUIRED:**
```css
/* Colors - ALWAYS use Figma and global.css variables, NEVER hardcode */
background-color: var(--figma-color-bg);
color: var(--figma-color-text);
border-color: var(--figma-color-border);

/* Spacing - use size tokens */
padding: var(--size-xxsmall);        /* 8px */
gap: var(--size-xxxsmall);           /* 4px */
height: var(--size-small);           /* 24px */

/* Border radius tokens */
border-radius: var(--border-radius-medium);  /* 5px */

/* Typography - use semantic tokens (NOT raw variables) */
font-family: var(--font-stack);
font-size: var(--body-medium-font-size);      /* Use these semantic tokens */
font-weight: var(--body-medium-font-weight);
line-height: var(--body-medium-line-height);
letter-spacing: var(--body-medium-letter-spacing);
```

**Key Color Variables:**
- Backgrounds: `--figma-color-bg`, `--figma-color-bg-secondary`, `--figma-color-bg-brand`, `--figma-color-bg-danger`, `--figma-color-bg-disabled`
- Text: `--figma-color-text`, `--figma-color-text-secondary`, `--figma-color-text-brand`, `--figma-color-text-danger`, `--figma-color-text-disabled`, `--figma-color-text-onbrand`
- Borders: `--figma-color-border`, `--figma-color-border-selected`, `--figma-color-border-danger`, `--figma-color-border-disabled`
- Icons: `--figma-color-icon`, `--figma-color-icon-brand`, `--figma-color-icon-danger`, `--figma-color-icon-onbrand`, `--figma-color-icon-ondisabled`

**Size Tokens:** `--size-xxxsmall` (4px), `--size-xxsmall` (8px), `--size-xsmall` (16px), `--size-small` (24px), `--size-medium` (32px), `--size-large` (40px), `--size-xlarge` (48px), `--size-xxlarge` (64px), `--size-huge` (80px)

**Border Radius:** `--border-radius-small` (2px), `--border-radius-medium` (5px), `--border-radius-large` (13px)

**Typography Semantic Tokens:** Use `--body-medium-*`, `--body-large-*`, `--body-small-*`, `--heading-large-*`, `--heading-medium-*`, `--heading-small-*` for font-size, line-height, font-weight, letter-spacing.

**Units:**
- Use REM for typography (via semantic tokens)
- Use Figma's size tokens for spacing/sizing
- Avoid hardcoded px values
- NEVER hardcode colors

**Exception: Menu Colors (Intentional Static Colors)**
Menu colors in `global.css` are intentionally hardcoded and do NOT support light/dark mode switching:
- `--color-bg-menu: #1e1e1e` (dark background)
- `--color-bg-menu-selected: #0d99ff` (selection blue)
- `--color-text-menu: #FFFFFF` (white text)
- `--color-text-menu-secondary` (70% opacity white)
- `--color-border-menu: #383838` (dark border)

These remain constant regardless of theme - this is an intentional design decision. Do NOT attempt to convert these to Figma variables as menu appearance should be consistent across themes.

### Icons

**Icon System:**
- **24px icons** (default) - `/src/icons/24/` - most UI elements
- **16px icons** (small) - `/src/icons/16/` - compact spaces (checkboxes, small buttons)

**Icon Import Pattern:**
```javascript
// For 24px icons (default)
import Icon24Close from './../../icons/24/icon.24.close.small.svg';

// For 16px icons
import Icon16Check from './../../icons/16/icon.16.check.svg';

// Use in component
import Icon from './../Icon/index.svelte';
<Icon iconName={Icon24Close} color="--figma-color-icon" />
```

## Common Component Patterns

### Modal/Dialog with Slot-based Footer
```svelte
<!-- Modal manages slots and passes to ModalFooter -->
{#if $$slots['footer-left'] || $$slots['footer-right'] || $$slots['footer-full']}
  <ModalFooter 
    useFullLayout={$$slots['footer-full'] && !$$slots['footer-left'] && !$$slots['footer-right']}
  >
    <slot name="footer-left" slot="left" />
    <slot name="footer-right" slot="right" />
    <slot name="footer-full" slot="full" />
  </ModalFooter>
{/if}
```

### Form Component with Binding + Events
```svelte
<script>
  export let value = '';
  export let checked = false;
</script>

<input 
  bind:value
  bind:checked
  on:change
  on:input
  on:focus
  on:blur
/>
```

### Conditional Rendering
```svelte
{#if showContent}
  <Content />
{:else}
  <Fallback />
{/if}

{#each items as item, index (item.id)}
  <Item {item} {index} />
{/each}
```

## Common Tasks

### Adding a New Variant
1. Add prop: `export let variant = 'default'; // default, new-variant`
2. Add CSS: `.component.new-variant { background-color: var(--figma-color-bg-success); }`
3. Update playground/App.svelte with example
4. Update README.md props table

### Removing Components
1. Check if used: `grep -r "ComponentName" src/`
2. **Remove completely** (user preference: complete removal over deprecation)
3. Remove from `/src/index.js`
4. Remove from `/playground/App.svelte`
5. Remove any related child components
6. Update `README.md` to remove references
7. Document in `CHANGELOG.md`

**Note:** When user requests removal of deprecated components, remove them entirely rather than adding deprecation warnings.

## Documentation Standards

### README.md Component Section
```markdown
### ComponentName
```javascript
import { ComponentName } from 'figma-ui3-kit-svelte';
```
```html
<ComponentName>Content</ComponentName>
<ComponentName variant="secondary">Content</ComponentName>
<ComponentName disabled>Content</ComponentName>
```
**Props**

| Prop       | Type    | Options/notes                           |
|:-----------|:--------|:----------------------------------------|
| `variant`  | String  | Default: `"primary"`, Options: `"secondary"`, `"tertiary"` |
| `disabled` | Boolean | Default: `false`                        |
| `on:click` | Func    | Event handler. Ex: `on:click={handler}` |

---
```

### CHANGELOG.md Entry
```markdown
## [Version] - YYYY-MM-DD

### Added
- ComponentName component with variants: primary, secondary

### Changed
- Updated Checkbox to use 16px icons

### Deprecated
- Type component `display` variant (use Text component instead)

### Removed
- Legacy icon imports

### Fixed
- Input focus state in dark mode
```

## Accessibility Essentials

**Keyboard Navigation:**
- Tab navigation with proper tab order
- Enter/Space for activation
- Arrow keys for lists/menus
- Escape for closing modals/menus

**ARIA Attributes:**
```svelte
<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

<!-- Buttons -->
<button aria-label="Close modal" aria-disabled={disabled}>
```

**Focus Management:**
- Modals: trap focus, return focus on close
- Inputs: associated labels, focus indicators

## Build & Development

```bash
npm install      # Install dependencies
npm run dev      # Development with hot reload (playground/App.svelte is playground)
npm run build    # Production build
```

**File Structure:**
```
/src/
  components/       # One per directory, index.svelte
  icons/
    16/            # 16px icons (compact)
    24/            # 24px icons (default)
  global.css       # Typography, utilities, base styles
  figma-development-theme.css  # Figma CSS variables
  index.js         # Main exports (alphabetized)
/playground/
  App.svelte       # Development playground
```

## Common Pitfalls

### 1. Forgetting Dark Mode
**Problem:** Component looks great in light mode, broken in dark mode  
**Solution:** Always use Figma CSS variables, test both themes

### 2. Hardcoded Sizes
**Problem:** Using `padding: 8px` instead of tokens  
**Solution:** Always use size tokens: `padding: var(--size-xxsmall)`

### 3. Missing Class Passthrough
**Problem:** Component doesn't accept custom classes  
**Solution:** Always include:
```javascript
export { className as class };
let className = '';
```
Then apply: `class="component {className}"`

### 4. Breaking Event Forwarding
**Problem:** Component wraps native element but doesn't forward events  
**Solution:** Forward common events (especially focus/blur for interactive components):
```svelte
on:click
on:blur
on:focus
on:change
on:input
```

**Important:** All interactive components (Button, IconButton, Chip close buttons, etc.) MUST forward both `on:blur` and `on:focus` events for proper keyboard navigation and accessibility.
### 5. Not Testing in Figma Plugin Context
**Problem:** Works in browser but breaks in actual plugin  
**Solution:** Always test in real Figma plugin environment, not just browser dev server

### 6. Not Testing in Storybook
**Problem:** Component works in playground but breaks in Storybook
**Solution:** Run `npm run storybook` and verify the component renders correctly in isolation.

## Git Workflow & Version Control
## Git Workflow & Version Control

### Branch Strategy

**Feature Branches:**
- Use `feature/description` or `feat/description` naming (e.g., `feature/storybook-10-implementation`)
- Create branches for new features, components, major refactors
- Merge to `main` when complete and tested

### Commit Message Conventions

**Follow Conventional Commits format:** `<type>: <description>`

**Commit Types:**
- `feat:` - New feature/component
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `chore:` - Maintenance/version bumps
- `docs:` - Documentation updates
- `style:` - Code style changes

**Guidelines:**
- Use present tense, imperative mood ("add" not "added")
- Be specific: `feat: add contentPadding prop to Modal component`
- Reference components: `feat(IconButton): add iconColor prop`
- Version releases: `chore: v0.2.0 - codebase cleanup and organization`

**Examples:** `feat: add contentPadding prop to Modal component`, `fix: multi menu opening`, `refactor: remove legacy components`

### Workflow

1. Create branch: `git checkout -b feature/component-name`
2. Make changes, test in App.svelte, update docs
3. Commit with descriptive messages
4. Before merge: Update CHANGELOG.md, test light/dark themes, verify in Figma plugin
5. Tag releases: `git tag v0.2.0`

### Git Best Practices

- **Don't commit:** `node_modules/`, build artifacts, editor configs, `.DS_Store`
- **Do commit:** Source code, docs, config files, Storybook files
- Review before commit: `git status`, `git diff`, `npm run build`

## Storybook Story Guidelines

**Keep stories simple and focused:**
- Group similar examples into one comprehensive story rather than many small ones
- Use variants from the components as stories - stick to existing component variants, don't invent new ones
- Don't create nested folder structures unless necessary - keep components directly under `Components/`

**Component wrappers for stories:**
- Create helper wrapper components (e.g., `ComponentWrapper.svelte`) for interactive stories only if necessary
- Wrappers manage state and provide triggers


## UX Writing Guidelines:

- **Case**: Always use **sentence case**, not title case
  - ✅ "New data source" not "New Data Source"
- **Button labels**: Use action verbs, keep concise
  - ✅ "Add", "Save", "Cancel", "Remove"
  - ❌ "Add New Item", "Click Here to Save"
- **Error messages**: Helpful and actionable, avoid technical jargon
  - ✅ "Invalid URL format. Please check the address."
  - ❌ "URL validation failed: invalid protocol"
- **Placeholder text**: Provide helpful hints without being verbose
  - ✅ "Enter API endpoint URL"
  - ❌ "Please type in the full URL address of your API endpoint here"
- **Empty states**: Friendly and encouraging, suggest next actions
  - ✅ "No mappings yet. Create your first mapping to get started."
  - ❌ "No data available."
- **Tooltips**: Concise, one clear sentence when possible
- **Tone**: Friendly and professional, match Figma's voice


## Key Takeaways

1. **Always use Figma CSS variables** - enables automatic light/dark mode (except menu colors which are intentionally static)
2. **Use semantic typography tokens** - body-medium-font-size, not raw variables
3. **24px icons are default**, 16px for compact spaces
4. **Test in App.svelte** before considering component complete
5. **Update README + CHANGELOG** when adding/changing components
6. **Both dispatch + forward events** for maximum flexibility - especially focus/blur for interactive components
7. **Class passthrough is mandatory** - `export { className as class };`
8. **Bundle size matters** - avoid heavy dependencies
9. **Component removal over deprecation** - when user requests removal, remove completely rather than deprecating
10. **Structure verification** - verify component structure consistency rather than reorganizing unnecessarily
11. **Follow git conventions** - use conventional commits (feat:, fix:, refactor:, chore:, docs:) and feature branches for new work
12. **Keep stories simple** - focus on essential examples, avoid excessive variants

---

**Questions?** Check existing components for patterns, prioritize consistency, test thoroughly in actual Figma plugin context.
