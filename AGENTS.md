# LLM Assistant Guidelines for Figma UI3 Kit Svelte

Svelte 5 component library, in runes with type-only TypeScript, for Figma plugin UIs matching Figma's UI3 design system.

## Project Structure

```
/src/
  components/       # One component per directory (PascalCase/index.svelte)
  icons/16/         # 16px icons (compact spaces)
  icons/24/         # 24px icons (default)
  icons.ts          # named icon export entrypoint
  global.css        # Typography, spacing, shared UI3 styles only
  figma-development-theme.css  # Figma CSS variables
  index.ts          # Exports (alphabetized)
  types.ts          # Types plugins import, re-exported from index.ts
/.storybook/
  main.js, preview.js, *Wrapper.svelte files
```

**Dependencies:** Svelte 5 (peer), Storybook 8.x

## Core Rules

1. **Always use Figma CSS variables** - never hardcode colors
2. **Always include class passthrough:** `class: className = ''` in `$props()`
3. **Callbacks, not events:** take `onclick`, `onfocus`, `onblur` (and any event the component raises, lowercase: `onchange`, `onselect`) as props, and pass on what used to be `event.detail`. Never `createEventDispatcher`
4. **Snippets, not slots:** content is `children`; a named part is a snippet prop (`footerRight`), rendered with `{@render footerRight?.()}`
5. **Type-only TypeScript:** `<script lang="ts">` with a `Props` interface; nothing that emits code (no `enum`), so the compiler strips it with no preprocessor
6. **Bindable props have no fallback:** `value = $bindable()`, with the default handled where it's read (`value ?? 0`). A fallback throws when a parent binds a variable that is still `undefined`
7. **Write a prop before calling the parent back:** `value = next; onchange?.(next)`. Written after, while the parent passes an expression (`isOpen={panel !== null}`) and has just changed it, the prop stops following the parent (Svelte 5.35+)

## Component Template

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FocusEventHandler, MouseEventHandler } from 'svelte/elements';

  interface Props {
    variant?: 'default' | 'secondary';
    disabled?: boolean;
    class?: string;
    children?: Snippet;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    onfocus?: FocusEventHandler<HTMLButtonElement>;
    onblur?: FocusEventHandler<HTMLButtonElement>;
  }

  let {
    variant = 'default',
    disabled = false,
    class: className = '',
    children,
    onclick,
    onfocus,
    onblur,
  }: Props = $props();
</script>

<button
  type="button"
  class="component {variant} {className}"
  class:disabled
  {disabled}
  {onclick}
  {onfocus}
  {onblur}
>
  {@render children?.()}
</button>

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

Named icons are exported from `src/icons.ts` and exposed through the package's dedicated `./icons` entrypoint.

### Named icon exports

```javascript
import { Icon } from 'figma-ui3-kit-svelte';
import { IconBack, IconSettings } from 'figma-ui3-kit-svelte/icons';
```

### Direct icon imports

```javascript
import { Icon } from 'figma-ui3-kit-svelte';
import IconClose from './../../icons/24/icon.24.close.svg';
import Icon16Check from './../../icons/16/icon.16.check.svg';
```

If you add a new icon, export it from `src/icons.ts` rather than adding it to `src/index.ts`.

```svelte
<Icon iconName={IconClose} color="--figma-color-icon" />
```

## Adding Components

1. Create `/src/components/ComponentName/index.svelte`
2. Add to `/src/index.ts` (alphabetical order)
3. Create `ComponentName.stories.js`
4. A type plugins need, such as an item's shape, goes in `src/types.ts`, re-exported with `export type` from `src/index.ts` so plugins import it from the package root. Not in a component's module script: a plugin's `tsc` can't read types out of a `.svelte` file
5. Update README.md and CHANGELOG.md

## Removing Components

Remove completely (no deprecation warnings):

1. Delete component directory
2. Remove from `/src/index.ts`
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
npm run lint     # svelte-check (strict), ESLint and Prettier
npm run format   # Format
```

