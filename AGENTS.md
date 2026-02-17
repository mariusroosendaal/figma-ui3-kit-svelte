# AI Assistant Guidelines for Figma UI3 Kit Svelte

Svelte 4.x component library for Figma plugin UIs matching Figma's UI3 design system.

## Project Structure

```
/src/
  components/       # One component per directory (PascalCase/index.svelte)
  icons/16/         # 16px icons (compact spaces)
  icons/24/         # 24px icons (default)
  global.css        # Typography, spacing, utilities
  figma-development-theme.css  # Figma CSS variables
  index.js          # Exports (alphabetized)
/.storybook/
  main.js, preview.js, *Wrapper.svelte files
```

**Dependencies:** Svelte 4.x, Storybook 8.x, svelte-click-outside

## Core Rules

1. **Always use Figma CSS variables** - never hardcode colors
2. **Always include class passthrough:** `export { className as class };`
3. **Always forward events** on interactive elements: `on:click`, `on:blur`, `on:focus`
4. **Test in both light and dark themes**
5. **Test in actual Figma plugin context**, not just browser

## Component Template

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  
  export let variant = 'default';
  export let disabled = false;
  export { className as class };
  
  let className = '';
  const dispatch = createEventDispatcher();
</script>

<div 
  class="component {variant} {className}"
  class:disabled
  on:click
  on:blur
  on:focus
>
  <slot />
</div>

<style>
  .component {
    background-color: var(--figma-color-bg);
    color: var(--figma-color-text);
    border-radius: var(--border-radius-medium);
    padding: var(--size-xxsmall);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }
</style>
```

## Design Tokens

**Colors (use Figma variables):**
- Backgrounds: `--figma-color-bg`, `--figma-color-bg-secondary`, `--figma-color-bg-brand`, `--figma-color-bg-danger`
- Text: `--figma-color-text`, `--figma-color-text-secondary`, `--figma-color-text-brand`, `--figma-color-text-disabled`
- Borders: `--figma-color-border`, `--figma-color-border-selected`, `--figma-color-border-danger`
- Icons: `--figma-color-icon`, `--figma-color-icon-brand`, `--figma-color-icon-onbrand`

**Spacing:** `--size-xxxsmall` (4px), `--size-xxsmall` (8px), `--size-xsmall` (16px), `--size-small` (24px), `--size-medium` (32px), `--size-large` (40px)

**Border Radius:** `--border-radius-small` (2px), `--border-radius-medium` (5px), `--border-radius-large` (13px)

**Typography:** Use semantic tokens like `--body-medium-font-size`, `--heading-small-font-weight`, etc.

**Exception - Menu colors are intentionally static (always dark):**
`--color-bg-menu`, `--color-text-menu`, `--color-border-menu`

## Icons

```javascript
// 24px (default)
import IconClose from './../../icons/24/icon.24.close.svg';

// 16px (compact)
import Icon16Check from './../../icons/16/icon.16.check.svg';

// Usage
<Icon iconName={IconClose} color="--figma-color-icon" />
```

## Adding Components

1. Create `/src/components/ComponentName/index.svelte`
2. Add to `/src/index.js` (alphabetical order)
3. Create `ComponentName.stories.js`
4. Update README.md and CHANGELOG.md

## Removing Components

Remove completely (no deprecation warnings):
1. Delete component directory
2. Remove from `/src/index.js`
3. Remove Storybook story
4. Update README.md and CHANGELOG.md

## Git Conventions

**Commit format:** `<type>: <description>`
- `feat:` new feature/component
- `fix:` bug fix
- `refactor:` code restructuring
- `chore:` maintenance
- `docs:` documentation

**Branches:** `feature/description` or `feat/description`

## Storybook

- Keep stories simple, group similar examples
- Use existing component variants only
- Wrapper components (in `.storybook/`) manage state for interactive demos

## UX Writing

- Use **sentence case** ("New data source" not "New Data Source")
- Button labels: action verbs, concise ("Add", "Save", "Cancel")
- Error messages: helpful, actionable, no jargon

## Commands

```bash
npm run dev      # Storybook at localhost:6006
npm run build    # Build Storybook
npm run lint     # Lint
npm run format   # Format
```
